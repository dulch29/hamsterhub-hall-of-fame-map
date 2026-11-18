"""Host-curated semantic extraction plus deterministic document link extraction.

The concepts and relationships below were selected by the host after reading
the complete detected document corpus. This is not an API or subagent result.
"""
import json
import re
from pathlib import Path
from urllib.parse import unquote

from build_graph import ROOT, OUT, read, write

nodes = []
edges = []
hyperedges = []
lookup = {}
texts = {}
coverage = {}
SNAPSHOT = OUT / "source-snapshot"


def norm(text):
    return re.sub(r"[^\w]", "_", text.casefold())


def stem(rel):
    return norm(str(Path(rel).with_suffix("")).replace("\\", "/"))


def source(rel):
    return str(ROOT / rel)


def locate(rel, needle):
    lines = texts.setdefault(rel, (SNAPSHOT / rel).read_text(encoding="utf-8").splitlines())
    for i, line in enumerate(lines, 1):
        if needle.casefold() in line.casefold():
            return f"L{i}", line.strip()
    raise ValueError(f"Evidence not found: {rel}: {needle}")


def node(rel, key, label, needle, kind="concept", **attrs):
    ident = stem(rel) + "_" + norm(key)
    loc, evidence = locate(rel, needle)
    item = dict(id=ident, label=label, file_type=kind, source_file=source(rel),
                source_location=loc, evidence=evidence, _origin="semantic",
                source_url=None, captured_at=None, author=None, contributor=None,
                **attrs)
    if ident not in lookup:
        nodes.append(item)
        lookup[ident] = item
    return ident


def edge(a, b, rel, file, needle, confidence="EXTRACTED", score=1.0, **attrs):
    loc, evidence = locate(file, needle)
    edges.append(dict(source=a, target=b, relation=rel, confidence=confidence,
                      confidence_score=score, weight=score, source_file=source(file),
                      source_location=loc, evidence=evidence, _origin="semantic", **attrs))


docs = {}
detection = read(".graphify_detect.json")
for full in detection["files"].get("document", []):
    path = Path(full)
    rel = path.relative_to(ROOT).as_posix()
    lines = (SNAPSHOT / rel).read_text(encoding="utf-8").splitlines()
    texts[rel] = lines
    coverage[str(path)] = len(lines)
    title = next((re.sub(r"^#+\s*", "", l) for l in lines if l.startswith("#")), path.name)
    docs[rel] = node(rel, "document", title, lines[0], kind="document")
    lookup[docs[rel]]["document_role"] = (
        "template" if "/templates/" in rel else
        "review_request" if "/tasks/" in rel else
        "historical_review" if "/exchanges/" in rel else
        "requirements" if rel == "Project.md" else
        "plan" if rel.endswith("/plan.md") else "source_document"
    )

