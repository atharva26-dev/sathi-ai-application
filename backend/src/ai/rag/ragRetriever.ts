import fs from 'fs';
import path from 'path';
import { logger } from '../../utils/logger.js';

export interface RagChunk {
  id: string;
  sourceFile: string;
  docTitle: string;
  category: string;
  chunkIndex: number;
  text: string;
  keywords: string[];
}

export interface RagRetrievedChunk extends RagChunk {
  score: number;
}

export interface RagRetrievalResult {
  query: string;
  totalCandidates: number;
  chunks: RagRetrievedChunk[];
  citedSources: Array<{ title: string; sourceFile: string; category: string }>;
  synthesizedContextPrompt: string;
}

interface InvertedIndexPosting {
  cid: string;
  tf: number;
}

interface RawRagIndexPayload {
  version: string;
  generatedAt: string;
  totalDocuments: number;
  totalChunks: number;
  avgDocLength: number;
  docLengths: Record<string, number>;
  invertedIndex: Record<string, InvertedIndexPosting[]>;
  chunks: RagChunk[];
}

// Multilingual keyword expansion dictionary (Marathi/Hindi -> English Research concepts)
const CROSS_LINGUAL_EXPANSIONS: Record<string, string[]> = {
  // Location & Footfall
  'स्थान': ['location', 'footfall', 'site', 'proximity', 'market'],
  'लोकेशन': ['location', 'recommendation', 'spatial', 'analyzer', 'cluster'],
  'जागा': ['location', 'premises', 'rent', 'traffic', 'convenience'],
  'दुकान': ['store', 'shop', 'retail', 'outlet', 'business'],
  'दुकानदार': ['retailer', 'trader', 'entrepreneur', 'merchant'],
  'बाजार': ['market', 'mandi', 'demand', 'customer', 'commercial'],
  'गाव': ['village', 'rural', 'gram', 'panchayat', 'community'],
  'ग्रामीण': ['rural', 'village', 'grassroots', 'agriculture', 'community', 'development'],
  'व्यवसाय': ['business', 'enterprise', 'model', 'entrepreneur', 'industry', 'venture'],
  'उद्योग': ['industry', 'enterprise', 'msme', 'business', 'manufacturing'],
  'संधी': ['opportunity', 'potential', 'growth', 'market', 'demand', 'feasibility'],
  'प्रकल्प': ['project', 'setup', 'plan', 'feasibility', 'profile'],
  'कोल्हापूर': ['kolhapur', 'maharashtra', 'market', 'agriculture', 'enterprise'],

  // Finance, Capital, Loans & EMI
  'भांडवल': ['capital', 'investment', 'working', 'cashflow', 'funds', 'budget'],
  'भांडवला': ['capital', 'investment', 'finance', 'project', 'cost'],
  'गुंतवणूक': ['investment', 'capital', 'allocation', 'returns'],
  'पूंजी': ['capital', 'liquidity', 'working', 'finance'],
  'कर्ज': ['loan', 'credit', 'debt', 'repayment', 'emi', 'mudra', 'pmegp'],
  'लोन': ['loan', 'credit', 'mudra', 'bank', 'subsidy'],
  'हप्ता': ['emi', 'loan', 'repayment', 'tenure', 'installment'],
  'किस्त': ['emi', 'loan', 'repayment', 'installment'],
  'नफा': ['profit', 'margin', 'returns', 'net', 'viability', 'breakeven'],
  'तोटा': ['loss', 'deficit', 'break-even', 'risk', 'buffer'],
  'खर्च': ['cost', 'expenditure', 'operational', 'overhead', 'fixed'],
  'मार्जिन': ['margin', 'profit', 'markup', 'gross', 'pricing'],
  'योजना': ['scheme', 'subsidy', 'government', 'pmegp', 'credit', 'mudra'],
  'सबसिडी': ['subsidy', 'grant', 'margin', 'incentive', 'pmegp'],

  // Competition, Customers & Marketing
  'स्पर्धक': ['competitor', 'competition', 'market', 'pricing', 'differentiation'],
  'स्पर्धा': ['competition', 'competitor', 'saturation', 'market', 'strategy'],
  'कंपिटिशन': ['competition', 'competitor', 'market', 'rivalry'],
  'ग्राहक': ['customer', 'consumer', 'footfall', 'demand', 'client', 'walkin'],
  'ग्राहकांना': ['customer', 'retention', 'acquisition', 'marketing', 'service'],
  'विक्री': ['sales', 'marketing', 'distribution', 'revenue', 'turnover'],

  // Working Capital & Credit / Udhari
  'उधारी': ['credit', 'working', 'liquidity', 'cashflow', 'receivables', 'dues'],
  'खेळते भांडवल': ['working', 'capital', 'liquidity', 'buffer', 'operating', 'cash'],
  'क्रेडिट': ['credit', 'working', 'liquidity', 'advance'],

  // Setup, Execution & Licensing
  'कसा': ['setup', 'steps', 'feasibility', 'strategy', 'execution'],
  'कशी': ['setup', 'feasibility', 'strategy', 'plan'],
  'करायचा': ['setup', 'business', 'process', 'steps', 'licensing'],
  'सुरू': ['start', 'setup', 'launch', 'investment', 'checklist'],
  'सुरुवात': ['start', 'initiation', 'foundation', 'setup'],
  'परवाना': ['license', 'registration', 'compliance', 'fssai', 'udyam', 'shopact'],
  'लायसन्स': ['license', 'registration', 'permit', 'gst', 'fssai'],
  'कागदपत्रे': ['documents', 'eligibility', 'kyc', 'application', 'subsidy'],

  // Sectors & Value Chains
  'डेअरी': ['dairy', 'milk', 'chilling', 'cattle', 'fodder', 'livestock'],
  'दुग्ध': ['dairy', 'milk', 'processing', 'pasteurization', 'buffalo'],
  'किराणा': ['grocery', 'kirana', 'retail', 'fmcg', 'inventory', 'store'],
  'गिरणी': ['flour', 'mill', 'grinding', 'grains', 'processing'],
  'आटा चक्की': ['flour', 'mill', 'grinding', 'processing', 'power'],
  'जोखीम': ['risk', 'uncertainty', 'volatility', 'mitigation'],
  'कच्चा माल': ['raw', 'materials', 'procurement', 'supplier', 'inventory'],
  'सप्लायर': ['supplier', 'vendor', 'wholesaler', 'procurement'],
  'शेतकरी': ['farmer', 'agriculture', 'produce', 'rural'],
  'शेती': ['agriculture', 'agri-business', 'crop', 'farming', 'processing']
};

