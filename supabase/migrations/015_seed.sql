-- ==========================================================================
-- SAATHI Database Foundation: 015_seed.sql
-- Production Seed & Realistic Rural Demo Persona Data (Baramati Dairy Enterprise)
-- Note: All demo records are explicitly tagged with is_demo = true or metadata.is_seed = true
-- ==========================================================================

-- --------------------------------------------------------------------------
-- 1. MASTER LOCATIONS (Baramati / Supe / Pune, Maharashtra)
-- --------------------------------------------------------------------------

INSERT INTO public.location_masters (id, country, state, district, block, gram_panchayat, village, postal_code, latitude, longitude, metadata)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'India', 'Maharashtra', 'Pune', 'Baramati', 'Supe Gram Panchayat', 'Supe', '412258', 18.283100, 74.431200, '{"agro_zone":"Western Maharashtra Dry Zone","hub_type":"Dairy & Sugarcane Belt","is_seed":true}'::jsonb),
    ('a0000000-0000-0000-0000-000000000002', 'India', 'Maharashtra', 'Pune', 'Baramati', 'Malegaon Gram Panchayat', 'Malegaon BK', '413115', 18.150000, 74.583300, '{"is_seed":true}'::jsonb),
    ('a0000000-0000-0000-0000-000000000003', 'India', 'Maharashtra', 'Pune', 'Daund', 'Patas Gram Panchayat', 'Patas', '412219', 18.435800, 74.551200, '{"is_seed":true}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- --------------------------------------------------------------------------
-- 2. DATA SOURCES CATALOG (Provenance Tracking)
-- --------------------------------------------------------------------------

INSERT INTO public.data_sources (id, name, source_type, official, url, description, last_verified_at, version, status)
VALUES
    ('b0000000-0000-0000-0000-000000000001', 'KVIC PMEGP Portal', 'GOVERNMENT_CENSUS', true, 'https://www.kviconline.gov.in/pmegp/', 'Official Prime Minister Employment Generation Programme guidelines and subsidy norms.', now(), '2024.1', 'active'),
    ('b0000000-0000-0000-0000-000000000002', 'Maharashtra Dairy Development Board', 'GOVERNMENT_CENSUS', true, 'https://dairy.maharashtra.gov.in', 'District milk procurement volumes, cattle census, and chilling center networks.', now(), '2024.1', 'active'),
    ('b0000000-0000-0000-0000-000000000003', 'SAATHI Rural Market Survey (Baramati Cluster)', 'MARKET_SURVEY', false, 'internal://surveys/baramati-2024', 'Ground surveyed pricing and procurement gaps across 28 roadside highway dhabas and hotels.', now(), '1.0', 'active')
ON CONFLICT (id) DO NOTHING;

-- --------------------------------------------------------------------------
-- 3. LOCALIZED SYSTEM CONTENT ("सोप्या भाषेत समजावून सांगा")
-- --------------------------------------------------------------------------

INSERT INTO public.localized_content (content_key, language, title, body, audio_reference, version)
VALUES
    ('term_emi', 'mr', 'मासिक हप्ता (EMI) म्हणजे काय?', 'बँकेचे कर्ज फेडण्यासाठी दरमहा ठराविक दिवशी दिला जाणारा एकरकमी हप्ता. यात कर्जाचा काही मुद्दल हिस्सा आणि चालू महिन्याचे व्याज एकत्र असते.', 'audio/mr/terms/emi.mp3', '1.0'),
    ('term_emi', 'hi', 'मासिक किश्त (EMI) क्या है?', 'बैंक का लोन चुकाने के लिए हर महीने एक निश्चित तारीख को दी जाने वाली किश्त। इसमें मूलधन का हिस्सा और ब्याज शामिल होता है।', 'audio/hi/terms/emi.mp3', '1.0'),
    ('term_emi', 'en', 'What is Monthly EMI?', 'Equated Monthly Installment is a fixed payment amount made by a borrower to a bank at a specified date each calendar month, combining principal and interest.', 'audio/en/terms/emi.mp3', '1.0'),

    ('term_working_capital', 'mr', 'खेळते भांडवल (Working Capital) म्हणजे काय?', 'व्यवसाय दररोज चालू ठेवण्यासाठी लागणारा पैसा. उदा. रोज शेतकऱ्यांकडून दूध रोख पैशात खरेदी करणे, मजुरी देणे, वीज बिल भरणे.', 'audio/mr/terms/working_capital.mp3', '1.0'),
    ('term_working_capital', 'hi', 'कार्यशील पूंजी (Working Capital) क्या है?', 'दैनिक व्यवसाय संचालन के लिए आवश्यक नकदी। जैसे रोज कच्चा दूध खरीदना, मजदूरी और बिजली बिल का भुगतान।', 'audio/hi/terms/working_capital.mp3', '1.0'),
    ('term_working_capital', 'en', 'What is Working Capital?', 'The operating liquidity needed for day-to-day business operations such as buying raw milk daily and paying wages before customer receivables arrive.', 'audio/en/terms/working_capital.mp3', '1.0'),

    ('term_moratorium', 'mr', 'सवलत काळ (Moratorium) म्हणजे काय?', 'व्यवसाय सुरू केल्यानंतर सुरुवातीचे काही महिने (उदा. ६ महिने) मुद्दल हप्ता न भरता केवळ व्याज भरण्याची बँकेने दिलेली अधिकृत सूट.', 'audio/mr/terms/moratorium.mp3', '1.0'),
    ('term_moratorium', 'hi', 'मोरेटोरियम (सहुलियत अवधि) क्या है?', 'व्यवसाय शुरू होने के शुरुआती महीनों में मूलधन किश्त से मिलने वाली छूट, जिसमें सिर्फ ब्याज देना होता है।', 'audio/hi/terms/moratorium.mp3', '1.0'),
    ('term_moratorium', 'en', 'What is Moratorium Period?', 'A temporary grace period granted by the bank where you do not need to repay the principal loan amount, paying only basic interest.', 'audio/en/terms/moratorium.mp3', '1.0'),

    ('term_margin_money', 'mr', 'स्वतःचे भांडवल (Margin Money) म्हणजे काय?', 'प्रकल्प सुरू करण्यासाठी स्वतःच्या खिशातून घालावयाची १०% ते २५% रक्कम. उरलेली रक्कम बँक कर्ज देते.', 'audio/mr/terms/margin_money.mp3', '1.0'),
    ('term_margin_money', 'hi', 'मार्जिन मनी (खुद की पूंजी) क्या है?', 'प्रोजेक्ट शुरू करने के लिए खुद के पास से लगाई जाने वाली न्यूनतम पूंजी (१०% से २५%)।', 'audio/hi/terms/margin_money.mp3', '1.0'),
    ('term_margin_money', 'en', 'What is Margin Money / Own Equity?', 'The entrepreneur’s personal equity contribution (typically 10% to 25%) required by lending institutions to fund the project.', 'audio/en/terms/margin_money.mp3', '1.0'),

    ('term_break_even', 'mr', 'ना नफा ना तोटा बिंदू (Break-Even) म्हणजे काय?', 'एवढी विक्री ज्यामध्ये सर्व खर्च (दूध, वीज, मजुरी, बँकेचा हप्ता) निघून व्यवसाय शून्यावर येतो. यापुढील सर्व विक्री म्हणजे निव्वळ नफा.', 'audio/mr/terms/break_even.mp3', '1.0'),
    ('term_break_even', 'hi', 'ब्रेक-इवन (Break-Even) क्या है?', 'बिक्री का वह स्तर जहां व्यापार के सारे खर्चे निकल जाते हैं। इसके बाद होने वाली हर बिक्री शुद्ध मुनाफा होती है।', 'audio/hi/terms/break_even.mp3', '1.0'),
    ('term_break_even', 'en', 'What is Break-Even Point?', 'The production/sales volume where total revenue exactly equals total costs, after which every unit sold generates net profit.', 'audio/en/terms/break_even.mp3', '1.0')
ON CONFLICT (content_key, language, version) DO NOTHING;

-- --------------------------------------------------------------------------
-- 4. MASTER SCHEMES & DYNAMIC RULES
-- --------------------------------------------------------------------------

INSERT INTO public.schemes (id, scheme_name, scheme_type, description, authority, official_source_url, status, version, effective_from)
VALUES
    (
        'c0000000-0000-0000-0000-000000000001',
        'PMEGP (Prime Minister Employment Generation Programme)',
        'CAPITAL_SUBSIDY',
        'ग्रामीण व निमशहरी भागात नवीन सूक्ष्म प्रक्रिया उद्योग स्थापन करण्यासाठी २५% ते ३५% शासकीय भांडवली अनुदान.',
        'KVIC / Ministry of MSME, Govt of India',
        'https://www.kviconline.gov.in/pmegp/',
        'active',
        '2024.1',
        '2024-04-01'
    ),
    (
        'c0000000-0000-0000-0000-000000000002',
        'Pradhan Mantri MUDRA Yojana (Kishore Loan)',
        'CREDIT_COLLATERAL_FREE',
        'सूक्ष्म व्यवसायांसाठी ₹५०,००० ते ₹५,००,००० पर्यंत विनातारण खेळते व मुदत कर्ज.',
        'MUDRA Ltd / Department of Financial Services',
        'https://www.mudra.org.in/',
        'active',
        '2024.1',
        '2024-04-01'
    ),
    (
        'c0000000-0000-0000-0000-000000000003',
        'CMEGP (Chief Minister Employment Generation Programme - Maharashtra)',
        'STATE_SUBSIDY',
        'महाराष्ट्रातील ग्रामीण तरुणांसाठी २५% ते ३५% भांडवली अनुदान देणारी राज्य शासन पुरस्कृत योजना.',
        'Directorate of Industries, Maharashtra',
        'https://cmegp.gov.in/',
        'active',
        '2024.1',
        '2024-04-01'
    )
ON CONFLICT (id) DO NOTHING;

-- Scheme Rules
INSERT INTO public.scheme_rules (scheme_id, rule_type, rule_data, priority, version)
VALUES
    (
        'c0000000-0000-0000-0000-000000000001',
        'SUBSIDY_RATE',
        '{"rural_general": 0.25, "rural_special_category": 0.35, "urban_general": 0.15, "urban_special": 0.25}'::jsonb,
        1,
        '2024.1'
    ),
    (
        'c0000000-0000-0000-0000-000000000001',
        'CAPITAL_LIMITS',
        '{"max_manufacturing_cost": 5000000, "max_service_cost": 2000000, "min_own_contribution_general": 0.10, "min_own_contribution_special": 0.05}'::jsonb,
        2,
        '2024.1'
    ),
    (
        'c0000000-0000-0000-0000-000000000002',
        'LOAN_LIMITS',
        '{"min_amount": 50000, "max_amount": 500000, "collateral_required": false, "guarantee_fee": 0}'::jsonb,
        1,
        '2024.1'
    )
ON CONFLICT DO NOTHING;

-- Scheme Mandatory Documents
INSERT INTO public.scheme_documents (scheme_id, document_name, description, mandatory, version)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'Aadhaar Card', 'ओळख व निवासाचा पुरावा', true, '1.0'),
    ('c0000000-0000-0000-0000-000000000001', 'PAN Card', 'बँक खाते व कर पडताळणी', true, '1.0'),
    ('c0000000-0000-0000-0000-000000000001', 'Project Report (DPR)', 'प्रकल्प अहवाल व मशिनरी कोटेशन', true, '1.0'),
    ('c0000000-0000-0000-0000-000000000001', 'Rural Area Certificate', 'ग्रामसेवक / तहसीलदार सहीचा ग्रामीण दाखला', true, '1.0'),
    ('c0000000-0000-0000-0000-000000000001', 'EDP Training Certificate', 'उद्योजकता प्रशिक्षण प्रमाणपत्र (मंजुरीनंतर आवश्यक)', true, '1.0')
