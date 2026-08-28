import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]


def to_repo_path(value: str) -> Path:
    path = Path(value)
    return path if path.is_absolute() else REPO_ROOT / path


def clean_obj(obj):
    if isinstance(obj, dict):
        return {str(k).strip(): clean_obj(v) for k, v in obj.items()}

    if isinstance(obj, list):
        return [clean_obj(item) for item in obj]

    if isinstance(obj, str):
        return obj.strip()

    return obj


def main() -> None:
    if len(sys.argv) < 4:
        print(
            "Usage: python scripts/split_pack.py "
            "<source.md> <scenarios-out.json> <vocab-out.json>"
        )
        return

    source = to_repo_path(sys.argv[1])
    scenarios_out = to_repo_path(sys.argv[2])
    vocab_out = to_repo_path(sys.argv[3])

    if not source.exists():
        print(f"Missing source file: {source}")
        return

    text = source.read_text(encoding="utf-8")
    text = (
        text.replace("\\_", "_")
        .replace("\\-", "-")
        .replace("\\[", "[")
        .replace("\\]", "]")
        .replace("\\*", "*")
        .replace("\\#", "#")
    )

    start = text.find("{")
    end = text.rfind("}")

    if start == -1 or end == -1:
        print("No JSON object found.")
        return

    json_str = text[start : end + 1]
    json_str = re.sub(r",\s*([\]}])", r"\1", json_str)

    try:
        data = json.loads(json_str)
    except json.JSONDecodeError as exc:
        print(f"JSON parse failed: {exc}")
        print(f"Near: {json_str[max(0, exc.pos - 80):exc.pos + 80]}")
        return

    data = clean_obj(data)

    scenarios = data.get("scenarios", [])
    vocabulary = data.get("vocabulary", [])

    if not isinstance(scenarios, list) or not isinstance(vocabulary, list):
        print("Expected top-level 'scenarios' and 'vocabulary' arrays.")
        return

    scenarios_out.parent.mkdir(parents=True, exist_ok=True)
    vocab_out.parent.mkdir(parents=True, exist_ok=True)

    scenarios_out.write_text(
        json.dumps(scenarios, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    vocab_out.write_text(
        json.dumps(vocabulary, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )

    print(
        f"SUCCESS: Wrote {len(scenarios)} scenarios "
        f"and {len(vocabulary)} vocab cards."
    )


if __name__ == "__main__":
    main()