export class RagRetriever {
  private isLoaded = false;
  private chunksMap: Map<string, RagChunk> = new Map();
  private docLengths: Record<string, number> = {};
  private invertedIndex: Record<string, InvertedIndexPosting[]> = {};
  private totalChunks = 0;
  private avgDocLength = 250;

  constructor() {
    this.loadIndex();
  }

  /**
   * Load the compiled knowledge index into memory
   */
  private loadIndex(): void {
    if (this.isLoaded) return;

    try {
      // Possible locations for advisoryKnowledgeIndex.json
      const possiblePaths = [
        path.resolve(process.cwd(), 'src/ai/rag/advisoryKnowledgeIndex.json'),
        path.resolve(process.cwd(), 'backend/src/ai/rag/advisoryKnowledgeIndex.json'),
        path.resolve(process.cwd(), 'dist/ai/rag/advisoryKnowledgeIndex.json'),
        path.resolve(__dirname, 'advisoryKnowledgeIndex.json'),
        path.resolve(__dirname, '../../../src/ai/rag/advisoryKnowledgeIndex.json'),
        path.resolve(__dirname, '../../src/ai/rag/advisoryKnowledgeIndex.json')
      ];

      let indexPath = '';
      for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
          indexPath = p;
          break;
        }
      }

      if (!indexPath) {
        logger.warn('RAG index file (advisoryKnowledgeIndex.json) not found in expected paths. RAG will run in empty fallback mode.');
        return;
      }

      const raw = fs.readFileSync(indexPath, 'utf-8');
      const data: RawRagIndexPayload = JSON.parse(raw);

      this.totalChunks = data.totalChunks || data.chunks.length;
      this.avgDocLength = data.avgDocLength || 250;
      this.docLengths = data.docLengths || {};
      this.invertedIndex = data.invertedIndex || {};

      this.chunksMap.clear();
      for (const chunk of data.chunks) {
        this.chunksMap.set(chunk.id, chunk);
      }

