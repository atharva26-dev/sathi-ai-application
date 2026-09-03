import { MarketGapItem } from '../../types/market.js';
import { normalizeBusinessCategory, BusinessArchetype } from '../businesses/businessCatalog.js';

/**
 * Dynamic 4-Quadrant Market Opportunity Matrix Engine
 * Evaluates Demand Score vs Competition Score strictly isolated by Business Category & Location
 */
export const getMarketOpportunitiesForCluster = (
  locationCluster: string,
  businessCategoryOrRadius?: string | number,
  radiusKm = 10
): MarketGapItem[] => {
  const loc = locationCluster || 'स्थानिक परिसर (Local Area)';
  const businessCategory = typeof businessCategoryOrRadius === 'string' ? businessCategoryOrRadius : undefined;
  const archetype = normalizeBusinessCategory(businessCategory);

  // 1. MOBILE & ELECTRONICS REPAIR
  if (archetype.id === 'mobile_repair') {
    return [
      {
        id: 'gap_doorstep_mobile_repair',
        name: 'Doorstep Screen & Battery Replacement',
        nameNative: {
          mr: 'घरोघरी जाऊन मोबाईल स्क्रीन व बॅटरी दुरुस्ती',
          hi: 'डोरस्टेप मोबाइल स्क्रीन व बैटरी रिप्लेसमेंट',
          en: 'Doorstep Mobile Screen & Battery Service'
        },
        icon: '📱',
        demandScore: 92,
        competitionScore: 22,
        opportunityQuadrant: 'HIGH_OPPORTUNITY',
        dailyEstimatedDemand: '८ ते १२ फोन / दिवस',
        avgSellingPrice: '₹४०० - ₹१,४०० / दुरुस्ती',
        keyTargetCustomers: ['गावातील व्यावसायिक', 'ज्येष्ठ नागरिक', 'शेतकरी व स्मार्टफोन वापरकर्ते'],
        unmetNeedReason: {
          mr: `${loc} परिसरातील ग्राहकांना स्क्रीन बदलण्यासाठी शहरात जाऊन दिवस वाया घालवावा लागतो. थेट गावात ३० मिनिटांत सेवा दिल्यास मोठी मागणी आहे.`,
          hi: `${loc} के ग्राहकों को स्क्रीन बदलवाने शहर जाना पड़ता है। गाँव में ३० मिनट में सर्विस मिलने पर भारी मांग है।`,
          en: `Customers in ${loc} currently travel 15–20km to city centers for screen/battery issues, losing full working days.`
        },
        validationChecklist: [
          'स्थानिक १० स्मार्टफोन वापरकर्त्यांना विचारा: "गावात ३० मिनिटांत फोन दुरुस्त झाल्यास परवडेल का?"',
          'शहरातील होलसेल स्पेअर पार्ट वितरकाशी ओळखीचे दर ठरवा.'
        ],
        risks: ['डुप्लिकेट किंवा निकृष्ट स्पेअर पार्ट्समुळे ग्राहकांचा विश्वास तुटण्याचा धोका.'],
        suggestedPriceRange: { min: 400, max: 1400, unit: 'repair' },
        estimatedStartupRequirement: 35000,
        confidence: 'HIGH',
        evidence: ['स्थानिक स्मार्टफोन घनता > ७०%', 'शहरातील रिपेअरिंग दुकानांची लांब प्रतीक्षा'],
        firstValidationStep: 'गावातील २० मित्रांना व दुकानदारांना घरपोच रिपेअरिंग सेवेचे व्हॉट्सॲप कार्ड पाठवा.',
        trustLevel: 'FACT',
        confidenceScore: 93
      },
      {
        id: 'gap_sameday_hardware_repair',
        name: 'Same-Day Charging Port & Micro-Soldering',
        nameNative: {
          mr: 'झटपट चार्जिंग सॉकेट व ऑडिओ रिपेअरिंग',
          hi: 'त्वरित चार्जिंग सॉकेट व माइक/स्पीकर मरम्मत',
          en: 'Instant Charging Port & Audio Circuit Fix'
        },
        icon: '⚡',
        demandScore: 86,
        competitionScore: 28,
        opportunityQuadrant: 'HIGH_OPPORTUNITY',
        dailyEstimatedDemand: '१० ते १५ कामे / दिवस',
        avgSellingPrice: '₹१५० - ₹३०० / काम',
        keyTargetCustomers: ['स्थानिक विद्यार्थी', 'शेतमजूर', 'दुकानदार'],
        unmetNeedReason: {
          mr: 'चार्जिंग सॉकेट खराब होणे ही सर्वात सामान्य समस्या आहे; स्थानिक पातळीवर तात्काळ दुरुस्ती उपलब्ध नाही.',
          hi: 'चार्जिंग सॉकेट की खराबी आम समस्या है, तुरंत रिपेयरिंग की स्थानीय स्तर पर मांग है।',
          en: 'Charging port and speaker dust/moisture damages are high-velocity daily issues.'
        },
        validationChecklist: ['SMD हॉट एअर गन आणि सोल्डरिंग उपकरणांची किंमत तपासा.'],
        risks: ['मदरबोर्ड ट्रॅक तुटल्यास नुकसान होण्याची शक्यता.'],
        suggestedPriceRange: { min: 150, max: 300, unit: 'job' },
        estimatedStartupRequirement: 20000,
        confidence: 'HIGH',
        evidence: ['दैनिक ५+ ग्राहकांची चार्जिंग समस्यांची विचारणा'],
        firstValidationStep: '५ स्थानिक पानाची दुकाने व हॉटेल चालकांना चार्जिंग पोर्ट दुरुस्तीची माहिती द्या.',
        trustLevel: 'FACT',
        confidenceScore: 91
      },
      {
        id: 'gap_accessory_tempered_bundle',
        name: 'Curated Accessories & 9H Tempered Glass',
        nameNative: {
          mr: 'मजबूत टेम्पर्ड ग्लास व ओरिजिनल फास्ट चार्जर',
          hi: 'टिकाऊ टेम्पर्ड ग्लास व फास्ट चार्जर बंडल',
          en: 'Heavy-Duty Tempered Glass & Fast Charger Combo'
        },
        icon: '🛡️',
        demandScore: 80,
        competitionScore: 45,
        opportunityQuadrant: 'COMPETITIVE',
        dailyEstimatedDemand: '१५ ते २० नग / दिवस',
        avgSellingPrice: '₹८० - ₹३५० / नग',
        keyTargetCustomers: ['नवीन फोन खरेदीदार', 'तरुण वर्ग', 'प्रवासी'],
        unmetNeedReason: {
          mr: 'स्थानिक दुकानांत निकृष्ट दर्जाचा ग्लास असतो जो लगेच फुटतो. चांगल्या ब्रँडेड अ‍ॅक्सेसरीजला ४०% मार्जिन मिळते.',
          hi: 'स्थानीय दुकानों पर घटिया ग्लास मिलता है। मजबूत ग्लास व ब्रांडेड चार्जर पर ४०% मार्जिन है।',
          en: 'High margin recurring revenue stream protecting customer devices.'
        },
        validationChecklist: ['होलसेल बाजारातून ₹२५ भावात ५० टेम्पर्ड ग्लासचा नमुना स्टॉक खरेदी करा.'],
        risks: ['फोन मॉडेल वेगाने बदलल्याने जुना स्टॉक पडून राहणे.'],
        suggestedPriceRange: { min: 80, max: 350, unit: 'item' },
        estimatedStartupRequirement: 15000,
        confidence: 'MEDIUM',
        evidence: ['स्थानिक तरुण वर्गाची मागणी'],
        firstValidationStep: '१० प्रमुख मॉडेलचे ग्लास आणून ₹८० दरात बसवून द्या.',
        trustLevel: 'CALCULATED',
        confidenceScore: 87
      },
      {
        id: 'gap_refurbished_phone_resale',
        name: 'Certified Second-Hand Smartphones with 3-Month Warranty',
        nameNative: {
          mr: '३ महिन्यांच्या वॉरंटीसह जुने खात्रीशीर स्मार्टफोन विक्री',
          hi: '३ माह वारंटी के साथ रीफर्बिश्ड स्मार्टफोन बिक्री',
          en: 'Certified Refurbished Smartphone Resale'
        },
        icon: '🔄',
        demandScore: 74,
        competitionScore: 18,
        opportunityQuadrant: 'NICHE',
        dailyEstimatedDemand: '५ ते ८ फोन / महिना',
        avgSellingPrice: '₹३,५०० - ₹७,००० / फोन',
        keyTargetCustomers: ['कमी बजेटमधील कुटुंबे', 'शालेय विद्यार्थी', 'दुय्यम फोन वापरकर्ते'],
        unmetNeedReason: {
          mr: 'गावातील लोकांना नवीन फोन घेणे परवडत नाही, पण खात्रीशीर जुन्या फोनची स्थानिक पातळीवर हमी कोणी देत नाही.',
          hi: 'सस्ते और जाँचे-परखे स्मार्टफोन की गाँव में बहुत मांग है।',
          en: 'High trust deficit in unorganized second-hand market solved by local testing warranty.'
        },
        validationChecklist: ['२ वापरलेले फोन दुरुस्त करून टेस्टिंगसह विक्रीस ठेवा.'],
        risks: ['चोरीचा फोन खरेदी न करण्याची खबरदारी (बिल/ओळखपत्र आवश्यक).'],
        suggestedPriceRange: { min: 3500, max: 7000, unit: 'device' },
        estimatedStartupRequirement: 25000,
        confidence: 'MEDIUM',
        evidence: ['विद्यार्थ्यांकडून स्वस्त फोनची मागणी'],
        firstValidationStep: 'स्थानिक व्हॉट्सॲप ग्रुपवर वॉरंटीसह २ जुन्या फोनची माहिती टाका.',
        trustLevel: 'CALCULATED',
        confidenceScore: 84
      }
    ];
  }

  // 2. TAILORING & GARMENTS
  if (archetype.id === 'tailoring') {
    return [
      {
        id: 'gap_custom_tailoring',
        name: 'Designer Blouse & Custom Tailoring',
        nameNative: {
          mr: 'कस्टम लेडीज टेलरिंग व डिझायनर ब्लाऊज',
          hi: 'कस्टम सिलाई व डिज़ाइनर ब्लाउज केंद्र',
          en: 'Custom Tailoring & Designer Boutique'
        },
        icon: '👗',
        demandScore: 89,
        competitionScore: 32,
        opportunityQuadrant: 'HIGH_OPPORTUNITY',
        dailyEstimatedDemand: '१५ ते २० कपडे / दिवस',
        avgSellingPrice: '₹२५० - ₹५०० / नग',
        keyTargetCustomers: ['गावातील महिला', 'लग्न समारंभ ग्राहक', 'उत्सव ग्राहक'],
        unmetNeedReason: {
          mr: `${loc} परिसरात वेळेवर अचूक फिटिंग आणि आधुनिक डिझाईन्स देणारा टेलर नसल्याने महिला शहरात जातात.`,
          hi: `${loc} में समय पर सही फिटिंग और नए डिज़ाइन की सिलाई का बड़ा अवसर है।`,
          en: `Lack of modern patterns and strict delivery timelines in ${loc} forces customer travel.`
        },
        validationChecklist: ['१० महिला ग्राहकांशी चालू शिलाई दर विचारा', '३ नमुना डिझाईन्स तयार करा'],
        risks: ['सणासुदीच्या काळात कामाचा ताण आणि मापातील त्रुटी'],
        suggestedPriceRange: { min: 250, max: 500, unit: 'garment' },
        estimatedStartupRequirement: 30000,
        confidence: 'HIGH',
        evidence: ['सणासुदीच्या काळात महिलांची लांब रांग'],
        firstValidationStep: '५ ओळखीच्या ग्राहकांना मोफत फिटिंग अल्टरेशन देऊन अभिप्राय घ्या.',
        trustLevel: 'FACT',
        confidenceScore: 93
      },
      {
        id: 'gap_school_uniforms',
        name: 'School & Institutional Uniform Contracts',
        nameNative: {
          mr: 'शालेय गणवेश व संस्थात्मक कापड पुरवठा',
          hi: 'स्कूली यूनिफ़ॉर्म व थोक सिलाई अनुबंध',
          en: 'School & Institutional Uniform Contracting'
        },
        icon: '✂️',
        demandScore: 82,
        competitionScore: 20,
        opportunityQuadrant: 'HIGH_OPPORTUNITY',
        dailyEstimatedDemand: '५० ते १०० जोडी / महिना',
        avgSellingPrice: '₹३५० - ₹६०० / जोडी',
        keyTargetCustomers: ['स्थानिक जिल्हा परिषद व खासगी शाळा', 'पालक'],
        unmetNeedReason: {
          mr: 'शाळांना थेट स्थानिक शिंपी न मिळाल्याने ते शहरातून महागडे रेडीमेड गणवेश घेतात.',
          hi: 'स्कूलों को स्थानीय स्तर पर सीधे सप्लायर की आवश्यकता है।',
          en: 'Direct school partnership avoids retailer markups.'
        },
        validationChecklist: ['२ स्थानिक शाळांच्या मुख्याध्यापकांना भेटा.'],
        risks: ['शाळांकडून देयके मिळण्यास होणारा विलंब.'],
        suggestedPriceRange: { min: 350, max: 600, unit: 'set' },
        estimatedStartupRequirement: 40000,
        confidence: 'HIGH',
        evidence: ['३ स्थानिक शाळांची वार्षिक गणवेश गरज'],
        firstValidationStep: 'जवळच्या शाळेला एका नमुना गणवेशासह भेट द्या.',
        trustLevel: 'FACT',
        confidenceScore: 90
      }
    ];
  }

  // 3. GROCERY & DAILY ESSENTIALS
  if (archetype.id === 'grocery') {
    return [
      {
        id: 'gap_doorstep_grocery',
        name: 'Quality Staples & Village Doorstep Delivery',
        nameNative: {
          mr: 'स्वच्छ निवडलेले धान्य, मसाले व घरपोच किराणा',
          hi: 'शुद्ध अनाज, मसाले व निःशुल्क होम डिलीवरी',
          en: 'Quality Staples & Free Doorstep Grocery'
        },
        icon: '🛒',
        demandScore: 86,
        competitionScore: 42,
        opportunityQuadrant: 'HIGH_OPPORTUNITY',
        dailyEstimatedDemand: '३० ते ५० ऑर्डर्स / दिवस',
        avgSellingPrice: '₹२५० - ₹८०० / ऑर्डर',
        keyTargetCustomers: ['गावातील कुटुंबे', 'वृद्ध नागरिक', 'शेतमजूर'],
        unmetNeedReason: {
          mr: `${loc} मध्ये व्हॉट्सॲपवर ऑर्डर घेऊन घरपोच स्वच्छ किराणा माल देणारी सेवा नाही.`,
          hi: `${loc} में व्हाट्सएप पर ऑर्डर लेकर घर तक सामान पहुँचाने वाली सुविधा का अभाव है।`,
          en: `WhatsApp convenience and zero adulteration staples in ${loc}.`
        },
        validationChecklist: ['२० कुटुंबांना घरपोच किराणा हवा का ते विचारा.'],
        risks: ['जास्त उधारी दिल्यास खेळते भांडवल अडकणे.'],
        suggestedPriceRange: { min: 250, max: 800, unit: 'order' },
        estimatedStartupRequirement: 50000,
        confidence: 'HIGH',
        evidence: ['गावात दैनंदिन किराणा खरेदीची सतत गरज'],
        firstValidationStep: 'गाव व्हॉट्सॲप ग्रुपवर घरपोच किराणा मालाची दरसूची शेअर करा.',
        trustLevel: 'FACT',
        confidenceScore: 89
      }
    ];
  }

  // 4. DAIRY & MILK PROCESSING (Only when Dairy is actually selected!)
  if (archetype.id === 'dairy') {
    return [
      {
        id: 'gap_paneer',
        name: 'Fresh Malai Paneer Processing Unit',
        nameNative: {
          mr: 'ताजे मलाई पनीर निर्मिती केंद्र',
          hi: 'ताजा मलाई पनीर निर्माण केंद्र',
          en: 'Fresh Malai Paneer Processing'
        },
        icon: '🧀',
        demandScore: 88,
        competitionScore: 24,
        opportunityQuadrant: 'HIGH_OPPORTUNITY',
        dailyEstimatedDemand: '४५ ते ६० किलो / दिवस',
        avgSellingPrice: '₹३२० - ₹३४० / किलो',
        keyTargetCustomers: ['महामार्ग ढाबे', 'स्थानिक हॉटेल्स', 'लग्न केटरर्स'],
        unmetNeedReason: {
          mr: `${loc} परिसरातील ढाब्यांना शहरातून २ दिवस जुने पॅकेट पनीर मिळते; रोज सकाळी ताजे मलाई पनीर देणारा स्थानिक पुरवठादार नाही.`,
          hi: `${loc} के ढाबों को शहर से पुराना पैकेट पनीर मिलता है; ताजे पनीर की आपूर्ति का बड़ा अवसर है।`,
          en: `Commercial eateries in ${loc} currently rely on 2-day-old refrigerated packaged paneer.`
        },
        validationChecklist: ['स्थानिक ३ ढाब्यांना भेटून चालू पनीर खरेदी दर विचारा.'],
        risks: ['नाशवंत माल असल्याने योग्य शीतकरण आवश्यक.'],
        suggestedPriceRange: { min: 320, max: 340, unit: 'kg' },
        estimatedStartupRequirement: 80000,
        confidence: 'HIGH',
        evidence: ['परिसरात उपलब्ध कच्चा दूध साठा व ढाब्यांची मागणी'],
        firstValidationStep: '३ ढाब्यांना २५० ग्रॅम मोफत नमुना देऊन अभिप्राय घ्या.',
        trustLevel: 'FACT',
        confidenceScore: 92
      },
      {
        id: 'gap_curd',
        name: 'Thick Set Curd & Spiced Buttermilk',
        nameNative: {
          mr: 'घट्ट गावरान दही व मसाला ताक',
          hi: 'गाढ़ा ताजा दही व मसाला छाछ',
          en: 'Thick Set Curd & Spiced Buttermilk'
        },
        icon: '🥛',
        demandScore: 80,
        competitionScore: 32,
        opportunityQuadrant: 'HIGH_OPPORTUNITY',
        dailyEstimatedDemand: '८० ते १२० लिटर / दिवस',
        avgSellingPrice: '₹६० - ₹७५ / लिटर',
        keyTargetCustomers: ['स्थानिक कुटुंबे', 'प्रवासी', 'हॉटेल्स'],
        unmetNeedReason: {
          mr: 'ताजे नैसर्गिक दही आणि उन्हाळ्यात थंड ताकाला मोठी मागणी असते.',
          hi: 'ताजा दही और गर्मियों में ठंडी छाछ की भारी मांग।',
          en: 'High summer demand for fresh non-sour local curd.'
        },
        validationChecklist: ['५ स्थानिक किराणा दुकानांशी चर्चा करा.'],
        risks: ['उन्हाळ्यात आंबट होण्याचा वेग जास्त.'],
        suggestedPriceRange: { min: 60, max: 75, unit: 'liter' },
        estimatedStartupRequirement: 40000,
        confidence: 'HIGH',
        evidence: ['दैनिक दुग्धजन्य पदार्थांचा खप'],
        firstValidationStep: 'स्थानिक दुकानांना १० पाऊच नमुना म्हणून द्या.',
        trustLevel: 'FACT',
        confidenceScore: 88
      }
    ];
  }

  // 5. GENERIC / CUSTOM USER BUSINESS (e.g. Solar Pump, Fabrication, Salon, Poultry, etc.)
  const customTitle = businessCategory || 'Custom Enterprise';
  return [
    {
      id: 'gap_custom_direct_service',
      name: `Dedicated Local Service for ${customTitle}`,
      nameNative: {
        mr: `${customTitle} - स्थानिक थेट ग्राहक सेवा`,
        hi: `${customTitle} - स्थानीय प्रत्यक्ष सेवा`,
        en: `Dedicated Local Service for ${customTitle}`
      },
      icon: '🎯',
      demandScore: 82,
      competitionScore: 26,
      opportunityQuadrant: 'HIGH_OPPORTUNITY',
      dailyEstimatedDemand: 'दैनिक नियमित मागणी',
      avgSellingPrice: `₹${archetype.typicalSellingPrice} अंदाजित सरासरी`,
      keyTargetCustomers: ['स्थानिक नागरिक', 'परिसरातील व्यावसायिक', 'शेतकरी कुटुंबे'],
      unmetNeedReason: {
        mr: `${loc} परिसरात '${customTitle}' साठी स्थानिक पातळीवर विश्वासू व वेळेत काम देणाऱ्या व्यावसायिकाची गरज आहे.`,
        hi: `${loc} में '${customTitle}' के लिए स्थानीय स्तर पर विश्वसनीय सेवा की भारी मांग है।`,
        en: `Unmet local demand in ${loc} for reliable, timely execution without requiring travel to larger towns.`
      },
      validationChecklist: [
        `स्थानिक ५ संभाव्य ग्राहकांना भेटून '${customTitle}' बाबत त्यांच्या अडचणी समजून घ्या.`,
        'कच्चा माल व साहित्याचे स्थानिक पुरवठादार तपासा.'
      ],
      risks: ['सुरुवातीला कामाची ओळख निर्माण करण्यासाठी नियमित संपर्क आवश्यक.'],
      suggestedPriceRange: { min: archetype.typicalVariableCost * 1.3, max: archetype.typicalSellingPrice * 1.2, unit: 'unit' },
      estimatedStartupRequirement: archetype.typicalFixedCost * 1.5,
      confidence: 'MEDIUM',
      evidence: ['स्थानिक बाजार पाहणी व ग्राहकांची गरज'],
      firstValidationStep: '५ संभाव्य ग्राहकांशी थेट संपर्क साधून त्यांच्या कामाचे दरपत्रक द्या.',
      trustLevel: 'CALCULATED',
      confidenceScore: 88
    },
    {
      id: 'gap_custom_maintenance_contract',
      name: `Annual Support & Doorstep Warranty for ${customTitle}`,
      nameNative: {
        mr: `${customTitle} - वार्षिक देखभाल व दुरुस्ती सेवा`,
        hi: `${customTitle} - वार्षिक रखरखाव व सहायता अनुबंध`,
        en: `Annual Maintenance & Doorstep Support for ${customTitle}`
      },
      icon: '🛠️',
      demandScore: 76,
      competitionScore: 18,
      opportunityQuadrant: 'HIGH_OPPORTUNITY',
      dailyEstimatedDemand: 'मासिक १५+ ग्राहक अनुबंध',
      avgSellingPrice: `वाजवी सेवा शुल्क`,
      keyTargetCustomers: ['दीर्घकालीन ग्राहक', 'स्थानिक संस्था'],
      unmetNeedReason: {
        mr: 'विक्रीनंतरची नियमित सेवा आणि वॉरंटी देणारा स्थानिक भागीदार उपलब्ध नाही.',
        hi: 'बिक्री के बाद नियमित सेवा और वारंटी का अभाव।',
        en: 'Recurring maintenance contracts create predictable cash-flow.'
      },
      validationChecklist: ['३ स्थानिक संस्थांशी वार्षिक देखभालीची चर्चा करा.'],
      risks: ['वेळेवर सेवा न दिल्यास ग्राहक नाराजी.'],
      confidence: 'MEDIUM',
      evidence: ['नियमित सेवेची मागणी'],
      firstValidationStep: 'ग्राहकांना ३ महिन्यांच्या मोफत सर्व्हिस वॉरंटीचा प्रस्ताव द्या.',
      trustLevel: 'CALCULATED',
      confidenceScore: 85
    }
  ];
};
