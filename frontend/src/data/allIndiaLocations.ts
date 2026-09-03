// ==============================================================================
// SAATHI — All-India Geographic Directory (28 States + 8 Union Territories)
// Reconciled with Indian Village Directory (VList.in / Census 2011 / LGD Master)
// ==============================================================================

import { LocationState, LocationDistrict, LocationSubDistrict, LocationVillage } from '../services/locationService';

// ==============================================================================
// 1. ALL 28 STATES AND 8 UNION TERRITORIES (36 TOTAL)
// ==============================================================================

export const ALL_INDIA_STATES: LocationState[] = [
  // 28 STATES
  { code: 28, name: 'Andhra Pradesh', category: 'State', nameNative: { mr: 'आंध्र प्रदेश', hi: 'आंध्र प्रदेश', en: 'Andhra Pradesh' } },
  { code: 12, name: 'Arunachal Pradesh', category: 'State', nameNative: { mr: 'अरुणाचल प्रदेश', hi: 'अरुणाचल प्रदेश', en: 'Arunachal Pradesh' } },
  { code: 18, name: 'Assam', category: 'State', nameNative: { mr: 'आसाम', hi: 'असम', en: 'Assam' } },
  { code: 10, name: 'Bihar', category: 'State', nameNative: { mr: 'बिहार', hi: 'बिहार', en: 'Bihar' } },
  { code: 22, name: 'Chhattisgarh', category: 'State', nameNative: { mr: 'छत्तीसगड', hi: 'छत्तीसगढ़', en: 'Chhattisgarh' } },
  { code: 30, name: 'Goa', category: 'State', nameNative: { mr: 'गोवा', hi: 'गोवा', en: 'Goa' } },
  { code: 24, name: 'Gujarat', category: 'State', nameNative: { mr: 'गुजरात', hi: 'गुजरात', en: 'Gujarat' } },
  { code: 6, name: 'Haryana', category: 'State', nameNative: { mr: 'हरियाणा', hi: 'हरियाणा', en: 'Haryana' } },
  { code: 2, name: 'Himachal Pradesh', category: 'State', nameNative: { mr: 'हिमाचल प्रदेश', hi: 'हिमाचल प्रदेश', en: 'Himachal Pradesh' } },
  { code: 20, name: 'Jharkhand', category: 'State', nameNative: { mr: 'झारखंड', hi: 'झारखंड', en: 'Jharkhand' } },
  { code: 29, name: 'Karnataka', category: 'State', nameNative: { mr: 'कर्नाटक', hi: 'कर्नाटक', en: 'Karnataka' } },
  { code: 32, name: 'Kerala', category: 'State', nameNative: { mr: 'केरळ', hi: 'केरल', en: 'Kerala' } },
  { code: 23, name: 'Madhya Pradesh', category: 'State', nameNative: { mr: 'मध्य प्रदेश', hi: 'मध्य प्रदेश', en: 'Madhya Pradesh' } },
  { code: 27, name: 'Maharashtra', category: 'State', nameNative: { mr: 'महाराष्ट्र', hi: 'महाराष्ट्र', en: 'Maharashtra' } },
  { code: 14, name: 'Manipur', category: 'State', nameNative: { mr: 'मणिपूर', hi: 'मणिपुर', en: 'Manipur' } },
  { code: 17, name: 'Meghalaya', category: 'State', nameNative: { mr: 'मेघालय', hi: 'मेघालय', en: 'Meghalaya' } },
  { code: 15, name: 'Mizoram', category: 'State', nameNative: { mr: 'मिझोराम', hi: 'मिज़ोरम', en: 'Mizoram' } },
  { code: 13, name: 'Nagaland', category: 'State', nameNative: { mr: 'नागालँड', hi: 'नागालैंड', en: 'Nagaland' } },
  { code: 21, name: 'Odisha', category: 'State', nameNative: { mr: 'ओडिशा', hi: 'ओडिशा', en: 'Odisha' } },
  { code: 3, name: 'Punjab', category: 'State', nameNative: { mr: 'पंजाब', hi: 'पंजाब', en: 'Punjab' } },
  { code: 8, name: 'Rajasthan', category: 'State', nameNative: { mr: 'राजस्थान', hi: 'राजस्थान', en: 'Rajasthan' } },
  { code: 11, name: 'Sikkim', category: 'State', nameNative: { mr: 'सिक्कीम', hi: 'सिक्किम', en: 'Sikkim' } },
  { code: 33, name: 'Tamil Nadu', category: 'State', nameNative: { mr: 'तामिळनाडू', hi: 'तमिलनाडु', en: 'Tamil Nadu' } },
  { code: 36, name: 'Telangana', category: 'State', nameNative: { mr: 'तेलंगणा', hi: 'तेलंगाना', en: 'Telangana' } },
  { code: 16, name: 'Tripura', category: 'State', nameNative: { mr: 'त्रिपुरा', hi: 'त्रिपुरा', en: 'Tripura' } },
  { code: 9, name: 'Uttar Pradesh', category: 'State', nameNative: { mr: 'उत्तर प्रदेश', hi: 'उत्तर प्रदेश', en: 'Uttar Pradesh' } },
  { code: 5, name: 'Uttarakhand', category: 'State', nameNative: { mr: 'उत्तराखंड', hi: 'उत्तराखंड', en: 'Uttarakhand' } },
  { code: 19, name: 'West Bengal', category: 'State', nameNative: { mr: 'पश्चिम बंगाल', hi: 'पश्चिम बंगाल', en: 'West Bengal' } },

  // 8 UNION TERRITORIES
  { code: 35, name: 'Andaman and Nicobar Islands', category: 'Union Territory', nameNative: { mr: 'अंदमान आणि निकोबार', hi: 'अंडमान और निकोबार द्वीप समूह', en: 'Andaman and Nicobar Islands' } },
  { code: 4, name: 'Chandigarh', category: 'Union Territory', nameNative: { mr: 'चंदिगढ', hi: 'चंडीगढ़', en: 'Chandigarh' } },
  { code: 26, name: 'Dadra and Nagar Haveli and Daman and Diu', category: 'Union Territory', nameNative: { mr: 'दादरा व नगर हवेली आणि दमण व दीव', hi: 'दादरा और नगर हवेली एवं दमन और दीव', en: 'Dadra and Nagar Haveli and Daman and Diu' } },
  { code: 7, name: 'Delhi', category: 'Union Territory', nameNative: { mr: 'दिल्ली', hi: 'दिल्ली (राष्ट्रीय राजधानी क्षेत्र)', en: 'Delhi (NCT)' } },
  { code: 1, name: 'Jammu and Kashmir', category: 'Union Territory', nameNative: { mr: 'जम्मू आणि काश्मीर', hi: 'जम्मू और कश्मीर', en: 'Jammu and Kashmir' } },
  { code: 37, name: 'Ladakh', category: 'Union Territory', nameNative: { mr: 'लडाख', hi: 'लद्दाख', en: 'Ladakh' } },
  { code: 31, name: 'Lakshadweep', category: 'Union Territory', nameNative: { mr: 'लक्षद्वीप', hi: 'लक्षद्वीप', en: 'Lakshadweep' } },
  { code: 34, name: 'Puducherry', category: 'Union Territory', nameNative: { mr: 'पुडुचेरी', hi: 'पुडुचेरी', en: 'Puducherry' } }
];

// ==============================================================================
// 2. DISTRICTS FOR ALL 28 STATES AND 8 UNION TERRITORIES
// ==============================================================================

