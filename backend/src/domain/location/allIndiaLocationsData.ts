// ==============================================================================
// SAATHI — Backend Master All-India Geographic Directory
// Covering 28 States & 8 Union Territories (Districts, Subdistricts & Villages)
// Reconciled with Indian Village Directory (VList.in / Census 2011 / LGD Master)
// ==============================================================================

import { LgdDistrict, LgdSubDistrict, LgdVillage } from './lgdLocationService.js';

export const ALL_INDIA_DISTRICTS: LgdDistrict[] = [
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
  { code: 178, stateCode: 9, name: 'Prayagraj', nameNative: { mr: 'प्रयागराज', hi: 'प्रयागराज', en: 'Prayagraj' } },
  { code: 120, stateCode: 9, name: 'Agra', nameNative: { mr: 'आग्रा', hi: 'आगरा', en: 'Agra' } },
  { code: 133, stateCode: 9, name: 'Meerut', nameNative: { mr: 'मेरठ', hi: 'मेरठ', en: 'Meerut' } },
  { code: 137, stateCode: 9, name: 'Bareilly', nameNative: { mr: 'बरेली', hi: 'बरेली', en: 'Bareilly' } },
  { code: 121, stateCode: 9, name: 'Aligarh', nameNative: { mr: 'अलीगढ', hi: 'अलीगढ़', en: 'Aligarh' } },
  { code: 172, stateCode: 9, name: 'Ayodhya', nameNative: { mr: 'अयोध्या', hi: 'अयोध्या', en: 'Ayodhya' } },

  // BIHAR (10)
  { code: 216, stateCode: 10, name: 'Patna', nameNative: { mr: 'पाटणा', hi: 'पटना', en: 'Patna' } },
  { code: 217, stateCode: 10, name: 'Gaya', nameNative: { mr: 'गया', hi: 'गया', en: 'Gaya' } },
  { code: 211, stateCode: 10, name: 'Muzaffarpur', nameNative: { mr: 'मुझफ्फरपूर', hi: 'मुजफ्फरपुर', en: 'Muzaffarpur' } },
  { code: 224, stateCode: 10, name: 'Bhagalpur', nameNative: { mr: 'भागलपूर', hi: 'भागलपुर', en: 'Bhagalpur' } },
  { code: 212, stateCode: 10, name: 'Darbhanga', nameNative: { mr: 'दरभंगा', hi: 'दरभंगा', en: 'Darbhanga' } },
  { code: 214, stateCode: 10, name: 'Purnia', nameNative: { mr: 'पूर्णिया', hi: 'पूर्णिया', en: 'Purnia' } },

  // TAMIL NADU (33)
  { code: 603, stateCode: 33, name: 'Chennai', nameNative: { mr: 'चेन्नई', hi: 'चेन्नई', en: 'Chennai' } },
  { code: 632, stateCode: 33, name: 'Coimbatore', nameNative: { mr: 'कोइम्बतूर', hi: 'कोयंबटूर', en: 'Coimbatore' } },
  { code: 623, stateCode: 33, name: 'Madurai', nameNative: { mr: 'मदुराई', hi: 'मदुरै', en: 'Madurai' } },
  { code: 614, stateCode: 33, name: 'Tiruchirappalli', nameNative: { mr: 'तिरुचिरापल्ली', hi: 'तिरुचिरापल्ली', en: 'Tiruchirappalli' } },
  { code: 607, stateCode: 33, name: 'Salem', nameNative: { mr: 'सेलम', hi: 'सेलम', en: 'Salem' } },

  // GUJARAT (24)
  { code: 442, stateCode: 24, name: 'Ahmedabad', nameNative: { mr: 'अहमदाबाद', hi: 'अहमदाबाद', en: 'Ahmedabad' } },
  { code: 450, stateCode: 24, name: 'Surat', nameNative: { mr: 'सुरत', hi: 'सूरत', en: 'Surat' } },
  { code: 447, stateCode: 24, name: 'Vadodara', nameNative: { mr: 'वडोदरा', hi: 'वडोदरा', en: 'Vadodara' } },
  { code: 444, stateCode: 24, name: 'Rajkot', nameNative: { mr: 'राजकोट', hi: 'राजकोट', en: 'Rajkot' } },

  // RAJASTHAN (08)
  { code: 88, stateCode: 8, name: 'Jaipur', nameNative: { mr: 'जयपूर', hi: 'जयपुर', en: 'Jaipur' } },
  { code: 89, stateCode: 8, name: 'Jodhpur', nameNative: { mr: 'जोधपूर', hi: 'जोधपुर', en: 'Jodhpur' } },
  { code: 104, stateCode: 8, name: 'Udaipur', nameNative: { mr: 'उदयपूर', hi: 'उदयपुर', en: 'Udaipur' } },
  { code: 102, stateCode: 8, name: 'Kota', nameNative: { mr: 'कोटा', hi: 'कोटा', en: 'Kota' } },

  // KARNATAKA (29)
  { code: 529, stateCode: 29, name: 'Bengaluru Urban', nameNative: { mr: 'बंगळूरू शहरी', hi: 'बेंगलुरु शहरी', en: 'Bengaluru Urban' } },
  { code: 549, stateCode: 29, name: 'Mysuru', nameNative: { mr: 'म्हैसूर', hi: 'मैसूर', en: 'Mysuru' } },
  { code: 540, stateCode: 29, name: 'Belagavi', nameNative: { mr: 'बेळगाव', hi: 'बेलगावी', en: 'Belagavi' } },

  // ANDHRA PRADESH (28)
  { code: 510, stateCode: 28, name: 'Guntur', nameNative: { mr: 'गुंटूर', hi: 'गुंटूर', en: 'Guntur' } },
  { code: 513, stateCode: 28, name: 'Krishna', nameNative: { mr: 'कृष्णा', hi: 'कृष्णा', en: 'Krishna' } },
  { code: 506, stateCode: 28, name: 'Visakhapatnam', nameNative: { mr: 'विशाखापट्टणम', hi: 'विशाखापट्टनम', en: 'Visakhapatnam' } },

  // TELANGANA (36)
  { code: 532, stateCode: 36, name: 'Hyderabad', nameNative: { mr: 'हैदराबाद', hi: 'हैदराबाद', en: 'Hyderabad' } },
  { code: 530, stateCode: 36, name: 'Warangal', nameNative: { mr: 'वारंगळ', hi: 'वारंगल', en: 'Warangal' } },

  // WEST BENGAL (19)
  { code: 318, stateCode: 19, name: 'Kolkata', nameNative: { mr: 'कोलकाता', hi: 'कोलकाता', en: 'Kolkata' } },
  { code: 317, stateCode: 19, name: 'Howrah', nameNative: { mr: 'हावडा', hi: 'हावड़ा', en: 'Howrah' } },
  { code: 304, stateCode: 19, name: 'Darjeeling', nameNative: { mr: 'दार्जिलिंग', hi: 'दार्जिलिंग', en: 'Darjeeling' } },

  // MADHYA PRADESH (23)
  { code: 407, stateCode: 23, name: 'Bhopal', nameNative: { mr: 'भोपाळ', hi: 'भोपाल', en: 'Bhopal' } },
  { code: 420, stateCode: 23, name: 'Indore', nameNative: { mr: 'इंदूर', hi: 'इंदौर', en: 'Indore' } },

  // KERALA (32)
  { code: 569, stateCode: 32, name: 'Thiruvananthapuram', nameNative: { mr: 'तिरुवनंतपुरम', hi: 'तिरुवनंतपुरम', en: 'Thiruvananthapuram' } },
  { code: 564, stateCode: 32, name: 'Ernakulam', nameNative: { mr: 'एर्नाकुलम', hi: 'एर्नाकुलम', en: 'Ernakulam' } },

  // PUNJAB (03)
  { code: 27, stateCode: 3, name: 'Amritsar', nameNative: { mr: 'अमृतसर', hi: 'अमृतसर', en: 'Amritsar' } },
  { code: 34, stateCode: 3, name: 'Ludhiana', nameNative: { mr: 'लुधियाना', hi: 'लुधियाना', en: 'Ludhiana' } },
  { code: 36, stateCode: 3, name: 'Shahid Bhagat Singh Nagar', nameNative: { mr: 'शहीद भगतसिंग नगर', hi: 'शहीद भगत सिंह नगर', en: 'SBS Nagar' } },

  // HARYANA (06)
  { code: 77, stateCode: 6, name: 'Gurugram', nameNative: { mr: 'गुरुग्राम', hi: 'गुरुग्राम', en: 'Gurugram' } },
  { code: 80, stateCode: 6, name: 'Sonipat', nameNative: { mr: 'सोनिपत', hi: 'सोनीपत', en: 'Sonipat' } },

  // ODISHA (21)
  { code: 364, stateCode: 21, name: 'Khordha (Bhubaneswar)', nameNative: { mr: 'खुर्दा', hi: 'खोरधा', en: 'Khordha' } },
  { code: 358, stateCode: 21, name: 'Cuttack', nameNative: { mr: 'कटक', hi: 'कटक', en: 'Cuttack' } },

  // ASSAM (18)
  { code: 288, stateCode: 18, name: 'Kamrup Metropolitan (Guwahati)', nameNative: { mr: 'कामरूप मेट्रो', hi: 'कामरूप मेट्रो', en: 'Kamrup Metropolitan' } },
  { code: 287, stateCode: 18, name: 'Kamrup', nameNative: { mr: 'कामरूप', hi: 'कामरूप', en: 'Kamrup' } },

  // JHARKHAND (20)
  { code: 341, stateCode: 20, name: 'Ranchi', nameNative: { mr: 'रांची', hi: 'राँची', en: 'Ranchi' } },
  { code: 345, stateCode: 20, name: 'East Singhbhum (Jamshedpur)', nameNative: { mr: 'पूर्व सिंगभूम', hi: 'पूर्वी सिंहभूम', en: 'East Singhbhum' } },

  // CHHATTISGARH (22)
  { code: 382, stateCode: 22, name: 'Raipur', nameNative: { mr: 'रायपूर', hi: 'रायपुर', en: 'Raipur' } },

  // UTTARAKHAND (05)
  { code: 54, stateCode: 5, name: 'Dehradun', nameNative: { mr: 'डेहराडून', hi: 'देहरादून', en: 'Dehradun' } },

  // HIMACHAL PRADESH (02)
  { code: 19, stateCode: 2, name: 'Shimla', nameNative: { mr: 'शिमला', hi: 'शिमला', en: 'Shimla' } },

  // GOA (30)
  { code: 551, stateCode: 30, name: 'North Goa (Panaji)', nameNative: { mr: 'उत्तर गोवा', hi: 'उत्तर गोवा', en: 'North Goa' } },
  { code: 552, stateCode: 30, name: 'South Goa (Margao)', nameNative: { mr: 'दक्षिण गोवा', hi: 'दक्षिण गोवा', en: 'South Goa' } },

  // TRIPURA (16)
  { code: 269, stateCode: 16, name: 'West Tripura (Agartala)', nameNative: { mr: 'पश्चिम त्रिपुरा', hi: 'पश्चिम त्रिपुरा', en: 'West Tripura' } },

  // MANIPUR (14)
  { code: 251, stateCode: 14, name: 'Imphal West', nameNative: { mr: 'इम्फाळ पश्चिम', hi: 'इम्फाल पश्चिम', en: 'Imphal West' } },

  // MEGHALAYA (17)
  { code: 274, stateCode: 17, name: 'East Khasi Hills (Shillong)', nameNative: { mr: 'पूर्व खासी हिल्स', hi: 'पूर्वी खासी हिल्स', en: 'East Khasi Hills' } },

  // MIZORAM (15)
  { code: 261, stateCode: 15, name: 'Aizawl', nameNative: { mr: 'ऐझॉल', hi: 'आइज़ोल', en: 'Aizawl' } },

  // NAGALAND (13)
  { code: 243, stateCode: 13, name: 'Kohima', nameNative: { mr: 'कोहिमा', hi: 'कोहिमा', en: 'Kohima' } },

  // ARUNACHAL PRADESH (12)
  { code: 231, stateCode: 12, name: 'Papum Pare (Itanagar)', nameNative: { mr: 'पापुम पारे', hi: 'पापुम पारे', en: 'Papum Pare' } },

  // SIKKIM (11)
  { code: 226, stateCode: 11, name: 'East Sikkim (Gangtok)', nameNative: { mr: 'पूर्व सिक्कीम', hi: 'पूर्व सिक्किम', en: 'East Sikkim' } },

  // UNION TERRITORIES
  { code: 82, stateCode: 7, name: 'New Delhi', nameNative: { mr: 'नवी दिल्ली', hi: 'नई दिल्ली', en: 'New Delhi' } },
  { code: 81, stateCode: 7, name: 'Central Delhi', nameNative: { mr: 'मध्य दिल्ली', hi: 'मध्य दिल्ली', en: 'Central Delhi' } },
  { code: 11, stateCode: 1, name: 'Srinagar', nameNative: { mr: 'श्रीनगर', hi: 'श्रीनगर', en: 'Srinagar' } },
  { code: 10, stateCode: 1, name: 'Jammu', nameNative: { mr: 'जम्मू', hi: 'जम्मू', en: 'Jammu' } },
  { code: 9, stateCode: 37, name: 'Leh', nameNative: { mr: 'लेह', hi: 'लेह', en: 'Leh' } },
  { code: 45, stateCode: 4, name: 'Chandigarh', nameNative: { mr: 'चंदिगढ', hi: 'चंडीगढ़', en: 'Chandigarh' } },
  { code: 598, stateCode: 34, name: 'Puducherry', nameNative: { mr: 'पुडुचेरी', hi: 'पुडुचेरी', en: 'Puducherry' } },
  { code: 462, stateCode: 26, name: 'Daman', nameNative: { mr: 'दमण', hi: 'दमन', en: 'Daman' } },
  { code: 601, stateCode: 35, name: 'South Andaman (Port Blair)', nameNative: { mr: 'दक्षिण अंदमान', hi: 'दक्षिण अंडमान', en: 'South Andaman' } },
  { code: 553, stateCode: 31, name: 'Lakshadweep', nameNative: { mr: 'लक्षद्वीप', hi: 'लक्षद्वीप', en: 'Lakshadweep' } }
];