ON CONFLICT DO NOTHING;

-- --------------------------------------------------------------------------
-- 5. MASTER LOAN PRODUCTS
-- --------------------------------------------------------------------------

INSERT INTO public.loan_products (id, provider_type, provider_name, product_name, description, interest_rate, interest_type, minimum_amount, maximum_amount, minimum_tenure, maximum_tenure, moratorium, eligibility_summary, status)
VALUES
    (
        'd0000000-0000-0000-0000-000000000001',
        'bank',
        'State Bank of India',
        'SBI Agri-Business MSME Term Loan',
        'दूध प्रक्रिया, पनीर व शीतगृहासाठी सवलतीच्या दरातील मुदत कर्ज.',
        9.5000,
        'REDUCING',
        100000.00,
        2500000.00,
        12,
        84,
        6,
        'ग्रामीण रहिवासी, स्वतःची किमान १०% मार्जिन मनी, व्यवहार्य प्रकल्प अहवाल.',
        'active'
    ),
    (
        'd0000000-0000-0000-0000-000000000002',
        'cooperative',
        'Baramati Sahakari Bank',
        'कृषी पूरक प्रक्रिया उद्योग कर्ज योजना',
        'बारामती परिसरातील स्थानिक दूध प्रक्रिया केंद्रांसाठी त्वरित कर्ज मंजुरी.',
        10.0000,
        'REDUCING',
        50000.00,
        1500000.00,
        12,
        60,
        3,
        'स्थानिक रहिवासी, दुग्ध व्यवसाय अनुभव, २ जामीनदार.',
        'active'
    )
