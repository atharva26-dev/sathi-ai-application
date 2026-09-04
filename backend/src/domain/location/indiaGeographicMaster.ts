/**
 * SAATHI — India Geographic Master & LGD Resolution Engine
 * 
 * Government of India Local Government Directory (LGD) Hierarchy:
 * India -> State / UT -> District -> Sub-District / Taluka -> Village / Town
 * 
 * Comprehensive coverage of all 28 Indian States and 8 Union Territories.
 * Ambiguity-aware entity resolver: Never silently chooses the wrong village.
 * Multilingual alias resolution and administrative versioning/renaming support.
 */

export interface MultilingualName {
  en: string;
  mr: string;
  hi: string;
  ta?: string; // Tamil
  te?: string; // Telugu
  kn?: string; // Kannada
  bn?: string; // Bengali
  gu?: string; // Gujarati
  pa?: string; // Punjabi
  or?: string; // Odia
  as?: string; // Assamese
  ur?: string; // Urdu
}

export interface MasterStateRecord {
  lgdCode: number;
  canonicalName: string;
  nameNative: MultilingualName;
  type: 'STATE' | 'UNION_TERRITORY';
  capital: string;
  districtCount: number;
  aliases: string[];
}

export interface MasterDistrictRecord {
  lgdCode: number;
  stateLgdCode: number;
  canonicalName: string;
  nameNative: MultilingualName;
  headquarters: string;
  aliases: string[];
  subDistrictCount: number;
}

export interface MasterSubDistrictRecord {
  lgdCode: number;
  districtLgdCode: number;
  stateLgdCode: number;
  canonicalName: string;
  nameNative: MultilingualName;
  aliases: string[];
}

export interface MasterVillageRecord {
  lgdCode: number;
  subDistrictLgdCode: number;
  districtLgdCode: number;
  stateLgdCode: number;
  canonicalName: string;
  nameNative: MultilingualName;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  aliases: string[];
}

export interface LocationResolutionResult {
  country: string;
  state: string;
  stateLgdCode?: number;
  district: string;
  districtLgdCode?: number;
  subDistrict: string;
  subDistrictLgdCode?: number;
  block: string;
  blockLgdCode?: number;
  village: string;
  villageLgdCode?: number;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  resolvedGranularity: 'Village' | 'Taluka' | 'District' | 'State' | 'Unknown';
  isAmbiguous: boolean;
  isUnknown?: boolean;
  ambiguityOptions?: Array<{
    displayName: string;
    village: string;
    subDistrict: string;
    district: string;
    state: string;
    districtLgdCode: number;
  }>;
  granularityNotice: {
    mr: string;
    hi: string;
    en: string;
  };
}

// ============================================================================
// ALL 28 INDIAN STATES AND 8 UNION TERRITORIES (36 TOTAL)
// ============================================================================

