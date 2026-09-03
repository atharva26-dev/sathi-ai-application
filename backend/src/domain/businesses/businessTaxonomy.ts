/**
 * SAATHI — Scalable Business Category Taxonomy
 * 
 * Hierarchical multi-sector taxonomy covering 10 major economic domains.
 * Provides granular archetype definitions, capital tiers, working capital rules,
 * asset dependencies, and regulatory prerequisites (FSSAI, Udyam, Shop Act).
 */

export type SectorCode =
  | 'AGRICULTURE'
  | 'FOOD_PROCESSING'
  | 'RETAIL'
  | 'SERVICES'
  | 'MANUFACTURING'
  | 'CRAFTS'
  | 'LIVESTOCK'
  | 'TOURISM'
  | 'RENEWABLE_ENERGY'
  | 'DIGITAL';

export type CapitalTier = 'MICRO_UNDER_50K' | 'SMALL_50K_2L' | 'MEDIUM_2L_5L' | 'GROWTH_ABOVE_5L';

export interface BusinessTaxonomyArchetype {
  id: string;
  sector: SectorCode;
  subSector: string;
  canonicalTitle: string;
  titleNative: {
    en: string;
    mr: string;
    hi: string;
    ta?: string;
  };
  capitalTier: CapitalTier;
  minimumCapitalRequired: number;
  recommendedStartingCapital: number;
  workingCapitalBufferDays: number;
  workingCapitalPercentRecommended: number; // e.g. 35 = 35% of total capital
  requiredSkillLevel: 'UNSKILLED_TRAINABLE' | 'SEMI_SKILLED' | 'SKILLED_TECHNICAL' | 'LICENSED_PROFESSIONAL';
  keyAssetRequirements: string[];
  seasonalSensitivity: 'HIGH' | 'MEDIUM' | 'LOW';
  regulatoryPrerequisites: Array<{
    licenseName: string;
    issuingAuthority: string;
    mandatoryBeforeStart: boolean;
  }>;
  operationalRiskWarning: {
    mr: string;
    hi: string;
    en: string;
  };
}

