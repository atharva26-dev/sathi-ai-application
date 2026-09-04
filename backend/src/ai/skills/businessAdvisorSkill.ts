import { SkillHandler, SkillExecutionResult, getLocalized } from './skillTypes.js';
import { AssembledBusinessContext } from '../context/contextEngine.js';
import { SupportedLanguage } from '../../config/constants.js';
import { discoverBusinessOpportunities } from '../../domain/businesses/ideaGenerator.js';
import { opportunityEngine } from '../../domain/opportunities/opportunityEngine.js';
import { getRuralBusinessModel } from '../knowledge/ruralKnowledgeBase.js';
import { formatIndianRupees } from '../../utils/money.js';

export class BusinessAdvisorSkill implements SkillHandler {
  public canHandle(query: string, context: AssembledBusinessContext): boolean {
    const q = query.toLowerCase();
    return (
      q.includes('कसा सुरू करू') ||
      q.includes('सुरू कसा करावा') ||
      q.includes('how to start') ||
      q.includes('how do i start') ||
      q.includes('start a business') ||
      q.includes('शुरू कैसे करें') ||
      q.includes('कोणता व्यवसाय') ||
      q.includes('which business') ||
      q.includes('what other business') ||
      q.includes('suggest alternatives') ||
      q.includes('business idea') ||
      q.includes('योग्य आहे का') ||
      q.includes('सल्ला') ||
      q.includes('i want to start') ||
      q.includes('मला सुरू करायचे आहे') ||
      q.includes('मला बदलायचा आहे') ||
      q.includes('don’t know') ||
      q.includes("don't know") ||
      q.includes('समजत नाही') ||
      q.includes('नहीं पता') ||
      q.includes('credit') ||
      q.includes('udhaari') ||
      q.includes('उधारी') ||
      q.includes('cheaper') ||
      q.includes('स्वस्त') ||
      q.includes('सस्ता') ||
      q.includes('enough customers') ||
      q.includes('competitor') ||
      q.includes('स्पर्धक') ||
      q.includes('expand') ||
      q.includes('विस्तार') ||
      q.includes('माझ्या गावात') ||
      q.includes('गावात कोणता') ||
      q.includes('गावात') ||
      q.includes('गाव') ||
      q.includes('गांव') ||
      q.includes('मेरे गांव') ||
      q.includes('village') ||
      q.includes('find business') ||
      q.includes('find the right business') ||
      q.includes('right business for me') ||
      q.includes('what business should i start') ||
      q.includes('काय करू') ||
      q.includes('काय सुरू करू')
    );
  }