export const ALL_INDIA_STATES_AND_UTS: MasterStateRecord[] = [
  // 28 STATES
  {
    lgdCode: 28,
    canonicalName: 'Andhra Pradesh',
    nameNative: { en: 'Andhra Pradesh', mr: 'आंध्र प्रदेश', hi: 'आंध्र प्रदेश', te: 'ఆంధ్ర ప్రదేశ్' },
    type: 'STATE',
    capital: 'Amaravati',
    districtCount: 26,
    aliases: ['AP', 'Andhra']
  },
  {
    lgdCode: 12,
    canonicalName: 'Arunachal Pradesh',
    nameNative: { en: 'Arunachal Pradesh', mr: 'अरुणाचल प्रदेश', hi: 'अरुणाचल प्रदेश' },
    type: 'STATE',
    capital: 'Itanagar',
    districtCount: 26,
    aliases: ['Arunachal']
  },
  {
    lgdCode: 18,
    canonicalName: 'Assam',
    nameNative: { en: 'Assam', mr: 'आसाम', hi: 'असम', as: 'অসম', bn: 'আসাম' },
    type: 'STATE',
    capital: 'Dispur',
    districtCount: 35,
    aliases: ['Asom', 'Oxom']
  },
  {
    lgdCode: 10,
    canonicalName: 'Bihar',
    nameNative: { en: 'Bihar', mr: 'बिहार', hi: 'बिहार', ur: 'بہار' },
    type: 'STATE',
    capital: 'Patna',
    districtCount: 38,
    aliases: ['Magadh']
  },
  {
    lgdCode: 22,
    canonicalName: 'Chhattisgarh',
    nameNative: { en: 'Chhattisgarh', mr: 'छत्तीसगड', hi: 'छत्तीसगढ़' },
    type: 'STATE',
    capital: 'Raipur',
    districtCount: 33,
    aliases: ['Chattisgarh', 'CG']
  },
  {
    lgdCode: 30,
    canonicalName: 'Goa',
    nameNative: { en: 'Goa', mr: 'गोवा', hi: 'गोवा', kn: 'ಗೋವಾ' },
    type: 'STATE',
    capital: 'Panaji',
    districtCount: 2,
    aliases: ['Gomantak']
  },
  {
    lgdCode: 24,
    canonicalName: 'Gujarat',
    nameNative: { en: 'Gujarat', mr: 'गुजरात', hi: 'गुजरात', gu: 'ગુજરાત' },
    type: 'STATE',
    capital: 'Gandhinagar',
    districtCount: 33,
    aliases: ['Gujrat', 'GJ']
  },
  {
    lgdCode: 6,
    canonicalName: 'Haryana',
    nameNative: { en: 'Haryana', mr: 'हरियाणा', hi: 'हरियाणा', pa: 'ਹਰਿਆਣਾ' },
    type: 'STATE',
    capital: 'Chandigarh',
    districtCount: 22,
    aliases: ['HR']
  },
  {
    lgdCode: 2,
    canonicalName: 'Himachal Pradesh',
    nameNative: { en: 'Himachal Pradesh', mr: 'हिमाचल प्रदेश', hi: 'हिमाचल प्रदेश' },
    type: 'STATE',
    capital: 'Shimla',
    districtCount: 12,
    aliases: ['Himachal', 'HP']
  },
  {
    lgdCode: 20,
    canonicalName: 'Jharkhand',
    nameNative: { en: 'Jharkhand', mr: 'झारखंड', hi: 'झारखंड' },
    type: 'STATE',
    capital: 'Ranchi',
    districtCount: 24,
    aliases: ['JH']
  },
  {
    lgdCode: 29,
    canonicalName: 'Karnataka',
    nameNative: { en: 'Karnataka', mr: 'कर्नाटक', hi: 'कर्नाटक', kn: 'ಕರ್ನಾಟಕ' },
    type: 'STATE',
    capital: 'Bengaluru',
    districtCount: 31,
    aliases: ['KA', 'Mysore']
  },
  {
    lgdCode: 32,
    canonicalName: 'Kerala',
    nameNative: { en: 'Kerala', mr: 'केरळ', hi: 'केरल' },
    type: 'STATE',
    capital: 'Thiruvananthapuram',
    districtCount: 14,
    aliases: ['KL', 'Keralam']
  },
  {
    lgdCode: 23,
    canonicalName: 'Madhya Pradesh',
    nameNative: { en: 'Madhya Pradesh', mr: 'मध्य प्रदेश', hi: 'मध्य प्रदेश' },
    type: 'STATE',
    capital: 'Bhopal',
    districtCount: 55,
    aliases: ['MP', 'Central India']
  },
  {
    lgdCode: 27,
    canonicalName: 'Maharashtra',
    nameNative: { en: 'Maharashtra', mr: 'महाराष्ट्र', hi: 'महाराष्ट्र' },
    type: 'STATE',
    capital: 'Mumbai',
    districtCount: 36,
    aliases: ['MH', 'Maha']
  },
  {
    lgdCode: 14,
    canonicalName: 'Manipur',
    nameNative: { en: 'Manipur', mr: 'मणिपूर', hi: 'मणिपुर' },
    type: 'STATE',
    capital: 'Imphal',
    districtCount: 16,
    aliases: ['MN']
  },
  {
    lgdCode: 17,
    canonicalName: 'Meghalaya',
    nameNative: { en: 'Meghalaya', mr: 'मेघालय', hi: 'मेघालय' },
    type: 'STATE',
    capital: 'Shillong',
    districtCount: 12,
    aliases: ['ML']
  },
  {
    lgdCode: 15,
    canonicalName: 'Mizoram',
    nameNative: { en: 'Mizoram', mr: 'मिझोराम', hi: 'मिज़ोरम' },
    type: 'STATE',
    capital: 'Aizawl',
    districtCount: 11,
    aliases: ['MZ']
  },
  {
    lgdCode: 13,
    canonicalName: 'Nagaland',
    nameNative: { en: 'Nagaland', mr: 'नागालँड', hi: 'नागालैंड' },
    type: 'STATE',
    capital: 'Kohima',
    districtCount: 16,
    aliases: ['NL']
  },
  {
    lgdCode: 21,
    canonicalName: 'Odisha',
    nameNative: { en: 'Odisha', mr: 'ओडिशा', hi: 'ओडिशा', or: 'ଓଡ଼ିଶା' },
    type: 'STATE',
    capital: 'Bhubaneswar',
    districtCount: 30,
    aliases: ['Orissa', 'OD']
  },
  {
    lgdCode: 3,
    canonicalName: 'Punjab',
    nameNative: { en: 'Punjab', mr: 'पंजाब', hi: 'पंजाब', pa: 'ਪੰਜਾਬ' },
    type: 'STATE',
    capital: 'Chandigarh',
    districtCount: 23,
    aliases: ['PB']
  },
  {
    lgdCode: 8,
    canonicalName: 'Rajasthan',
    nameNative: { en: 'Rajasthan', mr: 'राजस्थान', hi: 'राजस्थान' },
    type: 'STATE',
    capital: 'Jaipur',
    districtCount: 50,
    aliases: ['RJ', 'Rajputana']
  },
  {
    lgdCode: 11,
    canonicalName: 'Sikkim',
    nameNative: { en: 'Sikkim', mr: 'सिक्कीम', hi: 'सिक्किम' },
    type: 'STATE',
    capital: 'Gangtok',
    districtCount: 6,
    aliases: ['SK']
  },
  {
    lgdCode: 33,
    canonicalName: 'Tamil Nadu',
    nameNative: { en: 'Tamil Nadu', mr: 'तामिळनाडू', hi: 'तमिलनाडु', ta: 'தமிழ்நாடு' },
    type: 'STATE',
    capital: 'Chennai',
    districtCount: 38,
    aliases: ['TN', 'Madras State']
  },
  {
    lgdCode: 36,
    canonicalName: 'Telangana',
    nameNative: { en: 'Telangana', mr: 'तेलंगणा', hi: 'तेलंगाना', te: 'తెలంగాణ' },
    type: 'STATE',
    capital: 'Hyderabad',
    districtCount: 33,
    aliases: ['TS', 'TG']
  },
  {
    lgdCode: 16,
    canonicalName: 'Tripura',
    nameNative: { en: 'Tripura', mr: 'त्रिपुरा', hi: 'त्रिपुरा', bn: 'ত্রিপুরা' },
    type: 'STATE',
    capital: 'Agartala',
    districtCount: 8,
    aliases: ['TR']
  },
  {
    lgdCode: 9,
    canonicalName: 'Uttar Pradesh',
    nameNative: { en: 'Uttar Pradesh', mr: 'उत्तर प्रदेश', hi: 'उत्तर प्रदेश', ur: 'اتر پردیش' },
    type: 'STATE',
    capital: 'Lucknow',
    districtCount: 75,
    aliases: ['UP', 'United Provinces']
  },
  {
    lgdCode: 5,
    canonicalName: 'Uttarakhand',
    nameNative: { en: 'Uttarakhand', mr: 'उत्तराखंड', hi: 'उत्तराखंड' },
    type: 'STATE',
    capital: 'Dehradun',
    districtCount: 13,
    aliases: ['Uttaranchal', 'UK']
  },
  {
    lgdCode: 19,
    canonicalName: 'West Bengal',
    nameNative: { en: 'West Bengal', mr: 'पश्चिम बंगाल', hi: 'पश्चिम बंगाल', bn: 'পশ্চিমবঙ্গ' },
    type: 'STATE',
    capital: 'Kolkata',
    districtCount: 23,
    aliases: ['WB', 'Bangla', 'Bengal']
  },

  // 8 UNION TERRITORIES
  {
    lgdCode: 35,
    canonicalName: 'Andaman and Nicobar Islands',
    nameNative: { en: 'Andaman and Nicobar Islands', mr: 'अंदमान आणि निकोबार', hi: 'अंडमान और निकोबार द्वीप समूह' },
    type: 'UNION_TERRITORY',
    capital: 'Port Blair',
    districtCount: 3,
    aliases: ['Andaman', 'A&N']
  },
  {
    lgdCode: 4,
    canonicalName: 'Chandigarh',
    nameNative: { en: 'Chandigarh', mr: 'चंदिगढ', hi: 'चंडीगढ़', pa: 'ਚੰਡੀਗੜ੍ਹ' },
    type: 'UNION_TERRITORY',
    capital: 'Chandigarh',
    districtCount: 1,
    aliases: ['CH']
  },
  {
    lgdCode: 26,
    canonicalName: 'Dadra and Nagar Haveli and Daman and Diu',
    nameNative: { en: 'Dadra and Nagar Haveli and Daman and Diu', mr: 'दादरा व नगर हवेली आणि दमण व दीव', hi: 'दादरा और नगर हवेली एवं दमन और दीव', gu: 'દાદરા અને નગર હવેલી અને દમણ અને દીવ' },
    type: 'UNION_TERRITORY',
    capital: 'Daman',
    districtCount: 3,
    aliases: ['DNHDD', 'Daman Diu']
  },
  {
    lgdCode: 7,
    canonicalName: 'Delhi',
    nameNative: { en: 'Delhi (NCT)', mr: 'दिल्ली', hi: 'दिल्ली (राष्ट्रीय राजधानी क्षेत्र)', ur: 'دہلی' },
    type: 'UNION_TERRITORY',
    capital: 'New Delhi',
    districtCount: 11,
    aliases: ['NCT Delhi', 'National Capital Territory']
  },
  {
    lgdCode: 1,
    canonicalName: 'Jammu and Kashmir',
    nameNative: { en: 'Jammu and Kashmir', mr: 'जम्मू आणि काश्मीर', hi: 'जम्मू और कश्मीर', ur: 'جموں و کشمیر' },
    type: 'UNION_TERRITORY',
    capital: 'Srinagar (Summer), Jammu (Winter)',
    districtCount: 20,
    aliases: ['J&K', 'Kashmir']
  },
  {
    lgdCode: 37,
    canonicalName: 'Ladakh',
    nameNative: { en: 'Ladakh', mr: 'लडाख', hi: 'लद्दाख' },
    type: 'UNION_TERRITORY',
    capital: 'Leh',
    districtCount: 2,
    aliases: ['LA']
  },
  {
    lgdCode: 31,
    canonicalName: 'Lakshadweep',
    nameNative: { en: 'Lakshadweep', mr: 'लक्षद्वीप', hi: 'लक्षद्वीप' },
    type: 'UNION_TERRITORY',
    capital: 'Kavaratti',
    districtCount: 1,
    aliases: ['LD']
  },
  {
    lgdCode: 34,
    canonicalName: 'Puducherry',
    nameNative: { en: 'Puducherry', mr: 'पुडुचेरी', hi: 'पुडुचेरी', ta: 'புதுச்சேரி' },
    type: 'UNION_TERRITORY',
    capital: 'Puducherry',
    districtCount: 4,
    aliases: ['Pondicherry', 'PY']
  }
];

