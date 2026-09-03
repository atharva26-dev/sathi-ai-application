import { DataProvenance, createProvenance } from './dataProvenance.js';

export interface OdopRecord {
  districtLgdCode: number;
  districtName: string;
  stateLgdCode: number;
  stateName: string;
  productName: string;
  productCategory: string;
  isGiTagged: boolean;
  specializationRationale: string;
  exportPotential: 'GLOBAL' | 'NATIONAL' | 'REGIONAL';
  provenance: DataProvenance;
}

const ODOP_PROVENANCE = createProvenance(
  'One District One Product (ODOP) Initiative, DPIIT, Ministry of Commerce and Industry',
  'https://www.odop.investindia.gov.in/district-products',
  'DISTRICT',
  '2024-25',
  'HIGH',
  'ODOP indicates recognized local specialization and government cluster support, NOT an automatic mandate that this is the sole viable enterprise for any individual.'
);

export const DISTRICT_ODOP_RECORDS: Record<number, OdopRecord> = {
  // Sangli (504, Maharashtra)
  504: {
    districtLgdCode: 504,
    districtName: 'Sangli',
    stateLgdCode: 27,
    stateName: 'Maharashtra',
    productName: 'Turmeric (हळद) & Grapes / Raisins (बेदाणा)',
    productCategory: 'Agriculture & Spices',
    isGiTagged: true,
    specializationRationale: 'Sangli Turmeric has Geographical Indication (GI) status. Sangli accounts for ~70% of Maharashtra’s turmeric trade and large raisin output in Tasgaon/Palus.',
    exportPotential: 'GLOBAL',
    provenance: ODOP_PROVENANCE
  },

  // Nashik (479, Maharashtra)
  479: {
    districtLgdCode: 479,
    districtName: 'Nashik',
    stateLgdCode: 27,
    stateName: 'Maharashtra',
    productName: 'Table Grapes, Onion & Tomato',
    productCategory: 'Horticulture & Agro Processing',
    isGiTagged: true,
    specializationRationale: 'Nashik Grapes possess GI tag. Lasalgaon is Asia’s largest onion market, with dense agro-processing infrastructure.',
    exportPotential: 'GLOBAL',
    provenance: ODOP_PROVENANCE
  },

  // Pune (492, Maharashtra)
  492: {
    districtLgdCode: 492,
    districtName: 'Pune',
    stateLgdCode: 27,
    stateName: 'Maharashtra',
    productName: 'Agro Processing (Tomato/Jaggery) & Floriculture',
    productCategory: 'Agro & Floriculture',
    isGiTagged: false,
    specializationRationale: 'Proximity to major metropolitan markets, cold chain corridors, and high-tech greenhouse floriculture.',
    exportPotential: 'NATIONAL',
    provenance: ODOP_PROVENANCE
  },

  // SBS Nagar (36, Punjab)
  36: {
    districtLgdCode: 36,
    districtName: 'Shahid Bhagat Singh Nagar',
    stateLgdCode: 3,
    stateName: 'Punjab',
    productName: 'Kinnow Citrus Fruit & Agro-Mechanization Implements',
    productCategory: 'Horticulture & Farm Machinery',
    isGiTagged: false,
    specializationRationale: 'Extensive citrus orchards in Doaba belt and dense concentration of agricultural equipment fabrication units.',
    exportPotential: 'NATIONAL',
    provenance: ODOP_PROVENANCE
  },

  // Sonipat (80, Haryana)
  80: {
    districtLgdCode: 80,
    districtName: 'Sonipat',
    stateLgdCode: 6,
    stateName: 'Haryana',
    productName: 'Button Mushroom & Light Engineering Fabrication',
    productCategory: 'Horticulture & Light Engineering',
    isGiTagged: false,
    specializationRationale: 'Sonipat is the primary mushroom production hub of North India with ready proximity to the National Capital Region.',
    exportPotential: 'NATIONAL',
    provenance: ODOP_PROVENANCE
  },

  // Guntur (510, Andhra Pradesh)
  510: {
    districtLgdCode: 510,
    districtName: 'Guntur',
    stateLgdCode: 28,
    stateName: 'Andhra Pradesh',
    productName: 'Guntur Sannam Red Chilli & Spices',
    productCategory: 'Spices & Condiments',
    isGiTagged: true,
    specializationRationale: 'Guntur Sannam Chilli holds GI tag. Guntur houses the largest chilli yard in Asia handling over 3 lakh metric tonnes annually.',
    exportPotential: 'GLOBAL',
    provenance: ODOP_PROVENANCE
  },

  // Krishna (513, Andhra Pradesh)
  513: {
    districtLgdCode: 513,
    districtName: 'Krishna',
    stateLgdCode: 28,
    stateName: 'Andhra Pradesh',
    productName: 'Banganapalle Mango & Machilipatnam Imitation Jewellery',
    productCategory: 'Horticulture & Handicrafts',
    isGiTagged: true,
    specializationRationale: 'Banganapalle Mango (GI) and Pedana Kalamkari (GI) reflect both rich coastal agro productivity and historic artisan crafts.',
    exportPotential: 'GLOBAL',
    provenance: ODOP_PROVENANCE
  },

  // Jaipur (88, Rajasthan)
  88: {
    districtLgdCode: 88,
    districtName: 'Jaipur',
    stateLgdCode: 8,
    stateName: 'Rajasthan',
    productName: 'Blue Pottery & Sanganeri Hand Block Print Textiles',
    productCategory: 'Handicrafts & Textiles',
    isGiTagged: true,
    specializationRationale: 'Both Jaipur Blue Pottery and Sanganeri Hand Block Printing hold GI tags with thriving domestic and tourist markets.',
    exportPotential: 'GLOBAL',
    provenance: ODOP_PROVENANCE
  },

  // Kamrup (287, Assam)
  287: {
    districtLgdCode: 287,
    districtName: 'Kamrup',
    stateLgdCode: 18,
    stateName: 'Assam',
    productName: 'Assam Silk (Muga/Eri) & Specialty Tea/Ginger',
    productCategory: 'Textiles & Agro Processing',
    isGiTagged: true,
    specializationRationale: 'Sualkuchi Muga Silk is the golden silk of Assam with GI status; Kamrup rural produces high-aroma organic ginger.',
    exportPotential: 'GLOBAL',
    provenance: ODOP_PROVENANCE
  }
};

export const getDistrictOdop = (districtLgdCode: number): OdopRecord | undefined => {
  return DISTRICT_ODOP_RECORDS[districtLgdCode];
};
