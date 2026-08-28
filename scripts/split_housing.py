import json, re, sys
from pathlib import Path
REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = REPO_ROOT / "content" / "generated" / "housing-english-v1.md"
SCENARIOS_OUT = REPO_ROOT / "content" / "scenarios" / "housing-english-v1.json"
VOCAB_OUT = REPO_ROOT / "content" / "vocabulary" / "housing-english-v1.json"
def clean_obj(obj):
    if isinstance(obj, dict): return {str(k).strip(): clean_obj(v) for k, v in obj.items()}
    elif isinstance(obj, list): return [clean_obj(i) for i in obj]
    elif isinstance(obj, str): return obj.strip()
    return obj
def main():
    source = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_SOURCE
    text = source.read_text(encoding="utf-8").replace("\\_", "_").replace("\\-", "-").replace("\\[", "[").replace("\\]", "]")
    start, end = text.find("{"), text.rfind("}")
    if start == -1 or end == -1: return print("No JSON.")
    json_str = re.sub(r',\s*([\]}])', r'\1', text[start:end+1])
    try: data = json.loads(json_str)
    except json.JSONDecodeError as e: return print(f"Fail: {e}")
    data = clean_obj(data)
    SCENARIOS_OUT.parent.mkdir(parents=True, exist_ok=True); VOCAB_OUT.parent.mkdir(parents=True, exist_ok=True)
    SCENARIOS_OUT.write_text(json.dumps(data.get("scenarios", []), indent=2, ensure_ascii=False), encoding="utf-8")
    VOCAB_OUT.write_text(json.dumps(data.get("vocabulary", []), indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"SUCCESS: {len(data.get('scenarios', []))} scenarios, {len(data.get('vocabulary', []))} vocab.")
if __name__ == "__main__": main()