# Curated concepts: explicit requirements, unresolved decisions, and mechanisms.
concept_specs = [
    ("project", "Project.md", "hall_of_fame", "Member-only Thailand showcase", "Hall of Fame", "concept", "planned"),
    ("privacy", "Project.md", "province_privacy", "Province-level location privacy", "Province-level location only", "rationale", "required"),
    ("optin", "Project.md", "opt_in", "Opt-in filtering", "Opt-in only", "rationale", "required"),
    ("auth", "Project.md", "member_api", "Server-enforced member API", "Authentication is enforced on the data API", "rationale", "required"),
    ("jitter", "Project.md", "deterministic_jitter", "ID-seeded province anchor jitter", "Jittered pin positions", "concept", "planned"),
    ("consent", "Project.md", "guardian_consent", "Guardian consent collection", "Parental/guardian consent", "concept", "unresolved_owner"),
    ("review", "Project.md", "organization_review", "Organization review before launch", "legal review before launch", "concept", "required"),
    ("contracts", "Project.md", "shared_contract", "Kid Project MapPin contracts", "Data Contract", "concept", "defined"),
    ("manual", "Project.md", "manual_featured", "Manual featured-project selection", "Featured project rule", "concept", "decided"),
    ("newest", "Project.md", "newest_fallback", "Newest-project fallback unconfirmed", "Fallback when unset", "concept", "unconfirmed"),
    ("mocks", "Project.md", "three_mocks", "Three default fictional students", "Exactly 3 placeholder", "concept", "implemented_baseline"),
    ("geometry", "Project.md", "province_geometry", "77-province licensed geometry", "Needs province boundary GeoJSON", "concept", "unselected"),
    ("scene", "Project.md", "instanced_scene", "Instanced 3D map and picking", "instanced", "concept", "planned"),
    ("clusters", "Project.md", "clusters_fanout", "Screen-space clusters and fan-out", "Pins close together on screen", "concept", "planned"),
    ("card", "Project.md", "pin_card", "Pin Card and project/Profile links", "### Pin Card", "concept", "planned"),
    ("list", "Project.md", "accessible_list", "Accessible list and WebGL fallback", "The list view is also", "concept", "planned"),
    ("host", "Project.md", "host_discovery", "Host stack and brand discovery", "Hamsterhub site stack / where", "concept", "unknown"),
    ("perf", "Project.md", "performance_targets", "Provisional performance targets", "Performance Targets", "concept", "provisional"),
    ("release", "Project.md", "real_data_release", "Real-data release gate", "M6 – Real data", "concept", "planned"),
    ("ownership", "Agent.md", "file_ownership", "One writer per assigned file", "One worker owns each writable file", "rationale", "active_rule"),
    ("shared", "Agent.md", "shared_files", "Lead-serialized shared files", "The lead serializes", "concept", "active_rule"),
    ("evidence", "Docs/agents/context.md", "current_evidence", "Current source outranks historical status", "Current source/configuration establishes", "rationale", "active_rule"),
    ("isolation", "Docs/agents/multi-agent.md", "worker_isolation", "Disjoint worker writes and isolation", "disjoint writes", "rationale", "active_rule"),
    ("bridge", "Docs/agents/cli-communication.md", "claude_bridge", "Coordinator-driven Claude review bridge", "coordinator-driven exchange", "concept", "implemented_tool"),
    ("snapshots", "Docs/agents/cli-communication.md", "review_snapshot", "Explicit review context snapshots", "exact context snapshot", "concept", "implemented_tool"),
    ("fixtures", "Docs/00-scaffold/work.md", "edge_fixtures", "Separate opt-out and long-name fixtures", "Add separate opted-out", "concept", "planned_in_document"),
    ("prepared", "Docs/03-data/work.md", "prepared_collection", "Shared filtered and resolved collection", "Build one data-preparation path", "concept", "planned"),
    ("visible", "Docs/03-data/work.md", "project_visibility", "Project visibility adapter boundary", "no visibility field", "concept", "unresolved_interface"),
    ("null", "Docs/03-data/plan.md", "null_selection", "Null for invalid or unset selection", "Use null for unset/invalid", "concept", "required_until_decision"),
    ("failures", "Docs/02-map/plan.md", "scene_failures", "Scene failure and context-loss signals", "Expose initialization errors", "concept", "planned"),
    ("selection", "Docs/04-pin-card/plan.md", "selection_focus", "Shared selection and focus restoration", "Agree the selected-student", "concept", "planned"),
    ("links", "Docs/04-pin-card/plan.md", "safe_links", "Accessible project and Profile anchors", "Centralize link handling", "concept", "planned"),
    ("lazy", "Docs/04-pin-card/work.md", "lazy_thumbnails", "Thumbnails load only on card open", "Load project thumbnails only", "rationale", "required"),
    ("dense", "Docs/05-clustering/plan.md", "dense_fixture", "Explicit dense Bangkok fixture", "Add a dense Bangkok fixture", "concept", "planned"),
    ("pure", "Docs/05-clustering/work.md", "pure_grouping", "Grouping independent of Three.js", "independent of Three.js", "rationale", "required"),
    ("search", "Docs/06-accessibility/work.md", "search_filter", "Combined name search and province filter", "province filtering and name search", "concept", "planned"),
    ("logout", "Docs/07-integration/plan.md", "logout_cache", "Logout and cache data isolation", "Prevent response caches", "rationale", "planned"),
    ("backend", "Docs/07-integration/work.md", "backend_unknown", "Production backend unselected", "Supabase is not a selected dependency", "concept", "unknown"),
    ("withdrawal", "Docs/09-real-data/work.md", "consent_withdrawal", "Consent withdrawal lifecycle", "Support consent withdrawal", "concept", "planned"),
    ("testdiscovery", "Docs/00-scaffold/plan.md", "test_discovery", "Generator-only npm test discovery", "it currently runs only", "concept", "baseline_script"),
    ("reviewresults", "Docs/agents/exchanges/2026-11-17-m1-review.md", "readiness_review", "Recorded M1 readiness findings", "three readiness concerns", "concept", "historical_review"),
    ("fixturetask", "Docs/agents/tasks/003-fixture-implementation-review.md", "fixture_review", "Bounded fixture implementation review", "Proposed change", "concept", "review_request"),
]
concepts = {}
for key, rel, entity, label, needle, kind, status in concept_specs:
    concepts[key] = node(rel, entity, label, needle, kind=kind, status=status)
    edge(docs[rel], concepts[key], "references", rel, needle)
    if kind == "rationale":
        lookup[concepts[key]]["rationale"] = {
            "privacy": "Pins must not identify a minor's home address.",
            "optin": "Student records must not be exposed without explicit opt-in.",
            "auth": "UI hiding cannot enforce membership at the data boundary.",
            "ownership": "One writer per file prevents conflicting concurrent edits.",
            "evidence": "Historical checks and plans do not establish current implementation.",
            "isolation": "Parallel workers need non-overlapping writes and agreed interfaces.",
            "lazy": "Avoid fetching project thumbnails before the card opens.",
            "pure": "Separate clustering calculations so they can be tested without rendering.",
            "logout": "Cached responses and retained state must not expose data after logout.",
        }.get(key, label)

