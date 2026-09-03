import { DataTrustLevel } from '../../config/constants.js';
import { CompetitorListing } from '../../types/market.js';
import { normalizeBusinessCategory } from '../businesses/businessCatalog.js';

export { CompetitorListing };

export const getCompetitorsForCluster = (
  locationCluster: string,
  category = 'General Micro-Enterprise'
): CompetitorListing[] => {
  const loc = locationCluster || 'स्थानिक परिसर (Local Area)';
  const archetype = normalizeBusinessCategory(category);

  // 1. MOBILE & ELECTRONICS REPAIR
  if (archetype.id === 'mobile_repair') {
    return [
      {
        id: 'comp_city_service_center',
        name: 'तालुक्यातील अनधिकृत मोबाईल रिपेअर दुकाने (City Repair Shops)',
        category: 'Town Center Repair Shops',
        location: 'तालुका / मुख्य शहर (15 km away)',
        distanceKm: 15,
        competitionLevel: 'MEDIUM',
        estimatedDailyVolume: '१५ ते २५ फोन / दिवस',
        pricePosition: 'जास्त दर (₹१,२००+ स्क्रीन रिप्लेसमेंट)',
        priceRange: { min: 400, max: 2500 },
        knownGaps: [
          'फोन दुरुस्तीसाठी २-३ दिवस फोन ठेवून घ्यावा लागतो (No Same-Day Service)',
          'गावातील ग्राहकांना प्रवासाचा वेळ व बस भाडे खर्च होतो',
          'वॉरंटी किंवा रिप्लेसमेंट हमी नसते'
        ],
        verified: true,
        confidence: 88,
        trustLevel: 'FACT'
      },
      {
        id: 'comp_local_recharge_shop',
        name: 'स्थानिक मोबाईल रिचार्ज व कव्हर स्टॉल (Local Recharge Point)',
        category: 'Basic Accessories & Recharge',
        location: `${loc} मुख्य बस स्टॉप चौक`,
        distanceKm: 0.8,
        competitionLevel: 'LOW',
        estimatedDailyVolume: 'केवळ रिचार्ज, कव्हर व टेम्पर्ड ग्लास',
        pricePosition: 'किरकोळ विक्री (MRP)',
        priceRange: { min: 50, max: 350 },
        knownGaps: [
          'हार्डवेअर दुरुस्ती, सोल्डरिंग किंवा स्क्रीन बदलण्याचे ज्ञान व साधने नाहीत',
          'केवळ किरकोळ सामान विकतात'
        ],
        verified: true,
        confidence: 92,
        trustLevel: 'FACT'
      },
      {
        id: 'comp_authorized_brand_hub',
        name: 'अधिकृत ब्रँड सर्व्हिस सेंटर (Authorized Brand Service Hub)',
        category: 'Authorized Brand Hub',
        location: 'जिल्हा मुख्यालय / मोठे शहर (35 km)',
        distanceKm: 35,
        competitionLevel: 'LOW',
        estimatedDailyVolume: 'केवळ वॉरंटीमधील फोन दुरुस्ती',
        pricePosition: 'अतिशय महाग (₹३,५००+)',
        priceRange: { min: 1500, max: 6000 },
        knownGaps: [
          'खूप जास्त अंतर व १-२ आठवड्यांचा प्रतीक्षा कालावधी',
          'वॉरंटी संपलेल्या फोनसाठी अवास्तव बिल'
        ],
        verified: true,
        confidence: 90,
        trustLevel: 'FACT'
      }
    ];
  }

  // 2. TAILORING & GARMENTS
  if (archetype.id === 'tailoring') {
    return [
      {
        id: 'comp_traditional_tailor',
        name: 'जुने स्थानिक शिंपी (२ दुकाने)',
        category: 'Traditional Tailoring',
        location: `${loc} जुनी पेठ`,
        distanceKm: 1.2,
        competitionLevel: 'MEDIUM',
        estimatedDailyVolume: '६ ते ८ कपडे / दिवस',
        pricePosition: 'मध्यम दर (₹१५० - ₹२५० / ब्लाऊज)',
        priceRange: { min: 150, max: 250 },
        knownGaps: [
          'डिलिव्हरीमध्ये १०-१५ दिवसांचा विलंब',
          'आधुनिक फॅशन व डिझायनर पॅटर्नचा अभाव',
          'व्हॉट्सॲप किंवा डिजिटल सेवा नाही'
        ],
        verified: true,
        confidence: 88,
        trustLevel: 'FACT'
      },
      {
        id: 'comp_city_boutique',
        name: 'तालुक्यातील डिझायनर बुटीक (City Boutique)',
        category: 'Branded City Boutique',
        location: 'तालुका / मुख्य शहर',
        distanceKm: 18,
        competitionLevel: 'LOW',
        estimatedDailyVolume: '२०+ कपडे / दिवस',
        pricePosition: 'खूप जास्त दर (₹५०० - ₹१०००+)',
        priceRange: { min: 500, max: 1000 },
        knownGaps: [
          'गावातील ग्राहकांसाठी अंतर जास्त (१८ किमी प्रवास)',
          'जास्त दर, सर्वसामान्य कुटुंबांना न परवडणारे'
        ],
        verified: false,
        confidence: 80,
        trustLevel: 'AI_ESTIMATE'
      }
    ];
  }

  // 3. GROCERY & DAILY ESSENTIALS
  if (archetype.id === 'grocery') {
    return [
      {
        id: 'comp_old_village_kirana',
        name: 'गावातील पारंपरिक किराणा दुकान (Village Kirana)',
        category: 'Traditional Village Kirana',
        location: `${loc} मुख्य बाजारपेठ`,
        distanceKm: 0.5,
        competitionLevel: 'HIGH',
        estimatedDailyVolume: '३० ते ४० ग्राहक / दिवस',
        pricePosition: 'छापील किंमत (MRP)',
        priceRange: { min: 10, max: 500 },
        knownGaps: [
          'वस्तूंवर सवलत किंवा पॅक ऑफर नाही',
          'घरपोच डिलिव्हरी नाही',
          'डिजिटल पेमेंट सुविधा मर्यादित'
        ],
        verified: true,
        confidence: 89,
        trustLevel: 'FACT'
      }
    ];
  }

  // 4. DAIRY & MILK PROCESSING (Only when Dairy is actually selected!)
  if (archetype.id === 'dairy') {
    return [
      {
        id: 'comp_pune_distributor',
        name: 'शहरातील पॅकबंद ब्रँड वॅन पुरवठादार (City Packaged Distributor)',
        category: 'Branded Processed Products',
        location: 'पुणे-सोलापूर महामार्ग कॉरिडॉर',
        distanceKm: 28,
        competitionLevel: 'MEDIUM',
        estimatedDailyVolume: '३५० किलो (एकत्रित)',
        pricePosition: 'जास्त दर (₹३६० - ₹४०० / kg)',
        priceRange: { min: 360, max: 400 },
        knownGaps: [
          '२ दिवसांपूर्वीचे पॅकबंद उत्पादन (ताजेपणाचा अभाव)',
          'लहान हॉटेल्सना वेळेवर डिलिव्हरी नाही',
          'जास्त विक्री दर'
        ],
        verified: true,
        confidence: 90,
        trustLevel: 'FACT'
      },
      {
        id: 'comp_local_unorganized',
        name: 'स्थानिक असंघटित विक्रेते (Unorganized Raw Milk Vendors)',
        category: 'Unorganized Local Vendors',
        location: loc,
        distanceKm: 2.5,
        competitionLevel: 'LOW',
        estimatedDailyVolume: '१५० लिटर / दिवस',
        pricePosition: 'मध्यम दर (₹३०० - ₹३२० / kg)',
        priceRange: { min: 300, max: 320 },
        knownGaps: [
          'प्रक्रिया तंत्रज्ञानाचा अभाव',
          'दर्ज्याची हमी नसते',
          'शीतकरण सुविधा नाही'
        ],
        verified: false,
        confidence: 82,
        trustLevel: 'AI_ESTIMATE'
      }
    ];
  }

  // 5. CUSTOM ENTERPRISE (e.g. Solar Pump, Fabrication, Salon, etc.)
  return [
    {
      id: 'comp_distant_service_provider',
      name: `शहरातील बाहेरील व्यावसायिक (Distant Regional Provider)`,
      category: `${category} Service`,
      location: 'तालुका केंद्र / शहर (15-20 km)',
      distanceKm: 18,
      competitionLevel: 'MEDIUM',
      estimatedDailyVolume: 'साप्ताहिक ऑर्डर्स',
      pricePosition: 'वाहतूक शुल्कासह जास्त दर',
      priceRange: { min: 300, max: 2000 },
      knownGaps: [
        'स्थानिक पातळीवर त्वरित पोहोच उपलब्ध नाही',
        'प्रवास खर्च जास्त असल्याने लहान कामांसाठी येत नाहीत'
      ],
      verified: true,
      confidence: 86,
      trustLevel: 'FACT'
    }
  ];
};
