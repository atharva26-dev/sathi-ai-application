import { ChatMessage, LanguageCode, UserProfile } from '../types';
import { storageService } from './storageService';
import { profileService } from './profileService';

const CHAT_HISTORY_KEY = 'chat_messages_v2';
const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';

export const getDynamicSuggestedQuestions = (lang: LanguageCode = 'en', business?: string): string[] => {
  const biz = business || 'व्यवसाय (Business)';

  if (lang === 'mr') {
    return [
      `माझ्या भागात ${biz} साठी ग्राहक कसे मिळवायचे?`,
      'माझा मासिक हप्ता (EMI) किती येईल?',
      'मी स्वतःचे किती पैसे गुंतवावे?',
      'PMEGP योजनेतून ३५% सबसिडी कशी मिळेल?',
      'विक्री ३०% घटली तर काय होईल?',
      'खेळते भांडवल किती ठेवावे?',
      'माझे स्थानिक प्रतिस्पर्धी कोण आहेत?'
    ];
  }

  if (lang === 'hi') {
    return [
      `मेरे इलाके में ${biz} के ग्राहक कैसे प्राप्त करें?`,
      'मेरी मासिक किस्त (EMI) कितनी होगी?',
      'मुझे अपनी कितनी पूंजी लगानी चाहिए?',
      'PMEGP योजना से ३५% सब्सिडी कैसे मिलेगी?',
      'अगर बिक्री ३०% घट गई तो क्या होगा?',
      'कार्यशील पूंजी (Working Capital) कितनी रखनी चाहिए?',
      'मेरे प्रतिस्पर्धी कौन हैं?'
    ];
  }

  return [
    `How do I get customers for my ${biz}?`,
    'What will be my monthly loan EMI?',
    'How much of my own capital should I invest?',
    'How does 35% PMEGP subsidy work?',
    'What happens if sales drop by 30%?',
    'How much working capital buffer should I maintain?',
    'Who are my local competitors?'
  ];
};

export const getInitialWelcomeMessage = (lang: LanguageCode = 'en', profile?: UserProfile): ChatMessage => {
  const name = profile?.name || 'मित्र (Friend)';
  const biz = profile?.desiredBusiness || 'व्यवसाय (Business)';
  const loc = profile?.village ? `${profile.village}, ${profile.block || ''}` : 'तुमचा परिसर (Your Area)';

  let text = '';
  if (lang === 'mr') {
    text = `नमस्कार ${name}! मी SAATHI आहे - तुमच्या व्यवसायाचा विश्वासू मार्गदर्शक. तुमच्या ${loc} परिसरातील '${biz}' व्यवसायाबाबत, नफा, कर्ज, खेळते भांडवल किंवा ग्राहकांविषयी कोणताही प्रश्न विचारा.`;
  } else if (lang === 'hi') {
    text = `नमस्ते ${name}! मैं SAATHI हूँ - आपके व्यापार का मार्गदर्शक। अपने ${loc} में '${biz}' व्यवसाय, लाभ, ऋण, कार्यशील पूंजी या ग्राहकों के बारे में कुछ भी पूछें।`;
  } else {
    text = `Namaskar ${name}! I am SAATHI, your AI business intelligence and financial mentor. Ask me anything about your '${biz}' enterprise in ${loc}, profit margins, loan EMI, working capital, or customer acquisition.`;
  }

  return {
    id: 'msg_welcome_' + lang,
    sender: 'saathi',
    text,
    timestamp: Date.now(),
    cards: [
      {
        type: 'OPPORTUNITY',
        title: `🎯 ${biz}`,
        subtitle: `स्थान: ${loc} | स्वतःचे भांडवल: ₹${(profile?.ownCapital || 50000).toLocaleString('en-IN')}`,
        data: {
          location: loc,
          capital: `₹${(profile?.ownCapital || 50000).toLocaleString('en-IN')}`,
          status: 'सक्रिय नियोजन (Active Plan)'
        },
        actionText: 'बाजार संधी व नफा तपासा',
        actionRoute: '/market-gap'
      }
    ]
  };
};

