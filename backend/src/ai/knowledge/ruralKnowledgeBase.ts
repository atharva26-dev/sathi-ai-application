/**
 * SAATHI — Foundational Rural Entrepreneurship Domain Knowledge Base
 *
 * Ingests domain knowledge, principles, operational considerations, risk factors,
 * and 20 foundational rural business models as a domain knowledge ontology.
 *
 * CRITICAL DIRECTIVE:
 * This knowledge is NOT a database of guaranteed profitable businesses.
 * It is NOT proof that a particular business will succeed in a particular village.
 * It is a foundational business-knowledge layer combined with user context,
 * official datasets, deterministic financial engines, and local market validation.
 */

export interface RuralConstraintDimension {
  category: string;
  description: string;
  typicalSymptoms: string[];
  recommendedMitigations: {
    mr: string;
    hi: string;
    en: string;
  };
}

export interface RuralOpportunityDimension {
  category: string;
  description: string;
  keyEnablers: string[];
  strategicAdvice: {
    mr: string;
    hi: string;
    en: string;
  };
}

export interface RuralBusinessModelKnowledge {
  id: string;
  name: string;
  nameNative: { mr: string; hi: string; en: string };
  category: string;
  concept: string;
  potentialCustomers: string[];
  advantages: string[];
  criticalRisks: string[];
  sourceContextInvestmentRange: string;
  sourceContextRevenueExample?: string;
  validationChecklist: string[];
  resourceDependencies: string[];
  scalabilityPath: string;
  disclaimer: string;
}

// --------------------------------------------------------------------------
// 1. CORE RURAL ECONOMIC ENVIRONMENT (ADVANTAGES & CONSTRAINTS)
// --------------------------------------------------------------------------

export const RURAL_ECONOMIC_ENVIRONMENT = {
  potentialAdvantages: [
    'Lower overhead costs (rent, setup space, storage)',
    'Direct proximity to natural resources and raw agricultural produce',
    'Government development support, subsidies (PMEGP 35%, Mudra, PMFME)',
    'Abundant local agro and livestock production',
    'Underserved rural consumer markets and local service gaps',
    'Lower-cost access to farm-gate agricultural and artisanal inputs'
  ],
  potentialConstraints: [
    'Weaker infrastructure (unscheduled power cuts, unpaved monsoon roads)',
    'Transportation and last-mile logistics limitations',
    'Intermittent digital connectivity and low smartphone literacy',
    'Seasonal demand cycles tied to harvest and festival seasons',
    'Fluctuating disposable household income across seasons',
    'Limited local purchasing power for non-essential premium goods',
    'Limited access to specialized repair, veterinary, or technical services',
    'Supply-chain bottlenecks for spare parts and specialized packaging'
  ]
};

// --------------------------------------------------------------------------
// 2. 10 CORE RURAL ENTREPRENEURSHIP PRINCIPLES
// --------------------------------------------------------------------------

export const CORE_RURAL_PRINCIPLES = [
  '1. Solve a real local problem (unmet village need, avoidable travel to town).',
  '2. Use resources that are reasonably accessible locally (crop produce, minerals, local skills).',
  '3. Match the entrepreneur’s available capital (never borrow excessively at launch).',
  '4. Match the entrepreneur’s skills or provide a realistic, short training path.',
  '5. Have identifiable, paying customers (do not rely on theoretical village population).',
  '6. Have a realistic route to market (weekly markets, village shops, WhatsApp, FPOs).',
  '7. Be capable of starting at an appropriate micro scale.',
  '8. Be capable of gradual, phased expansion out of retained profits.',
  '9. Maintain sufficient working capital buffer (minimum 30 days operating expenses).',
  '10. Be tested and validated with real customers before taking on bank debt.'
];

// --------------------------------------------------------------------------
// 3. THE 20 FOUNDATIONAL RURAL BUSINESS MODELS (KNOWLEDGE ONTOLOGY)
// --------------------------------------------------------------------------