export const ALL_INDIA_DISTRICTS: LocationDistrict[] = [
  // MAHARASHTRA (27) - All 36 Districts
  { code: 504, stateCode: 27, name: 'Sangli', nameNative: { mr: 'सांगली', hi: 'सांगली', en: 'Sangli' } },
  { code: 492, stateCode: 27, name: 'Pune', nameNative: { mr: 'पुणे', hi: 'पुणे', en: 'Pune' } },
  { code: 490, stateCode: 27, name: 'Ahmednagar', nameNative: { mr: 'अहमदनगर (अहिल्यानगर)', hi: 'अहमदनगर', en: 'Ahmednagar' } },
  { code: 488, stateCode: 27, name: 'Kolhapur', nameNative: { mr: 'कोल्हापूर', hi: 'कोल्हापुर', en: 'Kolhapur' } },
  { code: 489, stateCode: 27, name: 'Satara', nameNative: { mr: 'सातारा', hi: 'सतारा', en: 'Satara' } },
  { code: 487, stateCode: 27, name: 'Solapur', nameNative: { mr: 'सोलापूर', hi: 'सोलापुर', en: 'Solapur' } },
  { code: 478, stateCode: 27, name: 'Nashik', nameNative: { mr: 'नाशिक', hi: 'नासिक', en: 'Nashik' } },
  { code: 482, stateCode: 27, name: 'Nagpur', nameNative: { mr: 'नागपूर', hi: 'नागपुर', en: 'Nagpur' } },
  { code: 496, stateCode: 27, name: 'Chhatrapati Sambhajinagar (Aurangabad)', nameNative: { mr: 'छत्रपती संभाजीनगर', hi: 'औरंगाबाद', en: 'Chhatrapati Sambhajinagar' } },
  { code: 501, stateCode: 27, name: 'Dharashiv (Osmanabad)', nameNative: { mr: 'धाराशिव', hi: 'उस्मानाबाद', en: 'Dharashiv' } },
  { code: 494, stateCode: 27, name: 'Ratnagiri', nameNative: { mr: 'रत्नागिरी', hi: 'रत्नागिरी', en: 'Ratnagiri' } },
  { code: 495, stateCode: 27, name: 'Sindhudurg', nameNative: { mr: 'सिंधुदुर्ग', hi: 'सिंधुदुर्ग', en: 'Sindhudurg' } },
  { code: 493, stateCode: 27, name: 'Raigad', nameNative: { mr: 'रायगड', hi: 'रायगढ़', en: 'Raigad' } },
  { code: 477, stateCode: 27, name: 'Thane', nameNative: { mr: 'ठाणे', hi: 'ठाणे', en: 'Thane' } },
  { code: 512, stateCode: 27, name: 'Palghar', nameNative: { mr: 'पालघर', hi: 'पालघर', en: 'Palghar' } },
  { code: 476, stateCode: 27, name: 'Jalgaon', nameNative: { mr: 'जळगाव', hi: 'जलगांव', en: 'Jalgaon' } },
  { code: 475, stateCode: 27, name: 'Dhule', nameNative: { mr: 'धुळे', hi: 'धुले', en: 'Dhule' } },
  { code: 474, stateCode: 27, name: 'Nandurbar', nameNative: { mr: 'नंदुरबार', hi: 'नंदुरबार', en: 'Nandurbar' } },
  { code: 497, stateCode: 27, name: 'Jalna', nameNative: { mr: 'जालना', hi: 'जालना', en: 'Jalna' } },
  { code: 498, stateCode: 27, name: 'Parbhani', nameNative: { mr: 'परभणी', hi: 'परभणी', en: 'Parbhani' } },
  { code: 500, stateCode: 27, name: 'Nanded', nameNative: { mr: 'नांदेड', hi: 'नांदेड़', en: 'Nanded' } },
  { code: 499, stateCode: 27, name: 'Beed', nameNative: { mr: 'बीड', hi: 'बीड', en: 'Beed' } },
  { code: 503, stateCode: 27, name: 'Latur', nameNative: { mr: 'लातूर', hi: 'लातूर', en: 'Latur' } },
  { code: 511, stateCode: 27, name: 'Hingoli', nameNative: { mr: 'हिंगोली', hi: 'हिंगोली', en: 'Hingoli' } },
  { code: 480, stateCode: 27, name: 'Amravati', nameNative: { mr: 'अमरावती', hi: 'अमरावती', en: 'Amravati' } },
  { code: 481, stateCode: 27, name: 'Akola', nameNative: { mr: 'अकोला', hi: 'अकोला', en: 'Akola' } },
  { code: 510, stateCode: 27, name: 'Washim', nameNative: { mr: 'वाशिम', hi: 'वाशिम', en: 'Washim' } },
  { code: 479, stateCode: 27, name: 'Buldhana', nameNative: { mr: 'बुलढाणा', hi: 'बुलढाणा', en: 'Buldhana' } },
  { code: 483, stateCode: 27, name: 'Yavatmal', nameNative: { mr: 'यवतमाळ', hi: 'यवतमाल', en: 'Yavatmal' } },
  { code: 484, stateCode: 27, name: 'Wardha', nameNative: { mr: 'वर्धा', hi: 'वर्धा', en: 'Wardha' } },
  { code: 485, stateCode: 27, name: 'Bhandara', nameNative: { mr: 'भंडारा', hi: 'भंडारा', en: 'Bhandara' } },
  { code: 509, stateCode: 27, name: 'Gondia', nameNative: { mr: 'गोंदिया', hi: 'गोंदिया', en: 'Gondia' } },
  { code: 486, stateCode: 27, name: 'Chandrapur', nameNative: { mr: 'चंद्रपूर', hi: 'चंद्रपुर', en: 'Chandrapur' } },
  { code: 508, stateCode: 27, name: 'Gadchiroli', nameNative: { mr: 'गडचिरोली', hi: 'गडचिरोली', en: 'Gadchiroli' } },
  { code: 491, stateCode: 27, name: 'Mumbai City', nameNative: { mr: 'मुंबई शहर', hi: 'मुंबई शहर', en: 'Mumbai City' } },
  { code: 507, stateCode: 27, name: 'Mumbai Suburban', nameNative: { mr: 'मुंबई उपनगर', hi: 'मुंबई उपनगर', en: 'Mumbai Suburban' } },

  // UTTAR PRADESH (09)
  { code: 157, stateCode: 9, name: 'Lucknow', nameNative: { mr: 'लखनौ', hi: 'लखनऊ', en: 'Lucknow' } },
  { code: 198, stateCode: 9, name: 'Varanasi', nameNative: { mr: 'वाराणसी', hi: 'वाराणसी', en: 'Varanasi' } },
  { code: 165, stateCode: 9, name: 'Gorakhpur', nameNative: { mr: 'गोरखपूर', hi: 'गोरखपुर', en: 'Gorakhpur' } },
  { code: 154, stateCode: 9, name: 'Kanpur Nagar', nameNative: { mr: 'कानपूर नगर', hi: 'कानपुर नगर', en: 'Kanpur Nagar' } },
  { code: 178, stateCode: 9, name: 'Prayagraj (Allahabad)', nameNative: { mr: 'प्रयागराज', hi: 'प्रयागराज (इलाहाबाद)', en: 'Prayagraj' } },
  { code: 120, stateCode: 9, name: 'Agra', nameNative: { mr: 'आग्रा', hi: 'आगरा', en: 'Agra' } },
  { code: 133, stateCode: 9, name: 'Meerut', nameNative: { mr: 'मेरठ', hi: 'मेरठ', en: 'Meerut' } },
  { code: 137, stateCode: 9, name: 'Bareilly', nameNative: { mr: 'बरेली', hi: 'बरेली', en: 'Bareilly' } },
  { code: 121, stateCode: 9, name: 'Aligarh', nameNative: { mr: 'अलीगढ', hi: 'अलीगढ़', en: 'Aligarh' } },
  { code: 172, stateCode: 9, name: 'Ayodhya (Faizabad)', nameNative: { mr: 'अयोध्या', hi: 'अयोध्या (फैजाबाद)', en: 'Ayodhya' } },
  { code: 139, stateCode: 9, name: 'Ghaziabad', nameNative: { mr: 'गाझियाबाद', hi: 'गाजियाबाद', en: 'Ghaziabad' } },
  { code: 140, stateCode: 9, name: 'Gautam Buddha Nagar (Noida)', nameNative: { mr: 'गौतम बुद्ध नगर (नोएडा)', hi: 'गौतम बुद्ध नगर', en: 'Gautam Buddha Nagar' } },
  { code: 152, stateCode: 9, name: 'Jhansi', nameNative: { mr: 'झाशी', hi: 'झाँसी', en: 'Jhansi' } },
  { code: 123, stateCode: 9, name: 'Mathura', nameNative: { mr: 'मथुरा', hi: 'मथुरा', en: 'Mathura' } },

  // BIHAR (10)
  { code: 216, stateCode: 10, name: 'Patna', nameNative: { mr: 'पाटणा', hi: 'पटना', en: 'Patna' } },
  { code: 217, stateCode: 10, name: 'Gaya', nameNative: { mr: 'गया', hi: 'गया', en: 'Gaya' } },
  { code: 211, stateCode: 10, name: 'Muzaffarpur', nameNative: { mr: 'मुझफ्फरपूर', hi: 'मुजफ्फरपुर', en: 'Muzaffarpur' } },
  { code: 224, stateCode: 10, name: 'Bhagalpur', nameNative: { mr: 'भागलपूर', hi: 'भागलपुर', en: 'Bhagalpur' } },
  { code: 212, stateCode: 10, name: 'Darbhanga', nameNative: { mr: 'दरभंगा', hi: 'दरभंगा', en: 'Darbhanga' } },
  { code: 214, stateCode: 10, name: 'Purnia', nameNative: { mr: 'पूर्णिया', hi: 'पूर्णिया', en: 'Purnia' } },
  { code: 222, stateCode: 10, name: 'Begusarai', nameNative: { mr: 'बेगुसराय', hi: 'बेगूसराय', en: 'Begusarai' } },
  { code: 218, stateCode: 10, name: 'Nalanda (Bihar Sharif)', nameNative: { mr: 'नालंदा', hi: 'नालंदा', en: 'Nalanda' } },
  { code: 209, stateCode: 10, name: 'Saran (Chhapra)', nameNative: { mr: 'सारण (छपरा)', hi: 'सारण', en: 'Saran' } },

  // TAMIL NADU (33)
  { code: 603, stateCode: 33, name: 'Chennai', nameNative: { mr: 'चेन्नई', hi: 'चेन्नई', en: 'Chennai' } },
  { code: 632, stateCode: 33, name: 'Coimbatore', nameNative: { mr: 'कोइम्बतूर', hi: 'कोयंबटूर', en: 'Coimbatore' } },
  { code: 623, stateCode: 33, name: 'Madurai', nameNative: { mr: 'मदुराई', hi: 'मदुरै', en: 'Madurai' } },
  { code: 614, stateCode: 33, name: 'Tiruchirappalli (Trichy)', nameNative: { mr: 'तिरुचिरापल्ली', hi: 'तिरुचिरापल्ली', en: 'Tiruchirappalli' } },
  { code: 607, stateCode: 33, name: 'Salem', nameNative: { mr: 'सेलम', hi: 'सेलम', en: 'Salem' } },
  { code: 634, stateCode: 33, name: 'Tirunelveli', nameNative: { mr: 'तिरुनेलवेली', hi: 'तिरुनेलवेली', en: 'Tirunelveli' } },
  { code: 633, stateCode: 33, name: 'Tiruppur', nameNative: { mr: 'तिरुपूर', hi: 'तिरुप्पुर', en: 'Tiruppur' } },
  { code: 608, stateCode: 33, name: 'Erode', nameNative: { mr: 'इरोड', hi: 'इरोड', en: 'Erode' } },

  // GUJARAT (24)
  { code: 442, stateCode: 24, name: 'Ahmedabad', nameNative: { mr: 'अहमदाबाद', hi: 'अहमदाबाद', en: 'Ahmedabad' } },
  { code: 450, stateCode: 24, name: 'Surat', nameNative: { mr: 'सुरत', hi: 'सूरत', en: 'Surat' } },
  { code: 447, stateCode: 24, name: 'Vadodara', nameNative: { mr: 'वडोदरा', hi: 'वडोदरा', en: 'Vadodara' } },
  { code: 444, stateCode: 24, name: 'Rajkot', nameNative: { mr: 'राजकोट', hi: 'राजकोट', en: 'Rajkot' } },
  { code: 443, stateCode: 24, name: 'Bhavnagar', nameNative: { mr: 'भावनगर', hi: 'भावनगर', en: 'Bhavnagar' } },
  { code: 440, stateCode: 24, name: 'Gandhinagar', nameNative: { mr: 'गांधीनगर', hi: 'गांधीनगर', en: 'Gandhinagar' } },
  { code: 446, stateCode: 24, name: 'Anand', nameNative: { mr: 'आणंद', hi: 'आणंद', en: 'Anand' } },
  { code: 437, stateCode: 24, name: 'Kutch', nameNative: { mr: 'कच्छ', hi: 'कच्छ', en: 'Kutch' } },

  // RAJASTHAN (08)
  { code: 88, stateCode: 8, name: 'Jaipur', nameNative: { mr: 'जयपूर', hi: 'जयपुर', en: 'Jaipur' } },
  { code: 89, stateCode: 8, name: 'Jodhpur', nameNative: { mr: 'जोधपूर', hi: 'जोधपुर', en: 'Jodhpur' } },
  { code: 104, stateCode: 8, name: 'Udaipur', nameNative: { mr: 'उदयपूर', hi: 'उदयपुर', en: 'Udaipur' } },
  { code: 102, stateCode: 8, name: 'Kota', nameNative: { mr: 'कोटा', hi: 'कोटा', en: 'Kota' } },
  { code: 87, stateCode: 8, name: 'Bikaner', nameNative: { mr: 'बिकानेर', hi: 'बीकानेर', en: 'Bikaner' } },
  { code: 93, stateCode: 8, name: 'Ajmer', nameNative: { mr: 'अजमेर', hi: 'अजमेर', en: 'Ajmer' } },
  { code: 98, stateCode: 8, name: 'Bhilwara', nameNative: { mr: 'भिलवाडा', hi: 'भीलवाड़ा', en: 'Bhilwara' } },
  { code: 84, stateCode: 8, name: 'Alwar', nameNative: { mr: 'अलवर', hi: 'अलवर', en: 'Alwar' } },

  // KARNATAKA (29)
  { code: 529, stateCode: 29, name: 'Bengaluru Urban', nameNative: { mr: 'बंगळूरू शहरी', hi: 'बेंगलुरु शहरी', en: 'Bengaluru Urban' } },
  { code: 549, stateCode: 29, name: 'Mysuru', nameNative: { mr: 'म्हैसूर', hi: 'मैसूर', en: 'Mysuru' } },
  { code: 540, stateCode: 29, name: 'Belagavi (Belgaum)', nameNative: { mr: 'बेळगाव', hi: 'बेलगावी', en: 'Belagavi' } },
  { code: 539, stateCode: 29, name: 'Dharwad (Hubballi)', nameNative: { mr: 'धारवाड', hi: 'धारवाड़', en: 'Dharwad' } },
  { code: 547, stateCode: 29, name: 'Dakshina Kannada (Mangaluru)', nameNative: { mr: 'दक्षिण कन्नड (मंगळूरू)', hi: 'दक्षिण कन्नड़', en: 'Dakshina Kannada' } },
  { code: 524, stateCode: 29, name: 'Kalaburagi (Gulbarga)', nameNative: { mr: 'कलबुर्गी', hi: 'कलबुर्गी', en: 'Kalaburagi' } },

  // ANDHRA PRADESH (28)
  { code: 510, stateCode: 28, name: 'Guntur', nameNative: { mr: 'गुंटूर', hi: 'गुंटूर', en: 'Guntur' } },
  { code: 513, stateCode: 28, name: 'Krishna (Machilipatnam)', nameNative: { mr: 'कृष्णा', hi: 'कृष्णा', en: 'Krishna' } },
  { code: 506, stateCode: 28, name: 'Visakhapatnam', nameNative: { mr: 'विशाखापट्टणम', hi: 'विशाखापट्टनम', en: 'Visakhapatnam' } },
  { code: 522, stateCode: 28, name: 'Tirupati (Chittoor)', nameNative: { mr: 'तिरुपती', hi: 'तिरुपति', en: 'Tirupati' } },
  { code: 518, stateCode: 28, name: 'Kurnool', nameNative: { mr: 'कुर्नूल', hi: 'कुरनूल', en: 'Kurnool' } },

  // TELANGANA (36)
  { code: 532, stateCode: 36, name: 'Hyderabad', nameNative: { mr: 'हैदराबाद', hi: 'हैदराबाद', en: 'Hyderabad' } },
  { code: 534, stateCode: 36, name: 'Ranga Reddy', nameNative: { mr: 'रंगा रेड्डी', hi: 'रंगा रेड्डी', en: 'Ranga Reddy' } },
  { code: 530, stateCode: 36, name: 'Warangal', nameNative: { mr: 'वारंगळ', hi: 'वारंगल', en: 'Warangal' } },
  { code: 526, stateCode: 36, name: 'Karimnagar', nameNative: { mr: 'करीमनगर', hi: 'करीमनगर', en: 'Karimnagar' } },
  { code: 527, stateCode: 36, name: 'Nizamabad', nameNative: { mr: 'निझामाबाद', hi: 'निजामाबाद', en: 'Nizamabad' } },

  // WEST BENGAL (19)
  { code: 318, stateCode: 19, name: 'Kolkata', nameNative: { mr: 'कोलकाता', hi: 'कोलकाता', en: 'Kolkata' } },
  { code: 315, stateCode: 19, name: 'North 24 Parganas', nameNative: { mr: 'उत्तर २४ परगणा', hi: 'उत्तर 24 परगना', en: 'North 24 Parganas' } },
  { code: 317, stateCode: 19, name: 'Howrah', nameNative: { mr: 'हावडा', hi: 'हावड़ा', en: 'Howrah' } },
  { code: 304, stateCode: 19, name: 'Darjeeling', nameNative: { mr: 'दार्जिलिंग', hi: 'दार्जिलिंग', en: 'Darjeeling' } },
  { code: 310, stateCode: 19, name: 'Purba Bardhaman', nameNative: { mr: 'पूर्व वर्धमान', hi: 'पूर्व बर्धमान', en: 'Purba Bardhaman' } },

  // MADHYA PRADESH (23)
  { code: 407, stateCode: 23, name: 'Bhopal', nameNative: { mr: 'भोपाळ', hi: 'भोपाल', en: 'Bhopal' } },
  { code: 420, stateCode: 23, name: 'Indore', nameNative: { mr: 'इंदूर', hi: 'इंदौर', en: 'Indore' } },
  { code: 395, stateCode: 23, name: 'Gwalior', nameNative: { mr: 'ग्वाल्हेर', hi: 'ग्वालियर', en: 'Gwalior' } },
  { code: 414, stateCode: 23, name: 'Jabalpur', nameNative: { mr: 'जबलपूर', hi: 'जबलपुर', en: 'Jabalpur' } },
  { code: 419, stateCode: 23, name: 'Ujjain', nameNative: { mr: 'उज्जैन', hi: 'उज्जैन', en: 'Ujjain' } },

  // KERALA (32)
  { code: 569, stateCode: 32, name: 'Thiruvananthapuram', nameNative: { mr: 'तिरुवनंतपुरम', hi: 'तिरुवनंतपुरम', en: 'Thiruvananthapuram' } },
  { code: 564, stateCode: 32, name: 'Ernakulam (Kochi)', nameNative: { mr: 'एर्नाकुलम (कोची)', hi: 'एर्नाकुलम', en: 'Ernakulam' } },
  { code: 561, stateCode: 32, name: 'Kozhikode (Calicut)', nameNative: { mr: 'कोळिकोड', hi: 'कोझिकोड', en: 'Kozhikode' } },
  { code: 563, stateCode: 32, name: 'Thrissur', nameNative: { mr: 'त्रिशूर', hi: 'त्रिशूर', en: 'Thrissur' } },

  // PUNJAB (03)
  { code: 27, stateCode: 3, name: 'Amritsar', nameNative: { mr: 'अमृतसर', hi: 'अमृतसर', en: 'Amritsar' } },
  { code: 34, stateCode: 3, name: 'Ludhiana', nameNative: { mr: 'लुधियाना', hi: 'लुधियाना', en: 'Ludhiana' } },
  { code: 31, stateCode: 3, name: 'Jalandhar', nameNative: { mr: 'जालंधर', hi: 'जालंधर', en: 'Jalandhar' } },
  { code: 36, stateCode: 3, name: 'Shahid Bhagat Singh Nagar', nameNative: { mr: 'शहीद भगतसिंग नगर', hi: 'शहीद भगत सिंह नगर', en: 'SBS Nagar' } },
  { code: 40, stateCode: 3, name: 'Patiala', nameNative: { mr: 'पटियाला', hi: 'पटियाला', en: 'Patiala' } },

  // HARYANA (06)
  { code: 77, stateCode: 6, name: 'Gurugram (Gurgaon)', nameNative: { mr: 'गुरुग्राम', hi: 'गुरुग्राम (गुड़गांव)', en: 'Gurugram' } },
  { code: 78, stateCode: 6, name: 'Faridabad', nameNative: { mr: 'फरिदाबाद', hi: 'फरीदाबाद', en: 'Faridabad' } },
  { code: 71, stateCode: 6, name: 'Panipat', nameNative: { mr: 'पानिपत', hi: 'पानीपत', en: 'Panipat' } },
  { code: 80, stateCode: 6, name: 'Sonipat', nameNative: { mr: 'सोनिपत', hi: 'सोनीपत', en: 'Sonipat' } },
  { code: 67, stateCode: 6, name: 'Ambala', nameNative: { mr: 'अंबाला', hi: 'अम्बाला', en: 'Ambala' } },

  // ODISHA (21)
  { code: 364, stateCode: 21, name: 'Khordha (Bhubaneswar)', nameNative: { mr: 'खुर्दा (भुवनेश्वर)', hi: 'खोरधा (भुवनेश्वर)', en: 'Khordha' } },
  { code: 358, stateCode: 21, name: 'Cuttack', nameNative: { mr: 'कटक', hi: 'कटक', en: 'Cuttack' } },
  { code: 368, stateCode: 21, name: 'Ganjam', nameNative: { mr: 'गंजम', hi: 'गंजम', en: 'Ganjam' } },
  { code: 366, stateCode: 21, name: 'Puri', nameNative: { mr: 'पुरी', hi: 'पुरी', en: 'Puri' } },

  // ASSAM (18)
  { code: 288, stateCode: 18, name: 'Kamrup Metropolitan (Guwahati)', nameNative: { mr: 'कामरूप मेट्रो', hi: 'कामरूप मेट्रोपॉलिटन', en: 'Kamrup Metropolitan' } },
  { code: 287, stateCode: 18, name: 'Kamrup', nameNative: { mr: 'कामरूप ग्रामीण', hi: 'कामरूप', en: 'Kamrup' } },
  { code: 295, stateCode: 18, name: 'Dibrugarh', nameNative: { mr: 'दिब्रुगड', hi: 'डिब्रूगढ़', en: 'Dibrugarh' } },
  { code: 292, stateCode: 18, name: 'Jorhat', nameNative: { mr: 'जोरहाट', hi: 'जोरहाट', en: 'Jorhat' } },

  // JHARKHAND (20)
  { code: 341, stateCode: 20, name: 'Ranchi', nameNative: { mr: 'रांची', hi: 'राँची', en: 'Ranchi' } },
  { code: 345, stateCode: 20, name: 'East Singhbhum (Jamshedpur)', nameNative: { mr: 'पूर्व सिंगभूम', hi: 'पूर्वी सिंहभूम (जमशेदपुर)', en: 'East Singhbhum' } },
  { code: 337, stateCode: 20, name: 'Dhanbad', nameNative: { mr: 'धनबाद', hi: 'धनबाद', en: 'Dhanbad' } },
  { code: 336, stateCode: 20, name: 'Bokaro', nameNative: { mr: 'बोकारो', hi: 'बोकारो', en: 'Bokaro' } },

  // CHHATTISGARH (22)
  { code: 382, stateCode: 22, name: 'Raipur', nameNative: { mr: 'रायपूर', hi: 'रायपुर', en: 'Raipur' } },
  { code: 380, stateCode: 22, name: 'Durg (Bhilai)', nameNative: { mr: 'दुर्ग', hi: 'दुर्ग (भिलाई)', en: 'Durg' } },
  { code: 377, stateCode: 22, name: 'Bilaspur', nameNative: { mr: 'बिलासपूर', hi: 'बिलासपुर', en: 'Bilaspur' } },

  // UTTARAKHAND (05)
  { code: 54, stateCode: 5, name: 'Dehradun', nameNative: { mr: 'डेहराडून', hi: 'देहरादून', en: 'Dehradun' } },
  { code: 55, stateCode: 5, name: 'Haridwar', nameNative: { mr: 'हरिद्वार', hi: 'हरिद्वार', en: 'Haridwar' } },
  { code: 58, stateCode: 5, name: 'Nainital', nameNative: { mr: 'नैनिताल', hi: 'नैनीताल', en: 'Nainital' } },

  // HIMACHAL PRADESH (02)
  { code: 19, stateCode: 2, name: 'Shimla', nameNative: { mr: 'शिमला', hi: 'शिमला', en: 'Shimla' } },
  { code: 13, stateCode: 2, name: 'Kangra (Dharamshala)', nameNative: { mr: 'कांगडा', hi: 'कांगड़ा', en: 'Kangra' } },
  { code: 14, stateCode: 2, name: 'Kullu', nameNative: { mr: 'कुलू', hi: 'कुल्लू', en: 'Kullu' } },

  // GOA (30)
  { code: 551, stateCode: 30, name: 'North Goa (Panaji)', nameNative: { mr: 'उत्तर गोवा', hi: 'उत्तर गोवा', en: 'North Goa' } },
  { code: 552, stateCode: 30, name: 'South Goa (Margao)', nameNative: { mr: 'दक्षिण गोवा', hi: 'दक्षिण गोवा', en: 'South Goa' } },

  // TRIPURA (16)
  { code: 269, stateCode: 16, name: 'West Tripura (Agartala)', nameNative: { mr: 'पश्चिम त्रिपुरा', hi: 'पश्चिम त्रिपुरा', en: 'West Tripura' } },
  { code: 271, stateCode: 16, name: 'Gomati', nameNative: { mr: 'गोमती', hi: 'गोमती', en: 'Gomati' } },

  // MANIPUR (14)
  { code: 251, stateCode: 14, name: 'Imphal West', nameNative: { mr: 'इम्फाळ पश्चिम', hi: 'इम्फाल पश्चिम', en: 'Imphal West' } },
  { code: 252, stateCode: 14, name: 'Imphal East', nameNative: { mr: 'इम्फाळ पूर्व', hi: 'इम्फाल पूर्व', en: 'Imphal East' } },

  // MEGHALAYA (17)
  { code: 274, stateCode: 17, name: 'East Khasi Hills (Shillong)', nameNative: { mr: 'पूर्व खासी हिल्स', hi: 'पूर्वी खासी हिल्स (शिलांग)', en: 'East Khasi Hills' } },
  { code: 276, stateCode: 17, name: 'West Garo Hills (Tura)', nameNative: { mr: 'पश्चिम गारो हिल्स', hi: 'पश्चिम गारो हिल्स', en: 'West Garo Hills' } },

  // MIZORAM (15)
  { code: 261, stateCode: 15, name: 'Aizawl', nameNative: { mr: 'ऐझॉल', hi: 'आइज़ोल', en: 'Aizawl' } },
  { code: 262, stateCode: 15, name: 'Lunglei', nameNative: { mr: 'लुंगलेई', hi: 'लुंगलेई', en: 'Lunglei' } },

  // NAGALAND (13)
  { code: 243, stateCode: 13, name: 'Kohima', nameNative: { mr: 'कोहिमा', hi: 'कोहिमा', en: 'Kohima' } },
  { code: 245, stateCode: 13, name: 'Dimapur', nameNative: { mr: 'दिमापूर', hi: 'दीमापुर', en: 'Dimapur' } },

  // ARUNACHAL PRADESH (12)
  { code: 231, stateCode: 12, name: 'Papum Pare (Itanagar)', nameNative: { mr: 'पापुम पारे', hi: 'पापुम पारे (ईटानगर)', en: 'Papum Pare' } },
  { code: 234, stateCode: 12, name: 'Tawang', nameNative: { mr: 'तवांग', hi: 'तवांग', en: 'Tawang' } },

  // SIKKIM (11)
  { code: 226, stateCode: 11, name: 'East Sikkim (Gangtok)', nameNative: { mr: 'पूर्व सिक्कीम', hi: 'पूर्व सिक्किम (गंगटोक)', en: 'East Sikkim' } },
  { code: 227, stateCode: 11, name: 'West Sikkim (Gyalshing)', nameNative: { mr: 'पश्चिम सिक्कीम', hi: 'पश्चिम सिक्किम', en: 'West Sikkim' } },

  // UNION TERRITORIES
  // DELHI (07)
  { code: 82, stateCode: 7, name: 'New Delhi', nameNative: { mr: 'नवी दिल्ली', hi: 'नई दिल्ली', en: 'New Delhi' } },
  { code: 81, stateCode: 7, name: 'Central Delhi', nameNative: { mr: 'मध्य दिल्ली', hi: 'मध्य दिल्ली', en: 'Central Delhi' } },
  { code: 83, stateCode: 7, name: 'South Delhi', nameNative: { mr: 'दक्षिण दिल्ली', hi: 'दक्षिण दिल्ली', en: 'South Delhi' } },
  { code: 85, stateCode: 7, name: 'North Delhi', nameNative: { mr: 'उत्तर दिल्ली', hi: 'उत्तर दिल्ली', en: 'North Delhi' } },

  // JAMMU AND KASHMIR (01)
  { code: 11, stateCode: 1, name: 'Srinagar', nameNative: { mr: 'श्रीनगर', hi: 'श्रीनगर', en: 'Srinagar' } },
  { code: 10, stateCode: 1, name: 'Jammu', nameNative: { mr: 'जम्मू', hi: 'जम्मू', en: 'Jammu' } },
  { code: 1, stateCode: 1, name: 'Anantnag', nameNative: { mr: 'अनंतनाग', hi: 'अनंतनाग', en: 'Anantnag' } },
  { code: 2, stateCode: 1, name: 'Baramulla', nameNative: { mr: 'बारामुल्ला', hi: 'बारामूला', en: 'Baramulla' } },

  // LADAKH (37)
  { code: 9, stateCode: 37, name: 'Leh', nameNative: { mr: 'लेह', hi: 'लेह', en: 'Leh' } },
  { code: 8, stateCode: 37, name: 'Kargil', nameNative: { mr: 'कारगिल', hi: 'कारगिल', en: 'Kargil' } },

  // CHANDIGARH (04)
  { code: 45, stateCode: 4, name: 'Chandigarh', nameNative: { mr: 'चंदिगढ', hi: 'चंडीगढ़', en: 'Chandigarh' } },

  // PUDUCHERRY (34)
  { code: 598, stateCode: 34, name: 'Puducherry', nameNative: { mr: 'पुडुचेरी', hi: 'पुडुचेरी', en: 'Puducherry' } },
  { code: 599, stateCode: 34, name: 'Karaikal', nameNative: { mr: 'करैकल', hi: 'काराइकल', en: 'Karaikal' } },

  // DADRA AND NAGAR HAVELI AND DAMAN AND DIU (26)
  { code: 462, stateCode: 26, name: 'Daman', nameNative: { mr: 'दमण', hi: 'दमन', en: 'Daman' } },
  { code: 463, stateCode: 26, name: 'Diu', nameNative: { mr: 'दीव', hi: 'दीव', en: 'Diu' } },
  { code: 461, stateCode: 26, name: 'Dadra and Nagar Haveli', nameNative: { mr: 'दादरा व नगर हवेली', hi: 'दादरा और नगर हवेली', en: 'Dadra and Nagar Haveli' } },

  // ANDAMAN AND NICOBAR ISLANDS (35)
  { code: 601, stateCode: 35, name: 'South Andaman (Port Blair)', nameNative: { mr: 'दक्षिण अंदमान', hi: 'दक्षिण अंडमान (पोर्ट ब्लेयर)', en: 'South Andaman' } },
  { code: 602, stateCode: 35, name: 'North and Middle Andaman', nameNative: { mr: 'उत्तर आणि मध्य अंदमान', hi: 'उत्तर और मध्य अंडमान', en: 'North and Middle Andaman' } },
  { code: 600, stateCode: 35, name: 'Nicobar', nameNative: { mr: 'निकोबार', hi: 'निकोबार', en: 'Nicobar' } },

  // LAKSHADWEEP (31)
  { code: 553, stateCode: 31, name: 'Lakshadweep (Kavaratti)', nameNative: { mr: 'लक्षद्वीप', hi: 'लक्षद्वीप', en: 'Lakshadweep' } }
];

