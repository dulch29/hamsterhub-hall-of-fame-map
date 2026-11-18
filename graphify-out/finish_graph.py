"""Merge, diagnose, cluster, label, export, and audit the graphify build."""
import copy
import json
import re
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

from build_graph import ROOT, OUT, SPEC, EXCLUDES, digest, read, write


class UnknownCount:
    def __format__(self, spec):
        return "unknown"


def assemble():
    from graphify.cache import save_semantic_cache
    from graphify.build import build_from_json
    from graphify.cluster import cluster, score_all
    from graphify.analyze import god_nodes, surprising_connections, suggest_questions
    from graphify.diagnostics import diagnose_extraction, format_diagnostic_report
    from graphify.export import to_json

    ast = read(".graphify_ast.json")
    sem = read(".graphify_semantic.json")
    expected = set(read(".graphify_detect.json")["files"]["document"])
    if set(sem["coverage"]) != expected:
        raise ValueError("Semantic coverage does not match detected document corpus")
    for full, count in sem["coverage"].items():
        actual = len((OUT / "source-snapshot" / Path(full).relative_to(ROOT)).read_text(encoding="utf-8").splitlines())
        if count != actual:
            raise ValueError(f"Document changed or partially read: {full}")
    stamped = read("source-snapshot.json")
    drift = []
    for rel, recorded in stamped["files"].items():
        path = ROOT / rel
        if not path.is_file() or digest(path) != recorded["sha256"]:
            drift.append(rel)
    write("source-drift.json", {"changed_since_detection": drift})
    if drift:
        print("Live sources changed after capture; exporting captured snapshot:", drift)

    for e in ast["edges"]:
        if "confidence_score" not in e and e.get("confidence") == "EXTRACTED":
            e["confidence_score"] = 1.0
    ids = {n["id"] for n in ast["nodes"]}
    extraction = {
        "nodes": ast["nodes"] + [n for n in sem["nodes"] if n["id"] not in ids],
        "edges": ast["edges"] + sem["edges"],
        "hyperedges": sem["hyperedges"],
        "input_tokens": None, "output_tokens": None,
        "usage_status": "unknown", "semantic_backend": "host-session",
    }
    write("extraction.json", extraction)
    diagnostic = diagnose_extraction(copy.deepcopy(extraction), directed=False, root=ROOT)
    write("health.json", diagnostic)
    (OUT / "GRAPH_HEALTH.txt").write_text(format_diagnostic_report(diagnostic), encoding="utf-8")
    print(format_diagnostic_report(diagnostic))
    graph = build_from_json(extraction, root=ROOT, directed=False)
    if not graph.number_of_nodes():
        raise ValueError("Empty graph; refusing to export")
    communities = cluster(graph)
    cohesion = score_all(graph, communities)
    gods = god_nodes(graph)
    surprises = surprising_connections(graph, communities)
    analysis = {
        "communities": communities, "cohesion": cohesion, "gods": gods,
        "surprises": surprises,
    }
    write(".graphify_analysis.json", analysis)
    preview = {}
    for cid, members in communities.items():
        ranked = sorted(members, key=lambda n: graph.degree(n), reverse=True)
        preview[cid] = {
            "size": len(members), "cohesion": cohesion[cid],
            "labels": [graph.nodes[n].get("label", n) for n in ranked[:14]],
        }
    write("community-preview.json", preview)
    if not to_json(graph, communities, str(OUT / "graph.json"),
                   original_links=extraction["edges"]):
        raise ValueError("Graph export shrink guard refused output")
    stable_expected = {p for p in expected if Path(p).relative_to(ROOT).as_posix() not in drift}
    saved = save_semantic_cache(
        sem["nodes"], sem["edges"], sem["hyperedges"], root=ROOT,
        allowed_source_files=list(stable_expected), prompt_file=SPEC,
    )
    print("Cached semantic files:", saved)
    print(json.dumps(preview, indent=2, ensure_ascii=False))


