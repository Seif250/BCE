// Core data types for British Council Egypt Sales Knowledge Base
// All types strictly follow the schemas extracted from EG outbound Knowledge base.xlsx

export type AgeCategory = 'Early Years' | 'Young Learner' | 'Adult' | 'Outside Supported Range';

export type ProgramType = 'Adult' | 'Winter Block' | 'Summer School';
export type ProgramFamily = 'Auto' | 'Adult' | 'Young Learner';

export type RegistrationType = 'New' | 'Re-registration';

export interface AgeGroupConfig {
  id: string;
  name: string;
  minAge: number;
  maxAge: number;
  category: AgeCategory;
  description: string;
  defaultWinterLevel?: string;
  defaultSummerLevel?: string;
}

export interface AcademicLevel {
  id: string;
  name: string;
  ageGroupId: string;
  ageGroupName: string;
  summerMapping: string | null; // null if unmapped in source
  minAge: number;
  maxAge: number;
  termsToComplete?: string; // e.g. "3-4 terms" or "6-8 terms"
  notes?: string;
}

export interface AdultPackage {
  id: string;
  credits: number;
  label: string;
  durationOrLevels: string;
  price: number;
  reRegisterOnly?: boolean;
  notes?: string;
}

export interface AdultCourseProduct {
  id: 'beginner' | 'bce' | 'ielts-coach' | 'english-online';
  name: string;
  code: string;
  description: string;
  placementTest: {
    fee: number;
    duration: string;
    validity: string;
    nonRefundable: boolean;
    notes?: string;
  };
  levels: string[];
  sessionDuration: string;
  attendanceMode: string;
  schedule: string;
  packages: AdultPackage[];
  reRegistrationRule: string;
  reRegistrationDiscountPercent: number; // e.g. 10
  operationalNotes: string[];
}

export interface WinterPricingConfig {
  primaryAndSecondaryTermFee: number; // 5800 EGP
  earlyYearsTermFee: number; // 6400 EGP
  ieltsTeensTermFee: number; // 5600 EGP
  placementTestFee: number; // 200 EGP
  placementTestMinAge: number; // 6
  termsPerYear: number; // 4
  sessionsPerTerm: number; // 9
  sessionDuration: string; // 2 hrs
  bundleDiscounts: {
    terms: number;
    discountPercent: number;
  }[];
  siblingDiscountPercent: number; // 10% on youngest child
}

export interface SummerCampInfo {
  campNumber: 1 | 2 | 3;
  name: string;
  startDate: string; // ISO date YYYY-MM-DD
  endDate: string; // ISO date YYYY-MM-DD
  displayDates: string;
  durationHours: number; // 30
  durationWeeks: number; // 2
  dailySchedule: string; // "3 hours (2 hrs class + 1 hr activity)"
  daysOfWeek: string; // "Sunday to Thursday"
  contentNotes: string; // "SC1 and SC3 are same content, except for Starters A & B"
}

export interface SummerDiscountRule {
  description: string;
  discountPercent: number;
  conditions: string;
}

export interface Branch {
  id: string;
  code: string;
  name: string;
  nameAr?: string;
  address: string;
  addressAr?: string;
  workingHours: string;
  workingHoursAr?: string;
  workingDays: string;
  workingDaysAr?: string;
  customerServiceAvailable: boolean;
  manager?: string;
  adultSeniorTeacher?: string;
  ylSeniorTeacher?: string;
  emails: string[];
  phoneOrWhatsapp?: string;
}

export interface ImportantLinkItem {
  id: string;
  title: string;
  url: string | null;
  category: 'Platform' | 'Finance & Installments' | 'Internal Forms & Archive' | 'Team & Rota';
  notes?: string;
  isInternal: boolean;
}

export interface InstallmentOption {
  tenureMonths: 6 | 12;
  adminExpensePercent: number;
  applicablePackages: number[]; // e.g. [40, 60]
}

export interface CalculationInput {
  dob: string;
  referenceDate?: string;
  selectedProgram: 'auto' | ProgramType;
  registrationType: RegistrationType;
  existingLevel?: string;
  preferredBranch?: string;
  // Winter specific
  numberOfTerms?: number;
  siblingCount?: number;
  isYoungestSibling?: boolean;
  // Summer specific
  selectedCamps?: number[]; // e.g. [1, 2]
  isStarterLevel?: boolean;
  // Adult specific
  selectedAdultProduct?: 'beginner' | 'bce' | 'ielts-coach' | 'english-online';
  selectedPackageCredits?: number;
  // Manual override
  isManualOverride?: boolean;
  overrideProgramFamily?: ProgramFamily;
}

export interface ResultField<T> {
  value: T;
  status: 'confirmed' | 'needs_confirmation' | 'unavailable';
  source: string;
}

export interface CalculationResult {
  dob: string;
  calculatedAge: number;
  ageYears: number;
  ageMonths: number;
  ageDays: number;
  referenceDateUsed: string;
  ageCategory: ResultField<AgeCategory>;
  ageGroup: ResultField<string>;
  program: ResultField<ProgramType>;
  eligibleCourses: string[];
  recommendedCourse: ResultField<string>;
  academicLevel: ResultField<string>;
  summerMapping: ResultField<string | null>;

  placementTest: {
    required: boolean;
    fee: number;
    duration: string;
    validity: string;
    reason: string;
  };
  durationAndSessions: string;
  basePrice: number | null;
  discountAmount: number;
  discountPercentage: number;
  finalPrice: number | null;
  priceNote: string;
  discountsApplied: {
    name: string;
    percentage: number;
    amount: number;
    description: string;
  }[];
  installmentEligibility: {
    eligible: boolean;
    reason: string;
    options: {
      tenureMonths: number;
      adminPercent: number;
      basePrice: number | null;
      adminFee: number | null;
      totalWithAdmin: number | null;
      monthlyPayment: number | null;
    }[];
    notes: string;
  };
  branchInfo?: Branch;
  operationalNotes: string[];
  quickCustomerAnswer: string;
  quickCustomerAnswerAr: string;
  quickCustomerAnswerEn: string;
  sourceSheet: string;
  isManualOverrideActive: boolean;
}
