// src/engine/academicStage.ts
// Academic-year stage classification, next-stage detection, and Adult Transition status.
//
// Pipeline (adapted to existing architecture):
//   calculateAge()            → chronological age (unchanged, DOB → reference date)
//   getAcademicStageInfo()    → stage for the current academic year (1 Sep snapshot)
//   getNextStage()            → stage that follows the current stage
//   getAdultTransitionStatus()→ 18th birthday + configurable alert threshold

import { AgeGroupConfig } from '../data/types';
import { WINTER_AGE_GROUPS } from '../data/winterCourses';
import {
  ACADEMIC_YEAR_START,
  ADULT_AGE,
  ADULT_TRANSITION_ALERT_MONTHS,
} from '../data/academicYearRules';
import { calculateAge } from './ageCalculator';
import { getAgeGroup } from './courseEngine';

interface YMD {
  y: number;
  m: number; // 1-12
  d: number;
}

const pad = (n: number) => String(n).padStart(2, '0');
const toIso = ({ y, m, d }: YMD) => `${y}-${pad(m)}-${pad(d)}`;
const daysInMonth = (y: number, m: number) => new Date(y, m, 0).getDate();
const toUtcMs = ({ y, m, d }: YMD) => Date.UTC(y, m - 1, d);
const compare = (a: YMD, b: YMD) => toUtcMs(a) - toUtcMs(b);

/** Reads the reference date exactly the same way calculateAge() does (local calendar day). */
function resolveReferenceDate(referenceDateString?: string): YMD {
  const ref = referenceDateString ? new Date(referenceDateString) : new Date();
  return { y: ref.getFullYear(), m: ref.getMonth() + 1, d: ref.getDate() };
}

function parseDob(dob: string): YMD {
  const [y, m, d] = dob.trim().split('-').map((p) => parseInt(p, 10));
  return { y, m, d };
}

/**
 * Returns the date on which the student reaches `years` years of age.
 * Leap-day birthdays (29 Feb) roll over to 1 Mar in non-leap years, which is
 * consistent with how calculateAge() counts completed years.
 */
export function getBirthdayAtAge(dob: string, years: number): string {
  const b = parseDob(dob);
  const y = b.y + years;
  if (b.d > daysInMonth(y, b.m)) {
    return toIso({ y, m: b.m + 1, d: 1 });
  }
  return toIso({ y, m: b.m, d: b.d });
}

/** Start date (1 Sep by default) of the academic year containing the reference date. */
export function getAcademicYearStart(referenceDateString?: string): string {
  const ref = resolveReferenceDate(referenceDateString);
  const startThisYear: YMD = { y: ref.y, m: ACADEMIC_YEAR_START.month, d: ACADEMIC_YEAR_START.day };
  const startYear = compare(ref, startThisYear) >= 0 ? ref.y : ref.y - 1;
  return toIso({ y: startYear, m: ACADEMIC_YEAR_START.month, d: ACADEMIC_YEAR_START.day });
}

/** Returns the stage that follows the given stage (Upper Secondary → Adult). */
export function getNextStage(stage: AgeGroupConfig | null): AgeGroupConfig | null {
  if (!stage || stage.category === 'Adult') return null;
  const idx = WINTER_AGE_GROUPS.findIndex((g) => g.id === stage.id);
  if (idx === -1) return null;
  return WINTER_AGE_GROUPS[idx + 1] ?? getAgeGroup(ADULT_AGE);
}

export interface AcademicStageInfo {
  academicYearStart: string;
  /** Completed years on the academic-year start date (used ONLY for stage classification). */
  ageAtAcademicYearStart: number | null;
  academicStage: AgeGroupConfig | null;
}

/**
 * Academic-year stage: based on the student's age on 1 September of the current
 * academic year. 1 Sep itself belongs to the new academic year; any later date
 * keeps that same classification until the next 1 Sep.
 * Does NOT modify the chronological age.
 */
export function getAcademicStageInfo(dob: string, referenceDateString?: string): AcademicStageInfo {
  const academicYearStart = getAcademicYearStart(referenceDateString);
  // Local-time parse (no 'Z') so the calendar day is stable across time zones.
  const startLocal = `${academicYearStart}T00:00:00`;
  if (compare(parseDob(dob), parseDob(academicYearStart)) > 0) {
    // Born after the academic year started
    return { academicYearStart, ageAtAcademicYearStart: null, academicStage: null };
  }
  const ageAtStart = calculateAge(dob, startLocal).years;
  return {
    academicYearStart,
    ageAtAcademicYearStart: ageAtStart,
    academicStage: getAgeGroup(ageAtStart),
  };
}

export interface AdultTransitionStatus {
  eighteenthBirthday: string;
  isAdult: boolean;
  daysUntilAdult: number; // 0 when already adult
  thresholdMonths: number;
  showAlert: boolean;
}

/**
 * Adult transition detection.
 * Alert only when: current stage is Young Learner, next stage is Adult,
 * student is not yet 18, and the 18th birthday is within the configured threshold.
 */
export function getAdultTransitionStatus(
  dob: string,
  currentStage: AgeGroupConfig | null,
  referenceDateString?: string,
  thresholdMonths: number = ADULT_TRANSITION_ALERT_MONTHS
): AdultTransitionStatus {
  const ref = resolveReferenceDate(referenceDateString);
  const eighteenthBirthday = getBirthdayAtAge(dob, ADULT_AGE);
  const bday = parseDob(eighteenthBirthday);

  const isAdult = compare(ref, bday) >= 0;
  const daysUntilAdult = isAdult ? 0 : Math.round(compare(bday, ref) / 86_400_000);

  // Alert window start = 18th birthday minus N months (day clamped to month length)
  let wy = bday.y;
  let wm = bday.m - thresholdMonths;
  while (wm < 1) {
    wm += 12;
    wy -= 1;
  }
  const windowStart: YMD = { y: wy, m: wm, d: Math.min(bday.d, daysInMonth(wy, wm)) };

  const nextStage = getNextStage(currentStage);
  const nextIsAdult = nextStage?.category === 'Adult';

  const showAlert = !isAdult && nextIsAdult && compare(ref, windowStart) >= 0;

  return { eighteenthBirthday, isAdult, daysUntilAdult, thresholdMonths, showAlert };
}
