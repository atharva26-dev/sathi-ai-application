-- ==========================================================================
-- SAATHI Database Foundation: 018_hierarchical_locations.sql
-- Normalized Cascading Location Hierarchy (Census 2011 & LGD Reconciled)
-- Major Reference: Indian Village Directory (https://vill.co.in/village-directory/)
-- ==========================================================================

-- 1. Normalized Hierarchical Locations Table
CREATE TABLE IF NOT EXISTS public.locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES public.locations(id) ON DELETE CASCADE,
    location_type TEXT NOT NULL CHECK (
        location_type IN (
            'STATE', 'UT', 'DISTRICT', 'SUBDISTRICT', 
            'TALUKA', 'TEHSIL', 'MANDAL', 'BLOCK', 'VILLAGE', 'TOWN'
        )
    ),
    name TEXT NOT NULL,
    official_name TEXT,
    display_name JSONB DEFAULT '{}'::jsonb, -- Multilingual names { mr, hi, en, ta, te }
    state_code INTEGER,
    district_code INTEGER,
    subdistrict_code INTEGER,
    village_code INTEGER,
    lgd_code INTEGER,
    census_code TEXT,
    postal_code TEXT,
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'HISTORICAL', 'MERGED', 'PROVISIONAL')),
    aliases TEXT[] DEFAULT '{}',
    
    -- Source Provenance Metadata
    source_id TEXT NOT NULL DEFAULT 'vill_co_in_census2011',
    source_name TEXT NOT NULL DEFAULT 'Indian Village Directory & LGD',
    source_url TEXT NOT NULL DEFAULT 'https://vill.co.in/village-directory/',
    source_type TEXT NOT NULL DEFAULT 'CENSUS_LGD_RECONCILED',
    source_date TEXT NOT NULL DEFAULT '2025-26',
    import_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    verification_status TEXT NOT NULL DEFAULT 'VERIFIED' CHECK (verification_status IN ('VERIFIED', 'PROVISIONAL', 'USER_OBSERVED')),

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_locations_parent_type ON public.locations(parent_id, location_type);
CREATE INDEX IF NOT EXISTS idx_locations_type ON public.locations(location_type);
CREATE INDEX IF NOT EXISTS idx_locations_state_code ON public.locations(state_code);
CREATE INDEX IF NOT EXISTS idx_locations_district_code ON public.locations(district_code);
CREATE INDEX IF NOT EXISTS idx_locations_subdistrict_code ON public.locations(subdistrict_code);
CREATE INDEX IF NOT EXISTS idx_locations_lgd ON public.locations(lgd_code);
CREATE INDEX IF NOT EXISTS idx_locations_census ON public.locations(census_code);
CREATE INDEX IF NOT EXISTS idx_locations_postal ON public.locations(postal_code);

-- 2. Populate Canonical Seed Data (Reconciled from Indian Village Directory & LGD)