ON CONFLICT (id) DO NOTHING;

-- --------------------------------------------------------------------------
-- 6. REUSABLE MARKET AREA & COMPETITORS (Baramati / Supe Cluster)
-- --------------------------------------------------------------------------

INSERT INTO public.market_areas (id, location_id, radius_km, data_source, source_reference, data_version)
VALUES
    ('e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 10.00, 'SAATHI Rural Market Radar', 'baramati_supe_10km', '1.0')
ON CONFLICT (id) DO NOTHING;

-- Market Indicators
INSERT INTO public.market_indicators (market_area_id, indicator_type, value_numeric, value_text, unit, confidence, data_source)
VALUES
    ('e0000000-0000-0000-0000-000000000001', 'daily_raw_milk_surplus', 14500.00, '१४,५०० लिटर', 'liters/day', 92.00, 'Maharashtra Dairy Development Board'),
    ('e0000000-0000-0000-0000-000000000001', 'highway_dhaba_count', 28.00, '२८ महामार्ग ढाबे व हॉटेल्स', 'count', 95.00, 'Ground Market Survey'),
    ('e0000000-0000-0000-0000-000000000001', 'fresh_paneer_daily_unmet_demand', 420.00, '४२० किलो प्रतिदिन', 'kg/day', 88.00, 'SAATHI AI Market Model')
ON CONFLICT DO NOTHING;

-- Competitor Records
INSERT INTO public.competitor_records (id, market_area_id, category, subcategory, business_name, location_precision, source_type, verified, confidence, price_range, services, known_gaps)
VALUES
    (
        'f0000000-0000-0000-0000-000000000001',
        'e0000000-0000-0000-0000-000000000001',
        'Dairy & Milk Products',
        'Branded Packet Paneer',
        'पुणे पॅकेज्ड ब्रँड वॅन पुरवठादार',
        'DISTRICT',
        'MARKET_SURVEY',
        true,
        90.00,
        '{"min": 360, "max": 400}'::jsonb,
        '["२ दिवसांपूर्वीचे पॅकबंद पनीर", "आठवड्यातून दोनदा पुरवठा"]'::jsonb,
        '["ताजेपणाचा अभाव", "जास्त दर (₹३८०/kg)", "लहान ढाब्यांना वेळेवर डिलिव्हरी नाही"]'::jsonb
    ),
    (
        'f0000000-0000-0000-0000-000000000002',
        'e0000000-0000-0000-0000-000000000001',
        'Dairy & Milk Products',
        'Local Loose Milk Vendor',
        'स्थानिक सुट्टे दूध विक्रेते (३ व्यावसायिक)',
        'VILLAGE',
        'USER_REPORT',
        false,
        80.00,
        '{"min": 300, "max": 320}'::jsonb,
        '["केवळ सुट्टे दूध विक्री", "पनीर बनवण्याची सोय नाही"]'::jsonb,
        '["प्रक्रिया क्षमता नाही", "दुधाचा दर्जा अनिश्चित"]'::jsonb
    )
ON CONFLICT (id) DO NOTHING;

-- 4-Quadrant Market Opportunities
INSERT INTO public.market_opportunities (market_area_id, business_category, demand_score, competition_score, opportunity_score, evidence, assumptions, confidence)
VALUES
    (
        'e0000000-0000-0000-0000-000000000001',
        'ताजे मलाई पनीर निर्मिती',
        88.00,
        24.00,
        91.00,
        '["२८ महामार्ग हॉटेल्सना दररोज ताज्या मलाई पनीरची गरज", "सध्या पुणे येथून शिळे पॅकेट पनीर येते"]'::jsonb,
        '["स्थानिक गाय/म्हैस दूध ₹३६/L उपलब्ध", "दररोज किमान २५ kg विक्री संभाव्य"]'::jsonb,
        92.00
    ),
    (
        'e0000000-0000-0000-0000-000000000001',
        'घट्ट मटका दही व ताक',
        74.00,
        35.00,
        78.00,
        '["उन्हाळ्यात ढाब्यांवर ताकाला प्रचंड मागणी"]'::jsonb,
        '["हंगामी मागणीतील तफावत"]'::jsonb,
        85.00
    )
ON CONFLICT DO NOTHING;

-- --------------------------------------------------------------------------
-- 7. DEMO USER PERSONA (Ramesh Patil - Baramati Dairy Enterprise)
-- --------------------------------------------------------------------------

-- Demo Auth User
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'demo_ramesh@saathi.internal',
    '',
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Ramesh Patil"}'::jsonb,
    now(),
    now()
) ON CONFLICT (id) DO NOTHING;

