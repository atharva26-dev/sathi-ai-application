import { Router, Request, Response } from 'express';
import { sendSuccess } from '../utils/response.js';

export const loanRoutes = Router();

loanRoutes.get('/loans', (req: Request, res: Response) => {
  const loanProducts = [
    {
      id: 'loan_sbi_agri',
      providerName: 'State Bank of India',
      productName: 'SBI Agri-Business MSME Term Loan',
      interestRate: 9.5,
      interestType: 'REDUCING',
      minAmount: 100000,
      maxAmount: 2500000,
      minTenureMonths: 12,
      maxTenureMonths: 84,
      moratoriumMonths: 6,
      eligibilitySummary: 'ग्रामीण रहिवासी, स्वतःची किमान १०% मार्जिन मनी, व्यवहार्य प्रकल्प अहवाल.',
      officialSourceUrl: 'https://sbi.co.in'
    },
    {
      id: 'loan_baramati_coop',
      providerName: 'Baramati Sahakari Bank',
      productName: 'कृषी पूरक प्रक्रिया उद्योग कर्ज योजना',
      interestRate: 10.0,
      interestType: 'REDUCING',
      minAmount: 50000,
      maxAmount: 1500000,
      minTenureMonths: 12,
      maxTenureMonths: 60,
      moratoriumMonths: 3,
      eligibilitySummary: 'स्थानिक रहिवासी, दुग्ध व्यवसाय अनुभव, २ जामीनदार.',
      officialSourceUrl: 'https://baramatibank.com'
    }
  ];

  sendSuccess(res, loanProducts, 200, req.id);
});