def finalize():
    from graphify.build import build_from_json
    from graphify.analyze import suggest_questions
    from graphify.export import to_json, to_html
    from graphify.report import generate
    from graphify.detect import save_manifest, detect
    from graphify.cli import _stamped_manifest_files
    import networkx as nx

    extraction = read("extraction.json")
    detection = read(".graphify_detect.json")
    analysis = read(".graphify_analysis.json")
    communities = {int(k): v for k, v in analysis["communities"].items()}
    cohesion = {int(k): v for k, v in analysis["cohesion"].items()}
    labels = {int(k): v for k, v in read(".graphify_labels.json").items()}
    graph = build_from_json(extraction, root=ROOT, directed=False)
    questions = suggest_questions(graph, communities, labels)
    if not to_json(graph, communities, str(OUT / "graph.json"),
                   community_labels=labels, original_links=extraction["edges"]):
        raise ValueError("Graph export shrink guard refused output")
    if not to_html(graph, communities, str(OUT / "graph.html"), community_labels=labels):
        raise ValueError("HTML export failed")

    snapshot = read("source-snapshot.json")
    current = detect(ROOT, extra_excludes=EXCLUDES, cache_root=ROOT)
    current_paths = {
        Path(f).relative_to(ROOT).as_posix()
        for paths in current["files"].values() for f in paths
        if not set(Path(f).relative_to(ROOT).parts).intersection(EXCLUDES)
    }
    captured_paths = set(snapshot["files"])
    drift = [p for p, info in snapshot["files"].items()
             if not (ROOT / p).is_file() or digest(ROOT / p) != info["sha256"]]
    added = sorted(current_paths - captured_paths)
    removed = sorted(captured_paths - current_paths)
    health = read("health.json")
    warnings = []
    for k, label in [
        ("dangling_endpoint_edges", "dangling endpoint edges"),
        ("missing_endpoint_edges", "missing endpoint edges"),
        ("self_loop_edges", "self loops"),
        ("undirected_same_endpoint_collapsed_edges", "relationships collapse in the undirected analysis graph"),
    ]:
        if health.get(k):
            warnings.append(f"{health[k]} {label}")
    structural_limits = [
        "scripts/generate-mock.ts", "src/main.tsx",
        "src/mock/generate.test.ts", "vite.config.ts",
        "src/data/prepareKids.test.ts", "src/ui/links.test.ts",
    ]
    provenance = {
        **read("build-config.json"),
        "completed_at": datetime.now(timezone.utc).isoformat(),
        "source_snapshot": "source-snapshot.json",
        "source_snapshot_cutoff": snapshot["started_at"],
        "source_snapshot_copies": "source-snapshot/",
        "extraction": "extraction.json",
        "coverage": "coverage.json",
        "health": "health.json",
        "semantic_files_read_completely": len(read(".graphify_semantic.json")["coverage"]),
        "semantic_chunks": 2,
        "structural_nodes": len(read(".graphify_ast.json")["nodes"]),
        "semantic_nodes": len(read(".graphify_semantic.json")["nodes"]),
        "nodes": graph.number_of_nodes(),
        "analysis_edges": graph.number_of_edges(),
        "exported_relationship_records": len(read("graph.json")["links"]),
        "hyperedges": len(graph.graph.get("hyperedges", [])),
        "communities": len(communities),
        "connected_components": nx.number_connected_components(graph),
        "isolated_nodes": list(nx.isolates(graph)),
        "warnings": warnings,
        "ast_files_without_symbols": structural_limits,
        "source_changes_at_completion": drift,
        "source_files_added_after_detection": added,
        "source_files_removed_after_detection": removed,
        "application_tests": "not run; graph generation only",
        "browser_verification": "not performed; HTML artifact generated and statically checked",
        "git_commit": None,
        "model": "inherited host session; no overrides",
        "benchmark": "heuristic graphify benchmark; not a measured provider token-cost reduction",
        "health_interpretation": (
            "Analysis and visualization use a simple undirected graph. "
            "graph.json preserves the original relationship list and declares "
            "multigraph=true when needed; extraction.json retains raw provenance."
        ),
        "scope": "Only graphify-out writes. No app tests or duplicate architecture review.",
        "semantic_cache_limitation": "Code-origin semantic bridges are preserved in extraction but not cached with the document-only semantic cache.",
    }
    write("provenance.json", provenance)
    write("coverage.json", {
        "backend": "host-session", "complete": True,
        "files": read(".graphify_semantic.json")["coverage"],
        "note": "Complete read coverage records exposure to source, not exhaustive extraction of every statement.",
    })
    data = read("graph.json")
    data["graph"]["provenance"] = provenance
    write("graph.json", data)
    report = generate(
        graph, communities, cohesion, labels, analysis["gods"], analysis["surprises"],
        detection, {"input": UnknownCount(), "output": UnknownCount()}, str(ROOT),
        suggested_questions=questions,
    )
    audit = [
        "## Build provenance and limitations", "",
        f"- Corpus: {detection['total_files']} files, {detection.get('total_words')} detected words; "
        f"{len(detection['files']['code'])} code and {len(detection['files']['document'])} documents.",
        f"- Graphify package 0.9.93; skill 0.9.100. Used the installed package's Python APIs, with no upgrade.",
        "- Structural extraction: graphify AST. Semantic extraction: host session; no callable extraction-subagent tool was available. No API key used or requested.",
        "- Host token usage: **unknown**. Monetary/token cost: **unknown**. AST extraction itself makes no LLM request. No usage estimate is presented as actual usage.",
        f"- All {len(detection['files']['document'])} detected documents were read completely. Extraction is selective and does not imply every sentence became a node.",
        "- Source hashes and per-document line coverage are in source-snapshot.json and coverage.json. Node/edge source locations and confidence labels are preserved.",
        f"- Simple undirected analysis: {graph.number_of_edges()} edges. JSON export: {len(data['links'])} original relationship records; parallel relationships are retained with multigraph metadata.",
        f"- Hyperedges: {provenance['hyperedges']}; connected components: {provenance['connected_components']}; isolated nodes: {len(provenance['isolated_nodes'])}.",
        "- Raw directional endpoints remain in extraction.json and graph.json. Community analysis and HTML are undirected; do not read a shortest path as a causal dependency chain.",
        "- Plan nodes, review requests, templates, historical checks, and current code have separate provenance/status attributes. A plan or historical successful check is not proof of implemented behavior.",
        "- AST yielded file nodes but no symbols for: " + ", ".join(structural_limits) + ". These files have incomplete structural detail.",
        "- Excluded node_modules/, dist/, .agent-exchanges/ raw source copies, graphify-out/, and .git/; no sensitive files were reported by detection.",
        "- Code symbol extraction is not a full TypeScript compiler analysis; callback calls, dynamic behavior, and UI runtime behavior may be missing.",
        "- No application tests, production security checks, or architecture review were performed. HTML was generated and statically validated; interactive browser behavior was not tested.",
        "- No Git revision was available. This is a source-hash snapshot taken while other work may proceed.",
        "- Code-origin semantic bridges are retained in extraction.json; the document-only semantic cache does not cache those bridges.",
    ]
    if warnings:
        audit += ["", "**Graph health warnings:**"] + [f"- {w}." for w in warnings]
    else:
        audit += ["- Graph health: no dangling or missing endpoints, self loops, or collapsed relationships detected."]
    if drift or added or removed:
        audit += ["", "**Concurrent source changes at completion:**",
                  f"- Changed captured files: {drift or 'none'}.",
                  f"- Added files outside the snapshot: {added or 'none'}.",
                  f"- Removed files: {removed or 'none'}.",
                  "- The graph describes the captured snapshot, not later edits."]
    else:
        audit += ["- Final source-hash check found no changes to captured files or supported file additions/removals."]
    report += "\n\n" + "\n".join(audit) + "\n"
    (OUT / "GRAPH_REPORT.md").write_text(report, encoding="utf-8")
    write("cost.json", {
        "runs": [{"date": provenance["completed_at"], "input_tokens": None,
                  "output_tokens": None, "cost": None, "usage_status": "unknown",
                  "backend": "host-session", "files": detection["total_files"]}],
        "total_input_tokens": None, "total_output_tokens": None, "total_cost": None,
        "note": "Host tool usage counts were unavailable; no token costs invented.",
    })
    stamped = _stamped_manifest_files(detection["files"], extraction, ROOT)
    changed_abs = {str(ROOT / f) for f in drift}
    for kind in stamped:
        stamped[kind] = [p for p in stamped[kind] if p not in changed_abs]
    save_manifest(stamped, root=ROOT,
                  scan_corpus={f for paths in detection["files"].values() for f in paths},
                  clear_semantic=changed_abs or None)
    # Static validation of graph artifacts, separate from application testing.
    ids = {n["id"] for n in data["nodes"]}
    assert len(ids) == len(data["nodes"])
    assert all(e["source"] in ids and e["target"] in ids for e in data["links"])
    assert all("confidence_score" in e for e in data["links"])
    assert all(n["community_name"] == labels[n["community"]] for n in data["nodes"])
    assert all(set(h["nodes"]) <= ids for h in data["hyperedges"])
    html = (OUT / "graph.html").read_text(encoding="utf-8")
    assert "<html" in html.lower() and "</html>" in html.lower()
    assert "unknown" in report and "God Nodes" in report
    write("validation.json", {
        "status": "passed",
        "checks": ["JSON parses", "unique node IDs", "edge endpoints exist",
                   "confidence scores present", "community labels agree",
                   "hyperedge members exist", "HTML document generated",
                   "report records unknown usage"],
        "artifact_bytes": {f: (OUT / f).stat().st_size for f in
                           ["graph.html", "graph.json", "GRAPH_REPORT.md"]},
        "source_drift": drift, "source_additions": added, "source_removals": removed,
    })
    print(json.dumps(provenance, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    {"assemble": assemble, "finalize": finalize}[sys.argv[1]]()
