import { DataProvenance, createProvenance } from './dataProvenance.js';

export interface DistrictSkillEcosystem {
  districtLgdCode: number;
  districtName: string;
  stateName: string;
  mappedSkills: string[];
  vocationalCentersCount: number;
  traditionalCrafts: string[];
  provenance: DataProvenance;
}

const NSDC_PROVENANCE = createProvenance(
  'Ministry of Skill Development and Entrepreneurship (MSDE) & National Skill Development Corporation (NSDC)',
  'https://www.nsdcindia.org/district-skill-development-plan',
  'DISTRICT',
  '2024',
  'HIGH',
  'PMKVY 4.0 training center audits and district skill development committee mappings.'
);

export const DISTRICT_SKILL_ECOSYSTEMS: Record<number, DistrictSkillEcosystem> = {
  // Sangli (504, Maharashtra)
  504: {
    districtLgdCode: 504,
    districtName: 'Sangli',
    stateName: 'Maharashtra',
    mappedSkills: ['Turmeric trading & curing', 'Grape pruning & cold preservation', 'Machine tool operation', 'Leather tanning', 'Drip irrigation servicing'],
    vocationalCentersCount: 28,
    traditionalCrafts: ['Miraj Musical Instruments (Sitar/Tanpura)', 'Kolhapuri Leather Chappals'],
    provenance: NSDC_PROVENANCE
  },

  // Nashik (479, Maharashtra)
  479: {
    districtLgdCode: 479,
    districtName: 'Nashik',
    stateName: 'Maharashtra',
    mappedSkills: ['Grape packaging & grading', 'Automobile tool & die', 'Onion curation & sorting', 'Electrical winding', 'Solar equipment technician'],
    vocationalCentersCount: 46,
    traditionalCrafts: ['Yeola Paithani Silk Weaving', 'Copper & Brass Metal Work'],
    provenance: NSDC_PROVENANCE
  },

  // Pune (492, Maharashtra)
  492: {
    districtLgdCode: 492,
    districtName: 'Pune',
    stateName: 'Maharashtra',
    mappedSkills: ['Precision machining', 'Greenhouse maintenance', 'Commercial refrigeration', 'Industrial welding', 'Food processing'],
    vocationalCentersCount: 82,
    traditionalCrafts: ['Silver jewellery', 'Handloom weaving'],
    provenance: NSDC_PROVENANCE
  },

  // SBS Nagar (36, Punjab)
  36: {
    districtLgdCode: 36,
    districtName: 'Shahid Bhagat Singh Nagar',
    stateName: 'Punjab',
    mappedSkills: ['Tractor mechanical repair', 'Poplar timber joinery', 'Precision welding', 'Mechanized crop harvesting', 'Citrus fruit processing'],
    vocationalCentersCount: 16,
    traditionalCrafts: ['Phulkari Hand Embroidery', 'Wood Inlay Work'],
    provenance: NSDC_PROVENANCE
  },

  // Sonipat (80, Haryana)
  80: {
    districtLgdCode: 80,
    districtName: 'Sonipat',
    stateName: 'Haryana',
    mappedSkills: ['Commercial mushroom cultivation', 'Sheet metal press operation', 'Cold storage management', 'CNC turning', 'Auto electricals'],
    vocationalCentersCount: 32,
    traditionalCrafts: ['Handloom Durries & Rugs', 'Terracotta Tandoor Making'],
    provenance: NSDC_PROVENANCE
  },

  // Guntur (510, Andhra Pradesh)
  510: {
    districtLgdCode: 510,
    districtName: 'Guntur',
    stateName: 'Andhra Pradesh',
    mappedSkills: ['Chilli grading & capsaicin assaying', 'Cotton grading & spinning', 'Handloom pit loom weaving', 'Spice milling', 'Warehouse management'],
    vocationalCentersCount: 34,
    traditionalCrafts: ['Mangalagiri Cotton Handloom', 'Bell Metal Craft (Bhattiprolu)'],
    provenance: NSDC_PROVENANCE
  },

  // Krishna (513, Andhra Pradesh)
  513: {
    districtLgdCode: 513,
    districtName: 'Krishna',
    stateName: 'Andhra Pradesh',
    mappedSkills: ['Shrimp hatchery management', 'Kalamkari vegetable dye printing', 'Mango orchard management', 'Electroplating & jewellery polishing'],
    vocationalCentersCount: 38,
    traditionalCrafts: ['Pedana Kalamkari Block Print', 'Machilipatnam Rold Gold', 'Kondapalli Wooden Toys'],
    provenance: NSDC_PROVENANCE
  },

  // Jaipur (88, Rajasthan)
  88: {
    districtLgdCode: 88,
    districtName: 'Jaipur',
    stateName: 'Rajasthan',
    mappedSkills: ['Hand block printing', 'Gemstone facet cutting', 'Ceramic blue glaze moulding', 'Kundan meenakari', 'Leather footwear crafting'],
    vocationalCentersCount: 65,
    traditionalCrafts: ['Blue Pottery of Jaipur', 'Sanganeri/Bagru Block Printing', 'Jaipuri Razai (Quilts)'],
    provenance: NSDC_PROVENANCE
  },

  // Kamrup (287, Assam)
  287: {
    districtLgdCode: 287,
    districtName: 'Kamrup',
    stateName: 'Assam',
    mappedSkills: ['Silk handloom weaving', 'Bamboo splitting & carving', 'Tea leaf processing', 'Bell metal shaping', 'Organic spice dehydration'],
    vocationalCentersCount: 24,
    traditionalCrafts: ['Sualkuchi Golden Muga Silk Weaving', 'Hajo Bell Metal Craft', 'Assamese Jaapi Craft'],
    provenance: NSDC_PROVENANCE
  }
};

export const getDistrictSkillEcosystem = (districtLgdCode: number): DistrictSkillEcosystem | undefined => {
  return DISTRICT_SKILL_ECOSYSTEMS[districtLgdCode];
};
