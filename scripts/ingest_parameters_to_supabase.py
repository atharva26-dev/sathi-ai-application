#!/usr/bin/env python3
"""
ingest_parameters_to_supabase.py

Comprehensive ETL pipeline that:
1. Ingests Circlewise Rainfall 2026 PDF into `circle_rainfall_records`.
2. Ingests 713 All-India Districts from `district-level-infrastructure.csv` into `district_intelligence`.
3. Streams Census 2011 Village Release Excel (`DH_2011_DCHB_Village_Release_2700.xlsx`)
   to extract spatial distances (subdistrict HQ, district HQ, nearest statutory town, area, SC/ST pop).
4. Streams and merges Mission Antyodaya 2020 village datasets:
   - Village Level Infrastructure
   - Village Agriculture Report
   - Village Basic Facilities
   - Village Housing Report
5. Merges into unified records with rainfall status and HCES 2022-23 benchmarks.
6. Uploads to Supabase `village_intelligence` in batch requests using REST API with service role key.
7. Saves a consolidated local snapshot for lightning-fast backend fallback.
"""

import os
import csv
import json
import time
import urllib.request
import urllib.error
import pypdf
import openpyxl

PARAMS_DIR = r"c:\Users\Dell\Documents\sathi\parameters"
SUPABASE_URL = "https://jgiosdiqonkmjyhfrfgq.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnaW9zZGlxb25rbWp5aGZyZmdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODI3NDE5NiwiZXhwIjoyMTAzODUwMTk2fQ.jzqHFgdA9cvqCtUDO7dQe4xWZlFukldZnx8AX7rrWlE"
LOCAL_CACHE_PATH = r"c:\Users\Dell\Documents\sathi\backend\src\ai\knowledge\villageIntelligenceIndex.json"

def to_bool(val):
    if val is None:
        return False
    v = str(val).strip().lower()
    return v in ('true', 'yes', '1', 'y', 'available')

def to_int(val, default=0):
    if val is None:
        return default
    try:
        cleaned = str(val).strip().replace(',', '')
        if not cleaned or cleaned.lower() == 'none' or cleaned.lower() == 'null':
            return default
        return int(float(cleaned))
    except Exception:
        return default

def to_float(val, default=0.0):
    if val is None:
        return default
    try:
        cleaned = str(val).strip().replace(',', '')
        if not cleaned or cleaned.lower() == 'none' or cleaned.lower() == 'null':
            return default
        return float(cleaned)
    except Exception:
        return default

def supabase_upsert(table_name, records, batch_size=500):
    """Upsert records into Supabase in batches."""
    url = f"{SUPABASE_URL}/rest/v1/{table_name}"
    total = len(records)
    inserted = 0

    for i in range(0, total, batch_size):
        chunk = records[i:i + batch_size]
        data = json.dumps(chunk).encode('utf-8')
        req = urllib.request.Request(
            url,
            data=data,
            method='POST',
            headers={
                'apikey': SERVICE_KEY,
                'Authorization': f'Bearer {SERVICE_KEY}',
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates'
            }
        )
        try:
            with urllib.request.urlopen(req) as resp:
                inserted += len(chunk)
                if i % 2000 == 0 or inserted == total:
                    print(f"[{table_name}] Progress: {inserted}/{total} rows synced (HTTP {resp.status})")
        except urllib.error.HTTPError as e:
            err_msg = e.read().decode('utf-8', errors='replace')
            print(f"[{table_name}] HTTP Error on batch {i}: {e.code} - {err_msg[:200]}")
        except Exception as ex:
            print(f"[{table_name}] Error on batch {i}: {ex}")

    return inserted