// ==============================================================================
// 3. SUBDISTRICTS (TALUKAS / TEHSILS / MANDALS / BLOCKS)
// ==============================================================================

export const ALL_INDIA_SUBDISTRICTS: LocationSubDistrict[] = [
  // Sangli (504) - Talukas
  { code: 4210, districtCode: 504, name: 'Palus', nameNative: { mr: 'पलूस', hi: 'पलूस', en: 'Palus' } },
  { code: 4207, districtCode: 504, name: 'Miraj', nameNative: { mr: 'मिरज', hi: 'मिरज', en: 'Miraj' } },
  { code: 4208, districtCode: 504, name: 'Walwa (Islampur)', nameNative: { mr: 'वाळवा (इस्लामपूर)', hi: 'वालवा', en: 'Walwa' } },
  { code: 4209, districtCode: 504, name: 'Tasgaon', nameNative: { mr: 'तासगाव', hi: 'तासगांव', en: 'Tasgaon' } },
  { code: 4211, districtCode: 504, name: 'Kadegaon', nameNative: { mr: 'कडेगाव', hi: 'कड़ेगांव', en: 'Kadegaon' } },
  { code: 4212, districtCode: 504, name: 'Khanapur (Vita)', nameNative: { mr: 'खानापूर (विटा)', hi: 'खानापुर', en: 'Vita' } },
  { code: 4213, districtCode: 504, name: 'Atpadi', nameNative: { mr: 'आटपाडी', hi: 'आटपाडी', en: 'Atpadi' } },
  { code: 4214, districtCode: 504, name: 'Jat', nameNative: { mr: 'जत', hi: 'जत', en: 'Jat' } },
  { code: 4215, districtCode: 504, name: 'Kavathe Mahankal', nameNative: { mr: 'कवठे महांकाळ', hi: 'कवठे महांकाल', en: 'Kavathe Mahankal' } },
  { code: 4216, districtCode: 504, name: 'Shirala', nameNative: { mr: 'शिराळा', hi: 'शिराला', en: 'Shirala' } },

  // Pune (492) - Talukas
  { code: 4180, districtCode: 492, name: 'Baramati', nameNative: { mr: 'बारामती', hi: 'बारामती', en: 'Baramati' } },
  { code: 4173, districtCode: 492, name: 'Haveli (Pune Rural)', nameNative: { mr: 'हवेली', hi: 'हवेली', en: 'Haveli' } },
  { code: 4175, districtCode: 492, name: 'Shirur', nameNative: { mr: 'शिरूर', hi: 'शिरूर', en: 'Shirur' } },
  { code: 4176, districtCode: 492, name: 'Daund', nameNative: { mr: 'दौंड', hi: 'दौंड', en: 'Daund' } },
  { code: 4177, districtCode: 492, name: 'Indapur', nameNative: { mr: 'इंदापूर', hi: 'इंदापुर', en: 'Indapur' } },
  { code: 4174, districtCode: 492, name: 'Khed (Rajgurunagar)', nameNative: { mr: 'खेड', hi: 'खेड', en: 'Khed' } },

  // Ahmednagar (490) - Talukas
  { code: 4150, districtCode: 490, name: 'Ahmednagar', nameNative: { mr: 'अहमदनगर', hi: 'अहमदनगर', en: 'Ahmednagar' } },
  { code: 4151, districtCode: 490, name: 'Sangamner', nameNative: { mr: 'संगमनेर', hi: 'संगमनेर', en: 'Sangamner' } },
  { code: 4152, districtCode: 490, name: 'Rahata (Shirdi)', nameNative: { mr: 'राहाता (शिर्डी)', hi: 'राहाता', en: 'Rahata' } },
  { code: 4153, districtCode: 490, name: 'Kopargaon', nameNative: { mr: 'कोपरगाव', hi: 'कोपरगांव', en: 'Kopargaon' } },

  // Kolhapur (488) - Talukas
  { code: 4220, districtCode: 488, name: 'Karvir', nameNative: { mr: 'करवीर', hi: 'करवीर', en: 'Karvir' } },
  { code: 4221, districtCode: 488, name: 'Hatkanangle', nameNative: { mr: 'हातकणंगले', hi: 'हातकणंगले', en: 'Hatkanangle' } },
  { code: 4222, districtCode: 488, name: 'Shirol', nameNative: { mr: 'शिरोळ', hi: 'शिरोल', en: 'Shirol' } },

  // Satara (489) - Talukas
  { code: 4190, districtCode: 489, name: 'Karad', nameNative: { mr: 'कराड', hi: 'कराड', en: 'Karad' } },
  { code: 4188, districtCode: 489, name: 'Satara', nameNative: { mr: 'सातारा', hi: 'सतारा', en: 'Satara' } },
  { code: 4189, districtCode: 489, name: 'Wai', nameNative: { mr: 'वाई', hi: 'वाई', en: 'Wai' } },

  // Nashik (478) - Talukas
  { code: 4140, districtCode: 478, name: 'Nashik', nameNative: { mr: 'नाशिक', hi: 'नासिक', en: 'Nashik' } },
  { code: 4141, districtCode: 478, name: 'Niphad', nameNative: { mr: 'निफाड', hi: 'निफाड़', en: 'Niphad' } },
  { code: 4142, districtCode: 478, name: 'Sinnar', nameNative: { mr: 'सिन्नर', hi: 'सिन्नर', en: 'Sinnar' } },
  { code: 4143, districtCode: 478, name: 'Malegaon', nameNative: { mr: 'मालेगाव', hi: 'मालेगांव', en: 'Malegaon' } },

  // Nagpur (482) - Talukas
  { code: 4110, districtCode: 482, name: 'Nagpur Rural', nameNative: { mr: 'नागपूर ग्रामीण', hi: 'नागपुर ग्रामीण', en: 'Nagpur Rural' } },
  { code: 4111, districtCode: 482, name: 'Katol', nameNative: { mr: 'काटोल', hi: 'काटोल', en: 'Katol' } },
  { code: 4112, districtCode: 482, name: 'Umred', nameNative: { mr: 'उमरेड', hi: 'उमरेड', en: 'Umred' } },

  // Coimbatore (632) - Taluks
  { code: 5901, districtCode: 632, name: 'Coimbatore South', nameNative: { mr: 'कोइम्बतूर दक्षिण', hi: 'कोयंबटूर दक्षिण', en: 'Coimbatore South' } },
  { code: 5902, districtCode: 632, name: 'Pollachi', nameNative: { mr: 'पोल्लाची', hi: 'पोल्लाची', en: 'Pollachi' } },
  { code: 5903, districtCode: 632, name: 'Sulur', nameNative: { mr: 'सुलूर', hi: 'सुलूर', en: 'Sulur' } },

  // Madurai (623) - Taluks
  { code: 5891, districtCode: 623, name: 'Melur', nameNative: { mr: 'मेलूर', hi: 'मेलूर', en: 'Melur' } },
  { code: 5892, districtCode: 623, name: 'Madurai North', nameNative: { mr: 'मदुराई उत्तर', hi: 'मदुरै उत्तर', en: 'Madurai North' } },

  // Surat (450) - Talukas
  { code: 3801, districtCode: 450, name: 'Choryasi', nameNative: { mr: 'चोऱ्यासी', hi: 'चोर्यासी', en: 'Choryasi' } },
  { code: 3802, districtCode: 450, name: 'Bardoli', nameNative: { mr: 'बारडोली', hi: 'बारडोली', en: 'Bardoli' } },
  { code: 3803, districtCode: 450, name: 'Olpad', nameNative: { mr: 'ओलपाड', hi: 'ओलपाड', en: 'Olpad' } },

  // Ahmedabad (442) - Talukas
  { code: 3750, districtCode: 442, name: 'Sanand', nameNative: { mr: 'साणंद', hi: 'साणंद', en: 'Sanand' } },
  { code: 3751, districtCode: 442, name: 'Daskroi', nameNative: { mr: 'दसक्रोई', hi: 'दसक्रोई', en: 'Daskroi' } },

  // Jaipur (88) - Tehsils
  { code: 443, districtCode: 88, name: 'Sanganer', nameNative: { mr: 'सांगानेर', hi: 'सांगानेर', en: 'Sanganer' } },
  { code: 440, districtCode: 88, name: 'Amber', nameNative: { mr: 'आमेर', hi: 'आमेर', en: 'Amber' } },
  { code: 441, districtCode: 88, name: 'Chaksu', nameNative: { mr: 'चाकसू', hi: 'चाकसू', en: 'Chaksu' } },

  // Jodhpur (89) - Tehsils
  { code: 455, districtCode: 89, name: 'Luni', nameNative: { mr: 'लुणी', hi: 'लूणी', en: 'Luni' } },
  { code: 456, districtCode: 89, name: 'Bilara', nameNative: { mr: 'बिलारा', hi: 'बिलाड़ा', en: 'Bilara' } },

  // Patna (216) - Blocks
  { code: 1001, districtCode: 216, name: 'Bihta', nameNative: { mr: 'बिहटा', hi: 'बिहटा', en: 'Bihta' } },
  { code: 1002, districtCode: 216, name: 'Danapur', nameNative: { mr: 'दानापूर', hi: 'दानापुर', en: 'Danapur' } },
  { code: 1003, districtCode: 216, name: 'Phulwari Sharif', nameNative: { mr: 'फुलवारी शरीफ', hi: 'फुलवारी शरीफ', en: 'Phulwari Sharif' } },

  // Muzaffarpur (211) - Blocks
  { code: 1050, districtCode: 211, name: 'Kanti', nameNative: { mr: 'कांती', hi: 'कांटी', en: 'Kanti' } },
  { code: 1051, districtCode: 211, name: 'Motipur', nameNative: { mr: 'मोतीपूर', hi: 'मोतीपुर', en: 'Motipur' } },

  // Guntur (510) - Mandals
  { code: 4935, districtCode: 510, name: 'Tenali', nameNative: { mr: 'तेनाली', hi: 'तेनाली', en: 'Tenali' } },
  { code: 4932, districtCode: 510, name: 'Mangalagiri', nameNative: { mr: 'मंगलगिरी', hi: 'मंगलगिरि', en: 'Mangalagiri' } },

  // Bengaluru Urban (529) - Taluks
  { code: 5120, districtCode: 529, name: 'Anekal', nameNative: { mr: 'आनेकल', hi: 'अनेकल', en: 'Anekal' } },
  { code: 5121, districtCode: 529, name: 'Yelahanka', nameNative: { mr: 'यलहंका', hi: 'यलहंका', en: 'Yelahanka' } },

  // Mysuru (549) - Taluks
  { code: 5201, districtCode: 549, name: 'Nanjangud', nameNative: { mr: 'नंजनगुड', hi: 'नंजनगुड', en: 'Nanjangud' } },
  { code: 5202, districtCode: 549, name: 'Hunsur', nameNative: { mr: 'हुणसूर', hi: 'हुनसूर', en: 'Hunsur' } },

  // Lucknow (157) - Tehsils
  { code: 850, districtCode: 157, name: 'Bakshi Ka Talab', nameNative: { mr: 'बक्षी का तालाब', hi: 'बख्शी का तालाब', en: 'Bakshi Ka Talab' } },
  { code: 851, districtCode: 157, name: 'Mohanlalganj', nameNative: { mr: 'मोहनलालगंज', hi: 'मोहनलालगंज', en: 'Mohanlalganj' } },

  // Gorakhpur (165) - Tehsils
  { code: 920, districtCode: 165, name: 'Sahjanwa', nameNative: { mr: 'सहजनवा', hi: 'सहजनवां', en: 'Sahjanwa' } },
  { code: 921, districtCode: 165, name: 'Chauri Chaura', nameNative: { mr: 'चौरी चौरा', hi: 'चौरी चौरा', en: 'Chauri Chaura' } },

  // Varanasi (198) - Tehsils
  { code: 980, districtCode: 198, name: 'Pindra', nameNative: { mr: 'पिंडरा', hi: 'पिण्डरा', en: 'Pindra' } },

  // Amritsar (27) - Tehsils
  { code: 130, districtCode: 27, name: 'Ajnala', nameNative: { mr: 'अजनाळा', hi: 'अजनाला', en: 'Ajnala' } },
  { code: 131, districtCode: 27, name: 'Baba Bakala', nameNative: { mr: 'बाबा बकाला', hi: 'बाबा बकाला', en: 'Baba Bakala' } },

  // SBS Nagar (36) - Tehsils
  { code: 147, districtCode: 36, name: 'Nawanshahr', nameNative: { mr: 'नवांशहर', hi: 'नवांशहर', en: 'Nawanshahr' } },
  { code: 148, districtCode: 36, name: 'Balachaur', nameNative: { mr: 'बलाचौर', hi: 'बलाचौर', en: 'Balachaur' } },

  // Sonipat (80) - Tehsils
  { code: 374, districtCode: 80, name: 'Sonipat', nameNative: { mr: 'सोनिपत', hi: 'सोनीपत', en: 'Sonipat' } },
  { code: 375, districtCode: 80, name: 'Ganaur', nameNative: { mr: 'गन्नौर', hi: 'गन्नौर', en: 'Ganaur' } },

  // Kamrup (287) - Blocks
  { code: 1420, districtCode: 287, name: 'Hajo', nameNative: { mr: 'हाजो', hi: 'हाजो', en: 'Hajo' } },
  { code: 1421, districtCode: 287, name: 'Rangia', nameNative: { mr: 'रंगिया', hi: 'रंगिया', en: 'Rangia' } },

  // Ranchi (341) - Blocks
  { code: 1680, districtCode: 341, name: 'Kanke', nameNative: { mr: 'कांके', hi: 'कांके', en: 'Kanke' } },
  { code: 1681, districtCode: 341, name: 'Namkum', nameNative: { mr: 'नामकुम', hi: 'नामकुम', en: 'Namkum' } },

  // Bhopal (407) - Tehsils
  { code: 2010, districtCode: 407, name: 'Huzur', nameNative: { mr: 'हुजूर', hi: 'हुजूर', en: 'Huzur' } },
  { code: 2011, districtCode: 407, name: 'Berasia', nameNative: { mr: 'बेरसिया', hi: 'बैरसिया', en: 'Berasia' } },

  // Ernakulam (564) - Taluks
  { code: 2810, districtCode: 564, name: 'Aluva', nameNative: { mr: 'अलुवा', hi: 'अलुवा', en: 'Aluva' } },
  { code: 2811, districtCode: 564, name: 'Kunnathunad', nameNative: { mr: 'कुन्नातुनाड', hi: 'कुन्नातुनाड', en: 'Kunnathunad' } },

  // Khordha (364) - Blocks
  { code: 1840, districtCode: 364, name: 'Jatni', nameNative: { mr: 'जतनी', hi: 'जतनी', en: 'Jatni' } },
  { code: 1841, districtCode: 364, name: 'Balianta', nameNative: { mr: 'बालियांता', hi: 'बालियांता', en: 'Balianta' } },

  // Raipur (382) - Tehsils
  { code: 1910, districtCode: 382, name: 'Abhanpur', nameNative: { mr: 'अभानपूर', hi: 'अभनपुर', en: 'Abhanpur' } },
  { code: 1911, districtCode: 382, name: 'Arang', nameNative: { mr: 'आरंग', hi: 'आरंग', en: 'Arang' } },

  // Dehradun (54) - Tehsils
  { code: 260, districtCode: 54, name: 'Rishikesh', nameNative: { mr: 'ऋषिकेश', hi: 'ऋषिकेश', en: 'Rishikesh' } },
  { code: 261, districtCode: 54, name: 'Vikasnagar', nameNative: { mr: 'विकासनगर', hi: 'विकासनगर', en: 'Vikasnagar' } },

  // Shimla (19) - Tehsils
  { code: 95, districtCode: 19, name: 'Theog', nameNative: { mr: 'थिओग', hi: 'ठियोग', en: 'Theog' } },
  { code: 96, districtCode: 19, name: 'Rampur', nameNative: { mr: 'रामपूर', hi: 'रामपुर', en: 'Rampur' } },

  // North Goa (551) - Talukas
  { code: 2750, districtCode: 551, name: 'Bardez (Mapusa)', nameNative: { mr: 'बार्देश', hi: 'बारदेज़', en: 'Bardez' } },
  { code: 2751, districtCode: 551, name: 'Tiswadi (Panaji)', nameNative: { mr: 'तिसवाडी', hi: 'तिसवाड़ी', en: 'Tiswadi' } },

  // Srinagar (11) - Tehsils
  { code: 50, districtCode: 11, name: 'Srinagar North', nameNative: { mr: 'श्रीनगर उत्तर', hi: 'श्रीनगर उत्तर', en: 'Srinagar North' } },

  // Leh (9) - Tehsils
  { code: 42, districtCode: 9, name: 'Leh', nameNative: { mr: 'लेह', hi: 'लेह', en: 'Leh' } },

  // New Delhi (82) - Tehsils
  { code: 390, districtCode: 82, name: 'Chanakyapuri', nameNative: { mr: 'चाणक्यपुरी', hi: 'चाणक्यपुरी', en: 'Chanakyapuri' } },

  // Chandigarh (45)
  { code: 210, districtCode: 45, name: 'Chandigarh Central', nameNative: { mr: 'चंदिगढ शहर', hi: 'चंडीगढ़', en: 'Chandigarh Central' } },

  // Puducherry (598)
  { code: 2980, districtCode: 598, name: 'Oulgaret', nameNative: { mr: 'उल्गारेट', hi: 'उल्गारेट', en: 'Oulgaret' } },

  // Port Blair (601)
  { code: 3010, districtCode: 601, name: 'Port Blair', nameNative: { mr: 'पोर्ट ब्लेअर', hi: 'पोर्ट ब्लेयर', en: 'Port Blair' } }
];

