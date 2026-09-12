// Source: EG outbound Knowledge base.xlsx — YL SC sheet
// Strictly normalized Young Learner Summer School / Camps data

import { SummerCampInfo } from './types';

export const SUMMER_CAMPS: SummerCampInfo[] = [
  {
    campNumber: 1,
    name: '1st Summer Camp (SC1)',
    startDate: '2026-07-05',
    endDate: '2026-07-16',
    displayDates: '5 Jul 2026 – 16 Jul 2026',
    durationHours: 30,
    durationWeeks: 2,
    dailySchedule: '3 hours per class (2 hrs class + 1 hr activity)',
    daysOfWeek: 'Sunday to Thursday (5 times a week)',
    contentNotes: 'SC1 and SC3 share the same curriculum content, except for Starters A & B.',
  },
  {
    campNumber: 2,
    name: '2nd Summer Camp (SC2)',
    startDate: '2026-07-26',
    endDate: '2026-08-06',
    displayDates: '26 Jul 2026 – 6 Aug 2026',
    durationHours: 30,
    durationWeeks: 2,
    dailySchedule: '3 hours per class (2 hrs class + 1 hr activity)',
    daysOfWeek: 'Sunday to Thursday (5 times a week)',
    contentNotes: 'Unique syllabus progression between SC1 and SC3.',
  },
  {
    campNumber: 3,
    name: '3rd Summer Camp (SC3)',
    startDate: '2026-08-09',
    endDate: '2026-08-20',
    displayDates: '9 Aug 2026 – 20 Aug 2026',
    durationHours: 30,
    durationWeeks: 2,
    dailySchedule: '3 hours per class (2 hrs class + 1 hr activity)',
    daysOfWeek: 'Sunday to Thursday (5 times a week)',
    contentNotes: 'SC1 and SC3 share the same curriculum content, except for Starters A & B.',
  },
];

export interface SummerCoursePricingConfig {
  // Source note: The workbook does not provide explicit numeric fees in YL SC sheet.
  // Set to null to indicate 'Price not available in current source', but configurable.
  defaultPricePerCamp: number | null;
  currency: string;
  sourceNote: string;
}

export const SUMMER_PRICING_CONFIG: SummerCoursePricingConfig = {
  defaultPricePerCamp: null, // As specified in Excel analysis, points to external SharePoint calculator
  currency: 'EGP',
  sourceNote: 'Price not available in current source. Refer to YL Age & Fees Calculator on SharePoint or confirm manually.',
};

export const SUMMER_DISCOUNT_RULES = [
  {
    campsRequired: 2,
    description: '10% discount on the 2nd camp when registering for 2 Summer Camps.',
    applyRule: 'Camp 1: Full price | Camp 2: 10% discount',
    starterOnly: false,
  },
  {
    campsRequired: 3,
    description: '10% discount on the 2nd & 3rd camp when registering for 3 camps (for Starters only).',
    applyRule: 'Camp 1: Full price | Camp 2: 10% discount | Camp 3: 10% discount (Starters only)',
    starterOnly: true,
  },
];

export const SUMMER_OPERATIONAL_NOTES = [
  'The duration of each summer camp is 30 hours over two weeks.',
  'Each class is 3 hours long (2 hours class + 1 hour activity).',
  'Classes are held 5 times a week (Sunday to Thursday).',
  'SC1 and SC3 share the same content, except for Starters A & B.',
  'Discount rule 1: 10% discount on the 2nd camp if you register for 2 Summer Camps.',
  'Discount rule 2: 10% discount on the 2nd & 3rd camp if you register for 3 camps (Starters only).',
  'For unmapped levels or prices, verify with current operational team before confirming to customer.',
];
