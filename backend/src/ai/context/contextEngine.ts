import { profileService, ProfileData } from '../../services/profileService.js';
import { financeTools } from '../tools/financeTools.js';
import { evaluateGovernmentSchemes } from '../../domain/schemes/schemeEvaluator.js';
import { normalizeBusinessCategory, BusinessArchetype } from '../../domain/businesses/businessCatalog.js';
import { lgdLocationService } from '../../domain/location/lgdLocationService.js';
import { getLocalized } from '../skills/skillTypes.js';
import { localKnowledgeRetriever, LocalEvidencePackage } from './localKnowledgeRetriever.js';

export interface AssembledBusinessContext {
  profile: ProfileData;
  locationCluster: string;
  businessArchetype: BusinessArchetype;
  localEvidencePackage?: LocalEvidencePackage;
  financialBaseline: {
    ownCapital: number;
    projectCost: number;
    loanComponent: number;
    estimatedSubsidy: number;
    netDebt: number;
    regularMonthlyEMI: number;
    moratoriumMonthlyPayment: number;
    breakEvenDailyUnits: number;
    unitName: string;
    requiredWorkingCapital: number;
    projectedMonthlySurplus: number;
    dscr: number;
  };
  marketRadar: {
    clusterName: string;
    targetBuyerDescription: string;
    unmetDemandUnits: string;
    topCompetitorOverview: string;
  };
  schemes: Array<{ id: string; name: string; subsidyPercent: number }>;
  activeConversationState: {
    lastIntent?: string;
    selectedBusiness?: string;
    previousDecisions: string[];
  };
}

export class ContextEngine {
  private memoryStore = new Map<string, { lastIntent?: string; selectedBusiness?: string; previousDecisions: string[] }>();