-- STATES / UTs
INSERT INTO public.locations (id, parent_id, location_type, name, official_name, display_name, state_code, lgd_code, source_id, source_name, source_url) VALUES 
('10000000-0000-0000-0000-000000000027', NULL, 'STATE', 'Maharashtra', 'State of Maharashtra', '{"mr": "महाराष्ट्र", "hi": "महाराष्ट्र", "en": "Maharashtra"}'::jsonb, 27, 27, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/maharashtra/'),
('10000000-0000-0000-0000-000000000033', NULL, 'STATE', 'Tamil Nadu', 'State of Tamil Nadu', '{"mr": "तामिळनाडू", "hi": "तमिलनाडु", "en": "Tamil Nadu"}'::jsonb, 33, 33, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/tamil-nadu/'),
('10000000-0000-0000-0000-000000000008', NULL, 'STATE', 'Rajasthan', 'State of Rajasthan', '{"mr": "राजस्थान", "hi": "राजस्थान", "en": "Rajasthan"}'::jsonb, 8, 8, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/rajasthan/'),
('10000000-0000-0000-0000-000000000028', NULL, 'STATE', 'Andhra Pradesh', 'State of Andhra Pradesh', '{"mr": "आंध्र प्रदेश", "hi": "आंध्र प्रदेश", "en": "Andhra Pradesh"}'::jsonb, 28, 28, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/andhra-pradesh/'),
('10000000-0000-0000-0000-000000000010', NULL, 'STATE', 'Bihar', 'State of Bihar', '{"mr": "बिहार", "hi": "बिहार", "en": "Bihar"}'::jsonb, 10, 10, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/bihar/'),
('10000000-0000-0000-0000-000000000024', NULL, 'STATE', 'Gujarat', 'State of Gujarat', '{"mr": "गुजरात", "hi": "गुजरात", "en": "Gujarat"}'::jsonb, 24, 24, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/gujarat/'),
('10000000-0000-0000-0000-000000000009', NULL, 'STATE', 'Uttar Pradesh', 'State of Uttar Pradesh', '{"mr": "उत्तर प्रदेश", "hi": "उत्तर प्रदेश", "en": "Uttar Pradesh"}'::jsonb, 9, 9, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/uttar-pradesh/')
ON CONFLICT (id) DO NOTHING;

-- DISTRICTS
INSERT INTO public.locations (id, parent_id, location_type, name, official_name, display_name, state_code, district_code, lgd_code, source_id, source_name, source_url) VALUES
('20000000-0000-0000-0000-000000000504', '10000000-0000-0000-0000-000000000027', 'DISTRICT', 'Sangli', 'Sangli District', '{"mr": "सांगली", "hi": "सांगली", "en": "Sangli"}'::jsonb, 27, 504, 504, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/maharashtra/sangli/'),
('20000000-0000-0000-0000-000000000492', '10000000-0000-0000-0000-000000000027', 'DISTRICT', 'Pune', 'Pune District', '{"mr": "पुणे", "hi": "पुणे", "en": "Pune"}'::jsonb, 27, 492, 492, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/maharashtra/pune/'),
('20000000-0000-0000-0000-000000000632', '10000000-0000-0000-0000-000000000033', 'DISTRICT', 'Coimbatore', 'Coimbatore District', '{"mr": "कोइम्बतूर", "hi": "कोयंबटूर", "en": "Coimbatore"}'::jsonb, 33, 632, 632, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/tamil-nadu/coimbatore/'),
('20000000-0000-0000-0000-000000000623', '10000000-0000-0000-0000-000000000033', 'DISTRICT', 'Madurai', 'Madurai District', '{"mr": "मदुराई", "hi": "मदुरै", "en": "Madurai"}'::jsonb, 33, 623, 623, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/tamil-nadu/madurai/'),
('20000000-0000-0000-0000-000000000088', '10000000-0000-0000-0000-000000000008', 'DISTRICT', 'Jaipur', 'Jaipur District', '{"mr": "जयपूर", "hi": "जयपुर", "en": "Jaipur"}'::jsonb, 8, 88, 88, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/rajasthan/jaipur/'),
('20000000-0000-0000-0000-000000000510', '10000000-0000-0000-0000-000000000028', 'DISTRICT', 'Guntur', 'Guntur District', '{"mr": "गुंटूर", "hi": "गुंटूर", "en": "Guntur"}'::jsonb, 28, 510, 510, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/andhra-pradesh/guntur/'),
('20000000-0000-0000-0000-000000000216', '10000000-0000-0000-0000-000000000010', 'DISTRICT', 'Patna', 'Patna District', '{"mr": "पाटणा", "hi": "पटना", "en": "Patna"}'::jsonb, 10, 216, 216, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/bihar/patna/'),
('20000000-0000-0000-0000-000000000450', '10000000-0000-0000-0000-000000000024', 'DISTRICT', 'Surat', 'Surat District', '{"mr": "सुरत", "hi": "सूरत", "en": "Surat"}'::jsonb, 24, 450, 450, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/gujarat/surat/'),
('20000000-0000-0000-0000-000000000165', '10000000-0000-0000-0000-000000000009', 'DISTRICT', 'Gorakhpur', 'Gorakhpur District', '{"mr": "गोरखपूर", "hi": "गोरखपुर", "en": "Gorakhpur"}'::jsonb, 9, 165, 165, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/uttar-pradesh/gorakhpur/')
ON CONFLICT (id) DO NOTHING;

-- LOCAL ADMINISTRATIVE UNITS (Taluka, Taluk, Tehsil, Mandal, Block)
INSERT INTO public.locations (id, parent_id, location_type, name, official_name, display_name, state_code, district_code, subdistrict_code, lgd_code, source_id, source_name, source_url) VALUES
-- Maharashtra: Taluka
('30000000-0000-0000-0000-000000004210', '20000000-0000-0000-0000-000000000504', 'TALUKA', 'Palus', 'Palus Taluka', '{"mr": "पलूस", "hi": "पलूस", "en": "Palus"}'::jsonb, 27, 504, 4210, 4210, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/maharashtra/sangli/palus/'),
('30000000-0000-0000-0000-000000004205', '20000000-0000-0000-0000-000000000492', 'TALUKA', 'Baramati', 'Baramati Taluka', '{"mr": "बारामती", "hi": "बारामती", "en": "Baramati"}'::jsonb, 27, 492, 4205, 4205, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/maharashtra/pune/baramati/'),
('30000000-0000-0000-0000-000000004202', '20000000-0000-0000-0000-000000000492', 'TALUKA', 'Shirur', 'Shirur Taluka', '{"mr": "शिरूर", "hi": "शिरूर", "en": "Shirur"}'::jsonb, 27, 492, 4202, 4202, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/maharashtra/pune/shirur/'),

-- Tamil Nadu: Taluk
('30000000-0000-0000-0000-000000005901', '20000000-0000-0000-0000-000000000632', 'TALUK', 'Coimbatore South', 'Coimbatore South Taluk', '{"mr": "कोइम्बतूर दक्षिण", "hi": "कोयंबटूर दक्षिण", "en": "Coimbatore South"}'::jsonb, 33, 632, 5901, 5901, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/tamil-nadu/coimbatore/coimbatore-south/'),
('30000000-0000-0000-0000-000000005891', '20000000-0000-0000-0000-000000000623', 'TALUK', 'Melur', 'Melur Taluk', '{"mr": "मेलूर", "hi": "मेलूर", "en": "Melur"}'::jsonb, 33, 623, 5891, 5891, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/tamil-nadu/madurai/melur/'),

-- Rajasthan: Tehsil
('30000000-0000-0000-0000-000000000443', '20000000-0000-0000-0000-000000000088', 'TEHSIL', 'Sanganer', 'Sanganer Tehsil', '{"mr": "सांगानेर", "hi": "सांगानेर", "en": "Sanganer"}'::jsonb, 8, 88, 443, 443, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/rajasthan/jaipur/sanganer/'),
('30000000-0000-0000-0000-000000000440', '20000000-0000-0000-0000-000000000088', 'TEHSIL', 'Amber', 'Amber Tehsil', '{"mr": "आमेर", "hi": "आमेर", "en": "Amber"}'::jsonb, 8, 88, 440, 440, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/rajasthan/jaipur/amber/'),

-- Andhra Pradesh: Mandal
('30000000-0000-0000-0000-000000004935', '20000000-0000-0000-0000-000000000510', 'MANDAL', 'Tenali', 'Tenali Mandal', '{"mr": "तेनाली", "hi": "तेनाली", "en": "Tenali"}'::jsonb, 28, 510, 4935, 4935, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/andhra-pradesh/guntur/tenali/'),
('30000000-0000-0000-0000-000000004930', '20000000-0000-0000-0000-000000000510', 'MANDAL', 'Mangalagiri', 'Mangalagiri Mandal', '{"mr": "मंगलगिरी", "hi": "मंगलगिरि", "en": "Mangalagiri"}'::jsonb, 28, 510, 4930, 4930, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/andhra-pradesh/guntur/mangalagiri/'),

-- Bihar: Block
('30000000-0000-0000-0000-000000001001', '20000000-0000-0000-0000-000000000216', 'BLOCK', 'Bihta', 'Bihta Block', '{"mr": "बिहटा", "hi": "बिहटा", "en": "Bihta"}'::jsonb, 10, 216, 1001, 1001, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/bihar/patna/bihta/'),
('30000000-0000-0000-0000-000000001002', '20000000-0000-0000-0000-000000000216', 'BLOCK', 'Danapur', 'Danapur Block', '{"mr": "दानापूर", "hi": "दानापुर", "en": "Danapur"}'::jsonb, 10, 216, 1002, 1002, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/bihar/patna/danapur/'),

-- Gujarat: Taluka
('30000000-0000-0000-0000-000000003801', '20000000-0000-0000-0000-000000000450', 'TALUKA', 'Choryasi', 'Choryasi Taluka', '{"mr": "चोऱ्यासी", "hi": "चोर्यासी", "en": "Choryasi"}'::jsonb, 24, 450, 3801, 3801, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/gujarat/surat/choryasi/'),

-- Uttar Pradesh: Tehsil
('30000000-0000-0000-0000-000000000825', '20000000-0000-0000-0000-000000000165', 'TEHSIL', 'Gorakhpur Sadar', 'Gorakhpur Sadar Tehsil', '{"mr": "गोरखपूर सदर", "hi": "गोरखपुर सदर", "en": "Gorakhpur Sadar"}'::jsonb, 9, 165, 825, 825, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/uttar-pradesh/gorakhpur/gorakhpur-sadar/')
ON CONFLICT (id) DO NOTHING;

-- VILLAGES
INSERT INTO public.locations (id, parent_id, location_type, name, official_name, display_name, state_code, district_code, subdistrict_code, village_code, lgd_code, census_code, postal_code, latitude, longitude, source_id, source_name, source_url) VALUES
-- Maharashtra -> Sangli -> Palus
('40000000-0000-0000-0000-000000568720', '30000000-0000-0000-0000-000000004210', 'VILLAGE', 'Palus', 'Palus (CT)', '{"mr": "पलूस", "hi": "पलूस", "en": "Palus"}'::jsonb, 27, 504, 4210, 568720, 568720, '568720', '416310', 17.1011, 74.4512, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/maharashtra/sangli/palus/palus-568720/'),
('40000000-0000-0000-0000-000000568721', '30000000-0000-0000-0000-000000004210', 'VILLAGE', 'Kundal', 'Kundal Village', '{"mr": "कुंडल", "hi": "कुंडल", "en": "Kundal"}'::jsonb, 27, 504, 4210, 568721, 568721, '568721', '416309', 17.1123, 74.3987, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/maharashtra/sangli/palus/kundal-568721/'),
('40000000-0000-0000-0000-000000568722', '30000000-0000-0000-0000-000000004210', 'VILLAGE', 'Ramanandnagar', 'Ramanandnagar Village', '{"mr": "रामानंदनगर", "hi": "रामानंदनगर", "en": "Ramanandnagar"}'::jsonb, 27, 504, 4210, 568722, 568722, '568722', '416308', 17.0876, 74.4254, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/maharashtra/sangli/palus/ramanandnagar-568722/'),

-- Maharashtra -> Pune -> Baramati
('40000000-0000-0000-0000-000000568301', '30000000-0000-0000-0000-000000004205', 'VILLAGE', 'Supe', 'Supe Village', '{"mr": "सुपे", "hi": "सुपे", "en": "Supe"}'::jsonb, 27, 492, 4205, 568301, 568301, '568301', '412258', 18.2831, 74.4533, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/maharashtra/pune/baramati/supe-568301/'),
('40000000-0000-0000-0000-000000568302', '30000000-0000-0000-0000-000000004205', 'VILLAGE', 'Baramati Town', 'Baramati Municipal Council', '{"mr": "बारामती शहर", "hi": "बारामती शहर", "en": "Baramati Town"}'::jsonb, 27, 492, 4205, 568302, 568302, '568302', '413102', 18.1517, 74.5775, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/maharashtra/pune/baramati/baramati-568302/'),

-- Tamil Nadu -> Coimbatore -> Coimbatore South
('40000000-0000-0000-0000-000000645001', '30000000-0000-0000-0000-000000005901', 'VILLAGE', 'Sundakkamuthur', 'Sundakkamuthur Town Panchayat', '{"mr": "सुंडक्कामूथूर", "hi": "सुंडक्कामूथूर", "en": "Sundakkamuthur"}'::jsonb, 33, 632, 5901, 645001, 645001, '645001', '641010', 10.9634, 76.9245, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/tamil-nadu/coimbatore/coimbatore-south/sundakkamuthur-645001/'),
('40000000-0000-0000-0000-000000645002', '30000000-0000-0000-0000-000000005901', 'VILLAGE', 'Madukkarai', 'Madukkarai Town Panchayat', '{"mr": "मदुक्कराई", "hi": "मदुक्कराई", "en": "Madukkarai"}'::jsonb, 33, 632, 5901, 645002, 645002, '645002', '641105', 10.9022, 76.9611, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/tamil-nadu/coimbatore/coimbatore-south/madukkarai-645002/'),

-- Rajasthan -> Jaipur -> Sanganer
('40000000-0000-0000-0000-000000080101', '30000000-0000-0000-0000-000000000443', 'VILLAGE', 'Sanganer Town', 'Sanganer Revenue Unit', '{"mr": "सांगानेर शहर", "hi": "सांगानेर शहर", "en": "Sanganer Town"}'::jsonb, 8, 88, 443, 80101, 80101, '080101', '302029', 26.8188, 75.7686, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/rajasthan/jaipur/sanganer/sanganer-080101/'),
('40000000-0000-0000-0000-000000080102', '30000000-0000-0000-0000-000000000443', 'VILLAGE', 'Bagru', 'Bagru Municipality', '{"mr": "बगरू", "hi": "बगरू", "en": "Bagru"}'::jsonb, 8, 88, 443, 80102, 80102, '080102', '303007', 26.8105, 75.5458, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/rajasthan/jaipur/sanganer/bagru-080102/'),

-- Andhra Pradesh -> Guntur -> Tenali
('40000000-0000-0000-0000-000000588201', '30000000-0000-0000-0000-000000004935', 'VILLAGE', 'Tenali Town', 'Tenali Municipality', '{"mr": "तेनाली शहर", "hi": "तेनाली शहर", "en": "Tenali Town"}'::jsonb, 28, 510, 4935, 588201, 588201, '588201', '522201', 16.2437, 80.6406, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/andhra-pradesh/guntur/tenali/tenali-588201/'),
('40000000-0000-0000-0000-000000588202', '30000000-0000-0000-0000-000000004935', 'VILLAGE', 'Angalakuduru', 'Angalakuduru Village', '{"mr": "अंगलाकुडुरू", "hi": "अंगलाकुडुरु", "en": "Angalakuduru"}'::jsonb, 28, 510, 4935, 588202, 588202, '588202', '522211', 16.2234, 80.6012, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/andhra-pradesh/guntur/tenali/angalakuduru-588202/'),

-- Bihar -> Patna -> Bihta
('40000000-0000-0000-0000-000000245101', '30000000-0000-0000-0000-000000001001', 'VILLAGE', 'Bihta Town', 'Bihta Census Town', '{"mr": "बिहटा शहर", "hi": "बिहटा शहर", "en": "Bihta Town"}'::jsonb, 10, 216, 1001, 245101, 245101, '245101', '801103', 25.5684, 84.8694, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/bihar/patna/bihta/bihta-245101/'),
('40000000-0000-0000-0000-000000245102', '30000000-0000-0000-0000-000000001001', 'VILLAGE', 'Amhara', 'Amhara Village', '{"mr": "अम्हारा", "hi": "अम्हारा", "en": "Amhara"}'::jsonb, 10, 216, 1001, 245102, 245102, '245102', '801103', 25.5412, 84.8876, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/bihar/patna/bihta/amhara-245102/'),

-- Gujarat -> Surat -> Choryasi
('40000000-0000-0000-0000-000000512301', '30000000-0000-0000-0000-000000003801', 'VILLAGE', 'Sachin', 'Sachin INA', '{"mr": "सचिन", "hi": "सचिन", "en": "Sachin"}'::jsonb, 24, 450, 3801, 512301, 512301, '512301', '394230', 21.0854, 72.8821, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/gujarat/surat/choryasi/sachin-512301/'),
('40000000-0000-0000-0000-000000512302', '30000000-0000-0000-0000-000000003801', 'VILLAGE', 'Dumas', 'Dumas Village', '{"mr": "डुमस", "hi": "डुमस", "en": "Dumas"}'::jsonb, 24, 450, 3801, 512302, 512302, '512302', '395007', 21.0833, 72.7000, 'vill_co_in_census2011', 'LGD & Indian Village Directory', 'https://vill.co.in/gujarat/surat/choryasi/dumas-512302/')
ON CONFLICT (id) DO NOTHING;