export const TWENTY_RURAL_BUSINESS_MODELS: Record<string, RuralBusinessModelKnowledge> = {
  laundry_services: {
    id: 'laundry_services',
    name: 'Laundry Services / Franchise',
    nameNative: {
      mr: 'लाँड्री व व्यावसायिक कपडे धुलाई केंद्र',
      hi: 'लॉन्ड्री व ड्राई क्लीनिंग सेवा केंद्र',
      en: 'Professional Laundry Services & Franchise'
    },
    category: 'Personal Services',
    concept: 'Provide professional washing, ironing, and dry-cleaning services in rural or semi-urban hubs where institutional or household demand exists.',
    potentialCustomers: ['Rural professionals (teachers, bank staff)', 'Hostel students', 'Highway dhabas & hotels', 'Event caterers', 'Nuclear families'],
    advantages: ['Standardized operating procedures in franchise models', 'Recurring customer relationships', 'High cash flow frequency'],
    criticalRisks: ['Water quality and irregular supply', 'Frequent electricity load-shedding', 'High initial equipment maintenance cost'],
    sourceContextInvestmentRange: '₹3,00,000 – ₹8,00,000 (Franchise/Setup)',
    sourceContextRevenueExample: 'Illustrative: ₹1,50,000 – ₹3,00,000 monthly gross in dense semi-urban centers',
    validationChecklist: ['Verify reliable clean water supply', 'Check electricity backup cost', 'Survey local institutional laundry needs within 5 km'],
    resourceDependencies: ['Clean water connection', 'Commercial power connection', 'Ironing and washing equipment'],
    scalabilityPath: 'Add pickup/delivery routes to neighboring villages → Tie up with local wedding halls and hospitals.',
    disclaimer: 'Source-context illustrative figures. Viability requires high customer density; verify local water and electricity reliability.'
  },

  dairy_farming: {
    id: 'dairy_farming',
    name: 'Dairy Farming & Value-Added Milk Products',
    nameNative: {
      mr: 'दुग्ध व्यवसाय व मूल्यवर्धित दूध उत्पादने (पनीर/दही/तूप)',
      hi: 'डेयरी फार्मिंग व मूल्यवर्धित दुग्ध उत्पाद',
      en: 'Dairy Farming & Value-Added Milk Products'
    },
    category: 'Livestock & Food Processing',
    concept: 'Milk production with on-site conversion into high-margin products like paneer, curd, and ghee to capture retail value.',
    potentialCustomers: ['Local households', 'Highway restaurants & dhabas', 'Sweet shops (halwais)', 'Cooperative chilling centers'],
    advantages: ['Daily recurring product demand', 'Immediate liquidity', 'High value-addition margin on paneer and ghee (30-40%)'],
    criticalRisks: ['Animal disease and mortality', 'High cattle feed and fodder costs', 'Veterinary doctor unavailability', 'Monsoon spoilage'],
    sourceContextInvestmentRange: '₹2,50,000 – ₹7,00,000 (depending on herd size and processing equipment)',
    validationChecklist: ['Confirm green fodder and clean water availability year-round', 'Identify vet support within 10 km', 'Verify local chilling/refrigeration backup'],
    resourceDependencies: ['Cattle shed', 'Perennial water', 'Chilling unit / Deep freezer', 'Green fodder land'],
    scalabilityPath: 'Start with 2-3 cows/buffaloes → Process unsold milk into ghee/paneer → Expand herd from milk sales.',
    disclaimer: 'NEVER recommend Dairy simply because the user lives in a village. Animal health, feed costs, and electricity backup must be strictly verified.'
  },

  poultry_farming: {
    id: 'poultry_farming',
    name: 'Poultry Farming (Broiler & Layer)',
    nameNative: {
      mr: 'कुक्कुटपालन (ब्रॉयलर मांस व लेयर अंडी उत्पादन)',
      hi: 'मुर्गी पालन (ब्रायलर व लेयर फार्मिंग)',
      en: 'Poultry Farming (Broiler & Layer)'
    },
    category: 'Livestock & Animal Husbandry',
    concept: 'Commercial rearing of birds for meat (broilers) or eggs (layers). Layer and broiler models have distinct cash-flow profiles.',
    potentialCustomers: ['Local meat shops', 'Wholesale chicken dealers', 'Hotels & restaurants', 'Village retail consumers'],
    advantages: ['Broilers: Quick 35-45 day cash cycle', 'Layers: Daily continuous egg revenue', 'High local protein demand'],
    criticalRisks: ['Severe epidemic/disease mortality (Bird flu, Ranikhet)', 'Extreme feed price volatility', 'Seasonal price crashes (Shravan/festivals)'],
    sourceContextInvestmentRange: '₹1,50,000 – ₹5,00,000 (Small batch 500-1000 birds)',
    validationChecklist: ['Check proximity to residential areas (odor/regulations)', 'Confirm chick supply hatchery reliability', 'Secure buyer purchase agreement'],
    resourceDependencies: ['Well-ventilated shed', 'Clean drinking water', 'Feed storage', 'Biosecurity fencing'],
    scalabilityPath: 'Batch rearing (500 birds) → Contract farming integration → Direct meat retail shop.',
    disclaimer: 'Broiler and layer models have fundamentally different working capital and cash-flow cycles. Biosecurity is critical.'
  },

  mushroom_cultivation: {
    id: 'mushroom_cultivation',
    name: 'Mushroom Cultivation & Processing',
    nameNative: {
      mr: 'अळिंबी (मशरूम) उत्पादन व प्रक्रिया',
      hi: 'मशरूम उत्पादन व पैकेजिंग',
      en: 'Mushroom Cultivation & Packaging'
    },
    category: 'Horticulture & Indoor Agro',
    concept: 'Controlled indoor farming of button or oyster mushrooms utilizing agricultural waste substrate (paddy/wheat straw).',
    potentialCustomers: ['Town vegetable markets', 'Hotels & catering businesses', 'Health-conscious consumers', 'Canning/pickle processors'],
    advantages: ['Minimal land required (vertical indoor racks)', 'Short production cycle (25-35 days)', 'High value per kg (₹120-₹200/kg)'],
    criticalRisks: ['Bacterial/fungal contamination', 'Strict temperature/humidity maintenance needs', 'Rapid perishability without cold storage'],
    sourceContextInvestmentRange: '₹50,000 – ₹2,00,000 (Micro indoor unit)',
    validationChecklist: ['Verify straw substrate availability', 'Test local retail acceptance of fresh mushrooms', 'Ensure room humidity control tools'],
    resourceDependencies: ['Insulated dark room / hut', 'Substrate (straw)', 'Spawn (seed)', 'Sprayers & hygrometer'],
    scalabilityPath: 'Fresh oyster sales → Button mushroom climate-controlled rooms → Dried mushroom powder / pickle value addition.',
    disclaimer: 'Never promise guaranteed yields. Requires strict hygiene, humidity control, and immediate same-day local distribution.'
  },

  beekeeping_honey: {
    id: 'beekeeping_honey',
    name: 'Beekeeping & Pure Honey Production',
    nameNative: {
      mr: 'मधमाशी पालन व शुद्ध मध उत्पादन',
      hi: 'मधुमक्खी पालन व शहद प्रसंस्करण',
      en: 'Beekeeping & Pure Honey Production'
    },
    category: 'Agro-Allied & Value Addition',
    concept: 'Apiary management with bee boxes placed in crop fields/orchards to harvest raw honey, beeswax, and provide pollination services.',
    potentialCustomers: ['Local households', 'Ayurvedic doctors/pharmacies', 'Weekly markets', 'Urban specialty food buyers'],
    advantages: ['Dual benefit: honey sales + 20-30% higher crop yields via pollination', 'Low daily labor requirement', 'Long shelf life of honey'],
    criticalRisks: ['Pesticide spraying in surrounding farms killing colonies', 'Absconding bees during lean flora periods', 'Seasonal flora dependency'],
    sourceContextInvestmentRange: '₹40,000 – ₹1,50,000 (10 to 30 bee boxes)',
    validationChecklist: ['Survey flowering crops within 2 km radius', 'Confirm neighboring farmers will coordinate pesticide timing', 'Obtain basic apiary handling training'],
    resourceDependencies: ['Bee boxes & colonies', 'Bee veil & smoker', 'Honey extraction centrifuge', 'Flora mapping'],
    scalabilityPath: '10 boxes pilot → Move boxes across seasons (migratory beekeeping) → Branded glass-bottle retail honey.',
    disclaimer: 'Honey yields depend on flora seasons and weather. The number of hives and yield must be treated as scenario estimates, not guarantees.'
  },

  goat_farming: {
    id: 'goat_farming',
    name: 'Goat Farming (Meat & Breeding)',
    nameNative: {
      mr: 'शेळीपालन व्यवसाय (मांस व पैदास केंद्र)',
      hi: 'बकरी पालन (मांस व प्रजनन केंद्र)',
      en: 'Commercial Goat Farming'
    },
    category: 'Livestock & Animal Husbandry',
    concept: 'Stall-fed (semi-intensive) or grazing-based rearing of prolific goat breeds (Osmanabadi, Sirohi, Black Bengal) for meat and breeding stock.',
    potentialCustomers: ['Mutton butchers', 'Other farmers seeking breeding stock', 'Festival markets (Bakrid)', 'Livestock weekly mandis'],
    advantages: ['High feed-to-meat conversion', 'Prolific breeding (twins common)', 'High rural liquidity ("poor man’s cow")'],
    criticalRisks: ['High kid mortality if unsheltered', 'PPR and enterotoxemia outbreaks', 'Fodder shortage in dry summer'],
    sourceContextInvestmentRange: '₹1,00,000 – ₹3,50,000 (Unit of 10 females + 1 buck)',
    validationChecklist: ['Verify grazing land or stall-feed fodder arrangement', 'Confirm deworming and vaccination schedule with local vet', 'Check local livestock market rates'],
    resourceDependencies: ['Elevated slatted-floor shed', 'Fodder chaff cutter', 'Watering troughs', 'Clean boundary'],
    scalabilityPath: 'Start with 10+1 unit → Retain female kids to grow breeding herd → Sell adult male bucks at festive peak rates.',
    disclaimer: 'Source material figures are illustrative models, not guaranteed returns. Mortality control and disease vaccination are make-or-break.'
  },

  food_processing_packaging: {
    id: 'food_processing_packaging',
    name: 'Local Food Processing & Packaging',
    nameNative: {
      mr: 'स्थानिक अन्न प्रक्रिया व पॅकेजिंग (मसाले, पापड, लोणचे, पीठ)',
      hi: 'खाद्य प्रसंस्करण व ब्रांडेड पैकेजिंग (मसाले, अचार, स्नैक्स)',
      en: 'Food Processing & Value-Added Packaging'
    },
    category: 'Food Processing & Manufacturing',
    concept: 'Sourcing surplus local crops and converting them into branded shelf-stable products (flour, spice blends, dehydrated vegetables, pickles, snacks).',
    potentialCustomers: ['Village grocery shops (kirana)', 'Nearby town markets', 'Highway travelers', 'Hostels & catering units'],
    advantages: ['Captures 30-50% value-addition margin', 'Utilizes cheap seasonal raw material abundance', 'Eligible for PMFME 35% subsidy'],
    criticalRisks: ['FSSAI compliance and food safety lapses', 'Working capital locked in retail credit (udhaari)', 'Moisture/pest damage in packaging'],
    sourceContextInvestmentRange: '₹50,000 – ₹3,00,000 (Micro processing setup)',
    validationChecklist: ['Inspect raw material seasonal wholesale prices', 'Test sample taste with 20 local families', 'Calculate cost per 100g sealed pouch'],
    resourceDependencies: ['Pulverizer / Grinder / Slicer', 'Impulse pouch sealer', 'Accurate digital balance', 'Food-grade packaging bags'],
    scalabilityPath: 'Unbranded bulk supply → FSSAI registered sealed pouches → Distribution across 50 nearby village kirana shops.',
    disclaimer: 'The highest potential rural sector, but requires strict quality control, packaging aesthetics, and disciplined receivables collection.'
  },

  handicraft_artisan: {
    id: 'handicraft_artisan',
    name: 'Handicraft & Artisan Products',
    nameNative: {
      mr: 'पारंपरिक हस्तकला व कारागीर उत्पादने',
      hi: 'हस्तशिल्प व पारंपरिक कला उत्पाद',
      en: 'Handicraft & Artisan Products'
    },
    category: 'Textiles & Handicrafts',
    concept: 'Leveraging regional cultural crafts (pottery, wood carving, bamboo, weaving, metal work) with modern functional design and urban/online sales.',
    potentialCustomers: ['Urban home-decor buyers', 'Tourists and cultural visitors', 'Exhibition/Mela visitors', 'Corporate gifting'],
    advantages: ['High cultural differentiation', 'Low industrial capital requirement', 'Support from Khadi & Village Industries Board (KVIC)'],
    criticalRisks: ['Slow inventory turnover', 'Price pressure from mass-produced plastic/synthetic alternatives', 'Lack of direct buyer linkages'],
    sourceContextInvestmentRange: '₹25,000 – ₹1,50,000',
    validationChecklist: ['Examine if artisan skills already exist in family/cluster', 'Test product utility in a nearby town lifestyle exhibition', 'Evaluate shipping/courier costs'],
    resourceDependencies: ['Traditional tools', 'Local natural raw material', 'Finishing & protective packaging', 'Product photo/catalog'],
    scalabilityPath: 'Local fairs (melas) → Regional craft exhibitions → Direct online selling on ONDC / e-commerce platforms.',
    disclaimer: 'Do not assume an artisan business is viable merely because a craft exists. Customer demand and unit margins must be proven.'
  },

  seed_production: {
    id: 'seed_production',
    name: 'Certified Seed Production & Nursery Supply',
    nameNative: {
      mr: 'बियाणे उत्पादन व रोपवाटिका पुरवठा',
      hi: 'प्रमाणित बीज उत्पादन व आपूर्ति',
      en: 'Seed Production & Certified Seed Supply'
    },
    category: 'Agriculture & Technical Agro',
    concept: 'Multiplying foundation seed varieties of vegetables, pulses, and oilseeds under agricultural university protocols for local sale to farmers.',
    potentialCustomers: ['Neighboring farming community', 'FPOs and agricultural cooperatives', 'Agri-input dealers'],
    advantages: ['High farmer willingness to pay for high-germination seed', 'Recurring annual sowing demand', 'High profit per hectare'],
    criticalRisks: ['Rigid seed certification and legal purity standards', 'Cross-pollination contamination', 'Weather damage at seed-setting stage'],
    sourceContextInvestmentRange: '₹1,00,000 – ₹4,00,000',
    validationChecklist: ['Verify university or KVK foundation seed source', 'Check isolation distance from neighboring crops', 'Understand State Seed Certification rules'],
    resourceDependencies: ['Irrigated farm plot', 'Seed grading screens', 'Moisture-proof packing', 'Seed germination testing kit'],
    scalabilityPath: 'Vegetable seed plots → Institutional tie-up with FPOs → Full-fledged seed distribution license.',
    disclaimer: 'Highly technical and regulated business. Requires strict compliance with seed certification protocols.'
  },

  nursery_floriculture: {
    id: 'nursery_floriculture',
    name: 'Plant Nursery & Commercial Floriculture',
    nameNative: {
      mr: 'रोपवाटिका (नर्सरी) व फुलशेती उद्योग',
      hi: 'पौधशाला (नर्सरी) व पुष्प उत्पादन',
      en: 'Plant Nursery & Floriculture'
    },
    category: 'Horticulture',
    concept: 'Propagating fruit saplings (mango, pomegranate, citrus), ornamental plants, landscaping greens, and fresh flowers for religious/event use.',
    potentialCustomers: ['Local farmers setting up orchards', 'Urban home gardeners', 'Landscaping contractors', 'Flower decorators & temples'],
    advantages: ['High margin on grafted fruit saplings (50-70%)', 'Continuous daily flower sales in pilgrim clusters', 'Asset value appreciates as plants grow'],
    criticalRisks: ['Water scarcity in peak summer', 'Pest outbreaks wiping out mother stock', 'Transport damage during plant delivery'],
    sourceContextInvestmentRange: '₹75,000 – ₹3,00,000',
    validationChecklist: ['Ensure guaranteed year-round irrigation source', 'Survey fruit plantation trends in the taluka', 'Secure reliable mother plants for grafting'],
    resourceDependencies: ['Green shade-net house', 'Perennial borewell/well', 'Rooting media (cocopeat/vermicompost)', 'Polybags & potting soil'],
    scalabilityPath: 'Local vegetable seedling sales → Grafted commercial fruit plants → Urban decorative landscape supply.',
    disclaimer: 'Water reliability is non-negotiable. Sapling production requires 4-6 months before first revenue generation.'
  },

  aquaculture_fish: {
    id: 'aquaculture_fish',
    name: 'Aquaculture & Freshwater Fish Farming',
    nameNative: {
      mr: 'मत्स्यपालन व गोड्या पाण्यातील मासेमारी उद्योग',
      hi: 'मत्स्य पालन (तालाब व टैंक आधारित मछली पालन)',
      en: 'Freshwater Aquaculture & Fish Farming'
    },
    category: 'Fisheries & Aquaculture',
    concept: 'Pond culture or tank culture of fast-growing commercial species (Rohu, Catla, Mrigal, Tilapia, freshwater Prawns) with supplementary feeding.',
    potentialCustomers: ['Local fish markets', 'Town wholesalers', 'Highway seafood restaurants', 'Village consumers'],
    advantages: ['Surging protein demand and firm meat prices', 'Government capital subsidy under PMMSY (up to 40-60%)', 'High yield per acre'],
    criticalRisks: ['Water drying up or oxygen depletion (hypoxia)', 'Poaching and predator birds', 'Fingerling mortality during stocking'],
    sourceContextInvestmentRange: '₹1,50,000 – ₹6,00,000 (Half-acre to 1-acre leased/owned pond)',
    validationChecklist: ['Verify water retention capacity of pond soil (clay content)', 'Ensure uninterrupted water source for 8-10 months', 'Locate reliable fingerling nursery'],
    resourceDependencies: ['Excavated pond / Biofloc tanks', 'Aerator / Water pump', 'Quality floating fish feed', 'Sampling cast nets'],
    scalabilityPath: 'Single community pond lease → Multi-species polyculture → On-farm live fish counter.',
    disclaimer: 'Never recommend fish farming without physically verifying perennial water depth and soil water-retention capability.'
  },

  vermicompost_production: {
    id: 'vermicompost_production',
    name: 'Vermicompost & Organic Bio-Fertilizer',
    nameNative: {
      mr: 'गांडूळ खत निर्मिती व सेंद्रिय खत उद्योग',
      hi: 'केंचुआ खाद (वर्मीकंपोस्ट) निर्माण इकाई',
      en: 'Vermicompost & Organic Fertilizer'
    },
    category: 'Agro-Inputs & Waste-to-Wealth',
    concept: 'Converting cow dung, agricultural stubble, and organic residue into premium vermicompost using earthworms (Eisenia fetida).',
    potentialCustomers: ['Organic vegetable/fruit farmers', 'Sugarcane & grape growers', 'Urban plant nurseries', 'Home gardeners'],
    advantages: ['Extremely low capital barrier', 'Utilizes free or cheap local cattle dung waste', 'Growing organic agriculture demand'],
    criticalRisks: ['Moisture and heat management (direct sunlight kills earthworms)', 'Termite or red ant attacks', 'Seasonal fertilizer buying cycle'],
    sourceContextInvestmentRange: '₹30,000 – ₹1,20,000 (4 to 10 HDPE vermi-beds)',
    validationChecklist: ['Confirm free/cheap cow dung source within 3 km', 'Check organic farmer density in the block', 'Obtain HDPE UV-stabilized beds'],
    resourceDependencies: ['HDPE vermi-beds', 'Cow dung & dry biomass', 'Eisenia fetida earthworm culture', 'Sieving machine / manual screen'],
    scalabilityPath: 'Loose bulk sales to neighbor farmers → 25kg and 50kg branded bags → Liquid vermiwash foliar spray bottles.',
    disclaimer: 'Excellent entry-level enterprise for rural youth. Requires maintaining 60% moisture and shaded conditions.'
  },

  rural_tourism_homestays: {
    id: 'rural_tourism_homestays',
    name: 'Agro-Tourism & Rural Homestays',
    nameNative: {
      mr: 'कृषी पर्यटन व ग्रामीण होमस्टे',
      hi: 'कृषि पर्यटन व ग्रामीण होमस्टे',
      en: 'Agro-Tourism & Rural Homestays'
    },
    category: 'Hospitality & Tourism',
    concept: 'Hosting urban families on functional farms to experience authentic rural life, traditional village cuisine, bullock cart rides, and fresh farm harvests.',
    potentialCustomers: ['Urban families within 2-4 hours drive', 'School educational field trips', 'Weekend IT professionals', 'Cultural tourists'],
    advantages: ['High revenue realization per visitor', 'Creates market for home-cooked food and farm produce', 'Utilizes existing ancestral farmhouse'],
    criticalRisks: ['Extreme weekend/holiday seasonality', 'High expectations for hygienic sanitation and safe drinking water', 'Online marketing dependency'],
    sourceContextInvestmentRange: '₹1,50,000 – ₹6,00,000 (Renovation of rooms, clean washrooms, activity areas)',
    validationChecklist: ['Verify motorable road connectivity from nearest highway', 'Ensure clean western toilets and continuous water', 'Identify 3 unique local attractions'],
    resourceDependencies: ['Furnished rooms with clean bedding', 'Hygienic kitchen', 'Farm activities (dairy/fruit harvesting)', 'Local hospitality team'],
    scalabilityPath: 'Day visits with traditional lunch → Overnight room homestay → Weekend farm harvest festival packages.',
    disclaimer: 'Never recommend rural tourism merely because a location is rural. Scenic appeal, safety, road access, and spotless sanitation are mandatory.'
  },

  mobile_repair_electronics: {
    id: 'mobile_repair_electronics',
    name: 'Mobile Phone & Electronics Repair Shop',
    nameNative: {
      mr: 'मोबाईल रिपेअरिंग व इलेक्ट्रॉनिक्स सेवा केंद्र',
      hi: 'मोबाइल रिपेयरिंग व इलेक्ट्रॉनिक्स सेवा दुकान',
      en: 'Mobile Repair & Digital Electronics Hub'
    },
    category: 'Technical Repair Services',
    concept: 'Providing smartphone screen replacement, charging port repair, software updates, phone accessories, and micro-electronics maintenance.',
    potentialCustomers: ['Village smartphone users', 'Youth & students', 'Farmers using mobile apps', 'Local shopkeepers'],
    advantages: ['Pure technical service with high labor margin (60-80%)', 'Year-round non-seasonal daily demand', 'Opportunity to sell accessories and recharge'],
    criticalRisks: ['Rapid component obsolescence', 'Risk of damaging expensive customer handsets during repair', 'Locking money in slow accessories stock'],
    sourceContextInvestmentRange: '₹40,000 – ₹1,50,000',
    validationChecklist: ['Ensure entrepreneur has verified repair skills / certificate', 'Establish weekly spare-parts supply line from city hub', 'Identify busy village center shop location'],
    resourceDependencies: ['SMD hot air gun & soldering station', 'Microscope / magnifier', 'Screen separator', 'Initial display/battery spare stock'],
    scalabilityPath: 'Basic hardware repair → Second-hand refurbished smartphone sales → Home appliance repair expansion.',
    disclaimer: 'Skill-driven business. Success depends on diagnostic speed, genuine spare parts, and trust.'
  },

  tailoring_garments: {
    id: 'tailoring_garments',
    name: 'Tailoring & Custom Garment Manufacturing',
    nameNative: {
      mr: 'शिवणकाम व रेडीमेड कपडे उत्पादन केंद्र',
      hi: 'सिलाई केंद्र व रेडीमेड वस्त्र निर्माण',
      en: 'Custom Tailoring & Apparel Manufacturing'
    },
    category: 'Textiles & Apparel',
    concept: 'Bespoke tailoring of women’s blouses, dresses, men’s shirts, school uniforms, alterations, and small-batch ready-to-wear garments.',
    potentialCustomers: ['Village women and families', 'Local private and zilla parishad schools (uniforms)', 'Festival shoppers', 'Nearby boutiques'],
    advantages: ['Low entry capital', 'Immediate cash realization upon delivery', 'Scalable from home by adding machines and local women workers'],
    criticalRisks: ['Intense festival rush (Diwali/Eid/Wedding) followed by lean months', 'Labor reliability when scaling', 'Fabric wastage during cutting'],
    sourceContextInvestmentRange: '₹20,000 – ₹1,20,000 (1 to 3 motorized sewing machines)',
    validationChecklist: ['Assess existing village tailoring wait times during peak season', 'Test stitching speed and finishing quality', 'Negotiate uniform contracts with schools'],
    resourceDependencies: ['Motorized sewing machine', 'Overlock machine', 'Cutting table & shears', 'Sewing accessories stock'],
    scalabilityPath: 'Home custom tailoring → Commercial shop with 3 workers → School uniform and institutional bulk production.',
    disclaimer: 'Low capital barrier makes it accessible, but disciplined delivery scheduling during festival surges is crucial.'
  },

  solar_installation_services: {
    id: 'solar_installation_services',
    name: 'Solar Equipment Installation & Maintenance',
    nameNative: {
      mr: 'सौर ऊर्जा उपकरणे बसवणे व देखभाल सेवा (पीएम सूर्यघर / कृषी पंप)',
      hi: 'सौर ऊर्जा उपकरण स्थापना व मेंटेनेंस सेवा',
      en: 'Solar Rooftop & Agri-Pump Installation Services'
    },
    category: 'Green Energy & Electrical Services',
    concept: 'Turnkey installation, earthing, net-metering assistance, and periodic cleaning/repair of rooftop solar (PM Surya Ghar) and solar water pumps (PM KUSUM).',
    potentialCustomers: ['Farmers seeking solar irrigation pumps', 'Rural homeowners facing power cuts', 'Poultry sheds and cold storages', 'Schools & hospitals'],
    advantages: ['Massive national government subsidy push (PM-KUSUM, PM Surya Ghar)', 'High project ticket size (₹1.5L to ₹5L)', 'Recurring panel cleaning and inverter AMC revenue'],
    criticalRisks: ['Safety risks with high-voltage DC electricity', 'Delays in net-metering clearance from local DISCOM', 'Heavy supplier credit requirements'],
    sourceContextInvestmentRange: '₹60,000 – ₹2,50,000 (Tools, testing equipment, channel partner dealership)',
    validationChecklist: ['Complete certified solar technician training (Suryamitra or ITI)', 'Tie up as authorized installer with a tier-1 solar distributor', 'Verify DISCOM rooftop application process'],
    resourceDependencies: ['Solar testing multimeter & clamp meter', 'Safety harness & crimping kit', 'Channel partner authorization', 'Service motorcycle'],
    scalabilityPath: 'Installation technician → Authorized equipment dealer → Solar water pump EPC contractor.',
    disclaimer: 'Never promise government subsidies without verifying current portal status and DISCOM guidelines. Electrical safety certification is mandatory.'
  },

  bakery_confectionery: {
    id: 'bakery_confectionery',
    name: 'Rural Bakery & Confectionery Unit',
    nameNative: {
      mr: 'ग्रामीण बेकरी व बेकरी उत्पादने (पाव, टोस्ट, बिस्किटे, केक)',
      hi: 'बेकरी व कन्फेक्शनरी इकाई (पाव, रस्क, बिस्कुट)',
      en: 'Rural Bakery & Packaged Confectionery'
    },
    category: 'Food Processing & Bakery',
    concept: 'Fresh daily production of local bread (pav), toast/rusk, khari, biscuits, and birthday cakes for village retail counters and tea stalls.',
    potentialCustomers: ['Village grocery stores', 'Roadside tea stalls (amruttulya)', 'Weekly markets', 'School canteens', 'Local birthday celebrators'],
    advantages: ['High daily consumption item in rural tea culture', 'Longer shelf life for toast and biscuits (30-60 days)', 'Attractive cash flow with daily van delivery'],
    criticalRisks: ['Strict food hygiene and pest control demands', 'High electricity/fuel cost for baking ovens', 'Perishability of fresh bread within 48 hours'],
    sourceContextInvestmentRange: '₹1,50,000 – ₹5,00,000 (Rotary rack oven or deck oven setup)',
    validationChecklist: ['Verify 3-phase power availability or wood/gas oven feasibility', 'Count daily tea stalls within 10 km that buy city pav', 'Test bread softness and shelf life'],
    resourceDependencies: ['Baking deck oven', 'Dough spiral mixer', 'Bread slicer & packaging heat sealer', 'Baking trays & delivery crates'],
    scalabilityPath: 'Fresh pav supply to 15 tea stalls → Long-life packaged toast & cookies in 50 kirana shops → Custom cream cake counter.',
    disclaimer: 'Requires consistent daily wake-up cycle (3 AM baking) and disciplined morning delivery logistics.'
  },

  transport_logistics: {
    id: 'transport_logistics',
    name: 'Rural First-Mile Transportation & Logistics',
    nameNative: {
      mr: 'ग्रामीण कृषी वाहतूक व फर्स्ट-माईल लॉजिस्टिक्स',
      hi: 'ग्रामीण परिवहन व फर्स्ट-माइल डिलीवरी सेवा',
      en: 'Rural First-Mile Transportation & Logistics'
    },
    category: 'Transportation & Logistics',
    concept: 'Operating small commercial vehicles (mini-trucks like Tata Ace/Mahindra Bolero) to transport farm produce to APMC mandis and deliver wholesale goods to villages.',
    potentialCustomers: ['Small vegetable/fruit farmers', 'Local building material shops', 'Fertilizer & cement dealers', 'E-commerce delivery hubs'],
    advantages: ['Continuous movement of goods between village and taluka market', 'Multiple revenue sources (morning vegetables, afternoon cement)', 'High asset resale value'],
    criticalRisks: ['High fuel and maintenance expenses eroding paper profits', 'Police/RTO compliance and insurance costs', 'Overloaded trips causing rapid vehicle breakdown'],
    sourceContextInvestmentRange: '₹1,00,000 – ₹2,50,000 (Down payment for commercial vehicle loan)',
    validationChecklist: ['Map daily APMC mandi trips needed by neighbor farmers', 'Calculate true net operating profit: Revenue minus (Fuel + EMI + Maintenance + Insurance + Driver)', 'Secure commercial driver license and permits'],
    resourceDependencies: ['Small commercial cargo vehicle', 'Commercial driving license & insurance', 'Tie-up with local dispatch points', 'GPS tracker'],
    scalabilityPath: 'Owner-driver single vehicle → Dedicated supply contract with 2 wholesale merchants → Fleet expansion.',
    disclaimer: 'Never calculate transport profitability using gross trip fares alone. Fuel, maintenance, insurance, permits, EMI, and tyre wear must be fully subtracted.'
  },

  digital_services_training: {
    id: 'digital_services_training',
    name: 'Digital Services & Citizen Center (CSC / Aaple Sarkar)',
    nameNative: {
      mr: 'आपले सरकार / सीएससी डिजिटल सेवा व संगणक केंद्र',
      hi: 'सीएससी डिजिटल सेवा व कंप्यूटर प्रशिक्षण केंद्र',
      en: 'CSC Citizen Digital Services & IT Training'
    },
    category: 'Digital Services & Education',
    concept: 'Providing citizen government documentation (7/12 extract, caste/income certificates, Aadhaar banking, PAN cards, DBT scheme enrollment) and basic computer literacy.',
    potentialCustomers: ['Farmers seeking land records and crop insurance', 'College students filing exam forms', 'Pensioners withdrawing cash via AePS', 'Job aspirants'],
    advantages: ['Extremely high footfall and village gratitude', 'Multiple government revenue commissions', 'Zero inventory risk'],
    criticalRisks: ['Frequent government portal server downtime', 'Unstable broadband connectivity', 'Cash liquidity risk during pension disbursement days'],
    sourceContextInvestmentRange: '₹50,000 – ₹1,80,000 (Computers, multi-function printer, biometric scanners)',
    validationChecklist: ['Verify existing CSC center density in the village gram panchayat', 'Ensure high-speed fiber or 4G connectivity', 'Obtain authorized CSC / VLE ID credentials'],
    resourceDependencies: ['2 Desktop computers / Laptops', 'High-speed multifunction printer & laminator', 'Biometric fingerprint scanner', 'UPS power backup'],
    scalabilityPath: 'Basic print/form filling → Aadhaar banking / Micro-ATM cash point → Evening MS-Office & Tally computer classes.',
    disclaimer: 'A crucial community service, but requires technical patience and strict adherence to data privacy regulations.'
  },

  agri_input_retail: {
    id: 'agri_input_retail',
    name: 'Agri-Input Retail Store & Advisory Hub',
    nameNative: {
      mr: 'कृषी सेवा केंद्र (बियाणे, खते, कीटकनाशके व सल्ला केंद्र)',
      hi: 'कृषि सेवा केंद्र (बीज, उर्वरक, कीटनाशक व परामर्श)',
      en: 'Agri-Input Retail & Technical Advisory'
    },
    category: 'Agri-Retail & Advisory',
    concept: 'Licensed retail store stocking certified seeds, bio-fertilizers, crop nutrition, drip irrigation spares, and providing responsible agronomy advice.',
    potentialCustomers: ['Crop farmers across 3-5 surrounding villages', 'Orchard growers', 'Polyhouse / green-house farmers', 'Dairy farmers needing fodder seeds'],
    advantages: ['Essential, non-negotiable farming input with guaranteed seasonal purchase', 'High customer loyalty when advice yields good harvests', 'Wholesale company credit terms after established track record'],
    criticalRisks: ['Massive pressure for seasonal credit (farmers pay only after harvest)', 'Strict licensing inspections (Agriculture Dept)', 'Inventory holding costs of unsold seasonal seeds'],
    sourceContextInvestmentRange: '₹2,50,000 – ₹7,00,000 (Licensing deposit, shop lease, opening stock)',
    validationChecklist: ['Verify educational qualification for pesticide license (B.Sc Agriculture or 1-year diploma)', 'Assess farmer credit appetite and establish strict 20% credit cap', 'Secure distributorship with trusted seed/fertilizer brands'],
    resourceDependencies: ['Commercial shop with concrete floor', 'Valid Agriculture Dept License', 'POS billing software & GST registration', 'Seed storage racks'],
    scalabilityPath: 'Basic seeds and fertilizers → Drip irrigation fittings and sprayers → Soil testing advisory laboratory.',
    disclaimer: 'Mandatory technical licensing required. Never dispense pesticides or fertilizers without verified agronomic knowledge.'
  }
};

