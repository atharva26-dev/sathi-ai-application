import { SupportedLanguage, DataTrustLevel } from '../../config/constants.js';
import { AssembledBusinessContext } from '../context/contextEngine.js';

export interface StructuredCardPayload {
  type: string;
  title: string;
  subtitle?: string;
  data?: Record<string, any>;
  actionText?: string;
  actionRoute?: string;
}

export interface SkillExecutionResult {
  answer: string;
  summary: string;
  voiceSpokenText: string;
  cards: StructuredCardPayload[];
  recommendations: string[];
  calculations?: Record<string, any>;
  risks: string[];
  assumptions: string[];
  sources: Array<{ title: string; url?: string; isOfficial: boolean }>;
  suggestedNextQuestions: string[];
  trustLevel: DataTrustLevel;
  confidenceScore: number;
  skillName: string;
}

export interface SkillHandler {
  canHandle(query: string, context: AssembledBusinessContext): boolean;
  execute(query: string, language: SupportedLanguage, context: AssembledBusinessContext): Promise<SkillExecutionResult>;
}

export const getLocalized = (dict: any, lang: string): string => {
  if (!dict) return '';
  return dict[lang] || dict['mr'] || dict['hi'] || dict['en'] || '';
};
