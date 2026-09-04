import os
import csv
import json
import urllib.request

PARAMS_DIR = r"c:\Users\Dell\Documents\sathi\parameters"
SUPABASE_URL = "https://jgiosdiqonkmjyhfrfgq.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnaW9zZGlxb25rbWp5aGZyZmdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODI3NDE5NiwiZXhwIjoyMTAzODUwMTk2fQ.jzqHFgdA9cvqCtUDO7dQe4xWZlFukldZnx8AX7rrWlE"

# 1. Query existing village codes in Supabase to see what is missing
url = f"{SUPABASE_URL}/rest/v1/village_intelligence?select=village_code"
req = urllib.request.Request(url, headers={'apikey': SERVICE_KEY, 'Authorization': f'Bearer {SERVICE_KEY}', 'Range-Unit': 'items', 'Range': '0-45000'})
existing_codes = set()
with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode('utf-8'))
    for r in data:
        existing_codes.add(r['village_code'])

print(f"Already in Supabase: {len(existing_codes)}")

# 2. Check total unique village codes from CSV
f_infra = os.path.join(PARAMS_DIR, "Village Level Infrastructure_Filtered_Data.csv")
missing_rows = []
seen_codes = set()

with open(f_infra, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for r in reader:
        try:
            vc = int(r.get('Village Code (village_code)', 0))
            if vc and vc not in existing_codes and vc not in seen_codes:
                seen_codes.add(vc)
                missing_rows.append({
                    "village_code": vc,
                    "village_name": r.get('Village Name (village_name)', '').strip(),
                    "gram_panchayat_code": int(r.get('Gram Panchayat Code (gp_code)', 0)) or None,
                    "gram_panchayat_name": r.get('Gram Panchayat Name (gp_name)', '').strip(),
                    "subdistrict_code": int(r.get('Block Code (block_code)', 0)) or None,
                    "subdistrict_name": r.get('Block Name (block_name)', '').strip(),
                    "district_code": int(r.get('District Code (district_code)', 0)),
                    "district_name": r.get('District Name (district_name)', '').strip(),
                    "state_code": 27,
                    "state_name": "Maharashtra",
                    "total_population": int(float(r.get('Total Population (tot_pop)', 0) or 0)),
                    "male_population": int(float(r.get('Male Population (pop_male)', 0) or 0)),
                    "female_population": int(float(r.get('Female Population (pop_female)', 0) or 0)),
                    "total_households": int(float(r.get('Total Households (tot_hh)', 0) or 0)),
                    "bank_available": r.get('Bank (bank)', '').lower() == 'true',
                    "bank_distance": r.get('Nearest Bank Distance (bank_distance)', ''),
                    "atm_available": r.get('ATM (atm)', '').lower() == 'yes',
                    "internet_broadband": r.get('Internet / Broadband Facility (internet_bb)', '').lower() == 'true',
                    "all_weather_road": r.get('Connected To All Weather Road (all_weather_road)', '').lower() == 'true',
                    "domestic_electricity_hours": 14.0,
                    "electricity_msme": r.get('Electricity Supply to MSME units (elec_msme)', '').lower() == 'true',
                    "market_available": r.get('Markets (avl_market)', '').lower() == 'true',
                    "piped_tap_water": r.get('Piped Tap Water (tap_water)', '').lower() == 'true',
                    "rural_mpce_inr": 4002.00,
                    "urban_mpce_inr": 6646.00,
                    "food_expenditure_pct": 47.30,
                    "non_food_expenditure_pct": 52.70
                })
        except Exception:
            pass

print(f"Missing unique villages to upsert: {len(missing_rows)}")

# 3. Upsert missing in batches of 500 with unique keys
batch_size = 500
upsert_url = f"{SUPABASE_URL}/rest/v1/village_intelligence"
synced = 0
for i in range(0, len(missing_rows), batch_size):
    chunk = missing_rows[i:i + batch_size]
    # Ensure no duplicates inside the chunk
    chunk_dict = {row['village_code']: row for row in chunk}
    unique_chunk = list(chunk_dict.values())
    payload = json.dumps(unique_chunk).encode('utf-8')
    req = urllib.request.Request(
        upsert_url,
        data=payload,
        method='POST',
        headers={
            'apikey': SERVICE_KEY,
            'Authorization': f'Bearer {SERVICE_KEY}',
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
        }
    )
    with urllib.request.urlopen(req) as resp:
        synced += len(unique_chunk)
        print(f"Synced {synced}/{len(missing_rows)} missing villages (HTTP {resp.status})")

print("All missing villages fully synced!")