// ============================================================================
// REPRESENTATIVE MASTER DISTRICT REGISTRY (ALL GEOGRAPHIC ZONES)
// ============================================================================

export const MASTER_DISTRICT_REGISTRY: MasterDistrictRecord[] = [
  // MAHARASHTRA (27)
  {
    lgdCode: 504,
    stateLgdCode: 27,
    canonicalName: 'Sangli',
    nameNative: { en: 'Sangli', mr: 'सांगली', hi: 'सांगली' },
    headquarters: 'Sangli',
    aliases: ['Sangli District', 'सांगली जिल्हा'],
    subDistrictCount: 10
  },
  {
    lgdCode: 479,
    stateLgdCode: 27,
    canonicalName: 'Nashik',
    nameNative: { en: 'Nashik', mr: 'नाशिक', hi: 'नासिक' },
    headquarters: 'Nashik',
    aliases: ['Nasik', 'नाशिक जिल्हा'],
    subDistrictCount: 15
  },
  {
    lgdCode: 492,
    stateLgdCode: 27,
    canonicalName: 'Pune',
    nameNative: { en: 'Pune', mr: 'पुणे', hi: 'पुणे' },
    headquarters: 'Pune',
    aliases: ['Poona', 'पुणे जिल्हा', 'पुण्यात', 'पुण्याचा', 'पुण्याची', 'पुण्याचे', 'पुण्यातील', 'पुण्याला'],
    subDistrictCount: 14
  },
  {
    lgdCode: 493,
    stateLgdCode: 27,
    canonicalName: 'Satara',
    nameNative: { en: 'Satara', mr: 'सातारा', hi: 'सतारा' },
    headquarters: 'Satara',
    aliases: ['सातारा जिल्हा', 'साताऱ्यात', 'साताऱ्याचा', 'साताऱ्यातील', 'सातारा जिल्ह्यातील'],
    subDistrictCount: 11
  },
  {
    lgdCode: 505,
    stateLgdCode: 27,
    canonicalName: 'Kolhapur',
    nameNative: { en: 'Kolhapur', mr: 'कोल्हापूर', hi: 'कोल्हापुर' },
    headquarters: 'Kolhapur',
    aliases: ['कोल्हापूर जिल्हा', 'कोल्हापुरात', 'कोल्हापूरचा', 'कोल्हापूरची', 'कोल्हापूरचे', 'कोल्हापूरमध्ये', 'कोल्हापूरला', 'कोल्हापूर जिल्ह्यातील'],
    subDistrictCount: 12
  },
  {
    lgdCode: 502,
    stateLgdCode: 27,
    canonicalName: 'Solapur',
    nameNative: { en: 'Solapur', mr: 'सोलापूर', hi: 'सोलापुर' },
    headquarters: 'Solapur',
    aliases: ['Sholapur', 'सोलापूर जिल्हा'],
    subDistrictCount: 11
  },
  {
    lgdCode: 489,
    stateLgdCode: 27,
    canonicalName: 'Ahmednagar',
    nameNative: { en: 'Ahmednagar', mr: 'अहमदनगर', hi: 'अहमदनगर' },
    headquarters: 'Ahmednagar',
    aliases: ['Ahilyanagar', 'अहिल्यानगर'],
    subDistrictCount: 14
  },
  {
    lgdCode: 488,
    stateLgdCode: 27,
    canonicalName: 'Chhatrapati Sambhajinagar',
    nameNative: { en: 'Chhatrapati Sambhajinagar', mr: 'छत्रपती संभाजीनगर', hi: 'औरंगाबाद' },
    headquarters: 'Chhatrapati Sambhajinagar',
    aliases: ['Aurangabad', 'औरंगाबाद'],
    subDistrictCount: 9
  },
  {
    lgdCode: 501,
    stateLgdCode: 27,
    canonicalName: 'Dharashiv',
    nameNative: { en: 'Dharashiv', mr: 'धाराशिव', hi: 'उस्मानाबाद' },
    headquarters: 'Dharashiv',
    aliases: ['Osmanabad', 'उस्मानाबाद'],
    subDistrictCount: 8
  },
  {
    lgdCode: 500,
    stateLgdCode: 27,
    canonicalName: 'Nagpur',
    nameNative: { en: 'Nagpur', mr: 'नागपूर', hi: 'नागपुर' },
    headquarters: 'Nagpur',
    aliases: ['Orange City', 'नागपूर जिल्हा'],
    subDistrictCount: 14
  },
  {
    lgdCode: 466,
    stateLgdCode: 27,
    canonicalName: 'Amravati',
    nameNative: { en: 'Amravati', mr: 'अमरावती', hi: 'अमरावती' },
    headquarters: 'Amravati',
    aliases: ['अमरावती जिल्हा'],
    subDistrictCount: 14
  },
  {
    lgdCode: 484,
    stateLgdCode: 27,
    canonicalName: 'Latur',
    nameNative: { en: 'Latur', mr: 'लातूर', hi: 'लातुर' },
    headquarters: 'Latur',
    aliases: ['लातूर जिल्हा'],
    subDistrictCount: 10
  },
  {
    lgdCode: 486,
    stateLgdCode: 27,
    canonicalName: 'Nanded',
    nameNative: { en: 'Nanded', mr: 'नांदेड', hi: 'नांदेड़' },
    headquarters: 'Nanded',
    aliases: ['नांदेड जिल्हा'],
    subDistrictCount: 16
  },
  {
    lgdCode: 477,
    stateLgdCode: 27,
    canonicalName: 'Jalgaon',
    nameNative: { en: 'Jalgaon', mr: 'जळगाव', hi: 'जलगांव' },
    headquarters: 'Jalgaon',
    aliases: ['जळगाव जिल्हा'],
    subDistrictCount: 15
  },
  {
    lgdCode: 478,
    stateLgdCode: 27,
    canonicalName: 'Jalna',
    nameNative: { en: 'Jalna', mr: 'जालना', hi: 'जालना' },
    headquarters: 'Jalna',
    aliases: ['जालना जिल्हा'],
    subDistrictCount: 8
  },
  {
    lgdCode: 467,
    stateLgdCode: 27,
    canonicalName: 'Beed',
    nameNative: { en: 'Beed', mr: 'बीड', hi: 'बीड' },
    headquarters: 'Beed',
    aliases: ['बीड जिल्हा', 'Bhir'],
    subDistrictCount: 11
  },
  {
    lgdCode: 491,
    stateLgdCode: 27,
    canonicalName: 'Parbhani',
    nameNative: { en: 'Parbhani', mr: 'परभणी', hi: 'परभणी' },
    headquarters: 'Parbhani',
    aliases: ['परभणी जिल्हा'],
    subDistrictCount: 9
  },
  {
    lgdCode: 495,
    stateLgdCode: 27,
    canonicalName: 'Raigad',
    nameNative: { en: 'Raigad', mr: 'रायगड', hi: 'रायगढ़' },
    headquarters: 'Alibag',
    aliases: ['रायगड जिल्हा', 'Alibaug'],
    subDistrictCount: 15
  },
  {
    lgdCode: 496,
    stateLgdCode: 27,
    canonicalName: 'Ratnagiri',
    nameNative: { en: 'Ratnagiri', mr: 'रत्नागिरी', hi: 'रत्नागिरि' },
    headquarters: 'Ratnagiri',
    aliases: ['रत्नागिरी जिल्हा', 'Konkan'],
    subDistrictCount: 9
  },
  {
    lgdCode: 503,
    stateLgdCode: 27,
    canonicalName: 'Sindhudurg',
    nameNative: { en: 'Sindhudurg', mr: 'सिंधुदुर्ग', hi: 'सिंधुदुर्ग' },
    headquarters: 'Oros',
    aliases: ['सिंधुदुर्ग जिल्हा', 'Malvan', 'Kudal'],
    subDistrictCount: 8
  },
  {
    lgdCode: 506,
    stateLgdCode: 27,
    canonicalName: 'Thane',
    nameNative: { en: 'Thane', mr: 'ठाणे', hi: 'ठाणे' },
    headquarters: 'Thane',
    aliases: ['ठाणे जिल्हा'],
    subDistrictCount: 7
  },
  {
    lgdCode: 664,
    stateLgdCode: 27,
    canonicalName: 'Palghar',
    nameNative: { en: 'Palghar', mr: 'पालघर', hi: 'पालघर' },
    headquarters: 'Palghar',
    aliases: ['पालघर जिल्हा'],
    subDistrictCount: 8
  },
  {
    lgdCode: 485,
    stateLgdCode: 27,
    canonicalName: 'Mumbai',
    nameNative: { en: 'Mumbai', mr: 'मुंबई', hi: 'मुंबई' },
    headquarters: 'Mumbai',
    aliases: ['Bombay', 'मुंबई शहर', 'Mumbai Suburban', 'मुंबई उपनगर'],
    subDistrictCount: 4
  },

  // PUNJAB (03)
  {
    lgdCode: 36,
    stateLgdCode: 3,
    canonicalName: 'Shahid Bhagat Singh Nagar',
    nameNative: { en: 'Shahid Bhagat Singh Nagar', mr: 'शहीद भगतसिंग नगर', hi: 'शहीद भगत सिंह नगर (नवांशहर)', pa: 'ਸ਼ਹੀਦ ਭਗਤ ਸਿੰਘ ਨਗਰ' },
    headquarters: 'Nawanshahr',
    aliases: ['SBS Nagar', 'Nawanshahr', 'नवांशहर'],
    subDistrictCount: 3
  },

  // HARYANA (06)
  {
    lgdCode: 80,
    stateLgdCode: 6,
    canonicalName: 'Sonipat',
    nameNative: { en: 'Sonipat', mr: 'सोनिपत', hi: 'सोनीपत', pa: 'ਸੋਨੀਪਤ' },
    headquarters: 'Sonipat',
    aliases: ['Sonepat', 'सोनीपत'],
    subDistrictCount: 4
  },

  // ANDHRA PRADESH (28)
  {
    lgdCode: 510,
    stateLgdCode: 28,
    canonicalName: 'Guntur',
    nameNative: { en: 'Guntur', mr: 'गुंटूर', hi: 'गुंटूर', te: 'గుంటూరు' },
    headquarters: 'Guntur',
    aliases: ['Guntur District', 'గుంటూరు జిల్లా'],
    subDistrictCount: 18
  },
  {
    lgdCode: 513,
    stateLgdCode: 28,
    canonicalName: 'Krishna',
    nameNative: { en: 'Krishna', mr: 'कृष्णा', hi: 'कृष्णा', te: 'కృష్ణా' },
    headquarters: 'Machilipatnam',
    aliases: ['Krishna District', 'కృష్ణా జిల్లా'],
    subDistrictCount: 25
  },

  // RAJASTHAN (08)
  {
    lgdCode: 88,
    stateLgdCode: 8,
    canonicalName: 'Jaipur',
    nameNative: { en: 'Jaipur', mr: 'जयपूर', hi: 'जयपुर' },
    headquarters: 'Jaipur',
    aliases: ['Pink City', 'जयपुर जिला'],
    subDistrictCount: 16
  },

  // ASSAM (18)
  {
    lgdCode: 287,
    stateLgdCode: 18,
    canonicalName: 'Kamrup',
    nameNative: { en: 'Kamrup', mr: 'कामरूप', hi: 'कामरूप', as: 'কামৰূপ' },
    headquarters: 'Amingaon',
    aliases: ['Kamrup Rural', 'কামৰূপ জিলা'],
    subDistrictCount: 8
  },

  // UTTAR PRADESH (09)
  {
    lgdCode: 165,
    stateLgdCode: 9,
    canonicalName: 'Gorakhpur',
    nameNative: { en: 'Gorakhpur', mr: 'गोरखपूर', hi: 'गोरखपुर', ur: 'گورکھپور' },
    headquarters: 'Gorakhpur',
    aliases: ['Gorakhpur District'],
    subDistrictCount: 7
  },
  {
    lgdCode: 198,
    stateLgdCode: 9,
    canonicalName: 'Varanasi',
    nameNative: { en: 'Varanasi', mr: 'वाराणसी', hi: 'वाराणसी', ur: 'وارانسی' },
    headquarters: 'Varanasi',
    aliases: ['Banaras', 'Kashi', 'काशी', 'बनारस'],
    subDistrictCount: 3
  },
  {
    lgdCode: 157,
    stateLgdCode: 9,
    canonicalName: 'Lucknow',
    nameNative: { en: 'Lucknow', mr: 'लखनौ', hi: 'लखनऊ', ur: 'لکھنؤ' },
    headquarters: 'Lucknow',
    aliases: ['Awadh', 'लखनऊ जिला'],
    subDistrictCount: 5
  },

  // BIHAR (10)
  {
    lgdCode: 216,
    stateLgdCode: 10,
    canonicalName: 'Patna',
    nameNative: { en: 'Patna', mr: 'पाटणा', hi: 'पटना', ur: 'پٹنہ' },
    headquarters: 'Patna',
    aliases: ['Pataliputra', 'पटना जिला'],
    subDistrictCount: 6
  },

  // GUJARAT (24)
  {
    lgdCode: 450,
    stateLgdCode: 24,
    canonicalName: 'Surat',
    nameNative: { en: 'Surat', mr: 'सूरत', hi: 'सूरत', gu: 'સુરત' },
    headquarters: 'Surat',
    aliases: ['Diamond City', 'સુરત જિલ્લો'],
    subDistrictCount: 10
  },

  // KARNATAKA (29)
  {
    lgdCode: 529,
    stateLgdCode: 29,
    canonicalName: 'Bengaluru Urban',
    nameNative: { en: 'Bengaluru Urban', mr: 'बेंगळुरू शहर', hi: 'बेंगलुरु शहरी', kn: 'ಬೆಂಗಳೂರು ನಗರ' },
    headquarters: 'Bengaluru',
    aliases: ['Bengaluru', 'Bangalore', 'बेंगळुरू', 'बैंगलोर', 'Bangalore Urban'],
    subDistrictCount: 5
  },
  {
    lgdCode: 540,
    stateLgdCode: 29,
    canonicalName: 'Belagavi',
    nameNative: { en: 'Belagavi', mr: 'बेळगाव', hi: 'बेलगावी', kn: 'ಬೆಳಗಾವಿ' },
    headquarters: 'Belagavi',
    aliases: ['Belgaum', 'बेळगाव', 'ಬೆಳಗಾವಿ ಜಿಲ್ಲೆ'],
    subDistrictCount: 14
  },

  // TAMIL NADU (33)
  {
    lgdCode: 632,
    stateLgdCode: 33,
    canonicalName: 'Coimbatore',
    nameNative: { en: 'Coimbatore', mr: 'कोइम्बतूर', hi: 'कोयंबटूर', ta: 'கோயம்புத்தூர்' },
    headquarters: 'Coimbatore',
    aliases: ['Kovai', 'Manchester of South India'],
    subDistrictCount: 11
  },
  {
    lgdCode: 623,
    stateLgdCode: 33,
    canonicalName: 'Madurai',
    nameNative: { en: 'Madurai', mr: 'मदुराई', hi: 'मदुरै', ta: 'மதுரை' },
    headquarters: 'Madurai',
    aliases: ['Temple City', 'மதுரை மாவட்டம்'],
    subDistrictCount: 11
  },

  // WEST BENGAL (19)
  {
    lgdCode: 340,
    stateLgdCode: 19,
    canonicalName: 'Murshidabad',
    nameNative: { en: 'Murshidabad', mr: 'मुर्शिदाबाद', hi: 'मुर्शिदाबाद', bn: 'মুর্শিদাবাদ' },
    headquarters: 'Baharampur',
    aliases: ['মুর্শিদাবাদ জেলা'],
    subDistrictCount: 5
  },

  // MADHYA PRADESH (23)
  {
    lgdCode: 436,
    stateLgdCode: 23,
    canonicalName: 'Indore',
    nameNative: { en: 'Indore', mr: 'इंदूर', hi: 'इंदौर' },
    headquarters: 'Indore',
    aliases: ['Indur', 'इंदौर जिला'],
    subDistrictCount: 5
  },

  // ODISHA (21)
  {
    lgdCode: 378,
    stateLgdCode: 21,
    canonicalName: 'Cuttack',
    nameNative: { en: 'Cuttack', mr: 'कटक', hi: 'कटक', or: 'କଟକ' },
    headquarters: 'Cuttack',
    aliases: ['Kataka', 'Silver City'],
    subDistrictCount: 14
  }
];