// --------------------------------------------------------------------------
// 4. 9-STEP BUSINESS VALIDATION PROCESS (PREVENT PREMATURE BORROWING)
// --------------------------------------------------------------------------

export const NINE_STEP_VALIDATION_PROCESS = [
  { step: 1, name: 'Identify the local customer problem', detail: 'Who in the village or nearby town has a real pain point, high cost, or long travel time?' },
  { step: 2, name: 'Talk to 5–10 real potential customers', detail: 'Do not ask "Is this a good idea?" Ask "When was the last time you bought this? How much did you pay? What was unsatisfactory?"' },
  { step: 3, name: 'Identify existing competitors', detail: 'Who is already selling this locally or bringing it from the city? Why do customers buy from them?' },
  { step: 4, name: 'Determine current market price', detail: 'Record the exact prices customers currently pay for different grades or options.' },
  { step: 5, name: 'Identify reliable suppliers and input costs', detail: 'Get real wholesale quotes for raw materials, packaging, and transport.' },
  { step: 6, name: 'Test a small version (Pilot)', detail: 'Produce or purchase a micro batch (e.g. 25 kg or 10 units) without buying heavy machinery.' },
  { step: 7, name: 'Measure actual sales in cash', detail: 'Sell in the weekly market or to local shops. Measure how fast customers pay real cash.' },
  { step: 8, name: 'Calculate actual net margin', detail: 'Subtract all true costs: raw material + electricity + packaging + transport + wastage. Find true profit.' },
  { step: 9, name: 'Only then consider expansion or bank borrowing', detail: 'Scale out of verified operating profits or proceed to structured PMEGP/Mudra loans with proven demand.' }
];

