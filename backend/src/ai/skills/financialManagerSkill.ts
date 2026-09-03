import { SkillHandler, SkillExecutionResult, getLocalized } from './skillTypes.js';
import { AssembledBusinessContext } from '../context/contextEngine.js';
import { SupportedLanguage } from '../../config/constants.js';
import { financeTools } from '../tools/financeTools.js';
import { formatIndianRupees } from '../../utils/money.js';

export class FinancialManagerSkill implements SkillHandler {
  public canHandle(query: string, context: AssembledBusinessContext): boolean {
    const q = query.toLowerCase();
    return (
      q.includes('emi') ||
      q.includes('हप्ता') ||
      q.includes('किस्त') ||
      q.includes('repayment') ||
      q.includes('कर्ज') ||
      q.includes('loan') ||
      q.includes('भांडवल') ||
      q.includes('capital') ||
      q.includes('cost') ||
      q.includes('प्रकल्प') ||
      q.includes('break even') ||
      q.includes('ना नफा') ||
      q.includes('खेळते भांडवल') ||
      q.includes('working capital') ||
      q.includes('safely invest') ||
      q.includes('सुरक्षित गुंतवणूक') ||
      q.includes('किती गुंतवू') ||
      q.includes('should i take a loan') ||
      q.includes('afford') ||
      q.includes('परवडेल का') ||
      q.includes('घरखर्च') ||
      q.includes('no money left') ||
      q.includes('पैशांची चणचण') ||
      q.includes('नफा राहत नाही') ||
      q.includes('loss') ||
      q.includes('तोटा')
    );
  }

