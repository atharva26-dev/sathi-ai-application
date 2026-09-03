import { TaskTimeframe, TaskStatus } from '../../config/constants.js';

export interface ActionableTask {
  id: string;
  timeframe: TaskTimeframe;
  title: string;
  description: string;
  category: 'MARKET' | 'SUPPLIER' | 'FINANCE' | 'DOCUMENT' | 'OPERATION';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: TaskStatus;
  voiceActionPrompt?: string;
}

export interface ExpansionSafetyGate {
  id: string;
  timeframe: string;
  timeframeLabel: string;
  revenueMilestone: string;
  keyTarget: string;
  reinvestmentPlan: string;
  capacityAddition: string;
  mustNotExpandUntil: string[];
}

export const getActionableRoadmapTasks = (
  businessCategory = 'Dairy & Agro Processing'
): ActionableTask[] => {
  return [
    {
      id: 'task_1',
      timeframe: 'TODAY',
      title: 'स्थानिक ३ ढाब्यांना भेट देऊन पनीरची रोजची गरज विचारा',
      description: 'महामार्गावरील ३ हॉटेल्समध्ये जाऊन ते सध्या पनीर कोठून व कोणत्या दरात घेतात याची नोंद घ्या.',
      category: 'MARKET',
      priority: 'HIGH',
      status: 'in_progress',
      voiceActionPrompt: 'ढाबे मालकांशी काय बोलावे ते सांगा?'
    },
    {
      id: 'task_2',
      timeframe: 'THIS_WEEK',
      title: '२ दूध उत्पादक शेतकऱ्यांशी रोज ५० लिटर दुधाचा दर ठरवा',
      description: 'नियमित दूध पुरवठा आणि फॅटनुसार मिळणारा दर निश्चित करा.',
      category: 'SUPPLIER',
      priority: 'HIGH',
      status: 'pending',
      voiceActionPrompt: 'दूध खरेदी करार कसा करावा?'
    },
    {
      id: 'task_3',
      timeframe: 'THIS_MONTH',
      title: 'बँकेत जाऊन PMEGP ३५% सबसिडी कर्जाची प्राथमिक चौकशी करा',
      description: 'स्टेट बँक अथवा स्थानिक सहकारी बँकेच्या शाखा व्यवस्थापकांशी भेटा.',
      category: 'FINANCE',
      priority: 'MEDIUM',
      status: 'pending',
      voiceActionPrompt: 'बँक मॅनेजरला कोणती कागदपत्रे दाखवायची?'
    },
    {
      id: 'task_4',
      timeframe: 'NEXT_90_DAYS',
      title: 'FSSAI अन्न सुरक्षा नोंदणी आणि उद्योग आधार काढा',
      description: 'डेअरी सुरू करण्यापूर्वी आवश्यक शासकीय परवाने पूर्ण करा.',
      category: 'DOCUMENT',
      priority: 'MEDIUM',
      status: 'pending',
      voiceActionPrompt: 'FSSAI परवाना कसा काढायचा?'
    }
  ];
};

export const getExpansionRoadmapWithSafetyGates = (): ExpansionSafetyGate[] => {
  return [
    {
      id: 'exp_phase_1',
      timeframe: 'NOW',
      timeframeLabel: '१ ते ३ महिने (पायाभूत स्थिरता)',
      revenueMilestone: 'दरमहा ₹२.२५ लाख उलाढाल',
      keyTarget: 'दररोज २५ kg पनीर उत्पादन स्थिर करणे व ५ ढाबे नियमित जोडणे',
      reinvestmentPlan: 'नफ्यातील ५०% खेळते भांडवल राखीव खात्यात',
      capacityAddition: '२५ kg / दिवस मॅन्युअल प्रेस',
      mustNotExpandUntil: [
        'सलग ३ महिने दररोज २५ kg पनीर विक्री स्थिर व्हावी',
        'हॉटेल्सची उधारी ७ दिवसांच्या आत नियमित वसूल व्हावी'
      ]
    },
    {
      id: 'exp_phase_2',
      timeframe: '6_MONTHS',
      timeframeLabel: '४ ते ६ महिने (उपपदार्थ वाढ)',
      revenueMilestone: 'दरमहा ₹४.५० लाख उलाढाल',
      keyTarget: 'पनीरसोबत घट्ट मटका दही व ताक उत्पादन सुरू करणे',
      reinvestmentPlan: 'नफ्यातील ४०% नवीन मशिनरीसाठी बचत',
      capacityAddition: '५० kg पनीर + १०० L दही/ताक',
      mustNotExpandUntil: [
        'बँकेचा मासिक हप्ता सलग ६ महिने वेळेत भरलेला असावा',
        'किमान ३ महिन्यांचा खेळते भांडवल आपत्कालीन राखीव निधी तयार असावा'
      ]
    },
    {
      id: 'exp_phase_3',
      timeframe: '1_YEAR',
      timeframeLabel: '१ वर्ष (थेट रिटेल आउटलेट व व्हॅन)',
      revenueMilestone: 'दरमहा ₹९.०० लाख उलाढाल',
      keyTarget: 'तालुक्यात स्वतःचे १ रिटेल आउटलेट सुरू करणे व छोटा कोल्ड व्हॅन घेणे',
      reinvestmentPlan: 'दुसऱ्या केंद्रासाठी भांडवल उभारणी',
      capacityAddition: '१०० kg पनीर + २५० L उपपदार्थ',
      mustNotExpandUntil: [
        'पहिल्या युनिटचा निव्वळ नफा दरमहा ₹६०,००० पेक्षा जास्त स्थिर असावा'
      ]
    }
  ];
};