      this.isLoaded = true;
      logger.info(`SAATHI RAG Retriever initialized: ${this.chunksMap.size} chunks, ${Object.keys(this.invertedIndex).length} index terms from ${data.totalDocuments} advisory documents.`);
    } catch (err) {
      logger.error('Failed to load RAG index:', err);
    }
  }

  /**
   * Expand input query with cross-lingual and domain synonyms
   * Uses Unicode punctuation splitting to properly support Devanagari and English words
   */
  private expandQuery(query: string): string[] {
    const rawTerms = (query || '')
      .toLowerCase()
      .split(/[\s,?.!;:()"'/\\+\-–—«»[\]{}]+/)
      .filter((w) => w.length >= 2);
    const expanded = new Set<string>();

    for (const term of rawTerms) {
      expanded.add(term);
      // Check cross-lingual map
      if (CROSS_LINGUAL_EXPANSIONS[term]) {
        for (const ext of CROSS_LINGUAL_EXPANSIONS[term]) {
          expanded.add(ext);
        }
      }
    }

    // Check multi-word phrase matching
    const qLower = query.toLowerCase();
    for (const [phrase, expansions] of Object.entries(CROSS_LINGUAL_EXPANSIONS)) {
      if (phrase.includes(' ') && qLower.includes(phrase)) {
        for (const ext of expansions) {
          expanded.add(ext);
        }
      }
    }

    return Array.from(expanded);
  }

  /**
   * Retrieve top relevant knowledge chunks for a query using BM25 + Semantic Category Boosting
   */
  public retrieve(query: string, maxResults = 4, businessCategory?: string): RagRetrievalResult {
    if (!this.isLoaded || this.totalChunks === 0) {
      this.loadIndex();
    }

    if (!this.isLoaded || this.totalChunks === 0) {
      return {
        query,
        totalCandidates: 0,
        chunks: [],
        citedSources: [],
        synthesizedContextPrompt: ''
      };
    }

    const searchTerms = this.expandQuery(query);
    const chunkScores: Map<string, number> = new Map();

    const k1 = 1.2;
    const b = 0.75;
    const N = this.totalChunks;

    // 1. BM25 Accumulator
    for (const term of searchTerms) {
      const postings = this.invertedIndex[term];
      if (!postings || postings.length === 0) continue;

      const n = postings.length;
      // Standard IDF
      const idf = Math.log((N - n + 0.5) / (n + 0.5) + 1.0);

      for (const posting of postings) {
        const cid = posting.cid;
        const tf = posting.tf;
        const dl = this.docLengths[cid] || this.avgDocLength;

        const tfComponent = (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * (dl / this.avgDocLength)));
        const termScore = idf * tfComponent;

        const prev = chunkScores.get(cid) || 0;
        chunkScores.set(cid, prev + termScore);
      }
    }

    // 2. Domain & Category Relevance Boost
    const qLower = query.toLowerCase();
    for (const [cid, baseScore] of chunkScores.entries()) {
      const chunk = this.chunksMap.get(cid);
      if (!chunk) continue;

      let multiplier = 1.0;

      // Location boost
      if (
        (qLower.includes('location') || qLower.includes('लोकेशन') || qLower.includes('स्थान') || qLower.includes('जागा') || qLower.includes('footfall')) &&
        chunk.category === 'Location Intelligence'
      ) {
        multiplier += 0.45;
      }

      // Finance & Capital boost
      if (
        (qLower.includes('capital') || qLower.includes('भांडवल') || qLower.includes('loan') || qLower.includes('कर्ज') || qLower.includes('subsidy') || qLower.includes('योजना')) &&
        chunk.category === 'Financial Management & Capital'
      ) {
        multiplier += 0.45;
      }

      // Agri-business boost
      if (
        (qLower.includes('agri') || qLower.includes('कृषी') || qLower.includes('शेती') || qLower.includes('farm')) &&
        chunk.category === 'Agri-Business & Rural Development'
      ) {
        multiplier += 0.45;
      }

      // Rural Innovation / Bain report boost
      if (
        (qLower.includes('rural') || qLower.includes('ग्रामीण') || qLower.includes('village') || qLower.includes('नाविन्यता')) &&
        chunk.category === 'Rural Economy & Market Innovation'
      ) {
        multiplier += 0.35;
      }

      chunkScores.set(cid, baseScore * multiplier);
    }

    // 3. Rank and select top K chunks
    const sortedCids = Array.from(chunkScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxResults);

    const retrievedChunks: RagRetrievedChunk[] = [];
    const citedSourcesMap: Map<string, { title: string; sourceFile: string; category: string }> = new Map();

    for (const [cid, score] of sortedCids) {
      const chunk = this.chunksMap.get(cid);
      if (chunk) {
        retrievedChunks.push({
          ...chunk,
          score: Math.round(score * 100) / 100
        });
        if (!citedSourcesMap.has(chunk.sourceFile)) {
          citedSourcesMap.set(chunk.sourceFile, {
            title: chunk.docTitle,
            sourceFile: chunk.sourceFile,
            category: chunk.category
          });
        }
      }
    }

    // 4. Build prompt-ready synthesis context
    let synthesizedPrompt = '';
    if (retrievedChunks.length > 0) {
      synthesizedPrompt = `============================================================\n`;
      synthesizedPrompt += `EMPIRICAL RESEARCH EVIDENCE & CITATIONS (FROM SATHI DOCS):\n`;
      synthesizedPrompt += `============================================================\n`;
      retrievedChunks.forEach((c, idx) => {
        synthesizedPrompt += `\n[EVIDENCE ${idx + 1}: ${c.docTitle} | Field: ${c.category}]\n`;
        synthesizedPrompt += `"${c.text}"\n`;
      });
      synthesizedPrompt += `\nINSTRUCTION FOR SYNTHESIS:\n`;
      synthesizedPrompt += `Synthesize the above empirical research and field findings into your practical advisory.\n`;
      synthesizedPrompt += `Cite actionable strategies (e.g. working capital allocation, location analysis, risk buffers) directly into clean bullet points.\n`;
    }

    return {
      query,
      totalCandidates: chunkScores.size,
      chunks: retrievedChunks,
      citedSources: Array.from(citedSourcesMap.values()),
      synthesizedContextPrompt: synthesizedPrompt
    };
  }

  /**
   * Health status of the RAG engine
   */
  public getStatus(): { isLoaded: boolean; totalChunks: number; totalTerms: number } {
    return {
      isLoaded: this.isLoaded,
      totalChunks: this.totalChunks,
      totalTerms: Object.keys(this.invertedIndex).length
    };
  }
}

export const ragRetriever = new RagRetriever();