# Each package plan and scope is linked to the requirements it explicitly consumes.
package_concepts = {
    "00-scaffold": ["mocks", "fixtures", "testdiscovery"],
    "01-discovery": ["host", "newest", "consent", "geometry"],
    "02-map": ["geometry", "jitter", "scene", "failures"],
    "03-data": ["prepared", "optin", "manual", "newest", "visible", "null"],
    "04-pin-card": ["card", "selection", "links", "lazy"],
    "05-clustering": ["clusters", "pure", "dense"],
    "06-accessibility": ["list", "search", "optin"],
    "07-integration": ["auth", "backend", "logout", "host"],
    "08-polish": ["perf", "host", "lazy"],
    "09-real-data": ["release", "consent", "auth", "withdrawal", "review"],
}
packages = {}
for folder, keys in package_concepts.items():
    work = f"Docs/{folder}/work.md"
    plan = f"Docs/{folder}/plan.md"
    packages[folder[:2]] = docs[work]
    for rel in (work, plan):
        for key in keys:
            # Host-selected topical mapping; inference rather than fabricated citation.
            if docs[rel] != lookup[concepts[key]]["id"]:
                edge(docs[rel], concepts[key], "conceptually_related_to", rel,
                     texts[rel][0], "INFERRED", 0.85)

# Deterministic explicit Markdown citations, including code references.
ast = read(".graphify_ast.json")
ast_by_file = {}
for item in ast["nodes"]:
    ast_by_file.setdefault(item.get("source_file", "").replace("\\", "/"), []).append(item)
for rel, lines in texts.items():
    if rel not in docs:
        continue
    for lineno, line in enumerate(lines, 1):
        for match in re.finditer(r"(?<!!)\[[^\]]+\]\(([^)]+)\)", line):
            href = unquote(match.group(1).split("#")[0].strip("<>"))
            if not href or "://" in href or href.startswith("mailto:"):
                continue
            target = (ROOT / rel).parent / href
            try:
                dest = target.resolve().relative_to(ROOT).as_posix()
            except ValueError:
                continue
            if dest in docs and dest != rel:
                edge(docs[rel], docs[dest], "references", rel, line)
            elif dest in ast_by_file:
                file_nodes = ast_by_file[dest]
                file_node = next((n for n in file_nodes if n["id"] == stem(dest)), file_nodes[0])
                edge(docs[rel], file_node["id"], "references", rel, line)