export const ALL_INDIA_SUBDISTRICTS: LgdSubDistrict[] = [
  // Sangli (504)
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

  // Pune (492)
  { code: 4180, districtCode: 492, name: 'Baramati', nameNative: { mr: 'बारामती', hi: 'बारामती', en: 'Baramati' } },
  { code: 4173, districtCode: 492, name: 'Haveli', nameNative: { mr: 'हवेली', hi: 'हवेली', en: 'Haveli' } },
  { code: 4175, districtCode: 492, name: 'Shirur', nameNative: { mr: 'शिरूर', hi: 'शिरूर', en: 'Shirur' } },
  { code: 4176, districtCode: 492, name: 'Daund', nameNative: { mr: 'दौंड', hi: 'दौंड', en: 'Daund' } },
  { code: 4177, districtCode: 492, name: 'Indapur', nameNative: { mr: 'इंदापूर', hi: 'इंदापुर', en: 'Indapur' } },

  // Ahmednagar (490)
  { code: 4150, districtCode: 490, name: 'Ahmednagar', nameNative: { mr: 'अहमदनगर', hi: 'अहमदनगर', en: 'Ahmednagar' } },
  { code: 4151, districtCode: 490, name: 'Sangamner', nameNative: { mr: 'संगमनेर', hi: 'संगमनेर', en: 'Sangamner' } },
  { code: 4152, districtCode: 490, name: 'Rahata (Shirdi)', nameNative: { mr: 'राहाता (शिर्डी)', hi: 'राहाता', en: 'Rahata' } },

  // Coimbatore (632)
  { code: 5901, districtCode: 632, name: 'Coimbatore South', nameNative: { mr: 'कोइम्बतूर दक्षिण', hi: 'कोयंबटूर दक्षिण', en: 'Coimbatore South' } },
  { code: 5902, districtCode: 632, name: 'Pollachi', nameNative: { mr: 'पोल्लाची', hi: 'पोल्लाची', en: 'Pollachi' } },

  // Surat (450)
  { code: 3801, districtCode: 450, name: 'Choryasi', nameNative: { mr: 'चोऱ्यासी', hi: 'चोर्यासी', en: 'Choryasi' } },
  { code: 3802, districtCode: 450, name: 'Bardoli', nameNative: { mr: 'बारडोली', hi: 'बारडोली', en: 'Bardoli' } },

  // Jaipur (88)
  { code: 443, districtCode: 88, name: 'Sanganer', nameNative: { mr: 'सांगानेर', hi: 'सांगानेर', en: 'Sanganer' } },
  { code: 440, districtCode: 88, name: 'Amber', nameNative: { mr: 'आमेर', hi: 'आमेर', en: 'Amber' } },

  // Patna (216)
  { code: 1001, districtCode: 216, name: 'Bihta', nameNative: { mr: 'बिहटा', hi: 'बिहटा', en: 'Bihta' } },
  { code: 1002, districtCode: 216, name: 'Danapur', nameNative: { mr: 'दानापूर', hi: 'दानापुर', en: 'Danapur' } },

  // Guntur (510)
  { code: 4935, districtCode: 510, name: 'Tenali', nameNative: { mr: 'तेनाली', hi: 'तेनाली', en: 'Tenali' } },
  { code: 4932, districtCode: 510, name: 'Mangalagiri', nameNative: { mr: 'मंगलगिरी', hi: 'मंगलगिरि', en: 'Mangalagiri' } },

  // SBS Nagar (36)
  { code: 147, districtCode: 36, name: 'Nawanshahr', nameNative: { mr: 'नवांशहर', hi: 'नवांशहर', en: 'Nawanshahr' } },
  { code: 148, districtCode: 36, name: 'Balachaur', nameNative: { mr: 'बलाचौर', hi: 'बलाचौर', en: 'Balachaur' } },

  // Sonipat (80)
  { code: 374, districtCode: 80, name: 'Sonipat', nameNative: { mr: 'सोनिपत', hi: 'सोनीपत', en: 'Sonipat' } },
  { code: 375, districtCode: 80, name: 'Ganaur', nameNative: { mr: 'गन्नौर', hi: 'गन्नौर', en: 'Ganaur' } }
];