-- Demo Profile (Using deterministic UUID for demo isolation)
INSERT INTO public.profiles (id, full_name, preferred_language, age_range, phone_metadata, is_demo, is_onboarded, metadata)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'रमेश पाटील (Ramesh Patil)',
    'mr',
    '26-35',
    '{"masked_phone": "+91 98XXXX1234", "carrier_region": "Maharashtra"}'::jsonb,
    true,
    true,
    '{"demo_tag": "BARAMATI_DAIRY_PERSONA", "village": "Supe", "block": "Baramati"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    preferred_language = EXCLUDED.preferred_language,
    is_demo = true,
    is_onboarded = true;

-- Demo Location
INSERT INTO public.user_locations (id, user_id, location_id, custom_village, custom_block, custom_district, custom_state, precision_level, is_primary)
VALUES (
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'सुपे (Supe)',
    'बारामती (Baramati)',
    'पुणे (Pune)',
    'Maharashtra',
    'VILLAGE',
    true
)
ON CONFLICT (id) DO NOTHING;

-- Demo Business Profile
INSERT INTO public.business_profiles (id, user_id, business_name, business_category, business_subcategory, business_stage, description, experience_level, skills, available_assets, available_land, available_shop, existing_business, target_customers, preferred_business_model)
VALUES (
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'श्री समर्थ दुग्ध प्रक्रिया व पनीर केंद्र',
    'Dairy & Agro Processing',
    'Fresh Malai Paneer & Ghee',
    'PLANNING',
    'बारामती-पाटस महामार्गावरील हॉटेल्स व स्थानिक ग्राहकांना दर्जेदार ताजे मलाई पनीर व तूप पुरवठा.',
    '३ वर्षे दूध डेअरी संकलन अनुभव',
    ARRAY['दूध फॅट चाचणी', 'स्थानिक शेतकरी संपर्क', 'दुचाकी ड्रायव्हिंग'],
    ARRAY['स्वतःची ३ गुंठे जागा', 'बोअरवेल पाणी', 'मोटारसायकल'],
    '३ गुंठे वडिलोपार्जित जागा महामार्गाजवळ',
    'रस्त्याला लागून शेड उपलब्ध',
    'लहान प्रमाणावर दूध संकलन (५० लिटर/दिवस)',
    ARRAY['महामार्ग ढाबे', 'स्थानिक हॉटेल्स', 'लग्न केटरर्स', 'गावकरी'],
    'B2B Daily Supply + B2C Retail Counter'
)
ON CONFLICT (id) DO NOTHING;