# Explicit package dependency statements; direction is retained in raw extraction.
deps = [
    ("02", "03", "Docs/02-map/work.md", "Package 03 supplies"),
    ("04", "03", "Docs/04-pin-card/work.md", "Package 03 resolves"),
    ("04", "02", "Docs/04-pin-card/work.md", "package 02 supplies"),
    ("05", "02", "Docs/05-clustering/work.md", "Package 02 supplies"),
    ("05", "04", "Docs/05-clustering/work.md", "Package 04 displays"),
    ("05", "00", "Docs/05-clustering/work.md", "Package 00 supplies"),
    ("06", "03", "Docs/06-accessibility/plan.md", "Consume package 03"),
    ("06", "04", "Docs/06-accessibility/plan.md", "contract with 04"),
    ("06", "02", "Docs/06-accessibility/plan.md", "package 02"),
    ("07", "01", "Docs/07-integration/work.md", "Package 01 must identify"),
    ("07", "03", "Docs/07-integration/work.md", "Package 03 defines"),
    ("08", "01", "Docs/08-polish/work.md", "Package 01 supplies"),
    ("08", "02", "Docs/08-polish/work.md", "Packages 02, 04, 05, and 06"),
    ("08", "04", "Docs/08-polish/work.md", "Packages 02, 04, 05, and 06"),
    ("08", "05", "Docs/08-polish/work.md", "Packages 02, 04, 05, and 06"),
    ("08", "06", "Docs/08-polish/work.md", "Packages 02, 04, 05, and 06"),
    ("09", "01", "Docs/09-real-data/work.md", "Packages 01, 03, and 07"),
    ("09", "03", "Docs/09-real-data/work.md", "Packages 01, 03, and 07"),
    ("09", "07", "Docs/09-real-data/work.md", "Packages 01, 03, and 07"),
]
for a, b, file, needle in deps:
    edge(packages[a], packages[b], "depends_on", file, needle, status="planned")

relationships = [
    ("privacy", "jitter", "rationale_for", "Project.md", "Jittered pin positions"),
    ("manual", "newest", "conceptually_related_to", "Project.md", "Fallback when unset"),
    ("contracts", "manual", "references", "Project.md", "featuredProjectId"),
    ("mocks", "geometry", "conceptually_related_to", "Project.md", "Place the 3 placeholder"),
    ("prepared", "manual", "references", "Docs/03-data/work.md", "Resolve manual featured"),
    ("prepared", "optin", "references", "Docs/03-data/work.md", "Enforce opt-in filtering"),
    ("prepared", "card", "shares_data_with", "Docs/03-data/plan.md", "same prepared collection"),
    ("prepared", "list", "shares_data_with", "Docs/03-data/plan.md", "same prepared collection"),
    ("prepared", "scene", "shares_data_with", "Docs/03-data/plan.md", "same prepared collection"),
    ("null", "newest", "rationale_for", "Docs/03-data/plan.md", "Use null for unset/invalid"),
    ("failures", "list", "references", "Docs/02-map/plan.md", "signals for package 06"),
    ("selection", "list", "shares_data_with", "Docs/04-pin-card/plan.md", "list selection through 06"),
    ("pure", "clusters", "rationale_for", "Docs/05-clustering/work.md", "independent of Three.js"),
    ("dense", "mocks", "conceptually_related_to", "Docs/05-clustering/plan.md", "current 500-record generator spreads"),
    ("auth", "release", "rationale_for", "Docs/09-real-data/plan.md", "Require package 07"),
    ("consent", "release", "rationale_for", "Docs/09-real-data/work.md", "only after membership and consent"),
    ("withdrawal", "logout", "semantically_similar_to", "Docs/09-real-data/plan.md", "refreshes and caches"),
    ("bridge", "snapshots", "references", "Docs/agents/cli-communication.md", "exact context snapshot"),
    ("ownership", "shared", "rationale_for", "Agent.md", "lead serializes"),
    ("fixtures", "testdiscovery", "conceptually_related_to", "Docs/00-scaffold/plan.md", "When adding tests outside"),
    ("fixturetask", "fixtures", "references", "Docs/agents/tasks/003-fixture-implementation-review.md", "two explicit, deterministic"),
    ("reviewresults", "visible", "references", "Docs/agents/exchanges/2026-11-17-m1-review.md", "visibility"),
]
for a, b, relation, file, needle in relationships:
    inference = relation == "semantically_similar_to"
    edge(concepts[a], concepts[b], relation, file, needle,
         "INFERRED" if inference else "EXTRACTED", 0.75 if inference else 1.0)

