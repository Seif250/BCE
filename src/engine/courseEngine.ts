// Centralized Business Rules Engine for British Council Egypt
// Evaluates Age, Program Eligibility, Academic Levels, Discounts, Prices, and Installments
// Strictly driven by normalized data from EG outbound Knowledge base.xlsx

import {
  AgeCategory,
  AgeGroupConfig,
  AcademicLevel,
  ProgramType,
  CalculationInput,
  CalculationResult,
  AdultCourseProduct,
} from '../data/types';
import {
  WINTER_AGE_GROUPS,
  WINTER_ACADEMIC_LEVELS,
  WINTER_PRICING,
  IELTS_FOR_TEENS_INFO,
  WINTER_OPERATIONAL_NOTES,
} from '../data/winterCourses';
import { ADULT_COURSES } from '../data/adultCourses';
import {
  SUMMER_CAMPS,
  SUMMER_PRICING_CONFIG,
  SUMMER_OPERATIONAL_NOTES,
} from '../data/summerCamps';
import { BRANCHES } from '../data/branches';
import { ADULT_INSTALLMENT_RULES, YL_INSTALLMENT_RULES } from '../data/installments';
import { calculateAge, formatDisplayDate } from './ageCalculator';

/**
 * Determines age category based on exact calendar years.
 * Source bands:
 * - Age < 4: Outside supported range
 * - Age 4 to 5: Early Years
 * - Age 6 to 17: Young Learner
 * - Age 18+: Adult
 */
export function getAgeCategory(ageYears: number): AgeCategory {
  if (ageYears < 4) return 'Outside Supported Range';
  if (ageYears >= 4 && ageYears <= 5) return 'Early Years';
  if (ageYears >= 6 && ageYears <= 17) return 'Young Learner';
  return 'Adult';
}

/**
 * Returns the exact Young Learner / Early Years Age Group based on age in years.
 * Boundaries are strictly tested: 4, 5, 6-8, 9-11, 12-14, 15-17.
 */
export function getAgeGroup(ageYears: number): AgeGroupConfig | null {
  if (ageYears < 4) {
    return {
      id: 'unsupported',
      name: 'Unsupported / outside configured range',
      minAge: 0,
      maxAge: 3.999,
      category: 'Outside Supported Range',
      description: 'Too young for current programs.',
    };
  }
  if (ageYears >= 18) {
    return {
      id: 'adult',
      name: 'Adult',
      minAge: 18,
      maxAge: 99,
      category: 'Adult',
      description: 'Adult English courses (Beginner, BCE, IELTS Coach, English Online)',
    };
  }

  for (const group of WINTER_AGE_GROUPS) {
    if (ageYears >= group.minAge && ageYears <= group.maxAge) {
      return group;
    }
  }

  return null;
}

/**
 * Returns available academic levels for a specific age group.
 */
export function getAcademicLevelsForAge(ageYears: number): AcademicLevel[] {
  return WINTER_ACADEMIC_LEVELS.filter(
    (lvl) => ageYears >= lvl.minAge && ageYears <= lvl.maxAge
  );
}

/**
 * Returns the Placement Test rules based on age and program.
 */
export function getPlacementTestRule(
  ageYears: number,
  program: ProgramType,
  adultProductCode?: string
): {
  required: boolean;
  fee: number;
  duration: string;
  validity: string;
  reason: string;
} {
  // Age 4 and 5: No Placement Test
  if (ageYears >= 4 && ageYears < 6) {
    return {
      required: false,
      fee: 0,
      duration: 'N/A',
      validity: 'N/A',
      reason: 'No Placement Test needed for 4 & 5 years old (Ducks & Owls) — Early Years.',
    };
  }

  // Ages 6 to 17: Placement Test required
  if (ageYears >= 6 && ageYears < 18) {
    return {
      required: true,
      fee: WINTER_PRICING.placementTestFee, // 200 EGP
      duration: '20 to 30 mins',
      validity: '6 months (Non-refundable)',
      reason: 'Placement Test is required for learners from 6 years old to determine exact level.',
    };
  }

  // Adult (18+)
  if (adultProductCode === 'english-online') {
    return {
      required: true,
      fee: 0,
      duration: 'Online assessment included',
      validity: 'Platform account',
      reason: 'Integrated online placement assessment included with English Online subscription.',
    };
  }

  return {
    required: true,
    fee: 200,
    duration: '20 to 30 mins',
    validity: '6 months (Non-refundable)',
    reason: 'Placement Test required for Adults (fee: 200 EGP, duration: 20–30 mins, valid 6 months).',
  };
}