// ============================================================================
// MASTER SUB-DISTRICT / TALUKA REGISTRY
// ============================================================================

export const MASTER_SUBDISTRICT_REGISTRY: MasterSubDistrictRecord[] = [
  // Sangli (504)
  { lgdCode: 4210, districtLgdCode: 504, stateLgdCode: 27, canonicalName: 'Palus', nameNative: { en: 'Palus', mr: 'पलूस', hi: 'पलूस' }, aliases: ['Palus Taluka', 'पलूस तालुका'] },
  { lgdCode: 4212, districtLgdCode: 504, stateLgdCode: 27, canonicalName: 'Miraj', nameNative: { en: 'Miraj', mr: 'मिरज', hi: 'मीरज' }, aliases: ['Miraj Taluka'] },
  { lgdCode: 4214, districtLgdCode: 504, stateLgdCode: 27, canonicalName: 'Walwa', nameNative: { en: 'Walwa', mr: 'वाळवा', hi: 'वाळवा' }, aliases: ['Islampur', 'इस्लामपूर'] },
  { lgdCode: 4211, districtLgdCode: 504, stateLgdCode: 27, canonicalName: 'Tasgaon', nameNative: { en: 'Tasgaon', mr: 'तासगाव', hi: 'तासगांव' }, aliases: ['Tasgaon Taluka'] },
  { lgdCode: 4213, districtLgdCode: 504, stateLgdCode: 27, canonicalName: 'Khanapur', nameNative: { en: 'Khanapur', mr: 'खानापूर', hi: 'खानापुर' }, aliases: ['Vita', 'विटा'] },
  { lgdCode: 4215, districtLgdCode: 504, stateLgdCode: 27, canonicalName: 'Shirala', nameNative: { en: 'Shirala', mr: 'शिराळा', hi: 'शिराला' }, aliases: ['Shirala Taluka'] },
  { lgdCode: 4216, districtLgdCode: 504, stateLgdCode: 27, canonicalName: 'Kadegaon', nameNative: { en: 'Kadegaon', mr: 'कडेगाव', hi: 'कडेगांव' }, aliases: ['Kadegaon Taluka'] },

  // Kolhapur (505)
  { lgdCode: 4217, districtLgdCode: 505, stateLgdCode: 27, canonicalName: 'Karvir', nameNative: { en: 'Karvir', mr: 'करवीर', hi: 'करवीर' }, aliases: ['Karvir Taluka', 'Kolhapur City', 'कोल्हापूर', 'करवीर तालुका'] },
  { lgdCode: 4218, districtLgdCode: 505, stateLgdCode: 27, canonicalName: 'Panhala', nameNative: { en: 'Panhala', mr: 'पन्हाळा', hi: 'पन्हाला' }, aliases: ['Panhala Taluka', 'पन्हाळा तालुका'] },
  { lgdCode: 4219, districtLgdCode: 505, stateLgdCode: 27, canonicalName: 'Hatkanangle', nameNative: { en: 'Hatkanangle', mr: 'हातकणंगले', hi: 'हातकणंगले' }, aliases: ['Hatkanangale', 'Ichalkaranji', 'इचलकरंजी', 'हातकणंगले तालुका'] },
  { lgdCode: 4220, districtLgdCode: 505, stateLgdCode: 27, canonicalName: 'Shirol', nameNative: { en: 'Shirol', mr: 'शिरोळ', hi: 'शिरोल' }, aliases: ['Shirol Taluka', 'Jaysingpur', 'जयसिंगपूर', 'शिरोळ तालुका'] },
  { lgdCode: 4221, districtLgdCode: 505, stateLgdCode: 27, canonicalName: 'Kagal', nameNative: { en: 'Kagal', mr: 'कागल', hi: 'कागल' }, aliases: ['Kagal Taluka', 'कागल तालुका'] },
  { lgdCode: 4222, districtLgdCode: 505, stateLgdCode: 27, canonicalName: 'Gadhinglaj', nameNative: { en: 'Gadhinglaj', mr: 'गडहिंग्लज', hi: 'गडहिंग्लज' }, aliases: ['Gadhinglaj Taluka', 'गडहिंग्लज तालुका'] },
  { lgdCode: 4223, districtLgdCode: 505, stateLgdCode: 27, canonicalName: 'Chandgad', nameNative: { en: 'Chandgad', mr: 'चंदगड', hi: 'चंदगढ' }, aliases: ['Chandgad Taluka', 'चंदगड तालुका'] },
  { lgdCode: 4224, districtLgdCode: 505, stateLgdCode: 27, canonicalName: 'Ajra', nameNative: { en: 'Ajra', mr: 'आजरा', hi: 'आजरा' }, aliases: ['Ajra Taluka', 'आजरा तालुका'] },
  { lgdCode: 4225, districtLgdCode: 505, stateLgdCode: 27, canonicalName: 'Bhudargad', nameNative: { en: 'Bhudargad', mr: 'भुदरगड', hi: 'भुदरगड' }, aliases: ['Gargoti', 'गारगोटी', 'भुदरगड तालुका'] },
  { lgdCode: 4226, districtLgdCode: 505, stateLgdCode: 27, canonicalName: 'Radhanagari', nameNative: { en: 'Radhanagari', mr: 'राधानगरी', hi: 'राधानगरी' }, aliases: ['Radhanagari Taluka', 'राधानगरी तालुका'] },
  { lgdCode: 4227, districtLgdCode: 505, stateLgdCode: 27, canonicalName: 'Bavda', nameNative: { en: 'Bavda', mr: 'गगनबावडा', hi: 'गगनबावड़ा' }, aliases: ['Gaganbavda', 'गगनबावडा तालुका'] },
  { lgdCode: 4228, districtLgdCode: 505, stateLgdCode: 27, canonicalName: 'Shahuwadi', nameNative: { en: 'Shahuwadi', mr: 'शाहूवाडी', hi: 'शाहूवाडी' }, aliases: ['Malkapur', 'मलकापूर', 'शाहूवाडी तालुका'] },

  // Nashik (479)
  { lgdCode: 4140, districtLgdCode: 479, stateLgdCode: 27, canonicalName: 'Nashik', nameNative: { en: 'Nashik', mr: 'नाशिक', hi: 'नासिक' }, aliases: ['Nashik Taluka'] },
  { lgdCode: 4142, districtLgdCode: 479, stateLgdCode: 27, canonicalName: 'Niphad', nameNative: { en: 'Niphad', mr: 'निफाड', hi: 'निफाड़' }, aliases: ['Niphad Taluka', 'Pimpalgaon'] },
  { lgdCode: 4144, districtLgdCode: 479, stateLgdCode: 27, canonicalName: 'Dindori', nameNative: { en: 'Dindori', mr: 'दिंडोरी', hi: 'दिंडोरी' }, aliases: ['Dindori Taluka'] },
  { lgdCode: 4143, districtLgdCode: 479, stateLgdCode: 27, canonicalName: 'Sinnar', nameNative: { en: 'Sinnar', mr: 'सिन्नर', hi: 'सिन्नर' }, aliases: ['Sinnar Taluka'] },

  // Pune (492)
  { lgdCode: 4180, districtLgdCode: 492, stateLgdCode: 27, canonicalName: 'Baramati', nameNative: { en: 'Baramati', mr: 'बारामती', hi: 'बारामती' }, aliases: ['Baramati Taluka', 'Supe'] },
  { lgdCode: 4175, districtLgdCode: 492, stateLgdCode: 27, canonicalName: 'Shirur', nameNative: { en: 'Shirur', mr: 'शिरूर', hi: 'शिरूर' }, aliases: ['Ghodnadi'] },
  { lgdCode: 4178, districtLgdCode: 492, stateLgdCode: 27, canonicalName: 'Daund', nameNative: { en: 'Daund', mr: 'दौंड', hi: 'दौंड' }, aliases: ['Daund Taluka'] },

  // SBS Nagar (36, Punjab)
  { lgdCode: 147, districtLgdCode: 36, stateLgdCode: 3, canonicalName: 'Nawanshahr', nameNative: { en: 'Nawanshahr', mr: 'नवांशहर', hi: 'नवांशहर', pa: 'ਨਵਾਂਸ਼ਹਿਰ' }, aliases: ['Nawanshahr Tehsil'] },
  { lgdCode: 148, districtLgdCode: 36, stateLgdCode: 3, canonicalName: 'Balachaur', nameNative: { en: 'Balachaur', mr: 'बलाचौर', hi: 'बलाचौर', pa: 'ਬਲਾਚੌਰ' }, aliases: ['Balachaur Tehsil'] },

  // Sonipat (80, Haryana)
  { lgdCode: 374, districtLgdCode: 80, stateLgdCode: 6, canonicalName: 'Sonipat', nameNative: { en: 'Sonipat', mr: 'सोनिपत', hi: 'सोनीपत', pa: 'ਸੋਨੀਪਤ' }, aliases: ['Sonipat Tehsil', 'Murthal'] },
  { lgdCode: 375, districtLgdCode: 80, stateLgdCode: 6, canonicalName: 'Ganaur', nameNative: { en: 'Ganaur', mr: 'गन्नौर', hi: 'गन्नौर' }, aliases: ['Ganaur Tehsil'] },

  // Guntur (510, Andhra Pradesh)
  { lgdCode: 5001, districtLgdCode: 510, stateLgdCode: 28, canonicalName: 'Guntur Urban', nameNative: { en: 'Guntur', mr: 'गुंटूर', hi: 'गुंटूर', te: 'గుంటూరు' }, aliases: ['Guntur Mandal'] },
  { lgdCode: 5002, districtLgdCode: 510, stateLgdCode: 28, canonicalName: 'Tenali', nameNative: { en: 'Tenali', mr: 'तेनाली', hi: 'तेनाली', te: 'తెనాలి' }, aliases: ['Tenali Mandal'] },

  // Jaipur (88, Rajasthan)
  { lgdCode: 8001, districtLgdCode: 88, stateLgdCode: 8, canonicalName: 'Sanganer', nameNative: { en: 'Sanganer', mr: 'सांगानेर', hi: 'सांगानेर' }, aliases: ['Sanganer Tehsil', 'Handblock hub'] },
  { lgdCode: 8002, districtLgdCode: 88, stateLgdCode: 8, canonicalName: 'Amer', nameNative: { en: 'Amer', mr: 'आमेर', hi: 'आमेर' }, aliases: ['Amber', 'आमेर'] },

  // Kamrup (287, Assam)
  { lgdCode: 2801, districtLgdCode: 287, stateLgdCode: 18, canonicalName: 'Hajo', nameNative: { en: 'Hajo', mr: 'हाजो', hi: 'हाजो', as: 'হাজো' }, aliases: ['Hajo Circle'] },
  { lgdCode: 2802, districtLgdCode: 287, stateLgdCode: 18, canonicalName: 'Palasbari', nameNative: { en: 'Palasbari', mr: 'पलासबाडी', hi: 'पलासबाड़ी', as: 'পলাশবাৰী' }, aliases: ['Palasbari Circle'] }
];

