import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Volume2,
  Mic,
  MicOff,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  Zap,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useVoice } from '../../context/VoiceContext';
import { LiveAreaContext } from '../../types';

interface LiveAreaSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (survey: LiveAreaContext) => void;
  occupation?: string;
  villageName?: string;
}

interface DynamicQuestion {
  id: string;
  title: { [lang: string]: string };
  placeholder: { [lang: string]: string };
  options: { [lang: string]: string[] };
}

export const LiveAreaSurveyModal: React.FC<LiveAreaSurveyModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  occupation = 'Mobile & Electronics Repair',
  villageName = 'तुमचे गाव'
}) => {
  const { language } = useLanguage();
  const { isListening, startListening, stopListening, transcript, clearTranscript, speak } = useVoice();

  const [currentStep, setCurrentStep] = useState<number>(1); // 1 to 5
  const [competitorCount, setCompetitorCount] = useState<number>(1);
  const [localObstacle, setLocalObstacle] = useState<string>('');
  const [q3Answer, setQ3Answer] = useState<string>('');
  const [q4Answer, setQ4Answer] = useState<string>('');
  const [q5Answer, setQ5Answer] = useState<string>('');

  // Active question dynamic speech transcript target
  const [activeVoiceTarget, setActiveVoiceTarget] = useState<'comp' | 'obstacle' | 'q3' | 'q4' | 'q5'>('comp');

  // Handle live transcript
  useEffect(() => {
    if (transcript && isListening) {
      if (activeVoiceTarget === 'comp') {
        const numMatch = transcript.match(/\d+/);
        if (numMatch) {
          setCompetitorCount(parseInt(numMatch[0], 10));
        } else {
          // Check Marathi/Hindi number words
          const tLower = transcript.toLowerCase();
          if (tLower.includes('शून्य') || tLower.includes('zero') || tLower.includes('नाही')) setCompetitorCount(0);
          else if (tLower.includes('एक') || tLower.includes('one')) setCompetitorCount(1);
          else if (tLower.includes('दोन') || tLower.includes('दो') || tLower.includes('two')) setCompetitorCount(2);
          else if (tLower.includes('तीन') || tLower.includes('three')) setCompetitorCount(3);
          else if (tLower.includes('चार') || tLower.includes('four')) setCompetitorCount(4);
          else if (tLower.includes('पाच') || tLower.includes('five')) setCompetitorCount(5);
        }
      } else if (activeVoiceTarget === 'obstacle') {
        setLocalObstacle(transcript);
      } else if (activeVoiceTarget === 'q3') {
        setQ3Answer(transcript);
      } else if (activeVoiceTarget === 'q4') {
        setQ4Answer(transcript);
      } else if (activeVoiceTarget === 'q5') {
        setQ5Answer(transcript);
      }
    }
  }, [transcript, isListening, activeVoiceTarget]);

  if (!isOpen) return null;

  // Generate 3 Dynamic Questions tailored to occupation
  const getDynamicQuestions = (occ: string): DynamicQuestion[] => {
    const oLower = occ.toLowerCase();

    if (oLower.includes('dairy') || oLower.includes('दूध') || oLower.includes('दुग्ध') || oLower.includes('paneer')) {
      return [
        {
          id: 'dyn_dairy_vol',
          title: {
            mr: 'गावात किंवा परिसरात दररोज अंदाजे किती लिटर दूध संकलन होते?',
            hi: 'गांव या आसपास प्रतिदिन लगभग कितने लीटर दूध संकलित होता है?',
            en: 'How many liters of milk are collected daily in your village/nearby?'
          },
          placeholder: {
            mr: 'उदा. २०० ते ५०० लिटर / १००० लिटरपेक्षा जास्त',
            hi: 'उदा. 200 से 500 लीटर / 1000 लीटर से अधिक',
            en: 'e.g. 200-500 liters / over 1000 liters'
          },
          options: {
            mr: ['२०० ते ५०० लिटर', '५०० ते १००० लिटर', '१०००+ लिटर', 'माहिती नाही'],
            hi: ['200 से 500 लीटर', '500 से 1000 लीटर', '1000+ लीटर', 'पता नहीं'],
            en: ['200-500 L', '500-1000 L', '1000+ L', 'Not sure']
          }
        },
        {
          id: 'dyn_dairy_chill',
          title: {
            mr: 'गावात दूध शीतकरण केंद्र (Chilling Unit) किंवा वाहतुकीसाठी वाहन सोय आहे का?',
            hi: 'क्या दूध चिलिंग यूनिट या परिवहन के लिए गाड़ी की सुविधा उपलब्ध है?',
            en: 'Is there a milk chilling center or daily transport facility available?'
          },
          placeholder: {
            mr: 'उदा. स्वतःचे वाहन आहे / डेअरीचे वाहन रोज येते',
            hi: 'उदा. अपनी गाड़ी है / डेयरी की गाड़ी आती है',
            en: 'e.g. Dairy collection van comes daily'
          },
          options: {
            mr: ['डेअरीचे वाहन रोज येते', 'स्वतःची दुचाकी/पिकअप आहे', 'थंड शीतकरणाची सोय नाही'],
            hi: ['डेयरी की गाड़ी रोज आती है', 'अपना वाहन है', 'चिलिंग की सुविधा नहीं है'],
            en: ['Daily dairy van collects', 'Own two-wheeler/pickup', 'No chilling facility']
          }
        },
        {
          id: 'dyn_dairy_vet',
          title: {
            mr: 'जनावरांसाठी हिरवा चारा व पशुवैद्यकीय डॉक्टर गावात सहज मिळतात का?',
            hi: 'क्या पशुओं के लिए हरा चारा व पशु चिकित्सक आसानी से उपलब्ध हैं?',
            en: 'Are green fodder and veterinary doctors easily accessible in your area?'
          },
          placeholder: {
            mr: 'उदा. सरकारी दवाखाना २ किमीवर आहे / चारा मुबलक आहे',
            hi: 'उदा. पशु अस्पताल 2 किमी दूर है / चारा पर्याप्त है',
            en: 'e.g. Vet clinic 2 km away, fodder abundant'
          },
          options: {
            mr: ['डॉक्टर व चारा सहज उपलब्ध', 'डॉक्टर शहरातून बोलवावा लागतो', 'उन्हाळ्यात चारा टंचाई'],
            hi: ['डॉक्टर व चारा आसानी से उपलब्ध', 'शहर से बुलाना पड़ता है', 'गर्मियों में चारे की कमी'],
            en: ['Doctor & fodder easily available', 'Need to call doctor from town', 'Summer fodder shortage']
          }
        }
      ];
    }

    if (oLower.includes('flour') || oLower.includes('गिरणी') || oLower.includes('mill') || oLower.includes('चक्की')) {
      return [
        {
          id: 'dyn_mill_elec',
          title: {
            mr: 'गावात दिवसा ३-फेज कमर्शियल वीज सरासरी किती तास उपलब्ध असते?',
            hi: 'गांव में दिन में 3-फेज बिजली औसतन कितने घंटे उपलब्ध रहती है?',
            en: 'How many hours of 3-phase commercial electricity is available daily?'
          },
          placeholder: {
            mr: 'उदा. ८ ते १० तास / रात्री जास्त वीज असते',
            hi: 'उदा. 8 से 10 घंटे / रात में अधिक रहती है',
            en: 'e.g. 8-10 hours / mainly at night'
          },
          options: {
            mr: ['१०+ तास अखंड वीज', '६ ते ८ तास वीज', 'अनियमित / लोडशेडिंग जास्त', '३-फेज वीज नाही'],
            hi: ['10+ घंटे लगातार', '6 से 8 घंटे', 'अनियमित लोडशेडिंग', '3-फेज बिजली नहीं'],
            en: ['10+ hrs continuous', '6-8 hrs power', 'Frequent cuts', 'No 3-phase line']
          }
        },
        {
          id: 'dyn_mill_dist',
          title: {
            mr: 'गावातील नागरिक धान्य दळण्यासाठी सध्या किती अंतरावर जातात?',
            hi: 'गांव के लोग अनाज पिसाने के लिए वर्तमान में कितनी दूर जाते हैं?',
            en: 'How far do villagers currently travel to get their grain ground?'
          },
          placeholder: {
            mr: 'उदा. गावातच जुनी गिरणी आहे / २-३ किमी दुसऱ्या गावात जातात',
            hi: 'उदा. गांव में पुरानी चक्की है / 2-3 किमी दूर जाते हैं',
            en: 'e.g. In village / travel 2-3 km'
          },
          options: {
            mr: ['गावात एकही गिरणी नाही (मोठी गरज)', 'गावात १ जुनी गिरणी आहे', '२-३ किमी दूर शहरात जातात'],
            hi: ['गांव में कोई चक्की नहीं (बड़ी जरूरत)', 'गांव में 1 पुरानी चक्की है', '2-3 किमी दूर जाते हैं'],
            en: ['No mill in village (High need)', '1 old mill already exists', 'Travel 2-3 km to town']
          }
        },
        {
          id: 'dyn_mill_shop',
          title: {
            mr: 'गिरणी सुरू करण्यासाठी स्वतःची किंवा भाड्याची रस्त्यालगत जागा उपलब्ध आहे का?',
            hi: 'क्या चक्की लगाने के लिए सड़क किनारे अपनी या किराए की जगह उपलब्ध है?',
            en: 'Do you have road-facing premises (owned or rented) for the mill?'
          },
          placeholder: {
            mr: 'उदा. स्वतःचे घर/शेड रस्त्यालगत आहे',
            hi: 'उदा. मुख्य सड़क पर अपनी जगह है',
            en: 'e.g. Owned room on main street'
          },
          options: {
            mr: ['स्वतःची मुख्य रस्त्यावर जागा आहे', 'भाड्याने दुकान घेणार आहे', 'जागा शोधत आहे'],
            hi: ['मुख्य सड़क पर अपनी जगह है', 'किराए पर दुकान लूंगा', 'जगह खोज रहा हूँ'],
            en: ['Owned space on main road', 'Planning to rent shop', 'Looking for space']
          }
        }
      ];
    }

    if (oLower.includes('mobile') || oLower.includes('मोबाईल') || oLower.includes('repair') || oLower.includes('electronics')) {
      return [
        {
          id: 'dyn_mob_parts',
          title: {
            mr: 'मोबाईलचे सुटे भाग (Parts/Display) आणण्यासाठी घाऊक बाजार किती अंतरावर आहे?',
            hi: 'मोबाइल पार्ट्स व डिस्प्ले लाने के लिए थोक बाजार कितनी दूरी पर है?',
            en: 'How far is the wholesale market for mobile spare parts and screens?'
          },
          placeholder: {
            mr: 'उदा. १५ किमी (तालुका शहर) / कुरिअरने मागवतो',
            hi: 'उदा. 15 किमी दूर तहसील में / कूरियर से आता है',
            en: 'e.g. 15 km at taluka / order via courier'
          },
          options: {
            mr: ['१० ते १५ किमीवर तालुका शहर', '३०+ किमी जिल्हा शहर', 'कुरिअरने गावात डिलिव्हरी मिळते'],
            hi: ['10 से 15 किमी तहसील शहर', '30+ किमी जिला शहर', 'कूरियर डिलीवरी उपलब्ध'],
            en: ['10-15 km taluka hub', '30+ km district center', 'Courier delivers directly']
          }
        },
        {
          id: 'dyn_mob_skills',
          title: {
            mr: 'गावात प्रामुख्याने कीपॅड फोन वापरतात की 4G/5G स्मार्टफोन?',
            hi: 'गांव में मुख्य रूप से कीपैड फोन उपयोग होते हैं या 4G/5G स्मार्टफोन?',
            en: 'Do villagers predominantly use basic keypad phones or 4G/5G smartphones?'
          },
          placeholder: {
            mr: 'उदा. ७०% लोकांकडे स्मार्टफोन आहेत',
            hi: 'उदा. 70% लोगों के पास स्मार्टफोन हैं',
            en: 'e.g. Over 70% have smartphones'
          },
          options: {
            mr: ['बहुतांश लोकांकडे स्मार्टफोन आहेत', 'अर्धे स्मार्टफोन, अर्धे कीपॅड फोन', 'फक्त साधे फोन'],
            hi: ['ज्यादातर लोगों के पास स्मार्टफोन', 'आधे स्मार्टफोन, आधे कीपैड', 'मुख्यतः साधारण फोन'],
            en: ['Mostly modern smartphones', '50-50 smartphones & keypad', 'Mostly basic keypad phones']
          }
        },
        {
          id: 'dyn_mob_loc',
          title: {
            mr: 'दुकान सुरू करण्यासाठी मुख्य चौक, आठवडी बाजार किंवा बस स्टॉपजवळ जागा आहे का?',
            hi: 'क्या दुकान शुरू करने के लिए मुख्य चौक, साप्ताहिक बाजार या बस स्टैंड के पास जगह है?',
            en: 'Is shop space available near the main chowk, weekly market, or bus stop?'
          },
          placeholder: {
            mr: 'उदा. बस स्टँडजवळ जागा निश्चित केली आहे',
            hi: 'उदा. बस स्टैंड के पास जगह तय है',
            en: 'e.g. Space finalized near bus stand'
          },
          options: {
            mr: ['होय, मुख्य चौकात मोक्याची जागा आहे', 'घराच्या पुढील खोलीत सुरू करणार', 'भाड्याने जागा शोधत आहे'],
            hi: ['हाँ, मुख्य चौक पर जगह उपलब्ध है', 'घर के आगे कमरे में', 'किराए की जगह तलाश रहा हूँ'],
            en: ['Yes, prime chowk location', 'Front room of home', 'Searching for rental shop']
          }
        }
      ];
    }

    if (oLower.includes('kirana') || oLower.includes('किराणा') || oLower.includes('grocery') || oLower.includes('retail')) {
      return [
        {
          id: 'dyn_kirana_whol',
          title: {
            mr: 'घाऊक माल (Wholesale) भरण्यासाठी मुख्य बाजारपेठ किती किमी अंतरावर आहे?',
            hi: 'थोक सामान खरीदने के लिए मुख्य बाजार कितनी दूरी पर है?',
            en: 'How far is the wholesale market for stocking grocery goods?'
          },
          placeholder: {
            mr: 'उदा. १० किमीवर तालुका शहर',
            hi: 'उदा. 10 किमी तहसील शहर',
            en: 'e.g. 10 km to wholesale hub'
          },
          options: {
            mr: ['५ ते १० किमी अंतरावर', '१५ ते २५ किमी अंतरावर', 'होलसेलर गाडी गावात येऊन माल देते'],
            hi: ['5 से 10 किमी दूरी पर', '15 से 25 किमी दूरी पर', 'थोक विक्रेता गांव में गाड़ी लाता है'],
            en: ['5-10 km away', '15-25 km away', 'Wholesaler delivers directly to village']
          }
        },
        {
          id: 'dyn_kirana_credit',
          title: {
            mr: 'गावात ग्राहकांना मासिक उधारी (Credit) द्यावी लागेल असा अंदाज आहे का?',
            hi: 'क्या गांव में ग्राहकों को मासिक उधारी देने की संभावना है?',
            en: 'Do you anticipate needing to sell goods on monthly credit to villagers?'
          },
          placeholder: {
            mr: 'उदा. होय, ३०-४०% उधारी असू शकते / फक्त रोख व्यवहार',
            hi: 'उदा. हाँ, उधारी की मांग होगी / केवल नकद',
            en: 'e.g. Yes, 30% credit expected / Strict cash'
          },
          options: {
            mr: ['फक्त रोखीने व्यवहार ठेवणार', 'अंदाजे २०-३०% उधारी द्यावी लागेल', 'उधारी खूप जास्त होते'],
            hi: ['केवल नकद व्यवहार रखेंगे', '20-30% उधारी देनी पड़ सकती है', 'उधारी बहुत अधिक होती है'],
            en: ['Strictly cash-only sales', 'Expect 20-30% monthly credit', 'High credit risk']
          }
        },
        {
          id: 'dyn_kirana_foot',
          title: {
            mr: 'दुकान सुरू करण्याची जागा वर्दळीच्या रस्त्यावर किंवा वस्तीजवळ आहे का?',
            hi: 'क्या दुकान लगाने की जगह मुख्य रास्ते या बस्ती के पास है?',
            en: 'Is the proposed shop located on a high-traffic street or residential cluster?'
          },
          placeholder: {
            mr: 'उदा. गावातील मुख्य रस्ता / शाळेसमोर',
            hi: 'उदा. मुख्य सड़क / स्कूल के सामने',
            en: 'e.g. Main village street / near school'
          },
          options: {
            mr: ['मुख्य रस्त्यावर मोक्याचे स्थान', 'गावातील अंतर्गत गल्लीत', 'मोक्याची जागा अजून शोधत आहे'],
            hi: ['मुख्य सड़क पर प्रमुख स्थान', 'गांव की भीतरी गली में', 'जगह अभी खोज रहा हूँ'],
            en: ['Prime spot on main street', 'Internal neighborhood alley', 'Still searching for location']
          }
        }
      ];
    }

    // Default general business questions
    return [
      {
        id: 'dyn_gen_supply',
        title: {
          mr: 'या व्यवसायासाठी आवश्यक कच्चा माल किंवा साहित्य दर आठवड्याला सहज मिळू शकेल का?',
          hi: 'इस व्यवसाय के लिए आवश्यक कच्चा माल क्या हर हफ्ते आसानी से मिल जाएगा?',
          en: 'Is the required raw material or inventory easily procurable weekly?'
        },
        placeholder: {
          mr: 'उदा. होय, जवळच्या बाजारात सहज मिळतो',
          hi: 'उदा. हाँ, पास के बाजार में मिल जाता है',
          en: 'e.g. Readily available in local market'
        },
        options: {
          mr: ['जवळच्या बाजारात सहज मिळतो', 'जिल्हा शहरातून आणावा लागतो', 'कच्च्या मालाची टंचाई आहे'],
          hi: ['पास के बाजार में उपलब्ध', 'जिला शहर से लाना पड़ता है', 'कच्चे माल की कमी है'],
          en: ['Easily available locally', 'Must procure from district hub', 'Raw material is scarce']
        }
      },
      {
        id: 'dyn_gen_exp',
        title: {
          mr: 'या व्यवसायाचा तुम्हाला पूर्वीचा काही प्रत्यक्ष अनुभव किंवा कौशल्य आहे का?',
          hi: 'क्या आपको इस व्यवसाय का पहले का कोई अनुभव या कौशल्य है?',
          en: 'Do you have prior experience or formal skills in this trade?'
        },
        placeholder: {
          mr: 'उदा. २ वर्षे अनुभव आहे / नवीन शिकत आहे',
          hi: 'उदा. 2 वर्ष का अनुभव है / नया सीख रहा हूँ',
          en: 'e.g. 2 years experience / learning now'
        },
        options: {
          mr: ['होय, २+ वर्षे प्रत्यक्ष अनुभव आहे', 'थोडेफार काम माहित आहे', 'पहिल्यांदाच सुरू करत आहे'],
          hi: ['हाँ, 2+ वर्ष का अनुभव है', 'थोड़ा बहुत काम आता है', 'पहली बार शुरू कर रहा हूँ'],
          en: ['Yes, 2+ years experience', 'Basic knowledge', 'Starting for the first time']
        }
      },
      {
        id: 'dyn_gen_payment',
        title: {
          mr: 'गावात या सेवेसाठी ग्राहक रोख पैसे किंवा UPI द्वारे नियमित मोबदला देतात का?',
          hi: 'क्या गांव में ग्राहक इस सेवा के लिए नकद या UPI द्वारा समय पर भुगतान करते हैं?',
          en: 'Are local customers willing to pay regularly via cash or UPI for this service?'
        },
        placeholder: {
          mr: 'उदा. होय, UPI व रोख दोन्ही चालतात',
          hi: 'उदा. हाँ, नकद व UPI दोनों चलते हैं',
          en: 'e.g. Yes, cash and UPI both active'
        },
        options: {
          mr: ['होय, रोख व UPI ने लगेच पैसे मिळतात', 'काही ग्राहक उधारी मागतात', 'उधारी वसुली कठीण आहे'],
          hi: ['हाँ, तुरंत नकद या UPI मिल जाता है', 'कुछ लोग उधारी मांगते हैं', 'वसूली कठिन है'],
          en: ['Yes, prompt cash & UPI payments', 'Some customers request credit', 'Difficult credit recovery']
        }
      }
    ];
  };

  const dynamicQuestions = getDynamicQuestions(occupation);

  // Read question text aloud for illiterate / uneducated users
  const handleReadQuestion = (text: string) => {
    speak(text, language);
  };

  // Toggle voice recognition for current active step
  const handleVoiceToggle = (target: 'comp' | 'obstacle' | 'q3' | 'q4' | 'q5') => {
    if (isListening) {
      stopListening();
    } else {
      clearTranscript();
      setActiveVoiceTarget(target);
      startListening();
    }
  };

  const handleNext = () => {
    if (isListening) stopListening();
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete survey!
      const surveyPayload: LiveAreaContext = {
        competitorCount: competitorCount >= 0 ? competitorCount : 0,
        localObstacles: localObstacle.trim() || 'स्थानिक वीज व उधारी समस्या',
        dynamicAnswers: [
          {
            questionId: dynamicQuestions[0].id,
            question: dynamicQuestions[0].title[language] || dynamicQuestions[0].title.mr,
            answer: q3Answer.trim() || dynamicQuestions[0].options[language]?.[0] || 'उपलब्ध'
          },
          {
            questionId: dynamicQuestions[1].id,
            question: dynamicQuestions[1].title[language] || dynamicQuestions[1].title.mr,
            answer: q4Answer.trim() || dynamicQuestions[1].options[language]?.[0] || 'नियमित'
          },
          {
            questionId: dynamicQuestions[2].id,
            question: dynamicQuestions[2].title[language] || dynamicQuestions[2].title.mr,
            answer: q5Answer.trim() || dynamicQuestions[2].options[language]?.[0] || 'उपलब्ध'
          }
        ],
        collectedAt: new Date().toISOString()
      };

      onComplete(surveyPayload);
    }
  };

  const handleBack = () => {
    if (isListening) stopListening();
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Render question content based on step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: {
        const q1Text =
          language === 'mr'
            ? `तुमच्या ${villageName} गावात या व्यवसायाचे सध्या किती थेट स्पर्धक (दुकाने) आहेत?`
            : language === 'hi'
            ? `आपके ${villageName} में इस व्यापार के वर्तमान में कितने प्रतिस्पर्धी (दुकानें) हैं?`
            : `How many direct competitors or shops for this business currently exist in ${villageName}?`;

        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {language === 'en' ? 'Question 1 of 5 (Competitor Reality)' : 'प्रश्न १/५ (स्पर्धकांची संख्या)'}
              </span>
              <button
                type="button"
                onClick={() => handleReadQuestion(q1Text)}
                style={{ background: '#eff6ff', border: 'none', borderRadius: '50%', padding: '6px', color: '#2563eb', cursor: 'pointer', display: 'flex' }}
                title="आवाज ऐका (Listen)"
              >
                <Volume2 size={18} />
              </button>
            </div>

            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px 0', lineHeight: 1.4 }}>
              {q1Text}
            </h3>

            {/* Quick Number Selector Chips */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px', marginBottom: '14px' }}>
              {[0, 1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCompetitorCount(num)}
                  style={{
                    padding: '12px 4px',
                    borderRadius: '12px',
                    border: competitorCount === num ? '2.5px solid #2563eb' : '1.5px solid #cbd5e1',
                    backgroundColor: competitorCount === num ? '#eff6ff' : '#ffffff',
                    color: competitorCount === num ? '#1d4ed8' : '#334155',
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: competitorCount === num ? '0 4px 12px rgba(37,99,235,0.2)' : 'none'
                  }}
                >
                  <span>{num === 5 ? '5+' : num}</span>
                  <span style={{ fontSize: '0.62rem', fontWeight: 600, color: competitorCount === num ? '#2563eb' : '#64748b' }}>
                    {num === 0 ? (language === 'en' ? 'None' : 'शून्य') : (language === 'en' ? 'Shops' : 'दुकाने')}
                  </span>
                </button>
              ))}
            </div>

            {/* Stepper + Voice Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <button
                type="button"
                onClick={() => setCompetitorCount(Math.max(0, competitorCount - 1))}
                style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', fontSize: '1.3rem', fontWeight: 700, cursor: 'pointer' }}
              >
                -
              </button>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>{competitorCount}</span>
                <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block' }}>
                  {language === 'en' ? 'Direct Competitor Shops' : 'गावातील चालू दुकाने'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCompetitorCount(competitorCount + 1)}
                style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', fontSize: '1.3rem', fontWeight: 700, cursor: 'pointer' }}
              >
                +
              </button>

              {/* Voice Mic Button */}
              <button
                type="button"
                onClick={() => handleVoiceToggle('comp')}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: isListening && activeVoiceTarget === 'comp' ? '#ef4444' : '#2563eb',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
                }}
                title="बोलून सांगा (Speak to Answer)"
              >
                {isListening && activeVoiceTarget === 'comp' ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
            </div>
          </div>
        );
      }

      case 2: {
        const q2Text =
          language === 'mr'
            ? 'तुमच्या स्थानिक परिसरात सर्वात मोठे अडथळे किंवा अडचणी कोणत्या आहेत?'
            : language === 'hi'
            ? 'आपके स्थानीय क्षेत्र में सबसे बड़ी बाधाएं या समस्याएं क्या हैं?'
            : 'What are the primary obstacles or bottlenecks in your local area?';

        const obstacleOptions =
          language === 'mr'
            ? [
                '⚡ सतत वीज खंडित होणे (Power Cuts)',
                '🛣️ खराब रस्ते व वाहतूक समस्या',
                '💧 पाण्याची तीव्र टंचाई',
                '💸 ग्राहकांची उधारीची सवय',
                '👥 कमी गिऱ्हाईक / लोकसंख्या कमी',
                '🏭 कच्चा माल वेळेवर न मिळणे'
              ]
            : language === 'hi'
            ? [
                '⚡ बार-बार बिजली कटना',
                '🛣️ खराब सड़कें व परिवहन समस्या',
                '💧 पानी की भारी कमी',
                '💸 ग्राहकों की उधारी की आदत',
                '👥 ग्राहक संख्या कम होना',
                '🏭 कच्चे माल की अनुपलब्धता'
              ]
            : [
                '⚡ Frequent Power Cuts',
                '🛣️ Poor Road & Transport Access',
                '💧 Acute Water Scarcity',
                '💸 High Customer Credit Demands',
                '👥 Low Footfall & Density',
                '🏭 Raw Material Procurement Lag'
              ];

        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {language === 'en' ? 'Question 2 of 5 (Area Obstacles)' : 'प्रश्न २/५ (स्थानिक अडथळे)'}
              </span>
              <button
                type="button"
                onClick={() => handleReadQuestion(q2Text)}
                style={{ background: '#eff6ff', border: 'none', borderRadius: '50%', padding: '6px', color: '#2563eb', cursor: 'pointer', display: 'flex' }}
                title="आवाज ऐका (Listen)"
              >
                <Volume2 size={18} />
              </button>
            </div>

            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px 0', lineHeight: 1.4 }}>
              {q2Text}
            </h3>

            {/* Quick Option Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
              {obstacleOptions.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setLocalObstacle(opt)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '20px',
                    border: localObstacle === opt ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    backgroundColor: localObstacle === opt ? '#eff6ff' : '#ffffff',
                    color: localObstacle === opt ? '#1d4ed8' : '#334155',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* Text Input with Voice Mic */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={localObstacle}
                onChange={(e) => setLocalObstacle(e.target.value)}
                placeholder={language === 'en' ? 'Type or speak your local problem...' : 'तुमची अडचण येथे लिहा किंवा माइक दाबून बोला...'}
                style={{
                  width: '100%',
                  padding: '12px 50px 12px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.95rem',
                  backgroundColor: '#ffffff'
                }}
              />
              <button
                type="button"
                onClick={() => handleVoiceToggle('obstacle')}
                style={{
                  position: 'absolute',
                  right: '6px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: isListening && activeVoiceTarget === 'obstacle' ? '#ef4444' : '#2563eb',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                {isListening && activeVoiceTarget === 'obstacle' ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
            </div>
          </div>
        );
      }

      case 3:
      case 4:
      case 5: {
        const dynIndex = currentStep - 3;
        const qObj = dynamicQuestions[dynIndex];
        const qTitle = qObj.title[language] || qObj.title.mr || qObj.title.en;
        const qPlaceholder = qObj.placeholder[language] || qObj.placeholder.mr || qObj.placeholder.en;
        const qOpts = qObj.options[language] || qObj.options.mr || qObj.options.en;

        const currentVal = currentStep === 3 ? q3Answer : currentStep === 4 ? q4Answer : q5Answer;
        const setVal = currentStep === 3 ? setQ3Answer : currentStep === 4 ? setQ4Answer : setQ5Answer;
        const targetVoice: 'q3' | 'q4' | 'q5' = currentStep === 3 ? 'q3' : currentStep === 4 ? 'q4' : 'q5';

        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {language === 'en' ? `Question ${currentStep} of 5 (${occupation})` : `प्रश्न ${currentStep}/५ (${occupation})`}
                </span>
                <span style={{ fontSize: '0.68rem', backgroundColor: '#fef3c7', color: '#92400e', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                  {language === 'en' ? 'Tailored' : 'व्यवसायानुसार'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleReadQuestion(qTitle)}
                style={{ background: '#f0fdf4', border: 'none', borderRadius: '50%', padding: '6px', color: '#16a34a', cursor: 'pointer', display: 'flex' }}
                title="आवाज ऐका (Listen)"
              >
                <Volume2 size={18} />
              </button>
            </div>

            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px 0', lineHeight: 1.4 }}>
              {qTitle}
            </h3>

            {/* Quick Option Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
              {qOpts.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setVal(opt)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '20px',
                    border: currentVal === opt ? '2px solid #16a34a' : '1px solid #cbd5e1',
                    backgroundColor: currentVal === opt ? '#f0fdf4' : '#ffffff',
                    color: currentVal === opt ? '#15803d' : '#334155',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* Input with Voice Mic */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={currentVal}
                onChange={(e) => setVal(e.target.value)}
                placeholder={qPlaceholder}
                style={{
                  width: '100%',
                  padding: '12px 50px 12px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.95rem',
                  backgroundColor: '#ffffff'
                }}
              />
              <button
                type="button"
                onClick={() => handleVoiceToggle(targetVoice)}
                style={{
                  position: 'absolute',
                  right: '6px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: isListening && activeVoiceTarget === targetVoice ? '#ef4444' : '#16a34a',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                {isListening && activeVoiceTarget === targetVoice ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '480px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Modal Top Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1e293b, #0f172a)',
            color: '#ffffff',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: 'rgba(37,99,235,0.3)', padding: '6px', borderRadius: '8px', color: '#60a5fa' }}>
              <MapPin size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800 }}>
                {language === 'en' ? 'Live Area Reconnaissance' : 'थेट परिसर माहिती सर्वेक्षण'}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                {villageName} • {occupation}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* 5-Step Progress Bar */}
        <div style={{ display: 'flex', height: '4px', backgroundColor: '#e2e8f0' }}>
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              style={{
                flex: 1,
                backgroundColor: step <= currentStep ? '#2563eb' : 'transparent',
                transition: 'background-color 0.3s'
              }}
            />
          ))}
        </div>

        {/* Question Body */}
        <div style={{ padding: '20px 18px', minHeight: '230px' }}>
          {renderStepContent()}
        </div>

        {/* Footer Navigation */}
        <div
          style={{
            padding: '12px 18px',
            borderTop: '1px solid #f1f5f9',
            backgroundColor: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '8px 14px',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#475569',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <ArrowLeft size={16} />
              {language === 'en' ? 'Back' : 'मागे'}
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#64748b',
                cursor: 'pointer'
              }}
            >
              {language === 'en' ? 'Skip for now' : 'नंतर सांगा'}
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            style={{
              background: currentStep === 5 ? 'linear-gradient(135deg, #16a34a, #15803d)' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '9px 18px',
              fontSize: '0.9rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(37,99,235,0.2)'
            }}
          >
            {currentStep === 5 ? (
              <>
                <span>{language === 'en' ? 'Save & Start Advice' : 'माहिती नोंदवा व सल्ला मिळवा'}</span>
                <CheckCircle2 size={17} />
              </>
            ) : (
              <>
                <span>{language === 'en' ? 'Next' : 'पुढे जा'}</span>
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
