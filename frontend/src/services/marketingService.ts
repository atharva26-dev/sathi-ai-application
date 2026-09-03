import { MarketingChannelItem, PricingAnalysis, ExpansionPhase } from '../types';

export const MARKETING_CHANNELS: MarketingChannelItem[] = [
  {
    id: 'ch_dhabas_hotels',
    title: 'महामार्गावरील हॉटेल्स व ढाबे (Highway Dhabas & Local Hotels)',
    iconName: 'Utensils',
    suitability: 'BEST',
    whyRecommended: 'हॉटेल्सना दररोज नियमित ५ ते १५ किलो पनीर लागते. एकदा विश्वास बसला की सतत ऑर्डर मिळतात.',
    practicalSteps: [
      'पहिल्या भेटीत २५० ग्रॅम पनीरचा मोफत नमुना (Sample) द्या आणि त्यांना तळून पाहायला सांगा.',
      'शहरातून येणाऱ्या जुन्या पनीरपेक्षा आपले पनीर किती ताजे व मऊ आहे ते दाखवा.',
      'दररोज सकाळी ९ वाजेपूर्वी थेट पोहोचवण्याची खात्री द्या.'
    ],
    targetAudience: 'परिसरातील १२ धाबे व रेस्टॉरंट्स',
    costEstimate: '₹० (फक्त सॅम्पलचा खर्च ₹१५०)'
  },
  {
    id: 'ch_whatsapp_community',
    title: 'गाव व सोसायटी व्हॉट्सॲप ग्रुप्स (WhatsApp Direct Orders)',
    iconName: 'MessageCircle',
    suitability: 'BEST',
    whyRecommended: 'गावातील आणि शेजारच्या कॉलनीतील कुटुंबांना शुद्ध गावरान दुग्ध उत्पादने थेट दारात हवी असतात.',
    practicalSteps: [
      'दररोज सकाळी ७ वाजता "आजचे ताजे पनीर तयार आहे - घरपोच ऑर्डरसाठी मेसेज करा" असा साधा मेसेज टाका.',
      'सुट्टीच्या दिवशी (शनिवार/रविवार) २५० ग्रॅम व ५०० ग्रॅम पॅकच्या आगाऊ ऑर्डर्स घ्या.'
    ],
    targetAudience: 'गावातील नोकरदार व स्थानिक कुटुंबे',
    costEstimate: '₹० (फक्त मोबाईल डेटा)'
  },
  {
    id: 'ch_weekly_haat',
    title: 'आठवडी बाजार स्टॉल (Weekly Rural Haat & Bazaar)',
    iconName: 'Store',
    suitability: 'GOOD',
    whyRecommended: 'रविवार किंवा बाजाराच्या दिवशी परिसरातील १० गावांचे लोक एकत्र येतात. रोख पैशात विक्री होते.',
    practicalSteps: [
      'बाजारात स्वच्छ टेबल, आईस बॉक्स आणि लहान डिजिटल वजनकाटा घेऊन बसा.',
      'ग्राहक समोर खाऊन पाहू शकतील असे लहान तुकडे ठेवा.'
    ],
    targetAudience: 'आठवडी बाजारातील खरेदीदार',
    costEstimate: '₹५० ते ₹१०० जागा भाडे'
  },
  {
    id: 'ch_caterers_events',
    title: 'लग्न कार्यालय व केटरर्स (Wedding Halls & Caterers)',
    iconName: 'Users',
    suitability: 'GOOD',
    whyRecommended: 'एकाच लग्नात ५० ते १०० किलो पनीरची मोठी एकरकमी ऑर्डर मिळते.',
    practicalSteps: [
      'तालुक्यातील ५ प्रमुख आचारी व केटरर्सचे मोबाईल नंबर मिळवून त्यांची भेट घ्या.',
      'मोठ्या ऑर्डर्ससाठी ₹१० प्रति किलो सवलत द्या.'
    ],
    targetAudience: 'स्थानिक केटरर्स व मंडप डेकोरेटर्स',
    costEstimate: 'फक्त वैयक्तिक संपर्क'
  }
];