-- Demo Business Idea
INSERT INTO public.business_ideas (id, user_id, business_profile_id, name, category, description, source, opportunity_score, status, reasoning, assumptions, trust_info)
VALUES (
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000003',
    'ताजे मलाई पनीर व दुग्ध प्रक्रिया केंद्र',
    'Dairy Processing',
    'दररोज २५ ते ५० किलो उच्च दर्जाचे मलाई पनीर तयार करून थेट ढाबे व केटरर्सना पुरवठा करणे.',
    'ai_recommendation',
    91.00,
    'selected',
    'परिसरात दररोज १४,५०० लिटर दूध संकलन होते व २८ ढाब्यांना पुण्यातून येणाऱ्या पॅकबंद पनीरपेक्षा ताज्या पनीरची गरज आहे.',
    '{"daily_volume_kg": 25, "milk_yield_ratio_liters_per_kg": 5, "raw_milk_rate_per_liter": 36, "selling_price_per_kg": 320}'::jsonb,
    '{"level": "AI_ESTIMATE", "confidenceScore": 92, "assumptions": ["२५ kg दैनिक विक्री", "₹३६ प्रति लिटर दूध"]}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Demo User Resources
INSERT INTO public.user_resources (user_id, capital_available, land_available, shop_available, equipment_available, vehicle_available, family_support, skills, experience)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    100000.00,
    '३ गुंठे जागा महामार्गालगत',
    '२०० चौ.फूट पक्के शेड',
    ARRAY['दुधाची कॅन', 'वजन काटा', 'फॅट मशीन'],
    ARRAY['हिरो होंडा स्प्लेंडर'],
    'भाऊ व कुटुंबातील २ व्यक्ती मदत करू शकतात',
    ARRAY['दूध संकलन', 'स्थानिक विक्री'],
    '३ वर्षे दूध केंद्रावर काम'
)
ON CONFLICT DO NOTHING;

