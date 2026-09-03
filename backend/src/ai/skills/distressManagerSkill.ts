import { SkillHandler, SkillExecutionResult, getLocalized } from './skillTypes.js';
import { AssembledBusinessContext } from '../context/contextEngine.js';
import { SupportedLanguage } from '../../config/constants.js';

export class DistressManagerSkill implements SkillHandler {
  public canHandle(query: string, context: AssembledBusinessContext): boolean {
    const q = query.toLowerCase();
    return (
      q.includes('हप्ता भरू शकत नाही') ||
      q.includes('cannot repay') ||
      q.includes('cannot pay emi') ||
      q.includes('कर्ज फेडता येत नाही') ||
      q.includes('तोटा झाला') ||
      q.includes('बुडालो') ||
      q.includes('no cash') ||
      q.includes('पैसे संपले') ||
      q.includes('डूब गया')
    );
  }

  public async execute(
    query: string,
    language: SupportedLanguage,
    context: AssembledBusinessContext
  ): Promise<SkillExecutionResult> {
    const arch = context.businessArchetype;
    const biz = context.profile.desiredBusiness || getLocalized(arch.titleNative, language);

    const answer =
      language === 'en'
        ? `### 🛡️ Financial Distress & Liquidity Triage for '${biz}'\n\nStay calm. In times of cash stress, follow these 4 immediate emergency steps:\n\n1. **Protect Cash Liquidity:** Stop all non-essential personal and business expenses immediately.\n2. **Aggressive Receivables Collection:** Recover all pending customer credit/dues immediately in cash.\n3. **Engage with Your Lending Bank:** Visit your branch manager proactively before default to request loan restructuring, interest moratorium, or tenure extension under RBI MSME guidelines.\n4. **Zero Informal Borrowing:** NEVER take high-interest private moneylender loans to pay formal bank EMIs.`
        : language === 'hi'
        ? `### 🛡️ '${biz}' के लिए आपातकालीन वित्तीय स्थिरीकरण\n\nघबराएं नहीं। नकदी संकट के समय इन ४ त्वरित चरणों का पालन करें:\n\n1. **नकदी का संरक्षण:** सभी अनावश्यक खर्च तुरंत रोकें।\n2. **उधारी वसूली अभियान:** बाजार की सभी पुरानी उधारी तुरंत नकद में वसूलें।\n3. **बैंक से संपर्क:** किस्त छूटने से पहले बैंक प्रबंधक से मिलकर आरबीआई एमएसएमई नियमों के तहत ऋण पुनर्गठन (Loan Restructuring) का आवेदन दें।\n4. **साहूकारी ऋण से बचें:** बैंक की किस्त भरने के लिए अधिक ब्याज वाला निजी ऋण कभी न लें।`
        : `### 🛡️ '${biz}' व्यवसायासाठी आर्थिक संकट निवारण योजना\n\nकाळजी करू नका. रोख पैशांची टंचाई निर्माण झाल्यास ही तातडीची ४ पावले उचला:\n\n१. **रोख पैशांचे संरक्षण:** सर्व अनावश्यक वैयक्तिक व व्यावसायिक खर्च त्वरित थांबवा.\n२. **उधारी वसुली मोहीम:** बाजारात अडकलेली सर्व जुनी उधारी तातडीने रोख स्वरूपात गोळा करा.\n३. **बँक व्यवस्थापकांशी थेट चर्चा:** हप्ता थकण्यापूर्वी बँकेत जाऊन RBI MSME नियमांनुसार कर्ज पुनर्रचना (Loan Restructuring / Moratorium Extension) ची अधिकृत विनंती करा.\n४. **सावकारी कर्ज टाळा:** बँकेचा हप्ता भरण्यासाठी जादा व्याजाचे कोणतेही खाजगी कर्ज मुळीच घेऊ नका.`;

    const summary =
      language === 'en'
        ? `Emergency Cash Action (${biz}): Zero informal borrowing, collect pending dues, and request RBI loan restructuring.`
        : language === 'hi'
        ? `आपातकालीन नकदी योजना (${biz}): साहूकारी कर्ज से बचें, उधारी वसूलें और बैंक पुनर्गठन का आवेदन करें।`
        : `आर्थिक संकट निवारण (${biz}): खाजगी कर्ज टाळा, बाजारातील उधारी गोळा करा आणि बँकेत पुनर्रचना अर्ज करा.`;

    const voiceSpokenText =
      language === 'en'
        ? `Do not panic. Stop credit sales, collect all market dues, and approach your bank manager for loan restructuring.`
        : language === 'hi'
        ? `घबराएं नहीं। उधारी पर काम बंद करें, पुरानी उधारी वसूलें और बैंक में जाकर किस्त पुनर्गठन की बात करें।`
        : `घाबरू नका. उधारी पूर्ण बंद करा, बाजारातील जुनी वसुली करा आणि बँकेत जाऊन हप्ता पुनर्रचनेची चौकशी करा.`;

    return {
      answer,
      summary,
      voiceSpokenText,
      cards: [
        {
          type: 'DISTRESS_TRIAGE',
          title: `🛡️ आर्थिक संकट निवारण — ${biz}`,
          subtitle: 'तातडीची ४ पावले (Emergency Cash Action)',
          data: {
            step1: 'ग्राहकांकडून जुनी उधारी रोख स्वरूपात गोळा करा',
            step2: 'अनावश्यक वीज, वाहतूक व अतिरिक्त खर्च थांबवा',
            step3: 'बँक मॅनेजरला भेटून RBI रीस्ट्रक्चरिंग अर्ज करा',
            step4: 'जास्त व्याजाचे खाजगी कर्ज मुळीच घेऊ नका'
          },
          actionText: 'खेळते भांडवल बफर तपासा',
          actionRoute: '/working-capital'
        }
      ],
      recommendations: [
        'उधारीवर माल किंवा सेवा देणे आजपासून १००% बंद करा.',
        'बँकेशी सतत संवाद ठेवा; बँक थकबाकीदारापेक्षा प्रामाणिक कर्जदाराला नेहमी मुदतवाढ देते.'
      ],
      risks: ['अडचणीच्या काळात जादा व्याजाचे खाजगी कर्ज घेतल्यास कर्जबाजारीपणा वाढतो.'],
      assumptions: ['बँकेत नियमित खाते असून पूर्वीचे व्यवहार प्रामाणिक आहेत'],
      sources: [{ title: 'RBI MSME Loan Restructuring Framework', isOfficial: true }],
      suggestedNextQuestions: [
        'बँकेत जाऊन काय बोलावे?',
        'उधारी कशी गोळा करावी?',
        'माझे आवश्यक खेळते भांडवल किती आहे?'
      ],
      trustLevel: 'FACT',
      confidenceScore: 98,
      skillName: 'DISTRESS_MANAGER'
    };
  }
}