// --------------------------------------------------------------------------
// 5. SCALE STRATEGY & FINANCIAL DISCIPLINE
// --------------------------------------------------------------------------

export const SCALE_STRATEGY_PHASES = [
  'Phase 1: Validate (Talk to customers, confirm pain point)',
  'Phase 2: Start Small (Micro setup with minimal capital exposure)',
  'Phase 3: Achieve Stable Sales (Consistent weekly repeat orders)',
  'Phase 4: Improve Margins (Cut wastage, negotiate bulk raw materials)',
  'Phase 5: Build Working-Capital Reserve (Lock 30-45 days operating cash)',
  'Phase 6: Expand (Add capacity, hire first worker, enter neighbor villages)',
  'Phase 7: Consider Formal Financing (PMEGP / Mudra / Bank loan backed by proven track record)'
];

// --------------------------------------------------------------------------
// 6. KNOWLEDGE RETRIEVAL HELPER
// --------------------------------------------------------------------------

export const getRuralBusinessModel = (id: string): RuralBusinessModelKnowledge | undefined => {
  return TWENTY_RURAL_BUSINESS_MODELS[id];
};

export const getAllRuralBusinessModels = (): RuralBusinessModelKnowledge[] => {
  return Object.values(TWENTY_RURAL_BUSINESS_MODELS);
};

