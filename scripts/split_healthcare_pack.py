import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = REPO_ROOT / "content" / "generated" / "healthcare-english-v1.md"
SCENARIOS_OUT = REPO_ROOT / "content" / "scenarios" / "healthcare-english-v1.json"
VOCAB_OUT = REPO_ROOT / "content" / "vocabulary" / "healthcare-english-v1.json"

def clean_obj(obj):
    if isinstance(obj, dict):
        return {str(k).strip(): clean_obj(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [clean_obj(i) for i in obj]
    elif isinstance(obj, str):
        return obj.strip()
    return obj

def main():
    source = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_SOURCE
    text = source.read_text(encoding="utf-8")
    
    text = text.replace("\\_", "_")
    text = text.replace("\\-", "-")
    text = text.replace("\\[", "[").replace("\\]", "]")
    text = text.replace("\\*", "*")
    text = text.replace("\\#", "#")
    
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1:
        print("No JSON object found.")
        return
        
    json_str = text[start:end+1]
    json_str = re.sub(r',\s*([\]}])', r'\1', json_str)
    
    try:
        data = json.loads(json_str)
    except json.JSONDecodeError as e:
        print(f"JSON parse failed: {e}")
        print(f"Near: {json_str[max(0, e.pos-50):e.pos+50]}")
        return
        
    data = clean_obj(data)
    
    scenarios = data.get("scenarios", [])
    vocabulary = data.get("vocabulary", [])
    
    SCENARIOS_OUT.parent.mkdir(parents=True, exist_ok=True)
    VOCAB_OUT.parent.mkdir(parents=True, exist_ok=True)
    
    SCENARIOS_OUT.write_text(json.dumps(scenarios, indent=2, ensure_ascii=False), encoding="utf-8")
    VOCAB_OUT.write_text(json.dumps(vocabulary, indent=2, ensure_ascii=False), encoding="utf-8")
    
    print(f"SUCCESS: Wrote {len(scenarios)} scenarios and {len(vocabulary)} vocab cards.")

if __name__ == "__main__":
    main()