def parse_circlewise_rainfall():
    """Extracts revenue circle rainfall stats from Circlewise_Rainfall_Season_2026.pdf."""
    pdf_path = os.path.join(PARAMS_DIR, "Circlewise_Rainfall_Season_2026.pdf")
    if not os.path.exists(pdf_path):
        print(f"Rainfall PDF not found at {pdf_path}")
        return {}, []

    print(f"Parsing Rainfall PDF: {pdf_path} ...")
    reader = pypdf.PdfReader(pdf_path)
    records = []
    circle_lookup = {}

    for p_idx, page in enumerate(reader.pages):
        raw_text = page.extract_text()
        lines = [l.strip() for l in raw_text.split('\n') if l.strip()]

        i = 0
        while i < len(lines):
            # Check if line is a circle number
            if lines[i].isdigit() and i + 16 < len(lines):
                try:
                    seq_num = int(lines[i])
                    circle_name = lines[i+1]
                    # June
                    june_normal = to_float(lines[i+2])
                    june_actual = to_float(lines[i+3])
                    # July
                    july_normal = to_float(lines[i+5])
                    july_actual = to_float(lines[i+6])
                    # August
                    aug_normal = to_float(lines[i+8])
                    aug_actual = to_float(lines[i+9])
                    # September
                    sep_normal = to_float(lines[i+11])
                    sep_actual = to_float(lines[i+12])
                    # Cumulative
                    cum_normal = to_float(lines[i+14])
                    cum_actual = to_float(lines[i+15])
                    cum_pct = to_float(lines[i+16])

                    status = "Normal"
                    if cum_pct >= 120:
                        status = "Excess"
                    elif cum_pct < 80:
                        status = "Deficient"

                    rec = {
                        "circle_name": circle_name,
                        "june_actual_mm": june_actual,
                        "july_actual_mm": july_actual,
                        "august_actual_mm": aug_actual,
                        "september_actual_mm": sep_actual,
                        "cumulative_actual_mm": cum_actual,
                        "cumulative_normal_mm": cum_normal,
                        "departure_percent": round(cum_pct - 100.0, 2),
                        "season_year": 2026
                    }
                    records.append(rec)
                    circle_lookup[circle_name.lower()] = {
                        "circle_name": circle_name,
                        "actual_mm": cum_actual,
                        "normal_mm": cum_normal,
                        "departure_pct": round(cum_pct - 100.0, 2),
                        "status": status
                    }
                    i += 17
                    continue
                except Exception:
                    pass
            i += 1

    print(f"Extracted {len(records)} revenue circle rainfall records.")
    return circle_lookup, records

def parse_district_infrastructure():
    """Parses 713 All-India Districts from district-level-infrastructure.csv."""
    csv_path = os.path.join(PARAMS_DIR, "district-level-infrastructure.csv")
    if not os.path.exists(csv_path):
        print(f"District CSV not found: {csv_path}")
        return []

    print(f"Parsing District Infrastructure: {csv_path} ...")
    records = []
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for r in reader:
            rec = {
                "id": str(r.get("id", "")),
                "year": to_int(r.get("year", "2020")),
                "state_name": r.get("state_name", ""),
                "state_code": str(r.get("state_code", "")),
                "district_name": r.get("district_name", ""),
                "district_code": str(r.get("district_code", "")),
                "villages_surveyed": to_int(r.get("villages_surveyed", 0)),
                "tot_pop": to_int(r.get("tot_pop", 0)),
                "pop_male": to_int(r.get("pop_male", 0)),
                "pop_female": to_int(r.get("pop_female", 0)),
                "tot_hh": to_int(r.get("tot_hh", 0)),
                "bank": to_int(r.get("bank", 0)),
                "atm": to_int(r.get("atm", 0)),
                "internet_bb": to_int(r.get("internet_bb", 0)),
                "all_weather_road": to_int(r.get("all_weather_road", 0)),
                "elec_msme": to_int(r.get("elec_msme", 0)),
                "mandi": to_int(r.get("mandi", 0)),
                "reg_mkt": to_int(r.get("reg_mkt", 0)),
                "weekly_haat": to_int(r.get("weekly_haat", 0)),
                "chc": to_int(r.get("chc", 0)),
                "phc": to_int(r.get("phc", 0)),
                "vocational": to_int(r.get("vocational", 0))
            }
            records.append(rec)

    print(f"Parsed {len(records)} All-India district records.")
    return records

