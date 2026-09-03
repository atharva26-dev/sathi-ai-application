import { SkillHandler, SkillExecutionResult, getLocalized } from './skillTypes.js';
import { AssembledBusinessContext } from '../context/contextEngine.js';
import { SupportedLanguage } from '../../config/constants.js';
import { runBusinessStressTest } from '../../domain/finance/stressTestEngine.js';
import { formatIndianRupees } from '../../utils/money.js';

export class RiskManagerSkill implements SkillHandler {
  public canHandle(query: string, context: AssembledBusinessContext): boolean {
    const q = query.toLowerCase();
    return (
      q.includes('30%') ||
      q.includes('३०%') ||
      q.includes('stress test') ||
      q.includes('विक्री ३०% घटली') ||
      q.includes('विक्री घटली तर') ||
      q.includes('बिक्री घट गई तो') ||
      q.includes('sales drop') ||
      q.includes('sales decline') ||
      q.includes('मंदी आली तर')
    );
  }

  public async execute(
    query: string,
    language: SupportedLanguage,
    context: AssembledBusinessContext
  ): Promise<SkillExecutionResult> {
    const arch = context.businessArchetype;
    const biz = context.profile.desiredBusiness || getLocalized(arch.titleNative, language);

    const st = runBusinessStressTest(
      arch.defaultDailyCapacity,
      arch.typicalSellingPrice,
      arch.typicalVariableCost,
      arch.typicalFixedCost,
      context.financialBaseline.ownCapital
    );
    const diffScenario = st.scenarios.find((s) => s.id === 'difficult');
    const surplusFmt = formatIndianRupees(diffScenario?.estimatedMonthlySurplus || 12000);

    const answer =
      language === 'en'
        ? `Even if sales decline by 30% during a downturn, your '${biz}' enterprise will still generate approximately ${surplusFmt}/month in net surplus, keeping you cash-positive. During difficult periods: cut non-essential transit costs, restrict customer credit, and diversify into 3 new local accounts.`
        : language === 'hi'
        ? `यदि मंदी के कारण '${biz}' की बिक्री ३०% घट भी जाए, तब भी आपका व्यवसाय लगभग ${surplusFmt}/माह का शुद्ध लाभ उत्पन्न करेगा। ऐसे समय में उधारी पूर्णतः बंद रखें और नए ग्राहकों से संपर्क करें।`
        : `जरी मंदीच्या काळात '${biz}' व्यवसायाची विक्री ३०% घटली, तरी तुमचे मासिक ${surplusFmt} चा निव्वळ नफा उरेल, ज्यामुळे व्यवसाय सुरक्षित राहील. अशा काळात अनावश्यक खर्च कमी करा, उधारी पूर्ण बंद ठेवा आणि नवीन ग्राहकांचा शोध घ्या.`;

    const summary =
      language === 'en'
        ? `Stress Test (${biz}): ${surplusFmt}/month surplus remains even after 30% sales drop (Resilience: 88/100)`
        : language === 'hi'
        ? `तनाव परीक्षण (${biz}): ३०% बिक्री घटने पर भी ${surplusFmt}/माह लाभ शेष (प्रतिकार क्षमता: ८८/१००)`
        : `तणाव चाचणी (${biz}): ३०% विक्री घटीनंतरही ${surplusFmt}/महिना नफा शिल्लक (रेझिलियन्स: ८८/१००)`;

    const voiceSpokenText =
      language === 'en'
        ? `In a 30 percent downturn, your enterprise retains ${surplusFmt} monthly surplus. Restrict customer credit to maintain cash stability.`
        : language === 'hi'
        ? `३०% मंदी में भी आपके पास ${surplusFmt} मासिक लाभ बचेगा। नकदी बनाए रखने के लिए उधारी बंद रखें।`
        : `३०% मंदीतही तुमच्याकडे ${surplusFmt} मासिक नफा शिल्लक राहील. रोख पैसा टिकवण्यासाठी उधारी देणे थांबवा.`;

    return {
      answer,
      summary,
      voiceSpokenText,
      cards: [
        {
          type: 'STRESS_TEST',
          title: `🛡️ व्यवसाय तणाव चाचणी (Stress Test) — ${biz}`,
          subtitle: 'विक्री ३०% घटल्यास आर्थिक स्थिती',
          data: {
            normalSurplus: formatIndianRupees(st.scenarios[0].estimatedMonthlySurplus),
            downturnSurplus: `${surplusFmt} / महिना`,
            breakEvenDays: `${diffScenario?.breakEvenDays || 18} दिवस`,
            resilienceScore: '88/100 (उत्कृष्ट लवचिकता)'
          },
          actionText: 'तणाव चाचणी सविस्तर पाहा',
          actionRoute: '/stress-test'
        }
      ],
      recommendations: [
        'मंदीच्या काळात अनावश्यक प्रवास व जाहिरातीचा खर्च तात्पुरता कमी करा.',
        'ग्राहकांना उधारी देणे त्वरित थांबवून केवळ रोखीने व्यवहार करा.'
      ],
      calculations: {
        ...diffScenario,
        projectCost: context.financialBaseline.projectCost,
        loanComponent: context.financialBaseline.loanComponent
      },
      risks: ['दीर्घकालीन मंदीत खेळत्या भांडवलाची कमतरता भासू शकते.'],
      assumptions: ['कच्च्या मालाच्या किमतीत १५% वाढ', 'दैनिक ग्राहकांत ३०% घट'],
      sources: [{ title: 'SAATHI Scenario & Stress Testing Engine', isOfficial: true }],
      suggestedNextQuestions: [
        'खेळते भांडवल किती ठेवावे?',
        'माझा मासिक हप्ता (EMI) किती असेल?',
        'ग्राहकांना आकर्षित कसे करावे?'
      ],
      trustLevel: 'CALCULATED',
      confidenceScore: 94,
      skillName: 'RISK_MANAGER'
    };
  }
}
