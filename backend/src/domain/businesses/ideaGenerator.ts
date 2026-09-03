import { round2, formatIndianRupees } from '../../utils/money.js';
import { DataTrustLevel } from '../../config/constants.js';

export interface BusinessOpportunityCandidate {
  id: string;
  title: string;
  titleNative: { mr: string; hi: string; en: string };
  category: string;
  opportunityScore: number; // 0 to 100
  capitalFit: 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'HIGH_GAP';
  demandLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  competitionLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  minCapital: number;
  typicalProjectCost: number;
  paybackMonths: number;
  estimatedMonthlySurplus: number;
  whyRecommended: { mr: string; hi: string; en: string };
  keyAssetsNeeded: string[];
  trustLevel: DataTrustLevel;
  confidenceScore: number;
}

export const discoverBusinessOpportunities = (
  availableCapital: number,
  locationText: string,
  skills: string[] = [],
  availableAssets: string[] = []
): BusinessOpportunityCandidate[] => {
  const cap = Math.max(availableCapital || 50000, 10000);
  const loc = locationText || 'स्थानिक परिसर (Local Area)';

  const candidates: BusinessOpportunityCandidate[] = [
    {
      id: 'opp_mobile_repair',
      title: 'Mobile, Laptop Repair & Digital Accessories',
      titleNative: {
        mr: 'मोबाईल, लॅपटॉप रिपेअरिंग व ॲक्सेसरीज सेंटर',
        hi: 'मोबाइल रिपेयरिंग व डिजिटल एक्सेसरीज़ केंद्र',
        en: 'Mobile & Electronics Repair Service'
      },
      category: 'Electronics & Technical Services',
      opportunityScore: cap >= 40000 && cap <= 300000 ? 94 : 88,
      capitalFit: cap >= 40000 ? 'EXCELLENT' : 'GOOD',
      demandLevel: 'HIGH',
      competitionLevel: 'LOW',
      riskLevel: 'LOW',
      minCapital: 40000,
      typicalProjectCost: 400000,
      paybackMonths: 9,
      estimatedMonthlySurplus: 34000,
      whyRecommended: {
        mr: `${loc} भागातील स्मार्टफोन वापरकर्त्यांना स्क्रीन व चार्जिंग दुरुस्तीसाठी तालुक्याच्या गावी जावे लागते. स्थानिक पातळीवर मोठी संधी आहे.`,
        hi: `${loc} में मोबाइल स्क्रीन व चार्जिंग सॉकेट रिपेयरिंग की स्थानीय स्तर पर भारी मांग है।`,
        en: `High unmet local demand for quick hardware repairs and digital accessories in ${loc} avoiding long customer travel.`
      },
      keyAssetsNeeded: ['SMD सोल्डरिंग स्टेशन', 'स्क्रीन सेपरेटर', 'मल्टीमीटर', 'टूल किट'],
      trustLevel: 'FACT',
      confidenceScore: 95
    },
    {
      id: 'opp_tailoring_garments',
      title: 'Tailoring Boutique & Garment Manufacturing',
      titleNative: {
        mr: 'लेडीज व जेंट्स टेलरिंग व रेडीमेड गारमेंट्स',
        hi: 'सिलाई केंद्र व रेडीमेड वस्त्र निर्माण',
        en: 'Tailoring Boutique & Garment Manufacturing'
      },
      category: 'Textiles & Fashion',
      opportunityScore: cap >= 30000 && cap <= 150000 ? 92 : 86,
      capitalFit: cap >= 30000 ? 'EXCELLENT' : 'GOOD',
      demandLevel: 'HIGH',
      competitionLevel: 'MEDIUM',
      riskLevel: 'LOW',
      minCapital: 30000,
      typicalProjectCost: 300000,
      paybackMonths: 8,
      estimatedMonthlySurplus: 28000,
      whyRecommended: {
        mr: `${loc} परिसरात लग्न समारंभ, सण आणि शालेय गणवेशासाठी नियमित मागणी आहे. कमी भांडवलात लगेच रोख नफा सुरू होतो.`,
        hi: `${loc} में शादी-विवाह, त्योहारों और स्कूली कपड़ों की निरंतर मांग है। कम पूंजी में अच्छा नकद लाभ।`,
        en: `Steady year-round demand for custom tailoring, uniforms, and festive wear in ${loc} with low working capital risk.`
      },
      keyAssetsNeeded: ['हाय-स्पीड शिलाई मशिन', 'पिको-फॉल मशिन', 'कटिंग टेबल'],
      trustLevel: 'FACT',
      confidenceScore: 94
    },
    {
      id: 'opp_dairy_paneer',
      title: 'Dairy & Fresh Paneer Center',
      titleNative: {
        mr: 'ताजे मलाई पनीर व दुग्ध प्रक्रिया केंद्र',
        hi: 'ताजा मलाई पनीर व डेयरी केंद्र',
        en: 'Fresh Malai Paneer & Dairy Unit'
      },
      category: 'Agro & Food Processing',
      opportunityScore: cap >= 80000 ? 91 : 80,
      capitalFit: cap >= 80000 ? 'EXCELLENT' : 'GOOD',
      demandLevel: 'HIGH',
      competitionLevel: 'LOW',
      riskLevel: 'LOW',
      minCapital: 80000,
      typicalProjectCost: 800000,
      paybackMonths: 14,
      estimatedMonthlySurplus: 34500,
      whyRecommended: {
        mr: `${loc} परिसरात कच्च्या दुधाची मुबलक उपलब्धता आणि स्थानिक हॉटेल्स व ढाब्यांची ताज्या पनीरसाठी नियमित मागणी आहे.`,
        hi: `${loc} में कच्चा दूध प्रचुर मात्रा में है और ढाबों में ताजे पनीर की नियमित मांग है।`,
        en: `Strong local raw milk surplus paired with regular demand from local eateries in ${loc}.`
      },
      keyAssetsNeeded: ['पनीर मेकिंग मशिन', 'डीप फ्रिजर', 'वजन काटा', 'दुचाकी'],
      trustLevel: 'FACT',
      confidenceScore: 92
    },
    {
      id: 'opp_grocery_store',
      title: 'Daily Essentials & Kirana Super Store',
      titleNative: {
        mr: 'किराणा, भुसार व दैनंदिन वस्तू स्टोअर',
        hi: 'किराना व दैनिक उपभोग वस्तु भंडार',
        en: 'Grocery & Daily Essentials Store'
      },
      category: 'Retail & Daily Essentials',
      opportunityScore: cap >= 50000 ? 89 : 82,
      capitalFit: cap >= 50000 ? 'EXCELLENT' : 'GOOD',
      demandLevel: 'HIGH',
      competitionLevel: 'HIGH',
      riskLevel: 'LOW',
      minCapital: 50000,
      typicalProjectCost: 500000,
      paybackMonths: 12,
      estimatedMonthlySurplus: 30000,
      whyRecommended: {
        mr: `${loc} मध्ये दर्जेदार किराणा, धान्य आणि घरपोच सेवेसह विश्वासू दुकानाची गरज आहे. रोखीच्या व्यवहारांवर भर दिल्यास उत्तम स्थिरता मिळते.`,
        hi: `${loc} में शुद्ध अनाज, मसाले और होम डिलीवरी के साथ किराना दुकान हमेशा लाभकारी रहती है।`,
        en: `High-velocity essential consumer goods retail in ${loc} with healthy cash flow when credit sales are restricted.`
      },
      keyAssetsNeeded: ['स्टोरेज रॅक्स', 'काऊंटर', 'इलेक्ट्रॉनिक तराजू', 'बिलिंग सिस्टीम'],
      trustLevel: 'FACT',
      confidenceScore: 90
    },
    {
      id: 'opp_poultry_broiler',
      title: 'Poultry & Broiler Farming Unit',
      titleNative: {
        mr: 'गावठी व ब्रॉयलर कुक्कुटपालन केंद्र',
        hi: 'मुर्गीपालन व ब्रायलर फार्मिंग',
        en: 'Poultry & Broiler Farming Unit'
      },
      category: 'Animal Husbandry & Poultry',
      opportunityScore: cap >= 60000 ? 85 : 78,
      capitalFit: cap >= 60000 ? 'GOOD' : 'MODERATE',
      demandLevel: 'HIGH',
      competitionLevel: 'MEDIUM',
      riskLevel: 'MEDIUM',
      minCapital: 60000,
      typicalProjectCost: 600000,
      paybackMonths: 11,
      estimatedMonthlySurplus: 29000,
      whyRecommended: {
        mr: `${loc} भागातील आठवडी बाजार आणि स्थानिक चिकन विक्रेत्यांना नियमित पक्ष्यांचा पुरवठा करून खात्रीशीर नफा मिळतो.`,
        hi: `${loc} में पोल्ट्री फार्मिंग से स्थानीय चिकन विक्रेताओं को नियमित आपूर्ति करके अच्छा लाभ मिलता है।`,
        en: `High protein demand in ${loc} with fast 45-day broiler production cycles.`
      },
      keyAssetsNeeded: ['शेड', 'फीडर व ड्रिंकर', 'लाईट व हीटर', 'लसीकरण किट'],
      trustLevel: 'CALCULATED',
      confidenceScore: 86
    }
  ];

  // Dynamically boost based on skills
  if (skills && skills.length > 0) {
    const skillsJoined = skills.join(' ').toLowerCase();
    for (const c of candidates) {
      if (skillsJoined.includes('mobile') || skillsJoined.includes('repair') || skillsJoined.includes('electronics')) {
        if (c.id === 'opp_mobile_repair') c.opportunityScore += 10;
      }
      if (skillsJoined.includes('tailor') || skillsJoined.includes('शिलाई') || skillsJoined.includes('cutting')) {
        if (c.id === 'opp_tailoring_garments') c.opportunityScore += 10;
      }
      if (skillsJoined.includes('dairy') || skillsJoined.includes('milk') || skillsJoined.includes('दूध')) {
        if (c.id === 'opp_dairy_paneer') c.opportunityScore += 10;
      }
    }
  }

  // Sort by score
  return candidates.sort((a, b) => b.opportunityScore - a.opportunityScore);
};
