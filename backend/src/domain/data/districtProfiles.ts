import { DataProvenance, createProvenance } from './dataProvenance.js';

export interface PotentialMsmeIdea {
  id: string;
  name: string;
  nameNative: { mr: string; hi: string; en: string };
  category: string;
  typicalInvestmentInr: number;
  minCapitalRequiredInr: number;
  valueAdditionPotential: 'VERY_HIGH' | 'HIGH' | 'MEDIUM';
  demandSignal: 'HIGH' | 'MEDIUM' | 'LOW';
  supplyGap: 'HIGH' | 'MEDIUM' | 'LOW';
  resourceRequirement: string;
  rationale: { mr: string; hi: string; en: string };
  keyAssetsNeeded: string[];
  mainRisks: { mr: string; hi: string; en: string };
  first3Actions: { mr: string[]; hi: string[]; en: string[] };
}

export interface DistrictIndustrialProfile {
  districtLgdCode: number;
  districtName: string;
  stateLgdCode: number;
  stateName: string;
  provenance: DataProvenance;
  majorResources: {
    agriculture: string[];
    livestock: string[];
    minerals: string[];
    forest: string[];
  };
  existingClusters: string[];
  artisanClusters: string[];
  serviceOpportunities: string[];
  potentialNewMsmes: PotentialMsmeIdea[];
  exportableProducts: string[];
  prominentSkills: string[];
}