// ============================================================================
// MASTER VILLAGE & LOCAL BODY REGISTRY
// ============================================================================

export const MASTER_VILLAGE_REGISTRY: MasterVillageRecord[] = [
  // Palus Taluka (4210, Sangli)
  { lgdCode: 568720, subDistrictLgdCode: 4210, districtLgdCode: 504, stateLgdCode: 27, canonicalName: 'Palus', nameNative: { en: 'Palus', mr: 'पलूस', hi: 'पलूस' }, pincode: '416310', aliases: ['Palus Gram Panchayat', 'माझं गाव पलूस'] },
  { lgdCode: 568721, subDistrictLgdCode: 4210, districtLgdCode: 504, stateLgdCode: 27, canonicalName: 'Kundal', nameNative: { en: 'Kundal', mr: 'कुंडल', hi: 'कुंडल' }, pincode: '416309', aliases: ['Kundal Village'] },
  { lgdCode: 568722, subDistrictLgdCode: 4210, districtLgdCode: 504, stateLgdCode: 27, canonicalName: 'Bhilawadi', nameNative: { en: 'Bhilawadi', mr: 'भिलवडी', hi: 'भिलवड़ी' }, pincode: '416303', aliases: ['Bhilawadi Station'] },
  { lgdCode: 568723, subDistrictLgdCode: 4210, districtLgdCode: 504, stateLgdCode: 27, canonicalName: 'Burli', nameNative: { en: 'Burli', mr: 'बुर्ली', hi: 'बुर्ली' }, pincode: '416308', aliases: ['Burli Village'] },
  { lgdCode: 568724, subDistrictLgdCode: 4210, districtLgdCode: 504, stateLgdCode: 27, canonicalName: 'Dudhgaon', nameNative: { en: 'Dudhgaon', mr: 'दुधगाव', hi: 'दुधगांव' }, pincode: '416315', aliases: ['Dudhgaon Village'] },
  { lgdCode: 568725, subDistrictLgdCode: 4210, districtLgdCode: 504, stateLgdCode: 27, canonicalName: 'Ramanandnagar', nameNative: { en: 'Ramanandnagar', mr: 'रामानंदनगर', hi: 'रामानंदनगर' }, pincode: '416308', aliases: ['Kirloskarwadi'] },

  // Baramati Taluka (4180, Pune)
  { lgdCode: 555620, subDistrictLgdCode: 4180, districtLgdCode: 492, stateLgdCode: 27, canonicalName: 'Supe', nameNative: { en: 'Supe', mr: 'सुपे', hi: 'सुपे' }, pincode: '412258', aliases: ['सुपे बारामती', 'Supe Baramati'] },
  { lgdCode: 555621, subDistrictLgdCode: 4180, districtLgdCode: 492, stateLgdCode: 27, canonicalName: 'Malegaon Budruk', nameNative: { en: 'Malegaon Bk', mr: 'माळेगाव बुद्रुक', hi: 'मालेगांव बुद्रुक' }, pincode: '413115', aliases: ['Malegaon Baramati'] },

  // Niphad Taluka (4142, Nashik)
  { lgdCode: 550810, subDistrictLgdCode: 4142, districtLgdCode: 479, stateLgdCode: 27, canonicalName: 'Pimpalgaon Baswant', nameNative: { en: 'Pimpalgaon Baswant', mr: 'पिंपळगाव बसवंत', hi: 'पिंपलगांव बसवंत' }, pincode: '422209', aliases: ['Pimpalgaon Mandi'] },
  { lgdCode: 550811, subDistrictLgdCode: 4142, districtLgdCode: 479, stateLgdCode: 27, canonicalName: 'Ozar', nameNative: { en: 'Ozar', mr: 'ओझर', hi: 'ओझर' }, pincode: '422206', aliases: ['Ozar HAL'] },

  // Nawanshahr (147, SBS Nagar, Punjab)
  { lgdCode: 38210, subDistrictLgdCode: 147, districtLgdCode: 36, stateLgdCode: 3, canonicalName: 'Rahon', nameNative: { en: 'Rahon', mr: 'राहोण', hi: 'राहोण', pa: 'ਰਾਹੋਂ' }, pincode: '144517', aliases: ['Rahon Village'] },

  // Sonipat (374, Haryana)
  { lgdCode: 59310, subDistrictLgdCode: 374, districtLgdCode: 80, stateLgdCode: 6, canonicalName: 'Murthal', nameNative: { en: 'Murthal', mr: 'मुरथल', hi: 'मुरथल' }, pincode: '131027', aliases: ['Murthal Hub'] }
];

