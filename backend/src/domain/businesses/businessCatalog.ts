export interface BusinessArchetype {
  id: string;
  category: string;
  titleNative: { mr: string; hi: string; en: string };
  unitName: { mr: string; hi: string; en: string };
  defaultDailyCapacity: number;
  typicalSellingPrice: number;
  typicalVariableCost: number;
  typicalFixedCost: number;
  workingCapitalBufferDays: number;
  keyAssets: string[];
  targetCustomers: { mr: string; hi: string; en: string };
  operationalRisks: { mr: string; hi: string; en: string };
  pricingStrategy: { mr: string; hi: string; en: string };
  marketingChannels: { mr: string; hi: string; en: string };
}

export const BUSINESS_ARCHETYPES: Record<string, BusinessArchetype> = {
  dairy: {
    id: 'dairy',
    category: 'Agro & Food Processing',
    titleNative: {
      mr: 'दुग्ध प्रक्रिया व ताजे मलाई पनीर निर्मिती',
      hi: 'डेयरी व ताजा पनीर प्रसंस्करण केंद्र',
      en: 'Fresh Dairy & Paneer Processing'
    },
    unitName: { mr: 'किलो (kg)', hi: 'किलो (kg)', en: 'kg' },
    defaultDailyCapacity: 25,
    typicalSellingPrice: 320,
    typicalVariableCost: 245,
    typicalFixedCost: 30000,
    workingCapitalBufferDays: 15,
    keyAssets: ['पनीर मेकिंग मशिन', 'डीप फ्रिजर', 'वजन काटा', 'दुचाकी'],
    targetCustomers: {
      mr: 'महामार्ग धाबे, स्थानिक हॉटेल्स, केटरर्स व आठवडी बाजार ग्राहक',
      hi: 'हाईवे ढाबे, स्थानीय होटल, कैटरर्स व साप्ताहिक बाजार ग्राहक',
      en: 'Highway dhabas, local restaurants, caterers, and weekly market households'
    },
    operationalRisks: {
      mr: 'पनीर नाशवंत असल्याने वीज खंडित होणे व शीतकरण बिघाड हा मुख्य धोका आहे.',
      hi: 'पनीर जल्दी खराब होने वाला उत्पाद है, अतः बिजली कटौती व फ्रीजर खराबी मुख्य जोखिम है।',
      en: 'Perishable nature requires reliable cold chain and backup power generator.'
    },
    pricingStrategy: {
      mr: 'हॉटेल्सना ₹३१० घाऊक भाव आणि घरगुती ग्राहकांना ₹३४० किरकोळ भाव ठेवावा.',
      hi: 'होटलों के लिए ₹३१० थोक और घरेलू ग्राहकों के लिए ₹३४० खुदरा मूल्य रखें।',
      en: 'Wholesale ₹310/kg for bulk commercial buyers, Retail ₹340/kg for direct consumers.'
    },
    marketingChannels: {
      mr: 'ढाब्यांना २५० ग्रॅम मोफत नमुना देणे आणि गाव व्हॉट्सॲप ग्रुप्सवर नियमित अपडेट देणे.',
      hi: 'ढाबों को २५० ग्राम फ्री सैंपल दें और व्हाट्सएप ग्रुप्स पर ताजा अपडेट भेजें।',
      en: 'Free 250g trial sampling to local eateries and village WhatsApp broadcast.'
    }
  },

  mobile_repair: {
    id: 'mobile_repair',
    category: 'Electronics & Technical Services',
    titleNative: {
      mr: 'मोबाईल, लॅपटॉप रिपेअरिंग व ॲक्सेसरीज सेंटर',
      hi: 'मोबाइल रिपेयरिंग व डिजिटल एक्सेसरीज़ केंद्र',
      en: 'Mobile & Electronics Repair Service'
    },
    unitName: { mr: 'रिपेअर (Jobs)', hi: 'रिपेयर (Jobs)', en: 'repairs' },
    defaultDailyCapacity: 6,
    typicalSellingPrice: 400,
    typicalVariableCost: 140,
    typicalFixedCost: 18000,
    workingCapitalBufferDays: 20,
    keyAssets: ['SMD सोल्डरिंग स्टेशन', 'स्क्रीन सेपरेटर', 'मल्टीमीटर', 'स्पेअर पार्ट्स किट'],
    targetCustomers: {
      mr: 'परिसरातील तरुण, शेतकरी, दुकानदार व स्मार्टफोन वापरकर्ते',
      hi: 'आसपास के युवा, किसान, व्यापारी व स्मार्टफोन उपयोगकर्ता',
      en: 'Smartphone users, local students, shopkeepers, and farmers'
    },
    operationalRisks: {
      mr: 'डुप्लिकेट स्पेअर पार्ट्समुळे पुन्हा तक्रारी येणे आणि तंत्रज्ञान वेगाने बदलणे.',
      hi: 'घटिया स्पेयर पार्ट्स से ग्राहक शिकायत और तकनीकी बदलाव।',
      en: 'Low-quality spare part failures and customer trust erosion.'
    },
    pricingStrategy: {
      mr: 'स्क्रीन बदलणे ₹१२०० (₹५०० नफा), चार्जिंग पोर्ट ₹२५० (₹१५० नफा), टेम्पर्ड ग्लास ₹८०.',
      hi: 'स्क्रीन रिप्लेसमेंट ₹१२००, चार्जिंग सॉकेट ₹२५०, टेम्पर्ड ग्लास ₹८०।',
      en: 'Screen replacement ₹1200 (₹500 margin), port fixes ₹250, accessories 40% margin.'
    },
    marketingChannels: {
      mr: 'आठवडी बाजाराच्या चौकात फलक लावणे आणि ३० दिवसांची मोफत सर्व्हिस वॉरंटी देणे.',
      hi: 'साप्ताहिक बाजार चौक पर बोर्ड लगाएं और ३० दिन की सर्विस वारंटी दें।',
      en: 'Market center signboard and 30-day service warranty badge.'
    }
  },

  tailoring: {
    id: 'tailoring',
    category: 'Textiles & Fashion',
    titleNative: {
      mr: 'लेडीज व जेंट्स टेलरिंग व रेडीमेड गारमेंट्स',
      hi: 'सिलाई केंद्र व रेडीमेड वस्त्र निर्माण',
      en: 'Tailoring Boutique & Garment Manufacturing'
    },
    unitName: { mr: 'कपडे (Garments)', hi: 'कपड़े (Garments)', en: 'garments' },
    defaultDailyCapacity: 8,
    typicalSellingPrice: 280,
    typicalVariableCost: 65,
    typicalFixedCost: 15000,
    workingCapitalBufferDays: 30,
    keyAssets: ['हाय-स्पीड शिलाई मशिन', 'पिको-फॉल मशिन', 'कटिंग टेबल', 'इस्त्री युनिट'],
    targetCustomers: {
      mr: 'गावातील महिला, शालेय विद्यार्थी, लग्न समारंभ कुटुंब व स्थानिक ग्राहक',
      hi: 'गाँव की महिलाएँ, स्कूली छात्र, विवाह समारोह ग्राहक व स्थानीय निवासी',
      en: 'Local households, school uniform contracts, and wedding season clients'
    },
    operationalRisks: {
      mr: 'वेळेवर डिलिव्हरी न देणे आणि ग्राहकाच्या मापात चूक होणे.',
      hi: 'समय पर डिलीवरी न होना और नाप में गलती होना।',
      en: 'Delivery delays during festive rush and alteration rework losses.'
    },
    pricingStrategy: {
      mr: 'साध्या ब्लाऊजसाठी ₹१५०, डिझायनर ब्लाऊज ₹३५०, आणि ड्रेस शिलाई ₹२५० ते ₹४००.',
      hi: 'साधारण सिलाई ₹१५०, डिज़ाइनर ₹३५०, और सूट सिलाई ₹२५० से ₹४००।',
      en: 'Standard stitching ₹150, designer custom wear ₹350–₹500.'
    },
    marketingChannels: {
      mr: 'तयार कपड्यांचे छोटे डिस्प्ले मॉडेल दुकानात ठेवणे आणि व्हॉट्सॲप स्टेटसवर डिझाईन्स पोस्ट करणे.',
      hi: 'दुकान में सैंपल डिस्प्ले करें और व्हाट्सएप स्टेटस पर नए डिज़ाइन शेयर करें।',
      en: 'Storefront mannequin display, referral discounts, and WhatsApp status catalogs.'
    }
  },

  grocery: {
    id: 'grocery',
    category: 'Retail & Daily Essentials',
    titleNative: {
      mr: 'किराणा, भुसार व दैनंदिन वस्तू स्टोअर',
      hi: 'किराना व दैनिक उपभोग वस्तु भंडार',
      en: 'Grocery & Daily Essentials Store'
    },
    unitName: { mr: 'खरेदी (Orders)', hi: 'ऑर्डर (Orders)', en: 'orders' },
    defaultDailyCapacity: 40,
    typicalSellingPrice: 200,
    typicalVariableCost: 165,
    typicalFixedCost: 20000,
    workingCapitalBufferDays: 25,
    keyAssets: ['काऊंटर', 'स्टोरेज रॅक्स', 'इलेक्ट्रॉनिक तराजू', 'बिलिंग सिस्टीम'],
    targetCustomers: {
      mr: 'गावातील कुटुंबे, शेतमजूर, प्रवासी व स्थानिक रहिवासी',
      hi: 'गाँव के परिवार, मजदूर व स्थानीय निवासी',
      en: 'Village households, agricultural workers, and local residents'
    },
    operationalRisks: {
      mr: 'उधारी बुडणे आणि धान्य/वस्तूंची साठवणुकीत नासाडी होणे.',
      hi: 'उधारी न मिलना और अनाज/सामग्री खराब होना।',
      en: 'Excessive customer credit (udhaari) and inventory shelf expiration.'
    },
    pricingStrategy: {
      mr: 'ब्रँडेड वस्तूंवर ८-१०% मार्जिन आणि सुक्या धान्यावर १५-२०% मार्जिन ठेवावे.',
      hi: 'ब्रांडेड सामान पर ८-१०% और खुले अनाज पर १५-२०% मार्जिन रखें।',
      en: '8-10% on FMCG brands, 15-20% on loose staples and spices.'
    },
    marketingChannels: {
      mr: 'गावात घरपोच डिलिव्हरी सुविधा देणे आणि सणासुदीला कॉम्बो पॅक ऑफर करणे.',
      hi: 'होम डिलीवरी की सुविधा दें और त्योहारों पर विशेष कॉम्बो पैक दें।',
      en: 'Free doorstep delivery in village and festive ration combo packs.'
    }
  },

  poultry: {
    id: 'poultry',
    category: 'Animal Husbandry & Poultry',
    titleNative: {
      mr: 'गावठी व ब्रॉयलर कुक्कुटपालन केंद्र',
      hi: 'मुर्गीपालन व ब्रायलर फार्मिंग',
      en: 'Poultry & Broiler Farming Unit'
    },
    unitName: { mr: 'पक्षी (Birds)', hi: 'पक्षी (Birds)', en: 'birds' },
    defaultDailyCapacity: 20,
    typicalSellingPrice: 220,
    typicalVariableCost: 140,
    typicalFixedCost: 15000,
    workingCapitalBufferDays: 30,
    keyAssets: ['शेड', 'फीडर व ड्रिंकर', 'लाईट व हीटर', 'लसीकरण किट'],
    targetCustomers: {
      mr: 'स्थानिक चिकन दुकाने, हॉटेल्स, ढाबे व आठवडी बाजार ग्राहक',
      hi: 'स्थानीय मीट दुकानें, होटल, ढाबे व साप्ताहिक बाजार',
      en: 'Local meat shops, dhabas, weekly markets, and direct consumers'
    },
    operationalRisks: {
      mr: 'हवामानातील बदल, आजारपण आणि खाद्याचे (Feed) वाढणारे दर.',
      hi: 'मौसम परिवर्तन, बीमारियां और चारे की बढ़ती कीमतें।',
      en: 'Disease outbreaks and feed price volatility.'
    },
    pricingStrategy: {
      mr: 'जिवंत पक्षी ₹१२०-₹१४०/kg घाऊक, गावठी पक्षी ₹३००-₹४०० प्रति नग.',
      hi: 'थोक ₹१२०-₹१४०/kg, देशी मुर्गी ₹३००-₹४०० प्रति नग।',
      en: 'Live weight ₹130/kg wholesale, desi free-range ₹350/bird.'
    },
    marketingChannels: {
      mr: 'तालुक्यातील १० चिकन विक्रेत्यांशी साप्ताहिक पुरवठा करार करणे.',
      hi: '१० स्थानीय चिकन विक्रेताओं से साप्ताहिक आपूर्ति का समझौता करें।',
      en: 'Direct supply contracts with 10 local retail butchers.'
    }
  },

  goat_farming: {
    id: 'goat_farming',
    category: 'Animal Husbandry & Livestock',
    titleNative: {
      mr: 'बंदिस्त शेळीपालन व पैदास केंद्र',
      hi: 'बकरी पालन व उन्नत नस्ल प्रजनन केंद्र',
      en: 'Stall-Fed Goat & Sheep Farming'
    },
    unitName: { mr: 'नग (Goats)', hi: 'नग (Goats)', en: 'goats' },
    defaultDailyCapacity: 2,
    typicalSellingPrice: 8500,
    typicalVariableCost: 4200,
    typicalFixedCost: 14000,
    workingCapitalBufferDays: 45,
    keyAssets: ['उंच मचाण शेड', 'चारा कटर', 'पिण्याच्या पाण्याचे ड्रम', 'लसीकरण व्यवस्था'],
    targetCustomers: {
      mr: 'स्थानिक व्यापारी, सण-उत्सव खरेदीदार, पैदास फार्म्स व मटण विक्रेते',
      hi: 'स्थानीय व्यापारी, त्योहार खरीदार, ब्रीडिंग फार्म व मांस विक्रेता',
      en: 'Livestock traders, festival buyers, breeding farms, and local meat retailers'
    },
    operationalRisks: {
      mr: 'पीपीआर व आंत्रविषार (ET) संसर्ग, हिरव्या चाऱ्याची टंचाई आणि वजन न वाढणे.',
      hi: 'संक्रामक बीमारियां, चारे की कमी और वजन में धीमी वृद्धि।',
      en: 'PPR/Enterotoxemia disease risks and dry-season fodder shortages.'
    },
    pricingStrategy: {
      mr: 'जिवंत वजनानुसार ₹२८०-₹३२०/kg किंवा ६ महिन्यांचे पिल्लू ₹७,०००-₹९,०००.',
      hi: 'जीवित वजन पर ₹२८०-₹३२०/kg या ६ माह का बच्चा ₹७,०००-₹९,०००।',
      en: 'Live weight ₹300/kg or 6-month breeding kid ₹7,500–₹9,500.'
    },
    marketingChannels: {
      mr: 'स्थानिक आठवडी जनावरांच्या बाजारात नेणे आणि थेट शेतकरी व्हॉट्सॲप ग्रुप्सवर व्हिडिओ पोस्ट करणे.',
      hi: 'पशु मेले में प्रदर्शन और स्थानीय व्हाट्सएप ग्रुप्स पर वीडियो शेयर करें।',
      en: 'Livestock haat presence and video showcases on farmer WhatsApp networks.'
    }
  },

  bakery: {
    id: 'bakery',
    category: 'Food Processing & Confectionery',
    titleNative: {
      mr: 'ताजे पाव, खारी, टोस्ट व बेकरी उत्पादन युनिट',
      hi: 'बेकरी, पाव व ताज़ा स्नैक्स निर्माण इकाई',
      en: 'Bakery, Fresh Bread & Snacks Production'
    },
    unitName: { mr: 'पॅकेट (Packets)', hi: 'पैकेट (Packets)', en: 'packets' },
    defaultDailyCapacity: 80,
    typicalSellingPrice: 35,
    typicalVariableCost: 18,
    typicalFixedCost: 22000,
    workingCapitalBufferDays: 15,
    keyAssets: ['रोटरी ओव्हन / भट्टी', 'पीठ मळणी मशिन (Dough Mixer)', 'कटिंग टेबल', 'पॅकिंग सिलर'],
    targetCustomers: {
      mr: 'गावातील चहाच्या टपऱ्या, किराणा दुकाने, शाळा आणि स्थानिक कुटुंबे',
      hi: 'चाय की दुकानें, किराना स्टोर, स्कूल और स्थानीय परिवार',
      en: 'Village tea stalls, grocery retail shops, canteens, and households'
    },
    operationalRisks: {
      mr: 'मैदा व तेलाचे वाढणारे दर, वीजपुरवठा खंडित होणे आणि उत्पादनाचा सीमित टिकाऊपणा (Shelf life).',
      hi: 'कच्चे माल की बढ़ती लागत, बिजली कटौती और सीमित शेल्फ लाइफ।',
      en: 'Flour/edible oil price volatility and short shelf-life inventory spoilage.'
    },
    pricingStrategy: {
      mr: 'चहाच्या दुकानांना लादी पाव ₹२२ डझन घाऊक, खारी-टोस्ट ₹३५ प्रति पॅकेट किरकोळ.',
      hi: 'दुकानों के लिए ₹२२ दर्जन थोक, खारी-टोस्ट ₹३५ प्रति पैकेट।',
      en: 'Wholesale ₹22/dozen pav to tea stalls, ₹35/packet for rusk/cookies.'
    },
    marketingChannels: {
      mr: 'सकाळी ६ वाजता ५ गावातील २० चहा टपऱ्यांवर ताजी मोफत डिलिव्हरी देऊन पक्के ग्राहक बनवणे.',
      hi: 'सुबह ६ बजे चाय दुकानों पर समय पर डिलीवरी देकर स्थायी ग्राहक बनाएं।',
      en: 'Early morning 6 AM direct delivery route covering 20 village tea shops.'
    }
  },

  salon: {
    id: 'salon',
    category: 'Personal Grooming & Wellness',
    titleNative: {
      mr: 'आधुनिक सलून व महिला ब्युटी पार्लर',
      hi: 'आधुनिक सैलून व महिला ब्यूटी पार्लर',
      en: 'Grooming Salon & Beauty Parlor'
    },
    unitName: { mr: 'ग्राहक (Clients)', hi: 'ग्राहक (Clients)', en: 'clients' },
    defaultDailyCapacity: 12,
    typicalSellingPrice: 150,
    typicalVariableCost: 25,
    typicalFixedCost: 12000,
    workingCapitalBufferDays: 20,
    keyAssets: ['हायड्रॉलिक चेअर', 'स्टीमर व ड्रायर', 'काच व प्रकाश व्यवस्था', 'कॉस्मेटिक्स किट'],
    targetCustomers: {
      mr: 'गावातील तरुण, महिला, शालेय विद्यार्थी व लग्न सोहळा ग्राहक',
      hi: 'गाँव के युवा, महिलाएँ, छात्र व विवाह समारोह ग्राहक',
      en: 'Local youth, women, festive clients, and bridal party bookings'
    },
    operationalRisks: {
      mr: 'अस्वच्छतेमुळे ग्राहकांची नाराजी आणि सणासुदीव्यतिरिक्त इतर काळात कमी ग्राहक.',
      hi: 'स्वच्छता की कमी और गैर-त्योहारी दिनों में ग्राहकी में मंदी।',
      en: 'Hygiene concerns and off-season demand dips between wedding months.'
    },
    pricingStrategy: {
      mr: 'हेअरकट ₹७०, शेव्हिंग ₹५०, फेशिअल ₹३५०, ब्रायडल मेकअप ₹२५०० ते ₹५०००.',
      hi: 'हेयरकट ₹७०, शेव ₹५०, फेशियल ₹३५०, ब्राइडल पैकेज ₹२५००-₹५०००।',
      en: 'Haircut ₹70, Shave ₹50, Facial ₹350, Bridal packages ₹2,500–₹5,000.'
    },
    marketingChannels: {
      mr: 'लग्नाच्या मोसमात ब्रायडल पॅकेजवर २०% सवलत आणि व्हॉट्सॲप स्टेटसवर हेअरस्टाइल फोटो पोस्ट करणे.',
      hi: 'शादी के मौसम में विशेष पैकेज और व्हाट्सएप पर नए स्टाइल शेयर करें।',
      en: 'Wedding season bridal discounts and WhatsApp transformation showcases.'
    }
  },

  welding: {
    id: 'welding',
    category: 'Metal Fabrication & Engineering',
    titleNative: {
      mr: 'लोखंडी फॅब्रिकेशन, वेल्डिंग व कृषी अवजारे दुरुस्ती',
      hi: 'लोहा फैब्रिकेशन, वेल्डिंग व कृषि उपकरण मरम्मत',
      en: 'Welding, Metal Fabrication & Agri-Tools'
    },
    unitName: { mr: 'काम (Jobs)', hi: 'कार्य (Jobs)', en: 'jobs' },
    defaultDailyCapacity: 4,
    typicalSellingPrice: 750,
    typicalVariableCost: 350,
    typicalFixedCost: 16000,
    workingCapitalBufferDays: 25,
    keyAssets: ['इन्व्हर्टर वेल्डिंग मशिन', 'कटर व ग्राइंडर', 'ड्रिल मशिन', 'सुरक्षा साधने'],
    targetCustomers: {
      mr: 'शेतकरी (ट्रॅक्टर/ट्रॉली/नांगर दुरुस्ती), घरबांधणी करणारे मालक व शेड बांधणारे',
      hi: 'किसान (ट्रैक्टर/ट्रॉली मरम्मत), मकान मालिक व शेड निर्माता',
      en: 'Farmers (trolley/plough repairs), home builders (gates/grills), and shed fabricators'
    },
    operationalRisks: {
      mr: 'लोखंड व पाईपचे वाढणारे दर आणि वेल्डिंग करताना डोळ्यांची/शरीराची दुखापत.',
      hi: 'कच्चे लोहे की कीमतों में उतार-चढ़ाव और कार्यस्थल पर सुरक्षा जोखिम।',
      en: 'Steel raw material price spikes and occupational safety hazards.'
    },
    pricingStrategy: {
      mr: 'लहान दुरुस्ती ₹१००-₹२५०, लोखंडी गेट/ग्रील ₹११० प्रति किलो किंवा फूट दर.',
      hi: 'छोटी वेल्डिंग ₹१००-₹२५०, गेट/ग्रिल निर्माण ₹११० प्रति किलो।',
      en: 'Minor repairs ₹100–₹250, fabricated gates/grills ₹110/kg.'
    },
    marketingChannels: {
      mr: 'ट्रॅक्टर गॅरेज व बांधकाम मजुरांशी थेट संपर्क ठेवणे आणि शेतावर जाऊन वेल्डिंग सेवा देणे.',
      hi: 'ट्रैक्टर मैकेनिकों से संपर्क और खेत पर जाकर मोबाइल वेल्डिंग सेवा देना।',
      en: 'Tie-ups with tractor garages and on-farm mobile welding callout service.'
    }
  },

  digital_services: {
    id: 'digital_services',
    category: 'IT & Citizen Digital Services',
    titleNative: {
      mr: 'आपले सरकार / सीएससी केंद्र, झेरॉक्स व ऑनलाइन सेवा',
      hi: 'सीएससी डिजिटल सेवा केंद्र, प्रिंटिंग व ऑनलाइन सेवाएँ',
      en: 'CSC Digital Citizen Services & Cyber Center'
    },
    unitName: { mr: 'अर्ज / सेवा (Services)', hi: 'सेवाएँ (Services)', en: 'services' },
    defaultDailyCapacity: 25,
    typicalSellingPrice: 80,
    typicalVariableCost: 15,
    typicalFixedCost: 14000,
    workingCapitalBufferDays: 20,
    keyAssets: ['कॉम्प्युटर/लॅपटॉप', 'मल्टीफंक्शन प्रिंटर', 'बायोमेट्रिक स्कॅनर', 'लॅमिनेशन मशिन'],
    targetCustomers: {
      mr: 'गावातील शेतकरी (७/१२, ई-पीक पाहणी), विद्यार्थी (शिष्यवृत्ती), ज्येष्ठ नागरिक (पेन्शन)',
      hi: 'किसान (खतौनी, सरकारी योजना), छात्र (प्रवेश फॉर्म), बुजुर्ग (पेंशन)',
      en: 'Farmers (land records, subsidies), students (scholarship forms), senior citizens (pension/e-KYC)'
    },
    operationalRisks: {
      mr: 'इंटरनेट सर्व्हर डाऊन होणे आणि सरकारी पोर्टलची गती मंदावणे.',
      hi: 'इंटरनेट या सर्वर डाउन होना और सरकारी पोर्टल की तकनीकी खामियाँ।',
      en: 'Government portal downtime and rural broadband connectivity cuts.'
    },
    pricingStrategy: {
      mr: 'झेरॉक्स ₹३, ७/१२ उतारा ₹३०, नवीन पॅन कार्ड ₹१५०, पीक विमा अर्ज ₹५०.',
      hi: 'फोटोकॉपी ₹३, भूलेख ₹३०, पैन कार्ड ₹१५०, फसल बीमा फॉर्म ₹५०।',
      en: 'Print/Photocopy ₹3, Land record extract ₹30, PAN/Aadhaar ₹150, scheme application ₹50.'
    },
    marketingChannels: {
      mr: 'ग्रामपंचायत कार्यालयाच्या जवळ बोर्ड लावणे आणि नवीन योजना आल्यावर व्हॉट्सॲप मेसेज पाठवणे.',
      hi: 'ग्राम पंचायत के पास सूचना बोर्ड और नई योजनाओं की तुरंत व्हाट्सएप सूचना।',
      en: 'Signage near Gram Panchayat office and instant WhatsApp alerts on new government scheme deadlines.'
    }
  },

  handicrafts: {
    id: 'handicrafts',
    category: 'Artisanal & Traditional Crafts',
    titleNative: {
      mr: 'स्थानिक हस्तकला, मातीकाम, बांबूकाम व मूर्तिकला',
      hi: 'हस्तशिल्प, मिट्टी के बर्तन, बांस कला व कुटीर उद्योग',
      en: 'Handicrafts, Pottery & Artisanal Products'
    },
    unitName: { mr: 'नग (Pieces)', hi: 'नग (Pieces)', en: 'pieces' },
    defaultDailyCapacity: 5,
    typicalSellingPrice: 450,
    typicalVariableCost: 120,
    typicalFixedCost: 10000,
    workingCapitalBufferDays: 45,
    keyAssets: ['कुंभार चाक / मोल्ड्स', 'हात अवजारे संच', 'रंगकाम व पॉलिशिंग किट', 'पॅकिंग साहित्य'],
    targetCustomers: {
      mr: 'सण-उत्सव खरेदीदार, पर्यटन ग्राहक, शहरी बाजारपेठा व भेटवस्तू खरेदीदार',
      hi: 'त्योहार खरीदार, पर्यटक, शहरी बाजार व उपहार ग्राहक',
      en: 'Festival buyers, tourists, craft exhibitions, and urban organic home decor buyers'
    },
    operationalRisks: {
      mr: 'उत्पादने नाजूक असल्याने वाहतुकीत फुटणे आणि केवळ सणांच्या काळात मागणी असणे.',
      hi: 'नाजुक सामान होने से परिवहन में टूट-फूट और मौसमी मांग।',
      en: 'Transit breakage of fragile items and heavy festive seasonality.'
    },
    pricingStrategy: {
      mr: 'स्थानिक बाजारात ₹१५०-₹३००, शहरी प्रदर्शन किंवा ऑनलाइन ₹५००-₹८००.',
      hi: 'स्थानीय बाजार में ₹१५०-₹३००, शहर/प्रदर्शनी में ₹५००-₹८००।',
      en: 'Local market ₹200, urban craft exhibitions / online platforms ₹650.'
    },
    marketingChannels: {
      mr: 'जिल्हा प्रदर्शन (सरस/महालक्ष्मी सरस) मध्ये स्टॉल लावणे आणि हस्तकलेचे व्हिडिओ सोशल मीडियावर टाकणे.',
      hi: 'शिल्प मेलों में स्टॉल लगाएं और निर्माण प्रक्रिया के वीडियो शेयर करें।',
      en: 'State craft exhibitions (SARAS fairs) and Instagram/WhatsApp craft creation reels.'
    }
  },

  food_processing: {
    id: 'food_processing',
    category: 'Food Processing & Spices',
    titleNative: {
      mr: 'घरगुती मसाले, लोणचे, पापड व अन्न प्रक्रिया उद्योग',
      hi: 'घरेलू मसाले, अचार, पापड़ व खाद्य प्रसंस्करण केंद्र',
      en: 'Spices, Pickles, Papad & Food Processing'
    },
    unitName: { mr: 'किलो / पॅक (Packs)', hi: 'किलो / पैकेट (Packs)', en: 'packs' },
    defaultDailyCapacity: 20,
    typicalSellingPrice: 220,
    typicalVariableCost: 110,
    typicalFixedCost: 12000,
    workingCapitalBufferDays: 30,
    keyAssets: ['मसाला पल्व्हरायझर / ग्राइंडर', 'ड्रायर / वाळवण जागा', 'वजन काटा', 'नायट्रोजन सीलिंग मशिन'],
    targetCustomers: {
      mr: 'स्थानिक कुटुंबे, आठवडी बाजार, किराणा दुकाने व स्थानिक खानावळी/हॉटेल्स',
      hi: 'स्थानीय परिवार, साप्ताहिक बाजार, किराना दुकानें व ढाबे',
      en: 'Households, local grocery shops, mess/eateries, and festive bulk buyers'
    },
    operationalRisks: {
      mr: 'ओलसरपणामुळे बुरशी येणे, कच्च्या मालाचे (मिरची/हळद) हंगामी दर आणि FSSAI नियमन.',
      hi: 'नमी से फफूंद लगना, मिर्च/मसालों की मौसमी कीमतें व खाद्य सुरक्षा मानक।',
      en: 'Moisture spoilage, raw spice seasonal price swings, and FSSAI hygiene compliance.'
    },
    pricingStrategy: {
      mr: 'घरगुती काळा मसाला ₹३५०/kg, लोणचे ₹२००/kg, पापड ₹१८०/kg.',
      hi: 'शुद्ध गरम मसाला ₹३५०/kg, आम का अचार ₹२००/kg, पापड़ ₹१८०/kg।',
      en: 'Pure local garam masala ₹350/kg, Mango pickle ₹200/kg, Papad ₹180/kg.'
    },
    marketingChannels: {
      mr: 'महिला बचत गट मेळाव्यात मोफत चाखायला (Taste sample) देणे आणि ५० ग्रॅमचे सॅम्पल पॅक वाटणे.',
      hi: 'बचत समूह मेलों में स्वाद चखाएं और छोटे सैंपल पैकेट देकर आर्डर लें।',
      en: 'Free tasting counters at weekly village haats and 50g promotional trial pouches.'
    }
  },

  agri_services: {
    id: 'agri_services',
    category: 'Agricultural Inputs & Services',
    titleNative: {
      mr: 'कृषी सेवा केंद्र, सेंद्रिय खते, बी-बियाणे व औषधे',
      hi: 'कृषि सेवा केंद्र, जैविक खाद, बीज व कीटनाशक भंडार',
      en: 'Agri-Inputs, Organic Fertilizers & Seeds Center'
    },
    unitName: { mr: 'बॅग / बाटली (Units)', hi: 'इकाई (Units)', en: 'units' },
    defaultDailyCapacity: 18,
    typicalSellingPrice: 450,
    typicalVariableCost: 380,
    typicalFixedCost: 18000,
    workingCapitalBufferDays: 30,
    keyAssets: ['गोदाम / साठवण शेल्फ', 'संगणकीय बिलिंग', 'वजन काटा', 'परवाना (Agri License)'],
    targetCustomers: {
      mr: 'परिसरातील शेतकरी, बागायतदार, भाजीपाला उत्पादक व पॉलिहाऊस मालक',
      hi: 'आसपास के किसान, बागवान व सब्जी उत्पादक',
      en: 'Local crop farmers, orchard owners, vegetable growers, and polyhouse operators'
    },
    operationalRisks: {
      mr: 'खतांची उधारी अडकणे, मुदत संपलेली औषधे (Expiry) आणि दुष्काळ/पावसाचा लहरीपणा.',
      hi: 'उधारी फंसना, कीटनाशक एक्सपायरी और मौसम की अनिश्चितता।',
      en: 'Heavy farmer credit lockup, stock expiry risks, and monsoon delay dependency.'
    },
    pricingStrategy: {
      mr: 'खतांवर ५-८% मार्जिन, बियाणांवर १०-१२% आणि सेंद्रिय औषधांवर १५-२०% मार्जिन.',
      hi: 'खाद पर ५-८%, बीज पर १०-१२% और जैविक टॉनिक पर १५-२०% मार्जिन।',
      en: '5-8% on fertilizers, 10-12% on seeds, 15-20% on organic micronutrients.'
    },
    marketingChannels: {
      mr: 'शेतकऱ्यांच्या बांधावर जाऊन मोफत माती परीक्षण सल्ला देणे आणि पिकांच्या हंगामानुसार मार्गदर्शन करणे.',
      hi: 'खेतों पर जाकर मिट्टी व फसल सलाह देना और सही उत्पाद सुझाना।',
      en: 'On-farm agronomy advice sessions and timely season-start crop advisory messages.'
    }
  },

  rural_transport: {
    id: 'rural_transport',
    category: 'Logistics & Rural Mobility',
    titleNative: {
      mr: 'ग्रामीण मालवाहतूक (पिकअप व्हॅन / ऑटो ट्रॉली सेवा)',
      hi: 'ग्रामीण माल ढुलाई व परिवहन सेवा (पिकअप/ऑटो)',
      en: 'Rural Transport & Farm Produce Logistics'
    },
    unitName: { mr: 'भाडे / फेऱ्या (Trips)', hi: 'ट्रिप (Trips)', en: 'trips' },
    defaultDailyCapacity: 3,
    typicalSellingPrice: 900,
    typicalVariableCost: 450,
    typicalFixedCost: 20000,
    workingCapitalBufferDays: 15,
    keyAssets: ['मालवाहू पिकअप / ई-लोडर वाहक', 'दोऱ्या व ताडपत्री', 'टूल किट', 'आरसी व विमा'],
    targetCustomers: {
      mr: 'भाजीपाला शेतकरी, किराणा व्यापारी, बांधकाम साहित्य पुरवठादार व आठवडी बाजार विक्रेते',
      hi: 'सब्जी किसान, किराना व्यापारी, निर्माण सामग्री विक्रेता व हाट व्यापारी',
      en: 'Vegetable farmers hauling produce to APMC mandis, construction supply stores, and traders'
    },
    operationalRisks: {
      mr: 'डिझेलच्या वाढत्या किमती, अचानक वाहनाचा बिघाड/दुरुस्ती खर्च आणि परतीच्या फेरीला रिकामे येणे.',
      hi: 'डीजल के बढ़ते दाम, वाहन खराबी और वापसी में खाली गाड़ी का नुकसान।',
      en: 'Fuel price spikes, breakdown maintenance costs, and empty return journey deadheads.'
    },
    pricingStrategy: {
      mr: 'स्थानिक फेरी ₹५००-₹८००, तालुक्याच्या मार्केटला जाण्यासाठी ₹१,२००-₹१,८०० प्रति फेरी.',
      hi: 'स्थानीय ट्रिप ₹५००-₹८००, मुख्य मंडी के लिए ₹१,२००-₹१,८०० प्रति ट्रिप।',
      en: 'Local haul ₹500–₹800, Mandi delivery run ₹1,200–₹1,800/trip.'
    },
    marketingChannels: {
      mr: 'गावातील १० प्रमुख भाजीपाला उत्पादक शेतकरी व २ हार्डवेअर दुकानांशी मासिक वाहतूक करार करणे.',
      hi: 'गाँव के प्रमुख सब्जी उत्पादकों और हार्डवेयर दुकानों से मासिक ढुलाई समझौता।',
      en: 'Contractual haulage tie-ups with 10 commercial vegetable growers and hardware stores.'
    }
  },

  rural_tourism: {
    id: 'rural_tourism',
    category: 'Hospitality & Agro-Tourism',
    titleNative: {
      mr: 'कृषी पर्यटन, ग्रामीण होमस्टे व अस्सल गावरान जेवण',
      hi: 'कृषि पर्यटन, ग्रामीण होमस्टे व प्रामाणिक देसी भोजन',
      en: 'Agro-Tourism, Rural Homestay & Cultural Dining'
    },
    unitName: { mr: 'पाहुणे / कुटुंब (Guests)', hi: 'अतिथि (Guests)', en: 'guests' },
    defaultDailyCapacity: 8,
    typicalSellingPrice: 650,
    typicalVariableCost: 220,
    typicalFixedCost: 18000,
    workingCapitalBufferDays: 30,
    keyAssets: ['स्वच्छ कॉटेज / खोल्या', 'सेंद्रिय स्वयंपाकघर व चूल', 'बसण्याची गावरान व्यवस्था', 'परिसर बाग'],
    targetCustomers: {
      mr: 'शहरातील कुटुंबे, शनिवार-रविवार प्रवासी, निसर्गप्रेमी व कॉर्पोरेट ग्रुप्स',
      hi: 'शहरी परिवार, सप्ताहांत पर्यटक, प्रकृति प्रेमी व ग्रुप्स',
      en: 'Urban families seeking weekend village retreats, nature lovers, and cultural food travelers'
    },
    operationalRisks: {
      mr: 'केवळ शनिवार-रविवार गर्दी आणि इतर वारांना शून्य ग्राहक, तसेच स्वच्छता व सुरक्षेचा दर्जा.',
      hi: 'केवल सप्ताहांत पर भीड़ और बाकी दिनों में मंदी, स्वच्छता की चुनौती।',
      en: 'Weekend-only demand concentration and maintaining consistent rural hygiene standards.'
    },
    pricingStrategy: {
      mr: 'दिवसभराची सहल (जेवण + नाश्ता) ₹६५०/व्यक्ती, रात्रीच्या मुक्कामासह ₹१,५००/व्यक्ती.',
      hi: 'दिन का पैकेज (नाश्ता + खाना) ₹६५०/व्यक्ति, रात्रि निवास सहित ₹१,५००/व्यक्ति।',
      en: 'Day package (lunch + snacks) ₹650/person, Overnight stay package ₹1,500/person.'
    },
    marketingChannels: {
      mr: 'शहरी मित्रांना व्हॉट्सॲप आमंत्रण देणे, गुगल मॅपवर सुंदर फोटो टाकणे आणि इन्स्टाग्रामवर शेतीतील व्हिडिओ पोस्ट करणे.',
      hi: 'गूगल मैप पर फोटो डालें और इंस्टाग्राम पर गाँव के जीवन के वीडियो शेयर करें।',
      en: 'Google Maps Business profile, Instagram farm reels, and corporate weekend group word-of-mouth.'
    }
  },

  solar_services: {
    id: 'solar_services',
    category: 'Green Energy & Electrical Services',
    titleNative: {
      mr: 'सौर ऊर्जा उपकरणे बसवणे व देखभाल सेवा (सोलर रूफटॉप / पंप)',
      hi: 'सौर ऊर्जा उपकरण स्थापना व मेंटेनेंस सेवा',
      en: 'Solar Rooftop & Agri-Pump Installation Services'
    },
    unitName: { mr: 'प्रकल्प (Installations)', hi: 'प्रोजेक्ट (Installations)', en: 'installs' },
    defaultDailyCapacity: 1,
    typicalSellingPrice: 45000,
    typicalVariableCost: 32000,
    typicalFixedCost: 22000,
    workingCapitalBufferDays: 30,
    keyAssets: ['सोलर टेस्टिंग मल्टीमीटर', 'क्रिमपिंग व सेफ्टी किट', 'वायरिंग टूल्स', 'सर्व्हिस दुचाकी'],
    targetCustomers: {
      mr: 'सौर कृषी पंप बसवणारे शेतकरी, छतावर सोलर लावणारे घरगुती ग्राहक व शाळा/हॉस्पिटल्स',
      hi: 'सोलर पंप लगाने वाले किसान, रूफटॉप सोलर वाले मकान मालिक व ग्रामीण संस्थान',
      en: 'Farmers installing solar pumps (PM-KUSUM), rooftop solar households, and rural institutions'
    },
    operationalRisks: {
      mr: 'महावितरण (DISCOM) नेट-मीटरिंग मंजुरीस होणारा विलंब आणि डीसी वीज हाताळताना सुरक्षेचा धोका.',
      hi: 'बिजली विभाग से नेट-मीटरिंग में देरी और बिजली सुरक्षा के जोखिम।',
      en: 'DISCOM net-metering grid delays and electrical high-voltage DC safety precautions.'
    },
    pricingStrategy: {
      mr: 'टर्नकी इन्स्टॉलेशन मार्जिन आणि वार्षिक देखभाल करार (AMC) शुल्क ₹५००/महिना ठेवावे.',
      hi: 'टर्नकी इंस्टॉलेशन कमीशन और वार्षिक मेंटेनेंस अनुबंध (AMC) शुल्क लें।',
      en: 'Turnkey installation commission + recurring annual maintenance contract (AMC) fees.'
    },
    marketingChannels: {
      mr: 'गावच्या ग्रामपंचायत चौकात माहिती फलक लावणे, पीएम सूर्यघर योजनेचे माहिती पत्रक वाटणे आणि वीज बिल बचतीचे गणित दाखवणे.',
      hi: 'ग्राम पंचायत में पोस्टर लगाएं और बिजली बिल बचत का गणित समझाएं।',
      en: 'Gram panchayat awareness stalls, PM Surya Ghar subsidy flyers, and electricity savings demonstrations.'
    }
  },

  mushroom_cultivation: {
    id: 'mushroom_cultivation',
    category: 'Horticulture & Indoor Agro',
    titleNative: {
      mr: 'अळिंबी (मशरूम) उत्पादन, सुकवणे व पॅकिंग केंद्र',
      hi: 'मशरूम उत्पादन व पैकेजिंग इकाई',
      en: 'Mushroom Cultivation & Packaging'
    },
    unitName: { mr: 'किलो (kg)', hi: 'किलो (kg)', en: 'kg' },
    defaultDailyCapacity: 10,
    typicalSellingPrice: 160,
    typicalVariableCost: 75,
    typicalFixedCost: 15000,
    workingCapitalBufferDays: 20,
    keyAssets: ['हवा खेळती ठेवणारी शेड/खोली', 'रॅक स्ट्रक्चर', 'हायग्रोमीटर व फवारणी यंत्र', 'पॅकिंग सीलर'],
    targetCustomers: {
      mr: 'स्थानिक भाजी मार्केट, ढाबे, हॉटेल्स, केटरर्स व आरोग्यप्रेमी ग्राहक',
      hi: 'स्थानीय सब्जी मंडी, ढाबे, होटल, कैटरर्स व स्वास्थ्य प्रेमी ग्राहक',
      en: 'Local vegetable mandis, restaurants, caterers, and health-conscious consumers'
    },
    operationalRisks: {
      mr: 'बुरशी व जिवाणू संसर्ग, तापमान/आर्द्रतेतील चढ-उतार आणि शीतगृहाअभावी माल लवकर खराब होणे.',
      hi: 'फफूंद संक्रमण, तापमान में बदलाव और कोल्ड स्टोरेज के अभाव में खराब होना।',
      en: 'Fungal contamination, humidity fluctuations, and rapid perishability without cold storage.'
    },
    pricingStrategy: {
      mr: 'हॉटेल्सना ₹१४० घाऊक दर आणि थेट २०० ग्रॅम पाऊचमध्ये ₹४० प्रति पाऊच (₹२००/किलो) विकावे.',
      hi: 'थोक में ₹१४० और २०० ग्राम पैकेट ₹४० (₹२००/किलो) पर खुदरा बेचें।',
      en: 'Wholesale ₹140/kg for bulk buyers, retail 200g punnets at ₹40 (effective ₹200/kg).'
    },
    marketingChannels: {
      mr: 'स्थानिक हॉटेल चालकांना मोफत नमुना देणे आणि आठवडी बाजारात ताजा माल थेट विकणे.',
      hi: 'होटलों को फ्री सैंपल दें और साप्ताहिक हाट में ताजा उत्पाद बेचें।',
      en: 'Direct trial sampling to restaurants and fresh counter at weekly village haats.'
    }
  },

  beekeeping_honey: {
    id: 'beekeeping_honey',
    category: 'Agro-Allied & Value Addition',
    titleNative: {
      mr: 'मधमाशी पालन व शुद्ध मध प्रक्रिया उद्योग',
      hi: 'मधुमक्खी पालन व शुद्ध शहद उत्पादन',
      en: 'Beekeeping & Pure Honey Production'
    },
    unitName: { mr: 'बाटल्या / किलो (kg)', hi: 'बोतल / किलो (kg)', en: 'kg' },
    defaultDailyCapacity: 5,
    typicalSellingPrice: 450,
    typicalVariableCost: 180,
    typicalFixedCost: 12000,
    workingCapitalBufferDays: 30,
    keyAssets: ['मधमाशी पेट्या (Bee Boxes)', 'मध निष्कासन यंत्र (Centrifuge)', 'गाळणी व बाटली पॅकिंग'],
    targetCustomers: {
      mr: 'घरगुती ग्राहक, आयुर्वेदिक वैद्य/फार्मसी, स्थानिक आठवडी बाजार व पर्यटक',
      hi: 'घरेलू ग्राहक, आयुर्वेदिक डॉक्टर, साप्ताहिक बाजार व पर्यटक',
      en: 'Households, ayurvedic practitioners, weekly rural markets, and highway travelers'
    },
    operationalRisks: {
      mr: 'शेजारील शेतात कीटकनाशक फवारणीमुळे मधमाश्या मरणे आणि फुलोरा हंगामावर अवलंबित्व.',
      hi: 'कीटनाशक छिड़काव से मधुमक्खियों की मृत्यु और मौसमी फूलों की कमी।',
      en: 'Pesticide spray mortality from neighboring fields and seasonal floral gaps.'
    },
    pricingStrategy: {
      mr: '५०० ग्रॅम काचेच्या बाटलीत ₹२५० (₹५००/किलो) थेट ग्राहक विक्री.',
      hi: '५०० ग्राम कांच की बोतल में ₹२५० सीधे ग्राहकों को बेचें।',
      en: 'Direct-to-consumer glass bottles at ₹250 per 500g (₹500/kg realization).'
    },
    marketingChannels: {
      mr: 'शुद्धतेची हमी देणारे व्हिडिओ सोशल मीडियावर टाकणे, स्थानिक डॉक्टरांकडे डिस्प्ले ठेवणे.',
      hi: 'शुद्धता का लाइव वीडियो दिखाएं और स्थानीय डॉक्टरों को बताएं।',
      en: 'Live honey extraction videos, WhatsApp broadcasts, and ayurvedic clinic partnerships.'
    }
  },

  generic_custom: {
    id: 'generic_custom',
    category: 'Micro-Enterprise & Services',
    titleNative: {
      mr: 'स्थानिक सूक्ष्म उद्योग व सेवा केंद्र',
      hi: 'स्थानीय सूक्ष्म उद्योग व सेवा केंद्र',
      en: 'Custom Micro-Enterprise & Services'
    },
    unitName: { mr: 'नग / सेवा (Units)', hi: 'इकाई / सेवा (Units)', en: 'units' },
    defaultDailyCapacity: 15,
    typicalSellingPrice: 350,
    typicalVariableCost: 200,
    typicalFixedCost: 22000,
    workingCapitalBufferDays: 20,
    keyAssets: ['कामाची जागा', 'साधनसामग्री', 'वाहतूक साधन'],
    targetCustomers: {
      mr: 'स्थानिक नागरिक, व्यावसायिक व परिसरातील ग्राहक',
      hi: 'स्थानीय नागरिक, व्यापारी व आसपास के ग्राहक',
      en: 'Local consumers, retail businesses, and rural households'
    },
    operationalRisks: {
      mr: 'नियमित मागणी टिकवणे आणि पुरवठा साखळीचे व्यवस्थापन करणे.',
      hi: 'मांग बनाए रखना और आपूर्ति का प्रबंधन।',
      en: 'Demand consistency and operational working capital management.'
    },
    pricingStrategy: {
      mr: 'खर्चावर आधारित (Cost-plus २५-३०% मार्जिन) दर ठरवावा.',
      hi: 'लागत पर २५-३०% मार्जिन जोड़कर मूल्य निर्धारित करें।',
      en: 'Cost-plus 25-30% sustainable gross margin pricing.'
    },
    marketingChannels: {
      mr: 'स्थानिक संबंध, थेट परिचय आणि व्हॉट्सॲप संदेशांद्वारे प्रचार.',
      hi: 'स्थानीय नेटवर्क, व्यक्तिगत संपर्क और व्हाट्सएप द्वारा प्रचार।',
      en: 'Direct local networking, word-of-mouth, and WhatsApp broadcasts.'
    }
  }
};

