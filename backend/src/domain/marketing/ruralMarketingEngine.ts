export interface MarketingChannelPlaybook {
  id: string;
  title: string;
  iconName: string;
  suitability: 'BEST' | 'GOOD' | 'NOT_RECOMMENDED';
  whyRecommended: string;
  practicalSteps: string[];
  targetAudience: string;
  costEstimate: string;
}

export interface PricingGuidance {
  costPerUnit: number;
  competitorPriceRange: { min: number; max: number };
  suggestedPriceFloor: number;
  suggestedPriceCeiling: number;
  recommendedPrice: number;
  marginAtRecommended: number;
  affordabilityLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  simpleTip: string;
}

export const getRuralMarketingPlaybooks = (): MarketingChannelPlaybook[] => {
  return [
    {
      id: 'highway_dhabas',
      title: 'महामार्ग ढाबे व हॉटेल्स थेट पुरवठा',
      iconName: 'Utensils',
      suitability: 'BEST',
      whyRecommended: 'ढाब्यांना रोज सकाळी ताजे पनीर लागते. जर तुम्ही सकाळी ७ वाजता वेळेवर डिलिव्हरी दिली, तर ते कायमस्वरूपी ग्राहक बनतात.',
      practicalSteps: [
        'पहिल्या आठवड्यात जवळच्या ५ ढाब्यांना २५० ग्रॅम पनीर मोफत सॅम्पल द्या.',
        'ढाबा मालकाला पनीरची मऊपणा व भाजी करताना न फुटण्याची गुणवत्ता दाखवा.',
        'सकाळी ७ ते ८ दरम्यान नियमित डिलिव्हरीची हमी द्या.',
        'आठवड्याला रोख पेमेंटचा व्यवहार ठरवा.'
      ],
      targetAudience: 'महामार्गावरील हॉटेल्स, ढाबे आणि चायनीज सेंटर्स',
      costEstimate: '₹५०० (सॅम्पल खर्च)'
    },
    {
      id: 'whatsapp_community',
      title: 'गावचा व्हॉट्सॲप ग्रुप व थेट ग्राहक',
      iconName: 'MessageCircle',
      suitability: 'BEST',
      whyRecommended: 'गावातील कुटुंबे आणि शिक्षकांना शुद्ध ताज्या पनीरची नियमित मागणी असते. यात थेट किरकोळ भाव (₹३४०/kg) मिळतो.',
      practicalSteps: [
        'पनीर बनवतानाचा १५ सेकंदांचा स्वच्छ व्हिडीओ गावाच्या व्हॉट्सॲप ग्रुपवर टाका.',
        'दर रविवारी घरपोच डिलिव्हरीची नोंदणी घ्या.',
        'सण व उत्सवांना आदल्या दिवशी आगाऊ ऑर्डर्स गोळा करा.'
      ],
      targetAudience: 'गावातील स्थानिक कुटुंबे, शिक्षक व नोकरदार वर्ग',
      costEstimate: '₹० (मोफत)'
    },
    {
      id: 'wedding_caterers',
      title: 'लग्न समारंभ व केटरर्स नेटवर्क',
      iconName: 'Users',
      suitability: 'GOOD',
      whyRecommended: 'लग्नसराईत एकाच दिवशी ५० ते १०० किलो पनीरची मोठी एकरकमी ऑर्डर मिळते.',
      practicalSteps: [
        'तालुक्यातील ५ प्रमुख केटरर्स व मंगल कार्यालयांच्या आचाऱ्यांना भेटा.',
        'त्यांना घाऊक दरात (₹३००/kg) ताजा पुरवठा करण्याची ऑफर द्या.',
        'मोठ्या ऑर्डर्ससाठी ५०% ॲडव्हान्स घेण्याचा नियम ठेवा.'
      ],
      targetAudience: 'लग्न केटरर्स, मंगल कार्यालये व इव्हेंट आयोजक',
      costEstimate: '₹२०० (व्हिजिटिंग कार्ड)'
    }
  ];
};

export const calculatePricingGuidance = (
  costPerUnit = 245,
  competitorMin = 300,
  competitorMax = 360
): PricingGuidance => {
  const recommendedPrice = 320;
  const margin = recommendedPrice - costPerUnit;

  return {
    costPerUnit,
    competitorPriceRange: { min: competitorMin, max: competitorMax },
    suggestedPriceFloor: 295,
    suggestedPriceCeiling: 340,
    recommendedPrice,
    marginAtRecommended: margin,
    affordabilityLevel: 'HIGH',
    simpleTip:
      'हॉटेल्स व ढाब्यांना ₹३१० घाऊक भाव द्या जेणेकरून नियमित दररोज विक्री होईल, आणि दुकानावर किंवा गावातील ग्राहकांना ₹३४० किरकोळ भाव ठेवा.'
  };
};