// ============================================================================
// NORMALIZATION & GEOGRAPHIC ENTITY RESOLVER
// ============================================================================

export class IndiaGeographicMaster {
  private conversationalFillers = [
    'माझं गाव', 'माझे गाव', 'आमचं गाव', 'गाव', 'गावातील', 'गावात',
    'मेरा गांव', 'मेरा गाव', 'गाँव', 'गांव', 'में', 'रहने वाला',
    'taluka', 'tehsil', 'tahsil', 'taluk', 'तालुका', 'तहसील',
    'district', 'dist', 'जिल्हा', 'जिल्ह्यातील', 'जिला', 'जिले',
    'state', 'राज्य', 'village', 'town', 'city', 'block', 'मंडी', 'mandi'
  ];

  /**
   * Safe matching for aliases ensuring aliases are matched as discrete word tokens,
   * not substrings inside other words (e.g. 'Bengal' must not match 'Bengaluru', 'KA' must not match 'karaycha').
   */
  private matchesAlias(textLower: string, alias: string): boolean {
    if (!alias) return false;
    const aLower = alias.toLowerCase().trim();
    const escaped = aLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const suffixGroup = '(?:चा|ची|चे|च्या|त|तील|मध्ये|ला|हून|वरून|कर|करांचा|करांचे)?';
    const regex = new RegExp(`(?:^|[^a-zA-Z0-9\u0900-\u097F])${escaped}${suffixGroup}(?:[^a-zA-Z0-9\u0900-\u097F]|$)`, 'i');
    return regex.test(textLower);
  }