/**
 * Maps a Winter Academic Level to Summer School Camp Level.
 * Returns null if the Excel source left the mapping blank.
 */
export function getSummerLevelMapping(academicLevelName?: string): string | null {
  if (!academicLevelName) return null;

  const found = WINTER_ACADEMIC_LEVELS.find(
    (lvl) => lvl.name.trim().toLowerCase() === academicLevelName.trim().toLowerCase()
  );

  return found ? found.summerMapping : null;
}

/**
 * Main evaluation function for the Sales Calculator.
 * Executes instantly on any input change.
 */
export function evaluateStudent(input: CalculationInput): CalculationResult {
  // 1. Calculate Age
  const ageCalc = calculateAge(input.dob, input.referenceDate);
  const effectiveAge = ageCalc.years;

  let ageCategory = getAgeCategory(effectiveAge);
  
  // 2. Program family and override
  const programFamily = input.isManualOverride && input.overrideProgramFamily && input.overrideProgramFamily !== 'Auto'
    ? input.overrideProgramFamily
    : (ageCategory === 'Adult' ? 'Adult' : 'Young Learner');

  // If override changes the family, adjust ageCategory logically for UI
  if (input.isManualOverride && input.overrideProgramFamily) {
    if (input.overrideProgramFamily === 'Adult' && ageCategory !== 'Adult') {
      ageCategory = 'Adult';
    } else if (input.overrideProgramFamily === 'Young Learner' && ageCategory === 'Adult') {
      ageCategory = 'Young Learner';
    }
  }

  const ageGroupConfig = getAgeGroup(effectiveAge);
  const ageGroupName = ageGroupConfig ? ageGroupConfig.name : 'Unsupported / outside configured range';

  // 3. Determine specific Program
  let program: ProgramType;
  if (input.selectedProgram !== 'auto') {
    program = input.selectedProgram;
  } else {
    // Auto detection based on determined family
    if (programFamily === 'Adult') {
      program = 'Adult';
    } else {
      program = 'Winter Block'; // Default primary season for YL
    }
  }

  // 3. Placement Test rule
  const ptRule = getPlacementTestRule(effectiveAge, program, input.selectedAdultProduct);

  // 4. Academic level & course recommendations
  let academicLevel = 'Placement / level confirmation required';
  let recommendedCourse = '';
  let eligibleCourses: string[] = [];
  let summerMapping: string | null = null;
  let durationAndSessions = '';
  let sourceSheet = 'EG outbound Knowledge base.xlsx';

  // Operational notes accumulator
  const operationalNotes: string[] = [];

  // Branch details
  const branchInfo = input.preferredBranch
    ? BRANCHES.find((b) => b.id === input.preferredBranch || b.code === input.preferredBranch)
    : undefined;

  // 5. Evaluation per program
  let basePrice: number | null = null;
  let discountAmount = 0;
  let discountPercentage = 0;
  let finalPrice: number | null = null;
  let priceNote = '';
  const discountsApplied: CalculationResult['discountsApplied'] = [];

  // ==========================
  // A. EARLY YEARS & YOUNG LEARNER - WINTER BLOCK
  // ==========================
  if (program === 'Winter Block') {
    sourceSheet = 'EG outbound Knowledge base.xlsx — YL WB';
    operationalNotes.push(...WINTER_OPERATIONAL_NOTES);

    // Level assignment
    if (effectiveAge === 4) {
      academicLevel = 'Early Years 2 (Ducks)';
      recommendedCourse = 'Early Years 2 (Ducks) – Winter Block';
      eligibleCourses = ['Early Years 2 (Ducks)'];
      summerMapping = 'Ducks';
    } else if (effectiveAge === 5) {
      academicLevel = 'Early Years 3 (Owls)';
      recommendedCourse = 'Early Years 3 (Owls) – Winter Block';
      eligibleCourses = ['Early Years 3 (Owls)'];
      summerMapping = 'Owls';
    } else if (input.existingLevel) {
      academicLevel = input.existingLevel;
      recommendedCourse = `${input.existingLevel} (${ageGroupName})`;
      eligibleCourses = [input.existingLevel];
      summerMapping = getSummerLevelMapping(input.existingLevel);
    } else {
      academicLevel = `Placement required (${ageGroupName})`;
      recommendedCourse = `${ageGroupName} Winter Block Course`;
      eligibleCourses = getAcademicLevelsForAge(effectiveAge).map((lvl) => lvl.name);
      summerMapping = null;
    }

    if (input.isManualOverride && input.overrideAcademicLevel) {
      academicLevel = input.overrideAcademicLevel;
      summerMapping = getSummerLevelMapping(academicLevel);
    }

    durationAndSessions = '4 terms, 9 sessions during 9 weeks (1 session/week, 2 hrs/session)';

    // Pricing calculation
    const terms = input.numberOfTerms && input.numberOfTerms > 0 ? input.numberOfTerms : 1;
    let termFee = WINTER_PRICING.primaryAndSecondaryTermFee; // default 5800

    if (effectiveAge >= 4 && effectiveAge < 6) {
      termFee = WINTER_PRICING.earlyYearsTermFee; // 6400
    } else if (effectiveAge >= 15 && effectiveAge <= 17 && input.existingLevel === 'IELTS for Teens') {
      termFee = WINTER_PRICING.ieltsTeensTermFee; // 5600
      durationAndSessions = '18 hours in winter (Class duration: 2 hours, can only be attended once)';
    }

    basePrice = termFee * terms;

    // Bundle Discount (2 terms: 5%, 3 terms: 10%, 4 terms: 15%)
    let bundleDiscountRate = 0;
    if (terms === 2) bundleDiscountRate = 0.05;
    else if (terms === 3) bundleDiscountRate = 0.10;
    else if (terms >= 4) bundleDiscountRate = 0.15;

    let currentDiscount = 0;
    if (bundleDiscountRate > 0) {
      const bundleAmount = Math.round(basePrice * bundleDiscountRate);
      currentDiscount += bundleAmount;
      discountsApplied.push({
        name: 'Bundle Discount',
        percentage: bundleDiscountRate * 100,
        amount: bundleAmount,
        description: `${bundleDiscountRate * 100}% discount applied for booking ${terms} terms.`,
      });
    }

    // Sibling Discount (10% on youngest child when registering >1 child)
    if (input.siblingCount && input.siblingCount > 1 && input.isYoungestSibling) {
      const siblingRate = WINTER_PRICING.siblingDiscountPercent / 100; // 0.10
      const siblingAmount = Math.round(basePrice * siblingRate);
      currentDiscount += siblingAmount;
      discountsApplied.push({
        name: 'Sibling Discount',
        percentage: 10,
        amount: siblingAmount,
        description: '10% sibling discount applied for youngest child booked in the same term.',
      });
    }

    discountAmount = currentDiscount;
    discountPercentage = basePrice > 0 ? Math.round((discountAmount / basePrice) * 100) : 0;
    finalPrice = basePrice - discountAmount;
    priceNote = `${terms} term${terms > 1 ? 's' : ''} at ${termFee.toLocaleString()} EGP/term`;
  }

  // ==========================
  // B. YOUNG LEARNER - SUMMER SCHOOL
  // ==========================
  else if (program === 'Summer School') {
    sourceSheet = 'EG outbound Knowledge base.xlsx — YL SC';
    operationalNotes.push(...SUMMER_OPERATIONAL_NOTES);

    // Level assignment
    if (effectiveAge === 4) {
      academicLevel = 'Ducks';
      recommendedCourse = 'Summer Camp – Ducks';
      eligibleCourses = ['Ducks'];
      summerMapping = 'Ducks';
    } else if (effectiveAge === 5) {
      academicLevel = 'Owls';
      recommendedCourse = 'Summer Camp – Owls';
      eligibleCourses = ['Owls'];
      summerMapping = 'Owls';
    } else if (input.existingLevel) {
      const mapped = getSummerLevelMapping(input.existingLevel);
      academicLevel = mapped ? mapped : 'Summer mapping not specified in current source';
      recommendedCourse = mapped ? `Summer Camp – ${mapped}` : `Summer Camp (${input.existingLevel})`;
      eligibleCourses = mapped ? [mapped] : [];
      summerMapping = mapped;
    } else {
      academicLevel = `Placement required (${ageGroupName})`;
      recommendedCourse = `${ageGroupName} Summer Camp`;
      eligibleCourses = getAcademicLevelsForAge(effectiveAge)
        .map((lvl) => lvl.summerMapping)
        .filter((lvl): lvl is string => Boolean(lvl));
      summerMapping = null;
    }

    durationAndSessions = 'Each camp: 30 hours over 2 weeks, 3 hrs/day (2h class + 1h activity), Sun–Thu';

    // Pricing calculation: Default is null ("Price not available in current source")
    const selectedCamps = input.selectedCamps && input.selectedCamps.length > 0
      ? input.selectedCamps
      : [1];
    const campCount = selectedCamps.length;

    if (SUMMER_PRICING_CONFIG.defaultPricePerCamp === null) {
      basePrice = null;
      finalPrice = null;
      discountAmount = 0;
      discountPercentage = 0;
      priceNote = 'Price not available in current source (refer to SharePoint YL Age & Fees Calculator)';
    } else {
      const pricePerCamp = SUMMER_PRICING_CONFIG.defaultPricePerCamp;
      basePrice = pricePerCamp * campCount;

      // Summer discounts:
      // - 10% on 2nd camp if 2 camps
      // - 10% on 2nd & 3rd camp if 3 camps (for starters only)
      let summerDiscount = 0;
      if (campCount === 2) {
        const camp2Discount = Math.round(pricePerCamp * 0.10);
        summerDiscount += camp2Discount;
        discountsApplied.push({
          name: '2-Camp Discount',
          percentage: 5, // 10% on 1 of 2 camps
          amount: camp2Discount,
          description: '10% discount on the 2nd camp for 2 Summer Camps registration.',
        });
      } else if (campCount === 3) {
        if (input.isStarterLevel) {
          const camp2And3Discount = Math.round(pricePerCamp * 0.10 * 2);
          summerDiscount += camp2And3Discount;
          discountsApplied.push({
            name: '3-Camp Starter Discount',
            percentage: 6.67, // 10% on 2 of 3 camps
            amount: camp2And3Discount,
            description: '10% discount on 2nd and 3rd camp for 3 camps (Starter level only).',
          });
        } else {
          // If 3 camps but not starter, applies 10% on 2nd camp
          const camp2Discount = Math.round(pricePerCamp * 0.10);
          summerDiscount += camp2Discount;
          discountsApplied.push({
            name: '2nd Camp Discount',
            percentage: 3.33,
            amount: camp2Discount,
            description: '10% discount on 2nd camp (3rd camp discount is reserved for Starters only).',
          });
        }
      }

      discountAmount = summerDiscount;
      discountPercentage = basePrice > 0 ? Math.round((discountAmount / basePrice) * 100) : 0;
      finalPrice = basePrice - discountAmount;
      priceNote = `${campCount} camp${campCount > 1 ? 's' : ''} at ${pricePerCamp.toLocaleString()} EGP/camp`;
    }
  }

  // ==========================
  // C. ADULT COURSES
  // ==========================
  else {
    sourceSheet = 'EG outbound Knowledge base.xlsx — Adult';

    const adultProd = ADULT_COURSES.find(
      (p) => p.id === (input.selectedAdultProduct || 'bce')
    ) || ADULT_COURSES[1];

    operationalNotes.push(...adultProd.operationalNotes);
    eligibleCourses = adultProd.levels;
    recommendedCourse = adultProd.name;
    academicLevel = input.existingLevel || 'Level placement via PT';
    durationAndSessions = adultProd.sessionDuration;

    // Pick package
    const credits = input.selectedPackageCredits || (adultProd.packages[1]?.credits || 20);
    const pkg = adultProd.packages.find((p) => p.credits === credits) || adultProd.packages[0];

    if (pkg) {
      basePrice = pkg.price;
      priceNote = `${pkg.label} — ${pkg.durationOrLevels}`;

      // Re-registration discount: 10% if within 3 months
      if (input.registrationType === 'Re-registration') {
        const reRegAmount = Math.round(basePrice * 0.10);
        discountAmount = reRegAmount;
        discountPercentage = 10;
        finalPrice = basePrice - discountAmount;
        discountsApplied.push({
          name: 'Re-registration Discount',
          percentage: 10,
          amount: reRegAmount,
          description: '10% re-registration discount (within 3 months from last attended session).',
        });
      } else {
        finalPrice = basePrice;
      }
    }
  }

  // 6. Installment calculation
  const installmentEligibility = evaluateInstallments({
    program,
    basePrice: finalPrice || basePrice,
    adultPackageCredits: input.selectedPackageCredits || (program === 'Adult' ? 20 : undefined),
    terms: input.numberOfTerms || 1,
  });

  // 7. Quick Customer Answer Generation (Bilingual: English & Egyptian Arabic)
  const quickCustomerAnswerEn = generateQuickCustomerAnswer({
    effectiveAge,
    ageGroupName,
    program,
    recommendedCourse,
    academicLevel,
    ptRule,
    finalPrice,
    basePrice,
    discountsApplied,
    branchInfo,
  });

  const quickCustomerAnswerAr = generateQuickCustomerAnswerAr({
    effectiveAge,
    ageGroupName,
    program,
    recommendedCourse,
    academicLevel,
    ptRule,
    finalPrice,
    basePrice,
    discountsApplied,
    branchInfo,
  });

  return {
    dob: input.dob,
    calculatedAge: effectiveAge,
    ageYears: ageCalc.years,
    ageMonths: ageCalc.months,
    ageDays: ageCalc.days,
    referenceDateUsed: ageCalc.referenceDateUsed,
    ageCategory: { value: ageCategory, status: 'confirmed', source: sourceSheet },
    ageGroup: { value: ageGroupName, status: 'confirmed', source: sourceSheet },
    program: { value: program, status: 'confirmed', source: sourceSheet },
    eligibleCourses,
    recommendedCourse: { value: recommendedCourse, status: 'confirmed', source: sourceSheet },
    academicLevel: { value: academicLevel, status: 'confirmed', source: sourceSheet },
    summerMapping: { value: summerMapping, status: 'confirmed', source: sourceSheet },
    placementTest: ptRule,
    durationAndSessions,
    basePrice,
    discountAmount,
    discountPercentage,
    finalPrice,
    priceNote,
    discountsApplied,
    installmentEligibility,
    branchInfo,
    operationalNotes,
    quickCustomerAnswer: quickCustomerAnswerEn,
    quickCustomerAnswerEn,
    quickCustomerAnswerAr,
    sourceSheet,
    isManualOverrideActive: Boolean(input.isManualOverride),
  };
}