  public async execute(
    query: string,
    language: SupportedLanguage,
    context: AssembledBusinessContext
  ): Promise<SkillExecutionResult> {
    const q = query.toLowerCase();
    const cap = context.financialBaseline.ownCapital;
    const arch = context.businessArchetype;
    const bizTitle = context.profile.desiredBusiness || getLocalized(arch.titleNative, language);
    const ownCapFmt = formatIndianRupees(cap);

    // Sub-intent 0: CASH FLOW SHORTAGE / "SALES ARE GOOD BUT NO MONEY LEFT AT MONTH END"
    const isCashShortage =
      q.includes('no money left') ||
      q.includes('पैशांची चणचण') ||
      q.includes('नफा राहत नाही') ||
      q.includes('बचत होत नाही') ||
      q.includes('पैसा नहीं बचता') ||
      (q.includes('sales') && q.includes('no money'));

    if (isCashShortage) {
      const diagText =
        language === 'en'
          ? `## Short Answer
If sales are good but cash is short at month-end, the issue is almost always **hidden cash leaks, unpaid customer credit (udhaari), or household withdrawals**.

## What this means for you
For **'${bizTitle}'**, turning revenue into actual retained cash requires plugging 4 main leakages immediately.

## 4 Root Causes to Diagnose:
1. **Uncollected Credit (Udhaari):** Money is trapped in customers' pockets instead of your bank account.
2. **Household Mixing:** Drawing money directly from the cash drawer for groceries or family expenses without recording it.
3. **Dead Inventory:** Buying excess slow-moving stock that sits on shelves.
4. **Incorrect Markup:** Pricing products without including transport, wastage, packaging, and electricity costs.

## What I recommend
- **Set a Fixed Owner's Salary:** Pay yourself a fixed monthly amount; never take random cash from the register.
- **Weekly Ledger Review:** Close your books every Sunday to match cash collected vs expenses.

## Next 3 Steps
1. Count all outstanding credit slips (udhaari) and set a strict recovery goal this week.
2. Stop buying excess inventory until existing stock is converted to cash.
3. Separate business and household funds into two distinct bank/UPI accounts.`
          : language === 'hi'
          ? `## Short Answer
यदि बिक्री अच्छी है लेकिन महीने के अंत में पैसा नहीं बचता, तो इसका कारण **उधारी, घरेलू खर्च की निकासी या छिपे हुए नुकसान** हैं।

## What this means for you
**'${bizTitle}'** में लाभ को नकदी में बदलने के लिए ४ प्रमुख कमियों को तुरंत ठीक करना होगा।

## ४ मुख्य कारण और समाधान:
1. **फंसी हुई उधारी (Udhaari):** माल बिक गया लेकिन पैसा ग्राहकों के पास अटका है।
2. **घर का खर्च मिलाना:** दुकान के गल्ले से सीधे घर के लिए पैसे निकालना बिना हिसाब रखे।
3. **अतिरिक्त स्टॉक:** ऐसा सामान खरीद लेना जो जल्दी नहीं बिकता।
4. **गलत लागत गणना:** बिजली, पैकिंग और भाड़े का खर्च जोड़े बिना दाम तय करना।

## What I recommend
- **निश्चित वेतन लें:** गल्ले से रोज पैसे निकालने के बजाय महीने में एक निश्चित वेतन तय करें।
- **साप्ताहिक हिसाब:** हर रविवार को आमदनी और खर्च का मिलान करें।

## Next 3 Steps
1. सभी उधारी की पर्चियां जोड़ें और इस सप्ताह वसूली का लक्ष्य बनाएं।
2. जब तक पुराना माल न बिके, नया स्टॉक खरीदने पर रोक लगाएं।
3. व्यापार और घर के लिए दो अलग-अलग बैंक/UPI खाते रखें।`
          : `## Short Answer
विक्री चांगली असूनही महिनाअखेर पैसे उरत नसतील, तर याचे मुख्य कारण **अडकेलेली उधारी, घरखर्चात जाणारे पैसे किंवा न नोंदवलेला खर्च** असते.

## What this means for you
**'${bizTitle}'** व्यवसायात कागदावर नफा दिसणे आणि हातात रोख पैसे असणे यात फरक आहे. रोख पैसा टिकवण्यासाठी ४ गळती रोखणे आवश्यक आहे.

## ४ प्रमुख कारणे व उपाय (Root Causes):
१. **अडकलेली उधारी (Udhaari):** विक्री झाली पण ग्राहकांकडून रोख पैसे वेळेवर जमा झाले नाहीत.
२. **घरखर्च व गल्ल्याची सरमिसळ:** व्यवसायाच्या गल्ल्यातून घरच्या खर्चासाठी परस्पर पैसे काढणे.
३. **अनावश्यक साठा (Dead Stock):** न खपणारा माल जास्त प्रमाणात खरेदी करून ठेवणे.
४. **लपलेला खर्च:** वाहतूक, वीज बिल, पॅकिंग आणि नासाडीचा खर्च किमतीत न जोडणे.

## What I recommend
- **स्वतःचा निश्चित पगार ठरवा:** दररोज गल्ल्यातून पैसे काढण्याऐवजी स्वतःसाठी दरमहा एक निश्चित रक्कम ठरवून घ्या.
- **साप्ताहिक ताळेबंद:** दर रविवारी एकूण विक्री, खर्च आणि प्रत्यक्ष शिल्लक रोख रकमेचा ताळेबंद तपासा.

## Next 3 Steps
१. सर्व उधारीच्या नोंदी तपासून या आठवड्यात ५०% उधारी वसूल करा.
२. जुना माल खपल्याशिवाय नवीन माल खरेदी करणे तात्पुरते थांबवा.
३. व्यवसायाचे बँक/UPI खाते आणि घरगुती खाते पूर्णपणे वेगळे ठेवा.`;

      return {
        answer: diagText,
        summary: `रोख प्रवाह निदान (${bizTitle}): उधारी वसुली + घरखर्च व गल्ला वेगळा करणे आवश्यक`,
        voiceSpokenText:
          language === 'en'
            ? 'If sales are good but cash is short, stop unpaid customer credit and strictly separate household spending from your business cash register.'
            : language === 'hi'
            ? 'बिक्री अच्छी होने पर भी पैसा न बचने का कारण उधारी और घरखर्च की मिलावट है। इन्हें तुरंत अलग करें।'
            : 'विक्री असूनही पैसे न उरण्याचे मुख्य कारण उधारी आणि घरखर्च एकत्र करणे हे आहे. हे तात्काळ वेगळे करा.',
        cards: [
          {
            type: 'RISK_ALERT',
            title: `💰 रोख प्रवाह निदान (Cash Flow Diagnosis) — ${bizTitle}`,
            subtitle: `रोख तुटवड्याची कारणे व उपाय`,
            data: {
              leakage1: 'उधारी वसुली तात्काळ करा',
              leakage2: 'घरखर्च व गल्ला १००% वेगळा ठेवा',
              leakage3: 'अनावश्यक साठा खरेदी थांबवा'
            },
            actionText: 'खेळते भांडवल तपासा',
            actionRoute: '/working-capital'
          }
        ],
        recommendations: [
          'दर रविवारी नफा-तोटा व शिल्लक रोखीचा हिशोब पूर्ण करा.',
          'गल्ल्यातून स्वतःसाठी निश्चित मासिक पगाराव्यतिरिक्त एकही रुपया काढू नका.'
        ],
        risks: ['रोख पैशांचे योग्य नियोजन न केल्यास सप्लायरचे पैसे थकण्याचा धोका.'],
        assumptions: [`सक्रिय व्यवसाय: ${bizTitle}`],
        sources: [{ title: 'SAATHI Rural Micro-Enterprise Cashflow Protocol', isOfficial: true }],
        suggestedNextQuestions: [
          'खेळते भांडवल किती ठेवावे?',
          'ग्राहकांना उधारी कशी रोखावी?',
          'माझा ब्रेक-इव्हन टार्गेट काय आहे?'
        ],
        trustLevel: 'FACT',
        confidenceScore: 97,
        skillName: 'FINANCIAL_MANAGER'
      };
    }

    // Sub-intent 1: "How much can I safely invest?" (Theoretical Max vs Recommended Safe Investment)
    if (q.includes('safely invest') || q.includes('सुरक्षित गुंतवणूक') || q.includes('किती गुंतवू') || q.includes('safe investment')) {
      const struct = financeTools.calculate_project_cost({ capital: cap, marginPercent: 10 });
      const safeCapex = formatIndianRupees(cap * 0.6); // 60% in Capex/Tools
      const safeWc = formatIndianRupees(cap * 0.4); // 40% in liquid reserve

      const answer =
        language === 'en'
          ? `## Short Answer
With your ${ownCapFmt} available equity, your **Recommended Safe Initial Investment is ${safeCapex}**, reserving ${safeWc} (40%) strictly for working capital buffer.

## What this means for you
For **'${bizTitle}'**, investing 100% of your funds on Day 1 creates severe liquidity stress if customer inflow takes time to pick up.

## Numbers & Comparison
- **Theoretical Bank Maximum (PS-91):** ₹${(cap * 10).toLocaleString('en-IN')} total project size (10x leverage).
- **Recommended Safe Setup:** ${safeCapex} in essential tools & inventory + ${safeWc} liquid cash reserve.
- **Debt Recommendation:** Start lean with zero or minimal borrowing until steady daily sales are proven.

## What I recommend
Invest in phase 1 essentials only. Do not buy expensive non-essential accessories until month 3.

## Next 3 Steps
1. Allocate ${safeCapex} to core machinery/tools.
2. Park ${safeWc} in a dedicated liquid bank account for operational buffer.
3. Track all operating expenses daily.`
          : language === 'hi'
          ? `## Short Answer
आपकी ${ownCapFmt} पूंजी में से **सुरक्षित प्रारंभिक निवेश ${safeCapex}** है, जबकि ${safeWc} (४०%) कार्यशील पूंजी के रूप में सुरक्षित रखना चाहिए।

## What this means for you
**'${bizTitle}'** के लिए पहले ही दिन सारा पैसा खर्च करने से आगे चलकर रोजमर्रा के खर्चों के लिए संकट आ सकता है।

## आंकड़े व विश्लेषण
- **सैद्धांतिक बैंक सीमा (PS-91):** ₹${(cap * 10).toLocaleString('en-IN')} प्रोजेक्ट क्षमता।
- **सुरक्षित व्यावहारिक मॉडल:** ${safeCapex} टूल्स व दुकान + ${safeWc} नकद बैकअप।
- **ऋण सलाह:** शुरुआत में बड़ा कर्ज न लें; पहले व्यापार को स्थिर करें।

## What I recommend
केवल आवश्यक उपकरणों में निवेश करें। अनावश्यक खर्च महीने ३ के बाद ही करें।

## Next 3 Steps
1. ${safeCapex} से जरूरी टूल्स व कच्चा माल खरीदें।
2. ${safeWc} नकद बैंक खाते में सुरक्षित रखें।
3. दैनिक खर्चों का हिसाब रखें।`
          : `## Short Answer
तुमच्याकडे उपलब्ध ${ownCapFmt} पैकी **शिफारस केलेली सुरक्षित सुरुवातीची गुंतवणूक ${safeCapex}** आहे, तर उर्वरित ${safeWc} (४०%) खेळते भांडवल राखीव म्हणून रोख ठेवणे आवश्यक आहे.

## What this means for you
**'${bizTitle}'** व्यवसायात पहिल्याच दिवशी सर्व पैसे उपकरणांवर खर्च केल्यास पुढील महिनाभरात कच्चा माल आणण्यासाठी अडचणी येतात.

## वित्तीय ताळेबंद
- **सैद्धांतिक कमाल मर्यादा (PS-91):** ₹${(cap * 10).toLocaleString('en-IN')} कमाल प्रकल्प क्षमता (१० पट लीव्हरेज).
- **सुरक्षित शिफारस:** ${safeCapex} आवश्यक साधने व साहित्य + ${safeWc} रोख राखीव निधी.
- **कर्ज धोरण:** सुरुवातीला अवाजवी कर्ज न काढता कमीत कमी कर्जावर काम सुरू करा.

## What I recommend
सुरुवातीला केवळ आवश्यक साधनांमध्ये गुंतवणूक करा. नफा सुरू झाल्यावरच पुढील विस्तार करा.

## Next 3 Steps
१. ${safeCapex} मधून अत्यावश्यक उपकरणांची खरेदी करा.
२. ${safeWc} रक्कम खेळत्या भांडवलासाठी स्वतंत्र बँक खात्यात ठेवा.
३. दररोजच्या सर्व खर्चाची नोंद वहीत ठेवा.`;

      return {
        answer,
        summary: `सुरक्षित गुंतवणूक (${bizTitle}): ${safeCapex} साधने व सेटअप + ${safeWc} खेळते भांडवल बफर`,
        voiceSpokenText:
          language === 'en'
            ? `With ${ownCapFmt} available, invest ${safeCapex} in essential setup and keep ${safeWc} strictly as a liquid cash buffer.`
            : language === 'hi'
            ? `${ownCapFmt} में से ${safeCapex} आवश्यक उपकरणों पर लगाएं और ${safeWc} नकद बैकअप रखें।`
            : `तुमच्या ${ownCapFmt} पैकी ${safeCapex} प्राथमिक साधनांवर खर्च करा आणि उर्वरित ${safeWc} खेळत्या भांडवलासाठी रोख शिल्लक ठेवा.`,
        cards: [
          {
            type: 'SAFE_INVESTMENT_PLAN',
            title: `💼 सुरक्षित भांडवल वाटप — ${bizTitle}`,
            subtitle: `उपलब्ध भांडवल: ${ownCapFmt}`,
            data: {
              recommendedCapex: `${safeCapex} (साधने व दुकान)`,
              workingCapitalReserve: `${safeWc} (रोख बफर)`,
              theoreticalMaxProject: `₹${(cap * 10).toLocaleString('en-IN')} (PS-91 10x Max)`,
              debtRecommendation: 'सुरुवातीला कमी कर्ज (Low Leverage)'
            },
            actionText: 'भांडवल वाटप तपासा',
            actionRoute: '/budget'
          }
        ],
        recommendations: [
          'सर्व पैसे सुरुवातीलाच उपकरणांवर खर्च करू नका; ४०% रोख रक्कम हातात ठेवा.',
          'व्यवसायाचा गल्ला आणि घरखर्च पूर्णपणे वेगळा ठेवा.'
        ],
        calculations: {
          availableCapital: cap,
          projectCost: struct.projectCost,
          loanComponent: struct.loanComponent,
          safeInvestmentCapex: cap * 0.6,
          workingCapitalReserve: cap * 0.4
        },
        risks: ['कमाल कर्जाचा हप्ता चुकल्यास बँक सिबिल स्कोअर खराब होण्याचा धोका.'],
        assumptions: [`उपलब्ध स्वतःचे भांडवल: ${ownCapFmt}`, `सक्रिय व्यवसाय: ${bizTitle}`],
        sources: [{ title: 'RBI MSME Prudent Capital Allocation Guidelines', isOfficial: true }],
        suggestedNextQuestions: [
          'माझा मासिक हप्ता (EMI) किती असेल?',
          'दुकान सुरू करण्यासाठी कोणती साधने खरेदी करावीत?',
          'खेळते भांडवल किती ठेवावे?'
        ],
        trustLevel: 'CALCULATED',
        confidenceScore: 98,
        skillName: 'FINANCIAL_MANAGER'
      };
    }

    // Sub-intent 2: "Should I take a loan?" / Loan Decision Support
    if (q.includes('should i take a loan') || q.includes('कर्ज घ्यावे का') || q.includes('loan requirement') || q.includes('afford to start') || q.includes('pervedel ka') || q.includes('start smaller')) {
      const struct = financeTools.calculate_project_cost({ capital: cap, marginPercent: 10 });
      const emiRes = financeTools.calculate_emi({
        loanAmount: struct.loanComponent,
        interestRate: 8.0,
        tenureMonths: 84,
        moratoriumMonths: 6
      });

      const loanFmt = formatIndianRupees(struct.loanComponent);
      const emiFmt = formatIndianRupees(emiRes.regularMonthlyEMI);

      const answer =
        language === 'en'
          ? `## Short Answer
Do not take a large ${loanFmt} loan immediately unless you have validated steady daily customer demand. A large loan requires paying **${emiFmt}/month** in fixed EMI for 7 years.

## What this means for you
For **'${bizTitle}'**, it is often safer to start smaller with self-equity, prove steady cash flow for 3 months, then apply for bank debt.

## Numbers
- **Own Capital Available:** ${ownCapFmt}
- **Potential Loan Amount:** ${loanFmt} (at 8.0% interest)
- **Monthly EMI Obligation:** ${emiFmt}/month (after 6-month moratorium)
- **Breakeven Repayment Rule:** Operational profit must be at least **2.0x the EMI** (DSCR > 2.0).

## What I recommend
Start lean with your available ${ownCapFmt}. If customer demand outstrips your capacity in 90 days, apply for a structured PMEGP loan with 35% subsidy.

## Next 3 Steps
1. Calculate your minimum daily breakeven volume before signing loan documents.
2. Check if you can operate initially using rented or existing equipment.
3. Prepare a Detailed Project Report (DPR) through the District Industries Centre (DIC).`
          : language === 'hi'
          ? `## Short Answer
तुरंत ${loanFmt} का बड़ा कर्ज न लें जब तक कि ग्राहक मांग सिद्ध न हो जाए। इस पर हर महीने **${emiFmt}/माह** की निश्चित किस्त आएगी।

## What this means for you
**'${bizTitle}'** के लिए पहले स्वयं की पूंजी से छोटा काम शुरू करना और ३ महीने का नकद लाभ देखना अधिक सुरक्षित है।

## आंकड़े
- **उपलब्ध पूंजी:** ${ownCapFmt}
- **संभावित बैंक ऋण:** ${loanFmt} (८.०% ब्याज)
- **मासिक किस्त (EMI):** ${emiFmt}/माह (६ माह छूट के बाद)
- **सुरक्षा नियम:** मासिक नफा किस्त से कम से कम २ गुना अधिक होना चाहिए।

## What I recommend
पहले अपनी ${ownCapFmt} पूंजी से शुरुआत करें। जब नियमित ग्राहक बन जाएं, तब PMEGP ३५% सब्सिडी ऋण के लिए आवेदन करें।

## Next 3 Steps
1. लोन लेने से पहले दैनिक ब्रेक-इवन बिक्री की गणना करें।
2. जरूरी टूल्स के लिए सरकारी कोटेशन तैयार रखें।
3. जिला उद्योग केंद्र (DIC) से संपर्क करें।`
          : `## Short Answer
स्थानिक बाजारपेठेत नियमित ग्राहक सिद्ध झाल्याशिवाय लगेच ${loanFmt} चे मोठे कर्ज काढू नका. या कर्जावर दरमहा **${emiFmt}** चा नियमित हप्ता भरावा लागेल.

## What this means for you
**'${bizTitle}'** व्यवसायासाठी सुरुवातीला स्वतःच्या भांडवलातून लहान स्वरूपात काम सुरू करणे आणि ३ महिने रोख नफा तपासून मगच कर्ज वाढवणे सुरक्षित ठरते.

## वित्तीय ताळेबंद
- **उपलब्ध स्वतःचे भांडवल:** ${ownCapFmt}
- **संभाव्य बँक कर्ज:** ${loanFmt} (८.०% व्याजदराने)
- **मासिक हप्ता (EMI):** ${emiFmt}/महिना (६ महिने सवलतीनंतर)
- **कर्ज सुरक्षा नियम:** व्यवसायाचा मासिक नफा हप्त्यापेक्षा किमान २ पट जास्त असावा (DSCR > २.०).

## What I recommend
सुरुवातीला स्वतःच्या ${ownCapFmt} मधून आवश्यक साधनांसह सुरुवात करा. ३ महिने नियमित ग्राहक आल्यावर PMEGP ३५% सबसिडी योजनेतून कर्ज घ्या.

## Next 3 Steps
१. कर्जाचा अर्ज करण्यापूर्वी दररोजचे ब्रेक-इव्हन टार्गेट तपासा.
२. उपकरणांचे अधिकृत जीएसटी कोटेशन गोळा करा.
३. जिल्हा उद्योग केंद्र (DIC) द्वारे PMEGP चा डीपीआर (DPR) तयार करा.`;

      return {
        answer,
        summary: `कर्ज सल्ला (${bizTitle}): ${loanFmt} कर्जावर ${emiFmt}/माह हप्ता; आधी लहान स्वरूपात सुरू करून नफा तपासा`,
        voiceSpokenText:
          language === 'en'
            ? `Do not borrow heavily on day one. A ${loanFmt} loan requires ${emiFmt} monthly EMI. Start small with your own funds first.`
            : language === 'hi'
            ? `तुरंत बड़ा कर्ज न लें। ${loanFmt} कर्ज पर ${emiFmt} मासिक किस्त आएगी। पहले स्वयं की पूंजी से शुरुआत करें।`
            : `लगेच मोठे कर्ज न काढता सुरुवातीला स्वतःच्या भांडवलातून काम सुरू करा, कारण ${loanFmt} कर्जावर दरमहा ${emiFmt} हप्ता द्यावा लागेल.`,
        cards: [
          {
            type: 'LOAN_DECISION_SUPPORT',
            title: `⚖️ कर्ज व्यवहार्यता मूल्यमापन — ${bizTitle}`,
            subtitle: `कर्ज: ${loanFmt} @ 8% (7 वर्षे)`,
            data: {
              monthlyEMI: emiFmt,
              ownEquity: ownCapFmt,
              debtSafetyVerdict: 'TIGHT / CAUTION (Start Lean First)',
              repaymentRule: 'DSCR > 2.0 (नफा हप्त्यापेक्षा २.५ पट हवा)'
            },
            actionText: 'हप्ता वेळापत्रक पाहा',
            actionRoute: '/emi'
          }
        ],
        recommendations: [
          'हप्ता वेळेवर न भरल्यास बँकेत सिबिल स्कोअर खराब होतो; घाईघाईने कर्ज घेऊ नका.',
          'सुरुवातीला ३ महिने नियमित रोखीचे व्यवहार सिद्ध करा.'
        ],
        calculations: {
          projectCost: struct.projectCost,
          loanComponent: struct.loanComponent,
          regularMonthlyEMI: emiRes.regularMonthlyEMI,
          totalInterestPayable: emiRes.totalInterestPayable
        },
        risks: ['मंदीच्या काळात विक्री घटल्यास कर्जाचा हप्ता फेडणे कठीण होते.'],
        assumptions: [`उपलब्ध भांडवल: ${ownCapFmt}`, `सक्रिय व्यवसाय: ${bizTitle}`],
        sources: [{ title: 'RBI Debt Service Coverage Ratio (DSCR) Standards', isOfficial: true }],
        suggestedNextQuestions: [
          'माझे आवश्यक खेळते भांडवल किती आहे?',
          'दुकान सुरू करण्यासाठी कोणती साधने खरेदी करावीत?',
          'PMEGP ३५% सबसिडी कशी मिळेल?'
        ],
        trustLevel: 'CALCULATED',
        confidenceScore: 97,
        skillName: 'FINANCIAL_MANAGER'
      };
    }

    // Sub-intent 3: Working Capital
    if (q.includes('खेळते भांडवल') || q.includes('working capital') || q.includes('buffer')) {
      const wc = financeTools.calculate_working_capital({
        unitsPerDay: arch.defaultDailyCapacity,
        rawMaterialCostPerUnit: arch.typicalVariableCost,
        monthlySalaries: 15000,
        monthlyUtilitiesAndTransport: 10000,
        availableCapital: cap
      });

      const bufferDays = arch.workingCapitalBufferDays || 20;
      const reqWcFmt = formatIndianRupees(wc.totalRequiredWorkingCapital);

      const summary =
        language === 'en'
          ? `Minimum Working Capital: ${reqWcFmt} (${bufferDays}-day operational buffer)`
          : language === 'hi'
          ? `न्यूनतम कार्यशील पूंजी: ${reqWcFmt} (${bufferDays} दिन का बफर)`
          : `किमान आवश्यक खेळते भांडवल: ${reqWcFmt} (${bufferDays} दिवसांचा साठा व खर्च)`;

      const voiceSpokenText =
        language === 'en'
          ? `For your ${bizTitle} enterprise, you should maintain at least ${reqWcFmt} as a working capital liquidity reserve.`
          : language === 'hi'
          ? `आपके ${bizTitle} व्यवसाय के लिए कम से कम ${reqWcFmt} का कार्यशील पूंजी आरक्षित रखना आवश्यक है।`
          : `तुमच्या ${bizTitle} व्यवसायासाठी किमान ${reqWcFmt} चा खेळते भांडवल राखीव निधी ठेवणे आवश्यक आहे.`;

      const answer =
        language === 'en'
          ? `## Short Answer
For your **'${bizTitle}'** enterprise, you must maintain at least **${reqWcFmt}** as a liquid working capital buffer.

## What this means for you
Working capital covers raw materials, power, transport, and unexpected delays before customer revenues arrive.

## Numbers
- **Raw Material Buffer (${bufferDays} days):** ${formatIndianRupees(wc.rawMaterialBufferCost)}
- **Monthly Operating Expenses:** ${formatIndianRupees(wc.monthlyOperatingCosts)}/month
- **Emergency Cash Reserve:** ${formatIndianRupees(wc.emergencyBuffer)}
- **Total Working Capital Required:** **${reqWcFmt}**

## What I recommend
Never spend 100% of your funds on machinery. Keep this buffer in an easily accessible liquid account.

## Next 3 Steps
1. Maintain strict 30-day inventory controls.
2. Collect customer payments on time.
3. Reinvest 20% of monthly surplus into this reserve.`
          : language === 'hi'
          ? `## Short Answer
आपके **'${bizTitle}'** व्यवसाय के लिए कम से कम **${reqWcFmt}** की कार्यशील पूंजी (Working Capital) आरक्षित रखना आवश्यक है।

## What this means for you
यह राशि कच्चा माल, बिजली, भाड़ा और दैनिक खर्च चलाने के लिए आवश्यक है जब तक ग्राहकों से भुगतान न आ जाए।

## आंकड़े
- **कच्चा माल बफर (${bufferDays} दिन):** ${formatIndianRupees(wc.rawMaterialBufferCost)}
- **मासिक परिचालन खर्च:** ${formatIndianRupees(wc.monthlyOperatingCosts)}/माह
- **आपातकालीन आरक्षित:** ${formatIndianRupees(wc.emergencyBuffer)}
- **कुल आवश्यक कार्यशील पूंजी:** **${reqWcFmt}**

## What I recommend
सारे पैसे मशीनों में न लगाएं। यह कार्यशील पूंजी हमेशा हाथ में नकद रखें।

## Next 3 Steps
1. कच्चे माल का हिसाब रखें।
2. उधारी पर नियंत्रण रखें।
3. मासिक लाभ का २०% इस फंड में पुनः लगाएं।`
          : `## Short Answer
तुमच्या **'${bizTitle}'** व्यवसायासाठी किमान **${reqWcFmt}** चा खेळते भांडवल (Working Capital) राखीव निधी ठेवणे आवश्यक आहे.

## What this means for you
कच्चा माल खरेदी, वीज बिल, वाहतूक आणि ग्राहक पेमेंट येईपर्यंतचा रोजचा खर्च सुरळीत चालण्यासाठी ही रक्कम आवश्यक असते.

## वित्तीय ताळेबंद
- **कच्चा माल साठा (${bufferDays} दिवस):** ${formatIndianRupees(wc.rawMaterialBufferCost)}
- **मासिक नियमित खर्च:** ${formatIndianRupees(wc.monthlyOperatingCosts)}/महिना
- **आणीबाणी राखीव निधी:** ${formatIndianRupees(wc.emergencyBuffer)}
- **एकूण आवश्यक खेळते भांडवल:** **${reqWcFmt}**

## What I recommend
सर्व भांडवल उपकरणांवर खर्च करू नका. हा राखीव निधी नेहमी बँक खात्यात हाताशी ठेवा.

## Next 3 Steps
१. कच्च्या मालाचा योग्य साठा ठेवा.
२. ग्राहकांना जास्त उधारी देऊ नका.
३. दरमहा निव्वळ नफ्यातील २०% रक्कम कायम या फंडात जमा करा.`;

      return {
        answer,
        summary,
        voiceSpokenText,
        cards: [
          {
            type: 'WORKING_CAPITAL',
            title: `${bizTitle} — ${language === 'en' ? 'Working Capital Liquidity' : language === 'hi' ? 'कार्यशील पूंजी योजना' : 'खेळते भांडवल तरलता'}`,
            subtitle: `${language === 'en' ? 'Required Buffer' : language === 'hi' ? 'आवश्यक आरक्षित' : 'आवश्यक राखीव'}: ${reqWcFmt}`,
            data: {
              rawMaterialBuffer: `${formatIndianRupees(wc.rawMaterialBufferCost)} (${bufferDays} ${language === 'en' ? 'days' : 'दिवस'})`,
              operatingExpenses: `${formatIndianRupees(wc.monthlyOperatingCosts)} / ${language === 'en' ? 'month' : 'महिना'}`,
              emergencyReserve: formatIndianRupees(wc.emergencyBuffer)
            },
            actionText: language === 'en' ? 'View Working Capital Details' : 'खेळते भांडवल तपशील पाहा',
            actionRoute: '/working-capital'
          }
        ],
        recommendations: [
          language === 'en'
            ? `Maintain at least ${bufferDays} days of raw material inventory funds.`
            : `कच्च्या मालाचे व साहित्याचे पैसे देण्यासाठी किमान ${bufferDays} दिवसांची रोख तरलता हातात ठेवा.`,
          language === 'en'
            ? 'Avoid excessive customer credit; insist on cash or weekly settlements.'
            : 'ग्राहकांना जास्त उधारी न देता रोख किंवा साप्ताहिक पेमेंटचा नियम ठेवा.',
          language === 'en'
            ? 'Reinvest 20% of monthly net surplus into the working capital reserve fund.'
            : 'दरमहा निव्वळ नफ्यातील २०% रक्कम कायम खेळत्या भांडवलाच्या खात्यात राखीव ठेवा.'
        ],
        calculations: {
          ...wc,
          projectCost: context.financialBaseline.projectCost,
          loanComponent: context.financialBaseline.loanComponent
        },
        risks: [language === 'en' ? 'Cash flow crunch if customer credit remains unpaid.' : 'उधारी वसुली अडकल्यास दैनंदिन कामकाज थांबण्याचा धोका.'],
        assumptions: [`दैनिक ${arch.defaultDailyCapacity} ${getLocalized(arch.unitName, language)} उत्पादन क्षमता`, `₹${arch.typicalVariableCost} प्रति युनिट कच्चा खर्च`],
        sources: [{ title: 'RBI Micro-Enterprise Working Capital Norms', isOfficial: true }],
        suggestedNextQuestions: [
          language === 'en' ? 'What will be my monthly loan EMI?' : 'माझा मासिक हप्ता (EMI) किती असेल?',
          language === 'en' ? 'How does 35% PMEGP subsidy work?' : 'PMEGP ३५% सबसिडी कशी मिळेल?',
          language === 'en' ? 'What if sales drop by 30%?' : 'विक्री ३०% घटली तर काय होईल?'
        ],
        trustLevel: 'CALCULATED',
        confidenceScore: 96,
        skillName: 'FINANCIAL_MANAGER'
      };
    }

    // Sub-intent 4: EMI / Repayment
    if (q.includes('emi') || q.includes('हप्ता') || q.includes('किस्त') || q.includes('repayment')) {
      const emiRes = financeTools.calculate_emi({
        loanAmount: context.financialBaseline.loanComponent,
        interestRate: 8.0,
        tenureMonths: 84,
        moratoriumMonths: 6
      });

      const loanFmt = formatIndianRupees(context.financialBaseline.loanComponent);
      const emiFmt = formatIndianRupees(emiRes.regularMonthlyEMI);
      const moratFmt = formatIndianRupees(emiRes.moratoriumMonthlyPayment);

      const summary =
        language === 'en'
          ? `Regular Monthly EMI: ${emiFmt}/month (after 6-month moratorium)`
          : language === 'hi'
          ? `नियमित मासिक किस्त: ${emiFmt}/माह (६ माह छूट के बाद)`
          : `नियमित मासिक हप्ता: ${emiFmt}/महिना (६ महिने सवलतीनंतर)`;

      const voiceSpokenText =
        language === 'en'
          ? `For a ${loanFmt} loan, you pay only ${moratFmt} interest during the first 6 months, then regular EMI of ${emiFmt}.`
          : language === 'hi'
          ? `${loanFmt} ऋण के लिए पहले ६ महीने केवल ${moratFmt} ब्याज देना होगा, उसके बाद नियमित किस्त ${emiFmt} होगी।`
          : `${loanFmt} कर्जासाठी पहिल्या ६ महिन्यांत केवळ ${moratFmt} सवलत व्याज द्यावे लागेल. त्यानंतर नियमित मासिक हप्ता ${emiFmt} असेल.`;

      const answer =
        language === 'en'
          ? `## Short Answer
For a **${loanFmt}** loan at 8.0% interest for 7 years, your regular monthly EMI will be **${emiFmt}/month** after a 6-month initial moratorium.

## What this means for you
During the first 6 months of business setup, you pay only interest (${moratFmt}/month). Regular principal repayment starts from month 7.

## Numbers
- **Total Loan Amount:** ${loanFmt}
- **Annual Interest Rate:** 8.0% reducing balance
- **Moratorium Payment (Months 1–6):** ${moratFmt}/month
- **Regular Monthly EMI (Months 7–84):** **${emiFmt}/month**
- **Total Interest Payable:** ${formatIndianRupees(emiRes.totalInterestPayable)}

## What I recommend
Set aside your monthly EMI into a dedicated bank account by the 5th of every month.

## Next 3 Steps
1. Maintain positive cash flow before taking full loan disbursement.
2. Pay EMI on or before the due date to protect your CIBIL score.
3. Apply for PMEGP subsidy to reduce net loan principal.`
          : language === 'hi'
          ? `## Short Answer
**${loanFmt}** के ८.०% ब्याज पर ७ वर्ष के ऋण के लिए, ६ महीने की छूट के बाद आपकी नियमित मासिक किस्त **${emiFmt}/माह** होगी।

## What this means for you
पहले ६ महीने व्यापार जमाने के दौरान आपको केवल ${moratFmt}/माह ब्याज देना होगा। मुख्य किस्त ७वें महीने से शुरू होगी।

## आंकड़े
- **कुल बैंक ऋण:** ${loanFmt}
- **ब्याज दर:** ८.०% वार्षिक
- **छूट अवधि भुगतान (माह १–६):** ${moratFmt}/माह
- **नियमित मासिक किस्त (माह ७–८४):** **${emiFmt}/माह**
- **कुल ब्याज:** ${formatIndianRupees(emiRes.totalInterestPayable)}

## What I recommend
हर महीने की ५ तारीख से पहले किस्त की राशि अलग खाते में जमा रखें।

## Next 3 Steps
1. नियमित ग्राहक सुनिश्चित करें।
2. समय पर किस्त चुकाकर सिबिल स्कोर अच्छा रखें।
3. PMEGP ३५% सब्सिडी का लाभ लें।`
          : `## Short Answer
**${loanFmt}** च्या ८.०% व्याजदरावरील ७ वर्षांच्या कर्जासाठी, ६ महिन्यांच्या सवलतीनंतर तुमचा नियमित मासिक हप्ता **${emiFmt}/महिना** असेल.

## What this means for you
पहिल्या ६ महिन्यांत व्यवसाय जम बसवताना तुम्हाला मुद्दल भरावी लागत नाही, केवळ ${moratFmt}/महिना व्याज द्यावे लागते. ७ व्या महिन्यापासून नियमित हप्ता सुरू होतो.

## वित्तीय ताळेबंद
- **एकूण बँक कर्ज:** ${loanFmt}
- **व्याजदर:** ८.०% वार्षिक (घटत्या शिल्लक पद्धतीने)
- **सवलत कालावधी (महिने १ ते ६):** ${moratFmt}/महिना
- **नियमित मासिक हप्ता (महिने ७ ते ८४):** **${emiFmt}/महिना**
- **एकूण देय व्याज:** ${formatIndianRupees(emiRes.totalInterestPayable)}

## What I recommend
मासिक हप्त्याची रक्कम दरमहा ५ तारखेच्या आत स्वतंत्र बँक खात्यात बाजूला काढून ठेवा.

## Next 3 Steps
१. नियमित मासिक नफ्यातून हप्ता भरण्याचे नियोजन करा.
२. हप्ता वेळेवर भरून सिबिल (CIBIL) स्कोअर उत्तम ठेवा.
३. PMEGP ३५% सबसिडी मिळवून कर्जाचा भार कमी करा.`;

      return {
        answer,
        summary,
        voiceSpokenText,
        cards: [
          {
            type: 'EMI_SCHEDULE',
            title: `${bizTitle} — ${language === 'en' ? 'Loan Repayment Schedule' : language === 'hi' ? 'ऋण पुनर्भुगतान अनुसूची' : 'कर्ज परतफेड वेळापत्रक'}`,
            subtitle: `${language === 'en' ? 'Loan' : 'कर्ज'}: ${loanFmt} @ 8.0% (7 ${language === 'en' ? 'years' : 'वर्षे'})`,
            data: {
              regularEMI: emiFmt,
              moratoriumPayment: `${moratFmt} / ${language === 'en' ? 'month (6 months)' : 'महिना (६ महिने)'}`,
              totalInterest: formatIndianRupees(emiRes.totalInterestPayable),
              affordability: language === 'en' ? 'Affordable (DSCR > 2.0)' : 'सहज परवडणारा (DSCR > 2.0)'
            },
            actionText: language === 'en' ? 'View 84-Month Amortization Schedule' : 'पूर्ण ८४ महिन्यांचे वेळापत्रक पाहा',
            actionRoute: '/emi'
          }
        ],
        recommendations: [
          language === 'en'
            ? 'During the 6-month moratorium, pay only interest to keep early cash flow stress-free.'
            : 'पहिल्या ६ महिन्यांत व्यवसाय जम बसवताना केवळ व्याज भरावे लागते, ज्यामुळे रोख पैशांची चणचण भासत नाही.',
          language === 'en'
            ? 'Set aside EMI funds into a designated savings account by the 5th of every month.'
            : 'मासिक हप्त्याची रक्कम दरमहा ५ तारखेच्या आत स्वतंत्र बँक खात्यात बाजूला काढून ठेवा.'
        ],
        calculations: {
          ...emiRes,
          projectCost: context.financialBaseline.projectCost,
          loanComponent: context.financialBaseline.loanComponent,
          regularMonthlyEMI: emiRes.regularMonthlyEMI
        },
        risks: [language === 'en' ? 'Delayed EMI payments damage your bank CIBIL credit score.' : 'नियमित नफ्यातून हप्ता न भरल्यास सिबिल (CIBIL) स्कोअर खराब होऊ शकतो.'],
        assumptions: ['८.०% वार्षिक व्याजदर', '८४ महिने मुदत (६ महिने मोरेटोरियम)'],
        sources: [{ title: 'Standard Reducing Balance Banking Amortization Model', isOfficial: true }],
        suggestedNextQuestions: [
          language === 'en' ? 'What if sales drop by 30%?' : 'विक्री ३०% घटली तर हप्ता कसा फेडणार?',
          language === 'en' ? 'How does 35% PMEGP subsidy work?' : 'PMEGP ३५% सबसिडी कशी मिळेल?',
          language === 'en' ? 'How much working capital buffer should I maintain?' : 'खेळते भांडवल किती ठेवावे?'
        ],
        trustLevel: 'CALCULATED',
        confidenceScore: 98,
        skillName: 'FINANCIAL_MANAGER'
      };
    }

    // Default: Project Cost Structuring (PS-91 Model)
    const struct = financeTools.calculate_project_cost({ capital: cap, marginPercent: 10 });
    const projCostFmt = formatIndianRupees(struct.projectCost);
    const loanFmt = formatIndianRupees(struct.loanComponent);
    const subFmt = formatIndianRupees(struct.estimatedSubsidy);

    const summary =
      language === 'en'
        ? `${ownCapFmt} Own Capital creates a ₹${struct.projectCost.toLocaleString('en-IN')} Total Project (PS-91 Model)`
        : language === 'hi'
        ? `${ownCapFmt} पूंजी पर ₹${struct.projectCost.toLocaleString('en-IN')} का कुल प्रोजेक्ट (PS-91 मॉडल)`
        : `${ownCapFmt} वर ${projCostFmt} चा एकूण प्रकल्प (PS-91 मॉडेल)`;

    const voiceSpokenText =
      language === 'en'
        ? `With your ${ownCapFmt} 10% own equity, PS-91 structuring creates a ${projCostFmt} total project capacity with ${loanFmt} loan and up to ${subFmt} PMEGP subsidy.`
        : language === 'hi'
        ? `आपकी ${ownCapFmt} की १०% पूंजी पर ${projCostFmt} का प्रोजेक्ट बनता है, जिसमें ${loanFmt} ऋण और ${subFmt} सरकारी सब्सिडी संभव है।`
        : `तुमच्या ${ownCapFmt} च्या १० टक्के स्वतःच्या भांडवलावर ${projCostFmt} चा प्रकल्प तयार होतो, ज्यामध्ये ${loanFmt} कर्ज आणि ${subFmt} सरकारी सबसिडी शक्य आहे.`;

    const answer =
      language === 'en'
        ? `## Short Answer
With your **${ownCapFmt}** available capital (10% equity), the PS-91 financial structure creates a total project capacity of **${projCostFmt}** with **${loanFmt}** in potential loan and up to **${subFmt}** in PMEGP government subsidy.

## What this means for you
Under government guidelines, your 10% equity contribution unlocks a 90% bank loan structure.

## Numbers
- **Own Equity Contribution (10%):** ${ownCapFmt}
- **Total Project Capacity:** ${projCostFmt}
- **Bank Loan Component (90%):** ${loanFmt}
- **Estimated PMEGP Subsidy (35% rural):** ${subFmt}
- **Net Debt after Subsidy:** ${formatIndianRupees(struct.netLoanAfterSubsidy)}

## What I recommend
Apply through the District Industries Centre (DIC) with a Detailed Project Report (DPR).

## Next 3 Steps
1. Collect machinery quotations for your DPR.
2. Register for PMEGP subsidy on the official KVIC portal.
3. Confirm bank loan appraisal before ordering equipment.`
        : language === 'hi'
        ? `## Short Answer
आपकी **${ownCapFmt}** पूंजी (१०% इक्विटी) के साथ, PS-91 वित्तीय मॉडल के तहत **${projCostFmt}** की कुल प्रोजेक्ट क्षमता बनती है, जिसमें **${loanFmt}** ऋण और **${subFmt}** PMEGP सब्सिडी संभव है।

## What this means for you
सरकारी दिशा-निर्देशों के अनुसार, आपकी १०% पूंजी ९०% बैंक ऋण संरचना को सक्षम बनाती है।

## आंकड़े
- **स्वयं की पूंजी (१०%):** ${ownCapFmt}
- **कुल प्रोजेक्ट लागत:** ${projCostFmt}
- **बैंक ऋण (९०%):** ${loanFmt}
- **PMEGP सब्सिडी (३५% ग्रामीण):** ${subFmt}
- **सब्सिडी के बाद शुद्ध ऋण:** ${formatIndianRupees(struct.netLoanAfterSubsidy)}

## What I recommend
विस्तृत प्रोजेक्ट रिपोर्ट (DPR) के साथ जिला उद्योग केंद्र (DIC) में आवेदन करें।

## Next 3 Steps
1. आवश्यक मशीनरी के कोटेशन लें।
2. आधिकारिक KVIC पोर्टल पर PMEGP आवेदन करें।
3. बैंक से सैद्धांतिक मंजूरी मिलने के बाद ही उपकरण खरीदें।`
        : `## Short Answer
तुमच्या **${ownCapFmt}** उपलब्ध भांडवलावर (१०% इक्विटी), PS-91 वित्तीय मॉडेलनुसार **${projCostFmt}** ची एकूण प्रकल्प क्षमता तयार होते, ज्यामध्ये **${loanFmt}** चे बँक कर्ज आणि **${subFmt}** ची PMEGP शासकीय सबसिडी मिळू शकते.

## What this means for you
शासकीय व बँक निकषांनुसार, १०% स्वतःचे भांडवल टाकून उर्वरित ९०% प्रकल्पासाठी कर्ज व सबसिडी जोडता येते.

## वित्तीय रचना (PS-91):
- **स्वतःचे भांडवल (१०%):** ${ownCapFmt}
- **एकूण प्रकल्प क्षमता:** ${projCostFmt}
- **संभाव्य बँक कर्ज (९०%):** ${loanFmt}
- **अंदाजित PMEGP सबसिडी (३५% ग्रामीण):** ${subFmt}
- **सबसिडी वजा जाता प्रत्यक्ष कर्ज भार:** ${formatIndianRupees(struct.netLoanAfterSubsidy)}

## What I recommend
प्रकल्प अहवाल (DPR) तयार करून जिल्हा उद्योग केंद्र (DIC) कडे PMEGP योजनेसाठी अर्ज करा.

## Next 3 Steps
१. आवश्यक मशिनरी व उपकरणांचे अधिकृत कोटेशन मिळवा.
२. अधिकृत KVIC पोर्टलवर PMEGP सबसिडीसाठी ऑनलाइन नोंदणी करा.
३. बँकेची प्राथमिक मंजुरी मिळाल्यावरच उपकरणांची खरेदी करा.`;

    return {
      answer,
      summary,
      voiceSpokenText,
      cards: [
        {
          type: 'FINANCIAL_STRUCTURE',
          title: `PS-91 ${language === 'en' ? 'Capital Structuring Model' : 'भांडवल वाटप आराखडा'} — ${bizTitle}`,
          subtitle: `${language === 'en' ? 'Own Margin' : 'स्वतःचे भांडवल'}: ${ownCapFmt} (10%)`,
          data: {
            projectCost: projCostFmt,
            loanComponent: `${loanFmt} (90%)`,
            estimatedSubsidy: `${subFmt} (35% PMEGP)`,
            netDebt: formatIndianRupees(struct.netLoanAfterSubsidy)
          },
          actionText: language === 'en' ? 'View Loan EMI Schedule' : 'कर्जाचा मासिक हप्ता (EMI) पाहा',
          actionRoute: '/emi'
        }
      ],
      recommendations: [
        language === 'en'
          ? 'Putting in 10% own equity to unlock 90% bank leverage is the authoritative PS-91 financial structure.'
          : '१०% स्वतःचे भांडवल टाकून ९०% बँक अर्थसहाय्य मिळवणे ही PS-91 अंतर्गत प्रमाणित वित्तीय रचना आहे.',
        language === 'en'
          ? 'Apply through District Industries Centre (DIC) with a Detailed Project Report (DPR).'
          : 'PMEGP अंतर्गत प्रकल्प अहवाल (DPR) तयार करून जिल्हा उद्योग केंद्रात अर्ज करा.'
      ],
      calculations: {
        ...struct,
        projectCost: struct.projectCost,
        loanComponent: struct.loanComponent
      },
      risks: [language === 'en' ? 'Calculations are mathematical models; actual approval depends on bank credit appraisal.' : 'ही केवळ गणितीय रचना आहे; प्रत्यक्ष कर्ज मंजुरी बँकेच्या पत पडताळणीवर अवलंबून असते.'],
      assumptions: ['10% Own Capital Equity', '35% PMEGP Rural Subsidy Norm'],
      sources: [{ title: 'KVIC PMEGP Operational Guidelines', url: 'https://www.kviconline.gov.in/pmegp/', isOfficial: true }],
      suggestedNextQuestions: [
        language === 'en' ? 'What will be my monthly loan EMI?' : 'माझा मासिक हप्ता (EMI) किती असेल?',
        language === 'en' ? 'How does 35% PMEGP subsidy work?' : 'PMEGP ३५% सबसिडी कशी मिळेल?',
        language === 'en' ? 'How much working capital buffer should I maintain?' : 'खेळते भांडवल किती ठेवावे?'
      ],
      trustLevel: 'CALCULATED',
      confidenceScore: 95,
      skillName: 'FINANCIAL_MANAGER'
    };
  }
}
