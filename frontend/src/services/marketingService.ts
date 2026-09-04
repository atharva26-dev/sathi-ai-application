import { MarketingChannelItem, PricingAnalysis, ExpansionPhase, LanguageCode } from '../types';

export const marketingService = {
  getMarketingChannels(language: LanguageCode = 'mr'): MarketingChannelItem[] {
    if (language === 'hi') {
      return [
        {
          id: 'ch_dhabas_hotels',
          title: 'हाईवे ढाबे व स्थानीय होटल (Highway Dhabas & Local Hotels)',
          iconName: 'Utensils',
          suitability: 'BEST',
          whyRecommended: 'होटलों को प्रतिदिन 5 से 15 किलो पनीर/उत्पाद की नियमित आवश्यकता होती है। विश्वास बनने पर निरंतर ऑर्डर मिलते हैं।',
          practicalSteps: [
            'पहली भेंट में 250 ग्राम का मुफ्त नमूना (सैंपल) दें और उन्हें उपयोग करके देखने कहें।',
            'शहर से आने वाले पुराने माल की तुलना में अपने माल की ताजगी व गुणवत्ता दिखाएं।',
            'प्रतिदिन सुबह 9 बजे से पहले सीधी आपूर्ति का भरोसा दें।'
          ],
          targetAudience: 'आसपास के 12 ढाबे व रेस्टोरेंट',
          costEstimate: '₹0 (केवल सैंपल का खर्च ₹150)'
        },
        {
          id: 'ch_whatsapp_community',
          title: 'गांव व कॉलोनी व्हाट्सएप ग्रुप्स (WhatsApp Direct Orders)',
          iconName: 'MessageCircle',
          suitability: 'BEST',
          whyRecommended: 'गांव व निकटवर्ती कॉलोनियों के परिवारों को शुद्ध उत्पाद सीधे घर पर चाहिए होते हैं।',
          practicalSteps: [
            'प्रतिदिन सुबह 7 बजे "आज का ताजा उत्पाद तैयार है - घरपोच डिलीवरी के लिए संदेश भेजें" ऐसा संदेश साझा करें।',
            'छुट्टी के दिनों (शनिवार/रविवार) अग्रिम ऑर्डर लें।'
          ],
          targetAudience: 'गांव के कामकाजी व स्थानीय परिवार',
          costEstimate: '₹0 (केवल मोबाइल डेटा)'
        },
        {
          id: 'ch_weekly_haat',
          title: 'साप्ताहिक ग्रामीण बाजार स्टॉल (Weekly Rural Haat & Bazaar)',
          iconName: 'Store',
          suitability: 'GOOD',
          whyRecommended: 'साप्ताहिक हाट के दिन आसपास के कई गांवों के लोग आते हैं और नकद बिक्री होती है।',
          practicalSteps: [
            'बाजार में साफ मेज और तराजू लेकर बैठें।',
            'ग्राहकों के लिए स्वाद चखने हेतु छोटे नमूने रखें।'
          ],
          targetAudience: 'साप्ताहिक बाजार के खरीदार',
          costEstimate: '₹50 से ₹100 स्थान किराया'
        },
        {
          id: 'ch_caterers_events',
          title: 'विवाह भवन व कैटरर्स (Wedding Halls & Caterers)',
          iconName: 'Users',
          suitability: 'GOOD',
          whyRecommended: 'शादियों व आयोजनों में 50 से 100 किलो की बड़ी एकमुश्त मांग होती है।',
          practicalSteps: [
            'क्षेत्र के 5 प्रमुख रसोइयों व कैटरर्स से संपर्क करें।',
            'बड़े ऑर्डर्स के लिए उचित थोक छूट दें।'
          ],
          targetAudience: 'स्थानीय कैटरर्स व इवेंट आयोजक',
          costEstimate: 'केवल व्यक्तिगत संपर्क'
        }
      ];
    }

    if (language === 'en') {
      return [
        {
          id: 'ch_dhabas_hotels',
          title: 'Highway Dhabas & Local Hotels',
          iconName: 'Utensils',
          suitability: 'BEST',
          whyRecommended: 'Hotels require 5 to 15 kg of fresh supplies daily. Once trust is built, repeat orders are guaranteed.',
          practicalSteps: [
            'Offer a 250g complimentary sample on your first visit and demonstrate freshness.',
            'Show how local same-day produce outperforms cold-storage items from distant cities.',
            'Commit to daily doorstep delivery before 9:00 AM.'
          ],
          targetAudience: '12 highway dhabas & local restaurants',
          costEstimate: '₹0 (sample batch cost ₹150)'
        },
        {
          id: 'ch_whatsapp_community',
          title: 'Local Community WhatsApp Groups (Direct Orders)',
          iconName: 'MessageCircle',
          suitability: 'BEST',
          whyRecommended: 'Households in village centers and nearby residential colonies value genuine, fresh doorstep supplies.',
          practicalSteps: [
            'Broadcast a crisp morning update: "Fresh batches ready today - reply for doorstep delivery".',
            'Take pre-orders on weekends (Saturday/Sunday) for family packs.'
          ],
          targetAudience: 'Local families & working residents',
          costEstimate: '₹0 (mobile data only)'
        },
        {
          id: 'ch_weekly_haat',
          title: 'Weekly Rural Haat & Market Stall',
          iconName: 'Store',
          suitability: 'GOOD',
          whyRecommended: 'Weekly haat draws crowds from 10 surrounding villages with instant spot cash settlements.',
          practicalSteps: [
            'Set up a hygienic display table with digital scales and cooler boxes.',
            'Provide bite-sized tasting samples to build instant buyer confidence.'
          ],
          targetAudience: 'Weekly rural bazaar shoppers',
          costEstimate: '₹50 to ₹100 stall rent'
        },
        {
          id: 'ch_caterers_events',
          title: 'Wedding Halls & Banquet Caterers',
          iconName: 'Users',
          suitability: 'GOOD',
          whyRecommended: 'Single wedding events generate bulk orders of 50 to 100 kg.',
          practicalSteps: [
            'Meet 5 top wedding cooks and banquet managers in your block.',
            'Offer a bulk volume incentive discount for bookings made 1 week in advance.'
          ],
          targetAudience: 'Local banquet cooks & event decorators',
          costEstimate: 'Personal outreach only'
        }
      ];
    }

    // Default Marathi
    return [
      {
        id: 'ch_dhabas_hotels',
        title: 'महामार्गावरील हॉटेल्स व ढाबे (Highway Dhabas & Local Hotels)',
        iconName: 'Utensils',
        suitability: 'BEST',
        whyRecommended: 'हॉटेल्सना दररोज नियमित ५ ते १५ किलो पनीर लागते. एकदा विश्वास बसला की सतत ऑर्डर मिळतात.',
        practicalSteps: [
          'पहिल्या भेटीत २५० ग्रॅम पनीरचा मोफत नमुना (Sample) द्या आणि त्यांना तळून पाहायला सांगा.',
          'शहरातून येणाऱ्या जुन्या पनीरपेक्षा आपले पनीर किती ताजे व मऊ आहे ते दाखवा.',
          'दररोज सकाळी ९ वाजेपूर्वी थेट पोहोचवण्याची खात्री द्या.'
        ],
        targetAudience: 'परिसरातील १२ धाबे व रेस्टॉरंट्स',
        costEstimate: '₹० (फक्त सॅम्पलचा खर्च ₹१५०)'
      },
      {
        id: 'ch_whatsapp_community',
        title: 'गाव व सोसायटी व्हॉट्सॲप ग्रुप्स (WhatsApp Direct Orders)',
        iconName: 'MessageCircle',
        suitability: 'BEST',
        whyRecommended: 'गावातील आणि शेजारच्या कॉलनीतील कुटुंबांना शुद्ध गावरान दुग्ध उत्पादने थेट दारात हवी असतात.',
        practicalSteps: [
          'दररोज सकाळी ७ वाजता "आजचे ताजे पनीर तयार आहे - घरपोच ऑर्डरसाठी मेसेज करा" असा साधा मेसेज टाका.',
          'सुट्टीच्या दिवशी (शनिवार/रविवार) २५० ग्रॅम व ५०० ग्रॅम पॅकच्या आगाऊ ऑर्डर्स घ्या.'
        ],
        targetAudience: 'गावातील नोकरदार व स्थानिक कुटुंबे',
        costEstimate: '₹० (फक्त मोबाईल डेटा)'
      },
      {
        id: 'ch_weekly_haat',
        title: 'आठवडी बाजार स्टॉल (Weekly Rural Haat & Bazaar)',
        iconName: 'Store',
        suitability: 'GOOD',
        whyRecommended: 'रविवार किंवा बाजाराच्या दिवशी परिसरातील १० गावांचे लोक एकत्र येतात. रोख पैशात विक्री होते.',
        practicalSteps: [
          'बाजारात स्वच्छ टेबल, आईस बॉक्स आणि लहान डिजिटल वजनकाटा घेऊन बसा.',
          'ग्राहक समोर खाऊन पाहू शकतील असे लहान तुकडे ठेवा.'
        ],
        targetAudience: 'आठवडी बाजारातील खरेदीदार',
        costEstimate: '₹५० ते ₹१०० जागा भाडे'
      },
      {
        id: 'ch_caterers_events',
        title: 'लग्न कार्यालय व केटरर्स (Wedding Halls & Caterers)',
        iconName: 'Users',
        suitability: 'GOOD',
        whyRecommended: 'एकाच लग्नात ५० ते १०० किलो पनीरची मोठी एकरकमी ऑर्डर मिळते.',
        practicalSteps: [
          'तालुक्यातील ५ प्रमुख आचारी व केटरर्सचे मोबाईल नंबर मिळवून त्यांची भेट घ्या.',
          'मोठ्या ऑर्डर्ससाठी ₹१० प्रति किलो सवलत द्या.'
        ],
        targetAudience: 'स्थानिक केटरर्स व मंडप डेकोरेटर्स',
        costEstimate: 'फक्त वैयक्तिक संपर्क'
      }
    ];
  },

  getPricingGuidance(language: LanguageCode = 'mr'): PricingAnalysis {
    const tip =
      language === 'hi'
        ? 'होटलों को ₹310 थोक दर पर और सीधे ग्राहकों को ₹340 खुदरा दर पर बेचें। इससे औसतन ₹320 की दर और 25% का शुद्ध लाभ प्राप्त होगा।'
        : language === 'en'
        ? 'Supply hotels at ₹310/kg wholesale and retail directly to households at ₹340/kg. This yields an average realization of ₹320/kg and 25% net profit margin.'
        : 'हॉटेल्सना ₹३१० घाऊक दराने आणि थेट ग्राहकांना ₹३४० किरकोळ दराने विका. यामुळे सरासरी ₹३२० चा दर आणि २५% नफा राहील.';

    return {
      costPerUnit: 245,
      competitorPriceRange: { min: 300, max: 360 },
      suggestedPriceFloor: 295,
      suggestedPriceCeiling: 340,
      recommendedPrice: 320,
      marginAtRecommended: 75,
      affordabilityLevel: 'HIGH',
      simpleTip: tip
    };
  },

  getExpansionRoadmap(language: LanguageCode = 'mr'): ExpansionPhase[] {
    if (language === 'hi') {
      return [
        {
          id: 'exp_now',
          timeframe: 'NOW',
          timeframeLabel: 'प्रारंभिक चरण (0 से 3 महीने)',
          revenueMilestone: 'मासिक ₹1,50,000 से ₹2,00,000 बिक्री',
          keyTarget: 'दैनिक 20-25 किलो उत्पादन और 5 होटलों को नियमित आपूर्ति।',
          reinvestmentPlan: 'समस्त लाभ कार्यशील पूंजी में रखें, तत्काल नए खर्च न करें।',
          capacityAddition: 'स्वयं तथा 1 सहायक कर्मचारी।',
          mustNotExpandUntil: [
            'प्रथम 3 महीनों में कच्चा माल आपूर्ति निर्बाध रही हो।',
            'होटलों से साप्ताहिक उधारी की 90% समय पर वसूली हुई हो।',
            'उत्पाद की गुणवत्ता लगातार स्थिर रही हो।'
          ]
        },
        {
          id: 'exp_6m',
          timeframe: '6_MONTHS',
          timeframeLabel: 'स्थिरता चरण (3 से 6 महीने)',
          revenueMilestone: 'मासिक ₹3,50,000 बिक्री',
          keyTarget: 'दैनिक 40-50 किलो उत्पादन + दही व छाछ पैकेजिंग प्रारंभ।',
          reinvestmentPlan: 'लाभ की 30% राशि अतिरिक्त डीप फ्रीजर के लिए उपयोग करें।',
          capacityAddition: '1 पूर्णकालिक कर्मचारी और डिलीवरी बाइक सुविधा।',
          mustNotExpandUntil: [
            'बैंक की मासिक किस्त (EMI) लगातार 6 माह समय पर भरी गई हो।',
            'आपातकालीन खाते में कम से कम ₹50,000 शेष हों।'
          ]
        },
        {
          id: 'exp_1y',
          timeframe: '1_YEAR',
          timeframeLabel: 'विस्तार चरण (1 से 2 वर्ष)',
          revenueMilestone: 'मासिक ₹7,00,000+ बिक्री',
          keyTarget: 'निकटवर्ती 2 ब्लॉकों में आपूर्ति + अपना ब्रांडेड खुदरा केंद्र।',
          reinvestmentPlan: 'स्वचालित वैक्यूम पैकेजिंग मशीन खरीद।',
          capacityAddition: '4 कर्मचारी और अधिकृत वितरक नेटवर्क।',
          mustNotExpandUntil: [
            'स्थानीय बाजार में आपके ब्रांड की अलग पहचान स्थापित हो चुकी हो।',
            'FSSAI व सभी विनियामक अनुमतियां पूर्ण हों।'
          ]
        }
      ];
    }

    if (language === 'en') {
      return [
        {
          id: 'exp_now',
          timeframe: 'NOW',
          timeframeLabel: 'Launch Phase (0 to 3 Months)',
          revenueMilestone: 'Monthly ₹1,50,000 to ₹2,00,000 Revenue',
          keyTarget: '20-25 kg daily production and stable supply to 5 recurring clients.',
          reinvestmentPlan: 'Reinvest 100% of profit into operational working capital reserve.',
          capacityAddition: 'Owner + 1 part-time helper.',
          mustNotExpandUntil: [
            'Zero supply disruptions in raw materials over first 90 days.',
            '> 90% on-time credit recovery from wholesale clients.',
            'Consistent product quality and shelf-life verified.'
          ]
        },
        {
          id: 'exp_6m',
          timeframe: '6_MONTHS',
          timeframeLabel: 'Stabilization Phase (3 to 6 Months)',
          revenueMilestone: 'Monthly ₹3,50,000 Revenue',
          keyTarget: 'Scale to 40-50 kg daily + introduce value-added curd & buttermilk lines.',
          reinvestmentPlan: 'Reinvest 30% of profit into a commercial deep-freezer unit.',
          capacityAddition: '1 full-time worker and dedicated delivery bike.',
          mustNotExpandUntil: [
            'Bank loan EMI paid on time for 6 consecutive months.',
            'Minimum ₹50,000 emergency liquid contingency maintained.'
          ]
        },
        {
          id: 'exp_1y',
          timeframe: '1_YEAR',
          timeframeLabel: 'Expansion Phase (1 to 2 Years)',
          revenueMilestone: 'Monthly ₹7,00,000+ Revenue',
          keyTarget: 'Expand delivery to 2 neighboring blocks + establish a branded retail depot.',
          reinvestmentPlan: 'Procure automatic vacuum-packaging and cold-storage machinery.',
          capacityAddition: '4 full-time staff and designated distribution network.',
          mustNotExpandUntil: [
            'Recognized brand equity and regular consumer loyalty in local market.',
            'FSSAI registration and regulatory compliances fully audited.'
          ]
        }
      ];
    }

    // Default Marathi
    return [
      {
        id: 'exp_now',
        timeframe: 'NOW',
        timeframeLabel: 'सुरुवातीचा टप्पा (० ते ३ महिने)',
        revenueMilestone: 'दरमहा ₹१,५०,००० ते ₹२,००,००० विक्री',
        keyTarget: 'दररोज २०-२५ किलो पनीर उत्पादन आणि स्थानिक ५ हॉटेल्सना नियमित पुरवठा.',
        reinvestmentPlan: 'सर्व नफा खेळत्या भांडवलात ठेवा, लगेच नवीन खर्च करू नका.',
        capacityAddition: 'स्वतः आणि १ मदतनीस कामगार.',
        mustNotExpandUntil: [
          'पहिल्या ३ महिन्यांत दुधाचा पुरवठा कधीही खंडित झालेला नसावा.',
          'हॉटेल्सकडून आठवड्याची उधारी नियमित ९०% वेळेवर वसूल झालेली असावी.',
          'उत्पादनाची गुणवत्ता टिकून राहिलेली असावी.'
        ]
      },
      {
        id: 'exp_6m',
        timeframe: '6_MONTHS',
        timeframeLabel: 'स्थैर्य टप्पा (३ ते ६ महिने)',
        revenueMilestone: 'दरमहा ₹३,५०,००० विक्री',
        keyTarget: 'दैनिक ४०-५० किलो उत्पादन + घट्ट दही व ताक पॅकिंग सुरू करणे.',
        reinvestmentPlan: 'नफ्यातील ३०% रक्कम अतिरिक्त डीप फ्रीझरसाठी वापरा.',
        capacityAddition: '१ पूर्णवेळ कर्मचारी व डिलिव्हरी व्हॅन/बाईक सोय.',
        mustNotExpandUntil: [
          'बँकेचा मासिक हप्ता (EMI) सलग ६ महिने वेळेत भरलेला असावा.',
          'आपत्कालीन खात्यात किमान ₹५०,००० शिल्लक असावी.'
        ]
      },
      {
        id: 'exp_1y',
        timeframe: '1_YEAR',
        timeframeLabel: 'विस्तार टप्पा (१ ते २ वर्षे)',
        revenueMilestone: 'दरमहा ₹७,००,०००+ विक्री',
        keyTarget: 'शेजारच्या २ तालुक्यांमध्ये पुरवठा + स्वतःचा ब्रँडेड रिटेल आउटलेट.',
        reinvestmentPlan: 'स्वयंचलित व्हॅक्यूम पॅकिंग मशीन खरेदी.',
        capacityAddition: '४ कर्मचारी आणि अधिकृत वितरक जाळे.',
        mustNotExpandUntil: [
          'स्थानिक बाजारात तुमच्या ब्रँडला स्वतःची ओळख मिळालेली असावी.',
          'FSSAI व सर्व कायदेशीर परवाने पूर्ण असावेत.'
        ]
      }
    ];
  }
};