export const PRICING_DATA: PricingAnalysis = {
  costPerUnit: 245, // ₹36 milk x 5L = ₹180 + processing & packaging ₹65
  competitorPriceRange: { min: 300, max: 360 },
  suggestedPriceFloor: 295,
  suggestedPriceCeiling: 340,
  recommendedPrice: 320,
  marginAtRecommended: 75, // ₹75 profit per kg (23.4% margin)
  affordabilityLevel: 'HIGH',
  simpleTip:
    'हॉटेल्सना ₹३१० घाऊक दराने आणि थेट ग्राहकांना ₹३४० किरकोळ दराने विका. यामुळे सरासरी ₹३२० चा दर आणि २५% नफा राहील.'
};

export const EXPANSION_ROADMAP: ExpansionPhase[] = [
  {
    id: 'exp_now',
    timeframe: 'NOW',
    timeframeLabel: 'सुरुवातीचा टप्पा (० ते ३ महिने)',
    revenueMilestone: 'दरमहा ₹१,५०,००० ते ₹२,००,००० विक्री',
    keyTarget: 'दररोज २०-२५ किलो पनीर उत्पादन आणि स्थानिक ५ हॉटेल्सना नियमित पुरवठा.',
    reinvestmentPlan: 'सर्व नफा खेळत्या भांडवलात ठेवा, लगेच नवीन खर्च करू नका.',
    capacityAddition: 'स्वतः आणि १ मदतनीस कामगार.',
    mustNotExpandUntil: [
      'पहिल्या ३ महिन्यांत दुधाचा पुरवठा कधीही खंडित झालेला नसावा.',
      'हॉटेल्सकडून आठवड्याची उधारी नियमित ९०% वेळेवर वसूल झालेली असावी.',
      'उत्पादनाची गुणवत्ता टिकून राहिलेली असावी.'
    ]
  },
  {
    id: 'exp_6m',
    timeframe: '6_MONTHS',
    timeframeLabel: 'स्थैर्य टप्पा (३ ते ६ महिने)',
    revenueMilestone: 'दरमहा ₹३,५०,००० विक्री',
    keyTarget: 'दैनिक ४०-५० किलो उत्पादन + घट्ट दही व ताक पॅकिंग सुरू करणे.',
    reinvestmentPlan: 'नफ्यातील ३०% रक्कम अतिरिक्त डीप फ्रीझरसाठी वापरा.',
    capacityAddition: '१ पूर्णवेळ कर्मचारी व डिलिव्हरी व्हॅन/बाईक सोय.',
    mustNotExpandUntil: [
      'बँकेचा मासिक हप्ता (EMI) सलग ६ महिने वेळेत भरलेला असावा.',
      'आपत्कालीन खात्यात किमान ₹५०,००० शिल्लक असावी.'
    ]
  },
  {
    id: 'exp_1y',
    timeframe: '1_YEAR',
    timeframeLabel: 'विस्तार टप्पा (१ ते २ वर्षे)',
    revenueMilestone: 'दरमहा ₹७,००,०००+ विक्री',
    keyTarget: 'शेजारच्या २ तालुक्यांमध्ये पुरवठा + स्वतःचा ब्रँडेड रिटेल आउटलेट.',
    reinvestmentPlan: 'स्वयंचलित व्हॅक्यूम पॅकिंग मशीन खरेदी.',
    capacityAddition: '४ कर्मचारी आणि अधिकृत वितरक जाळे.',
    mustNotExpandUntil: [
      'स्थानिक बाजारात तुमच्या ब्रँडला स्वतःची ओळख मिळालेली असावी.',
      'FSSAI व सर्व कायदेशीर परवाने पूर्ण असावेत.'
    ]
  }
];

export const marketingService = {
  getMarketingChannels(): MarketingChannelItem[] {
    return MARKETING_CHANNELS;
  },

  getPricingGuidance(): PricingAnalysis {
    return PRICING_DATA;
  },

  getExpansionRoadmap(): ExpansionPhase[] {
    return EXPANSION_ROADMAP;
  }
};