# Bridge named contract and implementation symbols using explicit source citations.
bridges = [
    ("contracts", "src_types_kid", "Project.md", "type Kid"),
    ("contracts", "src_types_project", "Project.md", "type Project"),
    ("contracts", "src_types_mappin", "Project.md", "type MapPin"),
    ("contracts", "src_types_provincecode", "Project.md", "ProvinceCode"),
    ("mocks", "src_mock_generate_generatemockkids", "README.md", "default count is 3"),
    ("mocks", "src_mock_generate_default_mock_count", "README.md", "default count is 3"),
    ("bridge", "scripts_claude_review_main", "Docs/agents/cli-communication.md", "scripts/claude-review.mjs"),
    ("testdiscovery", "package_scripts_test", "Docs/00-scaffold/plan.md", "src/mock/generate.test.ts"),
    ("optin", "src_app_kids", "HANDOFF.md", "filters on `showOnMap`"),
    ("manual", "src_mock_generate_generatemockkids", "README.md", "explicitly selected project or null"),
]
ast_ids = {n["id"] for n in ast["nodes"]}
for key, target, file, needle in bridges:
    if target not in ast_ids:
        raise ValueError(f"Missing AST target {target}")
    edge(concepts[key], target, "conceptually_related_to", file, needle, "INFERRED", 0.95,
         interpretation="Documentation-to-implementation symbol mapping; not acceptance verification.")

# Current code added by the main thread, read after refreshing the source snapshot.
for symbol, key, file, needle in [
    ("src_data_preparekids_preparekids", "prepared", "src/data/prepareKids.ts", "export function prepareKids"),
    ("src_data_preparekids_preparekids", "optin", "src/data/prepareKids.ts", "kid.showOnMap !== true"),
    ("src_data_preparekids_preparekids", "null", "src/data/prepareKids.ts", "projects.find"),
    ("src_mock_fixtures_createoptedoutkid", "fixtures", "src/mock/fixtures.ts", "export function createOptedOutKid"),
    ("src_mock_fixtures_createlongnamekid", "fixtures", "src/mock/fixtures.ts", "export function createLongNameKid"),
    ("src_ui_links_safeexternalurl", "links", "src/ui/links.ts", "url.protocol"),
]:
    if symbol in ast_ids:
        edge(symbol, concepts[key], "implements", file, needle,
             interpretation="Implementation relationship observed in source; tests not run by graph extraction.")
edge("src_app_kids", "src_data_preparekids_preparekids", "calls",
     "src/App.tsx", "prepareKids(generateMockKids())")
node("package.json", "explicit_test_suites", "Explicit generator adapter and link test suites",
     '"test":', status="implemented_script")
edge("package_explicit_test_suites", "package_scripts_test", "references",
     "package.json", '"test":')
edge(concepts["testdiscovery"], "package_explicit_test_suites", "conceptually_related_to",
     "Docs/agents/tasks/005-adapter-review.md", "Test discovery explicitly lists",
     interpretation="Historical generator-only documentation superseded by the current script.")
