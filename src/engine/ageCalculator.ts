// Accurate date and age calculation logic
// Supports configurable reference date (e.g. today vs. summer camp start date)

export interface AgeCalculationResult {
  years: number;
  months: number;
  days: number;
  decimalAge: number;
  formatted: string;
  referenceDateUsed: string;
}

/**
 * Calculates exact age in years, months, and days between DOB and a reference date.
 * Strictly calculates age based on calendar years and day boundaries.
 */
export function calculateAge(
  dobString: string,
  referenceDateString?: string
): AgeCalculationResult {
  if (!dobString) {
    return {
      years: 0,
      months: 0,
      days: 0,
      decimalAge: 0,
      formatted: '0 years',
      referenceDateUsed: referenceDateString || new Date().toISOString().split('T')[0],
    };
  }

  const dob = new Date(dobString);
  const refDate = referenceDateString ? new Date(referenceDateString) : new Date();

  // Validate dates
  if (isNaN(dob.getTime())) {
    throw new Error(`Invalid Date of Birth: ${dobString}`);
  }
  if (isNaN(refDate.getTime())) {
    throw new Error(`Invalid Reference Date: ${referenceDateString}`);
  }

  let years = refDate.getFullYear() - dob.getFullYear();
  let months = refDate.getMonth() - dob.getMonth();
  let days = refDate.getDate() - dob.getDate();

  // Adjust for negative days by borrowing from the previous month
  if (days < 0) {
    months -= 1;
    // Days in previous month of refDate
    const prevMonthLastDay = new Date(refDate.getFullYear(), refDate.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }

  // Adjust for negative months by borrowing from years
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  // Calculate approximate decimal age for precise threshold comparisons
  const decimalAge = Number((years + (months / 12) + (days / 365.25)).toFixed(3));

  let formatted = `${years} year${years === 1 ? '' : 's'}`;
  if (months > 0) {
    formatted += `, ${months} month${months === 1 ? '' : 's'}`;
  }
  if (years < 6 && days > 0) {
    formatted += `, ${days} day${days === 1 ? '' : 's'}`;
  }

  const refIso = refDate.toISOString().split('T')[0];

  return {
    years,
    months,
    days,
    decimalAge,
    formatted,
    referenceDateUsed: refIso,
  };
}

/**
 * Helper to format date in readable standard Egyptian / British format (e.g. 15 Oct 2018)
 */
export function formatDisplayDate(dateInput: string | Date): string {
  if (!dateInput) return '';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return String(dateInput);

  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