def parse_census_dchb_spatial_metrics():
    """Extracts village distances to subdistrict HQ, district HQ, town, area, SC/ST from DCHB Excel."""
    excel_path = os.path.join(PARAMS_DIR, "DH_2011_DCHB_Village_Release_2700.xlsx")
    if not os.path.exists(excel_path):
        print(f"Excel file not found: {excel_path}")
        return {}

    print(f"Streaming Census 2011 DCHB Excel ({excel_path}) for spatial distances...")
    t0 = time.time()
    wb = openpyxl.load_workbook(excel_path, read_only=True)
    sheet = wb['Village_Data_2700']

    spatial_data = {}
    count = 0
    for r in sheet.iter_rows(values_only=True):
        count += 1
        if count == 1:
            continue

        try:
            vcode = r[6]
            if vcode is None:
                continue
            vcode = int(vcode)

            subdist_dist = to_float(r[14])
            dist_dist = to_float(r[16])
            town_name = str(r[17]).strip() if r[17] else None
            town_dist = to_float(r[18])
            area_ha = to_float(r[23])
            sc_pop = to_int(r[28])
            st_pop = to_int(r[31])

            spatial_data[vcode] = {
                "dist_subdist_km": subdist_dist,
                "dist_dist_km": dist_dist,
                "town_name": town_name if town_name and town_name.lower() != 'none' else None,
                "dist_town_km": town_dist,
                "area_ha": area_ha,
                "sc_pop": sc_pop,
                "st_pop": st_pop
            }
        except Exception:
            continue

    wb.close()
    print(f"Extracted spatial distances for {len(spatial_data)} villages from Census DCHB in {time.time() - t0:.2f}s.")
    return spatial_data