lookup[concepts["testdiscovery"]]["status"] = "historical_baseline_superseded_by_current_package_script"
lookup[concepts["testdiscovery"]]["label"] = "Historical generator-only test discovery"
lookup[concepts["prepared"]]["status"] = "typed_synthetic_adapter_implemented_views_pending"
lookup[concepts["card"]]["status"] = "component_present_in_snapshot_integration_unverified"
for rel, keys in [
    ("Docs/agents/tasks/004-fixtures-and-adapter.md", ["fixtures", "prepared", "visible", "null"]),
    ("Docs/agents/tasks/005-adapter-review.md", ["prepared", "links", "card", "fixtures"]),
]:
    for key in keys:
        edge(docs[rel], concepts[key], "conceptually_related_to", rel, texts[rel][0],
             "INFERRED", 0.85, interpretation="Review packet context, not an independent verification result.")

# Non-obvious cross-cutting mechanisms, beyond direct citation links.
for a, b, file, needle in [
    ("jitter", "pure", "Docs/05-clustering/work.md", "stable student identity"),
    ("ownership", "auth", "Docs/agents/multi-agent.md", "Backend → adapter"),
    ("lazy", "perf", "Docs/08-polish/plan.md", "Verify unopened cards"),
    ("evidence", "snapshots", "Docs/agents/context.md", "code revision/worktree"),
]:
    edge(concepts[a], concepts[b], "semantically_similar_to", file, needle, "INFERRED", 0.75)

for ident, label, keys, file, needle in [
    ("shared_student_data_flow", "Same prepared data across map, card and list",
     ["prepared", "scene", "card", "list"], "Docs/03-data/plan.md", "same prepared collection"),
    ("production_release_prerequisites", "Membership, consent and approved production release",
     ["auth", "consent", "review", "release"], "Docs/09-real-data/work.md", "only after membership and consent"),
    ("shared_student_identity", "Stable identity through jitter, grouping and selection",
     ["jitter", "clusters", "selection"], "Docs/05-clustering/work.md", "stable student identity"),
]:
    loc, evidence = locate(file, needle)
    inferred = ident == "shared_student_identity"
    hyperedges.append(dict(
        id=ident, label=label, nodes=[concepts[k] for k in keys], relation="participate_in",
        confidence="INFERRED" if inferred else "EXTRACTED",
        confidence_score=0.85 if inferred else 1.0, source_file=source(file),
        source_location=loc, evidence=evidence, _origin="semantic",
    ))

# Two bounded batches, with complete per-file coverage and unknown host usage.
doc_paths = sorted(docs)
chunks = [doc_paths[:22], doc_paths[22:]]
for index, files in enumerate(chunks, 1):
    sources = {source(f) for f in files}
    if index == 2:
        sources |= {n["source_file"] for n in nodes if n["source_file"] not in coverage}
        sources |= {e["source_file"] for e in edges if e["source_file"] not in coverage}
    fragment = {
        "nodes": [n for n in nodes if n["source_file"] in sources],
        "edges": [e for e in edges if e["source_file"] in sources],
        "hyperedges": [h for h in hyperedges if h["source_file"] in sources],
        "coverage": {s: coverage[s] for s in sources if s in coverage},
        "input_tokens": None, "output_tokens": None,
        "usage_status": "unknown", "extraction_backend": "host-session",
        "cross_chunk_references": "Resolved against union of both chunks plus AST.",
    }
    write(f".graphify_chunk_{index:02d}.json", fragment)
write(".graphify_semantic.json", {
    "nodes": nodes, "edges": edges, "hyperedges": hyperedges,
    "coverage": coverage, "input_tokens": None, "output_tokens": None,
    "usage_status": "unknown", "extraction_backend": "host-session",
})
write("semantic-concepts.json", concepts)
print(json.dumps({
    "semantic_nodes": len(nodes), "semantic_edges": len(edges),
    "hyperedges": len(hyperedges), "documents_read_completely": len(coverage),
    "chunks": [len(c) for c in chunks], "usage": "unknown",
}, indent=2))
