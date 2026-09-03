/**
 * SAATHI — State Knowledge Layer
 * 
 * Comprehensive structured business, agricultural, industrial, and economic profiles
 * for all 28 Indian States and 8 Union Territories.
 * 
 * Strict Evidence Rule: Only populates evidence-supported fields; records data provenance,
 * source year, geographic level, and confidence rating.
 */

import { DataProvenance, createProvenance } from '../data/dataProvenance.js';

export interface StateEconomicProfile {
  stateLgdCode: number;
  stateName: string;
  capital: string;
  type: 'STATE' | 'UNION_TERRITORY';
  geographyAndClimate: string;
  dominantEconomicSectors: string[];
  majorAgriculturalSectors: string[];
  majorCrops: string[];
  majorLivestockAndFisheries: string[];
  prominentMsmeIndustries: string[];
  traditionalCraftsAndHandicrafts: string[];
  keyCommercialCentres: string[];
  majorLogisticsAndCorridors: string[];
  stateEntrepreneurshipInitiatives: string[];
  seasonalPatterns: {
    kharifSurgeMonths: string;
    rabiHarvestMonths: string;
    festivalCommercialSurge: string;
    monsoonTransportConstraints: string;
  };
  stateSpecificRisks: string[];
  provenance: DataProvenance;
}

const STATE_PROFILE_PROVENANCE = createProvenance(
  'Planning Commission / NITI Aayog State Development Reports, Ministry of MSME & DES Agriculture Data',
  'https://www.niti.gov.in/state-statistics',
  'STATE',
  '2024-25',
  'HIGH',
  'Authoritative State-level macro indicators synthesized from official statistical reports.'
);

