"""Reproducible graphify pipeline; all writes are confined to graphify-out."""
import hashlib
import importlib.metadata
import json
import os
import re
import sys
import shutil
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "graphify-out"
SPEC = Path(r"C:\Users\NCS\.codex\skills\graphify\references\extraction-spec.md")
EXCLUDES = ["node_modules", "dist", ".agent-exchanges", "graphify-out", ".git"]
os.chdir(ROOT)
sys.dont_write_bytecode = True


def write(name, value):
    (OUT / name).write_text(
        json.dumps(value, indent=2, ensure_ascii=False), encoding="utf-8"
    )


def read(name):
    return json.loads((OUT / name).read_text(encoding="utf-8"))


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def prepare():
    from graphify.detect import detect
    from graphify.cache import check_semantic_cache
    from graphify.extract import extract

    OUT.mkdir(exist_ok=True)
    (OUT / ".graphify_python").write_text(sys.executable, encoding="utf-8")
    (OUT / ".graphify_root").write_text(str(ROOT), encoding="utf-8")
    write("build-config.json", {
        "root": str(ROOT), "excludes": EXCLUDES, "gitignore": True,
        "directed": False, "semantic_backend": "host-session",
        "subagents_used": 0, "subagents_available": False,
        "token_usage": "unknown", "token_cost": "unknown",
        "graphify_version": importlib.metadata.version("graphifyy"),
        "skill_version": "0.9.100",
        "extraction_spec": str(SPEC), "extraction_spec_sha256": digest(SPEC),
    })
    detection = detect(ROOT, extra_excludes=EXCLUDES, cache_root=ROOT)
    # Enforce exclusions independently of installed-version glob semantics.
    for kind, paths in detection["files"].items():
        detection["files"][kind] = [
            p for p in paths
            if not set(Path(p).relative_to(ROOT).parts).intersection(EXCLUDES)
        ]
    detection["total_files"] = sum(map(len, detection["files"].values()))
    write(".graphify_detect.json", detection)
    snapshot = {}
    snapshot_root = OUT / "source-snapshot"
    for kind, paths in detection["files"].items():
        for p in paths:
            path = Path(p)
            rel = path.relative_to(ROOT)
            captured = snapshot_root / rel
            captured.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(path, captured)
            snapshot[path.relative_to(ROOT).as_posix()] = {
                "sha256": digest(captured), "category": kind,
                "bytes": captured.stat().st_size,
                "lines": len(captured.read_text(encoding="utf-8", errors="replace").splitlines()),
            }
    write("source-snapshot.json", {
        "started_at": datetime.now(timezone.utc).isoformat(), "files": snapshot,
    })
    docs = [p for k in ("document", "paper", "image")
            for p in detection["files"].get(k, [])]
    cn, ce, ch, uncached = check_semantic_cache(
        docs, root=ROOT, prompt_file=SPEC
    )
    write(".graphify_cached.json", {"nodes": cn, "edges": ce, "hyperedges": ch})
    write("semantic-worklist.json", uncached)
    code = [snapshot_root / Path(p).relative_to(ROOT) for p in detection["files"].get("code", [])]
    ast = extract(code, root=snapshot_root, cache_root=ROOT) if code else {"nodes": [], "edges": []}
    write(".graphify_ast.json", ast)
    print(json.dumps({
        "files": detection["total_files"], "words": detection.get("total_words"),
        "categories": {k: len(v) for k, v in detection["files"].items() if v},
        "skipped_sensitive": detection.get("skipped_sensitive", []),
        "semantic_cache_hits": len(docs) - len(uncached),
        "semantic_uncached": len(uncached),
        "ast_nodes": len(ast["nodes"]), "ast_edges": len(ast["edges"]),
    }, indent=2))


if __name__ == "__main__":
    prepare()
