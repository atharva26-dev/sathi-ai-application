import os
import re
import json

DISTRICTS_DIR = "frontend/public/data/locations/districts"

def main():
    pincodes = {}
    
    # 1. Parse indiaGeographicMaster.ts
    master_file = "backend/src/domain/location/indiaGeographicMaster.ts"
    if os.path.exists(master_file):
        with open(master_file, 'r', encoding='utf-8') as f:
            content = f.read()
        for m in re.finditer(r"canonicalName:\s*['\"]([^'\"]+)['\"].*?pincode:\s*['\"](\d{6})['\"]", content, re.DOTALL):
            pincodes[m.group(1).strip().lower()] = m.group(2)
        for m in re.finditer(r"name:\s*['\"]([^'\"]+)['\"].*?pincode:\s*['\"](\d{6})['\"]", content, re.DOTALL):
            pincodes[m.group(1).strip().lower()] = m.group(2)

    # 2. Parse allIndiaLocationsData.ts
    data_file = "backend/src/domain/location/allIndiaLocationsData.ts"
    if os.path.exists(data_file):
        with open(data_file, 'r', encoding='utf-8') as f:
            content = f.read()
        for m in re.finditer(r"name:\s*['\"]([^'\"]+)['\"].*?pincode:\s*['\"](\d{6})['\"]", content, re.DOTALL):
            pincodes[m.group(1).strip().lower()] = m.group(2)

    print(f"Extracted {len(pincodes)} known village PIN mappings.")
    print("Sample PIN mappings:", list(pincodes.items())[:15])

    # Inject into each district file
    updated_files = 0
    total_injected = 0
    for fname in os.listdir(DISTRICTS_DIR):
        if not fname.endswith('.json'):
            continue
        fpath = os.path.join(DISTRICTS_DIR, fname)
        with open(fpath, 'r', encoding='utf-8') as fp:
            data = json.load(fp)
        
        file_pins = data.get("pincodes", {})
        subdistricts = data.get("subdistricts", {})
        
        for sd, vils in subdistricts.items():
            for v in vils:
                v_lower = v.lower()
                if v_lower in pincodes:
                    file_pins[v] = pincodes[v_lower]
                    total_injected += 1
                for k, pin in pincodes.items():
                    if len(k) > 3 and (k == v_lower or k in v_lower or v_lower in k):
                        if v not in file_pins:
                            file_pins[v] = pin
                            total_injected += 1
        
        data["pincodes"] = file_pins
        with open(fpath, 'w', encoding='utf-8') as fp:
            json.dump(data, fp, ensure_ascii=False)
        updated_files += 1

    print(f"Updated {updated_files} district files with {total_injected} total PIN code associations.")

if __name__ == "__main__":
    main()
