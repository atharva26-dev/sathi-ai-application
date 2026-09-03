import { MentorTask } from '../types';
import { storageService } from './storageService';

const MENTOR_TASKS_KEY = 'mentor_tasks_v1';

const INITIAL_TASKS: MentorTask[] = [
  // TODAY
  {
    id: 'tsk_today_1',
    timeframe: 'TODAY',
    title: 'जवळच्या ३ ढाबा मालकांशी थेट चर्चा करा',
    description: 'त्यांना विचारा: रोज किती किलो पनीर लागते आणि सध्या ते कोणाकडून किती भावाने घेतात?',
    category: 'MARKET',
    isCompleted: false,
    voiceActionPrompt: 'हॉटेल मालकांशी पनीरबद्दल कशी चर्चा करावी ते सांगा?'
  },
  {
    id: 'tsk_today_2',
    timeframe: 'TODAY',
    title: '२ स्थानिक शेतकऱ्यांशी रोज १०० लिटर दुधाची खात्री करा',
    description: 'सकाळी व संध्याकाळी नियमित दुधाचा दर ₹३६/लिटर ठरवून घ्या.',
    category: 'SUPPLIER',
    isCompleted: false,
    voiceActionPrompt: 'शेतकऱ्यांशी दुधाचा दर ठरवताना कोणती काळजी घ्यावी?'
  },

  // THIS WEEK
  {
    id: 'tsk_week_1',
    timeframe: 'THIS_WEEK',
    title: 'पनीर बनवण्याच्या यंत्रांचे २ कोटेशन गोळा करा',
    description: 'पनीर प्रेस, मिल्क व्हॅट आणि डीप फ्रीझरच्या किमतीची तुलना करा.',
    category: 'OPERATION',
    isCompleted: false,
    voiceActionPrompt: 'पनीर बनवण्यासाठी कोणती मशिनरी सर्वात चांगली आहे?'
  },
  {
    id: 'tsk_week_2',
    timeframe: 'THIS_WEEK',
    title: 'PMEGP योजनेसाठी आधार व रहिवासी दाखला तयार ठेवा',
    description: '३५% सबसिडीसाठी लागणारी मूळ कागदपत्रे एका फाईलमध्ये जमा करा.',
    category: 'DOCUMENT',
    isCompleted: false,
    voiceActionPrompt: 'PMEGP योजनेसाठी कोणती कागदपत्रे लागतात?'
  },

  // THIS MONTH
  {
    id: 'tsk_month_1',
    timeframe: 'THIS_MONTH',
    title: 'FSSAI अन्न सुरक्षा नोंदणी अर्ज करा',
    description: 'स्थानिक महा ई-सेवा केंद्रातून ₹१०० शुल्कात बेसिक FSSAI नोंदणी पूर्ण करा.',
    category: 'DOCUMENT',
    isCompleted: false,
    voiceActionPrompt: 'FSSAI परवाना कसा काढायचा?'
  },
  {
    id: 'tsk_month_2',
    timeframe: 'THIS_MONTH',
    title: '१० किलो पनीरचा पहिला नमुना तयार करून हॉटेल्समध्ये चाचणी घ्या',
    description: 'हॉटेल्सच्या आचाऱ्यांना पनीर वापरून त्यांचा अभिप्राय घ्या.',
    category: 'MARKET',
    isCompleted: false,
    voiceActionPrompt: 'पनीर मऊ आणि पांढरे राहण्यासाठी काय करावे?'
  },

  // NEXT 90 DAYS
  {
    id: 'tsk_90days_1',
    timeframe: 'NEXT_90_DAYS',
    title: 'बँकेचे कर्ज मंजूर करून उत्पादन शेड पूर्ण करा',
    description: 'यंत्रसामग्री बसवून नियमित दररोज २५ किलो उत्पादन सुरू करा.',
    category: 'OPERATION',
    isCompleted: false,
    voiceActionPrompt: 'बँक कर्ज मंजूर होण्यासाठी मॅनेजरशी काय बोलावे?'
  },
  {
    id: 'tsk_90days_2',
    timeframe: 'NEXT_90_DAYS',
    title: 'आठवडी वसुलीची शिस्त लावून खेळते भांडवल वाढवा',
    description: 'कोणत्याही हॉटेलला ७ दिवसांपेक्षा जास्त उधारी न देण्याचा नियम पाळा.',
    category: 'FINANCE',
    isCompleted: false,
    voiceActionPrompt: 'उधारी वसुली वेळेत कशी करावी?'
  }
];

export const mentorService = {
  getTasks(): MentorTask[] {
    return storageService.get<MentorTask[]>(MENTOR_TASKS_KEY, INITIAL_TASKS);
  },

  toggleTask(taskId: string): MentorTask[] {
    const tasks = this.getTasks();
    const updated = tasks.map((t) =>
      t.id === taskId
        ? {
            ...t,
            isCompleted: !t.isCompleted,
            completedAt: !t.isCompleted ? new Date().toISOString() : undefined
          }
        : t
    );
    storageService.set(MENTOR_TASKS_KEY, updated);
    return updated;
  },

  updateTaskNote(taskId: string, note: string): MentorTask[] {
    const tasks = this.getTasks();
    const updated = tasks.map((t) => (t.id === taskId ? { ...t, userNotes: note } : t));
    storageService.set(MENTOR_TASKS_KEY, updated);
    return updated;
  },

  resetTasks(): MentorTask[] {
    storageService.set(MENTOR_TASKS_KEY, INITIAL_TASKS);
    return INITIAL_TASKS;
  }
};