/**
 * Calculates installment options and eligibility based on source rules.
 */
function evaluateInstallments(params: {
  program: ProgramType;
  basePrice: number | null;
  adultPackageCredits?: number;
  terms: number;
}): CalculationResult['installmentEligibility'] {
  const { program, totalPrice = params.basePrice, adultPackageCredits, terms } = {
    ...params,
    totalPrice: params.basePrice,
  };

  // Adult rules:
  // Must pay with credit card. Valid only for 40 and 60 credits packages. Admin expense: 9% for 6M, 15% for 12M.
  if (program === 'Adult') {
    const isEligibleCredits = adultPackageCredits === 40 || adultPackageCredits === 60;

    if (!isEligibleCredits) {
      return {
        eligible: false,
        reason: 'Installments are only available for 40-credit and 60-credit Adult packages.',
        options: [],
        notes: ADULT_INSTALLMENT_RULES.notes.join(' '),
      };
    }

    const options = ADULT_INSTALLMENT_RULES.tenures.map((tenure) => {
      const adminFee = totalPrice !== null ? Math.round(totalPrice * tenure.adminRate) : null;
      const totalWithAdmin = totalPrice !== null && adminFee !== null ? totalPrice + adminFee : null;
      const monthlyPayment = totalWithAdmin !== null ? Math.round(totalWithAdmin / tenure.months) : null;

      return {
        tenureMonths: tenure.months,
        adminPercent: tenure.adminRate * 100,
        basePrice: totalPrice,
        adminFee,
        totalWithAdmin,
        monthlyPayment,
      };
    });

    return {
      eligible: true,
      reason: 'Eligible for credit card installments (40 or 60 credits package).',
      options,
      notes: 'Must pay total amount by credit card. Exact charges subject to official bank calculator.',
    };
  }

  // Young Learner rules:
  // No installment for 1 term; booking must start from 2 terms.
  if (program === 'Winter Block') {
    if (terms < 2) {
      return {
        eligible: false,
        reason: 'No installment for 1 term. Bookings must start from 2 terms to qualify for installments.',
        options: [],
        notes: YL_INSTALLMENT_RULES.notes.join(' '),
      };
    }

    return {
      eligible: true,
      reason: 'Eligible for installments (2 or more terms booked).',
      options: [
        {
          tenureMonths: 6,
          adminPercent: 9, // reference rate
          basePrice: totalPrice,
          adminFee: totalPrice !== null ? Math.round(totalPrice * 0.09) : null,
          totalWithAdmin: totalPrice !== null ? Math.round(totalPrice * 1.09) : null,
          monthlyPayment: totalPrice !== null ? Math.round((totalPrice * 1.09) / 6) : null,
        },
      ],
      notes: 'Refer to official Installment Charges Calculator - Updated.xlsx for exact banking terms.',
    };
  }

  // Summer School
  return {
    eligible: false,
    reason: 'Installment availability for Summer School requires confirmation with the customer service desk.',
    options: [],
    notes: 'Refer to branch customer service for summer payment facilities.',
  };
}