-- Demo Financial Profile
INSERT INTO public.financial_profiles (user_id, available_margin, existing_savings, existing_business_cash, other_available_capital, monthly_household_commitments, preferred_investment)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    100000.00,
    80000.00,
    20000.00,
    0.00,
    12000.00,
    100000.00
)
ON CONFLICT DO NOTHING;

-- Demo Project Plan (PS-91 Financial Structure: ₹1,00,000 Own Equity -> ₹10,00,000 Project Cost -> ₹9,00,000 Loan)
INSERT INTO public.project_plans (id, user_id, business_profile_id, project_name, total_project_cost, own_contribution, loan_component, working_capital, equipment_cost, infrastructure_cost, inventory_cost, marketing_budget, emergency_reserve, status, version)
VALUES (
    '00000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000003',
    'सुपे पनीर प्रक्रिया प्रकल्प आराखडा (PS-91)',
    1000000.00,
    100000.00,
    900000.00,
    200000.00,
    450000.00,
    200000.00,
    50000.00,
    25000.00,
    75000.00,
    'finalized',
    1
)
ON CONFLICT (id) DO NOTHING;

-- Demo Calculation Snapshot
INSERT INTO public.financial_calculation_snapshots (user_id, project_plan_id, calculation_type, input_data, output_data, rule_version)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000005',
    'loan_structure',
    '{"ownCapital": 100000, "leverageRatio": 10, "loanRatio": 0.90, "subsidyRate": 0.35}'::jsonb,
    '{"totalProjectCost": 1000000, "loanComponent": 900000, "estimatedSubsidy": 350000, "netDebtPostSubsidy": 550000}'::jsonb,
    'v1.0'
)
ON CONFLICT DO NOTHING;

-- Demo Repayment Schedule (₹9,00,000 at 9.5% for 60 months with 6 months moratorium)
INSERT INTO public.repayment_schedules (id, user_id, loan_amount, interest_rate, tenure_months, moratorium_months, payment_frequency, calculation_version)
VALUES (
    '00000000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000001',
    900000.00,
    9.5000,
    60,
    6,
    'MONTHLY',
    'v1.0'
)
ON CONFLICT (id) DO NOTHING;