/**
 * Normalizes user free-text business input to the closest domain archetype
 */
export const normalizeBusinessCategory = (input?: string): BusinessArchetype => {
  if (!input || !input.trim()) {
    return BUSINESS_ARCHETYPES.generic_custom;
  }

  const s = input.toLowerCase();

  // 1. Solar Equipment & Renewable Energy Services (Check before generic repair)
  if (s.includes('solar') || s.includes('सौर') || s.includes('सोलर') || s.includes('surya') || s.includes('सूर्य') || s.includes('kusum') || s.includes('कुसुम')) {
    return BUSINESS_ARCHETYPES.solar_services;
  }

  // 2. Mobile & Laptop Repair
  if (s.includes('mobile') || s.includes('मोबाईल') || s.includes('मोबाइल') || s.includes('laptop') || s.includes('phone') || s.includes('smartphone') || ((s.includes('repair') || s.includes('दुरुस्ती') || s.includes('मरम्मत') || s.includes('electronic')) && !s.includes('tractor') && !s.includes('auto') && !s.includes('motor'))) {
    return BUSINESS_ARCHETYPES.mobile_repair;
  }

  // 3. Tailoring & Garments
  if (s.includes('tailor') || s.includes('टेलर') || s.includes('कपडे') || s.includes('शिलाई') || s.includes('सिलाई') || s.includes('garment') || s.includes('cloth') || s.includes('boutique') || s.includes('कापड')) {
    return BUSINESS_ARCHETYPES.tailoring;
  }

  // 3. Dairy & Milk / Paneer Processing
  if (s.includes('dairy') || s.includes('दूध') || s.includes('पनीर') || s.includes('दुग्ध') || s.includes('paneer') || s.includes('milk') || s.includes('डेअरी') || s.includes('डेयरी') || s.includes('खवा') || s.includes('दही')) {
    return BUSINESS_ARCHETYPES.dairy;
  }

  // 4. Grocery & Kirana
  if (s.includes('kirana') || s.includes('किराणा') || s.includes('किराना') || s.includes('grocery') || s.includes('store') || s.includes('भुसार') || s.includes('दुकान') || s.includes('general store') || s.includes('सुपरमार्केट')) {
    return BUSINESS_ARCHETYPES.grocery;
  }

  // 5. Poultry & Chicken Farming
  if (s.includes('poultry') || s.includes('कुक्कुट') || s.includes('मुर्गी') || s.includes('chicken') || s.includes('पोल्ट्री') || s.includes('अंडी') || s.includes('egg') || s.includes('broiler') || s.includes('ब्रॉयलर')) {
    return BUSINESS_ARCHETYPES.poultry;
  }

  // 6. Goat & Sheep Farming
  if (s.includes('goat') || s.includes('शेळी') || s.includes('बकरी') || s.includes('मेंढी') || s.includes('sheep') || s.includes('पशुपालन') || s.includes('शेळीपालन') || s.includes('बकरीपालन')) {
    return BUSINESS_ARCHETYPES.goat_farming;
  }

  // 7. Bakery & Snacks
  if (s.includes('bakery') || s.includes('बेकरी') || s.includes('bread') || s.includes('पाव') || s.includes('खारी') || s.includes('टोस्ट') || s.includes('बिस्किट') || s.includes('cake') || s.includes('केक') || s.includes('नाश्ता') || s.includes('snacks')) {
    return BUSINESS_ARCHETYPES.bakery;
  }

  // 8. Salon & Beauty Parlor
  if (s.includes('salon') || s.includes('सलून') || s.includes('सैलून') || s.includes('parlor') || s.includes('पार्लर') || s.includes('beauty') || s.includes('ब्युटी') || s.includes('केशकर्तनालय') || s.includes('haircut') || s.includes('makeup') || s.includes('मेकअप')) {
    return BUSINESS_ARCHETYPES.salon;
  }

  // 9. Welding & Fabrication
  if (s.includes('welding') || s.includes('वेल्डिंग') || s.includes('fabrication') || s.includes('फॅब्रिकेशन') || s.includes('लोखंड') || s.includes('gate') || s.includes('गेट') || s.includes('grill') || s.includes('ग्रील') || s.includes('लोहार')) {
    return BUSINESS_ARCHETYPES.welding;
  }

  // 10. Digital Services & Cyber / CSC
  if (s.includes('csc') || s.includes('सीएससी') || s.includes('cyber') || s.includes('सायबर') || s.includes('xerox') || s.includes('झेरॉक्स') || s.includes('झिरोक्स') || s.includes('digital') || s.includes('ऑनलाइन') || s.includes('online') || s.includes('आपले सरकार') || s.includes('महा ई सेवा') || s.includes('printing') || s.includes('प्रिंटिंग')) {
    return BUSINESS_ARCHETYPES.digital_services;
  }

  // 11. Handicrafts & Artisans
  if (s.includes('craft') || s.includes('हस्तकला') || s.includes('शिल्प') || s.includes('pottery') || s.includes('मातीकाम') || s.includes('कुंभार') || s.includes('बांबू') || s.includes('bamboo') || s.includes('मूर्ती') || s.includes('idol') || s.includes('art') || s.includes('कला')) {
    return BUSINESS_ARCHETYPES.handicrafts;
  }

  // 12. Food Processing, Spices & Pickles
  if (s.includes('spice') || s.includes('मसाले') || s.includes('मसाला') || s.includes('pickle') || s.includes('लोणचे') || s.includes('अचार') || s.includes('papad') || s.includes('पापड') || s.includes('food processing') || s.includes('अन्न प्रक्रिया') || s.includes('खाद्य') || s.includes('चटणी')) {
    return BUSINESS_ARCHETYPES.food_processing;
  }

  // 13. Agri-Services, Seeds & Fertilizers
  if (s.includes('agri') || s.includes('कृषी') || s.includes('कृषि') || s.includes('seed') || s.includes('बियाणे') || s.includes('बीज') || s.includes('fertilizer') || s.includes('खत') || s.includes('pesticide') || s.includes('औषध') || s.includes('रोपवाटिका') || s.includes('nursery')) {
    return BUSINESS_ARCHETYPES.agri_services;
  }

  // 14. Rural Transport & Logistics
  if (s.includes('transport') || s.includes('वाहतूक') || s.includes('ढुलाई') || s.includes('pickup') || s.includes('पिकअप') || s.includes('auto') || s.includes('रिक्षा') || s.includes('टॅक्सी') || s.includes('tempo') || s.includes('टेंपो') || s.includes('ट्रान्सपोर्ट')) {
    return BUSINESS_ARCHETYPES.rural_transport;
  }

  // 15. Rural Tourism & Homestay
  if (s.includes('tourism') || s.includes('पर्यटन') || s.includes('homestay') || s.includes('होमस्टे') || s.includes('agro tourism') || s.includes('कृषी पर्यटन') || s.includes('रिसॉर्ट') || s.includes('resort') || s.includes('गावरान जेवण')) {
    return BUSINESS_ARCHETYPES.rural_tourism;
  }

  // 16. Solar Equipment & Services
  if (s.includes('solar') || s.includes('सौर') || s.includes('सोलर') || s.includes('surya') || s.includes('सूर्य') || s.includes('kusum') || s.includes('कुसुम')) {
    return BUSINESS_ARCHETYPES.solar_services;
  }

  // 17. Mushroom Cultivation
  if (s.includes('mushroom') || s.includes('मशरूम') || s.includes('अळिंबी') || s.includes('अळंबी')) {
    return BUSINESS_ARCHETYPES.mushroom_cultivation;
  }

  // 18. Beekeeping & Honey
  if (s.includes('bee') || s.includes('मधमाशी') || s.includes('मधुमक्खी') || s.includes('honey') || s.includes('मध') || s.includes('शहद') || s.includes('apiary')) {
    return BUSINESS_ARCHETYPES.beekeeping_honey;
  }

  // Fallback with custom title adaptation
  return {
    ...BUSINESS_ARCHETYPES.generic_custom,
    titleNative: {
      mr: input,
      hi: input,
      en: input
    }
  };
};