/**
 * Builds a customer-facing, professional text snippet ready to be copied into chat or read on a call.
 * Does NOT include confidential internal codes or CRM links.
 */
function generateQuickCustomerAnswer(params: {
  effectiveAge: number;
  ageGroupName: string;
  program: ProgramType;
  recommendedCourse: string;
  academicLevel: string;
  ptRule: { required: boolean; fee: number };
  finalPrice: number | null;
  basePrice: number | null;
  discountsApplied: { name: string; percentage: number }[];
  branchInfo?: { name: string; address: string; workingHours: string };
}): string {
  const parts: string[] = [];

  // Age and program
  if (params.effectiveAge < 18) {
    parts.push(
      `Based on the student's age (${params.effectiveAge} years), they are eligible for our ${params.ageGroupName} program in ${params.program}.`
    );
  } else {
    parts.push(
      `For Adult learners, our recommended course is ${params.recommendedCourse}.`
    );
  }

  // Placement test
  if (!params.ptRule.required) {
    parts.push('No Placement Test is required for this age.');
  } else {
    parts.push(
      `A Placement Test is required (fee: ${params.ptRule.fee} EGP, valid for 6 months).`
    );
  }

  // Course & Level
  if (params.academicLevel && !params.academicLevel.includes('Placement required')) {
    parts.push(`The designated level is ${params.academicLevel}.`);
  }

  // Fees & Discounts
  if (params.finalPrice !== null) {
    let feeText = `The total tuition fee is ${params.finalPrice.toLocaleString()} EGP`;
    if (params.discountsApplied.length > 0) {
      const discountNames = params.discountsApplied
        .map((d) => `${d.name} (${d.percentage}%)`)
        .join(', ');
      feeText += ` (includes ${discountNames})`;
    }
    feeText += '.';
    parts.push(feeText);
  }

  // Branch
  if (params.branchInfo) {
    parts.push(
      `Classes are available at our ${params.branchInfo.name} branch (${params.branchInfo.address}, Working hours: ${params.branchInfo.workingHours}).`
    );
  }

  return parts.join(' ');
}

