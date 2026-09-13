// src/utils/calculateStudent.ts
import { CalculationInput, CalculationResult, DiscountInfo } from '../data/types';
import { calculateAge } from './age';
import { getCustomerType, mapAgeToGroup, getPlacementTestInfo } from './eligibility';
import { calculatePricing } from './pricing';
import { computeApplicableDiscounts } from './recommendations';
import { WINTER_PRICING } from '../data/winterCourses';

/**
 * Orchestrates the full calculation flow for a student based on the input.
 * Returns a fully populated CalculationResult used by the UI.
 */
export function calculateStudent(input: CalculationInput): CalculationResult {
  // 1. Age calculation
  const { years, months, days } = calculateAge(input.dob);

  // 2. Determine customer type and age group
  const customerType = getCustomerType(years);
  const { group: ageGroup, subGroup } = mapAgeToGroup(years);
  const ageCategory = ageGroup as any; // matches AgeCategory type

  // 3. Placement test info
  const placementTest = getPlacementTestInfo(years);

  // 4. Determine program (simple handling for V1)
  const program = input.selectedProgram === 'auto' ? (ageCategory === 'Adult' ? 'Adult' : 'Winter Block') : input.selectedProgram;

  // 5. Pricing (only Winter Block is implemented for V1)
  let basePrice: number | null = null;
  let finalPrice: number | null = null;
  let discountAmount = 0;
  let discountPercentage = 0;
  const discountsApplied: { name: string; percentage: number; amount: number; description: string }[] = [];
  if (program === 'Winter Block') {
    const termFee = ageCategory === 'Early Years' ? WINTER_PRICING.earlyYearsTermFee : WINTER_PRICING.primaryAndSecondaryTermFee;
    const terms = input.numberOfTerms ?? 1;
    const siblingCount = input.siblingCount ?? 1;
    const isYoungest = input.isYoungestSibling ?? false;
    const pricing = calculatePricing(termFee, terms, siblingCount, isYoungest);
    basePrice = pricing.finalPrice; // before applying additional discounts (our pricing already includes bundle and sibling)
    // Compute discounts using recommendation utils (adds same bundle/sibling logic, safe to call)
    const discInfo = computeApplicableDiscounts({
      basePrice: pricing.finalPrice,
      terms,
      siblingCount,
      isYoungestSibling: isYoungest,
    });
    discInfo.forEach((d) => {
      const match = d.description.match(/(\d+)%/);
      const perc = match ? parseInt(match[1], 10) : 0;
      discountsApplied.push({
        name: d.name,
        percentage: perc,
        amount: d.amount,
        description: d.description,
      });
      discountAmount += d.amount;
    });
    discountPercentage = basePrice !== 0 ? Math.round((-discountAmount / basePrice) * 100) : 0;
    finalPrice = basePrice + discountAmount; // discountAmount is negative
  }

  // 6. Assemble result (many fields are placeholders for now)
  const result: CalculationResult = {
    dob: input.dob,
    calculatedAge: years,
    ageYears: years,
    ageMonths: months,
    ageDays: days,
    referenceDateUsed: new Date().toISOString().split('T')[0],
    ageCategory: { value: ageCategory as any, status: 'confirmed' as const, source: 'AgeGroupLogic' },
    ageGroup: { value: ageGroup, status: 'confirmed' as const, source: 'AgeGroupLogic' },
    program: { value: program as any, status: 'confirmed' as const, source: 'ProgramSelection' },
    eligibleCourses: [],
    recommendedCourse: { value: '', status: 'needs_confirmation' as const, source: '' },
    academicLevel: { value: '', status: 'needs_confirmation' as const, source: '' },
    summerMapping: { value: null, status: 'needs_confirmation' as const, source: '' },
    placementTest: {
      required: placementTest.required,
      fee: placementTest.required ? placementTest.fee : 0,
      duration: placementTest.required ? placementTest.duration : '',
      validity: placementTest.required ? placementTest.validity : '',
      reason: placementTest.required ? '' : placementTest.reason,
    },
    durationAndSessions: '',
    basePrice,
    discountAmount,
    discountPercentage,
    finalPrice,
    priceNote: '',
    discountsApplied,
    installmentEligibility: {
      eligible: false,
      reason: 'N/A',
      options: [],
      notes: '',
    },
    branchInfo: undefined,
    operationalNotes: [],
    quickCustomerAnswer: '',
    quickCustomerAnswerAr: '',
    quickCustomerAnswerEn: '',
    sourceSheet: 'StudentCalculator',
    isManualOverrideActive: !!input.isManualOverride,
  };
  return result;
}