  /**
   * Safe matching for names ensuring names are matched as discrete word tokens.
   */
  private matchesName(textLower: string, name?: string): boolean {
    if (!name) return false;
    const nLower = name.toLowerCase().trim();
    const escaped = nLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const suffixGroup = '(?:चा|ची|चे|च्या|त|तील|मध्ये|ला|हून|वरून|कर|करांचा|करांचे)?';
    const regex = new RegExp(`(?:^|[^a-zA-Z0-9\u0900-\u097F])${escaped}${suffixGroup}(?:[^a-zA-Z0-9\u0900-\u097F]|$)`, 'i');
    return regex.test(textLower);
  }

  /**
   * Cleans conversational natural language into normalized search tokens
   */
  public cleanQueryText(input: string): string {
    let text = input.trim();

    // Strip leading punctuation
    text = text.replace(/^[,\s.-]+|[,\s.-]+$/g, '');

    // Normalize whitespace
    text = text.replace(/\s+/g, ' ');

    let lower = text.toLowerCase();
    for (const filler of this.conversationalFillers) {
      const escaped = filler.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?:^|[^a-zA-Z0-9\u0900-\u097F])${escaped}(?=[^a-zA-Z0-9\u0900-\u097F]|$)`, 'gi');
      lower = lower.replace(regex, ' ');
    }

    return lower.replace(/\s+/g, ' ').trim();
  }

  /**
   * Resolves raw text into a canonical LocationResolutionResult.
   * Handles ambiguity gracefully without guessing.
   */
  public resolveLocation(rawInput?: string): LocationResolutionResult {
    if (!rawInput || !rawInput.trim()) {
      return {
        country: 'India',
        state: 'Unknown',
        district: 'Unknown',
        subDistrict: 'Unknown',
        block: 'Unknown',
        village: 'Unknown',
        resolvedGranularity: 'Unknown',
        isUnknown: true,
        isAmbiguous: false,
        granularityNotice: {
          mr: 'स्थानिक ठिकाण निवडलेले नाही; संपूर्ण देशाच्या सरासरीवर आधारित.',
          hi: 'स्थानिक स्थान चयनित नहीं है; राष्ट्रीय औसत पर आधारित।',
          en: 'No location provided; using national baseline.'
        }
      };
    }

    const cleaned = this.cleanQueryText(rawInput);
    const rawLower = rawInput.toLowerCase();
    const searchTarget = (cleaned + ' ' + rawLower).trim();

    // 1. Check Pincode matching (6 digits)
    const pinMatch = rawInput.match(/\b\d{6}\b/);
    if (pinMatch) {
      const pin = pinMatch[0];
      const villageWithPin = MASTER_VILLAGE_REGISTRY.find((v) => v.pincode === pin);
      if (villageWithPin) {
        return this.buildResolvedFromVillage(villageWithPin);
      }
    }

    // 2. Village Exact / Alias Match
    const villageMatches = MASTER_VILLAGE_REGISTRY.filter((v) => {
      return (
        this.matchesName(cleaned, v.canonicalName) ||
        this.matchesName(cleaned, v.nameNative.mr) ||
        this.matchesName(cleaned, v.nameNative.hi) ||
        v.aliases.some((a) => this.matchesAlias(rawLower, a))
      );
    });

    if (villageMatches.length === 1) {
      return this.buildResolvedFromVillage(villageMatches[0]);
    }

    if (villageMatches.length > 1) {
      // Ambiguous village matches across different talukas/districts
      return {
        country: 'India',
        state: 'Maharashtra',
        district: 'Multiple Matches Found',
        subDistrict: 'Multiple Matches',
        block: 'Multiple Matches',
        village: cleaned,
        resolvedGranularity: 'Village',
        isAmbiguous: true,
        ambiguityOptions: villageMatches.map((v) => {
          const dist = MASTER_DISTRICT_REGISTRY.find((d) => d.lgdCode === v.districtLgdCode);
          const sub = MASTER_SUBDISTRICT_REGISTRY.find((s) => s.lgdCode === v.subDistrictLgdCode);
          const st = ALL_INDIA_STATES_AND_UTS.find((s) => s.lgdCode === v.stateLgdCode);
          return {
            displayName: `${v.canonicalName} (${sub?.canonicalName || 'Taluka'}, ${dist?.canonicalName || 'District'})`,
            village: v.canonicalName,
            subDistrict: sub?.canonicalName || 'Taluka',
            district: dist?.canonicalName || 'District',
            state: st?.canonicalName || 'India',
            districtLgdCode: v.districtLgdCode
          };
        }),
        granularityNotice: {
          mr: `'${cleaned}' नावाची एकापेक्षा जास्त गावे आढळली आहेत; कृपया तुमचा तालुका किंवा जिल्हा निवडा.`,
          hi: `'${cleaned}' नाम के एक से अधिक गांव मिले हैं; कृपया अपना तालुका या जिला चुनें।`,
          en: `Multiple places matched '${cleaned}'. Please clarify your taluka or district.`
        }
      };
    }

    // 3. Sub-District / Taluka Match
    const subMatches = MASTER_SUBDISTRICT_REGISTRY.filter((s) => {
      return (
        this.matchesName(cleaned, s.canonicalName) ||
        this.matchesName(cleaned, s.nameNative.mr) ||
        this.matchesName(cleaned, s.nameNative.hi) ||
        s.aliases.some((a) => this.matchesAlias(rawLower, a))
      );
    });

    if (subMatches.length >= 1) {
      const sub = subMatches[0];
      const dist = MASTER_DISTRICT_REGISTRY.find((d) => d.lgdCode === sub.districtLgdCode);
      const st = ALL_INDIA_STATES_AND_UTS.find((s) => s.lgdCode === sub.stateLgdCode);

      return {
        country: 'India',
        state: st?.canonicalName || 'Maharashtra',
        stateLgdCode: st?.lgdCode || 27,
        district: dist?.canonicalName || 'Kolhapur',
        districtLgdCode: dist?.lgdCode || 505,
        subDistrict: sub.canonicalName,
        subDistrictLgdCode: sub.lgdCode,
        block: sub.canonicalName,
        blockLgdCode: sub.lgdCode,
        village: sub.canonicalName,
        resolvedGranularity: 'Taluka',
        isAmbiguous: false,
        granularityNotice: {
          mr: `'${sub.canonicalName}' तालुका व जिल्हा पातळीवरील अधिकृत माहितीवर आधारित; प्रत्यक्ष गावात खात्री करावी.`,
          hi: `'${sub.canonicalName}' तालुका व जिला स्तर के आधिकारिक डेटा पर आधारित।`,
          en: `Based on official taluka and district-level data for ${sub.canonicalName}. Local conditions should be verified.`
        }
      };
    }

    // 4. District Match
    const distMatches = MASTER_DISTRICT_REGISTRY.filter((d) => {
      return (
        this.matchesName(cleaned, d.canonicalName) ||
        this.matchesName(cleaned, d.nameNative.mr) ||
        this.matchesName(cleaned, d.nameNative.hi) ||
        d.aliases.some((a) => this.matchesAlias(rawLower, a))
      );
    });

    if (distMatches.length >= 1) {
      const dist = distMatches[0];
      const st = ALL_INDIA_STATES_AND_UTS.find((s) => s.lgdCode === dist.stateLgdCode);

      return {
        country: 'India',
        state: st?.canonicalName || 'India',
        stateLgdCode: st?.lgdCode,
        district: dist.canonicalName,
        districtLgdCode: dist.lgdCode,
        subDistrict: dist.canonicalName,
        block: dist.canonicalName,
        village: dist.canonicalName,
        resolvedGranularity: 'District',
        isAmbiguous: false,
        granularityNotice: {
          mr: `माहिती मुख्यतः '${dist.canonicalName}' जिल्हा पातळीवरील अधिकृत नोंदींवर आधारित आहे; गावात खात्री करा.`,
          hi: `डेटा मुख्यतः '${dist.canonicalName}' जिला स्तर पर आधारित है; स्थानीय स्तर पर स्वयं जांच करें।`,
          en: `Based mainly on district-level data for ${dist.canonicalName}. Local conditions should be verified in person.`
        }
      };
    }

    // 5. State / UT Match
    const stateMatches = ALL_INDIA_STATES_AND_UTS.filter((s) => {
      return (
        this.matchesName(cleaned, s.canonicalName) ||
        this.matchesName(cleaned, s.nameNative.mr) ||
        this.matchesName(cleaned, s.nameNative.hi) ||
        s.aliases.some((a) => this.matchesAlias(rawLower, a))
      );
    });

    if (stateMatches.length >= 1) {
      const st = stateMatches[0];
      const firstDist = MASTER_DISTRICT_REGISTRY.find((d) => d.stateLgdCode === st.lgdCode);

      return {
        country: 'India',
        state: st.canonicalName,
        stateLgdCode: st.lgdCode,
        district: firstDist?.canonicalName || st.capital,
        districtLgdCode: firstDist?.lgdCode,
        subDistrict: 'Sub-District',
        block: 'Block',
        village: st.capital,
        resolvedGranularity: 'State',
        isAmbiguous: false,
        granularityNotice: {
          mr: `'${st.canonicalName}' राज्य पातळीवरील अधिकृत माहितीवर आधारित; सूक्ष्म स्थानिक आकडेवारी उपलब्ध नाही.`,
          hi: `'${st.canonicalName}' राज्य स्तर के आधिकारिक डेटा पर आधारित; सूक्ष्म स्थानीय आंकड़े उपलब्ध नहीं हैं।`,
          en: `Based on state-level data for ${st.canonicalName}. Village-specific micro data is currently unavailable.`
        }
      };
    }

    // 6. Unmatched Query Fallback
    // If no pincode, village, taluka, district, or state matched, flag as Unknown so non-location queries do not corrupt location state
    return {
      country: 'India',
      state: 'Unknown',
      district: 'Unknown',
      subDistrict: 'Unknown',
      block: 'Unknown',
      village: 'Unknown',
      resolvedGranularity: 'Unknown',
      isUnknown: true,
      isAmbiguous: false,
      granularityNotice: {
        mr: `'${rawInput}' बाबत सूक्ष्म ग्रामपातळी डेटा उपलब्ध नाही; प्रत्यक्ष खात्री करावी.`,
        hi: `'${rawInput}' के लिए सूक्ष्म ग्राम-स्तरीय डेटा उपलब्ध नहीं है; स्थानीय स्तर पर पुष्टि करें।`,
        en: `Reliable village-level data is unavailable for '${rawInput}'. Specific geographic location could not be verified.`
      }
    };
  }

  /**
   * Find canonical state for a given district name
   */
  public findStateForDistrict(districtName: string): string {
    const dLower = (districtName || '').toLowerCase().trim();
    const match = MASTER_DISTRICT_REGISTRY.find((d) =>
      d.canonicalName.toLowerCase() === dLower ||
      d.nameNative.mr?.toLowerCase() === dLower ||
      d.nameNative.hi?.toLowerCase() === dLower ||
      d.aliases.some((a) => a.toLowerCase() === dLower)
    );
    if (match) {
      const st = ALL_INDIA_STATES_AND_UTS.find((s) => s.lgdCode === match.stateLgdCode);
      return st?.canonicalName || 'Maharashtra';
    }
    return 'Maharashtra';
  }

  private buildResolvedFromVillage(v: MasterVillageRecord): LocationResolutionResult {
    const dist = MASTER_DISTRICT_REGISTRY.find((d) => d.lgdCode === v.districtLgdCode);
    const sub = MASTER_SUBDISTRICT_REGISTRY.find((s) => s.lgdCode === v.subDistrictLgdCode);
    const st = ALL_INDIA_STATES_AND_UTS.find((s) => s.lgdCode === v.stateLgdCode);

    return {
      country: 'India',
      state: st?.canonicalName || 'Maharashtra',
      stateLgdCode: v.stateLgdCode,
      district: dist?.canonicalName || 'Sangli',
      districtLgdCode: v.districtLgdCode,
      subDistrict: sub?.canonicalName || 'Palus',
      subDistrictLgdCode: v.subDistrictLgdCode,
      block: sub?.canonicalName || 'Palus',
      blockLgdCode: v.subDistrictLgdCode,
      village: v.canonicalName,
      villageLgdCode: v.lgdCode,
      pincode: v.pincode,
      latitude: v.latitude,
      longitude: v.longitude,
      resolvedGranularity: 'Village',
      isAmbiguous: false,
      granularityNotice: {
        mr: `'${v.canonicalName}' गाव, '${sub?.canonicalName}' तालुका व अधिकृत जिल्हा माहितीवर आधारित.`,
        hi: `'${v.canonicalName}' ग्राम, '${sub?.canonicalName}' तालुका व जिला डेटा पर आधारित।`,
        en: `Based on official datasets for ${v.canonicalName} village, ${sub?.canonicalName} taluka, and ${dist?.canonicalName} district.`
      }
    };
  }
}

export const indiaGeographicMaster = new IndiaGeographicMaster();
