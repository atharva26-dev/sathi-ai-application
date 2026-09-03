import { DataProvenance, createProvenance } from './dataProvenance.js';

export interface MandiCommodityRecord {
  commodity: string;
  marketName: string; // APMC name
  districtLgdCode: number;
  districtName: string;
  stateName: string;
  arrivalTonnes: number;
  tradedQuantityTonnes: number;
  minPriceInrPerQuintal: number;
  modalPriceInrPerQuintal: number;
  maxPriceInrPerQuintal: number;
  date: string;
  priceTrend: 'RISING' | 'STABLE' | 'SEASONAL_LOW';
}

const ENAM_PROVENANCE = createProvenance(
  'e-NAM (National Agriculture Market) / Directorate of Marketing & Inspection (DMI) Agmarknet',
  'https://enam.gov.in/web/dashboard/trade-data',
  'DISTRICT',
  '2025-26',
  'HIGH',
  'Daily electronic trading and physical arrival data reported by respective APMC market committees.'
);

export const MANDI_APMC_RECORDS: MandiCommodityRecord[] = [
  // Sangli APMC
  {
    commodity: 'Turmeric (हळद - Rajapore/Salem)',
    marketName: 'Sangli APMC Main Yard',
    districtLgdCode: 504,
    districtName: 'Sangli',
    stateName: 'Maharashtra',
    arrivalTonnes: 1450,
    tradedQuantityTonnes: 1380,
    minPriceInrPerQuintal: 10500,
    modalPriceInrPerQuintal: 12800,
    maxPriceInrPerQuintal: 15200,
    date: '2026-08-28',
    priceTrend: 'RISING'
  },
  {
    commodity: 'Raisins (बेदाणा - Golden Yellow)',
    marketName: 'Tasgaon & Sangli Fruit APMC',
    districtLgdCode: 504,
    districtName: 'Sangli',
    stateName: 'Maharashtra',
    arrivalTonnes: 820,
    tradedQuantityTonnes: 790,
    minPriceInrPerQuintal: 14000,
    modalPriceInrPerQuintal: 18500,
    maxPriceInrPerQuintal: 24000,
    date: '2026-08-28',
    priceTrend: 'STABLE'
  },

  // Nashik APMC (Lasalgaon & Pimpalgaon)
  {
    commodity: 'Onion (कांदा - Red/Pol)',
    marketName: 'Lasalgaon APMC',
    districtLgdCode: 479,
    districtName: 'Nashik',
    stateName: 'Maharashtra',
    arrivalTonnes: 4500,
    tradedQuantityTonnes: 4350,
    minPriceInrPerQuintal: 1100,
    modalPriceInrPerQuintal: 1650,
    maxPriceInrPerQuintal: 2150,
    date: '2026-08-29',
    priceTrend: 'SEASONAL_LOW'
  },
  {
    commodity: 'Tomato (टोमॅटो)',
    marketName: 'Pimpalgaon Baswant APMC',
    districtLgdCode: 479,
    districtName: 'Nashik',
    stateName: 'Maharashtra',
    arrivalTonnes: 2100,
    tradedQuantityTonnes: 2050,
    minPriceInrPerQuintal: 950,
    modalPriceInrPerQuintal: 1400,
    maxPriceInrPerQuintal: 1850,
    date: '2026-08-29',
    priceTrend: 'SEASONAL_LOW'
  },

  // SBS Nagar (Nawanshahr APMC)
  {
    commodity: 'Kinnow Citrus Fruit',
    marketName: 'Nawanshahr Grain & Fruit Market',
    districtLgdCode: 36,
    districtName: 'Shahid Bhagat Singh Nagar',
    stateName: 'Punjab',
    arrivalTonnes: 380,
    tradedQuantityTonnes: 360,
    minPriceInrPerQuintal: 1800,
    modalPriceInrPerQuintal: 2400,
    maxPriceInrPerQuintal: 3100,
    date: '2026-08-27',
    priceTrend: 'STABLE'
  },
  {
    commodity: 'Maize (मक्का)',
    marketName: 'Nawanshahr APMC',
    districtLgdCode: 36,
    districtName: 'Shahid Bhagat Singh Nagar',
    stateName: 'Punjab',
    arrivalTonnes: 620,
    tradedQuantityTonnes: 610,
    minPriceInrPerQuintal: 1850,
    modalPriceInrPerQuintal: 2150,
    maxPriceInrPerQuintal: 2300,
    date: '2026-08-27',
    priceTrend: 'STABLE'
  },

  // Sonipat (Murthal & Ganaur Sub-yard)
  {
    commodity: 'Fresh Button Mushroom',
    marketName: 'Ganaur Agro Market Terminal',
    districtLgdCode: 80,
    districtName: 'Sonipat',
    stateName: 'Haryana',
    arrivalTonnes: 95,
    tradedQuantityTonnes: 92,
    minPriceInrPerQuintal: 6500,
    modalPriceInrPerQuintal: 8500,
    maxPriceInrPerQuintal: 11000,
    date: '2026-08-30',
    priceTrend: 'SEASONAL_LOW'
  },

  // Guntur Mirchi Yard
  {
    commodity: 'Dry Red Chilli (Teja / S17)',
    marketName: 'Guntur Agriculture Market Committee (Mirchi Yard)',
    districtLgdCode: 510,
    districtName: 'Guntur',
    stateName: 'Andhra Pradesh',
    arrivalTonnes: 3400,
    tradedQuantityTonnes: 3250,
    minPriceInrPerQuintal: 15000,
    modalPriceInrPerQuintal: 18200,
    maxPriceInrPerQuintal: 22500,
    date: '2026-08-29',
    priceTrend: 'RISING'
  },

  // Krishna (Vijayawada & Gudivada APMC)
  {
    commodity: 'Banganapalle Mango (Pre-season & Pulp Stock)',
    marketName: 'Vijayawada Fruit Market',
    districtLgdCode: 513,
    districtName: 'Krishna',
    stateName: 'Andhra Pradesh',
    arrivalTonnes: 280,
    tradedQuantityTonnes: 270,
    minPriceInrPerQuintal: 3200,
    modalPriceInrPerQuintal: 4200,
    maxPriceInrPerQuintal: 5800,
    date: '2026-08-26',
    priceTrend: 'STABLE'
  },

  // Jaipur APMC (Kukas / Surajpole)
  {
    commodity: 'Mustard Seed (सरसों)',
    marketName: 'Jaipur Grain APMC (Surajpole)',
    districtLgdCode: 88,
    districtName: 'Jaipur',
    stateName: 'Rajasthan',
    arrivalTonnes: 1100,
    tradedQuantityTonnes: 1060,
    minPriceInrPerQuintal: 4900,
    modalPriceInrPerQuintal: 5450,
    maxPriceInrPerQuintal: 5800,
    date: '2026-08-29',
    priceTrend: 'STABLE'
  },

  // Kamrup (Guwahati APMC, Pamohi)
  {
    commodity: 'Organic Ginger (Nadia)',
    marketName: 'Guwahati APMC (Pamohi Yard)',
    districtLgdCode: 287,
    districtName: 'Kamrup',
    stateName: 'Assam',
    arrivalTonnes: 140,
    tradedQuantityTonnes: 135,
    minPriceInrPerQuintal: 3800,
    modalPriceInrPerQuintal: 4800,
    maxPriceInrPerQuintal: 5600,
    date: '2026-08-28',
    priceTrend: 'RISING'
  }
];

export const getMandiProvenance = (): DataProvenance => ENAM_PROVENANCE;

export const getMandiPricesByDistrict = (districtLgdCode: number): MandiCommodityRecord[] => {
  return MANDI_APMC_RECORDS.filter((r) => r.districtLgdCode === districtLgdCode);
};