def merge_and_build_village_dataset(circle_lookup, spatial_data):
    """Merges all 4 Antyodaya CSVs with spatial metrics and rainfall to create village_intelligence records."""
    f_infra = os.path.join(PARAMS_DIR, "Village Level Infrastructure_Filtered_Data.csv")
    f_agri = os.path.join(PARAMS_DIR, "Village Agriculture Report_Filtered_Data.csv")
    f_basic = os.path.join(PARAMS_DIR, "Village Basic Facilities_Filtered_Data.csv")
    f_housing = os.path.join(PARAMS_DIR, "Village Housing Report_Filtered_Data.csv")

    print("Loading and indexing Agriculture report...")
    agri_map = {}
    with open(f_agri, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for r in reader:
            vc = to_int(r.get('Village Code (village_code)'))
            if vc:
                agri_map[vc] = {
                    "farm_activity_hhs": to_int(r.get('Farm Activity Households (farm_activity_hhs)')),
                    "non_farm_activity_hhs": to_int(r.get('Non-Farm Activity Households (non_farm_activity_hhs)')),
                    "govt_seed_centres": to_bool(r.get('Government Seed Centres Available (govt_seed_centres)')),
                    "watershed_dev_projects": to_bool(r.get('Watershed Development Projects Available (watershed_dev_projects)')),
                    "community_rainwater_harvesting": to_bool(r.get('Community Rainwater Harvesting Systems Available (community_rainwater_harvesting)')),
                    "farmers_collectives": to_bool(r.get('Farmer Collectives Available (farmers_collectives)')),
                    "food_grain_warehouses": to_bool(r.get('Food Grain Warehouses Available (food_grain_warehouses)')),
                    "primary_processing_facilities": to_bool(r.get('Primary Processing Facilities Available (primary_processing_facilities)')),
                    "custom_hiring_centres": to_bool(r.get('Custom Hiring Centres Available (custom_hiring_centres)'))
                }

    print("Loading and indexing Basic Facilities report...")
    basic_map = {}
    with open(f_basic, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for r in reader:
            vc = to_int(r.get('Village Code (village_code)'))
            if vc:
                basic_map[vc] = {
                    "soil_testing_centre": to_bool(r.get('Soil Testing Centre (soil_testing_centre)')),
                    "fertilizer_shop": to_bool(r.get('Fertilizer Shop (fertilizer_shop)')),
                    "domestic_electricity_hrs": r.get('Domestic Electricity Supply (Hours) (domestic_electricity_hrs)', '')
                }

    print("Loading and indexing Housing report...")
    housing_map = {}
    with open(f_housing, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for r in reader:
            vc = to_int(r.get('Village Code (village_code)'))
            if vc:
                housing_map[vc] = {
                    "kutcha_wall_roof_hhs": to_int(r.get('Kutcha Wall & Roof Households (hh_kutcha_wall_roof)')),
                    "kutcha_wall_roof_percent": to_float(r.get('Kutcha Wall & Roof Households (%) (perct_hh_kutcha_wall_roof)')),
                    "pmay_houses": to_int(r.get('PMAY Houses (pmay_house)')),
                    "pmay_permanent_waitlist": to_int(r.get('PMAY Permanent Waitlist (pmay_permanent_wait_list)'))
                }

    print("Synthesizing primary Village Level Infrastructure...")
    unified_villages = []
    with open(f_infra, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for r in reader:
            vc = to_int(r.get('Village Code (village_code)'))
            if not vc:
                continue

            vname = r.get('Village Name (village_name)', '').strip()
            gp_code = to_int(r.get('Gram Panchayat Code (gp_code)'))
            gp_name = r.get('Gram Panchayat Name (gp_name)', '').strip()
            block_code = to_int(r.get('Block Code (block_code)'))
            block_name = r.get('Block Name (block_name)', '').strip()
            dist_code = to_int(r.get('District Code (district_code)'))
            dist_name = r.get('District Name (district_name)', '').strip()

            tot_pop = to_int(r.get('Total Population (tot_pop)'))
            pop_male = to_int(r.get('Male Population (pop_male)'))
            pop_female = to_int(r.get('Female Population (pop_female)'))
            tot_hh = to_int(r.get('Total Households (tot_hh)'))

            # Spatial & DCHB data
            spatial = spatial_data.get(vc, {})
            dist_subdist = spatial.get("dist_subdist_km")
            dist_dist = spatial.get("dist_dist_km")
            town_name = spatial.get("town_name")
            dist_town = spatial.get("dist_town_km")
            area_ha = spatial.get("area_ha", 0.0)
            sc_pop = spatial.get("sc_pop", 0)
            st_pop = spatial.get("st_pop", 0)

            # Agriculture
            agri = agri_map.get(vc, {})
            # Basic facilities
            basic = basic_map.get(vc, {})
            # Housing
            housing = housing_map.get(vc, {})

            # Electricity hours parsing (e.g. '12-16 hrs' -> 14.0)
            raw_hrs = basic.get('domestic_electricity_hrs') or r.get('Domestic Electricity (elec_domes)', '')
            elec_hrs = 12.0
            if '24' in raw_hrs:
                elec_hrs = 24.0
            elif '16' in raw_hrs or '18' in raw_hrs:
                elec_hrs = 16.0
            elif '12' in raw_hrs:
                elec_hrs = 12.0
            elif '8' in raw_hrs:
                elec_hrs = 8.0
            elif '4' in raw_hrs:
                elec_hrs = 4.0

            # Rainfall proxy matching
            rf_match = None
            if block_name.lower() in circle_lookup:
                rf_match = circle_lookup[block_name.lower()]
            elif vname.lower() in circle_lookup:
                rf_match = circle_lookup[vname.lower()]

            record = {
                "village_code": vc,
                "village_name": vname,
                "gram_panchayat_code": gp_code if gp_code else None,
                "gram_panchayat_name": gp_name,
                "subdistrict_code": block_code if block_code else None,
                "subdistrict_name": block_name,
                "district_code": dist_code,
                "district_name": dist_name,
                "state_code": 27,
                "state_name": "Maharashtra",
                "reference_year": 2020,

                "total_population": tot_pop,
                "male_population": pop_male,
                "female_population": pop_female,
                "total_households": tot_hh,
                "sc_population": sc_pop,
                "st_population": st_pop,
                "geographical_area_hectares": area_ha,

                "distance_to_subdistrict_hq_km": dist_subdist,
                "distance_to_district_hq_km": dist_dist,
                "distance_to_nearest_statutory_town_km": dist_town,
                "nearest_statutory_town_name": town_name,

                "farm_activity_hhs": agri.get("farm_activity_hhs", 0),
                "non_farm_activity_hhs": agri.get("non_farm_activity_hhs", 0),
                "govt_seed_centres": agri.get("govt_seed_centres", False),
                "watershed_dev_projects": agri.get("watershed_dev_projects", False),
                "community_rainwater_harvesting": agri.get("community_rainwater_harvesting", False),
                "farmers_collectives": agri.get("farmers_collectives", False),
                "food_grain_warehouses": agri.get("food_grain_warehouses", False),
                "primary_processing_facilities": agri.get("primary_processing_facilities", False),
                "custom_hiring_centres": agri.get("custom_hiring_centres", False),
                "soil_testing_centre": basic.get("soil_testing_centre", False),
                "fertilizer_shop": basic.get("fertilizer_shop", False),

                "bank_available": to_bool(r.get('Bank (bank)')),
                "bank_distance": r.get('Nearest Bank Distance (bank_distance)', ''),
                "atm_available": to_bool(r.get('ATM (atm)')),
                "bc_w_internet": to_bool(r.get('Business Correspondent with Internet (bc_w_internet)')),
                "internet_broadband": to_bool(r.get('Internet / Broadband Facility (internet_bb)')),
                "all_weather_road": to_bool(r.get('Connected To All Weather Road (all_weather_road)')),
                "internal_pucca_roads": to_bool(r.get('Internal Pucca Roads (Cc/ Brick Road) (cc_road)')),
                "public_transport": to_bool(r.get('Public Transport (pub_trans)')),
                "railway_station": to_bool(r.get('Railway Station (railway)')),
                "common_service_centre": to_bool(r.get('Common Service Centre (csc_avail)')),
                "domestic_electricity_hours": elec_hrs,
                "electricity_msme": to_bool(r.get('Electricity Supply to MSME units (elec_msme)')),
                "market_available": to_bool(r.get('Markets (avl_market)')),
                "piped_tap_water": to_bool(r.get('Piped Tap Water (tap_water)')),
                "telephone_services": to_bool(r.get('Telephone Services (telepone)')),
                "clean_energy_hhs": to_int(r.get('HHs using Clean Energy(LPG/Biogas) (clean_energy_hhs)')),
                "solar_wind_elect": to_bool(r.get('Solar / Wind Energy For Electrification (solar_wind_elect)')),
                "post_office": to_bool(r.get('Post Office / Sub-Post Office (po_sub_po)')),
                "panchayat_bhawan": to_bool(r.get('Panchayat Bhawan (panch_bhawan)')),
                "primary_school": to_bool(r.get('Primary School (prim_school)')),
                "middle_school": to_bool(r.get('Middle School (middle_school)')),
                "high_school": to_bool(r.get('High School (high_school)')),
                "higher_secondary_school": to_bool(r.get('Higher / Secondary School (high_second_school)')),
                "vocational_training_centre": to_bool(r.get('Vocational Educational Centre (vocational)')),
                "subcentre": to_bool(r.get('Sub Centre (subcentre)')),
                "subcentre_distance": r.get('Nearest Sub Centre (subcentre_dist)', ''),
                "veterinary_clinic": to_bool(r.get('Veterinary Clinic Hospital (veterinary)')),
                "veterinary_distance": r.get('Nearest Veterinary Clinic (veterinary_dist)', ''),
                "drainage": to_bool(r.get('Drainage Facilities (drainage)')),

                "kutcha_wall_roof_hhs": housing.get("kutcha_wall_roof_hhs", 0),
                "kutcha_wall_roof_percent": housing.get("kutcha_wall_roof_percent", 0.0),
                "pmay_houses": housing.get("pmay_houses", 0),
                "pmay_permanent_waitlist": housing.get("pmay_permanent_waitlist", 0),

                "rainfall_circle_name": rf_match["circle_name"] if rf_match else None,
                "rainfall_actual_mm": rf_match["actual_mm"] if rf_match else None,
                "rainfall_normal_mm": rf_match["normal_mm"] if rf_match else None,
                "rainfall_departure_pct": rf_match["departure_pct"] if rf_match else None,
                "rainfall_season_status": rf_match["status"] if rf_match else "Normal",

                "rural_mpce_inr": 4002.00,
                "urban_mpce_inr": 6646.00,
                "food_expenditure_pct": 47.30,
                "non_food_expenditure_pct": 52.70
            }
            unified_villages.append(record)

    print(f"Total unified village records assembled: {len(unified_villages)}")
    return unified_villages

def main():
    print("================================================================")
    print("SAATHI: Unified Village & Location Parameters Ingestion Pipeline")
    print("================================================================")
    t_start = time.time()

    # 1. Circlewise Rainfall
    circle_lookup, rainfall_records = parse_circlewise_rainfall()
    if rainfall_records:
        supabase_upsert("circle_rainfall_records", rainfall_records, batch_size=200)

    # 2. All-India District Infrastructure
    district_records = parse_district_infrastructure()
    if district_records:
        supabase_upsert("district_intelligence", district_records, batch_size=300)

    # 3. Census 2011 DCHB spatial metrics
    spatial_data = parse_census_dchb_spatial_metrics()

    # 4. Merge all village parameters
    village_records = merge_and_build_village_dataset(circle_lookup, spatial_data)

    # 5. Ingest into Supabase
    print(f"\nUploading {len(village_records)} village intelligence records to Supabase...")
    supabase_upsert("village_intelligence", village_records, batch_size=500)

    # 6. Save local cache snapshot for backend fast sub-millisecond retrieval
    print(f"\nSaving local index snapshot to {LOCAL_CACHE_PATH}...")
    os.makedirs(os.path.dirname(LOCAL_CACHE_PATH), exist_ok=True)
    # Save a compact village directory for instant memory resolution
    cache_dict = {}
    for v in village_records:
        key = f"{v['village_name'].lower()}_{v['district_name'].lower()}"
        cache_dict[key] = {
            "village_code": v["village_code"],
            "village_name": v["village_name"],
            "taluka": v["subdistrict_name"],
            "district": v["district_name"],
            "tot_pop": v["total_population"],
            "tot_hh": v["total_households"],
            "dist_town_km": v["distance_to_nearest_statutory_town_km"],
            "nearest_town": v["nearest_statutory_town_name"],
            "farm_hhs": v["farm_activity_hhs"],
            "non_farm_hhs": v["non_farm_activity_hhs"],
            "elec_hrs": v["domestic_electricity_hours"],
            "elec_msme": v["electricity_msme"],
            "bank_avl": v["bank_available"],
            "road_avl": v["all_weather_road"],
            "mkt_avl": v["market_available"],
            "rainfall_status": v["rainfall_season_status"]
        }
    with open(LOCAL_CACHE_PATH, "w", encoding="utf-8") as f:
        json.dump(cache_dict, f, ensure_ascii=False)
    print(f"Saved {len(cache_dict)} indexed village entries in local cache.")

    print(f"\nETL Pipeline Completed Successfully in {time.time() - t_start:.2f}s!")

if __name__ == "__main__":
    main()
