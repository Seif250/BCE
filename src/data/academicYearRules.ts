// src/data/academicYearRules.ts
// Configurable business rules for Young Learner academic-year stage classification
// and the Adult Transition Alert. Edit values here — no engine/UI changes needed.

/**
 * The Young Learner academic year starts on this month/day.
 * The day itself belongs to the NEW academic year.
 * NOTE: This is NOT a universal age cutoff — chronological age is always
 * calculated from DOB → reference date. This is used only for academic-stage classification.
 */
export const ACADEMIC_YEAR_START = { month: 9, day: 1 } as const; // 1 September

/** Age (in years) at which a student becomes an Adult learner. */
export const ADULT_AGE = 18;

/**
 * Show the internal Adult Transition Alert only when the student is within
 * this many months of their 18th birthday (and the next stage is Adults).
 */
export const ADULT_TRANSITION_ALERT_MONTHS = 1;
