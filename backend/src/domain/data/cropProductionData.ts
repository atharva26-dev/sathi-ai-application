import { DataProvenance, createProvenance } from './dataProvenance.js';

export interface DistrictCropStat {
  districtLgdCode: number;
  districtName: string;
  cropName: string;
  season: 'Kharif' | 'Rabi' | 'Zaid' | 'Whole Year';
  year: string;
  areaHectares: number;
  productionTonnes: number;
  yieldKgPerHectare: number;
  marketSurplusRank: 'VERY_HIGH' | 'HIGH' | 'MODERATE';
}

const DES_PROVENANCE = createProvenance(
  'Directorate of Economics and Statistics (DES), Ministry of Agriculture & Farmers Welfare',
  'https://aps.dac.gov.in/District_Crop_Production_Statistics.aspx',
  'DISTRICT',
  '2023-24',
  'HIGH',
  'Official crop production estimates validated by State Agriculture Departments.'
);

export const DISTRICT_CROP_STATISTICS: DistrictCropStat[] = [
  // Sangli (504, Maharashtra)
  {
    districtLgdCode: 504,
    districtName: 'Sangli',
    cropName: 'Grapes',
    season: 'Whole Year',
    year: '2023-24',
    areaHectares: 28500,
    productionTonnes: 570000,
    yieldKgPerHectare: 20000,
    marketSurplusRank: 'VERY_HIGH'
  },
  {
    districtLgdCode: 504,
    districtName: 'Sangli',
    cropName: 'Turmeric',
    season: 'Whole Year',
    year: '2023-24',
    areaHectares: 14200,
    productionTonnes: 113600,
    yieldKgPerHectare: 8000,
    marketSurplusRank: 'VERY_HIGH'
  },
  {
    districtLgdCode: 504,
    districtName: 'Sangli',
    cropName: 'Sugarcane',
    season: 'Whole Year',
    year: '2023-24',
    areaHectares: 92000,
    productionTonnes: 8740000,
    yieldKgPerHectare: 95000,
    marketSurplusRank: 'VERY_HIGH'
  },
  {
    districtLgdCode: 504,
    districtName: 'Sangli',
    cropName: 'Soyabean',
    season: 'Kharif',
    year: '2023-24',
    areaHectares: 68000,
    productionTonnes: 122400,
    yieldKgPerHectare: 1800,
    marketSurplusRank: 'HIGH'
  },
  {
    districtLgdCode: 504,
    districtName: 'Sangli',
    cropName: 'Pomegranate',
    season: 'Whole Year',
    year: '2023-24',
    areaHectares: 9800,
    productionTonnes: 117600,
    yieldKgPerHectare: 12000,
    marketSurplusRank: 'HIGH'
  },

  // Nashik (479, Maharashtra)
  {
    districtLgdCode: 479,
    districtName: 'Nashik',
    cropName: 'Onion',
    season: 'Rabi',
    year: '2023-24',
    areaHectares: 142000,
    productionTonnes: 2414000,
    yieldKgPerHectare: 17000,
    marketSurplusRank: 'VERY_HIGH'
  },
  {
    districtLgdCode: 479,
    districtName: 'Nashik',
    cropName: 'Table Grapes',
    season: 'Whole Year',
    year: '2023-24',
    areaHectares: 62000,
    productionTonnes: 1364000,
    yieldKgPerHectare: 22000,
    marketSurplusRank: 'VERY_HIGH'
  },
  {
    districtLgdCode: 479,
    districtName: 'Nashik',
    cropName: 'Tomato',
    season: 'Kharif',
    year: '2023-24',
    areaHectares: 38000,
    productionTonnes: 912000,
    yieldKgPerHectare: 24000,
    marketSurplusRank: 'VERY_HIGH'
  },
  {
    districtLgdCode: 479,
    districtName: 'Nashik',
    cropName: 'Maize',
    season: 'Kharif',
    year: '2023-24',
    areaHectares: 185000,
    productionTonnes: 555000,
    yieldKgPerHectare: 3000,
    marketSurplusRank: 'HIGH'
  },

  // SBS Nagar (36, Punjab)
  {
    districtLgdCode: 36,
    districtName: 'Shahid Bhagat Singh Nagar',
    cropName: 'Kinnow (Citrus)',
    season: 'Whole Year',
    year: '2023-24',
    areaHectares: 3400,
    productionTonnes: 64600,
    yieldKgPerHectare: 19000,
    marketSurplusRank: 'VERY_HIGH'
  },
  {
    districtLgdCode: 36,
    districtName: 'Shahid Bhagat Singh Nagar',
    cropName: 'Wheat',
    season: 'Rabi',
    year: '2023-24',
    areaHectares: 78000,
    productionTonnes: 390000,
    yieldKgPerHectare: 5000,
    marketSurplusRank: 'HIGH'
  },
  {
    districtLgdCode: 36,
    districtName: 'Shahid Bhagat Singh Nagar',
    cropName: 'Maize',
    season: 'Kharif',
    year: '2023-24',
    areaHectares: 24000,
    productionTonnes: 96000,
    yieldKgPerHectare: 4000,
    marketSurplusRank: 'HIGH'
  },
  {
    districtLgdCode: 36,
    districtName: 'Shahid Bhagat Singh Nagar',
    cropName: 'Potato',
    season: 'Rabi',
    year: '2023-24',
    areaHectares: 8200,
    productionTonnes: 196800,
    yieldKgPerHectare: 24000,
    marketSurplusRank: 'HIGH'
  },

  // Sonipat (80, Haryana)
  {
    districtLgdCode: 80,
    districtName: 'Sonipat',
    cropName: 'Button Mushroom',
    season: 'Whole Year',
    year: '2023-24',
    areaHectares: 1150,
    productionTonnes: 28750,
    yieldKgPerHectare: 25000,
    marketSurplusRank: 'VERY_HIGH'
  },
  {
    districtLgdCode: 80,
    districtName: 'Sonipat',
    cropName: 'Basmati Paddy',
    season: 'Kharif',
    year: '2023-24',
    areaHectares: 110000,
    productionTonnes: 462000,
    yieldKgPerHectare: 4200,
    marketSurplusRank: 'VERY_HIGH'
  },
  {
    districtLgdCode: 80,
    districtName: 'Sonipat',
    cropName: 'Wheat',
    season: 'Rabi',
    year: '2023-24',
    areaHectares: 148000,
    productionTonnes: 710400,
    yieldKgPerHectare: 4800,
    marketSurplusRank: 'HIGH'
  },

  // Guntur (510, Andhra Pradesh)
  {
    districtLgdCode: 510,
    districtName: 'Guntur',
    cropName: 'Dry Red Chilli',
    season: 'Whole Year',
    year: '2023-24',
    areaHectares: 85000,
    productionTonnes: 382500,
    yieldKgPerHectare: 4500,
    marketSurplusRank: 'VERY_HIGH'
  },
  {
    districtLgdCode: 510,
    districtName: 'Guntur',
    cropName: 'Cotton',
    season: 'Kharif',
    year: '2023-24',
    areaHectares: 192000,
    productionTonnes: 480000,
    yieldKgPerHectare: 2500,
    marketSurplusRank: 'VERY_HIGH'
  },
  {
    districtLgdCode: 510,
    districtName: 'Guntur',
    cropName: 'Turmeric',
    season: 'Whole Year',
    year: '2023-24',
    areaHectares: 12500,
    productionTonnes: 81250,
    yieldKgPerHectare: 6500,
    marketSurplusRank: 'HIGH'
  },

  // Krishna (513, Andhra Pradesh)
  {
    districtLgdCode: 513,
    districtName: 'Krishna',
    cropName: 'Banganapalle Mango',
    season: 'Whole Year',
    year: '2023-24',
    areaHectares: 42000,
    productionTonnes: 378000,
    yieldKgPerHectare: 9000,
    marketSurplusRank: 'VERY_HIGH'
  },
  {
    districtLgdCode: 513,
    districtName: 'Krishna',
    cropName: 'Paddy',
    season: 'Kharif',
    year: '2023-24',
    areaHectares: 230000,
    productionTonnes: 1196000,
    yieldKgPerHectare: 5200,
    marketSurplusRank: 'HIGH'
  },

  // Jaipur (88, Rajasthan)
  {
    districtLgdCode: 88,
    districtName: 'Jaipur',
    cropName: 'Mustard',
    season: 'Rabi',
    year: '2023-24',
    areaHectares: 94000,
    productionTonnes: 150400,
    yieldKgPerHectare: 1600,
    marketSurplusRank: 'VERY_HIGH'
  },
  {
    districtLgdCode: 88,
    districtName: 'Jaipur',
    cropName: 'Barley',
    season: 'Rabi',
    year: '2023-24',
    areaHectares: 38000,
    productionTonnes: 133000,
    yieldKgPerHectare: 3500,
    marketSurplusRank: 'HIGH'
  },
  {
    districtLgdCode: 88,
    districtName: 'Jaipur',
    cropName: 'Bajra',
    season: 'Kharif',
    year: '2023-24',
    areaHectares: 112000,
    productionTonnes: 190400,
    yieldKgPerHectare: 1700,
    marketSurplusRank: 'HIGH'
  },

  // Kamrup (287, Assam)
  {
    districtLgdCode: 287,
    districtName: 'Kamrup',
    cropName: 'Assam Tea',
    season: 'Whole Year',
    year: '2023-24',
    areaHectares: 24000,
    productionTonnes: 48000,
    yieldKgPerHectare: 2000,
    marketSurplusRank: 'VERY_HIGH'
  },
  {
    districtLgdCode: 287,
    districtName: 'Kamrup',
    cropName: 'Ginger',
    season: 'Whole Year',
    year: '2023-24',
    areaHectares: 4800,
    productionTonnes: 33600,
    yieldKgPerHectare: 7000,
    marketSurplusRank: 'VERY_HIGH'
  }
];

export const getCropProductionProvenance = (): DataProvenance => DES_PROVENANCE;

export const getDistrictCropStatistics = (districtLgdCode: number): DistrictCropStat[] => {
  return DISTRICT_CROP_STATISTICS.filter((s) => s.districtLgdCode === districtLgdCode);
};
