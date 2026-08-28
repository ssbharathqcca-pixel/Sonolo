from pathlib import Path

FILES = [
    "tests/test_api_scenarios.py",
    "tests/test_content_french.py",
    "tests/test_release_smoke.py",
    "tests/test_vocabulary_materialization.py",
]


def replace_by_context(line: str, old: str, new: str, keywords) -> str:
    lowered = line.lower()
    if old in line and any(keyword in lowered for keyword in keywords):
        return line.replace(old, new)
    return line


for file_name in FILES:
    path = Path(file_name)
    if not path.exists():
        continue

    lines = path.read_text(encoding="utf-8").splitlines()
    updated = []

    for line in lines:
        line = replace_by_context(line, "105", "125", {"scenario", "seeded", "seeds"})
        line = replace_by_context(line, "520", "620", {"vocab", "card"})
        line = replace_by_context(line, "31", "37", {"premium"})
        line = replace_by_context(line, "120", "220", {"french", "fr"})
        line = replace_by_context(line, "25", "45", {"french", "fr", "scenario"})
        updated.append(line)

    path.write_text("\n".join(updated) + "\n", encoding="utf-8")

print("SN-042 count updates applied.")