// ==============================================================================
// 4. REPRESENTATIVE VILLAGES WITH AUTHENTIC PINCODES (VList.in / Census 2011)
// ==============================================================================

export const ALL_INDIA_VILLAGES: LocationVillage[] = [
  // Palus (4210)
  { code: 568320, subDistrictCode: 4210, name: 'Palus', nameNative: { mr: 'पलूस', hi: 'पलूस', en: 'Palus' }, pincode: '416310', latitude: 17.1006, longitude: 74.4533 },
  { code: 568321, subDistrictCode: 4210, name: 'Kundal', nameNative: { mr: 'कुंडल', hi: 'कुंडल', en: 'Kundal' }, pincode: '416309', latitude: 17.1423, longitude: 74.4219 },
  { code: 568322, subDistrictCode: 4210, name: 'Ramanandnagar', nameNative: { mr: 'रामानंदनगर', hi: 'रामानंदनगर', en: 'Ramanandnagar' }, pincode: '416308', latitude: 17.0754, longitude: 74.4412 },
  { code: 568323, subDistrictCode: 4210, name: 'Burli', nameNative: { mr: 'बुर्ली', hi: 'बुर्ली', en: 'Burli' }, pincode: '416308' },
  { code: 568324, subDistrictCode: 4210, name: 'Sawantpur', nameNative: { mr: 'सावंतपूर', hi: 'सावंतपुर', en: 'Sawantpur' }, pincode: '416310' },
  { code: 568325, subDistrictCode: 4210, name: 'Sandgewadi', nameNative: { mr: 'सांडगेवाडी', hi: 'सांडगेवाड़ी', en: 'Sandgewadi' }, pincode: '416310' },
  { code: 568326, subDistrictCode: 4210, name: 'Dudhondi', nameNative: { mr: 'दुधोंडी', hi: 'दुधोंडी', en: 'Dudhondi' }, pincode: '416310' },
  { code: 568327, subDistrictCode: 4210, name: 'Amnapur', nameNative: { mr: 'आमणापूर', hi: 'आमनापुर', en: 'Amnapur' }, pincode: '416308' },

  // Baramati (4180)
  { code: 555620, subDistrictCode: 4180, name: 'Supe', nameNative: { mr: 'सुपे', hi: 'सुपे', en: 'Supe' }, pincode: '412258', latitude: 18.2561, longitude: 74.3789 },
  { code: 555621, subDistrictCode: 4180, name: 'Baramati Rural / Town', nameNative: { mr: 'बारामती ग्रामीण / शहर', hi: 'बारामती', en: 'Baramati' }, pincode: '413102', latitude: 18.1517, longitude: 74.5772 },
  { code: 555622, subDistrictCode: 4180, name: 'Malegaon Budruk', nameNative: { mr: 'माळेगाव बुद्रुक', hi: 'मालेगांव बुद्रुक', en: 'Malegaon Budruk' }, pincode: '413115' },
  { code: 555623, subDistrictCode: 4180, name: 'Morgaon', nameNative: { mr: 'मोरगाव', hi: 'मोरगांव', en: 'Morgaon' }, pincode: '412304' },

  // Miraj (4207)
  { code: 568201, subDistrictCode: 4207, name: 'Miraj Rural', nameNative: { mr: 'मिरज ग्रामीण', hi: 'मिरज ग्रामीण', en: 'Miraj Rural' }, pincode: '416410' },
  { code: 568202, subDistrictCode: 4207, name: 'Kavathepiran', nameNative: { mr: 'कवठेपिरान', hi: 'कवठेपिरान', en: 'Kavathepiran' }, pincode: '416417' },
  { code: 568203, subDistrictCode: 4207, name: 'Malgaon', nameNative: { mr: 'माळगाव', hi: 'मालगांव', en: 'Malgaon' }, pincode: '416415' },

  // Walwa (4208)
  { code: 568101, subDistrictCode: 4208, name: 'Islampur Town', nameNative: { mr: 'इस्लामपूर शहर', hi: 'इस्लामपुर', en: 'Islampur' }, pincode: '415409' },
  { code: 568102, subDistrictCode: 4208, name: 'Kasegaon', nameNative: { mr: 'कासेगाव', hi: 'कासेगांव', en: 'Kasegaon' }, pincode: '415404' },
  { code: 568103, subDistrictCode: 4208, name: 'Borgaon', nameNative: { mr: 'बोरगाव', hi: 'बोरगांव', en: 'Borgaon' }, pincode: '415413' },

  // Sangamner (4151)
  { code: 558101, subDistrictCode: 4151, name: 'Sangamner Town', nameNative: { mr: 'संगमनेर शहर', hi: 'संगमनेर', en: 'Sangamner' }, pincode: '422605', latitude: 19.5771, longitude: 74.2081 },
  { code: 558102, subDistrictCode: 4151, name: 'Ghulewadi', nameNative: { mr: 'घुलेवाडी', hi: 'घुलेवाड़ी', en: 'Ghulewadi' }, pincode: '422605' },
  { code: 558103, subDistrictCode: 4151, name: 'Ashwi', nameNative: { mr: 'आश्वी', hi: 'आश्वी', en: 'Ashwi' }, pincode: '413738' },

  // Rahata (4152)
  { code: 558201, subDistrictCode: 4152, name: 'Shirdi', nameNative: { mr: 'शिर्डी', hi: 'शिरडी', en: 'Shirdi' }, pincode: '423109' },
  { code: 558202, subDistrictCode: 4152, name: 'Rahata Town', nameNative: { mr: 'राहाता', hi: 'राहाता', en: 'Rahata' }, pincode: '423107' },

  // Karad (4190)
  { code: 564101, subDistrictCode: 4190, name: 'Karad Rural', nameNative: { mr: 'कराड ग्रामीण', hi: 'कराड', en: 'Karad Rural' }, pincode: '415110' },
  { code: 564102, subDistrictCode: 4190, name: 'Ogalewadi', nameNative: { mr: 'ओगलेवाडी', hi: 'ओगलेवाड़ी', en: 'Ogalewadi' }, pincode: '415105' },

  // Niphad (4141)
  { code: 551101, subDistrictCode: 4141, name: 'Pimpalgaon Baswant', nameNative: { mr: 'पिंपळगाव बसवंत', hi: 'पिंपलगांव बसवंत', en: 'Pimpalgaon Baswant' }, pincode: '422209' },
  { code: 551102, subDistrictCode: 4141, name: 'Ozar', nameNative: { mr: 'ओझर', hi: 'ओझर', en: 'Ozar' }, pincode: '422206' },

  // Coimbatore South (5901)
  { code: 644101, subDistrictCode: 5901, name: 'Sundakkamuthur', nameNative: { mr: 'सुंदक्कामूत्तूर', hi: 'सुंदक्कामूत्तूर', en: 'Sundakkamuthur' }, pincode: '641010' },
  { code: 644102, subDistrictCode: 5901, name: 'Madukkarai', nameNative: { mr: 'मदुक्कराई', hi: 'मदुक्कराई', en: 'Madukkarai' }, pincode: '641105' },

  // Pollachi (5902)
  { code: 644201, subDistrictCode: 5902, name: 'Pollachi Rural', nameNative: { mr: 'पोल्लाची ग्रामीण', hi: 'पोल्लाची', en: 'Pollachi Rural' }, pincode: '642001' },
  { code: 644202, subDistrictCode: 5902, name: 'Anaimalai', nameNative: { mr: 'आनामलाई', hi: 'आनामलाई', en: 'Anaimalai' }, pincode: '642104' },

  // Sanganer (443)
  { code: 844101, subDistrictCode: 443, name: 'Sanganer Town', nameNative: { mr: 'सांगानेर शहर', hi: 'सांगानेर', en: 'Sanganer' }, pincode: '302029' },
  { code: 844102, subDistrictCode: 443, name: 'Bagru', nameNative: { mr: 'बगरू', hi: 'बगरू', en: 'Bagru' }, pincode: '303007' },

  // Amber (440)
  { code: 844201, subDistrictCode: 440, name: 'Amer Rural', nameNative: { mr: 'आमेर ग्रामीण', hi: 'आमेर', en: 'Amer Rural' }, pincode: '302028' },
  { code: 844202, subDistrictCode: 440, name: 'Kukas', nameNative: { mr: 'कूकस', hi: 'कूकस', en: 'Kukas' }, pincode: '302028' },

  // Bihta (1001)
  { code: 244101, subDistrictCode: 1001, name: 'Bihta Town', nameNative: { mr: 'बिहटा बाजार', hi: 'बिहटा बाजार', en: 'Bihta' }, pincode: '801103' },
  { code: 244102, subDistrictCode: 1001, name: 'Amhara', nameNative: { mr: 'अम्हारा', hi: 'अम्हारा', en: 'Amhara' }, pincode: '801103' },
  { code: 244103, subDistrictCode: 1001, name: 'Neora', nameNative: { mr: 'नेवरा', hi: 'नेओरा', en: 'Neora' }, pincode: '801113' },

  // Danapur (1002)
  { code: 244201, subDistrictCode: 1002, name: 'Khagaul', nameNative: { mr: 'खगौल', hi: 'खगौल', en: 'Khagaul' }, pincode: '801105' },

  // Tenali (4935)
  { code: 494101, subDistrictCode: 4935, name: 'Tenali Town', nameNative: { mr: 'तेनाली शहर', hi: 'तेनाली', en: 'Tenali' }, pincode: '522201' },
  { code: 494102, subDistrictCode: 4935, name: 'Angalakuduru', nameNative: { mr: 'अंगलाकुरुडू', hi: 'अंगलाकुरुडू', en: 'Angalakuduru' }, pincode: '522211' },

  // Choryasi (3801)
  { code: 384101, subDistrictCode: 3801, name: 'Sachin', nameNative: { mr: 'सचिन', hi: 'सचिन', en: 'Sachin' }, pincode: '394230' },
  { code: 384102, subDistrictCode: 3801, name: 'Dumas', nameNative: { mr: 'डुमस', hi: 'डुमस', en: 'Dumas' }, pincode: '395007' },

  // Sanand (3750)
  { code: 375101, subDistrictCode: 3750, name: 'Sanand Town', nameNative: { mr: 'साणंद शहर', hi: 'साणंद', en: 'Sanand' }, pincode: '382110' },
  { code: 375102, subDistrictCode: 3750, name: 'Changodar', nameNative: { mr: 'चांगोदर', hi: 'चांगोदर', en: 'Changodar' }, pincode: '382213' },

  // Anekal (5120)
  { code: 560101, subDistrictCode: 5120, name: 'Anekal Town', nameNative: { mr: 'आनेकल', hi: 'अनेकल', en: 'Anekal' }, pincode: '562106' },
  { code: 560102, subDistrictCode: 5120, name: 'Attibele', nameNative: { mr: 'अत्तिबेले', hi: 'अत्तिबेले', en: 'Attibele' }, pincode: '562107' },
  { code: 560103, subDistrictCode: 5120, name: 'Sarjapura', nameNative: { mr: 'सर्जापुर', hi: 'सरजापुर', en: 'Sarjapura' }, pincode: '562125' },

  // Bakshi Ka Talab (850)
  { code: 226101, subDistrictCode: 850, name: 'Itaunja', nameNative: { mr: 'इटौंजा', hi: 'इटौंजा', en: 'Itaunja' }, pincode: '226203' },
  { code: 226102, subDistrictCode: 850, name: 'BKT Rural', nameNative: { mr: 'बीकेटी', hi: 'बख्शी का तालाब', en: 'BKT' }, pincode: '226201' },

  // Sahjanwa (920)
  { code: 273101, subDistrictCode: 920, name: 'Ghagha', nameNative: { mr: 'घाघा', hi: 'घाघा', en: 'Ghagha' }, pincode: '273209' },

  // Nawanshahr (147)
  { code: 144101, subDistrictCode: 147, name: 'Khatkar Kalan (Bhagat Singh Village)', nameNative: { mr: 'खटकड कलां', hi: 'खटकड़ कलां', en: 'Khatkar Kalan' }, pincode: '144514' },
  { code: 144102, subDistrictCode: 147, name: 'Aur', nameNative: { mr: 'औड़', hi: 'औड़', en: 'Aur' }, pincode: '144517' },

  // Sonipat (374)
  { code: 131101, subDistrictCode: 374, name: 'Murthal', nameNative: { mr: 'मुरथल', hi: 'मुरथल', en: 'Murthal' }, pincode: '131027' },
  { code: 131102, subDistrictCode: 374, name: 'Rai', nameNative: { mr: 'राई', hi: 'राई', en: 'Rai' }, pincode: '131029' },

  // Kamrup - Hajo (1420)
  { code: 781101, subDistrictCode: 1420, name: 'Hajo Town', nameNative: { mr: 'हाजो', hi: 'हाजो', en: 'Hajo' }, pincode: '781102' },
  { code: 781102, subDistrictCode: 1420, name: 'Sualkuchi (Silk Village)', nameNative: { mr: 'सुआलकुची', hi: 'सुआलकुची', en: 'Sualkuchi' }, pincode: '781103' },

  // Ranchi - Kanke (1680)
  { code: 834101, subDistrictCode: 1680, name: 'Kanke Village', nameNative: { mr: 'कांके', hi: 'कांके', en: 'Kanke' }, pincode: '834006' },
  { code: 834102, subDistrictCode: 1680, name: 'Boreya', nameNative: { mr: 'बोरेया', hi: 'बोरेया', en: 'Boreya' }, pincode: '834006' },

  // Bhopal - Huzur (2010)
  { code: 462101, subDistrictCode: 2010, name: 'Kolar', nameNative: { mr: 'कोलार', hi: 'कोलार', en: 'Kolar' }, pincode: '462042' },
  { code: 462102, subDistrictCode: 2010, name: 'Bairagarh', nameNative: { mr: 'बैरागढ', hi: 'बैरागढ़', en: 'Bairagarh' }, pincode: '462030' },

  // Ernakulam - Aluva (2810)
  { code: 683101, subDistrictCode: 2810, name: 'Aluva Town', nameNative: { mr: 'अलुवा शहर', hi: 'अलुवा', en: 'Aluva' }, pincode: '683101' },
  { code: 683102, subDistrictCode: 2810, name: 'Angamaly', nameNative: { mr: 'अंगामाली', hi: 'अंगमाली', en: 'Angamaly' }, pincode: '683572' },

  // Khordha - Jatni (1840)
  { code: 752101, subDistrictCode: 1840, name: 'Jatni Town (Khurda Road)', nameNative: { mr: 'जतनी', hi: 'जतनी', en: 'Jatni' }, pincode: '752050' },

  // Raipur - Abhanpur (1910)
  { code: 493101, subDistrictCode: 1910, name: 'Abhanpur Rural', nameNative: { mr: 'अभानपूर', hi: 'अभनपुर', en: 'Abhanpur' }, pincode: '493661' },

  // Dehradun - Rishikesh (260)
  { code: 249101, subDistrictCode: 260, name: 'Rishikesh Town', nameNative: { mr: 'ऋषिकेश', hi: 'ऋषिकेश', en: 'Rishikesh' }, pincode: '249201' },
  { code: 249102, subDistrictCode: 260, name: 'Raiwala', nameNative: { mr: 'रायवाला', hi: 'रायवाला', en: 'Raiwala' }, pincode: '249205' },

  // Shimla - Theog (95)
  { code: 171101, subDistrictCode: 95, name: 'Theog Town', nameNative: { mr: 'थिओग', hi: 'ठियोग', en: 'Theog' }, pincode: '171201' },

  // North Goa - Bardez (2750)
  { code: 403101, subDistrictCode: 2750, name: 'Mapusa', nameNative: { mr: 'म्हापसा', hi: 'मापुसा', en: 'Mapusa' }, pincode: '403507' },
  { code: 403102, subDistrictCode: 2750, name: 'Calangute', nameNative: { mr: 'कळंगूट', hi: 'कलंगूट', en: 'Calangute' }, pincode: '403516' },

  // Srinagar (50)
  { code: 190101, subDistrictCode: 50, name: 'Hazratbal', nameNative: { mr: 'हजरतबल', hi: 'हज़रतबल', en: 'Hazratbal' }, pincode: '190006' },

  // Leh (42)
  { code: 194101, subDistrictCode: 42, name: 'Choglamsar', nameNative: { mr: 'चोगलमसर', hi: 'चोगलमसर', en: 'Choglamsar' }, pincode: '194104' },

  // New Delhi (390)
  { code: 110101, subDistrictCode: 390, name: 'Sarojini Nagar', nameNative: { mr: 'सरोजिनी नगर', hi: 'सरोजिनी नगर', en: 'Sarojini Nagar' }, pincode: '110023' },

  // Chandigarh (210)
  { code: 160101, subDistrictCode: 210, name: 'Sector 17', nameNative: { mr: 'सेक्टर १७', hi: 'सेक्टर 17', en: 'Sector 17' }, pincode: '160017' },
  { code: 160102, subDistrictCode: 210, name: 'Mani Majra', nameNative: { mr: 'मणी माजरा', hi: 'मनी माजरा', en: 'Mani Majra' }, pincode: '160101' },

  // Puducherry (2980)
  { code: 605101, subDistrictCode: 2980, name: 'Ariyankuppam', nameNative: { mr: 'अरियांकुप्पम', hi: 'अरियानकुप्पम', en: 'Ariyankuppam' }, pincode: '605007' },

  // Port Blair (3010)
  { code: 744101, subDistrictCode: 3010, name: 'Garacharma', nameNative: { mr: 'गराचार्मा', hi: 'गराचार्मा', en: 'Garacharma' }, pincode: '744105' },
  { code: 744102, subDistrictCode: 3010, name: 'Bambooflat', nameNative: { mr: 'बांबूफ्लॅट', hi: 'बांबूफ्लैट', en: 'Bambooflat' }, pincode: '744107' }
];
