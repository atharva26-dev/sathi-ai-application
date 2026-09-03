import { SkillHandler, SkillExecutionResult, getLocalized } from './skillTypes.js';
import { AssembledBusinessContext } from '../context/contextEngine.js';
import { SupportedLanguage } from '../../config/constants.js';
import { formatIndianRupees } from '../../utils/money.js';

export class GrowthMentorSkill implements SkillHandler {
  public canHandle(query: string, context: AssembledBusinessContext): boolean {
    const q = query.toLowerCase();
    return (
      q.includes('व्यवसाय कधी वाढवू') ||
      q.includes('विस्तार') ||
      q.includes('expansion') ||
      q.includes('growth') ||
      q.includes('पुढील पाऊल') ||
      q.includes('roadmap') ||
      q.includes('scale') ||
      q.includes('काय करावे')
    );
  }

  public async execute(
    query: string,
    language: SupportedLanguage,
    context: AssembledBusinessContext
  ): Promise<SkillExecutionResult> {
    const arch = context.businessArchetype;
    const biz = context.profile.desiredBusiness || getLocalized(arch.titleNative, language);
    const loc = context.locationCluster;
    const beUnits = context.financialBaseline.breakEvenDailyUnits;
    const unit = getLocalized(arch.unitName, language);
    const targetSurplus = formatIndianRupees(context.financialBaseline.projectedMonthlySurplus || 25000);

    const answer =
      language === 'en'
        ? `### 📈 Expansion & Growth Framework for '${biz}'\n\nBefore expanding your '${biz}' operations in ${loc}, foundation stability is crucial:\n\n1. **Phase 1: Stabilization (Months 1–3):** Maintain consistent daily operational capacity of at least ${beUnits} ${unit}/day and ensure 100% on-time bank loan EMI repayment.\n2. **Phase 2: Cash Reserve Accumulation (Months 4–6):** Channel at least 50% of monthly surplus (${targetSurplus}/month) into a liquid working capital buffer.\n3. **Phase 3: Capacity Expansion (Month 7+):** Introduce advanced tools or expand local service territory only after securing 20+ repeat clients.\n\n*Rule: Never expand on borrowed emergency capital; expand only from accumulated operational retained earnings.*`
        : language === 'hi'
        ? `### 📈 '${biz}' विस्तार व विकास रोडमॅप\n\n${loc} में अपने '${biz}' व्यवसाय का विस्तार करने से पहले वित्तीय स्थिरता आवश्यक है:\n\n1. **चरण १: आधारभूत स्थिरता (माह १–३):** प्रतिदिन कम से कम ${beUnits} ${unit} कार्य स्थिर करें और बैंक की किस्त समय पर भरें।\n2. **चरण २: नकदी बफर निर्माण (माह ४–६):** मासिक लाभ (${targetSurplus}/माह) का ५०% कार्यशील पूंजी खाते में जमा करें।\n3. **चरण ३: विस्तार (माह ७+):** २०+ नियमित ग्राहक बनने के बाद ही नए उपकरण या अतिरिक्त क्षेत्र जोड़ें।\n\n*सुरक्षा नियम: कभी भी आपातकालीन ऋण लेकर विस्तार न करें; हमेशा संचित लाभ से ही क्षमता बढ़ाएं।*`
        : `### 📈 '${biz}' व्यवसाय विस्तार व वाढीचा आराखडा\n\n${loc} परिसरातील '${biz}' व्यवसायाचा विस्तार करण्यापूर्वी पायाभूत स्थिरता अत्यंत महत्त्वाची आहे:\n\n१. **टप्पा १: पायाभूत स्थिरता (महिने १ ते ३):** दररोज किमान ${beUnits} ${unit} नियमित काम स्थिर करा आणि बँकेचा हप्ता वेळेवर भरा.\n२. **टप्पा २: रोख तरलता राखीव निधी (महिने ४ ते ६):** मासिक नफ्यातील (${targetSurplus}/महिना) ५०% रक्कम खेळते भांडवल राखीव खात्यात साठवा.\n३. **टप्पा ३: क्षमता विस्तार (महिना ७ नंतर):** २०+ नियमित समाधानी ग्राहक जोडल्यानंतरच नवीन साधने किंवा नवीन गावांमध्ये सेवा वाढवा.\n\n*सुवर्ण नियम: नवीन कर्ज काढून अकाली विस्तार करू नका; व्यवसायाच्या प्रत्यक्ष नफ्यातूनच विस्तार करा.*`;

    const summary =
      language === 'en'
        ? `Growth Roadmap (${biz}): Stabilize ${beUnits} ${unit}/day capacity before reinvesting ${targetSurplus}/mo surplus.`
        : language === 'hi'
        ? `विकास रोडमॅप (${biz}): ${beUnits} ${unit}/दिन क्षमता स्थिर होने के बाद ही ${targetSurplus}/माह लाभ से विस्तार करें।`
        : `विस्तार सुरक्षितता नियम (${biz}): सलग ३ महिने ${beUnits} ${unit} काम स्थिर झाल्यावरच विस्तार करा.`;

    const voiceSpokenText =
      language === 'en'
        ? `For your ${biz} business, first stabilize daily operations for three months and build a cash reserve before expanding.`
        : language === 'hi'
        ? `अपने ${biz} व्यवसाय में पहले तीन महीने दैनिक कार्य स्थिर करें और नकद बफर बनाने के बाद ही विस्तार करें।`
        : `तुमच्या ${biz} व्यवसायासाठी पहिले ३ महिने दैनंदिन काम स्थिर करा आणि ५०% नफा साठवून मगच विस्तार करा.`;

    return {
      answer,
      summary,
      voiceSpokenText,
      cards: [
        {
          type: 'EXPANSION_GATES',
          title: `🎯 व्यवसाय विस्तार टप्पे — ${biz}`,
          subtitle: 'टप्पा १: पायाभूत स्थिरता (१ ते ३ महिने)',
          data: {
            activeBusiness: biz,
            capacityGoal: `${beUnits} ${unit}/दिवस`,
            safetyRule: 'सलग ३ महिने हप्ता वेळेवर जाईपर्यंत खर्च वाढवू नका',
            reinvestment: 'नफ्यातील ५०% खेळते भांडवल राखीव खात्यात'
          },
          actionText: 'विस्तार रोडमॅप पाहा',
          actionRoute: '/expansion'
        }
      ],
      recommendations: [
        'सुरुवातीला कमी खर्चात दर्जेदार काम देऊन स्थानिक विश्वास निर्माण करा.',
        'ग्राहकांकडून नियमित अभिप्राय घ्या आणि कामातील उणिवा त्वरित दूर करा.',
        'घरखर्च आणि व्यवसायाचा गल्ला वेगळा ठेवा; स्वतःसाठी निश्चित मासिक पगार ठरवा.'
      ],
      risks: ['अकाली विस्तार केल्यास खेळते भांडवल संपून व्यवसाय बंद पडण्याचा धोका.'],
      assumptions: [`सक्रिय व्यवसाय: ${biz}`, `स्थानिक परिसर: ${loc}`],
      sources: [{ title: 'Rural Micro-Enterprise Phased Growth Guidelines', isOfficial: true }],
      suggestedNextQuestions: [
        'माझा मासिक हप्ता (EMI) किती असेल?',
        'PMEGP ३५% सबसिडी कशी मिळेल?',
        'पहिले १० ग्राहक कसे मिळवायचे?'
      ],
      trustLevel: 'FACT',
      confidenceScore: 94,
      skillName: 'GROWTH_MENTOR'
    };
  }
}
