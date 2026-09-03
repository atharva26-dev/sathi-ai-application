export type MasterIntentType =
  | 'START_BUSINESS'
  | 'UNKNOWN_BUSINESS_MENTOR'
  | 'BUSINESS_MODEL'
  | 'MARKET_ANALYSIS'
  | 'MARKET_GAP'
  | 'COMPETITION'
  | 'CUSTOMERS'
  | 'PRICING'
  | 'PRICE_WAR'
  | 'MARKETING'
  | 'SALES'
  | 'CREDIT_SALES'
  | 'OPERATIONS'
  | 'SUPPLIERS'
  | 'EQUIPMENT'
  | 'STAFFING'
  | 'CASH_FLOW'
  | 'CASH_FLOW_DIAGNOSIS'
  | 'BUDGET'
  | 'PROFIT'
  | 'LOSS'
  | 'BREAK_EVEN'
  | 'WORKING_CAPITAL'
  | 'LOAN'
  | 'EMI'
  | 'SCHEME'
  | 'ELIGIBILITY'
  | 'DOCUMENTS'
  | 'ACCOUNTING'
  | 'TAX'
  | 'RISK'
  | 'EXPANSION'
  | 'BUSINESS_COMPARISON'
  | 'ALTERNATIVE_BUSINESS'
  | 'GENERAL_BUSINESS'
  | 'MENTORING';

export interface DetectedIntent {
  intent: MasterIntentType;
  confidence: number;
  isAlternativeExploration: boolean;
  isSwitchRequested: boolean;
  targetSwitchBusiness?: string;
  extractedCapital?: number;
  extractedLocation?: string;
  normalizedQuery: string;
}