export const BUSINESS_TAXONOMY_ARCHETYPES: Record<string, BusinessTaxonomyArchetype> = {
  // ==========================================================================
  // 1. AGRICULTURE & AGRI-SERVICES
  // ==========================================================================
  commercial_nursery: {
    id: 'commercial_nursery',
    sector: 'AGRICULTURE',
    subSector: 'Horticulture & Nursery',
    canonicalTitle: 'Commercial Plant Nursery & Seedling Production',
    titleNative: {
      en: 'Commercial Plant Nursery & Seedling Production',
      mr: 'हाय-टेक रोपवाटिका (नर्सरी) व दर्जेदार रोपे निर्मिती',
      hi: 'व्यावसायिक पौधशाला (नर्सरी) व उन्नत पौधे निर्माण'
    },
    capitalTier: 'SMALL_50K_2L',
    minimumCapitalRequired: 60000,
    recommendedStartingCapital: 120000,
    workingCapitalBufferDays: 60,
    workingCapitalPercentRecommended: 40,
    requiredSkillLevel: 'SKILLED_TECHNICAL',
    keyAssetRequirements: ['शेडनेट हाऊस (Green Shade Net)', 'ड्रीप व फॉगर्स सिंचन प्रणाली', 'प्रो-ट्रे व कोकोपीट साठा'],
    seasonalSensitivity: 'HIGH',
    regulatoryPrerequisites: [
      { licenseName: 'Nursery Registration', issuingAuthority: 'District Agriculture Department', mandatoryBeforeStart: true },
      { licenseName: 'Udyam Registration', issuingAuthority: 'Ministry of MSME', mandatoryBeforeStart: false }
    ],
    operationalRiskWarning: {
      mr: 'पाणीटंचाई आणि हवामानातील अचानक बदलांमुळे नाजूक रोपे सुकण्याचा धोका असतो; नियमित पाणी व्यवस्थापन आवश्यक.',
      hi: 'पानी की कमी और मौसम परिवर्तन से पौधों को नुकसान हो सकता है; ड्रिप सिंचाई आवश्यक है।',
      en: 'Perennial water source is mandatory; young graft seedlings perish quickly under heat stress without foggers.'
    }
  },

  farm_machinery_rental: {
    id: 'farm_machinery_rental',
    sector: 'AGRICULTURE',
    subSector: 'Farm Mechanization',
    canonicalTitle: 'Custom Hiring Center & Farm Equipment Rental',
    titleNative: {
      en: 'Custom Hiring Center & Farm Equipment Rental',
      mr: 'शेती औजारे भाडेतत्त्वावर देणे केंद्र (Custom Hiring Center)',
      hi: 'कृषि उपकरण किराया केंद्र (कस्टम हायरिंग सेंटर)'
    },
    capitalTier: 'GROWTH_ABOVE_5L',
    minimumCapitalRequired: 250000,
    recommendedStartingCapital: 600000,
    workingCapitalBufferDays: 45,
    workingCapitalPercentRecommended: 25,
    requiredSkillLevel: 'SEMI_SKILLED',
    keyAssetRequirements: ['ट्रॅक्टर व रोटाव्हेटर', 'लेझर लँड लेव्हलर किंवा पेरणी यंत्र', 'पॉवर वीडर'],
    seasonalSensitivity: 'HIGH',
    regulatoryPrerequisites: [
      { licenseName: 'Vehicle Registration & Commercial Permit', issuingAuthority: 'RTO Transport Department', mandatoryBeforeStart: true },
      { licenseName: 'SMAM Scheme Subsidy Sanction', issuingAuthority: 'State Agriculture Department', mandatoryBeforeStart: false }
    ],
    operationalRiskWarning: {
      mr: 'पिकांच्या हंगामातच मागणी प्रचंड असते; ऑफ-सीझनमध्ये हप्ते व दुरुस्ती खर्च निघण्यासाठी पर्यायी वाहतूक कामे शोधावी लागतात.',
      hi: 'मौसमी मांग पर निर्भरता; ऑफ-सीजन में ईएमआई प्रबंधन के लिए पूर्व तैयारी रखें।',
      en: 'High seasonal concentration; machinery sits idle between sowing and harvest unless leveraged for rural haulage.'
    }
  },

  // ==========================================================================
  // 2. FOOD PROCESSING & VALUE ADDITION
  // ==========================================================================
  spice_grinding_pouching: {
    id: 'spice_grinding_pouching',
    sector: 'FOOD_PROCESSING',
    subSector: 'Spices & Condiments',
    canonicalTitle: 'Spice Grinding, Blending & Nitrogen Pouch Packaging',
    titleNative: {
      en: 'Spice Grinding, Blending & Nitrogen Pouch Packaging',
      mr: 'मसाले कांडप, पावडर मिक्सिंग व सुरक्षित पाकीट पॅकिंग',
      hi: 'मसाला पिसाई, मिश्रण व सुरक्षित पाउच पैकिंग'
    },
    capitalTier: 'SMALL_50K_2L',
    minimumCapitalRequired: 40000,
    recommendedStartingCapital: 90000,
    workingCapitalBufferDays: 30,
    workingCapitalPercentRecommended: 35,
    requiredSkillLevel: 'SEMI_SKILLED',
    keyAssetRequirements: ['पल्व्हरायझर / मसाला कांडप मशिन', 'बँड सीलर किंवा नायट्रोजन फ्लशिंग पाऊच मशिन', 'इलेक्ट्रॉनिक वजन काटा'],
    seasonalSensitivity: 'MEDIUM',
    regulatoryPrerequisites: [
      { licenseName: 'FSSAI Basic Registration', issuingAuthority: 'Food Safety and Standards Authority of India', mandatoryBeforeStart: true },
      { licenseName: 'Udyam MSME Registration', issuingAuthority: 'Ministry of MSME', mandatoryBeforeStart: false },
      { licenseName: 'Shop Act License', issuingAuthority: 'Local Gram Panchayat / Municipal Council', mandatoryBeforeStart: true }
    ],
    operationalRiskWarning: {
      mr: 'कच्च्या मिरची/हळदीतील ओलाव्यामुळे पावडरला बुरशी येण्याचा धोका; माल पक्का वाळवून मगच दळणे बंधनकारक.',
      hi: 'नमी होने पर मसाले में फंगस लग सकता है; सामग्री पूरी तरह सुखाकर ही पीसें।',
      en: 'Moisture ingress causes clumping and fungus; dry raw turmeric/chilli below 10% moisture before grinding.'
    }
  },

  fruit_vegetable_dehydration: {
    id: 'fruit_vegetable_dehydration',
    sector: 'FOOD_PROCESSING',
    subSector: 'Dehydration & Drying',
    canonicalTitle: 'Solar Crop Dehydration & Powder Processing (Onion/Ginger/Turmeric)',
    titleNative: {
      en: 'Solar Crop Dehydration & Powder Processing',
      mr: 'सोलर ड्रायरने कांदा, आले, हळद निर्जलीकरण व पावडर प्रक्रिया',
      hi: 'सौर निर्जलीकरण (कांदा, अदरक, हल्दी) व मूल्य संवर्धन'
    },
    capitalTier: 'SMALL_50K_2L',
    minimumCapitalRequired: 50000,
    recommendedStartingCapital: 110000,
    workingCapitalBufferDays: 45,
    workingCapitalPercentRecommended: 35,
    requiredSkillLevel: 'SEMI_SKILLED',
    keyAssetRequirements: ['सोलर टनेल ड्रायर (Polyhouse Solar Dryer)', 'स्लायसर व वॉशर मशिन', 'व्हॅक्यूम सीलिंग युनिट'],
    seasonalSensitivity: 'HIGH',
    regulatoryPrerequisites: [
      { licenseName: 'FSSAI Registration', issuingAuthority: 'FSSAI', mandatoryBeforeStart: true },
      { licenseName: 'Udyam Registration', issuingAuthority: 'Ministry of MSME', mandatoryBeforeStart: false }
    ],
    operationalRiskWarning: {
      mr: 'पावसाळ्यात सोलर ड्रायरची कार्यक्षमता घटते; हायब्रीड बायोमास किंवा इलेक्ट्रिक बॅकअप आवश्यक.',
      hi: 'बारिश के मौसम में सोलर हीटिंग धीमी होती है; हाइब्रिड बैकअप की व्यवस्था रखें।',
      en: 'Cloudy monsoon days curtail solar drying speed; maintain secondary biomass/electric heat backup.'
    }
  },

  // ==========================================================================
  // 3. RETAIL & ESSENTIALS
  // ==========================================================================
  modern_kirana_fmcg: {
    id: 'modern_kirana_fmcg',
    sector: 'RETAIL',
    subSector: 'Daily Grocery & FMCG',
    canonicalTitle: 'Modern Self-Service Rural Grocery & Essentials Store',
    titleNative: {
      en: 'Modern Self-Service Rural Grocery & Essentials Store',
      mr: 'आधुनिक किराणा, भुसार व दैनंदिन वस्तू सुपरमार्ट',
      hi: 'आधुनिक किराना, दैनिक उपभोग वस्तु स्टोर'
    },
    capitalTier: 'MEDIUM_2L_5L',
    minimumCapitalRequired: 100000,
    recommendedStartingCapital: 250000,
    workingCapitalBufferDays: 30,
    workingCapitalPercentRecommended: 50,
    requiredSkillLevel: 'SEMI_SKILLED',
    keyAssetRequirements: ['मॉड्यूलर डिस्प्ले रॅक्स', 'POS बारकोड बिलिंग सिस्टिम', 'डीप फ्रिझर / कुलर', 'सीसीटीव्ही'],
    seasonalSensitivity: 'LOW',
    regulatoryPrerequisites: [
      { licenseName: 'Shop and Establishment Act', issuingAuthority: 'Gram Panchayat / Municipal Council', mandatoryBeforeStart: true },
      { licenseName: 'FSSAI Retailer License', issuingAuthority: 'FSSAI', mandatoryBeforeStart: true },
      { licenseName: 'GST Registration (if > ₹40L turnover)', issuingAuthority: 'State GST Department', mandatoryBeforeStart: false }
    ],
    operationalRiskWarning: {
      mr: 'गावात अनियंत्रित उधारी दिल्यास खेळते भांडवल अडकून दुकान बंद पडते; उधारी मासिक उलाढालीच्या १०% च्या आत ठेवा.',
      hi: 'अत्यधिक उधारी से कार्यशील पूंजी फंस जाती है; नकद और यूपीआई बिक्री को प्राथमिकता दें।',
      en: 'Uncontrolled customer credit will sink the store within 90 days. Cap total credit strictly below 10%.'
    }
  },

  // ==========================================================================
  // 4. SERVICES & REPAIR
  // ==========================================================================
  mobile_repair: {
    id: 'mobile_repair',
    sector: 'SERVICES',
    subSector: 'Electronics Maintenance',
    canonicalTitle: 'Smartphone, Tablet & Consumer Electronics Repair Hub',
    titleNative: {
      en: 'Smartphone, Tablet & Consumer Electronics Repair Hub',
      mr: 'स्मार्टफोन, टॅब्लेट व इलेक्ट्रॉनिक्स जलद दुरुस्ती केंद्र',
      hi: 'स्मार्टफोन, टैबलेट व इलेक्ट्रॉनिक्स मरम्मत केंद्र'
    },
    capitalTier: 'MICRO_UNDER_50K',
    minimumCapitalRequired: 25000,
    recommendedStartingCapital: 50000,
    workingCapitalBufferDays: 20,
    workingCapitalPercentRecommended: 30,
    requiredSkillLevel: 'SKILLED_TECHNICAL',
    keyAssetRequirements: ['SMD रिवर्क स्टेशन व मायक्रो-सोल्डरिंग आयरन', 'स्क्रीन सेपरेटर मशिन', 'मल्टीमीटर व डीसी पॉवर सप्लाय', 'सुटे भाग डिस्प्ले'],
    seasonalSensitivity: 'LOW',
    regulatoryPrerequisites: [
      { licenseName: 'Shop Act License', issuingAuthority: 'Gram Panchayat / Municipality', mandatoryBeforeStart: true },
      { licenseName: 'Udyam Registration', issuingAuthority: 'Ministry of MSME', mandatoryBeforeStart: false }
    ],
    operationalRiskWarning: {
      mr: 'डुप्लिकेट निकृष्ट स्क्रीन किंवा बॅटरी बसवल्यास विश्वास तुटतो; ग्राहकाला नेहमी वॉरंटीसह अस्सल पार्ट द्या.',
      hi: 'घटिया पुर्जे लगाने से विश्वसनीयता खो जाती है; ३० दिन की वारंटी के साथ गुणवत्तापूर्ण काम करें।',
      en: 'Counterfeit spare parts cause early burnouts and customer disputes. Maintain trusted wholesale distributor links.'
    }
  },

  solar_services: {
    id: 'solar_services',
    sector: 'RENEWABLE_ENERGY',
    subSector: 'Solar Engineering',
    canonicalTitle: 'Solar Water Pump Installation, Rooftop & VFD Maintenance',
    titleNative: {
      en: 'Solar Water Pump Installation & Maintenance',
      mr: 'सोलर वॉटर पंप, रूफटॉप पॅनेल इन्स्टॉलेशन व दुरुस्ती सेवा',
      hi: 'सोलर वाटर पंप, रूफटॉप सोलर स्थापना व रखरखाव'
    },
    capitalTier: 'SMALL_50K_2L',
    minimumCapitalRequired: 40000,
    recommendedStartingCapital: 80000,
    workingCapitalBufferDays: 30,
    workingCapitalPercentRecommended: 30,
    requiredSkillLevel: 'SKILLED_TECHNICAL',
    keyAssetRequirements: ['इन्सॉलेशन टेस्टर व सोलर क्लॅम्प मीटर', 'VFD कंट्रोलर प्रोग्रामिंग केबल्स', 'सोलर पॅनेल वॉशिंग पंप', 'सेफ्टी बेल्ट व टूल्स'],
    seasonalSensitivity: 'MEDIUM',
    regulatoryPrerequisites: [
      { licenseName: 'Electrical Contractor / Wireman License', issuingAuthority: 'State Electrical Inspectorate', mandatoryBeforeStart: true },
      { licenseName: 'Udyam MSME Registration', issuingAuthority: 'Ministry of MSME', mandatoryBeforeStart: false }
    ],
    operationalRiskWarning: {
      mr: 'सरकारी योजनांमधील (PM-KUSUM) अनुदानाचा भरवसा देऊन ग्राहकांकडून पैसे अडकवून ठेवू नका; स्वतःच्या कामाचे थेट बिलिंग करा.',
      hi: 'सब्सिडी के भरोसे उधार काम न करें; समय पर स्पष्ट सेवा शुल्क लें।',
      en: 'Do not promise unverified DISCOM subsidies to farmers; position as an independent rapid-response maintenance partner.'
    }
  },

  // ==========================================================================
  // 5. MANUFACTURING & FABRICATION
  // ==========================================================================
  rural_metal_fabrication: {
    id: 'rural_metal_fabrication',
    sector: 'MANUFACTURING',
    subSector: 'Metal & Fabrication',
    canonicalTitle: 'Agro-Structural Metal Fabrication & Welding Workshop',
    titleNative: {
      en: 'Agro-Structural Metal Fabrication & Welding Workshop',
      mr: 'शेती कुंपण, शेड, गेट, ट्रॉली व वेल्डिंग फॅब्रिकेशन वर्कशॉप',
      hi: 'कृषि शेड, जाली, गेट व वेल्डिंग फैब्रिकेशन वर्कशॉप'
    },
    capitalTier: 'SMALL_50K_2L',
    minimumCapitalRequired: 60000,
    recommendedStartingCapital: 150000,
    workingCapitalBufferDays: 30,
    workingCapitalPercentRecommended: 35,
    requiredSkillLevel: 'SKILLED_TECHNICAL',
    keyAssetRequirements: ['इन्व्हर्टर आर्क वेल्डिंग मशिन', 'हेवी-ड्युटी मेटल कटिंग चॉप सॉ', 'अँगल ग्राइंडर व बेंच ड्रिल', '३-फेज वीज जोडणी'],
    seasonalSensitivity: 'MEDIUM',
    regulatoryPrerequisites: [
      { licenseName: 'Shop Act License', issuingAuthority: 'Gram Panchayat / Urban Body', mandatoryBeforeStart: true },
      { licenseName: 'Commercial Power Connection Sanction', issuingAuthority: 'DISCOM Power Utility', mandatoryBeforeStart: true },
      { licenseName: 'Udyam Registration', issuingAuthority: 'Ministry of MSME', mandatoryBeforeStart: false }
    ],
    operationalRiskWarning: {
      mr: 'लोखंडाच्या (MS Steel) दरात वारंवार चढ-उतार होतात; ग्राहकाकडून किमान ५०% आगाऊ रक्कम घेतल्याशिवाय माल आणू नका.',
      hi: 'लोहे के भाव बदलते रहते हैं; आर्डर लेते समय अग्रिम राशि (Advance) अवश्य लें।',
      en: 'Raw steel price volatility will erode margins on fixed-price jobs. Always take 50% advance to lock in steel procurement.'
    }
  },

  tailoring: {
    id: 'tailoring',
    sector: 'MANUFACTURING',
    subSector: 'Apparel & Fashion',
    canonicalTitle: 'Custom Boutique, Institutional Uniforms & Bulk Garment Stitching',
    titleNative: {
      en: 'Custom Boutique, Uniforms & Garment Stitching',
      mr: 'लेडीज व जेंट्स टेलरिंग, शालेय गणवेश व रेडीमेड गारमेंट्स',
      hi: 'सिलाई केंद्र, स्कूल यूनिफॉर्म व रेडीमेड वस्त्र निर्माण'
    },
    capitalTier: 'MICRO_UNDER_50K',
    minimumCapitalRequired: 20000,
    recommendedStartingCapital: 45000,
    workingCapitalBufferDays: 25,
    workingCapitalPercentRecommended: 30,
    requiredSkillLevel: 'SKILLED_TECHNICAL',
    keyAssetRequirements: ['हाय-स्पीड औद्योगिक शिलाई मशिन (Juki Type)', 'पिको-फॉल व ओव्हरलॉक मशिन', 'कटिंग टेबल व स्टीम प्रेस'],
    seasonalSensitivity: 'HIGH',
    regulatoryPrerequisites: [
      { licenseName: 'Shop Act License', issuingAuthority: 'Local Gram Panchayat', mandatoryBeforeStart: true },
      { licenseName: 'Udyam Registration', issuingAuthority: 'Ministry of MSME', mandatoryBeforeStart: false }
    ],
    operationalRiskWarning: {
      mr: 'सणासुदीच्या व लग्नाच्या हंगामात क्षमतेपेक्षा जास्त ऑर्डर्स घेतल्यास उशीर होतो आणि ग्राहक तुटतात; अचूक नोंद वही ठेवा.',
      hi: 'त्योहारों पर समय पर डिलीवरी न होना ग्राहकों को नाराज करता है; योजना बनाकर आर्डर लें।',
      en: 'Festive order bottlenecks result in unstitched piles and lost trust. Enforce hard order cutoff dates before Diwali/Weddings.'
    }
  },

  // ==========================================================================
  // 6. LIVESTOCK & DAIRY VALUE ADDITION
  // ==========================================================================
  dairy_milk_chilling: {
    id: 'dairy',
    sector: 'LIVESTOCK',
    subSector: 'Dairy Value Addition',
    canonicalTitle: 'Automated Village Milk Collection & Quality Fat Testing Center',
    titleNative: {
      en: 'Automated Village Milk Collection & Fat Testing Center',
      mr: 'स्वयंचलित दूध संकलन व इलेक्ट्रॉनिक फॅट-एसएनएफ तपासणी केंद्र',
      hi: 'स्वचालित दुग्ध संकलन व फैट-एसएनएफ जांच केंद्र'
    },
    capitalTier: 'SMALL_50K_2L',
    minimumCapitalRequired: 60000,
    recommendedStartingCapital: 130000,
    workingCapitalBufferDays: 15,
    workingCapitalPercentRecommended: 30,
    requiredSkillLevel: 'SEMI_SKILLED',
    keyAssetRequirements: ['अल्ट्रासोनिक मिल्क अनालायझर (Milkotester)', 'इलेक्ट्रॉनिक डिजिटल वजन काटा', 'स्टेनलेस स्टील मिल्क कॅन्स (SS 304)', 'इन्व्हर्टर बॅकअप'],
    seasonalSensitivity: 'LOW',
    regulatoryPrerequisites: [
      { licenseName: 'Cooperative / Private Dairy Agreement', issuingAuthority: 'Mother Dairy / Amul / Nandini / Gokul', mandatoryBeforeStart: true },
      { licenseName: 'FSSAI Registration', issuingAuthority: 'FSSAI', mandatoryBeforeStart: true }
    ],
    operationalRiskWarning: {
      mr: 'दूध नाशवंत असल्याने उशिरा वाहतूक झाल्यास दूध आंबून नुकसान होते; चिलिंग वेळेत होणे आवश्यक.',
      hi: 'दूध जल्द खराब हो सकता है; शीतलन (Chilling) व समय पर परिवहन अति आवश्यक है।',
      en: 'Perishable risk: raw milk souring happens within 3 hours if not chilled or dispatched promptly to processing bulk coolers.'
    }
  },

  // ==========================================================================
  // 7. DIGITAL & FINANCIAL SERVICES
  // ==========================================================================
  digital_csc_services: {
    id: 'digital_services',
    sector: 'DIGITAL',
    subSector: 'E-Governance & Financial Inclusion',
    canonicalTitle: 'Common Services Center (CSC), Banking Kiosk & Citizen Digital Hub',
    titleNative: {
      en: 'Common Services Center (CSC) & Citizen Digital Hub',
      mr: 'आपले सरकार / सीएससी केंद्र, बँक मित्र व डिजिटल नागरिक सुविधा',
      hi: 'सीएससी केंद्र, बैंक मित्र व डिजिटल नागरिक सेवा केंद्र'
    },
    capitalTier: 'MICRO_UNDER_50K',
    minimumCapitalRequired: 30000,
    recommendedStartingCapital: 60000,
    workingCapitalBufferDays: 15,
    workingCapitalPercentRecommended: 40,
    requiredSkillLevel: 'SKILLED_TECHNICAL',
    keyAssetRequirements: ['लॅपटॉप / डेस्कटॉप कॉम्प्युटर', 'हाय-स्पीड मल्टीफंक्शन कलर प्रिंटर/स्कॅनर', 'बायोमेट्रिक फिंगरप्रिंट / आयरिस स्कॅनर', 'हाय-स्पीड ब्रॉडबँड किंवा 5G'],
    seasonalSensitivity: 'MEDIUM',
    regulatoryPrerequisites: [
      { licenseName: 'CSC VLE Registration', issuingAuthority: 'CSC e-Governance Services India Ltd', mandatoryBeforeStart: true },
      { licenseName: 'Bank BC Certification (IIBF)', issuingAuthority: 'Indian Institute of Banking & Finance', mandatoryBeforeStart: false },
      { licenseName: 'Shop Act Registration', issuingAuthority: 'Gram Panchayat', mandatoryBeforeStart: true }
    ],
    operationalRiskWarning: {
      mr: 'रोख रकमेची चोरी किंवा बायोमेट्रिक एररमुळे ग्राहकांचे पैसे अडकणे; रोख रक्कम सुरक्षित लॉकरमध्ये ठेवा आणि दररोज हिशोब पूर्ण करा.',
      hi: 'नकद प्रबंधन व तकनीकी गड़बड़ी से बचें; दैनिक ऑडिट रखें।',
      en: 'Cash-in-transit risk for AePS cash withdrawals. Never hold unsecured village cash overnight.'
    }
  }
};
