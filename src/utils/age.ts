// src/utils/age.ts
export interface AgeResult {
  years: number;
  months: number;
  days: number;
}

/**
 * Calculate age based on a YYYY-MM-DD date string.
 * Returns years, months, days.
 */
export function calculateAge(dob: string): AgeResult {
  const birth = new Date(dob);
  const today = new Date();
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

/**
 * Map age in years to an age group.
 */
export function getAgeGroup(years: number): 'Early Years' | 'Young Learner' | 'Adult' {
  if (years <= 5) return 'Early Years';
  if (years <= 17) return 'Young Learner';
  return 'Adult';
}