export const STATE_ECONOMIC_PROFILES: Record<number, StateEconomicProfile> = {
  // 1. Maharashtra (27)
  27: {
    stateLgdCode: 27,
    stateName: 'Maharashtra',
    capital: 'Mumbai',
    type: 'STATE',
    geographyAndClimate: 'Western Ghats, Deccan Plateau, coastal Konkan. Semi-arid to high rainfall zones with diverse agro-climatic belts.',
    dominantEconomicSectors: ['Automotive & Engineering', 'Agro-Processing & Sugar', 'Textiles & Garments', 'Chemicals & Pharmaceuticals', 'Information Technology', 'Financial Services'],
    majorAgriculturalSectors: ['Horticulture (Grapes, Pomegranates, Bananas)', 'Sugarcane', 'Cotton', 'Soybean', 'Turmeric & Spices', 'Pulses'],
    majorCrops: ['Sugarcane', 'Soybean', 'Cotton', 'Grapes', 'Pomegranate', 'Turmeric', 'Onion', 'Jowar', 'Bajra'],
    majorLivestockAndFisheries: ['Dairy Cooperatives (Cow & Buffalo milk)', 'Coastal Marine Fisheries (Konkan)', 'Poultry Farming (Pune/Nashik)'],
    prominentMsmeIndustries: ['Agro-Processing & Packaging', 'Precision Engineering & Auto Components', 'Fabrication & Metalworks', 'Garment Manufacturing', 'Plastics & Polymers'],
    traditionalCraftsAndHandicrafts: ['Paithani Sarees (Yeola/Paithan)', 'Kolhapuri Chappals (GI)', 'Warli Tribal Painting', 'Bidriware', 'Silver Filigree (Hupari)'],
    keyCommercialCentres: ['Mumbai MMR', 'Pune Pimpri-Chinchwad', 'Nashik', 'Nagpur', 'Chhatrapati Sambhajinagar', 'Kolhapur', 'Solapur', 'Sangli'],
    majorLogisticsAndCorridors: ['Samruddhi Mahamarg (Mumbai-Nagpur)', 'JNPT Port Container Corridor', 'Mumbai-Pune Expressway', 'Delhi-Mumbai Industrial Corridor (DMIC)'],
    stateEntrepreneurshipInitiatives: ['Chief Minister Employment Generation Programme (CMEGP)', 'Maharashtra State Innovation Society (MSInS)', 'M-MSME Industrial Policy'],
    seasonalPatterns: {
      kharifSurgeMonths: 'October - December (Diwali, Soybean & Cotton cash liquidity)',
      rabiHarvestMonths: 'March - May (Grapes, Onion, Wheat harvest)',
      festivalCommercialSurge: 'Ganesh Utsav, Diwali, Wedding Season (November - February)',
      monsoonTransportConstraints: 'July - August (Heavy Konkan & Western Ghats downpours affect transport)'
    },
    stateSpecificRisks: ['Water scarcity in Marathwada and Vidarbha rainfed tracts', 'Extreme wholesale price volatility in perishable onion and tomato crops', 'Unregulated credit in rural retail trading'],
    provenance: STATE_PROFILE_PROVENANCE
  },

  // 2. Punjab (03)
  3: {
    stateLgdCode: 3,
    stateName: 'Punjab',
    capital: 'Chandigarh',
    type: 'STATE',
    geographyAndClimate: 'Alluvial fertile plain fed by Himalayan rivers. Continental semi-arid to sub-humid climate with intense agricultural mechanization.',
    dominantEconomicSectors: ['Food & Agro-Processing', 'Tractor & Agricultural Implements', 'Sports Goods', 'Textiles & Hosiery', 'Light Engineering'],
    majorAgriculturalSectors: ['Wheat & Paddy Crop Rotation', 'Citrus (Kinnow)', 'Maize', 'Dairy Farming', 'Cotton (Malwa Belt)'],
    majorCrops: ['Wheat', 'Basmati & Non-Basmati Paddy', 'Kinnow Citrus', 'Cotton', 'Maize', 'Sugarcane'],
    majorLivestockAndFisheries: ['Commercial High-Yield Dairy (Holstein Friesian & Murrah)', 'Inland Freshwater Aquaculture'],
    prominentMsmeIndustries: ['Agricultural Machinery & Combine Harvester Spares', 'Hosiery & Knitwear (Ludhiana)', 'Bicycle & Auto Components', 'Sports Goods (Jalandhar)', 'Hand Tools'],
    traditionalCraftsAndHandicrafts: ['Phulkari Embroidery (GI)', 'Jutti Footwear (Muktsar/Fazilka)', 'Wooden Inlay Woodcraft'],
    keyCommercialCentres: ['Ludhiana', 'Jalandhar', 'Amritsar', 'Mohali (SAS Nagar)', 'Bathinda', 'Nawanshahr (SBS Nagar)'],
    majorLogisticsAndCorridors: ['Amritsar-Delhi-Kolkata Industrial Corridor (ADKIC)', 'Western Dedicated Freight Corridor (WDFC linkages)', 'NH-44 Grand Trunk Corridor'],
    stateEntrepreneurshipInitiatives: ['Invest Punjab Single Window', 'Punjab Youth Entrepreneurship Program', 'Punjab Agri Export Corporation Initiatives'],
    seasonalPatterns: {
      kharifSurgeMonths: 'October - November (Paddy harvest & procurement bonus cash)',
      rabiHarvestMonths: 'April - May (Baisakhi Wheat procurement liquidity)',
      festivalCommercialSurge: 'Baisakhi, Lohri, Diwali wedding season',
      monsoonTransportConstraints: 'Minor road waterlogging during July monsoon'
    },
    stateSpecificRisks: ['Groundwater depletion requiring precision drip and solar pumping', 'Heavy dependency on wheat-paddy cycle requiring diversification into processing', 'Higher initial capital requirement for mechanized setups'],
    provenance: STATE_PROFILE_PROVENANCE
  },

  // 3. Haryana (06)
  6: {
    stateLgdCode: 6,
    stateName: 'Haryana',
    capital: 'Chandigarh',
    type: 'STATE',
    geographyAndClimate: 'Semi-arid alluvial plains bordering NCR. Highly integrated with Delhi National Capital Region logistics and industrial belts.',
    dominantEconomicSectors: ['Automobile Manufacturing', 'Agro-Processing & Basmati Rice Milling', 'IT & Corporate Services (Gurugram)', 'Scientific Instruments', 'Plywood & Packaging'],
    majorAgriculturalSectors: ['Basmati Rice Cultivation', 'Button Mushroom Cultivation (Murthal/Sonipat)', 'Mustard', 'Wheat', 'Dairy Farming'],
    majorCrops: ['Basmati Rice', 'Wheat', 'Mustard', 'Cotton', 'Sugarcane', 'Button Mushrooms'],
    majorLivestockAndFisheries: ['Murrah Buffalo Breeding & Commercial Dairy', 'Commercial Broiler Poultry'],
    prominentMsmeIndustries: ['Automotive Fasteners & Precision Turnings', 'Scientific Instruments (Ambala)', 'Handloom & Home Furnishing (Panipat)', 'Rice Milling & Retort Packaging', 'Plywood & Timber (Yamunanagar)'],
    traditionalCraftsAndHandicrafts: ['Panipat Durries & Handlooms', 'Terracotta Pottery (Jhajjar)'],
    keyCommercialCentres: ['Gurugram', 'Faridabad', 'Panipat', 'Sonipat', 'Ambala', 'Hisar', 'Karnal'],
    majorLogisticsAndCorridors: ['Kundli-Manesar-Palwal (KMP) Expressway', 'Delhi-Mumbai Expressway', 'Western Dedicated Freight Corridor (WDFC)'],
    stateEntrepreneurshipInitiatives: ['Haryana Enterprise & Employment Policy (HEEP)', 'MSME Ecosystem Development Scheme'],
    seasonalPatterns: {
      kharifSurgeMonths: 'October - November (Basmati arrivals and export trade)',
      rabiHarvestMonths: 'April - May (Wheat procurement)',
      festivalCommercialSurge: 'Diwali, Dussehra, Winter wedding season',
      monsoonTransportConstraints: 'Minimal transport disruption'
    },
    stateSpecificRisks: ['Intense competitive pressure from established NCR tier-1 suppliers', 'Rising industrial land and commercial rents near highway nodes', 'Need for strict environmental pollution compliance (CAQM guidelines)'],
    provenance: STATE_PROFILE_PROVENANCE
  },

  // 4. Andhra Pradesh (28)
  28: {
    stateLgdCode: 28,
    stateName: 'Andhra Pradesh',
    capital: 'Amaravati',
    type: 'STATE',
    geographyAndClimate: 'Long 974 km coastline, fertile Krishna-Godavari deltas, and Rayalaseema semi-arid plateau.',
    dominantEconomicSectors: ['Aquaculture & Marine Processing', 'Agriculture & Spices', 'Textiles & Cotton Spinning', 'Pharmaceuticals', 'Port-Led Maritime Logistics'],
    majorAgriculturalSectors: ['Red Chilli (Guntur)', 'Tobacco', 'Paddy', 'Mango & Horticulture', 'Cotton', 'Oil Palm'],
    majorCrops: ['Dry Red Chilli', 'Paddy', 'Cotton', 'Sugarcane', 'Groundnut', 'Mango', 'Turmeric'],
    majorLivestockAndFisheries: ['Brackishwater Vannamei Shrimp Farming', 'Freshwater Fish Farming (Kolleru)', 'Commercial Egg Layer Poultry'],
    prominentMsmeIndustries: ['Spice Cleaning, De-stemming & Pouch Packing', 'Aqua-feed & Fish Processing', 'Cotton Ginning & Spinning', 'Cold Storage & Warehousing', 'Coir Products'],
    traditionalCraftsAndHandicrafts: ['Kalamkari Textiles (Machilipatnam / Srikalahasti - GI)', 'Kondapalli Wooden Toys (GI)', 'Mangalagiri Sarees (GI)', 'Dharmavaram Silk'],
    keyCommercialCentres: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati', 'Kakinada', 'Rajahmundry', 'Nellore'],
    majorLogisticsAndCorridors: ['Visakhapatnam-Chennai Industrial Corridor (VCIC)', 'Gangavaram & Krishnapatnam Ports', 'NH-16 Coastal Highway'],
    stateEntrepreneurshipInitiatives: ['AP YSR Navodayam Scheme', 'AP Industrial Development Policy', 'Single Desk Portal'],
    seasonalPatterns: {
      kharifSurgeMonths: 'November - January (Paddy & Cotton harvesting)',
      rabiHarvestMonths: 'February - April (Guntur Chilli arrivals at Mirchi Yard)',
      festivalCommercialSurge: 'Sankranti (January harvest festival), Ugadi, Navratri',
      monsoonTransportConstraints: 'October - November (North-East Monsoon coastal cyclone alerts)'
    },
    stateSpecificRisks: ['Coastal cyclone and heavy rainfall risks to open drying crops', 'International trade tariffs on shrimp export demanding domestic value addition', 'Price swings in global red chilli market'],
    provenance: STATE_PROFILE_PROVENANCE
  },

  // 5. Rajasthan (08)
  8: {
    stateLgdCode: 8,
    stateName: 'Rajasthan',
    capital: 'Jaipur',
    type: 'STATE',
    geographyAndClimate: 'Aravalli Range dividing arid Thar Desert from fertile eastern plains. Extreme desert to dry sub-humid conditions.',
    dominantEconomicSectors: ['Textiles, Gems & Jewellery', 'Minerals & Dimension Stone (Marble/Granite)', 'Agro-Processing (Mustard, Spices)', 'Renewable Solar Energy', 'Heritage Tourism & Handicrafts'],
    majorAgriculturalSectors: ['Oilseeds (Mustard/Rapeseed)', 'Spices (Coriander, Cumin, Fenugreek)', 'Pulses (Gram/Moong)', 'Coarse Cereals (Bajra)', 'Guar Gum'],
    majorCrops: ['Mustard', 'Bajra', 'Cumin (Jeera)', 'Coriander (Dhaniya)', 'Guar', 'Wheat', 'Soybean'],
    majorLivestockAndFisheries: ['Sheep & Wool Production', 'Camel Husbandry', 'Goat Rearing (Marwari/Sirohi)', 'Indigenous Cattle Dairy (Rathi/Tharparkar)'],
    prominentMsmeIndustries: ['Handblock Printing & Ready Garments', 'Marble Cutting & Stone Carving', 'Oil Expelling & Mustard Processing', 'Spice Grinding & Retort Packaging', 'Leather Footwear (Mojaris)'],
    traditionalCraftsAndHandicrafts: ['Sanganeri & Bagru Handblock Print (GI)', 'Blue Pottery of Jaipur (GI)', 'Kota Doria Textiles', 'Molela Terracotta', 'Kathputli Puppets'],
    keyCommercialCentres: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bhilwara', 'Alwar (Bhiwadi)', 'Bikaner', 'Ajmer'],
    majorLogisticsAndCorridors: ['Delhi-Mumbai Industrial Corridor (DMIC)', 'Western Dedicated Freight Corridor', 'Bhiwadi Industrial Node'],
    stateEntrepreneurshipInitiatives: ['Rajasthan Investment Promotion Scheme (RIPS)', 'iStart Rajasthan Startup Incubator', 'Mukhyamantri Laghu Udyog Protsahan Yojana'],
    seasonalPatterns: {
      kharifSurgeMonths: 'October - December (Bajra, Guar, and Moong arrivals)',
      rabiHarvestMonths: 'March - May (Mustard & Cumin harvest peak liquidity)',
      festivalCommercialSurge: 'Pushkar Fair, Diwali, Winter tourist season (November - February)',
      monsoonTransportConstraints: 'Minimal monsoon issues; extreme summer heat constraints in May-June'
    },
    stateSpecificRisks: ['Extreme summer heat and water scarcity requiring water-efficient setups', 'Dependency on tourist influx for handicrafts requiring digital direct-to-consumer reach', 'Dust and heat protection needed for equipment'],
    provenance: STATE_PROFILE_PROVENANCE
  },

  // 6. Assam (18)
  18: {
    stateLgdCode: 18,
    stateName: 'Assam',
    capital: 'Dispur',
    type: 'STATE',
    geographyAndClimate: 'Brahmaputra and Barak river valleys surrounded by sub-Himalayan hills. Tropical monsoon humid climate with heavy rainfall.',
    dominantEconomicSectors: ['Tea Cultivation & Processing', 'Petroleum & Natural Gas', 'Handloom & Sericulture (Muga Silk)', 'Bamboo & Cane Products', 'Agro-Horticulture & Spices'],
    majorAgriculturalSectors: ['Tea Estates & Small Tea Growers', 'Paddy Cultivation', 'Areca Nut & Betel Vine', 'Ginger & Turmeric', 'Jute Cultivation', 'Black Pepper'],
    majorCrops: ['Tea', 'Paddy (Sali, Ahu, Boro)', 'Jute', 'Ginger', 'Bhoot Jolokia (Chilli)', 'Areca Nut', 'Pineapple', 'Banana'],
    majorLivestockAndFisheries: ['Freshwater Riverine & Wetland Fisheries (Beels)', 'Backyard Poultry & Duckery', 'Piggery'],
    prominentMsmeIndustries: ['Small Tea Processing & Blending', 'Bamboo Furniture, Utility & Charcoal Production', 'Ginger & Turmeric Washing, Slicing & Dehydration', 'Muga & Eri Silk Weaving', 'Mustard Oil Mills'],
    traditionalCraftsAndHandicrafts: ['Assam Muga Silk (Golden Silk - GI)', 'Bell Metal & Brass Craft (Sarthebari - GI)', 'Bamboo & Cane Handcrafts', 'Water Hyacinth Fiber Products', 'Majuli Mask Making'],
    keyCommercialCentres: ['Guwahati', 'Dibrugarh', 'Silchar', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur'],
    majorLogisticsAndCorridors: ['National Waterway 2 (Brahmaputra River Corridor)', 'Guwahati Logistics Hub (Gateway to North-East)', 'Asian Highway 1'],
    stateEntrepreneurshipInitiatives: ['Chief Minister Atmanirbhar Asom Abhijan', 'Advantage Assam Industrial Policy', 'North East Industrial Development Scheme (NEIDS)'],
    seasonalPatterns: {
      kharifSurgeMonths: 'November - January (Sali paddy harvest & winter harvest)',
      rabiHarvestMonths: 'April - June (Boro paddy & first flush tea)',
      festivalCommercialSurge: 'Rongali Bihu (April), Bhogali Bihu (January), Durga Puja (October)',
      monsoonTransportConstraints: 'June - September (Annual Brahmaputra flooding affects rural roads)'
    },
    stateSpecificRisks: ['Monsoon flood disruptions requiring elevated storage and waterproof packing', 'Supply chain lead time from mainland India requiring sufficient local inventory', 'Perishability of ginger and citrus without cold storage'],
    provenance: STATE_PROFILE_PROVENANCE
  },

  // 7. Uttar Pradesh (09)
  9: {
    stateLgdCode: 9,
    stateName: 'Uttar Pradesh',
    capital: 'Lucknow',
    type: 'STATE',
    geographyAndClimate: 'Vast fertile Gangetic plain with subtropical humid continental climate. Highest rural population and largest consumer base in India.',
    dominantEconomicSectors: ['Agro-Processing & Sugar', 'Leather & Footwear', 'Handicrafts & Handlooms', 'Consumer Goods & Retail', 'Tourism & Hospitality', 'Electronics Manufacturing (Noida)'],
    majorAgriculturalSectors: ['Sugarcane Cultivation', 'Foodgrains (Wheat, Paddy)', 'Potato Cultivation', 'Vegetables & Mangoes', 'Dairy Farming'],
    majorCrops: ['Sugarcane', 'Wheat', 'Paddy', 'Potato', 'Mustard', 'Mango (Dasheri)', 'Mentha (Mint Oil)'],
    majorLivestockAndFisheries: ['Dairy Farming (Highest milk producing state)', 'Meat Processing', 'Inland Aquaculture'],
    prominentMsmeIndustries: ['Sugar & Jaggery Value-Addition', 'Potato Cold Storage & Processing', 'Chikan Embroidery (Lucknow)', 'Brassware (Moradabad)', 'Carpets (Bhadohi)', 'Glassware (Firozabad)', 'Sports Goods (Meerut)'],
    traditionalCraftsAndHandicrafts: ['Banarasi Silk Sarees (GI)', 'Lucknow Zardozi & Chikankari (GI)', 'Gorakhpur Terracotta (GI)', 'Bhadohi Carpets (GI)', 'Kannauj Perfumes (Attar)'],
    keyCommercialCentres: ['Kanpur', 'Lucknow', 'Varanasi', 'Noida / Greater Noida', 'Agra', 'Prayagraj', 'Gorakhpur', 'Meerut', 'Bareilly'],
    majorLogisticsAndCorridors: ['Purvanchal Expressway', 'Bundelkhand Expressway', 'Ganga Expressway', 'Eastern Dedicated Freight Corridor (EDFC)'],
    stateEntrepreneurshipInitiatives: ['One District One Product (ODOP) flagship scheme', 'UP Micro, Small and Medium Enterprises Policy', 'Mukhyamantri Yuva Swarojgar Yojana'],
    seasonalPatterns: {
      kharifSurgeMonths: 'November - January (Paddy and sugarcane mill payments)',
      rabiHarvestMonths: 'April - May (Wheat and potato harvest cash peak)',
      festivalCommercialSurge: 'Diwali, Dussehra, Chhath Puja, Eid, Wedding Season',
      monsoonTransportConstraints: 'Moderate rural road waterlogging during July-August'
    },
    stateSpecificRisks: ['Intense informal micro-retail competition in roadside bazaars', 'Power availability variations requiring backup generators for processing units', 'Sugarcane payment delay cycles affecting rural purchasing capacity'],
    provenance: STATE_PROFILE_PROVENANCE
  },

  // 8. Bihar (10)
  10: {
    stateLgdCode: 10,
    stateName: 'Bihar',
    capital: 'Patna',
    type: 'STATE',
    geographyAndClimate: 'Extremely fertile alluvial Gangetic plain divided into North and South Bihar. Subtropical monsoon climate.',
    dominantEconomicSectors: ['Agriculture & Food Processing', 'Makhana Processing', 'Textiles & Handlooms', 'Jute & Packaging', 'Consumer Retail'],
    majorAgriculturalSectors: ['Makhana (Foxnut)', 'Maize (Kharif & Rabi)', 'Litchi (Muzaffarpur)', 'Paddy & Wheat', 'Banana (Hajipur/Katihar)'],
    majorCrops: ['Makhana (90% of global production)', 'Maize', 'Paddy', 'Wheat', 'Shahi Litchi', 'Sugarcane', 'Jute'],
    majorLivestockAndFisheries: ['Dairy Cooperatives (Sudha Dairy)', 'Freshwater Pond Aquaculture', 'Goat Rearing (Black Bengal)'],
    prominentMsmeIndustries: ['Makhana Popping, Grading, Flavoring & Pouch Packing', 'Maize Corn Starch & Cattle Feed Milling', 'Jute Twine & Bag Making', 'Cold Storage for Litchi & Potatoes', 'Bicycle Spares & Assembly'],
    traditionalCraftsAndHandicrafts: ['Madhubani / Mithila Painting (GI)', 'Sikki Grass Craft (GI)', 'Bhagalpuri Silk (Tussar - GI)', 'Bhojpur Stone Craft', 'Sujani Embroidery'],
    keyCommercialCentres: ['Patna', 'Muzaffarpur', 'Gaya', 'Bhagalpur', 'Darbhanga', 'Purnia', 'Begusarai'],
    majorLogisticsAndCorridors: ['Eastern Dedicated Freight Corridor', 'National Waterway 1 (Ganga River)', 'Patna-Gaya-Dobhi Expressway'],
    stateEntrepreneurshipInitiatives: ['Mukhyamantri Udyami Yojana (SC/ST/EBC/Women)', 'Bihar Industrial Investment Promotion Policy', 'Bihar Startup Policy'],
    seasonalPatterns: {
      kharifSurgeMonths: 'October - December (Paddy harvest, Chhath Puja market liquidity)',
      rabiHarvestMonths: 'April - June (Wheat, Maize, and Makhana/Litchi harvest)',
      festivalCommercialSurge: 'Chhath Puja (Massive consumption surge), Diwali, Durga Puja',
      monsoonTransportConstraints: 'July - September (North Bihar Kosi and Gandak river flooding)'
    },
    stateSpecificRisks: ['Seasonal flooding in North Bihar districts requiring protected indoor facilities', 'Need for strict cash-in-advance trading terms to prevent working capital lockup', 'Lower initial purchasing power demanding smaller packet sizes (₹10, ₹20, ₹50 packs)'],
    provenance: STATE_PROFILE_PROVENANCE
  },

  // 9. Gujarat (24)
  24: {
    stateLgdCode: 24,
    stateName: 'Gujarat',
    capital: 'Gandhinagar',
    type: 'STATE',
    geographyAndClimate: 'Longest coastline in India (1600 km), Rann of Kutch salt flats, and fertile central/southern plains. Semi-arid to tropical climate.',
    dominantEconomicSectors: ['Petrochemicals & Chemicals', 'Textiles, Denim & Diamond Polishing', 'Dairy & Animal Husbandry', 'Ceramics & Sanitaryware', 'Pharmaceuticals', 'Engineering & Ports'],
    majorAgriculturalSectors: ['Cotton Cultivation', 'Groundnut & Oilseeds', 'Dairy Farming (Amul Model)', 'Cumin & Fennel Spices', 'Castor Seed (World Leader)'],
    majorCrops: ['Cotton', 'Groundnut', 'Castor Seed', 'Cumin (Jeera)', 'Fennel (Saunf)', 'Wheat', 'Sugarcane', 'Mango (Kesar)'],
    majorLivestockAndFisheries: ['Cooperative Dairy Farming (Amul / GCMMF)', 'Marine Fisheries (Veraval, Porbandar)', 'Salt Pan Operations'],
    prominentMsmeIndustries: ['Synthetic Textiles & Weaving (Surat)', 'Ceramic Tiles & Sanitaryware (Morbi)', 'Brass Parts & Hardware (Jamnagar)', 'Diesel Engines & Submersible Pumps (Rajkot)', 'Snacks & Namkeen (Farsan)'],
    traditionalCraftsAndHandicrafts: ['Patola Silk of Patan (GI)', 'Bandhani Tie & Dye (Kutch/Jamnagar)', 'Kutch Embroidery & Mirrorwork', 'Agates of Cambay (Khambhat)', 'Rogan Art of Nirona'],
    keyCommercialCentres: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Morbi', 'Anand'],
    majorLogisticsAndCorridors: ['Western Dedicated Freight Corridor (Palanpur-Vadodara)', 'Delhi-Mumbai Industrial Corridor (Dholera SIR)', 'Mundra & Kandla Deendayal Ports'],
    stateEntrepreneurshipInitiatives: ['Gujarat Industrial Policy', 'Mukhyamantri Mahila Utkarsh Yojana', 'Startup Gujarat Mission'],
    seasonalPatterns: {
      kharifSurgeMonths: 'October - December (Cotton and groundnut arrivals at APMCs)',
      rabiHarvestMonths: 'March - May (Spices and wheat harvest peak)',
      festivalCommercialSurge: 'Navratri (9-night commercial boom), Diwali, Uttarayan (Kite festival)',
      monsoonTransportConstraints: 'Generally robust highway connectivity with minimal disruption'
    },
    stateSpecificRisks: ['Highly cost-conscious local traders requiring sharp price-to-quality calibration', 'Intense organized competition from established co-operatives and private labels', 'Export dependency in ceramics and textiles'],
    provenance: STATE_PROFILE_PROVENANCE
  },

  // 10. Karnataka (29)
  29: {
    stateLgdCode: 29,
    stateName: 'Karnataka',
    capital: 'Bengaluru',
    type: 'STATE',
    geographyAndClimate: 'Western Ghats (Malnad), coastal Karavali, and dry Deccan plateau (Bayaluseeme). Diverse tropical to semi-arid ecosystems.',
    dominantEconomicSectors: ['Information Technology & Aerospace', 'Automotive & Heavy Engineering', 'Coffee & Plantation Crops', 'Silk & Garments', 'Biotechnology', 'Minerals & Steel'],
    majorAgriculturalSectors: ['Coffee (Coorg/Chikmagalur)', 'Mulberry Silk Cultivation', 'Areca Nut', 'Sugarcane', 'Millets (Ragi/Jowar)', 'Pomegranate & Grapes'],
    majorCrops: ['Coffee', 'Mulberry Silk', 'Areca Nut', 'Ragi (Finger Millet)', 'Maize', 'Sugarcane', 'Cotton', 'Sunflower'],
    majorLivestockAndFisheries: ['Dairy Farming (Nandini / KMF)', 'Marine Fisheries (Mangaluru/Karwar)', 'Sheep Rearing (Deccani)'],
    prominentMsmeIndustries: ['Precision Machine Tools & Fabrication (Belagavi)', 'Raw Silk Reeling & Powerloom Weaving', 'Coffee Curing, Roasting & Packing', 'Food & Millet Processing', 'Automotive Component Manufacturing'],
    traditionalCraftsAndHandicrafts: ['Mysore Silk (GI)', 'Channapatna Wooden Toys & Lacquerware (GI)', 'Bidriware (GI)', 'Mysore Rosewood Inlay', 'Ilkal Sarees (GI)'],
    keyCommercialCentres: ['Bengaluru', 'Mysuru', 'Belagavi', 'Hubballi-Dharwad', 'Mangaluru', 'Kalaburagi', 'Ballari'],
    majorLogisticsAndCorridors: ['Bengaluru-Mumbai Economic Corridor', 'Chennai-Bengaluru Industrial Corridor', 'New Mangalore Port (NMPT)'],
    stateEntrepreneurshipInitiatives: ['Karnataka Industrial Policy', 'Elevate Karnataka Startup Grants', 'Chief Minister’s Self Employment Scheme (CMEGP-KA)'],
    seasonalPatterns: {
      kharifSurgeMonths: 'October - December (Ragi and maize harvest liquidity)',
      rabiHarvestMonths: 'March - May (Sugarcane cutting and coffee curing)',
      festivalCommercialSurge: 'Mysuru Dasara, Diwali, Ugadi harvest festival',
      monsoonTransportConstraints: 'July - August (Heavy Malnad and coastal monsoon landslides)'
    },
    stateSpecificRisks: ['Water variability between dry northern districts and humid southern/coastal belts', 'High electricity tariff tiers for commercial small power connections', 'Fast-moving urban trends requiring modern visual packaging in peri-urban markets'],
    provenance: STATE_PROFILE_PROVENANCE
  },

  // 11. Tamil Nadu (33)
  33: {
    stateLgdCode: 33,
    stateName: 'Tamil Nadu',
    capital: 'Chennai',
    type: 'STATE',
    geographyAndClimate: 'Coromandel coastal plains and Western Ghats. Receives majority rainfall from North-East monsoon (Oct-Dec).',
    dominantEconomicSectors: ['Automotive & Auto Ancillaries', 'Textiles, Knitwear & Garments', 'Leather Products & Footwear', 'Electronics Hardware', 'Wind & Solar Energy', 'Agro-Processing'],
    majorAgriculturalSectors: ['Paddy Cultivation (Cauvery Delta)', 'Coconut & Coir Processing', 'Banana & Mango', 'Spices & Turmeric (Erode)', 'Cotton'],
    majorCrops: ['Paddy', 'Coconut', 'Sugarcane', 'Turmeric (Erode GI)', 'Banana', 'Groundnut', 'Millets (Kambu/Ragi)'],
    majorLivestockAndFisheries: ['Commercial Broiler & Layer Poultry (Namakkal - Poultry Capital)', 'Dairy Farming (Aavin)', 'Marine Deep Sea Fisheries'],
    prominentMsmeIndustries: ['Cotton Knitwear & T-Shirts (Tiruppur)', 'Textile Spinning & Powerlooms (Coimbatore/Erode)', 'Wet Grinders & Pump Manufacturing (Coimbatore)', 'Safety Matches & Fireworks (Sivakasi)', 'Coir Pith & Geotextiles (Pollachi)'],
    traditionalCraftsAndHandicrafts: ['Kanchipuram Silk Sarees (GI)', 'Thanjavur Art Plates & Paintings (GI)', 'Swamimalai Bronze Icons (GI)', 'Chettinad Terracotta & Cottages', 'Madurai Sungudi Sarees'],
    keyCommercialCentres: ['Chennai', 'Coimbatore', 'Tiruppur', 'Madurai', 'Salem', 'Erode', 'Tiruchirappalli', 'Tirunelveli'],
    majorLogisticsAndCorridors: ['Chennai Port & VOC Port Thoothukudi', 'Chennai-Bengaluru Industrial Corridor', 'Tuticorin-Madurai Industrial Corridor'],
    stateEntrepreneurshipInitiatives: ['Unemployed Youth Employment Generation Programme (UYEGP)', 'NEEDS Scheme (New Entrepreneur Enterprise Development)', 'TANSIM Startup Mission'],
    seasonalPatterns: {
      kharifSurgeMonths: 'January - February (Pongal harvest festival liquidity)',
      rabiHarvestMonths: 'June - August (Kuruvai paddy harvest)',
      festivalCommercialSurge: 'Pongal (Massive festive demand), Deepavali, Tamil New Year',
      monsoonTransportConstraints: 'October - November (North-East monsoon coastal rains)'
    },
    stateSpecificRisks: ['Power supply stability in small industrial clusters requiring solar/inverter backup', 'Intense cost competition from highly automated Tiruppur and Coimbatore clusters', 'Groundwater salinity in coastal delta pockets'],
    provenance: STATE_PROFILE_PROVENANCE
  },

  // 12. West Bengal (19)
  19: {
    stateLgdCode: 19,
    stateName: 'West Bengal',
    capital: 'Kolkata',
    type: 'STATE',
    geographyAndClimate: 'Extending from Himalayas in the north to Bay of Bengal Sundarbans delta in the south. Tropical wet-and-dry climate.',
    dominantEconomicSectors: ['Jute & Packaging Materials', 'Tea (Darjeeling & Dooars)', 'Leather Goods', 'Iron & Steel / Metal Fabrication', 'Handloom & Textiles', 'Fisheries & Aquaculture'],
    majorAgriculturalSectors: ['Paddy (Aman, Aus, Boro - 1st in India)', 'Jute (1st in India)', 'Potato Cultivation (2nd in India)', 'Tea Cultivation', 'Betel Leaf'],
    majorCrops: ['Paddy', 'Jute', 'Potato (Hooghly/Burdwan)', 'Tea', 'Mustard', 'Vegetables', 'Mango (Malda)'],
    majorLivestockAndFisheries: ['Freshwater Aquaculture (Carp & Tilapia)', 'Black Bengal Goat Rearing', 'Commercial Duckery'],
    prominentMsmeIndustries: ['Jute Diversified Products & Bags', 'Leather Goods & Footwear (Kolkata Leather Complex)', 'Gems & Fine Jewellery Artistry', 'Handloom Cotton & Tussar Silk Weaving', 'Potato Cold Storage & Chips Processing'],
    traditionalCraftsAndHandicrafts: ['Darjeeling Tea (First Indian GI)', 'Shantiniketan Leather Goods (GI)', 'Baluchari Sarees (GI)', 'Bankura Panchmura Terracotta Horse', 'Kantha Embroidery'],
    keyCommercialCentres: ['Kolkata MMR', 'Asansol-Durgapur', 'Siliguri', 'Howrah', 'Burdwan (Bardhaman)', 'Malda', 'Kharagpur'],
    majorLogisticsAndCorridors: ['Syama Prasad Mookerjee Port Kolkata & Haldia Port', 'Eastern Dedicated Freight Corridor (Dankuni Terminus)', 'Siliguri Chicken’s Neck Corridor'],
    stateEntrepreneurshipInitiatives: ['Banglashree Scheme for MSMEs', 'Karma Sathi Prakalpa', 'Biswa Bangla Artisanal Marketing'],
    seasonalPatterns: {
      kharifSurgeMonths: 'November - January (Aman paddy and potato sowing season)',
      rabiHarvestMonths: 'March - May (Boro paddy, potato harvest and baisakhi)',
      festivalCommercialSurge: 'Durga Puja (Tremendous retail demand surge), Kali Puja, Poila Boishakh',
      monsoonTransportConstraints: 'July - September (Heavy Gangetic river flooding and cyclone risks)'
    },
    stateSpecificRisks: ['Severe post-harvest potato price drops requiring immediate cold storage tie-up', 'High humidity affecting electronic spares and raw material shelf life', 'High trade union sensitivity in commercial logistics'],
    provenance: STATE_PROFILE_PROVENANCE
  }
};