-- Demo Repayment Schedule Items (Sample first 6 moratorium months + 6 regular EMI months)
INSERT INTO public.repayment_schedule_items (repayment_schedule_id, period_number, opening_balance, principal, interest, payment, closing_balance, status)
VALUES
    ('00000000-0000-0000-0000-000000000006', 1, 900000.00, 0.00, 7125.00, 7125.00, 900000.00, 'projected'),
    ('00000000-0000-0000-0000-000000000006', 2, 900000.00, 0.00, 7125.00, 7125.00, 900000.00, 'projected'),
    ('00000000-0000-0000-0000-000000000006', 3, 900000.00, 0.00, 7125.00, 7125.00, 900000.00, 'projected'),
    ('00000000-0000-0000-0000-000000000006', 4, 900000.00, 0.00, 7125.00, 7125.00, 900000.00, 'projected'),
    ('00000000-0000-0000-0000-000000000006', 5, 900000.00, 0.00, 7125.00, 7125.00, 900000.00, 'projected'),
    ('00000000-0000-0000-0000-000000000006', 6, 900000.00, 0.00, 7125.00, 7125.00, 900000.00, 'projected'),
    ('00000000-0000-0000-0000-000000000006', 7, 900000.00, 13426.00, 7125.00, 20551.00, 886574.00, 'projected'),
    ('00000000-0000-0000-0000-000000000006', 8, 886574.00, 13532.00, 7019.00, 20551.00, 873042.00, 'projected'),
    ('00000000-0000-0000-0000-000000000006', 9, 873042.00, 13639.00, 6912.00, 20551.00, 859403.00, 'projected'),
    ('00000000-0000-0000-0000-000000000006', 10, 859403.00, 13747.00, 6804.00, 20551.00, 845656.00, 'projected'),
    ('00000000-0000-0000-0000-000000000006', 11, 845656.00, 13856.00, 6695.00, 20551.00, 831800.00, 'projected'),
    ('00000000-0000-0000-0000-000000000006', 12, 831800.00, 13966.00, 6585.00, 20551.00, 817834.00, 'projected')
ON CONFLICT DO NOTHING;

-- Demo Marketing Plan
INSERT INTO public.marketing_plans (user_id, business_idea_id, target_customer, positioning, pricing_strategy, channels, customer_acquisition, budget, assumptions)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000004',
    'महामार्गावरील ढाबे, स्थानिक हॉटेल्स, लग्न समारंभ केटरर्स व स्थानिक कुटुंबे',
    '१००% शुद्ध म्हैस दुधापासून बनवलेले रोज ताजे मलाई पनीर, पुण्याच्या शिळ्या पॅकेट पनीरपेक्षा स्वस्त व दर्जेदार',
    '{"wholesale_dhaba_rate_per_kg": 310, "retail_counter_rate_per_kg": 340, "margin_percent": 23.4}'::jsonb,
    '["महामार्ग ढाब्यांना थेट सकाळी डिलिव्हरी", "गावचा व्हॉट्सॲप ग्रुप", "आठवडे बाजार स्टॉल", "लग्न केटरर्स नेटवर्क"]'::jsonb,
    '["पहिल्या ५ ढाब्यांना २५० ग्रॅम मोफत सॅम्पल देणे", "सकाळी ७ वाजता ताजा पुरवठा"]'::jsonb,
    15000.00,
    '{"sample_budget": 5000, "signboard_whatsapp_promotion": 10000}'::jsonb
)
ON CONFLICT DO NOTHING;

-- Demo Expansion Plan
INSERT INTO public.expansion_plans (user_id, business_idea_id, current_stage, three_month_goals, six_month_goals, one_year_goals, three_year_goals, savings_target, reinvestment_strategy, expansion_conditions)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000004',
    'STAGE_1_ESTABLISHMENT',
    '["दररोज २५ kg पनीर उत्पादन स्थिर करणे", "५ नियमित हॉटेल ग्राहक जोडणे"]'::jsonb,
    '["उत्पादन ५० kg/दिवस करणे", "दही व ताक उत्पादन सुरू करणे"]'::jsonb,
    '["१०० kg/दिवस क्षमता करणे", "छोटा कोल्ड व्हॅन खरेदी करणे"]'::jsonb,
    '["स्वतःचे ३ रिटेल आउटलेट्स", "२५० kg/दिवस प्रक्रिया क्षमता"]'::jsonb,
    150000.00,
    '{"reinvestment_percent": 0.40, "reserve_percent": 0.30, "drawings_percent": 0.30}'::jsonb,
    '["बँकेचा हप्ता सलग ६ महिने वेळेत भरल्याशिवाय नवीन कर्ज काढू नये", "किमान ३ महिन्यांचा खेळते भांडवल राखीव निधी असावा"]'::jsonb
)
ON CONFLICT DO NOTHING;

