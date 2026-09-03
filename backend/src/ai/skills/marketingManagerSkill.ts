import { SkillHandler, SkillExecutionResult, getLocalized } from './skillTypes.js';
import { AssembledBusinessContext } from '../context/contextEngine.js';
import { SupportedLanguage } from '../../config/constants.js';

export class MarketingManagerSkill implements SkillHandler {
  public canHandle(query: string, context: AssembledBusinessContext): boolean {
    const q = query.toLowerCase();
    // Exclude credit queries or price war queries which belong to BusinessAdvisorSkill
    if (q.includes('credit') || q.includes('udhaari') || q.includes('उधारी') || q.includes('cheaper') || q.includes('स्वस्त')) {
      return false;
    }
    return (
      q.includes('ग्राहक कसे मिळवू') ||
      q.includes('पहिला ग्राहक') ||
      q.includes('how to get customers') ||
      q.includes('attract customers') ||
      q.includes('acquire customer') ||
      q.includes('marketing') ||
      q.includes('मार्केटिंग') ||
      q.includes('प्रचार') ||
      q.includes('जाहिरात') ||
      q.includes('विक्री कशी वाढवू') ||
      q.includes('how to increase sales') ||
      q.includes('branding') ||
      q.includes('home service') ||
      q.includes('घरपोच') ||
      q.includes('घरपोच सेवा')
    );
  }

  public async execute(
    query: string,
    language: SupportedLanguage,
    context: AssembledBusinessContext
  ): Promise<SkillExecutionResult> {
    const q = query.toLowerCase();
    const loc = context.locationCluster;
    const arch = context.businessArchetype;
    const biz = context.profile.desiredBusiness || getLocalized(arch.titleNative, language);

    // Default Customer Acquisition Blueprint
    const answer =
      language === 'en'
        ? `### 📢 Customer Acquisition Strategy for '${biz}' in ${loc}\n\n1. **Direct Answer:** To acquire your first 10 paying customers within 7 days: visit 5 local institutions/shops directly, share your rate list on village WhatsApp groups, and guarantee same-day turnaround.\n2. **Today:** List down 20 known contacts with smartphones or potential requirements.\n3. **This Week:** Personally meet 10 contacts, offer a free device health-check or inspection.\n4. **First 30 Days:** Build a word-of-mouth referral chain by giving a ₹50 discount voucher for every referred friend.`
        : language === 'hi'
        ? `### 📢 '${biz}' के लिए ग्राहक प्राप्ति रणनीति (${loc})\n\n1. **थेट उत्तर:** पहले ७ दिनों में १० ग्राहक पाने के लिए: ५ स्थानीय संस्थानों से सीधे मिलें, व्हाट्सएप ग्रुप्स पर दर सूची साझा करें और त्वरित सेवा दें।\n2. **आज:** २० परिचितों की सूची बनाएं।\n3. **इस सप्ताह:** १० लोगों से मिलकर विशेष परिचयात्मक छूट दें।\n4. **प्रथम ३० दिन:** संतुष्ट ग्राहकों से रेफरल लेकर नया ग्राहक आधार बनाएं।`
        : `### 📢 '${biz}' व्यवसायासाठी ग्राहक मिळवण्याची रणनीती (${loc})\n\n१. **थेट उत्तर:** पहिल्या ७ दिवसांत पहिले १० ग्राहक मिळवण्यासाठी: ५ स्थानिक संस्थांशी थेट संपर्क करा, गावच्या व्हॉट्सॲप ग्रुप्सवर दरपत्रक शेअर करा आणि जलद सेवेची हमी द्या.\n२. **आज:** परिसरातील २० ओळखीच्या संभाव्य ग्राहकांची यादी तयार करा.\n३. **या आठवड्यात:** १० जणांची प्रत्यक्ष भेट घेऊन मोफत तपासणी किंवा प्रात्यक्षिक द्या.\n४. **पहिल्या ३० दिवसांत:** समाधानी ग्राहकांना रेफरल डिस्काउंट कूपन देऊन एका ग्राहकाकडून ३ नवीन ग्राहक मिळवा.`;

    const summary =
      language === 'en'
        ? `Customer Strategy (${biz}): 7-day direct outreach + village WhatsApp broadcast + referral discounts.`
        : language === 'hi'
        ? `ग्राहक रणनीति (${biz}): ७ दिवसीय संपर्क + व्हाट्सएप प्रचार + रेफरल छूट।`
        : `ग्राहक मिळवणे (${biz}): ७ दिवसांची थेट मोहीम + व्हॉट्सॲप प्रचार + रेफरल सवलत.`;

    const voiceSpokenText =
      language === 'en'
        ? `To get your first customers in ${loc}, visit 5 local contacts directly and post your services on village WhatsApp groups.`
        : language === 'hi'
        ? `पहले ग्राहक पाने के लिए ५ स्थानीय लोगों से सीधे संपर्क करें और व्हाट्सएप पर अपनी सेवाओं की जानकारी दें।`
        : `पहिले ग्राहक मिळवण्यासाठी परिसरातील ५ ओळखीच्या लोकांशी थेट भेटा आणि गावच्या व्हॉट्सॲप ग्रुप्सवर माहिती पाठवा.`;

    return {
      answer,
      summary,
      voiceSpokenText,
      cards: [
        {
          type: 'MARKETING_PLAYBOOK',
          title: `📢 ग्राहक प्राप्ती कृती आराखडा — ${biz}`,
          subtitle: 'पहिले १० ग्राहक मिळवण्याची ७ दिवसांची मोहीम',
          data: {
            day1to3: '२० ओळखीच्या संपर्कांना व्हॉट्सॲप मेसेज व दरपत्रक',
            day4to7: '५ व्यावसायिक ग्राहकांना प्रत्यक्ष भेट व मोफत सॅम्पल',
            month1: 'रेफरल डिस्काउंट कूपन योजना'
          },
          actionText: 'मार्केटिंग प्लॅन पाहा',
          actionRoute: '/marketing'
        }
      ],
      recommendations: [
        'सुरुवातीला महागड्या जाहिराती न करता थेट संवादावर भर द्या.',
        'प्रत्येक समाधानी ग्राहकाला व्हॉट्सॲपवर ५ मित्रांना फॉरवर्ड करण्याची विनंती करा.'
      ],
      risks: ['वेळेवर सेवा न दिल्यास तोंडी प्रसिद्धी (Word of Mouth) नकारात्मक होण्याचा धोका.'],
      assumptions: [`सक्रिय व्यवसाय: ${biz}`, `स्थान: ${loc}`],
      sources: [{ title: 'SAATHI Rural Marketing & Customer Acquisition Playbook', isOfficial: true }],
      suggestedNextQuestions: [
        'योग्य दर कसा ठरवावा?',
        'माझा ब्रेक-इव्हन टार्गेट काय आहे?',
        'ग्राहकांना उधारी कशी रोखावी?'
      ],
      trustLevel: 'FACT',
      confidenceScore: 95,
      skillName: 'MARKETING_MANAGER'
    };
  }
}