  public async execute(
    query: string,
    language: SupportedLanguage,
    context: AssembledBusinessContext
  ): Promise<SkillExecutionResult> {
    const q = query.toLowerCase();
    const cap = context.financialBaseline.ownCapital;
    const loc = context.locationCluster;
    const arch = context.businessArchetype;
    const userBiz = context.profile.desiredBusiness || getLocalized(arch.titleNative, language);

    // CASE 1: UNKNOWN BUSINESS / OPPORTUNITY DISCOVERY ("Which business should I start?")
    const isUnknownBizQuery =
      q.includes("don't know") ||
      q.includes('dont know') ||
      q.includes('समजत नाही') ||
      q.includes('नहीं पता') ||
      q.includes('what business is best for me') ||
      q.includes('what business should i start') ||
      q.includes('which business should i start') ||
      q.includes('which business is good') ||
      q.includes('कोणता व्यवसाय सुरू करावा') ||
      q.includes('कोणता व्यवसाय करावा') ||
      q.includes('कोणता व्यवसाय चांगला') ||
      q.includes('माझ्या गावात कोणता व्यवसाय') ||
      q.includes('गावात कोणता व्यवसाय') ||
      q.includes('मेरे गांव में कौन सा व्यवसाय') ||
      q.includes('गांव में कौन सा व्यवसाय') ||
      q.includes('कौन सा बिजनेस सही रहेगा') ||
      q.includes('कौन सा व्यापार शुरू करें') ||
      q.includes('find the right business') ||
      q.includes('find business for me') ||
      q.includes('find business') ||
      q.includes('suggest business');

    if (isUnknownBizQuery && !q.includes('how to start')) {
      const isMentorClarification =
        q.includes("don't know what business") ||
        q.includes("dont know what business") ||
        q.includes("समजत नाही") ||
        q.includes("नहीं पता");

      if (isMentorClarification) {
        let answer = '';
        if (language === 'mr') {
          answer = `## 🧭 योग्य व्यवसाय निवडण्यासाठी ३ महत्त्वाचे प्रश्न\n\nस्थानिक पातळीवर अंधारात अंदाज बांधण्याऐवजी योग्य व्यवसाय निवडण्यासाठी कृपया खालील ३ गोष्टी सांगा:\n\n1. **स्वतःचे भांडवल (Available Capital):** तुम्ही स्वतः किती रक्कम (उदा. ₹५०,००० ते ₹२ लाख) गुंतवू शकता आणि किती खेळते भांडवल राखीव ठेवू शकता?\n2. **जागा/शेड (Workplace / Premises):** स्वतःचे मोकळे घर, शेड, गावातील मुख्य रस्त्यावरील गाळा किंवा शेती आहे का?\n3. **कौशल्य व आवड (Core Skills & Interests):** तुम्हाला कशाचा पूर्वअनुभव आहे (उदा. यंत्रे दुरुस्ती, शेती, दुग्ध प्रक्रिया, विक्री किंवा सेवा)?\n\nया माहितीच्या आधारे आपण तुमच्या परिसरासाठी सर्वात सुरक्षित व्यवसाय मॉडेल निश्चित करू.`;
        } else if (language === 'hi') {
          answer = `## 🧭 सही व्यवसाय चुनने के लिए ३ महत्वपूर्ण प्रश्न\n\nबिना आधार के अनुमान लगाने के बजाय सुरक्षित व्यवसाय चुनने के लिए कृपया बताएं:\n\n1. **स्वतःचे भांडवल / Available Capital:** आप सुरक्षित रूप से कितना पैसा लगा सकते हैं?\n2. **जागा/शेड / Workplace / Premises:** क्या आपके पास अपनी जगह, शेड या दुकान है?\n3. **कौशल्य व आवड / Core Skills & Interests:** आपके पास कौन सा अनुभव या कौशल है?`;
        } else {
          answer = `## 🧭 Business Discovery & Mentoring Framework\n\nInstead of guessing, let's identify the most profitable business based on your strengths and ground reality. Please clarify:\n\n1. **Available Capital:** How much liquid capital do you have to safely invest?\n2. **Workplace / Premises:** Do you own a shed, roadside shop, commercial room, or farmland?\n3. **Core Skills & Interests:** What prior work experience, technical repair skills, or local trade network do you possess?`;
        }

        return {
          answer,
          summary: language === 'mr' ? 'व्यवसाय निवडीसाठी ३ महत्त्वाचे प्रश्न' : '3 Clarifying questions to select the right business',
          voiceSpokenText: language === 'mr' ? 'नवीन व्यवसाय ठरवण्यासाठी स्वतःचे भांडवल, जागा आणि कौशल्य याबद्दल माहिती द्या.' : 'Please answer the three clarifying questions on capital, premises, and skills.',
          cards: [
            {
              type: 'CLARIFYING_QUESTIONS',
              title: language === 'mr' ? '३ महत्त्वाचे घटक' : '3 Key Mentoring Questions',
              data: { questions: ['Available Capital', 'Workplace / Premises', 'Core Skills & Interests'] }
            }
          ],
          recommendations: [
            'नवीन व्यवसाय निवडण्यापूर्वी स्वतःचे सुरक्षित भांडवल आणि जागा तपासा.',
            'अनोळखी व्यवसायात लगेच कर्ज काढून उडी घेऊ नका.'
          ],
          risks: ['अंदाजावर आधारित व्यवसाय सुरू केल्यास सुरुवातीला नुकसान होण्याचा धोका.'],
          assumptions: [`परिसर: ${loc}`, `भांडवल: ₹${cap.toLocaleString('en-IN')}`],
          sources: [{ title: 'SAATHI Rural Mentoring Framework', isOfficial: true }],
          suggestedNextQuestions: [
            'माझ्याकडे १ लाख रुपये भांडवल आहे',
            'माझ्याकडे स्वतःची शेड उपलब्ध आहे',
            'माझ्या गावातील बाजारपेठ कशी तपासावी?'
          ],
          trustLevel: 'FACT',
          confidenceScore: 95,
          skillName: 'BUSINESS_ADVISOR'
        };
      }

      const oppResult = opportunityEngine.discoverOpportunities({
        location: loc,
        availableCapital: cap
      });

      if (oppResult.success && oppResult.opportunities && oppResult.opportunities.length > 0) {
        const topOpp = oppResult.opportunities[0];
        const altOpps = oppResult.opportunities.slice(1, 3);
        const granText =
          topOpp.dataGranularity === 'Village'
            ? language === 'mr' ? 'गाव पातळी' : language === 'hi' ? 'ग्राम स्तर' : 'Village level'
            : topOpp.dataGranularity === 'Taluka'
            ? language === 'mr' ? 'तालुका पातळी' : language === 'hi' ? 'तालुका स्तर' : 'Taluka level'
            : language === 'mr' ? 'जिल्हा पातळी' : language === 'hi' ? 'जिला स्तर' : 'District level';

        const langKey: 'mr' | 'hi' | 'en' = (language === 'mr' || language === 'hi' || language === 'en') ? language : 'en';
        const whyText = topOpp.whySaathiIdentifiedThis[langKey]?.join('\n• ') || topOpp.whySaathiIdentifiedThis.en?.join('\n• ') || 'स्थानिक मागणी व कच्चा माल उपलब्धता';
        const evidenceText = topOpp.evidencePackage.map((e) => e.finding).slice(0, 2).join('; ');
        const gapText = topOpp.marketGap[langKey] || topOpp.marketGap.en;
        const compStatement = topOpp.competitionAnalysis.statement;
        const capitalText = `₹${topOpp.estimatedStartingCapitalInr.toLocaleString('en-IN')}`;
        const returnText = `अंदाजित निव्वळ नफा: ₹${topOpp.estimatedMonthlySurplus.toLocaleString('en-IN')}/महिना`;

        let answer = '';
        if (language === 'mr') {
          answer = `## Short Answer
तुमच्याकडे उपलब्ध ₹${cap.toLocaleString('en-IN')} भांडवल आणि **${loc}** परिसरातील आर्थिक स्त्रोत पाहता, सर्वात योग्य व व्यवहार्य संधी **'${topOpp.title}'** ही आहे.

## Why This May Work Here (स्थानिक पुरावा)
• ${whyText}
• **स्थानिक स्त्रोत पुरावा:** ${evidenceText}
• **बाजार पोकळी (Market Gap):** ${gapText}

## Local Market & Opportunity Score
• **संधी स्कोअर:** ${topOpp.opportunityScore}/१०० (${topOpp.confidence} खात्री पातळी)
• **माहिती स्तर:** ${granText} (अधिकृत DC-MSME, कृषी व उद्योग आधार डेटावर आधारित)

## Customers & Competition Reality
• **लक्षित ग्राहक:** स्थानिक नागरिक, परिसरातील आठवडी बाजार आणि किरकोळ व्यावसायिक.
• **स्पर्धा वास्तव:** ${compStatement}

## Starting Cost & Working Capital
• **भांडवल मर्यादा:** ${capitalText} (एकूण प्रकल्प: ₹${topOpp.typicalProjectCostInr.toLocaleString('en-IN')})
• **खेळते भांडवल नियम:** एकूण भांडवलातील ३०% ते ४०% रक्कम रोजच्या चालू खर्चासाठी व माल खरेदीसाठी रोख ठेवा.

## Main Risks & Warnings
• अनियंत्रित उधारीमुळे खेळते भांडवल अडकण्याचा मुख्य धोका.
• हंगामी चढ-उतार व वीज/वाहतूक समस्यांवर आगाऊ नियोजन आवश्यक.

## Practical Validation & Next 3 Steps (पहिली ३० दिवसांची कृती)
१. गावातील ५ संभाव्य ग्राहकांशी प्रत्यक्ष चर्चा करून त्यांच्या चालू अडचणी व अपेक्षित दर समजून घ्या.
२. आवश्यक कच्चा माल आणि साधनांचे स्थानिक जीएसटी कोटेशन मिळवा.
३. मोठा खर्च करण्यापूर्वी छोट्या प्रमाणावर प्रायोगिक तत्त्वावर विक्री करून नफा तपासा.

## Alternative Options (इतर पर्याय)
${altOpps.map((o) => `• **${o.title}** (स्कोअर: ${o.opportunityScore}/१०० | भांडवल: ₹${o.estimatedStartingCapitalInr.toLocaleString('en-IN')})`).join('\n')}`;
        } else if (language === 'hi') {
          answer = `## Short Answer
आपकी उपलब्ध ₹${cap.toLocaleString('en-IN')} की पूंजी और **${loc}** के स्थानीय संसाधनों के आधार पर, सबसे उपयुक्त अवसर **'${topOpp.title}'** है।

## Why This May Work Here (स्थानीय प्रमाण)
• ${whyText}
• **स्थानीय संसाधन प्रमाण:** ${evidenceText}
• **बाजार अंतर (Market Gap):** ${gapText}

## Local Market & Opportunity Score
• **अवसर स्कोर:** ${topOpp.opportunityScore}/१०० (${topOpp.confidence} विश्वसनीयता)
• **डेटा स्तर:** ${granText} (आधिकारिक DC-MSME, कृषि व उद्यम आधार डेटा पर आधारित)

## Customers & Competition Reality
• **लक्षित ग्राहक:** स्थानीय नागरिक, साप्ताहिक हाट और आसपास के खुदरा व्यापारी।
• **प्रतिस्पर्धा स्थिति:** ${compStatement}

## Starting Cost & Working Capital
• **निवेश सीमा:** ${capitalText} (कुल प्रोजेक्ट: ₹${topOpp.typicalProjectCostInr.toLocaleString('en-IN')})
• **कार्यशील पूंजी नियम:** पूंजी का ३०% से ४०% हिस्सा दैनिक खर्च और माल खरीदने हेतु नकद रखें।

## Main Risks & Warnings
• अनियंत्रित उधारी से पूंजी फंसने का सबसे बड़ा जोखिम।
• मौसमी उतार-चढ़ाव और आपूर्ति व्यवधानों से बचाव जरूरी।

## Practical Validation & Next 3 Steps (पहले ३० दिन की कार्ययोजना)
१. ५ संभावित ग्राहकों से मिलकर उनकी मौजूदा जरूरतें और मौजूदा कीमतें समझें।
२. आवश्यक कच्चे माल और उपकरणों के पक्के स्थानीय कोटेशन प्राप्त करें।
३. बड़ा निवेश करने से पहले छोटे स्तर पर पायलट बनाकर वास्तविक नकद बिक्री जांचें।

## Alternative Options (वैकल्पिक अवसर)
${altOpps.map((o) => `• **${o.title}** (स्कोर: ${o.opportunityScore}/१०० | निवेश: ₹${o.estimatedStartingCapitalInr.toLocaleString('en-IN')})`).join('\n')}`;
        } else {
          answer = `## Short Answer
Based on your available capital of ₹${cap.toLocaleString('en-IN')} and verified local economic indicators in **${loc}**, the highest-ranked opportunity is **'${topOpp.title}'**.

## Why This May Work Here (Local Evidence)
• ${whyText}
• **Local Evidence:** ${evidenceText}
• **Market Gap Type:** ${gapText}

## Local Market & Opportunity Score
• **Opportunity Score:** ${topOpp.opportunityScore}/100 (${topOpp.confidence} confidence)
• **Data Granularity:** ${granText} (Based on official DC-MSME & Udyam datasets)

## Customers & Competition Reality
• **Target Customers:** Local households, weekly rural haats, and commercial retailers.
• **Competition Reality:** ${compStatement}

## Starting Cost & Working Capital
• **Investment Range:** ${capitalText} (Typical Project: ₹${topOpp.typicalProjectCostInr.toLocaleString('en-IN')})
• **Working Capital Rule:** Maintain 30-40% of funds as liquid cash buffer for receivables and daily stock.

## Main Risks & Warnings
• Risk of working capital lock-up if customer credit (udhaari) is not strictly capped below 10%.
• Seasonal price fluctuations and power/transportation disruptions.

## Practical Validation & Next 3 Steps (First 30 Days Action Plan)
1. Interview 5 potential customers in ${loc} to confirm willingness to pay cash.
2. Obtain verified price quotes for raw materials and packaging.
3. Test a micro-scale pilot before committing to major equipment or bank borrowing.

## Alternative Options
${altOpps.map((o) => `• **${o.title}** (Score: ${o.opportunityScore}/100 | Investment: ₹${o.estimatedStartingCapitalInr.toLocaleString('en-IN')})`).join('\n')}`;
        }

        return {
          answer,
          summary: `संधी विश्लेषण (${loc}): ${topOpp.title} — स्कोअर ${topOpp.opportunityScore}/१००`,
          voiceSpokenText:
            language === 'en'
              ? `Based on ₹${cap.toLocaleString('en-IN')} capital in ${loc}, the best opportunity is ${topOpp.title}. I recommend validating with 5 customers before investing.`
              : language === 'hi'
              ? `₹${cap.toLocaleString('en-IN')} पूंजी के साथ ${loc} में सबसे अच्छा अवसर ${topOpp.title} है। ५ ग्राहकों से बात करके शुरुआत करें।`
              : `₹${cap.toLocaleString('en-IN')} भांडवलासह ${loc} परिसरासाठी सर्वात योग्य व्यवसाय ${topOpp.title} आहे. ५ ग्राहकांशी चर्चा करून चाचणी सुरू करा.`,
          cards: [
            {
              type: 'BUSINESS_FEASIBILITY',
              title: `🎯 ${topOpp.title}`,
              subtitle: `स्कोअर: ${topOpp.opportunityScore}/१०० (${topOpp.confidence}) | ${granText}`,
              data: {
                investment: capitalText,
                estimatedReturn: returnText,
                payback: `${topOpp.paybackMonths} महिने`,
                marketGap: gapText
              },
              actionText: 'संधी तपशील पाहा',
              actionRoute: '/find-business'
            }
          ],
          recommendations: [
            'इतरांचे पाहून व्यवसाय निवडू नका; स्थानिक पुरावा आणि स्वतःचे भांडवल तपासा.',
            'सुरुवातीला ३०-४०% रक्कम रोख खेळत्या भांडवलासाठी बाजूला ठेवा.'
          ],
          risks: ['अनोंदणीकृत स्थानिक स्पर्धकांची माहिती न घेता दुकान थाटल्यास अडचण येण्याचा धोका.'],
          assumptions: [`परिसर: ${loc}`, `भांडवल: ₹${cap.toLocaleString('en-IN')}`],
          sources: [{ title: 'SAATHI Data-Driven Opportunity Engine', isOfficial: true }],
          suggestedNextQuestions: [
            'या व्यवसायासाठी दर कसा ठरवावा?',
            'माझा मासिक हप्ता (EMI) किती असेल?',
            'ग्राहकांना उधारी किती द्यावी?'
          ],
          trustLevel: 'FACT',
          confidenceScore: 95,
          skillName: 'BUSINESS_ADVISOR'
        };
      }

      // Fallback if no specific opportunities found (e.g. unknown location)
      const mentorText =
        language === 'en'
          ? `## Short Answer
Choosing the right business requires matching your capital, location, and daily skills — not guessing blindly.

## What this means for you
Instead of jumping into a business without planning, let's identify what will truly work in ${loc}.

## Clarifying Questions (Please share 3 quick details):
1. **Available Capital:** How much money (₹) can you comfortably invest without borrowing?
2. **Workplace / Premises:** Do you have your own open space, shop, farm, or will you rent?
3. **Core Skills & Interests:** Do you prefer technical repairs, retail sales, animal husbandry, cooking/food, or crafting?

## What I recommend
Once you reply with these 3 details, I will give you a shortlist of the 2-3 most viable local businesses with full profit models.`
          : language === 'hi'
          ? `## Short Answer
सही व्यवसाय चुनने के लिए आपकी पूंजी, स्थान और अनुभव का मिलान होना आवश्यक है, न कि जल्दबाजी में निर्णय लेना।

## What this means for you
${loc} में सफल होने के लिए हमें आपकी क्षमता के अनुसार सही व्यवसाय चुनना होगा।

## कृपया ये ३ मुख्य बातें बताएं:
1. **उपलब्ध पूंजी:** आप बिना किसी कर्ज के कितनी राशि (₹) स्वयं लगा सकते हैं?
2. **स्थान / दुकान:** क्या आपके पास अपनी दुकान, शेड, घर की जगह है या किराया देना होगा?
3. **कौशल व अनुभव:** आपको रिपेयरिंग, दुकानदारी, पशुपालन, सिलाई या सेवा क्षेत्र में से किसमें रुचि है?

## What I recommend
इन ३ बातों के आधार पर मैं आपके लिए सबसे उपयुक्त और लाभदायक २-३ व्यवसायों की पूरी योजना तैयार करूँगा।`
          : `## Short Answer
योग्य व्यवसाय निवडण्यासाठी तुमचे भांडवल, परिसर आणि आवड यांचा मेळ बसणे गरजेचे आहे.

## What this means for you
${loc} परिसरात कोणताही व्यवसाय सुरू करण्यापूर्वी तो तुमच्या क्षमतेत बसणारा असणे महत्त्वाचे आहे.

## कृपया मला फक्त ३ गोष्टी सांगा:
१. **स्वतःचे भांडवल:** तुम्ही स्वतः किती रक्कम (₹) गुंतवू शकता?
२. **जागा/शेड:** तुमच्याकडे स्वतःची मोकळी जागा, दुकान आहे की भाड्याने घ्यावे लागेल?
३. **कौशल्य व आवड:** तुम्हाला दुरुस्ती (Technical), दुकानदारी (Retail), शेतीपूरक/पशुपालन, सिलाई की खाद्यपदार्थ यामध्ये रस आहे?

## What I recommend
या ३ प्रश्नांची उत्तरे दिल्यावर मी तुमच्यासाठी सर्वात योग्य २-३ व्यवसायांचा नफा व भांडवल आराखडा तयार करून देईन.`;

      return {
        answer: mentorText,
        summary: `मार्गदर्शन: व्यवसाय निवडीसाठी ३ सोपे प्रश्न`,
        voiceSpokenText:
          language === 'en'
            ? 'To recommend the best business, please tell me your available budget, available space, and your skills.'
            : language === 'hi'
            ? 'सही व्यापार चुनने के लिए कृपया अपना बजट, उपलब्ध जगह और अपनी रुचि बताएं।'
            : 'योग्य व्यवसाय निवडण्यासाठी कृपया तुमचे उपलब्ध भांडवल, जागा आणि तुमची आवड मला सांगा.',
        cards: [
          {
            type: 'MENTOR_ASSESSMENT',
            title: `🎯 व्यवसाय निवड मार्गदर्शन (Business Assessment)`,
            subtitle: `परिसर: ${loc}`,
            data: {
              step1: '१. उपलब्ध भांडवल सांगा',
              step2: '२. उपलब्ध जागा/दुकान सांगा',
              step3: '३. तुमची आवड/अनुभव सांगा'
            },
            actionText: 'माहिती सांगा',
            actionRoute: '/talk-saathi'
          }
        ],
        recommendations: [
          'इतरांचे पाहून व्यवसाय सुरू करू नका; स्थानिक मागणी व स्वतःचे कौशल्य तपासा.',
          'सुरुवातीला कमी भांडवलात सुरू होणारा व्यवसाय निवडा.'
        ],
        risks: ['अपूर्ण माहितीच्या आधारे व्यवसाय निवडल्यास भांडवल अडकण्याचा धोका.'],
        assumptions: [`परिसर: ${loc}`],
        sources: [{ title: 'SAATHI Rural Mentorship Council', isOfficial: true }],
        suggestedNextQuestions: [
          'माझ्याकडे ५० हजार रुपये आहेत आणि स्वतःची जागा आहे',
          'माझ्याकडे २ लाख रुपये आहेत',
          'मला रिपेअरिंग किंवा तांत्रिक कामात आवड आहे'
        ],
        trustLevel: 'FACT',
        confidenceScore: 98,
        skillName: 'BUSINESS_ADVISOR'
      };
    }

    // CASE 2: CREDIT SALES (UDHAARI) DISCIPLINE
    const isCreditQuery = q.includes('credit') || q.includes('udhaari') || q.includes('उधारी') || q.includes('उधार');
    if (isCreditQuery) {
      const creditText =
        language === 'en'
          ? `## Short Answer
Strictly control customer credit (udhaari). Uncontrolled credit is the #1 reason rural micro-enterprises run out of cash.

## What this means for you
For your **'${userBiz}'** in ${loc}, working capital must remain in cash to buy spares/materials and pay daily expenses.

## Numbers & Rules
- **Maximum Credit Limit:** Keep total unpaid credit below **10% of monthly sales**.
- **Cash Incentive:** Offer a 2-3% immediate discount or a free add-on for 100% upfront cash payment.
- **New Customers:** Strictly zero credit for the first 3 transactions until trust is established.

## Risks
- Giving credit to relatives or acquaintances without a fixed repayment date leads to permanent capital lockup.

## What I recommend
Use a clear digital or physical ledger. Set a polite board in your shop: *"Cash transactions allow us to give you the lowest prices and best quality."*

## Next 3 Steps
1. Set a personal rule: No credit on high-cost spare parts or raw materials.
2. Politely inform frequent buyers of a strict 7-day payment cycle.
3. Keep business cash strictly separated from personal household expenses.`
          : language === 'hi'
          ? `## Short Answer
उधारी (Credit) पर सख्त नियंत्रण रखें। अनियंत्रित उधारी ग्रामीण व्यवसायों के बंद होने का सबसे बड़ा कारण है।

## What this means for you
${loc} में आपके **'${userBiz}'** के लिए कार्यशील पूंजी (रोजमर्रा का खर्च चलाने) और सामग्री खरीदने के लिए नकद होना आवश्यक है।

## मुख्य नियम व आंकड़े
- **उधारी की सीमा:** कुल मासिक बिक्री के **१०% से अधिक उधारी न होने दें**।
- **नकद पर छूट:** तुरंत नकद भुगतान करने वाले ग्राहकों को २-३% छोटी छूट या अतिरिक्त सेवा दें।
- **नए ग्राहक:** नए ग्राहकों को पहली ३ बार केवल नकद में ही सेवा दें।

## जोखिम
- बिना निश्चित तारीख के दी गई उधारी डूबने का खतरा रहता है।

## What I recommend
दुकान में विनम्र संदेश लगाएं: *"नकद व्यवहार से हम आपको सबसे कम दाम और सर्वोत्तम गुणवत्ता दे पाते हैं।"*

## Next 3 Steps
1. महंगे पार्ट्स या सामग्री पर कभी उधारी न दें।
2. उधारी के लिए अधिकतम ७ दिनों की समय सीमा तय करें।
3. व्यवसाय का गल्ला और घर का खर्च अलग रखें।`
          : `## Short Answer
उधारीवर (Credit) कडक नियंत्रण ठेवा. अनियंत्रित उधारी हे ग्रामीण भागातील छोटे व्यवसाय अडचणीत येण्याचे सर्वात मोठे कारण आहे.

## What this means for you
${loc} परिसरातील तुमच्या **'${userBiz}'** व्यवसायासाठी कच्चा माल खरेदी आणि रोजचा खर्च चालवण्यासाठी हातात रोख रक्कम असणे आवश्यक आहे.

## उधारी नियंत्रणाचे ३ सुवर्ण नियम
- **कमाल मर्यादा:** एकूण मासिक विक्रीच्या **१०% पेक्षा जास्त उधारी कधीही अडकू देऊ नका**.
- **रोख सवलत:** पूर्ण रोख पैसे देणाऱ्या ग्राहकांना तात्काळ २-३% सवलत किंवा मोफत छोटी सेवा द्या.
- **नवीन ग्राहक:** नवीन किंवा अनोळखी ग्राहकांना सुरुवातीला १००% रोखीनेच व्यवहार करा.

## मुख्य जोखीम
- ओळखीच्या किंवा नातेवाईकांच्या दबावात येऊन उधारी दिल्यास खेळते भांडवल कायमचे अडकण्याचा धोका.

## What I recommend
दुकानात किंवा कामाच्या ठिकाणी नम्र पाटी लावा: *"रोख व्यवहारामुळेच आम्ही आपल्याला सर्वात कमी दरात व खात्रीशीर दर्जा देऊ शकतो."*

## Next 3 Steps
१. महागड्या स्पेअर पार्ट्सवर उधारी पूर्णपणे बंद करा.
२. जुन्या उधारीची वसुली करण्यासाठी दर रविवारी विनम्र व्हॉट्सॲप स्मरणपत्र पाठवा.
३. दुकानाचा गल्ला आणि घरचा खर्च पूर्णपणे वेगळा ठेवा.`;

      return {
        answer: creditText,
        summary: `उधारी नियंत्रण धोरण (${userBiz}): कमाल १०% उधारी + रोख खरेदीवर सवलत`,
        voiceSpokenText:
          language === 'en'
            ? 'Strictly limit customer credit below 10 percent of monthly sales to protect your working capital.'
            : language === 'hi'
            ? 'कार्यशील पूंजी बचाने के लिए उधारी को मासिक बिक्री के १० प्रतिशत से कम रखें।'
            : 'खेळते भांडवल सुरक्षित ठेवण्यासाठी उधारी एकूण विक्रीच्या १० टक्क्यांपेक्षा जास्त होऊ देऊ नका.',
        cards: [
          {
            type: 'RISK_ALERT',
            title: `🛡️ उधारी नियंत्रण धोरण — ${userBiz}`,
            subtitle: `कमाल उधारी मर्यादा: १०%`,
            data: {
              cashDiscount: '२-३% रोख सवलत',
              maxCreditTerm: '७ दिवस कमाल मुदत',
              newCustomerRule: 'केवळ रोख व्यवहार (Cash Only)'
            },
            actionText: 'खेळते भांडवल तपासा',
            actionRoute: '/working-capital'
          }
        ],
        recommendations: [
          'उधारीवर कडक मर्यादा ठेवा; नातेसंबंध आणि व्यावसायिक व्यवहार वेगळे ठेवा.',
          'ग्राहकांना रोखीने खरेदी करण्यास प्रवृत्त करण्यासाठी जलद सेवा द्या.'
        ],
        risks: ['अतिउधारीमुळे नवीन कच्चा माल आणण्यासाठी पैसे न उरणे.'],
        assumptions: [`सक्रिय व्यवसाय: ${userBiz}`, `परिसर: ${loc}`],
        sources: [{ title: 'SAATHI Credit & Liquidity Engine', isOfficial: true }],
        suggestedNextQuestions: [
          'खेळते भांडवल किती ठेवावे?',
          'माझा मासिक हप्ता (EMI) किती असेल?',
          'ग्राहकांना रोख आकर्षित कसे करावे?'
        ],
        trustLevel: 'FACT',
        confidenceScore: 96,
        skillName: 'BUSINESS_ADVISOR'
      };
    }

    // CASE 3: COMPETITOR PRICE WARS (SELLING CHEAPER)
    const isPriceWarQuery = q.includes('cheaper') || q.includes('स्वस्त') || q.includes('सस्ता');
    if (isPriceWarQuery) {
      const priceWarText =
        language === 'en'
          ? `## Short Answer
Do not blindly cut your prices to match a cheaper competitor. Compete on speed, genuine quality, and trust.

## What this means for you
In ${loc}, customers will pay a fair price for **'${userBiz}'** if they know your work lasts longer and you solve their problem faster.

## Opportunity
- Cheaper competitors often use low-grade duplicate parts or rush jobs, leading to high failure rates.
- You can position your enterprise as the *reliable, guaranteed solution*.

## What I recommend
1. **Offer a 30-Day Service Warranty:** Guarantee your work. Cheaper competitors rarely give written assurances.
2. **Transparent Breakdown:** Explain why your price is fair (genuine parts + skilled labor).
3. **Speed & Doorstep Convenience:** Complete jobs within 2 hours or offer pickup/drop.

## Next 3 Steps
1. Never reduce prices below your variable cost + fair wage.
2. Introduce a "Reliability Guarantee Card" for every customer.
3. Ask satisfied customers to post a review or recommend you in village WhatsApp groups.`
          : language === 'hi'
          ? `## Short Answer
प्रतिस्पर्धी की देखा-देखी अपने दाम कम न करें। गुणवत्ता, त्वरित सेवा और गारंटी के दम पर मुकाबला करें।

## What this means for you
${loc} में ग्राहक आपके **'${userBiz}'** के लिए उचित मूल्य देंगे यदि उन्हें विश्वास हो कि आपका काम टिकाऊ है।

## अवसर
- सस्ते प्रतियोगी अक्सर घटिया सामान इस्तेमाल करते हैं। आप विश्वसनीयता से बढ़त बना सकते हैं।

## What I recommend
1. **३० दिन की वारंटी दें:** अपने काम पर लिखित भरोसा दें।
2. **पारदर्शिता:** ग्राहक को समझाएं कि आप असली और टिकाऊ सामग्री लगा रहे हैं।
3. **समय पर सेवा:** काम जल्दी पूरा करके दें।

## Next 3 Steps
1. लागत से कम कीमत पर कभी काम न करें।
2. हर ग्राहक को सर्विस गारंटी पर्ची दें।
3. संतुष्ट ग्राहकों से अन्य लोगों को सिफारिश करने का आग्रह करें।`
          : `## Short Answer
स्पर्धकाने दर कमी केले म्हणून स्वतःचे दर तोट्यात आणू नका. गुणवत्ता, जलद सेवा आणि विश्वासाच्या जोरावर स्पर्धा करा.

## What this means for you
${loc} परिसरातील ग्राहक तुमच्या **'${userBiz}'** साठी योग्य दर देतील, जर त्यांना खात्री असेल की तुमचे काम टिकाऊ आहे.

## संधी
- स्वस्त सेवा देणारे स्पर्धक अनेकदा निकृष्ट किंवा डुप्लिकेट माल वापरतात. तुम्ही 'विश्वासू व खात्रीशीर कारागीर' म्हणून नाव कमवा.

## What I recommend
१. **३० दिवसांची लेखी वॉरंटी द्या:** कामाची खात्री दिल्यास ग्राहक आनंदाने योग्य दर देतात.
२. **पारदर्शक माहिती:** ग्राहकाला स्पष्ट सांगा की आपण ओरिजिनल सुटे भाग वापरत आहोत.
३. **घरपोच/जलद सेवा:** काम ठरलेल्या वेळेत पूर्ण करून द्या.

## Next 3 Steps
१. खर्चापेक्षा कमी दरात काम कधीही करू नका.
२. प्रत्येक कामासोबत 'सर्व्हिस कार्ड' द्या.
३. समाधानी ग्राहकांच्या प्रतिक्रिया गावच्या व्हॉट्सॲप ग्रुप्सवर शेअर करा.`;

      return {
        answer: priceWarText,
        summary: `दर स्पर्धा धोरण (${userBiz}): दर कमी न करता ३० दिवसांची वॉरंटी व दर्जेदार सेवा द्या`,
        voiceSpokenText:
          language === 'en'
            ? 'Do not reduce prices into a loss. Win customers with genuine quality and a 30-day service warranty.'
            : language === 'hi'
            ? 'दाम कम करके नुकसान न उठाएं। गुणवत्ता और ३० दिन की वारंटी देकर ग्राहकों का विश्वास जीतें।'
            : 'दरात तोटा सहन करू नका. दर्जेदार सुटे भाग आणि ३० दिवसांची वॉरंटी देऊन ग्राहकांचा विश्वास मिळवा.',
        cards: [
          {
            type: 'MARKETING_PLAYBOOK',
            title: `💎 मूल्य व गुणवत्ता धोरण — ${userBiz}`,
            subtitle: `स्पर्धेवर मात करण्याचे सूत्र`,
            data: {
              strategy: '३० दिवसांची सर्व्हिस वॉरंटी',
              differentiation: '१००% ओरिजिनल स्पेअर पार्ट्स',
              serviceSpeed: 'जलद पूर्तता (Same Day Delivery)'
            },
            actionText: 'दर धोरण तपासा',
            actionRoute: '/pricing'
          }
        ],
        recommendations: [
          'दर कमी करण्याऐवजी सेवेचा दर्जा आणि वेग वाढवा.',
          'कामाची लेखी पावती आणि वॉरंटी कार्ड द्या.'
        ],
        risks: ['दर युद्धात (Price war) नफा संपून व्यवसाय डबघाईला येण्याचा धोका.'],
        assumptions: [`सक्रिय व्यवसाय: ${userBiz}`, `स्थान: ${loc}`],
        sources: [{ title: 'SAATHI Competitive Pricing Engine', isOfficial: true }],
        suggestedNextQuestions: [
          'योग्य दर कसा ठरवावा?',
          'ग्राहक आकर्षित कसे करावे?',
          'माझा ब्रेक-इव्हन टार्गेट काय आहे?'
        ],
        trustLevel: 'FACT',
        confidenceScore: 95,
        skillName: 'BUSINESS_ADVISOR'
      };
    }

    // CASE 4: UNKNOWN COMPETITOR COUNT IN VILLAGE (Anti-Hallucination + Field Validation)
    const isCompCountQuery = q.includes('how many') || q.includes('किती दुकाने') || q.includes('कितने प्रतिस्पर्धी');
    if (isCompCountQuery) {
      const compCountText =
        language === 'en'
          ? `## Short Answer
I do not have verified shop-count census data for your specific village.

## What this means for you
Rather than relying on unverified estimates, you should personally conduct a simple 1-day field check before investing in **'${userBiz}'**.

## 6-Step Field Validation Guide:
1. **Visit Main Market:** Spend 3 hours in the central market/chowk within 5 km.
2. **Count Direct Competitors:** Count exactly how many shops offer '${userBiz}'.
3. **Record Pricing:** Ask what they charge for 3 top services or products.
4. **Observe Customer Flow:** Check which shop is busiest and during what hours.
5. **Identify Gaps:** Ask 5 local customers: *"What problem do you face with current shops?"*
6. **Report Back:** Enter your count in SAATHI to recalculate your market opportunity score.

## What I recommend
Based on general semi-urban benchmarks, 1-3 shops indicate healthy demand with room for quality differentiation.`
          : language === 'hi'
          ? `## Short Answer
आपके विशिष्ट गाँव के लिए प्रमाणित दुकान-गणना डेटाबेस में उपलब्ध नहीं है।

## What this means for you
अनुमान पर निर्भर रहने के बजाय, **'${userBiz}'** में पूंजी लगाने से पहले स्वयं १ दिन का फील्ड सर्वे करें।

## ६-चरणीय फील्ड सत्यापन गाइड:
1. **मुख्य बाजार जाएं:** ५ किमी के मुख्य चौक या हाट में ३ घंटे बिताएं।
2. **प्रतिस्पर्धी गिनें:** ठीक से गिनें कि '${userBiz}' की कितनी दुकानें सक्रिय हैं।
3. **दर नोट करें:** प्रमुख ३ सेवाओं/उत्पादों के दाम पूछें।
4. **ग्राहकों की भीड़ देखें:** कौन सी दुकान सबसे व्यस्त है और किस समय।
5. **कमियां पहचानें:** ५ ग्राहकों से पूछें: *"वर्तमान दुकानों से आपको क्या परेशानी है?"*
6. **डेटा दर्ज करें:** SAATHI में यह संख्या दर्ज करें ताकि सटीक विश्लेषण मिल सके।

## What I recommend
सामान्य तौर पर १-३ दुकानें स्वस्थ मांग का संकेत देती हैं, जहाँ गुणवत्ता से आप आगे निकल सकते हैं।`
          : `## Short Answer
तुमच्या विशिष्ट गावातील अधिकृत दुकानांची अचूक आकडेवारी सरकारी डेटाबेसमध्ये उपलब्ध नाही.

## What this means for you
अंदाजावर विसंबून राहण्यापेक्षा, **'${userBiz}'** व्यवसायात भांडवल गुंतवण्यापूर्वी स्वतः १ दिवसाचे प्रत्यक्ष बाजार सर्वेक्षण करा.

## ६-टप्प्यांची प्रत्यक्ष तपासणी पद्धत (Field Validation Guide):
१. **मुख्य चौकात जा:** ५ किमी परिसरातील मुख्य बाजार किंवा बस स्टँडजवळ २ तास थांबा.
२. **थेट स्पर्धक मोजा:** '${userBiz}' चे काम करणारे किती व्यावसायिक सक्रिय आहेत ते प्रत्यक्ष मोजा.
३. **दर तपासा:** मुख्य ३ कामांचे चालू दर माहिती करून घ्या.
४. **गर्दीची वेळ नोंदवा:** कोणत्या दुकानात जास्त गर्दी असते व ती कोणत्या वेळी असते ते पाहा.
५. **ग्राहकांची अडचण विचारा:** ५ स्थानिक ग्राहकांशी चर्चा करा: *"सध्याच्या सेवेत तुम्हाला काय अडचण येते?"*
६. **माहिती नोंदवा:** ही माहिती SAATHI मध्ये टाका, ज्यामुळे अचूक संधी स्कोअर मिळेल.

## What I recommend
साधारणपणे १ ते ३ दुकाने असल्यास गावात पुरेशी मागणी असते आणि दर्जेदार सेवेने नवीन व्यवसाय यशस्वी होतो.`;

      return {
        answer: compCountText,
        summary: `अचूक आकडेवारी: प्रत्यक्ष तपासणी पद्धत (६-Step Field Validation)`,
        voiceSpokenText:
          language === 'en'
            ? 'I do not have verified shop counts for your village. Please conduct a quick field visit using my 6-step guide.'
            : language === 'hi'
            ? 'आपके गाँव का प्रमाणित डेटा उपलब्ध नहीं है। कृपया मेरे ६-चरणीय गाइड से स्वयं बाजार की जांच करें।'
            : 'तुमच्या गावातील अचूक दुकान संख्या उपलब्ध नाही. कृपया माझ्या ६-टप्प्यांच्या पद्धतीनुसार प्रत्यक्ष पाहणी करा.',
        cards: [
          {
            type: 'MARKET_GAP',
            title: `📍 प्रत्यक्ष बाजार तपासणी — ${userBiz}`,
            subtitle: `६-Step Field Validation Guide`,
            data: {
              status: 'प्रत्यक्ष पडताळणी आवश्यक (Verify on Ground)',
              recommendedRadius: '५ ते १० किमी परिसर',
              targetObservations: '५ स्थानिक ग्राहकांशी चर्चा'
            },
            actionText: 'स्थानिक बाजार पाहा',
            actionRoute: '/local-market'
          }
        ],
        recommendations: [
          'खोटे आकडे न गृहीत धरता प्रत्यक्ष बाजारात जाऊन ५ ग्राहकांशी चर्चा करा.',
          'सध्याच्या स्पर्धकांच्या उणिवा समजून घेऊन स्वतःचे वैशिष्ट्य ठरवा.'
        ],
        risks: ['बाजारातील प्रत्यक्ष स्पर्धेची माहिती न घेता दुकान थाटल्यास ग्राहक न मिळण्याचा धोका.'],
        assumptions: [`स्थानिक परिसर: ${loc}`],
        sources: [{ title: 'SAATHI Anti-Hallucination Field Engine', isOfficial: true }],
        suggestedNextQuestions: [
          'माझ्या गावात ग्राहक किती असतील?',
          'व्यवसाय कसा सुरू करावा?',
          'योग्य दर कसा ठरवावा?'
        ],
        trustLevel: 'AI_ESTIMATE',
        confidenceScore: 90,
        skillName: 'BUSINESS_ADVISOR'
      };
    }

    // CASE 5: STANDARD COMPREHENSIVE ROADMAP (Strictly for userBiz, 0% Dairy default)
    const projCost = context.financialBaseline.projectCost;
    const loan = context.financialBaseline.loanComponent;
    const emi = context.financialBaseline.regularMonthlyEMI;
    const beUnits = context.financialBaseline.breakEvenDailyUnits;
    const unitName = getLocalized(arch.unitName, language);
    const targetCust = getLocalized(arch.targetCustomers, language);
    const keyAssets = arch.keyAssets.join(', ');
    const pricing = getLocalized(arch.pricingStrategy, language);
    const marketing = getLocalized(arch.marketingChannels, language);
    const risks = getLocalized(arch.operationalRisks, language);

    let answer = '';

    if (language === 'mr') {
      answer = `## Short Answer
तुमच्याकडे उपलब्ध ₹${cap.toLocaleString('en-IN')} भांडवलातून ${loc} परिसरात **'${userBiz}'** व्यवसाय यशस्वीपणे सुरू करता येतो.

## What this means for you
तुमचा सक्रिय व्यवसाय **'${userBiz}'** हा ${loc} परिसरासाठी अत्यंत व्यवहार्य असून याला स्थानिक ग्राहक वर्ग सहज उपलब्ध होऊ शकतो.

## Numbers
- **स्वतःचे भांडवल (१०%):** ₹${cap.toLocaleString('en-IN')}
- **एकूण प्रकल्प क्षमता (PS-91):** ₹${projCost.toLocaleString('en-IN')}
- **संभाव्य बँक कर्ज (९०%):** ₹${loan.toLocaleString('en-IN')} (३५% PMEGP सबसिडी पात्र)
- **अंदाजित मासिक हप्ता (EMI):** ₹${emi.toLocaleString('en-IN')}/महिना
- **ना-नफा ना-तोटा (Break-Even):** दररोज किमान **${beUnits} ${unitName}** काम पूर्ण होणे आवश्यक

## Opportunity
- **लक्षित ग्राहक:** ${targetCust}
- **साधनसामग्री:** ${keyAssets}
- **दर धोरण:** ${pricing}

## Risks
- ${risks}
- उधारीवर नियंत्रण न ठेवल्यास खेळते भांडवल अडकण्याचा धोका.

## What I recommend
सुरुवातीला संपूर्ण कर्ज न काढता, स्वतःच्या भांडवलातील ६०% रक्कम आवश्यक साधनांवर खर्च करा आणि ४०% रक्कम रोख खेळते भांडवल म्हणून हातात ठेवा.

## Next 3 Steps
1. ${loc} परिसरातील ५ संभाव्य ग्राहकांशी प्रत्यक्ष चर्चा करून त्यांच्या चालू अडचणी समजून घ्या.
2. आवश्यक टूल्स व उपकरणांचे अधिकृत जीएसटी कोटेशन गोळा करा.
3. दुकानाचा गल्ला व घरखर्च पूर्णपणे वेगळा ठेवून पहिल्या महिन्यापासून हिशोब नोंदवा.`;
    } else if (language === 'hi') {
      answer = `## Short Answer
आपकी ₹${cap.toLocaleString('en-IN')} की पूंजी से ${loc} में **'${userBiz}'** व्यवसाय सफलतापूर्वक शुरू किया जा सकता है।

## What this means for you
आपका सक्रिय व्यवसाय **'${userBiz}'** स्थानीय बाजार के लिए अत्यधिक व्यावहारिक है और इसके ग्राहक आसानी से उपलब्ध हैं।

## Numbers
- **स्वयं की पूंजी (१०%):** ₹${cap.toLocaleString('en-IN')}
- **कुल प्रोजेक्ट क्षमता (PS-91):** ₹${projCost.toLocaleString('en-IN')}
- **बैंक ऋण (९०%):** ₹${loan.toLocaleString('en-IN')} (३५% PMEGP सब्सिडी पात्र)
- **मासिक किस्त (EMI):** ₹${emi.toLocaleString('en-IN')}/माह
- **ब्रेक-इवन लक्ष्य:** प्रतिदिन कम से कम **${beUnits} ${unitName}** कार्य आवश्यक

## Opportunity
- **लक्षित ग्राहक:** ${targetCust}
- **आवश्यक सामग्री:** ${keyAssets}
- **मूल्य नीति:** ${pricing}

## Risks
- ${risks}
- अत्यधिक उधारी देने से पूंजी फंसने का जोखिम।

## What I recommend
शुरुआत में सारा कर्ज लेने के बजाय, स्वयं की ६०% पूंजी टूल्स/सामग्री में लगाएं और ४०% नकद बैकअप रखें।

## Next 3 Steps
1. ${loc} के ५ संभावित ग्राहकों से मिलकर उनकी मुख्य समस्याएं समझें।
2. आवश्यक मशीनरी व सामान के पक्के कोटेशन लें।
3. व्यवसाय का हिसाब और घर का खर्च पहले दिन से अलग रखें।`;
    } else {
      answer = `## Short Answer
With your ₹${cap.toLocaleString('en-IN')} available capital, starting a **'${userBiz}'** enterprise in ${loc} is practically viable.

## What this means for you
Your active business is locked to **'${userBiz}'**. Under PS-91 structuring, your capital can be leveraged into a structured setup with government subsidy support.

## Numbers
- **Own Equity (10%):** ₹${cap.toLocaleString('en-IN')}
- **Total Project Capacity (PS-91):** ₹${projCost.toLocaleString('en-IN')}
- **Potential Loan Component (90%):** ₹${loan.toLocaleString('en-IN')} (Eligible for up to 35% PMEGP rural subsidy)
- **Estimated Monthly EMI:** ₹${emi.toLocaleString('en-IN')}/month
- **Break-Even Target:** Minimum **${beUnits} ${unitName}** per day

## Opportunity
- **Target Customers:** ${targetCust}
- **Key Assets Required:** ${keyAssets}
- **Pricing Strategy:** ${pricing}

## Risks
- ${risks}
- Working capital squeeze if excessive customer credit (udhaari) is extended.

## What I recommend
Start lean: Allocate 60% of available funds to essential tools and inventory, keeping 40% strictly as liquid working capital.

## Next 3 Steps
1. Speak with 5 potential customers in ${loc} to test initial pricing and pain points.
2. Obtain genuine GST quotations for your required equipment.
3. Strictly separate personal household expenses from your business cash register.`;
    }

    const vil = context.localEvidencePackage?.villageContext;
    let finalAnswer = answer;
    if (vil && !finalAnswer.includes(vil.villageName)) {
      const vHeader =
        language === 'mr'
          ? `📍 **अधिकृत ग्राम वास्तव (${vil.villageName}, जि. ${vil.district}):**\n• लोकसंख्या: **${vil.totalPopulation.toLocaleString('en-IN')}** (${vil.totalHouseholds.toLocaleString('en-IN')} कुटुंबे, ${vil.farmActivityHhs.toLocaleString('en-IN')} शेतकरी कुटुंबे)\n• जवळचे शहर: **${vil.nearestTownName || 'तालुका केंद्र'}** (${vil.distanceToTownKm || 10} किमी)\n• वीज व रस्ता: **${vil.domesticElectricityHours} तास** वीज, पक्का रस्ता: ${vil.allWeatherRoad ? 'उपलब्ध' : 'मर्यादित'}, आठवडी बाजार: ${vil.marketAvailable ? 'गावात उपलब्ध' : 'तालुका स्तरावर'}\n• सरासरी मासिक खर्च: **₹${vil.ruralMpceInr.toLocaleString('en-IN')}/व्यक्ती** (खर्च पाहणी २०२३)\n\n---\n\n`
          : language === 'hi'
          ? `📍 **आधिकारिक ग्राम आंकड़े (${vil.villageName}, जिला ${vil.district}):**\n• जनसंख्या: **${vil.totalPopulation.toLocaleString('en-IN')}** (${vil.totalHouseholds.toLocaleString('en-IN')} परिवार, ${vil.farmActivityHhs.toLocaleString('en-IN')} किसान परिवार)\n• निकटतम शहर: **${vil.nearestTownName || 'तहसील मुख्यालय'}** (${vil.distanceToTownKm || 10} किमी)\n• बिजली व सड़क: **${vil.domesticElectricityHours} घंटे** बिजली, पक्की सड़क: ${vil.allWeatherRoad ? 'उपलब्ध' : 'सीमित'}\n• औसत मासिक उपभोग व्यय: **₹${vil.ruralMpceInr.toLocaleString('en-IN')}/व्यक्ति** (खर्च सर्वेक्षण २०२३)\n\n---\n\n`
          : `📍 **Authoritative Village Intelligence (${vil.villageName}, ${vil.district}):**\n• Total Population: **${vil.totalPopulation.toLocaleString('en-IN')}** (${vil.totalHouseholds.toLocaleString('en-IN')} households, ${vil.farmActivityHhs.toLocaleString('en-IN')} farming families)\n• Nearest Statutory Town: **${vil.nearestTownName || 'Taluka Hub'}** (${vil.distanceToTownKm || 10} km away)\n• Power & Infrastructure: **${vil.domesticElectricityHours} hrs** domestic electricity, All-weather road: ${vil.allWeatherRoad ? 'Connected' : 'Limited'}\n• Average Monthly Expenditure: **₹${vil.ruralMpceInr.toLocaleString('en-IN')}/person** (HCES 2022-23 benchmark)\n\n---\n\n`;
      finalAnswer = vHeader + finalAnswer;
    }

    return {
      answer: finalAnswer,
      summary: vil ? `व्यवसाय आराखडा: ${userBiz} (${vil.villageName}, ${vil.district}) — लोकसंख्या ${vil.totalPopulation.toLocaleString('en-IN')}` : `व्यवसाय आराखडा: ${userBiz} (${loc}) — ₹${cap.toLocaleString('en-IN')} भांडवल`,
      voiceSpokenText:
        language === 'en'
          ? `With ₹${cap.toLocaleString('en-IN')} capital, starting ${getLocalized(arch.titleNative, 'en') || userBiz} in ${vil?.villageName || loc} is practically viable. Allocate 60 percent to setup and keep 40 percent as liquid cash.`
          : language === 'hi'
          ? `₹${cap.toLocaleString('en-IN')} पूंजी के साथ ${vil?.villageName || loc} में ${getLocalized(arch.titleNative, 'hi') || userBiz} शुरू करना संभव है। ६०% टूल्स में लगाएं और ४०% नकद रखें।`
          : `तुमच्या ₹${cap.toLocaleString('en-IN')} भांडवलातून ${vil?.villageName || loc} परिसरात ${getLocalized(arch.titleNative, 'mr') || userBiz} सुरू करता येतो. ६०% रक्कम साधनांवर खर्च करा आणि ४०% रोख ठेवा.`,
      cards: [
        {
          type: 'BUSINESS_FEASIBILITY',
          title: vil ? `💼 ${userBiz} — ${vil.villageName} (${vil.district})` : `💼 ${userBiz} — ${loc}`,
          subtitle: vil ? `लोकसंख्या: ${vil.totalPopulation.toLocaleString('en-IN')} | भांडवल: ₹${cap.toLocaleString('en-IN')}` : `स्वतःचे भांडवल: ₹${cap.toLocaleString('en-IN')} | ब्रेक-इवन: ${beUnits} ${unitName}/दिवस`,
          data: {
            projectCost: formatIndianRupees(projCost),
            loanComponent: formatIndianRupees(loan),
            regularMonthlyEMI: `${formatIndianRupees(emi)}/महिना`,
            breakEvenDailyUnits: `${beUnits} ${unitName}`
          },
          actionText: 'बाजार संधी तपासा',
          actionRoute: '/market-gap'
        }
      ],
      recommendations: [
        'सुरुवातीला संपूर्ण रक्कम उपकरणांवर खर्च करू नका; ४०% रक्कम रोख हातात ठेवा.',
        `${marketing}`,
        'व्यवसायाचा गल्ला आणि घरखर्च पूर्णपणे वेगळा ठेवा.'
      ],
      risks: [risks, 'उधारीवर कडक नियंत्रण न ठेवल्यास खेळते भांडवल अडकण्याचा धोका.'],
      assumptions: [
        `सक्रिय व्यवसाय: ${userBiz}`,
        `परिसर: ${loc}`,
        `१०% स्वतःचे भांडवल (Margin Money)`
      ],
      sources: [{ title: `SAATHI Rural Business Engine (${userBiz})`, isOfficial: true }],
      suggestedNextQuestions: [
        'माझा मासिक हप्ता (EMI) किती असेल?',
        'ग्राहकांना उधारी द्यावी का?',
        'PMEGP ३५% सबसिडी कशी मिळेल?'
      ],
      trustLevel: 'CALCULATED',
      confidenceScore: 95,
      skillName: 'BUSINESS_ADVISOR'
    };
  }
}