  public async getContextForUser(
    userId: string,
    overrides?: { capital?: number; location?: string; businessName?: string }
  ): Promise<AssembledBusinessContext> {
    const profile = await profileService.getProfile(userId);

    const ownCapital = overrides?.capital || profile.ownCapital || 50000;
    const rawLoc = overrides?.location || (profile.village ? `${profile.village}, ${profile.block || profile.district || ''}` : '');
    const resolvedLoc = lgdLocationService.resolveLocationHierarchy(rawLoc) || {
      village: profile.village || 'Local Area',
      subDistrict: profile.block || 'Sub-District',
      block: profile.block || 'Block',
      district: profile.district || 'District',
      state: profile.state || 'India'
    };
    const locationCluster = `${resolvedLoc.village}, ${resolvedLoc.district}, ${resolvedLoc.state}`;

    const rawBiz = overrides?.businessName || profile.desiredBusiness || 'Mobile & Electronics Repair';
    const archetype = normalizeBusinessCategory(rawBiz);

    // Dynamic Deterministic Financial Calculations (PS-91 Financial Engine)
    const struct = financeTools.calculate_project_cost({ capital: ownCapital, marginPercent: 10 });
    const emi = financeTools.calculate_emi({
      loanAmount: struct.loanComponent,
      interestRate: struct.projectCost > 140000 ? 8.0 : 6.5,
      tenureMonths: struct.projectCost > 140000 ? 84 : 36,
      moratoriumMonths: struct.projectCost > 140000 ? 6 : 3
    });

    const be = financeTools.calculate_break_even({
      fixedCosts: archetype.typicalFixedCost,
      variableCostPerUnit: archetype.typicalVariableCost,
      sellingPrice: archetype.typicalSellingPrice
    });

    const wc = financeTools.calculate_working_capital({
      unitsPerDay: archetype.defaultDailyCapacity,
      rawMaterialCostPerUnit: archetype.typicalVariableCost,
      monthlySalaries: 15000,
      monthlyUtilitiesAndTransport: 10000,
      availableCapital: ownCapital
    });

    const cf = financeTools.calculate_cash_flow({
      dailyUnits: archetype.defaultDailyCapacity,
      sellingPrice: archetype.typicalSellingPrice,
      rawMaterialCost: archetype.typicalVariableCost,
      monthlyLabor: 15000,
      monthlyRentPower: 8000,
      monthlyTransport: 5000,
      monthlyOtherFixed: 2000,
      monthlyLoanEMI: emi.regularMonthlyEMI
    });

    const schemes = evaluateGovernmentSchemes(struct.projectCost, true);

    const localEvidencePackage = await localKnowledgeRetriever.assembleEvidencePackage({
      locationInput: rawLoc,
      businessInput: rawBiz,
      capitalInput: ownCapital,
      skillsInput: profile.skills || []
    });

    const userMemory = this.memoryStore.get(userId) || {
      selectedBusiness: rawBiz,
      previousDecisions: [`१०% स्वतःचे भांडवल (₹${ownCapital.toLocaleString('en-IN')}) निश्चित केले`]
    };

    return {
      profile: {
        ...profile,
        ownCapital,
        village: resolvedLoc.village,
        block: resolvedLoc.subDistrict,
        district: resolvedLoc.district,
        state: resolvedLoc.state,
        desiredBusiness: rawBiz,
        locationDetails: {
          country: 'India',
          state_id: resolvedLoc.stateLgdCode,
          state_name: resolvedLoc.state,
          district_id: resolvedLoc.districtLgdCode,
          district_name: resolvedLoc.district,
          subdistrict_id: resolvedLoc.subDistrictLgdCode || resolvedLoc.blockLgdCode,
          subdistrict_name: resolvedLoc.subDistrict || resolvedLoc.block,
          subdistrict_label: 'Taluka',
          village_id: resolvedLoc.villageLgdCode,
          village_name: resolvedLoc.village,
          lgd_code: resolvedLoc.villageLgdCode,
          pincode: resolvedLoc.pincode,
          latitude: resolvedLoc.latitude,
          longitude: resolvedLoc.longitude,
          source: 'Census 2011 & LGD Reconciled',
          source_date: '2025-26'
        } as any
      },
      locationCluster,
      businessArchetype: archetype,
      localEvidencePackage,
      financialBaseline: {
        ownCapital,
        projectCost: struct.projectCost,
        loanComponent: struct.loanComponent,
        estimatedSubsidy: struct.estimatedSubsidy,
        netDebt: struct.netLoanAfterSubsidy,
        regularMonthlyEMI: emi.regularMonthlyEMI,
        moratoriumMonthlyPayment: emi.moratoriumMonthlyPayment,
        breakEvenDailyUnits: be.breakEvenUnitsPerDay,
        unitName: getLocalized(archetype.unitName, 'mr'),
        requiredWorkingCapital: wc.totalRequiredWorkingCapital,
        projectedMonthlySurplus: cf.baseCase.netMonthlySurplus,
        dscr: cf.baseCase.debtServiceCoverageRatio
      },
      marketRadar: {
        clusterName: locationCluster,
        targetBuyerDescription: getLocalized(archetype.targetCustomers, 'mr'),
        unmetDemandUnits: `दैनिक अंदाजित क्षमता: ${archetype.defaultDailyCapacity} ${getLocalized(archetype.unitName, 'mr')}`,
        topCompetitorOverview: `स्थानिक व बाहेरील पर्यायांपेक्षा गुणवत्ता व विश्वासार्हता ही मुख्य ताकद`
      },
      schemes: schemes.map((s) => ({ id: s.id, name: s.name, subsidyPercent: s.subsidyPercent })),
      activeConversationState: userMemory
    };
  }

  public updateMemory(userId: string, updates: { lastIntent?: string; selectedBusiness?: string; decision?: string }) {
    const current = this.memoryStore.get(userId) || { previousDecisions: [] };
    if (updates.lastIntent) current.lastIntent = updates.lastIntent;
    if (updates.selectedBusiness) current.selectedBusiness = updates.selectedBusiness;
    if (updates.decision && !current.previousDecisions.includes(updates.decision)) {
      current.previousDecisions.push(updates.decision);
    }
    this.memoryStore.set(userId, current);
  }
}

export const contextEngine = new ContextEngine();