/**
 * Builds a polite, customer-ready text snippet in Egyptian Arabic (بالمصري)
 * Ideal for reading to Egyptian parents on calls or copying directly to WhatsApp.
 */
function generateQuickCustomerAnswerAr(params: {
  effectiveAge: number;
  ageGroupName: string;
  program: ProgramType;
  recommendedCourse: string;
  academicLevel: string;
  ptRule: { required: boolean; fee: number };
  finalPrice: number | null;
  basePrice: number | null;
  discountsApplied: { name: string; percentage: number }[];
  branchInfo?: { name: string; address: string; workingHours: string };
}): string {
  const parts: string[] = [];

  const programAr =
    params.program === 'Winter Block'
      ? 'البرنامج الشتوي (Winter Block)'
      : params.program === 'Summer School'
      ? 'المدرسة الصيفية (Summer School)'
      : 'كورسات الكبار (Adult Courses)';

  // Age and program
  if (params.effectiveAge < 18) {
    parts.push(
      `بناءً على سن الطالب (${params.effectiveAge} سنين)، المرحلة المناسبة له هي ${params.ageGroupName} في ${programAr}.`
    );
  } else {
    parts.push(
      `بالنسبة للكبار، الكورس المناسب والمقترح هو ${params.recommendedCourse}.`
    );
  }

  // Placement test
  if (!params.ptRule.required) {
    parts.push('السن ده معفي من امتحان تحديد المستوى (لا يوجد Placement Test).');
  } else {
    parts.push(
      `مطلوب أداء امتحان تحديد مستوى (رسومه ${params.ptRule.fee} جنيه مصري، وصالح لمدة 6 شهور).`
    );
  }

  // Course & Level
  if (params.academicLevel && !params.academicLevel.includes('Placement required')) {
    parts.push(`المستوى الأكاديمي المقترح هو ${params.academicLevel}.`);
  }

  // Fees & Discounts
  if (params.finalPrice !== null) {
    let feeText = `إجمالي المصروفات المطلوبة ${params.finalPrice.toLocaleString()} جنيه مصري`;
    if (params.discountsApplied.length > 0) {
      const discountNames = params.discountsApplied
        .map((d) => `${d.name} (${d.percentage}%)`)
        .join(' و ');
      feeText += ` (شامل خصم ${discountNames})`;
    }
    feeText += '.';
    parts.push(feeText);
  }

  // Branch
  if (params.branchInfo) {
    parts.push(
      `الكورس متاح بفرع ${params.branchInfo.name} (${params.branchInfo.address}، مواعيد العمل: ${params.branchInfo.workingHours}).`
    );
  }

  return parts.join(' ');
}