-- Demo Mentor Plan & Granular Tasks
INSERT INTO public.mentor_plans (id, user_id, business_idea_id, current_stage, overall_progress)
VALUES (
    '00000000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000004',
    'STAGE_1_PREPARATION',
    25.00
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.mentor_tasks (mentor_plan_id, timeframe, title, description, category, priority, status, voice_action_prompt)
VALUES
    (
        '00000000-0000-0000-0000-000000000007',
        'TODAY',
        'स्थानिक ३ ढाब्यांना भेट देऊन पनीरची रोजची गरज विचारा',
        'महामार्गावरील ३ हॉटेल्समध्ये जाऊन ते सध्या पनीर कोठून व कोणत्या दरात घेतात याची नोंद घ्या.',
        'MARKET',
        'HIGH',
        'in_progress',
        'ढाबे मालकांशी काय बोलावे ते सांगा?'
    ),
    (
        '00000000-0000-0000-0000-000000000007',
        'THIS_WEEK',
        '२ दूध उत्पादक शेतकऱ्यांशी रोज ५० लिटर दुधाचा दर ठरवा',
        'नियमित दूध पुरवठा आणि फॅटनुसार मिळणारा दर निश्चित करा.',
        'SUPPLIER',
        'HIGH',
        'pending',
        'दूध खरेदी करार कसा करावा?'
    ),
    (
        '00000000-0000-0000-0000-000000000007',
        'THIS_MONTH',
        'बँकेत जाऊन PMEGP ३५% सबसिडी कर्जाची प्राथमिक चौकशी करा',
        'स्टेट बँक अथवा स्थानिक सहकारी बँकेच्या शाखा व्यवस्थापकांशी भेटा.',
        'FINANCE',
        'MEDIUM',
        'pending',
        'बँक मॅनेजरला कोणती कागदपत्रे दाखवायची?'
    ),
    (
        '00000000-0000-0000-0000-000000000007',
        'NEXT_90_DAYS',
        'FSSAI अन्न सुरक्षा नोंदणी आणि उद्योग आधार काढा',
        'डेअरी सुरू करण्यापूर्वी आवश्यक शासकीय परवाने पूर्ण करा.',
        'DOCUMENT',
        'MEDIUM',
        'pending',
        'FSSAI परवाना कसा काढायचा?'
    )
ON CONFLICT DO NOTHING;

-- Demo AI Conversation & Structured Messages
INSERT INTO public.conversations (id, user_id, title, language, context_type, context_id)
VALUES (
    '00000000-0000-0000-0000-000000000008',
    '00000000-0000-0000-0000-000000000001',
    'पनीर व्यवसाय मार्गदर्शन व कर्ज योजना',
    'mr',
    'BUSINESS_DISCOVERY',
    '00000000-0000-0000-0000-000000000004'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.conversation_messages (conversation_id, role, content, language, message_type, structured_data, model_metadata)
VALUES
    (
        '00000000-0000-0000-0000-000000000008',
        'user',
        'माझ्याकडे १ लाख रुपये आहेत. बारामतीजवळ सुपे गावात कोणता व्यवसाय चांगला चालेल?',
        'mr',
        'VOICE_TRANSCRIPT',
        '{}'::jsonb,
        '{"input_type": "voice"}'::jsonb
    ),
    (
        '00000000-0000-0000-0000-000000000008',
        'assistant',
        'नमस्कार रमेशजी! सुपे परिसराचा अभ्यास केला असता, येथे दररोज १४,५०० लिटर दूध संकलन होते आणि महामार्गावर २८ हॉटेल्स आहेत. सध्या ते पुण्यातून महाग पॅकेट पनीर मागवतात. तुम्ही ₹१ लाखांच्या भांडवलावर PMEGP योजनेतून ₹१० लाखांचा प्रक्रिया प्रकल्प सुरू करू शकता. यात ३५% शासकीय अनुदान (₹३.५ लाख) मिळू शकते.',
        'mr',
        'STRUCTURED_CARD',
        '{"cards": [{"type": "OPPORTUNITY", "title": "ताजे मलाई पनीर केंद्र", "subtitle": "संधी स्कोअर: ९१/१००", "actionText": "सविस्तर योजना पाहा", "actionRoute": "/feasibility"}]}'::jsonb,
        '{"model": "gemini-1.5-pro", "latency_ms": 780}'::jsonb
    )
ON CONFLICT DO NOTHING;