export const conversationService = {
  getMessages(lang: LanguageCode = 'en'): ChatMessage[] {
    const profile = profileService.getProfile();
    const defaultList = [getInitialWelcomeMessage(lang, profile)];
    return storageService.get<ChatMessage[]>(CHAT_HISTORY_KEY + '_' + lang, defaultList);
  },

  saveMessages(lang: LanguageCode, messages: ChatMessage[]): void {
    storageService.set(CHAT_HISTORY_KEY + '_' + lang, messages);
  },

  getSuggestedQuestions(lang: LanguageCode = 'en'): string[] {
    const profile = profileService.getProfile();
    return getDynamicSuggestedQuestions(lang, profile.desiredBusiness);
  },

  async sendMessage(userText: string, lang: LanguageCode = 'en', isVoice = false): Promise<ChatMessage> {
    const history = this.getMessages(lang);
    const profile = profileService.getProfile();

    const userMsg: ChatMessage = {
      id: 'usr_msg_' + Date.now(),
      sender: 'user',
      text: userText,
      timestamp: Date.now(),
      isVoiceInput: isVoice
    };

    history.push(userMsg);
    this.saveMessages(lang, history);

    // Attempt live backend AI orchestrator dispatch
    try {
      const response = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          language: lang,
          userId: profile.id,
          context: {
            userId: profile.id,
            capital: profile.ownCapital || 50000,
            location: profile.village ? `${profile.village}, ${profile.block || profile.district || ''}` : 'Local Area',
            businessName: profile.desiredBusiness || 'Mobile & Electronics Repair'
          }
        })
      });

      if (response.ok) {
        const json = await response.json();
        const data = json.data;

        const saathiReply: ChatMessage = {
          id: 'saathi_msg_' + Date.now(),
          sender: 'saathi',
          text: data.answer || data.summary,
          voiceSpokenText: data.voiceSpokenText,
          timestamp: Date.now() + 100,
          cards: data.cards || []
        };

        history.push(saathiReply);
        this.saveMessages(lang, history);
        return saathiReply;
      }
    } catch (err) {
      console.warn('Backend AI service unreachable, running dynamic local offline fallback:', err);
    }

    // Dynamic Local Fallback (Respects User Profile & Location)
    const cap = profile.ownCapital || 50000;
    const projCost = cap / 0.10;
    const loan = projCost * 0.90;
    const biz = profile.desiredBusiness || 'व्यवसाय';
    const loc = profile.village ? `${profile.village}` : 'स्थानिक परिसर';

    let fallbackText = '';
    const qLower = userText.toLowerCase();

    if (qLower.includes('emi') || qLower.includes('हप्ता') || qLower.includes('किस्त') || qLower.includes('loan')) {
      fallbackText =
        lang === 'mr'
          ? `तुमच्या ₹${cap.toLocaleString('en-IN')} स्वतःच्या भांडवलावर PS-91 मॉडेलनुसार ₹${projCost.toLocaleString('en-IN')} चा प्रकल्प तयार होतो. यामध्ये ₹${loan.toLocaleString('en-IN')} चे कर्ज आणि ३५% PMEGP सबसिडी शक्य आहे.`
          : lang === 'hi'
          ? `आपकी ₹${cap.toLocaleString('en-IN')} पूंजी पर PS-91 मॉडल के अनुसार ₹${projCost.toLocaleString('en-IN')} का प्रोजेक्ट बनता है, जिसमें ₹${loan.toLocaleString('en-IN')} का ऋण और ३५% PMEGP सब्सिडी मिल सकती है।`
          : `Based on your ₹${cap.toLocaleString('en-IN')} own capital, PS-91 structuring creates a ₹${projCost.toLocaleString('en-IN')} project capacity with ₹${loan.toLocaleString('en-IN')} loan component and up to 35% PMEGP subsidy.`;
    } else {
      fallbackText =
        lang === 'mr'
          ? `तुमच्या ${loc} परिसरातील '${biz}' व्यवसायाबाबत मी सर्व बाबी तपासल्या आहेत. या व्यवसायात सुरुवातीला रोख व्यवहार आणि स्थानिक ग्राहकांशी थेट संबंध ठेवणे सर्वात महत्त्वाचे ठरेल.`
          : lang === 'hi'
          ? `आपके ${loc} में '${biz}' व्यवसाय के लिए प्रारंभिक स्तर पर नकद बिक्री और स्थानीय ग्राहकों से सीधा संपर्क बनाए रखना सबसे महत्वपूर्ण है।`
          : `For your '${biz}' enterprise in ${loc}, maintaining strict cash discipline, verified local demand, and low working capital credit is essential for long-term viability.`;
    }

    const saathiReply: ChatMessage = {
      id: 'saathi_msg_' + Date.now(),
      sender: 'saathi',
      text: fallbackText,
      timestamp: Date.now() + 100,
      cards: [
        {
          type: 'SUMMARY',
          title: `💼 ${biz} — ${loc}`,
          subtitle: `स्वतःचे भांडवल: ₹${cap.toLocaleString('en-IN')} | प्रकल्प क्षमता: ₹${projCost.toLocaleString('en-IN')}`,
          data: {
            capital: `₹${cap.toLocaleString('en-IN')}`,
            projectCapacity: `₹${projCost.toLocaleString('en-IN')}`,
            loanComponent: `₹${loan.toLocaleString('en-IN')}`
          },
          actionText: 'वित्तीय रचना पाहा',
          actionRoute: '/money'
        }
      ]
    };

    history.push(saathiReply);
    this.saveMessages(lang, history);
    return saathiReply;
  },

  resetChat(lang: LanguageCode = 'en'): ChatMessage[] {
    const profile = profileService.getProfile();
    const defaults = [getInitialWelcomeMessage(lang, profile)];
    this.saveMessages(lang, defaults);
    return defaults;
  }
};