export const detectIntentAndSwitch = (query: string, currentActiveBusiness: string): DetectedIntent => {
  const q = query.toLowerCase().trim();

  // 1. Parameter Extraction (Capital updates e.g. "I have only ₹50,000", "माझ्याकडे २ लाख आहेत")
  let extractedCapital: number | undefined = undefined;
  const cleanQ = query.replace(/,/g, '');
  const lakhMatch = cleanQ.match(/(?:₹|\bRs\.?|\bINR)?\s*([0-9]+(?:\.[0-9]+)?)\s*(?:lakh|lac|लाख|लाख रुपये)/i);
  if (lakhMatch && lakhMatch[1]) {
    extractedCapital = Math.round(parseFloat(lakhMatch[1]) * 100000);
  } else {
    const thousandMatch = cleanQ.match(/(?:₹|\bRs\.?|\bINR)?\s*([0-9]+)\s*(?:thousand|k|हजार|हजार रुपये)/i);
    if (thousandMatch && thousandMatch[1]) {
      extractedCapital = parseInt(thousandMatch[1], 10) * 1000;
    } else {
      const directNumMatch = cleanQ.match(/(?:₹|\bRs\.?|\bINR)\s*([0-9]{4,8})/i);
      if (directNumMatch && directNumMatch[1]) {
        extractedCapital = parseInt(directNumMatch[1], 10);
      }
    }
  }

  // 2. Unknown Business / "I don't know what to start" Mentoring Request
  const isUnknownBusiness =
    q.includes("don't know what business") ||
    q.includes('dont know what business') ||
    q.includes('what business should i start') ||
    q.includes('what business is best for me') ||
    q.includes('which business is good') ||
    q.includes('which business should i start') ||
    q.includes('suggest me a business') ||
    q.includes('guide me what to start') ||
    q.includes('find the right business') ||
    q.includes('find business') ||
    q.includes('समजत नाही कोणता व्यवसाय') ||
    q.includes('कोणता व्यवसाय सुरू करावा') ||
    q.includes('कोणता व्यवसाय करावा') ||
    q.includes('कोणता व्यवसाय चांगला') ||
    q.includes('माझ्या गावात कोणता व्यवसाय') ||
    q.includes('गावात कोणता व्यवसाय') ||
    q.includes('काय सुरू करू') ||
    q.includes('काय करावे') ||
    q.includes('मुझे नहीं पता कौन सा बिजनेस') ||
    q.includes('मेरे गांव में कौन सा व्यवसाय') ||
    q.includes('गांव में कौन सा व्यवसाय') ||
    q.includes('कौन सा व्यापार शुरू करें') ||
    q.includes('कौन सा बिजनेस सही रहेगा');

  if (isUnknownBusiness) {
    return {
      intent: 'UNKNOWN_BUSINESS_MENTOR',
      confidence: 0.98,
      isAlternativeExploration: false,
      isSwitchRequested: false,
      extractedCapital,
      normalizedQuery: q
    };
  }

  // 3. Explicit Alternative Business Request (MUST NOT switch, but allowed to list alternatives)
  const isAlternative =
    q.includes('what other business') ||
    q.includes('which other business') ||
    q.includes('suggest alternatives') ||
    q.includes('alternative business') ||
    q.includes('other options') ||
    q.includes('वेगळा कोणता व्यवसाय') ||
    q.includes('दुसरा कोणता व्यवसाय') ||
    q.includes('इतर कोणते व्यवसाय') ||
    q.includes('दुसरा पर्याय') ||
    q.includes('अन्य कौन सा व्यवसाय') ||
    q.includes('अन्य विकल्प') ||
    q.includes('कोई और बिजनेस') ||
    q.includes('और क्या शुरू कर सकता हूँ');

  if (isAlternative) {
    return {
      intent: 'ALTERNATIVE_BUSINESS',
      confidence: 0.95,
      isAlternativeExploration: true,
      isSwitchRequested: false,
      extractedCapital,
      normalizedQuery: q
    };
  }

  // 4. Explicit Business Switch Request
  const switchPatterns = [
    { regex: /(?:i want to start|i want to do|switch to|change to|planning for|i changed my business to)\s+([a-zA-Z\s]+)/i },
    { regex: /(?:मला|मी आता|मी माझा व्यवसाय बदलून)\s+([^\s]+)\s+(?:सुरू करायचे आहे|करायचा विचार आहे|बदलायचा आहे|करायचा ठरवला)/i },
    { regex: /(?:मुझे|मैं अब|मैंने बिजनेस बदलकर)\s+([^\s]+)\s+(?:शुरू करना चाहता हूँ|करना है|बदलना चाहता हूँ|शुरू करने का सोचा है)/i }
  ];

  for (const p of switchPatterns) {
    const match = query.match(p.regex);
    if (match && match[1]) {
      const requestedBiz = match[1].trim();
      if (
        !requestedBiz.toLowerCase().includes(currentActiveBusiness.toLowerCase()) &&
        requestedBiz.length > 2
      ) {
        return {
          intent: 'START_BUSINESS',
          confidence: 0.92,
          isAlternativeExploration: false,
          isSwitchRequested: true,
          targetSwitchBusiness: requestedBiz,
          extractedCapital,
          normalizedQuery: q
        };
      }
    }
  }

  // 5. Credit Sales (Udhaari) Discipline
  if (
    q.includes('credit') ||
    q.includes('udhaari') ||
    q.includes('udhari') ||
    q.includes('उधारी') ||
    q.includes('उधार') ||
    q.includes('पैसे बुडतात') ||
    q.includes('पैसे देत नाहीत')
  ) {
    return { intent: 'CREDIT_SALES', confidence: 0.96, isAlternativeExploration: false, isSwitchRequested: false, extractedCapital, normalizedQuery: q };
  }

  // 6. Competitor Price Undercutting / Price War
  if (
    q.includes('cheaper') ||
    q.includes('selling cheaper') ||
    q.includes('स्वस्त विकतो') ||
    q.includes('स्वस्त विकत आहे') ||
    q.includes('सस्ता बेच रहा है') ||
    q.includes('किंमत कमी') ||
    q.includes('rate war') ||
    q.includes('price war')
  ) {
    return { intent: 'PRICE_WAR', confidence: 0.95, isAlternativeExploration: false, isSwitchRequested: false, extractedCapital, normalizedQuery: q };
  }

  // 7. Cash Flow Diagnosis (Sales good but cash short / no profit)
  if (
    (q.includes('sales') && q.includes('no money')) ||
    (q.includes('customers') && q.includes('no profit')) ||
    q.includes('no money left at month end') ||
    q.includes('पैशांची चणचण') ||
    q.includes('नफा राहत नाही') ||
    q.includes('बचत होत नाही') ||
    q.includes('महिनाअखेर पैसे संपतात') ||
    q.includes('बिक्री अच्छी है पर पैसा नहीं बचता')
  ) {
    return { intent: 'CASH_FLOW_DIAGNOSIS', confidence: 0.96, isAlternativeExploration: false, isSwitchRequested: false, extractedCapital, normalizedQuery: q };
  }

  // 8. Intent: EMI & Loan Affordability
  if (q.includes('emi') || q.includes('हप्ता') || q.includes('किस्त') || q.includes('repayment')) {
    return { intent: 'EMI', confidence: 0.95, isAlternativeExploration: false, isSwitchRequested: false, extractedCapital, normalizedQuery: q };
  }

  // 9. Intent: WORKING_CAPITAL
  if (q.includes('working capital') || q.includes('खेळते भांडवल') || q.includes('कार्यशील पूंजी') || q.includes('buffer') || q.includes('how much cash')) {
    return { intent: 'WORKING_CAPITAL', confidence: 0.95, isAlternativeExploration: false, isSwitchRequested: false, extractedCapital, normalizedQuery: q };
  }

  // 10. Intent: BREAK_EVEN
  if (q.includes('break even') || q.includes('ब्रेक इव्हन') || q.includes('नफा-तोटा बरोबरी') || q.includes('कमीतकमी किती विक्री')) {
    return { intent: 'BREAK_EVEN', confidence: 0.95, isAlternativeExploration: false, isSwitchRequested: false, extractedCapital, normalizedQuery: q };
  }

  // 11. Intent: SCHEME & ELIGIBILITY & DOCUMENTS
  if (q.includes('pmegp') || q.includes('mudra') || q.includes('सबसिडी') || q.includes('subsidy') || q.includes('योजना') || q.includes('scheme')) {
    return { intent: 'SCHEME', confidence: 0.94, isAlternativeExploration: false, isSwitchRequested: false, extractedCapital, normalizedQuery: q };
  }
  if (q.includes('कागदपत्रे') || q.includes('documents') || q.includes('पात्रता') || q.includes('eligibility')) {
    return { intent: 'DOCUMENTS', confidence: 0.92, isAlternativeExploration: false, isSwitchRequested: false, extractedCapital, normalizedQuery: q };
  }

  // 12. Intent: LOAN & BUDGET & CASH_FLOW
  if (q.includes('should i take a loan') || q.includes('कर्ज घ्यावे का') || q.includes('loan requirement') || q.includes('कर्ज') || q.includes('start smaller')) {
    return { intent: 'LOAN', confidence: 0.93, isAlternativeExploration: false, isSwitchRequested: false, extractedCapital, normalizedQuery: q };
  }
  if (q.includes('cash flow') || q.includes('पैसे संपले') || q.includes('रोख प्रवाह')) {
    return { intent: 'CASH_FLOW', confidence: 0.92, isAlternativeExploration: false, isSwitchRequested: false, extractedCapital, normalizedQuery: q };
  }
  if (q.includes('budget') || q.includes('अंदाजपत्रक') || q.includes('बजेट') || q.includes('खर्च वाटप') || q.includes('project cost')) {
    return { intent: 'BUDGET', confidence: 0.9, isAlternativeExploration: false, isSwitchRequested: false, extractedCapital, normalizedQuery: q };
  }

  // 13. Intent: EQUIPMENT / TOOLS
  if (q.includes('tools') || q.includes('साधने') || q.includes('मशिन') || q.includes('मशीन') || q.includes('equipment') || q.includes('काय खरेदी करावे') || q.includes('what to buy')) {
    return { intent: 'EQUIPMENT', confidence: 0.95, isAlternativeExploration: false, isSwitchRequested: false, extractedCapital, normalizedQuery: q };
  }

  // 14. Intent: CUSTOMERS / SALES / MARKETING
  if (q.includes('customer') || q.includes('ग्राहक') || q.includes('पहिले ग्राहक') || q.includes('ग्राहक कसे मिळवू') || q.includes('कस्टमर') || q.includes('enough customers') || q.includes('ग्राहक पुरेसे आहेत का')) {
    return { intent: 'CUSTOMERS', confidence: 0.94, isAlternativeExploration: false, isSwitchRequested: false, extractedCapital, normalizedQuery: q };
  }
  if (q.includes('marketing') || q.includes('मार्केटिंग') || q.includes('प्रचार') || q.includes('जाहिरात') || q.includes('branding') || q.includes('बोर्ड')) {
    return { intent: 'MARKETING', confidence: 0.93, isAlternativeExploration: false, isSwitchRequested: false, extractedCapital, normalizedQuery: q };
  }
  if (q.includes('sales') || q.includes('विक्री वाढवा') || q.includes('खप') || q.includes('विक्री कशी वाढवू')) {
    return { intent: 'SALES', confidence: 0.92, isAlternativeExploration: false, isSwitchRequested: false, extractedCapital, normalizedQuery: q };
  }

  // 15. Intent: PRICING
  if (q.includes('price') || q.includes('दर') || q.includes('दरपत्रक') || q.includes('किंमत') || q.includes('काय दर ठेवावा') || q.includes('charge') || q.includes('expensive')) {
    return { intent: 'PRICING', confidence: 0.94, isAlternativeExploration: false, isSwitchRequested: false, extractedCapital, normalizedQuery: q };
  }

  // 16. Intent: COMPETITION & MARKET_GAP
  if (q.includes('competitor') || q.includes('स्पर्धा') || q.includes('स्पर्धक') || q.includes('शॉप्स आधीच आहेत') || q.includes('compete') || q.includes('how many shops')) {
    return { intent: 'COMPETITION', confidence: 0.94, isAlternativeExploration: false, isSwitchRequested: false, extractedCapital, normalizedQuery: q };
  }
  if (q.includes('gap') || q.includes('संधी') || q.includes('मागणी') || q.includes('market gap') || q.includes('मागणी कशाला आहे')) {
    return { intent: 'MARKET_GAP', confidence: 0.92, isAlternativeExploration: false, isSwitchRequested: false, extractedCapital, normalizedQuery: q };
  }

  // 17. Intent: SUPPLIERS & OPERATIONS & STAFFING
  if (q.includes('supplier') || q.includes('माल कुठून आणू') || q.includes('कच्चा माल') || q.includes('सप्लायर') || q.includes('होलसेल')) {
    return { intent: 'SUPPLIERS', confidence: 0.93, isAlternativeExploration: false, isSwitchRequested: false, extractedCapital, normalizedQuery: q };
  }
  if (q.includes('operations') || q.includes('दैनिक कामकाज') || q.includes('वेळ') || q.includes('doorstep') || q.includes('घरपोच')) {
    return { intent: 'OPERATIONS', confidence: 0.91, isAlternativeExploration: false, isSwitchRequested: false, extractedCapital, normalizedQuery: q };
  }
  if (q.includes('staff') || q.includes('मदतनीस') || q.includes('कर्मचारी') || q.includes('पगार') || q.includes('माणूस ठेवावा का')) {
    return { intent: 'STAFFING', confidence: 0.9, isAlternativeExploration: false, isSwitchRequested: false, extractedCapital, normalizedQuery: q };
  }

  // 18. Intent: RISK & LOSS & DISTRESS
  if (q.includes('risk') || q.includes('धोका') || q.includes('नुकसान') || q.includes('विक्री झाली नाही तर') || q.includes('तोटा') || q.includes('loss') || q.includes('low sales') || q.includes('failing') || q.includes('बुडतोय')) {
    return { intent: 'RISK', confidence: 0.93, isAlternativeExploration: false, isSwitchRequested: false, extractedCapital, normalizedQuery: q };
  }

  // 19. Intent: EXPANSION & SCALING
  if (q.includes('expansion') || q.includes('scale') || q.includes('व्यवसाय वाढवणे') || q.includes('विस्तार') || q.includes('पुढील पाऊल') || q.includes('शाखा') || q.includes('nearby town') || q.includes('शहरात वाढवू का')) {
    return { intent: 'EXPANSION', confidence: 0.92, isAlternativeExploration: false, isSwitchRequested: false, extractedCapital, normalizedQuery: q };
  }

  // 20. Intent: ACCOUNTING & TAX & HOUSEHOLD SEPARATION
  if (q.includes('tax') || q.includes('gst') || q.includes('बिलिंग') || q.includes('हिशोब') || q.includes('खातेवही') || q.includes('accounting') || q.includes('घरखर्च')) {
    return { intent: 'ACCOUNTING', confidence: 0.92, isAlternativeExploration: false, isSwitchRequested: false, extractedCapital, normalizedQuery: q };
  }

  // 21. Intent: STARTUP_GUIDE / START_BUSINESS
  if (
    q.includes('how to start') ||
    q.includes('how do i start') ||
    q.includes('suru karu') ||
    q.includes('सुरू करू') ||
    q.includes('कसा सुरू') ||
    q.includes('शुरू करूँ') ||
    q.includes('शुरू कैसे करें') ||
    q.includes('start') ||
    q.includes('सुरवात') ||
    q.includes('पहिले पाऊल') ||
    q.includes('पहला कदम') ||
    q.includes('मार्गदर्शन') ||
    q.includes('how to do')
  ) {
    return {
      intent: 'START_BUSINESS',
      confidence: 0.96,
      isAlternativeExploration: false,
      isSwitchRequested: false,
      extractedCapital,
      normalizedQuery: q
    };
  }

  // 22. Intent: MENTORING / ADVISORY
  if (q.includes('good') || q.includes('योग्य आहे का') || q.includes('चांगला आहे का') || q.includes('afford') || q.includes('परवडेल का') || q.includes('सल्ला')) {
    return {
      intent: 'MENTORING',
      confidence: 0.9,
      isAlternativeExploration: false,
      isSwitchRequested: false,
      extractedCapital,
      normalizedQuery: q
    };
  }

  return {
    intent: 'GENERAL_BUSINESS',
    confidence: 0.85,
    isAlternativeExploration: false,
    isSwitchRequested: false,
    extractedCapital,
    normalizedQuery: q
  };
};