export const DISTRICT_INDUSTRIAL_PROFILES: Record<number, DistrictIndustrialProfile> = {
  // 1. Sangli (Maharashtra, LGD: 504)
  504: {
    districtLgdCode: 504,
    districtName: 'Sangli',
    stateLgdCode: 27,
    stateName: 'Maharashtra',
    provenance: createProvenance(
      'DC-MSME Brief Industrial Profile of Sangli District',
      'https://www.dcmsme.gov.in/dips/DIPR_Sangli.pdf',
      'DISTRICT',
      '2024-25',
      'HIGH',
      'Covers formal MSME registries, DIC survey, and APMC trade returns.'
    ),
    majorResources: {
      agriculture: ['Grapes', 'Turmeric', 'Sugarcane', 'Soyabean', 'Pomegranate'],
      livestock: ['Crossbred Cows', 'Murrah Buffaloes', 'Goats'],
      minerals: ['Basalt Building Stone', 'Kankar'],
      forest: ['Teak', 'Neem', 'Agave (Ghaypat)']
    },
    existingClusters: ['Turmeric Processing Cluster', 'Raisin Processing Cluster', 'Foundry & Light Engineering', 'Textile Powerloom'],
    artisanClusters: ['Kolhapuri Chappals (Miraj/Madhavnagar)', 'Silver Ornaments (Hupari border)', 'Musical Instruments (Miraj Sitar/Tanpura)'],
    serviceOpportunities: [
      'Drip irrigation & automated filter servicing',
      'Agro-cold storage container transport',
      'Solar agricultural pump maintenance',
      'Custom hiring of grape pruning & harvesting tools'
    ],
    potentialNewMsmes: [
      {
        id: 'opp_turmeric_grading_packaging',
        name: 'Turmeric Cleaning, Polishing & Consumer Packaging',
        nameNative: {
          mr: 'हळद स्वच्छता, पॉलिशिंग व ब्रँडेड पॅकेजिंग युनिट',
          hi: 'हल्दी ग्रेडिंग, पॉलिशिंग व उपभोक्ता पैकेजिंग इकाई',
          en: 'Turmeric Cleaning, Polishing & Branded Packaging'
        },
        category: 'Food Processing & Spices',
        typicalInvestmentInr: 350000,
        minCapitalRequiredInr: 45000,
        valueAdditionPotential: 'VERY_HIGH',
        demandSignal: 'HIGH',
        supplyGap: 'HIGH',
        resourceRequirement: 'Raw turmeric fingers readily available in Sangli APMC and farm gate.',
        rationale: {
          mr: 'सांगली ही हळदीची देशातील प्रमुख बाजारपेठ आहे. कच्ची हळद थेट विकण्याऐवजी पॉलिशिंग व ५०० ग्रॅम पॅकिंग केल्यास ३५% अधिक नफा मिळतो.',
          hi: 'सांगली भारत की प्रमुख हल्दी मंडी है। कच्ची हल्दी को सीधे बेचने के बजाय ग्रेडिंग और पैकेजिंग से 35% अधिक मूल्य मिलता है।',
          en: 'Sangli is India’s turmeric hub. Raw turmeric polished, ground, or packaged into retail pouches captures a 35% value-addition margin.'
        },
        keyAssetsNeeded: ['पॉलिशिंग ड्रम', 'पल्व्हरायझर', 'वजन काटा', 'नायट्रोजन फ्लश पॅकिंग मशिन'],
        mainRisks: {
          mr: 'हळदीच्या भावातील हंगामी चढ-उतार आणि ओलाव्यामुळे बुरशी लागण्याची भीती.',
          hi: 'हल्दी के मौसमी मूल्य उतार-चढ़ाव और नमी से फंगस लगने का जोखिम।',
          en: 'Seasonal procurement price volatility and moisture-induced fungal spoilage risk.'
        },
        first3Actions: {
          mr: [
            'स्थानिक शेतकऱ्यांशी थेट हळद खरेदीचा करार करणे',
            'FSSAI अन्न सुरक्षा नोंदणी मिळवणे',
            'स्थानिक किराणा दुकाने व आठवडी बाजारांत सॅम्पल देणे'
          ],
          hi: [
            'स्थानीय किसानों से सीधे हल्दी खरीद संपर्क बनाना',
            'FSSAI पंजीकरण प्राप्त करना',
            'किराना दुकानों और मेलों में नमूने वितरित करना'
          ],
          en: [
            'Tie up with local farmers for direct farmgate procurement',
            'Obtain FSSAI basic food license',
            'Distribute sample pouches to local retail stores and haats'
          ]
        }
      },
      {
        id: 'opp_raisin_sorting_grading',
        name: 'Grape Raisin (Bedana) Sorting, Grading & Consumer Pack',
        nameNative: {
          mr: 'बेदाणा प्रतवारी, ग्रेडिंग व व्हॅक्यूम पॅकिंग युनिट',
          hi: 'किशमिश (बेदाना) ग्रेडिंग व वैक्यूम पैकेजिंग केंद्र',
          en: 'Raisin (Bedana) Sorting, Grading & Vacuum Packaging'
        },
        category: 'Agro Value-Addition',
        typicalInvestmentInr: 450000,
        minCapitalRequiredInr: 60000,
        valueAdditionPotential: 'VERY_HIGH',
        demandSignal: 'HIGH',
        supplyGap: 'HIGH',
        resourceRequirement: 'Abundant golden and black raisins produced across Tasgaon, Palus, and Miraj talukas.',
        rationale: {
          mr: 'पलूस आणि तासगाव भागात दर्जेदार बेदाणा तयार होतो. प्रतवारी करून आकर्षक पाऊच पॅकिंग केल्यास थेट ग्राहकांना व शहरांत प्रीमियम भावाने विक्री शक्य.',
          hi: 'पलूस और तासगांव क्षेत्र में उत्तम गुणवत्ता का बेदाना होता है। ग्रेडिंग और सीलबंद पैकेजिंग से शहरों में प्रीमियम दर मिलती है।',
          en: 'Tasgaon and Palus produce world-class raisins. Sorting by color/size and vacuum packing yields premium retail returns.'
        },
        keyAssetsNeeded: ['व्हायब्रेटरी सॉर्टिंग स्क्रीन', 'व्हॅक्यूम पॅकर', 'अन्न-दर्जा क्रेट्स'],
        mainRisks: {
          mr: 'शीतगृहातील जागेची उपलब्धता आणि उन्हाळ्यात रंग बदलण्याचा धोका.',
          hi: 'कोल्ड स्टोरेज की उपलब्धता और अधिक गर्मी में रंग काला पड़ने का जोखिम।',
          en: 'Cold storage dependency and color darkening during peak summer.'
        },
        first3Actions: {
          mr: [
            'तासगाव/पलूस येथील बेदाणा उत्पादकांशी चर्चा करणे',
            'लहान व्हॅक्यूम पॅकिंग मशिनची खरेदी व चाचणी',
            'शहरी ग्राहकांसाठी व्हॉट्सॲप व थेट वितरण साखळी उभारणे'
          ],
          hi: [
            'स्थानीय बेदाना उत्पादक किसानों से सीधा संपर्क',
            'वैक्यूम पैकेजिंग मशीन की खरीद',
            'शहरी बाजारों में सीधे आपूर्ति का नेटवर्क बनाना'
          ],
          en: [
            'Survey grape drying sheds across Palus and Tasgaon',
            'Procure small-scale food-grade vacuum sealer',
            'Setup WhatsApp direct customer subscription group in nearby cities'
          ]
        }
      },
      {
        id: 'opp_cane_jaggery_granules',
        name: 'Organic Jaggery Powder & Granules Processing',
        nameNative: {
          mr: 'सेंद्रिय गूळ पावडर व क्यूब निर्मिती उद्योग',
          hi: 'जैविक गुड़ पाउडर व क्यूब निर्माण इकाई',
          en: 'Organic Jaggery Powder & Cubes Processing'
        },
        category: 'Agro & Food Processing',
        typicalInvestmentInr: 600000,
        minCapitalRequiredInr: 80000,
        valueAdditionPotential: 'HIGH',
        demandSignal: 'HIGH',
        supplyGap: 'MEDIUM',
        resourceRequirement: 'High sucrose sugarcane along Krishna river basin.',
        rationale: {
          mr: 'कृष्णा नदीकाठच्या उसाला गोडवा चांगला असतो. साध्या गुळापेक्षा रासायनिक खते विरहीत गूळ पावडरला चहा व आरोग्यासाठी प्रचंड मागणी आहे.',
          hi: 'कृष्णा नदी क्षेत्र के गन्ने से तैयार केमिकल-मुक्त गुड़ पाउडर की चाय दुकानों और स्वास्थ्य-जागरूक परिवारों में भारी मांग है।',
          en: 'Chemical-free jaggery powder has strong urban and semi-urban health demand replacing white refined sugar.'
        },
        keyAssetsNeeded: ['स्टेनलेस स्टील कढई', 'गूळ ग्रॅन्युलेटर', 'मॉइश्चर ड्रायर', 'सिलिंग मशिन'],
        mainRisks: {
          mr: 'पावसाळ्यात गूळ पावडर ओल धरून घट्ट होणे.',
          hi: 'बरसात में नमी से पाउडर के जमने का जोखिम।',
          en: 'Moisture ingress causing caking during monsoon months.'
        },
        first3Actions: {
          mr: [
            'स्थानिक गूळ गुऱ्हाळाशी भागीदारी किंवा प्रक्रिया करार',
            'मॉइश्चर-प्रूफ स्टँडींग पाऊच डिझाईन करणे',
            'स्थानिक आयुर्वेदिक दुकाने व चहाच्या ब्रँड्सना सॅम्पल देणे'
          ],
          hi: [
            'स्थानीय गुड़ कोल्हू से शुद्ध कच्चे माल का अनुबंध',
            'नमी-रोधी पाउच पैकेजिंग तैयार करना',
            'आयुर्वेदिक दुकानों व चाय केंद्रों को आपूर्ति'
          ],
          en: [
            'Partner with certified clean gurhal for raw boiling',
            'Order aluminum moisture-barrier stand-up pouches',
            'Supply trial packs to local tea franchise outlets and herbal stores'
          ]
        }
      }
    ],
    exportableProducts: ['Sangli Turmeric (GI)', 'Golden Raisins', 'Table Grapes', 'Cast Iron Parts'],
    prominentSkills: ['Turmeric trading & curing', 'Grape pruning & cold preservation', 'Machine tool operation', 'Leather tanning']
  },

  // 2. Nashik (Maharashtra, LGD: 479)
  479: {
    districtLgdCode: 479,
    districtName: 'Nashik',
    stateLgdCode: 27,
    stateName: 'Maharashtra',
    provenance: createProvenance(
      'DC-MSME Brief Industrial Profile of Nashik District',
      'https://www.dcmsme.gov.in/dips/DIPR_Nashik.pdf',
      'DISTRICT',
      '2024-25',
      'HIGH',
      'Covers MIDC Ambad, Satpur, Sinnar industrial zones and Lasalgaon/Pimpalgaon APMCs.'
    ),
    majorResources: {
      agriculture: ['Onion (Lasalgaon)', 'Table Grapes', 'Tomato', 'Maize', 'Pomegranate', 'Capsicum'],
      livestock: ['Dairy Cattle', 'Poultry Broilers', 'Goats'],
      minerals: ['Basalt Stone', 'Fine Sand'],
      forest: ['Herbal Plants', 'Mahua', 'Bamboo (Surgana)']
    },
    existingClusters: ['Onion Trading & Processing Cluster', 'Grape Wine & Table Fruit Cluster', 'Auto Ancillary & Machine Tools (Ambad)', 'Electrical Equipment'],
    artisanClusters: ['Tribal Bamboo Art (Peth/Surgana)', 'Copper & Brass Utensils (Tambat Ali, Nashik Old City)', 'Paithani Saree border weavers (Yeola)'],
    serviceOpportunities: [
      'Cold room on wheels (Reefer transport)',
      'Solar dehydration equipment servicing',
      'Agricultural drone spraying & crop health mapping',
      'Micro-brewery & winery auxiliary maintenance'
    ],
    potentialNewMsmes: [
      {
        id: 'opp_onion_dehydration_flakes',
        name: 'Solar Dehydrated Onion Flakes & Powder Unit',
        nameNative: {
          mr: 'सौर निर्जलीकरण कांदा फ्लेक्स व पावडर उद्योग',
          hi: 'सौर निर्जलीकृत प्याज फ्लेक्स व पाउडर इकाई',
          en: 'Solar Dehydrated Onion Flakes & Powder'
        },
        category: 'Food Processing & Preservation',
        typicalInvestmentInr: 420000,
        minCapitalRequiredInr: 55000,
        valueAdditionPotential: 'VERY_HIGH',
        demandSignal: 'HIGH',
        supplyGap: 'HIGH',
        resourceRequirement: 'Lasalgaon and Pimpalgaon produce India’s largest onion crop with severe price dips in peak season.',
        rationale: {
          mr: 'नाशिकमध्ये कांद्याचे भाव गडगडतात तेव्हा शेतकरी तोटा सहन करतात. सौर ड्रायरने कांदा सुकवून पावडर केल्यास हॉटेल्स व मसाला कंपन्यांना वर्षभर स्थिर भावात विकता येतो.',
          hi: 'लासलगांव में प्याज की बहुतायत के समय जब भाव गिरते हैं, तब सौर निर्जलीकरण से प्याज फ्लेक्स और पाउडर बनाकर साल भर लाभकारी बिक्री की जा सकती है।',
          en: 'Leverages the Lasalgaon onion market crash cycles. Dehydrating surplus onion into shelf-stable flakes captures guaranteed food service demand.'
        },
        keyAssetsNeeded: ['सौर ड्रायर (Solar Tunnel Dryer)', 'स्लाइसिंग मशिन', 'पल्व्हरायझर', 'वजन काटा'],
        mainRisks: {
          mr: 'कांद्याच्या दर्जात तफावत आणि कोरडेपणात ओलावा राहिल्यास गाठी तयार होणे.',
          hi: 'कच्चे माल में नमी नियंत्रण और अत्यधिक बारिश के दिनों में सुखाने की चुनौती।',
          en: 'Moisture retention causing caking; cloudy monsoon days slowing solar dryers.'
        },
        first3Actions: {
          mr: [
            'लासलगाव/पिंपळगाव आवक केंद्रावरून कमी भावात कांदा खरेदीचे नियोजन',
            'कृषी विज्ञान केंद्र (KVK) कडून सौर ड्रायिंगचे प्रशिक्षण घेणे',
            'स्थानिक धाबे, हॉटेल्स आणि मसाला उत्पादकांशी खरेदी करार करणे'
          ],
          hi: [
            'मंडी से सही समय पर कम दर में प्याज खरीद की व्यवस्था',
            'कृषि विज्ञान केंद्र से सोलर सुखाने की तकनीक सीखना',
            'ढाबों और मसाला कंपनियों से अग्रिम आपूर्ति आर्डर लेना'
          ],
          en: [
            'Establish bulk procurement tie-up with Lasalgaon market agents',
            'Get solar dehydration protocol from KVK Nashik',
            'Secure advance purchase agreements with regional cloud kitchens and masala brands'
          ]
        }
      },
      {
        id: 'opp_tomato_puree_paste',
        name: 'Tomato Puree, Pulp & Paste Small Unit',
        nameNative: {
          mr: 'टोमॅटो पल्प, प्युरी व सॉस लघुउद्योग',
          hi: 'टमाटर पल्प व प्यूरी निर्माण इकाई',
          en: 'Tomato Puree, Pulp & Paste Processing'
        },
        category: 'Food Processing',
        typicalInvestmentInr: 380000,
        minCapitalRequiredInr: 50000,
        valueAdditionPotential: 'VERY_HIGH',
        demandSignal: 'HIGH',
        supplyGap: 'HIGH',
        resourceRequirement: 'Girna and Dindori valleys harvest immense tomato surplus from July to November.',
        rationale: {
          mr: 'टोमॅटोचा हंगामी भाव ₹४/किलो पर्यंत खाली येतो. अशा वेळी प्युरी व पेस्ट बनवून ठेवल्यास ऑफ-सीझनमध्ये हॉटेल्सना ३ पट नफ्याने विकता येते.',
          hi: 'पीक सीजन में टमाटर ₹3-5 किलो बिकता है। इसे पल्प और प्यूरी बनाकर पैक करने से ऑफ-सीजन में 3 गुना लाभ मिलता है।',
          en: 'Tomato prices crash to single digits during harvest. Pulping and aseptic pouching allows off-season sale to local restaurants at high margins.'
        },
        keyAssetsNeeded: ['टोमॅटो पल्पर मशिन', 'पाश्चरायझर किटली', 'कॅप सीलर', 'फूड-ग्रेड ड्रम्स'],
        mainRisks: {
          mr: 'योग्य प्रिजर्वेटिव्ह न वापरल्यास आंबणे आणि नाश पावणे.',
          hi: 'गुणवत्ता नियंत्रण और सही परिरक्षक न डालने पर खराब होने का जोखिम।',
          en: 'Fermentation spoilage if pasteurization temperature and Brix levels are not maintained.'
        },
        first3Actions: {
          mr: [
            'दिंडोरी/निफाड मधील टोमॅटो उत्पादक शेतकऱ्यांची यादी तयार करणे',
            'FSSAI अन्न परवाना व पॅकेजिंग मानके समजून घेणे',
            'हॉटेल्स व कॅटरर्सना ५ किलोच्या व्यावसायिक पाऊचचे सॅम्पल देणे'
          ],
          hi: [
            'टमाटर उत्पादक किसानों से सीधा संपर्क',
            'FSSAI लाइसेंस और पैकेजिंग मानकों का पालन',
            'कैटरर्स और होटलों को 5 किलो कमर्शियल पैक का डेमो देना'
          ],
          en: [
            'Map tomato harvest calendars with Dindori grower clusters',
            'Procure commercial pulper and food-grade bottling apparatus',
            'Supply sample 5kg catering buckets to roadside restaurants on Mumbai-Agra highway'
          ]
        }
      },
      {
        id: 'opp_farm_machinery_rental',
        name: 'Custom Hiring Center for Micro-Agri Equipment',
        nameNative: {
          mr: 'शेती अवजारे भाडेतत्त्व केंद्र (कस्टम हायरिंग सेंटर)',
          hi: 'कृषि उपकरण व कस्टम हायरिंग केंद्र',
          en: 'Farm Equipment & Implements Rental Hub'
        },
        category: 'Farm Services & Mechanization',
        typicalInvestmentInr: 500000,
        minCapitalRequiredInr: 65000,
        valueAdditionPotential: 'HIGH',
        demandSignal: 'HIGH',
        supplyGap: 'MEDIUM',
        resourceRequirement: 'Intensive grape vineyards and vegetable plots needing motorized sprayers, weeders, and cutters.',
        rationale: {
          mr: 'दहा गुंठे ते दोन एकर शेती असणाऱ्या शेतकऱ्यांना महागडी अवजारे परवडत नाहीत. बॅटरी स्प्रेअर, पॉवर टिलर, ब्रश कटर भाड्याने देऊन दररोज स्थिर उत्पन्न मिळते.',
          hi: 'छोटे किसानों को महंगे यंत्र खरीदना संभव नहीं। बैटरी स्प्रेयर, वीडर और कटर किराए पर देकर नियमित दैनिक आय प्राप्त होती है।',
          en: 'Smallholders cannot buy ₹50,000+ power equipment. Renting battery sprayers, power weeders, and pruners yields steady daily rental income.'
        },
        keyAssetsNeeded: ['पॉवर वीडर', 'बॅटरी ऑपरेटेड स्प्रेअर्स (५ नग)', 'ब्रश कटर', 'अर्थ ऑगर'],
        mainRisks: {
          mr: 'भाड्याने घेतलेली अवजारे नादुरुस्त होणे आणि वेळेवर भाडे न मिळणे.',
          hi: 'उपकरणों की टूट-फूट और रखरखाव की लागत।',
          en: 'Equipment wear and tear with delayed return from seasonal hirers.'
        },
        first3Actions: {
          mr: [
            'परिसरातील ५० शेतकऱ्यांची अवजारे गरजेची पाहणी करणे',
            'सबसिडी योजनेतून (SMAM) यंत्रांची खरेदी करणे',
            'ग्रामपंचायत फलक व व्हॉट्सॲपवर संपर्क क्रमांक प्रसारित करणे'
          ],
          hi: [
            'आसपास के किसानों की जरूरत का आकलन',
            'सरकारी कृषि यंत्रीकरण योजना (SMAM) से उपकरण लेना',
            'गांव में व्हाट्सएप ग्रुप के जरिए प्रचार'
          ],
          en: [
            'Survey 50 smallholders in Niphad/Dindori on required implements',
            'Leverage Sub-Mission on Agricultural Mechanization (SMAM) subsidies',
            'Publish transparent per-hour/per-day rental price card on village community boards'
          ]
        }
      }
    ],
    exportableProducts: ['Fresh Table Grapes', 'Red Onions', 'Indian Wine', 'Automobile Castings'],
    prominentSkills: ['Grape packaging & grading', 'Automobile tool & die', 'Onion curation & sorting', 'Electrical winding']
  },

  // 3. Shahid Bhagat Singh Nagar / SBS Nagar (Punjab, LGD: 36)
  36: {
    districtLgdCode: 36,
    districtName: 'Shahid Bhagat Singh Nagar',
    stateLgdCode: 3,
    stateName: 'Punjab',
    provenance: createProvenance(
      'DC-MSME District Industrial Profile of SBS Nagar',
      'https://www.dcmsme.gov.in/dips/SBS%20Nagar.pdf',
      'DISTRICT',
      '2024-25',
      'HIGH',
      'Covers Nawanshahr, Banga, Balachaur blocks and Doaba regional industrial data.'
    ),
    majorResources: {
      agriculture: ['Wheat', 'Paddy (Basmati)', 'Maize', 'Kinnow (Citrus)', 'Potato', 'Sugarcane'],
      livestock: ['High-yield Buffaloes (Nili-Ravi/Murrah)', 'Holstein Friesian Cows', 'Piggery'],
      minerals: ['River Sand', 'Gravel'],
      forest: ['Eucalyptus', 'Poplar Wood', 'Shisham']
    },
    existingClusters: ['Agricultural Implements & Tractor Spares', 'Woodcraft & Modular Furniture (Doaba belt)', 'Maize Milling', 'Light Engineering'],
    artisanClusters: ['Carpentry & Poplar Plywood Joinery', 'Traditional Phulkari Embroidery support', 'Metal Gate Fabrication'],
    serviceOpportunities: [
      'Combine harvester & seed drill repair center',
      'Solar tubewell pump maintenance',
      'Grain sorting & cleaning mobile van',
      'Kinnow grading, washing & waxing unit'
    ],
    potentialNewMsmes: [
      {
        id: 'opp_kinnow_waxing_juice_pack',
        name: 'Kinnow Citrus Washing, Waxing & Fresh Juice Unit',
        nameNative: {
          mr: 'किन्नू संत्रा स्वच्छता, वॅक्सिंग व शीतपेय युनिट',
          hi: 'किन्नू फल ग्रेडिंग, वैक्सिंग व ताजा जूस बॉटलिंग इकाई',
          en: 'Kinnow Citrus Washing, Waxing & Fresh Juice Bottling'
        },
        category: 'Food Processing & Horticulture',
        typicalInvestmentInr: 450000,
        minCapitalRequiredInr: 60000,
        valueAdditionPotential: 'VERY_HIGH',
        demandSignal: 'HIGH',
        supplyGap: 'HIGH',
        resourceRequirement: 'Dense kinnow orchards across Nawanshahr and Balachaur belt.',
        rationale: {
          mr: 'पंजाबच्या दोआबा भागात किन्नू फळाचे भरघोस पीक येते. वॅक्सिंग केल्याने फळांचे आयुष्य ३० दिवस वाढते आणि दूरच्या बाजारपेठेत उत्तम भाव मिळतो.',
          hi: 'नवांशहर और बलाचौर क्षेत्र में किन्नू की भरपूर पैदावार है। वैक्सिंग से फल की शेल्फ लाइफ 30 दिन बढ़ती है और दिल्ली-चंडीगढ़ में ऊंचे दाम मिलते हैं।',
          en: 'SBS Nagar orchards harvest rich Kinnow crops. Post-harvest washing, food-grade waxing, and PET-bottled juice capture premium urban margins.'
        },
        keyAssetsNeeded: ['वॉशिंग व वॅक्सिंग रोलर टेबल', 'सायट्रस ज्युसर', 'कोल्ड डिस्पेंसर', 'पॅकिंग क्रेट्स'],
        mainRisks: {
          mr: 'किन्नूचा रस साठवताना कडवटपणा येणे आणि कमी तापमानाची गरज.',
          hi: 'जूस में कड़वाहट आना और कोल्ड चेन की निरंतर आवश्यकता।',
          en: 'Limonin-induced bitterness in unpasteurized juice; cold chain requirement.'
        },
        first3Actions: {
          mr: [
            'स्थानिक किन्नू उत्पादक शेतकऱ्यांशी थेट करार',
            'पंजाब कृषी विद्यापीठ (PAU) कडून वॅक्सिंग तंत्रज्ञान माहिती घेणे',
            'महामार्गावरील ढाब्यांवर व शहरांत फ्रेश किन्नू ज्युस स्टॉल उभारणे'
          ],
          hi: [
            'किन्नू बागवानों से सीधे खरीद का समझौता',
            'पंजाब एग्रीकल्चर यूनिवर्सिटी (PAU) से तकनीक सलाह',
            'हाईवे ढाबों और चंडीगढ़ मार्ग पर जूस आउटलेट खोलना'
          ],
          en: [
            'Contact Kinnow orchardists across Nawanshahr for direct harvest contracts',
            'Adopt PAU-recommended post-harvest waxing guidelines',
            'Establish fresh packaged juice distribution along Jalandhar-Chandigarh highway'
          ]
        }
      },
      {
        id: 'opp_maize_feed_pellet_unit',
        name: 'Maize & Grain Feed Pellet Unit for Livestock',
        nameNative: {
          mr: 'मका व धान्य पशुखाद्य पेलेट निर्मिती युनिट',
          hi: 'मक्का व अनाज आधारित पशु आहार पेलेट निर्माण इकाई',
          en: 'Maize-Based Cattle & Poultry Feed Pellet Unit'
        },
        category: 'Livestock & Feed Processing',
        typicalInvestmentInr: 520000,
        minCapitalRequiredInr: 70000,
        valueAdditionPotential: 'HIGH',
        demandSignal: 'HIGH',
        supplyGap: 'MEDIUM',
        resourceRequirement: 'SBS Nagar is one of Punjab’s primary maize-producing districts with high dairy cattle density.',
        rationale: {
          mr: 'नवांशहर भागात मक्याचे मुबलक उत्पादन होते आणि दोआबामध्ये दुभत्या गाई-म्हशी मोठ्या प्रमाणात आहेत. मक्यापासून पोषक पेलेट्स बनवून विकल्यास वर्षभर खात्रीशीर गिऱ्हाईक मिळते.',
          hi: 'नवांशहर पंजाब का प्रमुख मक्का उत्पादक जिला है। उच्च नस्ल की गायों व भैंसों के लिए मक्का आधारित संतुलित आहार पेलेट की साल भर भारी मांग है।',
          en: 'SBS Nagar is Punjab’s maize belt. Compacting surplus maize with minerals into digestible pellets serves the local high-yield dairy sector.'
        },
        keyAssetsNeeded: ['पेलेट मेकिंग मशिन', 'हॅमर मिल ग्राइंडर', 'मिक्सर', 'बॅगिंग मशिन'],
        mainRisks: {
          mr: 'मक्याच्या दाण्यातील ओलाव्यामुळे अफ्लाटॉक्सिन बुरशीचा प्रादुर्भाव.',
          hi: 'मक्के में नमी से फफूंद लगने का खतरा।',
          en: 'Aflatoxin contamination if maize grain is bagged with high moisture.'
        },
        first3Actions: {
          mr: [
            'नवांशहर APMC मधून थेट मका खरेदी',
            'स्थानिक पशुपालकांशी व डेअरी फार्म्सशी सॅम्पल चाचणी',
            '५० किलो पोती पॅकिंग ब्रँड नोंदणी'
          ],
          hi: [
            'नवांशहर मंडी से सीधे मक्के की खरीद',
            'स्थानीय डेयरी फार्मों में नमूना वितरण व परीक्षण',
            '50 किलो बोरी में स्थानीय ब्रांड से बिक्री'
          ],
          en: [
            'Procure grain directly from Nawanshahr grain market during post-monsoon harvest',
            'Conduct nutritional feed trial with 10 commercial dairy farmers in Banga',
            'Launch 50kg fortified balanced mash/pellet bags under local brand'
          ]
        }
      },
      {
        id: 'opp_tractor_farm_implement_repairs',
        name: 'Precision Farm Implements & Laser Leveller Service Center',
        nameNative: {
          mr: 'आधुनिक शेती अवजारे व ट्रॅक्टर दुरुस्ती केंद्र',
          hi: 'आधुनिक कृषि यंत्र व लेजर लेवलर मरम्मत केंद्र',
          en: 'Farm Machinery, Laser Leveller & Tractor Servicing Hub'
        },
        category: 'Repair & Technical Services',
        typicalInvestmentInr: 320000,
        minCapitalRequiredInr: 40000,
        valueAdditionPotential: 'HIGH',
        demandSignal: 'HIGH',
        supplyGap: 'HIGH',
        resourceRequirement: 'Very high tractor and farm implement density per acre in SBS Nagar and Doaba region.',
        rationale: {
          mr: 'पंजाबमधील शेती पूर्णतः यांत्रिकीकृत आहे. रोटाव्हेटर, लेझर लँड लेव्हलर आणि सुपर सीडरच्या हायड्रॉलिक दुरुस्तीसाठी कुशल सेवेला कायम मागणी असते.',
          hi: 'पंजाब में 100% यंत्रीकृत खेती है। रोटावेटर, लेजर लैंड लेवलर और सुपर सीडर की हाइड्रोलिक मरम्मत व कलपुर्जों की भारी मांग है।',
          en: '100% mechanized agriculture in Doaba. Hydraulic calibration and precision servicing for laser levellers, seeders, and harvesters has zero downtime tolerance.'
        },
        keyAssetsNeeded: ['हायड्रॉलिक टेस्ट बेंच', 'MIG वेल्डिंग मशिन', 'टॉर्क रिंच सेट', 'पोर्टेबल कॉम्प्रेसर'],
        mainRisks: {
          mr: 'हंगामाबाहेर (Off-season) कामात घट होणे.',
          hi: 'बुवाई व कटाई के बाद ऑफ-सीजन में काम कम होना।',
          en: 'Seasonal workload peaks during sowing/harvest with lull in mid-monsoon.'
        },
        first3Actions: {
          mr: [
            'स्थानिक ट्रॅक्टर मालकांची यादी तयार करणे',
            'टूलकिट व आधुनिक वेल्डिंग मशिन बसवणे',
            'हंगामापूर्वी मोफत तपासणी शिबीर आयोजित करणे'
          ],
          hi: [
            'स्थानीय ट्रैक्टर मालिकों का संपर्क नेटवर्क',
            'हाइड्रोलिक मरम्मत टूल्स की व्यवस्था',
            'सीजन शुरू होने से पहले फ्री चेक-अप कैंप लगाना'
          ],
          en: [
            'Register local tractor and combine operators across Balachaur and Nawanshahr',
            'Equip workshop with high-pressure hydraulic hose crimping and welding gear',
            'Offer pre-season harvester tune-up camps to secure annual maintenance retainers'
          ]
        }
      }
    ],
    exportableProducts: ['Kinnow Citrus', 'Sports Goods Accessories', 'Basmati Rice', 'Plywood Panels'],
    prominentSkills: ['Tractor mechanical repair', 'Poplar timber joinery', 'Precision welding', 'Mechanized crop harvesting']
  },

  // 4. Sonipat (Haryana, LGD: 80)
  80: {
    districtLgdCode: 80,
    districtName: 'Sonipat',
    stateLgdCode: 6,
    stateName: 'Haryana',
    provenance: createProvenance(
      'DC-MSME District Industrial Profile of Sonipat',
      'https://www.dcmsme.gov.in/dips/DIPR_Sonipat.pdf',
      'DISTRICT',
      '2024-25',
      'HIGH',
      'Covers Rai, Kundli, Murthal industrial corridors and National Capital Region supply chain.'
    ),
    majorResources: {
      agriculture: ['Button Mushroom (India capital)', 'Basmati Paddy', 'Wheat', 'Vegetables', 'Flowers'],
      livestock: ['Murrah Buffaloes', 'Poultry'],
      minerals: ['River Sand', 'Clay for Bricks'],
      forest: ['Agro-forestry Poplar', 'Kikar']
    },
    existingClusters: ['Button Mushroom Cultivation & Processing Cluster', 'Automotive Components (Kundli/Rai)', 'Stainless Steel Utensils & Fabrication', 'Food Processing & Cold Storage'],
    artisanClusters: ['Handloom Durries & Rugs (Murthal border)', 'Clay Pottery & Tandoor Manufacturing (Rai)'],
    serviceOpportunities: [
      'Cold storage & refrigerated delivery to Delhi NCR',
      'Electrician & industrial automation servicing',
      'Compost bag preparation for mushroom growers',
      'Warehouse packaging & barcode labeling services'
    ],
    potentialNewMsmes: [
      {
        id: 'opp_mushroom_canning_dehydration',
        name: 'Button Mushroom Canning, Pickling & Solar Dehydration',
        nameNative: {
          mr: 'बटन मशरूम कॅनिंग, लोणचे व ड्रायिंग उद्योग',
          hi: 'बटन मशरूम कैनिंग, अचार व डिहाइड्रेशन इकाई',
          en: 'Button Mushroom Canning, Pickling & Dehydration'
        },
        category: 'Food Processing & Horticulture',
        typicalInvestmentInr: 480000,
        minCapitalRequiredInr: 65000,
        valueAdditionPotential: 'VERY_HIGH',
        demandSignal: 'HIGH',
        supplyGap: 'HIGH',
        resourceRequirement: 'Sonipat is celebrated as the Mushroom Capital of India, producing massive daily fresh yields in Murthal, Ganaur, and Rai.',
        rationale: {
          mr: 'सोनिपत हे देशातील मशरूमचे सर्वात मोठे केंद्र आहे. हिवाळ्यात मशरूमचे भाव ₹३०/किलो पर्यंत घसरतात. कॅनिंग किंवा लोणचे बनवून दिल्ली-एनसीआर मधील हॉटेल्सना विकल्यास तिप्पट नफा मिळतो.',
          hi: 'सोनीपत भारत की मशरूम राजधानी है। सर्दियों में जब ताजे मशरूम के भाव गिरते हैं, तब कैनिंग, ड्रायिंग या अचार बनाकर दिल्ली-एनसीआर के सुपरमार्केट व होटलों को भारी मुनाफे में बेचा जा सकता है।',
          en: 'Sonipat is India’s mushroom capital. In peak winter price gluts, preserving button mushrooms in brine cans or spicy pickle jars sells at 3x raw price in Delhi NCR.'
        },
        keyAssetsNeeded: ['कॅन सीमिंग मशिन', 'ब्लांचिंग व्हॅट', 'ऑटोक्लेव्ह / स्टेरिलायझर', 'वजन काटा'],
        mainRisks: {
          mr: 'कॅनिंग प्रक्रियेत निर्जंतुकीकरण नीट न झाल्यास बॅक्टेरियाचा धोका.',
          hi: 'कैनिंग में स्टरलाइजेशन अधूरा रहने पर फफूंद का खतरा।',
          en: 'Strict sterilization needed to prevent Clostridium botulinum in low-acid mushroom cans.'
        },
        first3Actions: {
          mr: [
            'गन्नौर व मुरथल येथील स्थानिक मशरूम शेड मालकांशी संपर्क',
            'FSSAI अन्न प्रक्रिया परवाना घेणे',
            'दिल्ली आझादपूर बाजार आणि स्थानिक रेस्टॉरंट्सना कॅन सॅम्पल देणे'
          ],
          hi: [
            'मुरथल और गन्नौर के मशरूम उत्पादक किसानों से अनुबंध',
            'FSSAI लाइसेंस और स्टरलाइजेशन मानकों की तैयारी',
            'दिल्ली-एनसीआर के होटल सप्लायर्स को कैनिंग सैंपल देना'
          ],
          en: [
            'Partner with mushroom farm sheds across Murthal and Ganaur',
            'Set up FSSAI-compliant retort canning line',
            'Supply sample 800g brine cans to Delhi NCR cloud kitchens and pizza chains'
          ]
        }
      },
      {
        id: 'opp_auto_ancillary_job_work',
        name: 'Sheet Metal Press & Fastener Small Job-Work Unit',
        nameNative: {
          mr: 'शीट मेटल प्रेस व नट-बोल्ट फॅब्रिकेशन युनिट',
          hi: 'शीट मेटल प्रेस व ऑटो पार्ट्स जॉब-वर्क इकाई',
          en: 'Light Engineering & Automotive Fastener Job-Work'
        },
        category: 'Light Engineering & Manufacturing',
        typicalInvestmentInr: 580000,
        minCapitalRequiredInr: 75000,
        valueAdditionPotential: 'HIGH',
        demandSignal: 'HIGH',
        supplyGap: 'MEDIUM',
        resourceRequirement: 'Proximity to Kundli and Rai industrial estates with continuous demand for subcontracted stamped components.',
        rationale: {
          mr: 'सोनिपतमधील कुंडली व राय इंडस्ट्रियल एरियात मोठ्या ऑटोमोबाईल कंपन्या आहेत. ब्रॅकेट्स, वॉशर्स आणि स्टँपिंग पार्ट्सच्या जॉब वर्कसाठी सातत्यपूर्ण ऑर्डर्स मिळतात.',
          hi: 'कुंडली व राई औद्योगिक क्षेत्र में मारुति और ऑटोमोबाईल कंपनियों के वेंडर्स हैं। छोटे शीट मेटल पार्ट्स व ब्रैकेट निर्माण में नियमित जॉब वर्क मिलता है।',
          en: 'Situated along the Delhi-Ambala industrial corridor. Subcontracting small stamped brackets, clamps, and washers to Tier-1 auto suppliers ensures year-round cashflow.'
        },
        keyAssetsNeeded: ['पॉवर प्रेस (20 Ton)', 'ड्रिलिंग मशिन', 'बेंच ग्राइंडर', 'मेझरिंग व्हर्नियर'],
        mainRisks: {
          mr: 'ऑर्डर वेळेवर न दिल्यास दंड आणि कच्च्या लोखंडाचे चढते भाव.',
          hi: 'क्वालिटी रिजेक्शन और कच्चे लोहे की कीमतों में अचानक वृद्धि।',
          en: 'Tolerance rejection risks from Tier-1 buyers and working capital lockup in raw sheet stock.'
        },
        first3Actions: {
          mr: [
            'कुंडली MIDC/HSIIDC मधील ५ ऑटो व्हेंडर्सना भेट देणे',
            'सेकंड-हँड चांगल्या स्थितीतील पॉवर प्रेस बसवणे',
            'लहान जॉब-वर्क लॉट वेळेत पूर्ण करून विश्वास संपादन करणे'
          ],
          hi: [
            'राई व कुंडली इंडस्ट्रियल एरिया की कंपनियों से वेंडर पंजीकरण',
            '20 टन पावर प्रेस मशीन की स्थापना',
            'सटीक गुणवत्ता के साथ पहले छोटे आर्डर की डिलीवरी'
          ],
          en: [
            'Register as Tier-2 job-worker with 5 tier-1 auto ancillaries in HSIIDC Rai',
            'Procure calibrated 20-ton eccentric power press and deburring tools',
            'Deliver zero-defect trial batches of sheet metal mounting clips'
          ]
        }
      },
      {
        id: 'opp_cold_chain_micro_logistics',
        name: 'Temperature-Controlled Farm-to-Fork Micro Van Logistics',
        nameNative: {
          mr: 'शीतकरण व्हॅन (रीफर) भाजीपाला थेट वितरण सेवा',
          hi: 'तापमान नियंत्रित माइक्रो रीफर वाहन वितरण सेवा',
          en: 'Temperature-Controlled Micro Cold-Van Transport'
        },
        category: 'Logistics & Rural Distribution',
        typicalInvestmentInr: 650000,
        minCapitalRequiredInr: 85000,
        valueAdditionPotential: 'HIGH',
        demandSignal: 'HIGH',
        supplyGap: 'HIGH',
        resourceRequirement: 'Perishable button mushrooms, strawberries, and sweet corn requiring 2-8°C transport to Delhi NCR wholesale markets.',
        rationale: {
          mr: 'सोनिपतमधून दररोज ताजी भाजी, मशरूम आणि दूध दिल्लीला जाते. सामान्य गाडीत माल खराब होतो. इन्सुलेटेड रीफर व्हॅनने माल नेल्यास शेतकऱ्यांकडून २०-३०% जास्त भाडे सहज मिळते.',
          hi: 'सोनीपत से दिल्ली रोजाना ताजी सब्जियां व मशरूम जाते हैं। तापमान नियंत्रित रीफर वैन से माल सुरक्षित पहुंचता है और किसान खुशी-खुशी अधिक किराया देते हैं।',
          en: 'Direct highway connectivity (NH-44) into Delhi. An insulated refrigerated micro-truck serving perishable horticulture growers commands premium freight rates.'
        },
        keyAssetsNeeded: ['इन्सुलेटेड रीफर व्हॅन (उदा. Bolero Maxi Truck / Tata Ace Reefer)', 'GPS ट्रॅकर', 'तापमान डेटा लॉगर'],
        mainRisks: {
          mr: 'इंधनाचा वाढता खर्च आणि वाहनाचा नियमित हप्ता (EMI).',
          hi: 'डीजल का खर्च और नियमित बैंक किश्त चुकाने का दबाव।',
          en: 'Fuel cost fluctuations and tight delivery time windows in Delhi NCR traffic.'
        },
        first3Actions: {
          mr: [
            'स्थानिक १० मोठ्या भाजी व मशरूम उत्पादकांशी दैनिक वाहतूक करार',
            'Mudra / PMEGP योजनेतून वाहन कर्जाचा अर्ज करणे',
            'आझादपूर व गाझीपूर मंडीतील व्यापाऱ्यांशी संपर्क साधणे'
          ],
          hi: [
            '10 स्थानीय उत्पादक किसानों से दैनिक परिवहन का एग्रीमेंट',
            'मुद्रा अथवा पीएमईजीपी योजना से वाहन ऋण आवेदन',
            'दिल्ली आजादपुर मंडी के आढ़तियों से सीधा संपर्क'
          ],
          en: [
            'Sign daily freight commitment with 8 mushroom growers in Ganaur/Murthal',
            'Apply for commercial transport finance under Mudra / PMEGP transport scheme',
            'Set up daily fixed departure to Azadpur wholesale terminal at 4 AM'
          ]
        }
      }
    ],
    exportableProducts: ['Canned Button Mushrooms', 'Stainless Steel Utensils', 'Automotive Fasteners', 'Basmati Rice'],
    prominentSkills: ['Commercial mushroom cultivation', 'Sheet metal press operation', 'Cold storage management', 'CNC turning']
  },

  // 5. Guntur (Andhra Pradesh, LGD: 510)
  510: {
    districtLgdCode: 510,
    districtName: 'Guntur',
    stateLgdCode: 28,
    stateName: 'Andhra Pradesh',
    provenance: createProvenance(
      'DC-MSME District Industrial Profile of Guntur',
      'https://www.dcmsme.gov.in/dips/DIPR_Guntur.pdf',
      'DISTRICT',
      '2024-25',
      'HIGH',
      'Covers Guntur Mirchi Yard (Asia’s largest chilli market), Tenali, and Mangalagiri clusters.'
    ),
    majorResources: {
      agriculture: ['Red Chilli (Guntur Sannam GI)', 'Cotton', 'Turmeric', 'Paddy', 'Tobacco'],
      livestock: ['Buffaloes', 'Sheep & Goats'],
      minerals: ['Limestone', 'Granite'],
      forest: ['Teak', 'Bamboo']
    },
    existingClusters: ['Dry Chilli Grading & Cold Storage Cluster', 'Cotton Ginning & Pressing', 'Spice Grinding & Oleoresin', 'Mangalagiri Handloom Sarees'],
    artisanClusters: ['Mangalagiri GI Handloom Cotton Weaving', 'Brass and Bell Metal Craft (Bhattiprolu)'],
    serviceOpportunities: [
      'Chilli stem-cutting machine custom service',
      'Pest-resistant jute bag stitching and printing',
      'Cold storage container logistics',
      'Quality assaying & moisture testing for spice exporters'
    ],
    potentialNewMsmes: [
      {
        id: 'opp_stemless_chilli_powder_unit',
        name: 'Stemless Guntur Chilli Grinding & Sealed Pouch Packing',
        nameNative: {
          mr: 'गुंटूर लाल मिरची देठविरहित पावडर व पॅकिंग उद्योग',
          hi: 'गुंटूर लाल मिर्च डंठल-रहित पिसाई व पाउच पैकिंग इकाई',
          en: 'Stemless Guntur Chilli Cleaning, Grinding & Pouch Packaging'
        },
        category: 'Spices & Agro Processing',
        typicalInvestmentInr: 360000,
        minCapitalRequiredInr: 45000,
        valueAdditionPotential: 'VERY_HIGH',
        demandSignal: 'HIGH',
        supplyGap: 'HIGH',
        resourceRequirement: 'Direct access to Asia’s largest red chilli market (Guntur Mirchi Yard) with globally recognized hot varieties (Teja, 334, S17).',
        rationale: {
          mr: 'गुंटूरची मिरची जगप्रसिद्ध आहे. देठ काढून शुद्ध लाल मिरची पावडर आणि चिली फ्लेक्स तयार केल्यास रेस्टॉरंट्स आणि घरगुती ग्राहकांकडून २५-४०% अधिक भाव मिळतो.',
          hi: 'गुंटूर की मिर्च पूरे देश में प्रसिद्ध है। डंठल हटाकर शुद्ध पिसी मिर्च और चिली फ्लेक्स पैक करने से 30% अधिक मुनाफा मिलता है।',
          en: 'Guntur houses Asia’s largest chilli market. Stem-cutting, grading for color (ASTA units), and grinding into heat-sealed pouches yields strong margins.'
        },
        keyAssetsNeeded: ['देठ तोडणी मशिन (Stem Cutter)', 'इम्पॅक्ट पल्व्हरायझर', 'नायट्रोजन सीलर', 'डस्ट कलेक्टर'],
        mainRisks: {
          mr: 'मिरचीची धूळ उडल्याने कामगारांना त्रास आणि हंगामातील भाव चढ-उतार.',
          hi: 'मिर्च की तीखी धूल से श्रमिकों की सुरक्षा और मूल्य में उतार-चढ़ाव।',
          en: 'Severe capsaicin dust irritation requiring enclosed dust extractors; seasonal price swings.'
        },
        first3Actions: {
          mr: [
            'गुंटूर मिर्ची यार्डमधील आडत्यांशी संपर्क',
            'धूर आणि धूळ प्रतिबंधक पल्व्हरायझर युनिट बसवणे',
            'स्थानिक हॉटेल्स व किरकोळ व्यापाऱ्यांना २५० ग्रॅम पॅकेट देणे'
          ],
          hi: [
            'गुंटूर मिर्ची यार्ड से सही किस्म की मिर्च की थोक खरीद',
            'डस्ट-फ्री ग्राइंडिंग मशीन की स्थापना',
            'होटलों और किराना दुकानों को टेस्ट सैंपल देना'
          ],
          en: [
            'Establish direct auction bidding contact at Guntur Mirchi Yard',
            'Install closed-loop spice pulverizer with dust extractor hood',
            'Package 100g and 500g branded pure chilli powder for retail grocery networks'
          ]
        }
      },
      {
        id: 'opp_cotton_ginning_seed_oil',
        name: 'Cottonseed Oil Expeller & Cattle Cake Unit',
        nameNative: {
          mr: 'सरकी तेल गाळणी व सरकी पेंड निर्मिती उद्योग',
          hi: 'बिनौला तेल निष्कर्षण व खली निर्माण इकाई',
          en: 'Cottonseed Oil Expeller & Cattle Feed Cake'
        },
        category: 'Agro & Edible Oil Processing',
        typicalInvestmentInr: 550000,
        minCapitalRequiredInr: 75000,
        valueAdditionPotential: 'HIGH',
        demandSignal: 'HIGH',
        supplyGap: 'MEDIUM',
        resourceRequirement: 'Enormous cottonseed supply from Guntur cotton ginning and pressing mills.',
        rationale: {
          mr: 'गुंटूरमध्ये कापसाचे मोठ्या प्रमाणावर उत्पादन होते. जिनिंग मिलमधून सरकी (कपाशी बियाणे) सहज मिळते. सरकीचे तेल आणि उरलेली पेंड दुभत्या जनावरांसाठी उत्तम खपते.',
          hi: 'गुंटूर में कपास जिनिंग मिलों से बिनौला (कपास के बीज) प्रचुर मात्रा में मिलता है। इससे तेल और पशुओं के लिए पौष्टिक खली बनाकर भारी मांग पूरी की जा सकती है।',
          en: 'Cotton ginning mills in Guntur generate thousands of tons of seed. Expelling unrefined cottonseed oil and selling high-protein seed cake to dairy farmers.'
        },
        keyAssetsNeeded: ['ऑइल एक्सपेलर मशिन (6-Bolt)', 'फिल्टर प्रेस', 'सीड क्लीनर'],
        mainRisks: {
          mr: 'कच्च्या सरकीच्या दरातील चढ-उतार आणि तेलातील गॉसिपॉल प्रमाण नियंत्रण.',
          hi: 'बिनौले की कीमतों में तेजी और तेल के रिफाइनिंग संपर्क।',
          en: 'Seed price fluctuations linked to national cotton trade; non-refined oil marketing restrictions.'
        },
        first3Actions: {
          mr: [
            'स्थानिक जिनिंग मिलशी सरकी पुरवठा करार',
            '६-बोल्ट एक्सपेलर मशिन बसवणे',
            'स्थानिक पशुखाद्य विक्रेत्यांशी पेंड विक्रीचा करार'
          ],
          hi: [
            'स्थानीय जिनिंग मिल से सीधे बिनौला आपूर्ति समझौता',
            'ऑयल एक्सपेलर व फिल्टर प्रेस की स्थापना',
            'पशु आहार व्यापारियों को खली की अग्रिम आपूर्ति'
          ],
          en: [
            'Secure steady seed supply from 2 ginning mills in Guntur/Narasaraopet',
            'Install 6-bolt oil expeller with plate-and-frame filter press',
            'Contract seed cake delivery with local dairy co-operative unions'
          ]
        }
      }
    ],
    exportableProducts: ['Guntur Sannam Chilli (GI)', 'Raw Cotton Bales', 'Mangalagiri Cotton Sarees', 'Spices Oleoresin'],
    prominentSkills: ['Chilli grading & capsaicin assaying', 'Cotton grading & spinning', 'Handloom pit loom weaving', 'Spice milling']
  },

  // 6. Krishna (Andhra Pradesh, LGD: 513)
  513: {
    districtLgdCode: 513,
    districtName: 'Krishna',
    stateLgdCode: 28,
    stateName: 'Andhra Pradesh',
    provenance: createProvenance(
      'DC-MSME District Industrial Profile of Krishna District',
      'https://www.dcmsme.gov.in/dips/DIPR_Krishna.pdf',
      'DISTRICT',
      '2024-25',
      'HIGH',
      'Covers Machilipatnam, Vijayawada, Gudivada aquaculture and mango belts.'
    ),
    majorResources: {
      agriculture: ['Mango (Banganapalle/Totapuri)', 'Paddy', 'Sugarcane', 'Coconut'],
      livestock: ['Aquaculture (Vannamei Shrimp & Freshwater Fish)', 'Buffaloes'],
      minerals: ['River Sand', 'Gravel'],
      forest: ['Mangrove Flora', 'Casuarina']
    },
    existingClusters: ['Aquaculture Prawn & Fish Processing Cluster', 'Mango Pulp & Fruit Processing', 'Machilipatnam Imitation Jewellery (Rold Gold)', 'Rice Milling'],
    artisanClusters: ['Kalamkari Block Printing (Pedana)', 'Machilipatnam Gold-Plated Jewellery', 'Kondapalli Wooden Toys'],
    serviceOpportunities: [
      'Pond aerator & aquaculture solar equipment maintenance',
      'Ice flake mobile dispatch for shrimp harvesting',
      'Cold chain transport to Vizag and Chennai ports',
      'Artisan export packaging and digital cataloging'
    ],
    potentialNewMsmes: [
      {
        id: 'opp_mango_pulp_fruit_bar',
        name: 'Banganapalle Mango Pulp & Aam Papad (Fruit Bar) Unit',
        nameNative: {
          mr: 'आंबा पल्प व आंबा पोळी (मँगो बार) निर्मिती उद्योग',
          hi: 'आम पल्प व आम पापड़ (फ्रूट बार) निर्माण इकाई',
          en: 'Banganapalle Mango Pulp & Aam Papad (Fruit Bar) Processing'
        },
        category: 'Food Processing & Horticulture',
        typicalInvestmentInr: 390000,
        minCapitalRequiredInr: 50000,
        valueAdditionPotential: 'VERY_HIGH',
        demandSignal: 'HIGH',
        supplyGap: 'HIGH',
        resourceRequirement: 'Krishna district orchards produce enormous Banganapalle and Totapuri mangoes from April to June.',
        rationale: {
          mr: 'कृष्णा जिल्ह्यात प्रसिद्ध बंगनपल्ली आंब्याची मोठी आवक होते. आंब्याचा पल्प आणि पारंपरिक आंबा पोळी आधुनिक पद्धतीने पॅक केल्यास वर्षभर चांगला नफा मिळतो.',
          hi: 'कृष्णा जिला बंगनपल्ली आम का गढ़ है। सीजन में आम का पल्प निकालकर आम पापड़ (फ्रूट बार) बनाने से साल भर मीठे स्नैक्स की भारी मांग पूरी होती है।',
          en: 'Krishna is the home of Banganapalle mangoes. Producing hygienic dehydrated mango leather (aam papad) and aseptic canned pulp commands year-round confectionery demand.'
        },
        keyAssetsNeeded: ['पल्पर मशिन', 'सौर ड्रायिंग रॅक्स', 'रिफ्रॅक्टोमीटर (Brix Reader)', 'पाऊच सीलर'],
        mainRisks: {
          mr: 'हंगाम लहान असणे (केवळ २-३ महिने) आणि साठवणीत बुरशी लागणे.',
          hi: 'सीजन केवल 2-3 महीने रहने से पूरे साल के कच्चे माल का प्रबंधन।',
          en: 'Short harvest season requiring concentrated seasonal procurement and working capital.'
        },
        first3Actions: {
          mr: [
            'विजयवाडा व नूझवीड येथील आंबा बागायतदारांशी संपर्क',
            'सोलर ड्रायिंग ट्रे व पल्पर खरेदी',
            'शालेय दुकाने, बेकऱ्या व सुपरमार्केट्सना सॅम्पल देणे'
          ],
          hi: [
            'नूझवीड के आम बागवानों से थोक खरीद का अनुबंध',
            'सोलर ड्रायर और पल्पर की स्थापना',
            'किराना दुकानों और मिठाई विक्रेताओं को सैंपल देना'
          ],
          en: [
            'Tie up with orchard growers around Nuzvid / Gudivada',
            'Set up solar drying clean room with stainless steel pulper',
            'Supply hygienic 20g individually wrapped fruit bars to school canteens and sweet shops'
          ]
        }
      },
      {
        id: 'opp_aquaculture_feed_supplement',
        name: 'Organic Aquaculture Mineral Supplement & Water Probiotics',
        nameNative: {
          mr: 'कोळंबी व मासे संवर्धन पूरक पोषण व प्रोबायोटिक्स युनिट',
          hi: 'झींगा व मत्स्य पालन पूरक आहार व प्रोबायोटिक्स इकाई',
          en: 'Aquaculture Shrimp Minerals & Water Conditioner Hub'
        },
        category: 'Aquaculture & Fisheries Support',
        typicalInvestmentInr: 420000,
        minCapitalRequiredInr: 55000,
        valueAdditionPotential: 'HIGH',
        demandSignal: 'HIGH',
        supplyGap: 'HIGH',
        resourceRequirement: 'Intensive Vannamei shrimp and carp farming across Krishna delta brackish water ponds.',
        rationale: {
          mr: 'कृष्णा जिल्ह्यात कोळंबी शेती मोठ्या प्रमाणावर केली जाते. पाण्याचा दर्जा राखण्यासाठी आणि कोळंबीची वाढ होण्यासाठी मिनरल्स व प्रोबायोटिक्सची शेतकऱ्यांना रोज गरज भासते.',
          hi: 'कृष्णा जिले में हजारों एकड़ में झींगा और मछली पालन होता है। पानी की गुणवत्ता और बीमारियों से बचाव के लिए मिनरल मिश्रण की निरंतर मांग है।',
          en: 'Intensive coastal aquaculture demands daily mineral supplements (magnesium, calcium, potassium) and water conditioning probiotics.'
        },
        keyAssetsNeeded: ['रिबन ब्लेंडर', 'मायक्रो-पल्व्हरायझर', 'एचडीपीई बॅगिंग मशिन', 'pH व सॅलिनिटी मीटर'],
        mainRisks: {
          mr: 'कोळंबी तळ्यांवर रोगाची साथ आल्यास शेतकऱ्यांचे नुकसान होणे.',
          hi: 'झींगा बीमारी के समय किसानों की आर्थिक स्थिति का प्रभाव।',
          en: 'Disease outbreaks (White Spot syndrome) disrupting farmers’ purchasing power.'
        },
        first3Actions: {
          mr: [
            'स्थानिक कोळंबी उत्पादक शेतकऱ्यांच्या गरजा समजून घेणे',
            'मत्स्य विज्ञान संस्थेकडून योग्य फॉम्र्युलेशन तयार करणे',
            'स्थानिक ॲक्वा सेवा केंद्रांना उत्पादनांचा पुरवठा करणे'
          ],
          hi: [
            'झींगा किसानों की समस्याओं और जरूरत का अध्ययन',
            'मत्स्य वैज्ञानिकों की देखरेख में मिनरल फार्मूलेशन तैयार करना',
            'स्थानीय एक्वा क्लिनिकों और दुकानों को आपूर्ति'
          ],
          en: [
            'Interview 20 shrimp farmers in Machilipatnam and Bantumilli talukas',
            'Formulate balanced mineral blend adhering to MPEDA standards',
            'Partner with local aqua-input retailers for farmgate distribution'
          ]
        }
      }
    ],
    exportableProducts: ['Frozen Vannamei Shrimp', 'Banganapalle Mangoes', 'Pedana Kalamkari Textiles', 'Machilipatnam Imitation Jewellery'],
    prominentSkills: ['Shrimp hatchery management', 'Kalamkari vegetable dye printing', 'Mango orchard management', 'Electroplating']
  },

  // 7. Jaipur (Rajasthan, LGD: 88)
  88: {
    districtLgdCode: 88,
    districtName: 'Jaipur',
    stateLgdCode: 8,
    stateName: 'Rajasthan',
    provenance: createProvenance(
      'DC-MSME District Industrial Profile of Jaipur',
      'https://www.dcmsme.gov.in/dips/DIPR_Jaipur.pdf',
      'DISTRICT',
      '2024-25',
      'HIGH',
      'Covers Sanganer, Bagru, Sitapura, Vishwakarma industrial areas and artisan clusters.'
    ),
    majorResources: {
      agriculture: ['Mustard', 'Barley', 'Bajra', 'Coriander'],
      livestock: ['Camel', 'Marwari Sheep', 'Sirohi Goats', 'Cattle'],
      minerals: ['Marble', 'Granite', 'Feldspar', 'Silica Sand'],
      forest: ['Khejri', 'Babool', 'Herbal Shrubs']
    },
    existingClusters: ['Sanganeri & Bagru Handblock Printing', 'Gem Cutting & Polishing (Johari Bazaar)', 'Blue Pottery (Kot Jewar)', 'Mustard Oil Processing', 'Leather Footwear (Mojari)'],
    artisanClusters: ['Blue Pottery of Jaipur (GI)', 'Sanganeri Hand Block Printing (GI)', 'Bagru Hand Block Printing (GI)', 'Kundan-Meenakari Jewellery'],
    serviceOpportunities: [
      'Solar rooftop & solar pump installation and servicing',
      'Eco-friendly natural dye extraction for block printers',
      'E-commerce photography and cataloging for handicraft artisans',
      'Tour guide and experiential craft workshop host'
    ],
    potentialNewMsmes: [
      {
        id: 'opp_natural_dye_block_print',
        name: 'Eco-Friendly Natural Dye Extraction & Sustainable Textile Printing',
        nameNative: {
          mr: 'पर्यावरणपूरक नैसर्गिक रंग व हँडब्लॉक छपाई उद्योग',
          hi: 'प्राकृतिक रंग निष्कर्षण व सांगानेरी ब्लॉक प्रिंटिंग इकाई',
          en: 'Natural Dye Extraction & Sustainable Handblock Textile Printing'
        },
        category: 'Textiles & Handicrafts',
        typicalInvestmentInr: 320000,
        minCapitalRequiredInr: 40000,
        valueAdditionPotential: 'VERY_HIGH',
        demandSignal: 'HIGH',
        supplyGap: 'HIGH',
        resourceRequirement: 'Sanganer and Bagru artisan ecosystem with global demand for non-chemical vegetable and indigo dyes.',
        rationale: {
          mr: 'जयपूरची ब्लॉक प्रिंटिंग जगभर प्रसिद्ध आहे. रासायनिक रंगांऐवजी डाळिंबाची साल, हरडा व नीळ यापासून बनवलेल्या नैसर्गिक रंगांच्या कापडाला युरोप व देशी पर्यटकांकडून तिप्पट भाव मिळतो.',
          hi: 'सांगानेर और बगरू की ब्लॉक प्रिंटिंग विश्वप्रसिद्ध है। रासायनिक रंगों के बजाय प्राकृतिक अनार छिलका, हरड़ और नील से तैयार कपड़ों की देशी-विदेशी ग्राहकों में भारी मांग है।',
          en: 'Sanganer and Bagru block prints command international acclaim. Extracting non-toxic natural dyes (pomegranate rind, madder, indigo) captures 40% export premium.'
        },
        keyAssetsNeeded: ['डाईंग व्हॅट व बॉयलर', 'ब्लॉक प्रिंटिंग लाकडी टेबल', 'कापड धुलाई हौद', 'कॅटलॉग किट'],
        mainRisks: {
          mr: 'पावसाळ्यात रंग वाळण्यास विलंब आणि नैसर्गिक रंगाची सुसंगतता टिकवणे.',
          hi: 'बरसात के मौसम में सुखाने की समस्या और रंगों की एकरूपता बनाए रखना।',
          en: 'Drying bottlenecks during monsoon; batch-to-batch shade consistency with raw botanicals.'
        },
        first3Actions: {
          mr: [
            'सांगानेर/बगरू येथील अनुभवी कारागिरांशी संपर्क',
            'नैसर्गिक रंग बनवण्याचे प्रशिक्षण घेणे',
            'सोशल मीडिया व स्थानिक हस्तकला बाजारात नमुने प्रदर्शित करणे'
          ],
          hi: [
            'बगरू के मास्टर कारीगरों से संपर्क व मार्गदर्शन',
            'प्राकृतिक रंग बनाने की विधियों का मानकीकरण',
            'शहरी बुटीक और ऑनलाइन प्लेटफॉर्म पर सैंपल भेजना'
          ],
          en: [
            'Consult traditional master printers in Bagru and Sanganer',
            'Standardize botanical dye extraction recipes from pomegranate and turmeric',
            'Supply curated cotton stoles to urban eco-fashion boutiques and craft expos'
          ]
        }
      },
      {
        id: 'opp_mustard_oil_cold_expeller',
        name: 'Pure Mustard (Sarson) Kachi Ghani Cold-Pressed Oil',
        nameNative: {
          mr: 'शुद्ध मोहरी कच्चे घाणी तेल व पेंड युनिट',
          hi: 'शुद्ध सरसों कच्ची घानी तेल व खली निष्कर्षण इकाई',
          en: 'Kachi Ghani Cold-Pressed Mustard Oil & Feed Cake'
        },
        category: 'Agro & Edible Oil Processing',
        typicalInvestmentInr: 440000,
        minCapitalRequiredInr: 55000,
        valueAdditionPotential: 'HIGH',
        demandSignal: 'HIGH',
        supplyGap: 'MEDIUM',
        resourceRequirement: 'Jaipur district harvests abundant high-pungency mustard during Rabi season.',
        rationale: {
          mr: 'राजस्थान ही देशातील मोहरीची राजधानी आहे. भेसळयुक्त तेलाच्या काळात लाकडी किंवा कच्ची घाणीच्या शुद्ध मोहरीच्या तेलाला शहरात मोठा ग्राहकवर्ग आहे.',
          hi: 'राजस्थान भारत का सबसे बड़ा सरसों उत्पादक है। कच्ची घानी के तीखे शुद्ध सरसों तेल की स्थानीय रसोईयों में निरंतर मांग रहती है।',
          en: 'Rajasthan is India’s mustard hub. Cold-pressed virgin kachi-ghani mustard oil with natural pungency sells at 30% premium over refined supermarket oil.'
        },
        keyAssetsNeeded: ['लाकडी घाणा किंवा लहान कच्ची घाणी मशिन', 'ऑइल फिल्टर', 'काचेच्या बाटल्या/टिन', 'वजन काटा'],
        mainRisks: {
          mr: 'मोहरीच्या दाण्यातील ओलाव्यामुळे तेलाचा दर्जा खालावणे.',
          hi: 'कच्चे माल के भाव में उतार-चढ़ाव और तेल का तीखापन बनाए रखना।',
          en: 'Seed price fluctuations post-harvest and preserving natural allyl isothiocyanate pungency.'
        },
        first3Actions: {
          mr: [
            'जयपूर एपीएमसी मधून थेट उच्च प्रतीची मोहरी खरेदी',
            'FSSAI तेल परवाना घेणे',
            'स्थानिक सोसायट्यांमध्ये थेट शुद्ध तेलाचे प्रात्यक्षिक व विक्री'
          ],
          hi: [
            'कृषि मंडी से उच्च तेल प्रतिशत वाली सरसों की सीधी खरीद',
            'FSSAI खाद्य तेल लाइसेंस प्राप्त करना',
            'स्थानीय कालोनियों व किराना दुकानों में शुद्धता की गारंटी के साथ आपूर्ति'
          ],
          en: [
            'Procure high-oil-content mustard seed directly from Chomu / Jaipur mandi',
            'Set up hygienic stainless steel cold press unit with FSSAI license',
            'Establish refill-your-bottle eco station in residential colonies'
          ]
        }
      }
    ],
    exportableProducts: ['Block Printed Fabrics', 'Precious Gemstones', 'Blue Pottery', 'Handicraft Mojari Shoes'],
    prominentSkills: ['Hand block printing', 'Gemstone facet cutting', 'Ceramic blue glaze moulding', 'Kundan meenakari']
  },

  // 8. Kamrup (Assam, LGD: 287)
  287: {
    districtLgdCode: 287,
    districtName: 'Kamrup',
    stateLgdCode: 18,
    stateName: 'Assam',
    provenance: createProvenance(
      'DC-MSME District Industrial Profile of Kamrup',
      'https://www.dcmsme.gov.in/dips/DIPR_Kamrup.pdf',
      'DISTRICT',
      '2024-25',
      'HIGH',
      'Covers Guwahati, Hajo, Rangia blocks and Brahmaputra valley resource inventory.'
    ),
    majorResources: {
      agriculture: ['Assam CTC & Orthodox Tea', 'Ginger', 'Turmeric', 'Arecanut', 'Banana', 'Brahmaputra Fish'],
      livestock: ['Indigenous Cattle', 'Goats (Assam Hill)', 'Piggery', 'Ducks'],
      minerals: ['River Quartzite Sand', 'Granite'],
      forest: ['Bamboo (Bhaluka/Jati)', 'Cane (Rattan)', 'Teak', 'Medicinal Plants']
    },
    existingClusters: ['Bamboo & Cane Furniture Cluster', 'Assam Tea Blending & Packaging', 'Eri & Muga Silk Weaving (Sualkuchi)', 'Brass Metal Craft (Hajo)'],
    artisanClusters: ['Sualkuchi Silk Weaving (Golden Muga Silk GI)', 'Hajo Bell Metal Craft', 'Bamboo Utility Handicrafts'],
    serviceOpportunities: [
      'Bamboo furniture treating and chemical curing services',
      'Specialty tea direct packaging for tourists',
      'Eco-tourism river guide & homestay equipment rental',
      'Ginger and spice solar dehydration facility'
    ],
    potentialNewMsmes: [
      {
        id: 'opp_bamboo_utility_craft_furniture',
        name: 'Treated Bamboo Utility Products & Eco-Friendly Furniture',
        nameNative: {
          mr: 'बांबू प्रक्रिया, टिकाऊ फर्निचर व गृहपयोगी वस्तू उद्योग',
          hi: 'उपचारित बांस उत्पाद व पर्यावरण-अनुकूल फर्नीचर इकाई',
          en: 'Treated Bamboo Utility Goods & Eco-Friendly Furniture'
        },
        category: 'Handicrafts & Green Manufacturing',
        typicalInvestmentInr: 280000,
        minCapitalRequiredInr: 35000,
        valueAdditionPotential: 'VERY_HIGH',
        demandSignal: 'HIGH',
        supplyGap: 'HIGH',
        resourceRequirement: 'Kamrup district is surrounded by lush bamboo groves (Bhaluka, Jati varieties) ready for harvest with rapid regeneration.',
        rationale: {
          mr: 'आसाममध्ये बांबू मुबलक आहे. बोरिक-बोराक्स प्रक्रियेने बांबू कीड-मुक्त करून लहान स्टूल, लॅम्पशेड आणि बास्केट्स बनवल्यास पर्यटकांना व महानगरांना उत्तम भावाने विकता येतात.',
          hi: 'असम में बांस प्रचुर मात्रा में है। दीमक-रोधी उपचार करके आधुनिक बांस फर्नीचर, टोकरियां व सजावटी सामान बनाने से शहरों में भारी मांग मिलती है।',
          en: 'Assam produces superior bamboo. Chemical seasoning (boric-borax dip) prevents borer insects, allowing export of stylish knocked-down furniture.'
        },
        keyAssetsNeeded: ['बांबू कटिंग मशिन', 'स्प्लिटिंग व स्लाइसिंग टूल्स', 'रासायनिक प्रक्रिया टाकी', 'सँडिंग मशिन'],
        mainRisks: {
          mr: 'बांबूला योग्य रासायनिक प्रक्रिया न केल्यास भुंगा (Borer) लागण्याचा धोका.',
          hi: 'कीट-रोधी उपचार न करने पर दीमक लगने का जोखिम।',
          en: 'Powder-post beetle attacks if bamboo is not seasoned and cured properly.'
        },
        first3Actions: {
          mr: [
            'स्थानिक बांबू उत्पादक शेतकऱ्यांशी संपर्क',
            'आसाम बांबू विकास संस्थेकडून (ABDA) आधुनिक डिझाईन प्रशिक्षण',
            'गुवाहाटी हस्तकला दुकाने व ऑनलाइन प्लॅटफॉर्मवर नोंदणी'
          ],
          hi: [
            'बांस उत्पादक किसानों से कच्चा माल अनुबंध',
            'केन एंड बैम्बू टेक्नोलॉजी सेंटर (CBTC) से तकनीकी प्रशिक्षण',
            'होटलों, रिसॉर्ट्स व हस्तकला मेलों में उत्पादों का प्रदर्शन'
          ],
          en: [
            'Secure bamboo harvest quotas from village growers around Hajo and Rangia',
            'Complete bamboo seasoning protocol at Cane and Bamboo Technology Centre (CBTC)',
            'Display eco-friendly lampshades and lifestyle products in Guwahati airport and craft boutiques'
          ]
        }
      },
      {
        id: 'opp_assam_ginger_turmeric_dehydration',
        name: 'Assam Organic Ginger Flakes & Turmeric Powder Unit',
        nameNative: {
          mr: 'आसाम सेंद्रिय आले (सुंठ) व हळद प्रक्रिया युनिट',
          hi: 'असम जैविक अदरक (सोंठ) व हल्दी प्रसंस्करण इकाई',
          en: 'Assam Organic Ginger Flakes & Turmeric Processing'
        },
        category: 'Food Processing & Spices',
        typicalInvestmentInr: 340000,
        minCapitalRequiredInr: 45000,
        valueAdditionPotential: 'VERY_HIGH',
        demandSignal: 'HIGH',
        supplyGap: 'HIGH',
        resourceRequirement: 'High-pungency ginger (Nadia variety) and high-curcumin turmeric grown in Kamrup rural and Karbi Anglong borders.',
        rationale: {
          mr: 'आसामचे आले कमी फायबरचे आणि अत्यंत सुगंधी असते. आल्याचे काप करून सुकवल्यास (सुंठ) चहा व औषध कंपन्यांकडून वर्षभर नियमित मागणी मिळते.',
          hi: 'असम का अदरक अपने औषधीय गुणों और तीखेपन के लिए विख्यात है। इसे सुखाकर सोंठ पाउडर व फ्लेक्स बनाने से चाय और दवा कंपनियों को लाभकारी बिक्री होती है।',
          en: 'Assam ginger possesses high gingerol content. Slicing and solar dehydration into dry ginger (sonth) commands premium pharmaceutical and tea blend demand.'
        },
        keyAssetsNeeded: ['जिंजर वॉशर', 'स्लाइसर', 'सोलर टनेल ड्रायर', 'पल्व्हरायझर'],
        mainRisks: {
          mr: 'पावसाळ्यात सततच्या ओलसर हवेमुळे सुकवण्यास वेळ लागणे.',
          hi: 'अत्यधिक बारिश में धूप न मिलने से सुखाने में देरी।',
          en: 'High ambient humidity during monsoon necessitating hybrid solar-biomass dryers.'
        },
        first3Actions: {
          mr: [
            'स्थानिक शेतकऱ्यांशी थेट ताजे आले खरेदीचा करार',
            'सोलर ड्रायिंगचे स्वच्छता निकष पाळणे',
            'गुवाहाटी चहा लिलाव केंद्र आणि मसाला व्यापाऱ्यांना सॅम्पल देणे'
          ],
          hi: [
            'स्थानीय किसानों से सीधे ताजा अदरक खरीद',
            'हाईजीनिक सोलर ड्रायर की स्थापना',
            'गुवाहाटी मसाला मंडी व चाय कंपनियों को सैंपल भेजना'
          ],
          en: [
            'Procure Nadia ginger directly from farmer self-help groups in Kamrup rural',
            'Install covered solar tunnel dryer with exhaust fans',
            'Pitch premium dry ginger powder to tea packaging houses in Guwahati'
          ]
        }
      }
    ],
    exportableProducts: ['Orthodox Assam Tea', 'Muga Golden Silk', 'Bamboo Crafts', 'Ginger Flakes'],
    prominentSkills: ['Silk handloom weaving', 'Bamboo splitting & carving', 'Tea leaf processing', 'Bell metal shaping']
  }
};

export const getDistrictProfile = (districtLgdCode: number): DistrictIndustrialProfile | undefined => {
  return DISTRICT_INDUSTRIAL_PROFILES[districtLgdCode];
};

export const searchDistrictProfilesByName = (name: string): DistrictIndustrialProfile[] => {
  const q = name.toLowerCase().trim();
  return Object.values(DISTRICT_INDUSTRIAL_PROFILES).filter(
    (p) => p.districtName.toLowerCase().includes(q) || p.stateName.toLowerCase().includes(q)
  );
};
