#!/usr/bin/env python3
"""
buildLocationHierarchy.py
Extracts the official All-India Administrative Hierarchy (31 States, 507 Districts,
4,740 Sub-districts, and 451,900 Villages) from `india_admin_hierarchy.xlsx`
and compiles clean, partitioned JSON files for the SAATHI frontend & backend.
"""

import os
import re
import json
import openpyxl

SOURCE_EXCEL = "C:/Users/Dell/Downloads/india_admin_hierarchy.xlsx"
OUTPUT_DIR = "frontend/public/data/locations"
DISTRICTS_DIR = os.path.join(OUTPUT_DIR, "districts")

def slugify(text: str) -> str:
    """Convert text to safe filename slug."""
    text = text.lower().strip()
    text = re.sub(r'[^a-z0-9]+', '_', text)
    return text.strip('_')

def load_known_pincodes() -> dict:
    """Extract known village PIN codes from repository files."""
    pincodes = {}
    master_files = [
        "backend/src/domain/location/indiaGeographicMaster.ts",
        "backend/src/domain/location/allIndiaLocationsData.ts"
    ]
    for filepath in master_files:
        if os.path.exists(filepath):
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            # Match canonicalName / name and pincode
            matches = re.findall(r"(?:canonicalName|name):\s*['\"]([^'\"]+)['\"][^}]+?pincode:\s*['\"](\d{6})['\"]", content)
            for name, pin in matches:
                pincodes[name.strip().lower()] = pin
    print(f"Loaded {len(pincodes)} known village PIN codes from master files.")
    return pincodes

def main():
    if not os.path.exists(SOURCE_EXCEL):
        print(f"Error: Source file {SOURCE_EXCEL} not found!")
        return

    os.makedirs(DISTRICTS_DIR, exist_ok=True)
    known_pincodes = load_known_pincodes()

    print(f"Loading workbook: {SOURCE_EXCEL} ...")
    wb = openpyxl.load_workbook(SOURCE_EXCEL, read_only=True)
    sheet = wb.active

    states_set = set()
    districts_by_state = {} # state -> set of districts
    district_data = {}      # (state, district) -> { subdistricts: { sd: [] }, pincodes: {} }

    count = 0
    for row in sheet.iter_rows(values_only=True):
        count += 1
        if count == 1:
            continue
        
        st, dist, subdist, vil = row
        if not st:
            continue
        
        st = str(st).strip().title()
        dist = str(dist).strip().title() if dist else "General"
        subdist = str(subdist).strip().title() if subdist else "General"
        vil = str(vil).strip().title() if vil else ""

        states_set.add(st)
        if st not in districts_by_state:
            districts_by_state[st] = set()
        districts_by_state[st].add(dist)

        dist_key = (st, dist)
        if dist_key not in district_data:
            district_data[dist_key] = {
                "state": st,
                "district": dist,
                "subdistricts": {},
                "pincodes": {}
            }
        
        d_entry = district_data[dist_key]
        if subdist not in d_entry["subdistricts"]:
            d_entry["subdistricts"][subdist] = []
        
        if vil:
            d_entry["subdistricts"][subdist].append(vil)
            vil_lower = vil.lower()
            if vil_lower in known_pincodes:
                d_entry["pincodes"][vil] = known_pincodes[vil_lower]

    wb.close()
    print(f"Parsed {count} rows.")
    print(f"Found {len(states_set)} states and {len(district_data)} district partitions.")

    # 1. Save states.json
    sorted_states = sorted(list(states_set))
    states_payload = [
        {"id": slugify(s), "name": s}
        for s in sorted_states
    ]
    with open(os.path.join(OUTPUT_DIR, "states.json"), "w", encoding="utf-8") as f:
        json.dump(states_payload, f, indent=2, ensure_ascii=False)
    print(f"Saved {len(states_payload)} states to {OUTPUT_DIR}/states.json")

    # 2. Save districts.json (State -> list of districts)
    districts_payload = {
        s: sorted(list(districts_by_state[s]))
        for s in sorted_states
    }
    with open(os.path.join(OUTPUT_DIR, "districts.json"), "w", encoding="utf-8") as f:
        json.dump(districts_payload, f, indent=2, ensure_ascii=False)
    print(f"Saved districts map to {OUTPUT_DIR}/districts.json")

    # 3. Save individual district village chunks
    saved_chunks = 0
    for (st, dist), data in district_data.items():
        # Sort villages inside each subdistrict
        for sd in data["subdistricts"]:
            data["subdistricts"][sd] = sorted(list(set(data["subdistricts"][sd])))
        
        slug = f"{slugify(st)}_{slugify(dist)}.json"
        chunk_path = os.path.join(DISTRICTS_DIR, slug)
        with open(chunk_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False)
        saved_chunks += 1

    print(f"Successfully generated {saved_chunks} district chunks in {DISTRICTS_DIR}")
    print("Complete location hierarchy extraction complete!")

if __name__ == "__main__":
    main()
