import { SkillHandler, SkillExecutionResult, getLocalized } from './skillTypes.js';
import { AssembledBusinessContext } from '../context/contextEngine.js';
import { SupportedLanguage } from '../../config/constants.js';
import { evaluateGovernmentSchemes } from '../../domain/schemes/schemeEvaluator.js';

export class SchemeAdvisorSkill implements SkillHandler {
  public canHandle(query: string, context: AssembledBusinessContext): boolean {
    const q = query.toLowerCase();
    return (
      q.includes('योजना') ||
      q.includes('सबसिडी') ||
      q.includes('अनुदान') ||
      q.includes('scheme') ||
      q.includes('subsidy') ||
      q.includes('pmegp') ||
      q.includes('mudra') ||
      q.includes('cmegp') ||
      q.includes('कागदपत्रे') ||
      q.includes('documents')
    );
  }

  public async execute(
    query: string,
    language: SupportedLanguage,
    context: AssembledBusinessContext
  ): Promise<SkillExecutionResult> {
    const schemes = evaluateGovernmentSchemes(context.financialBaseline.projectCost, true);
    const pmegp = schemes[0];

    return {
      answer: `तुमच्यासाठी केंद्र शासनाची PMEGP योजना (पंतप्रधान रोजगार निर्मिती कार्यक्रम) सर्वात फायदेशीर आहे. ग्रामीण भागात प्रक्रिया उद्योगासाठी २५% ते ३५% शासकीय भांडवली अनुदान मिळते. ₹१० लाखांच्या प्रकल्पावर ₹३.५ लाख अनुदान शासनाकडून थेट तुमच्या कर्ज खात्यात सबसिडी म्हणून जमा होते.`,
      summary: `PMEGP योजना: ३५% ग्रामीण अनुदान (कमाल प्रकल्प मर्यादा ₹५० लाख)`,
      voiceSpokenText: `PMEGP योजनेतून तुम्हाला साडेतीन लाख रुपयांचे थेट सरकारी अनुदान मिळू शकते. यासाठी फक्त १० टक्के स्वतःचे भांडवल लागते.`,
      cards: [
        {
          type: 'SCHEME_MATCH',
          title: getLocalized(pmegp.nameNative, language),
          subtitle: `अनुदान: ३५% (अंदाजे ₹३,५०,००० सबसिडी)`,
          data: {
            agency: pmegp.sponsoringAgency,
            tenure: `${pmegp.tenureYears} वर्षे (६ महिने सवलत काळ)`,
            requiredDocs: 'आधार, पॅन, प्रकल्प अहवाल (DPR), ग्रामीण दाखला, कोटेशन'
          },
          actionText: 'योजना पात्रता व कागदपत्रे उघडा',
          actionRoute: '/schemes'
        }
      ],
      recommendations: [
        'जिल्हा उद्योग केंद्र (DIC) किंवा KVIC च्या अधिकृत पोर्टलवर ऑनलाइन अर्ज भरा.',
        'स्थानिक राष्ट्रीयीकृत बँकेकडून इन-प्रिन्सिपल मान्यता (In-Principle Sanction) मिळवा.',
        'मशिनरी खरेदीसाठी जीएसटी असलेले अधिकृत कोटेशन जोडा.'
      ],
      risks: [
        'सबसिडी ३ वर्षे लॉक-इन (TDR) स्वरूपात राहते आणि व्यवसाय सुरू राहिल्याची प्रत्यक्ष पाहणी झाल्यावर कायम होते.',
        'ही अधिकृत पात्रता माहिती आहे; प्रत्यक्ष मंजुरी बँक मूल्यमापनावर अवलंबून असते.'
      ],
      assumptions: ['ग्रामीण विशेष प्रवर्ग / उत्पादन उद्योग (३५% सबसिडी दर)'],
      sources: [
        { title: 'KVIC PMEGP Portal Operational Guidelines', url: 'https://www.kviconline.gov.in/pmegp/', isOfficial: true },
        { title: 'Ministry of MSME Govt of India', isOfficial: true }
      ],
      suggestedNextQuestions: [
        'DPR प्रकल्प अहवाल कसा बनवायचा?',
        'माझा मासिक हप्ता (EMI) किती असेल?',
        'पहिले ५ ग्राहक कसे मिळवायचे?'
      ],
      trustLevel: 'FACT',
      confidenceScore: 96,
      skillName: 'SCHEME_ADVISOR'
    };
  }
}