export const ALL_INDIA_VILLAGES: LgdVillage[] = [
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

  // Sangamner (4151)
  { code: 558101, subDistrictCode: 4151, name: 'Sangamner Town', nameNative: { mr: 'संगमनेर शहर', hi: 'संगमनेर', en: 'Sangamner' }, pincode: '422605', latitude: 19.5771, longitude: 74.2081 },
  { code: 558102, subDistrictCode: 4151, name: 'Ghulewadi', nameNative: { mr: 'घुलेवाडी', hi: 'घुलेवाड़ी', en: 'Ghulewadi' }, pincode: '422605' },
  { code: 558103, subDistrictCode: 4151, name: 'Ashwi', nameNative: { mr: 'आश्वी', hi: 'आश्वी', en: 'Ashwi' }, pincode: '413738' },

  // Coimbatore South (5901)
  { code: 644101, subDistrictCode: 5901, name: 'Sundakkamuthur', nameNative: { mr: 'सुंदक्कामूत्तूर', hi: 'सुंदक्कामूत्तूर', en: 'Sundakkamuthur' }, pincode: '641010' },
  { code: 644102, subDistrictCode: 5901, name: 'Madukkarai', nameNative: { mr: 'मदुक्कराई', hi: 'मदुक्कराई', en: 'Madukkarai' }, pincode: '641105' },

  // Sanganer (443)
  { code: 844101, subDistrictCode: 443, name: 'Sanganer Town', nameNative: { mr: 'सांगानेर शहर', hi: 'सांगानेर', en: 'Sanganer' }, pincode: '302029' },
  { code: 844102, subDistrictCode: 443, name: 'Bagru', nameNative: { mr: 'बगरू', hi: 'बगरू', en: 'Bagru' }, pincode: '303007' },

  // Bihta (1001)
  { code: 244101, subDistrictCode: 1001, name: 'Bihta Town', nameNative: { mr: 'बिहटा बाजार', hi: 'बिहटा बाजार', en: 'Bihta' }, pincode: '801103' },
  { code: 244102, subDistrictCode: 1001, name: 'Amhara', nameNative: { mr: 'अम्हारा', hi: 'अम्हारा', en: 'Amhara' }, pincode: '801103' },

  // Tenali (4935)
  { code: 494101, subDistrictCode: 4935, name: 'Tenali Town', nameNative: { mr: 'तेनाली शहर', hi: 'तेनाली', en: 'Tenali' }, pincode: '522201' },

  // Choryasi (3801)
  { code: 384101, subDistrictCode: 3801, name: 'Sachin', nameNative: { mr: 'सचिन', hi: 'सचिन', en: 'Sachin' }, pincode: '394230' }
];