export const retrieveRelevantRuralKnowledge = (
  query: string,
  businessCategory: string
): {
  constraints: RuralConstraintDimension[];
  opportunities: RuralOpportunityDimension[];
  candidateModels: RuralBusinessModelKnowledge[];
} => {
  const q = query.toLowerCase();
  const matchedConstraints: RuralConstraintDimension[] = [];
  const matchedOpportunities: RuralOpportunityDimension[] = [];
  const matchedModels: RuralBusinessModelKnowledge[] = [];

  // Match constraints
  if (q.includes('udhaari') || q.includes('उधारी') || q.includes('credit') || q.includes('loss') || q.includes('तोटा') || q.includes('पैसे बुडले')) {
    matchedConstraints.push({
      category: 'Credit & Risk Management',
      description: 'High pressure for local credit sales (udhaari) leading to bad debts and working capital erosion.',
      typicalSymptoms: ['High credit sales ledger', 'Suppliers demanding cash while buyers demand credit', 'Working capital locked in receivables'],
      recommendedMitigations: {
        mr: 'उधारीवर कडक मर्यादा (कमाल १०-१५%) ठेवणे, रोख खरेदीवर २-३% सवलत देणे आणि नवीन ग्राहकांना केवळ रोख व्यवहार करणे.',
        hi: 'उधारी पर सख्त सीमा (अधिकतम १०-१५%) रखें, नकद भुगतान पर छोटी छूट दें और नए ग्राहकों को केवल नकद दें।',
        en: 'Cap credit sales strictly below 10-15%, incentivize instant cash with modest 2-3% discounts, and enforce cash-only for first-time buyers.'
      }
    });
  }

  if (q.includes('middleman') || q.includes('दलाल') || q.includes('कमिशन') || q.includes('broker') || q.includes('मार्केट') || q.includes('customer')) {
    matchedOpportunities.push({
      category: 'Service Differentiation',
      description: 'Direct sales channels that bypass village commission agents.',
      keyEnablers: ['Weekly market stalls', 'Direct town supply', 'WhatsApp ordering'],
      strategicAdvice: {
        mr: 'शहरात जाण्याचा वेळ व खर्च वाचवणारी घरपोच दुरुस्ती किंवा डिलिव्हरी सेवा देऊन ग्राहकांचा पक्का विश्वास मिळवा.',
        hi: 'शहर जाने का समय और खर्च बचाने वाली घरपहुंच सेवा देकर स्थायी ग्राहक आधार बनाएं।',
        en: 'Provide on-site or doorstep services that save villagers expensive travel trips to nearby towns.'
      }
    });
  }

  // Match business models
  for (const model of Object.values(TWENTY_RURAL_BUSINESS_MODELS)) {
    const mName = model.name.toLowerCase();
    const mCat = model.category.toLowerCase();
    const mId = model.id.toLowerCase();
    if (q.includes(mId) || q.includes(mName) || mCat.includes(businessCategory.toLowerCase()) || q.includes(mCat)) {
      matchedModels.push(model);
    }
  }

  // Baseline defaults
  if (matchedConstraints.length === 0) {
    matchedConstraints.push({
      category: 'Finance & Liquidity',
      description: 'Working capital discipline and liquid cash reserves.',
      typicalSymptoms: ['Cash flow mismatch', 'Seasonal inventory holding'],
      recommendedMitigations: {
        mr: 'किमान ३० दिवसांचे खेळते भांडवल बाजूला ठेवा.',
        hi: 'कम से कम ३० दिनों की कार्यशील पूंजी अलग रखें।',
        en: 'Maintain minimum 30 days of operating expenses as cash reserve.'
      }
    });
  }

  if (matchedOpportunities.length === 0) {
    matchedOpportunities.push({
      category: 'Value Addition',
      description: 'Local processing and branded packaging of agricultural surplus.',
      keyEnablers: ['Small-scale sorting', 'Sealed pouch packaging'],
      strategicAdvice: {
        mr: 'स्थानिक कच्च्या मालावर प्रक्रिया करून ३०-५०% वाढीव नफा मिळवा.',
        hi: 'कच्चा माल सीधे बेचने के बजाय प्रसंस्करण करके अधिक लाभ कमाएं।',
        en: 'Process raw produce locally to capture 30-50% higher value-addition margins.'
      }
    });
  }

  return {
    constraints: matchedConstraints,
    opportunities: matchedOpportunities,
    candidateModels: matchedModels.slice(0, 3)
  };
};
