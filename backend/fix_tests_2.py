from pathlib import Path

# Fix test_api_scenarios.py
p1 = Path("tests/test_api_scenarios.py")
t1 = p1.read_text(encoding="utf-8")
t1 = t1.replace('assert len(body["scenarios"]) == 40', 'assert len(body["scenarios"]) == 50')
t1 = t1.replace('assert len(restored.json()["scenarios"]) == 40', 'assert len(restored.json()["scenarios"]) == 50')
p1.write_text(t1, encoding="utf-8")

# Fix test_content_french.py
p2 = Path("tests/test_content_french.py")
t2 = p2.read_text(encoding="utf-8")
t2 = t2.replace('assert sum(1 for s in seeds if s.target_language.startswith("en")) == 40', 'assert sum(1 for s in seeds if s.target_language.startswith("en")) == 50')
p2.write_text(t2, encoding="utf-8")

print("Final 3 tests patched!")