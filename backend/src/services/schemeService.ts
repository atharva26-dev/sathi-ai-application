import { evaluateGovernmentSchemes } from '../domain/schemes/schemeEvaluator.js';

export const schemeService = {
  getSchemes: async (projectCost = 1000000, isRural = true) => {
    return evaluateGovernmentSchemes(projectCost, isRural);
  },

  getSchemeById: async (id: string, projectCost = 1000000) => {
    const schemes = evaluateGovernmentSchemes(projectCost);
    return schemes.find((s) => s.id === id) || schemes[0];
  }
};
