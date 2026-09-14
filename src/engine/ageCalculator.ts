// Accurate date and age calculation logic
// Supports configurable reference date (e.g. today vs. summer camp start date)

export interface AgeCalculationResult {
  years: number;
  months: number;
  days: number;
  decimalAge: number;
  formatted: string;
  referenceDateUsed: string;
  isValid: boolean;
  error?: string;
}

/**
 * Validates whether a DOB string is valid, possible, and not in the future.
 */
export function validateDob(
  dobString: string,
  referenceDateString?: string
): { valid: boolean; error?: string } {
  if (!dobString || typeof dobString !== 'string' || !dobString.trim()) {
    return { valid: false, error: 'Date of birth is empty or missing' };
  }

  const parts = dobString.trim().split('-');
  if (parts.length !== 3) {
    return { valid: false, error: 'Partial or invalid date format. Expected YYYY-MM-DD' };
  }

  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);

  if (isNaN(y) || isNaN(m) || isNaN(d)) {
    return { valid: false, error: 'Invalid numeric date values' };
  }

  if (m < 1 || m > 12) {
    return { valid: false, error: `Invalid month: ${m}. Month must be between 1 and 12` };
  }

  if (d < 1 || d > 31) {
    return { valid: false, error: `Invalid day: ${d}. Day must be between 1 and 31` };
  }

  // Check impossible dates per calendar month (handles leap years precisely)
  const daysInMonth = new Date(y, m, 0).getDate();
  if (d > daysInMonth) {
    return {
      valid: false,
      error: `Impossible date: ${dobString}. Month ${m} in year ${y} has only ${daysInMonth} days`,
    };
  }

  // Check future dates
  const dobDate = new Date(y, m - 1, d);
  const ref = referenceDateString ? new Date(referenceDateString) : new Date();
  const refDateOnly = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());

  if (dobDate.getTime() > refDateOnly.getTime()) {
    return { valid: false, error: `Future date of birth: ${dobString} is after reference date` };
  }

  return { valid: true };
}

/**
 * Calculates exact age in years, months, and days between DOB and a reference date.
 * Strictly calculates age based on calendar years and day boundaries.
 */
export function calculateAge(
  dobString: string,
  referenceDateString?: string
): AgeCalculationResult {
  const refDate = referenceDateString ? new Date(referenceDateString) : new Date();
  const refIso = refDate.toISOString().split('T')[0];

  if (!dobString || !dobString.trim()) {
    return {
      years: 0,
      months: 0,
      days: 0,
      decimalAge: 0,
      formatted: '0 years',
      referenceDateUsed: refIso,
      isValid: false,
      error: 'Empty date of birth',
    };
  }

  // Strict validation
  const validation = validateDob(dobString, referenceDateString);
  if (!validation.valid) {
    throw new Error(validation.error || `Invalid Date of Birth: ${dobString}`);
  }

  const parts = dobString.trim().split('-');
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);

  const refYear = refDate.getFullYear();
  const refMonth = refDate.getMonth() + 1; // 1-indexed (1-12)
  const refDay = refDate.getDate();

  let years = refYear - y;
  let months = refMonth - m;
  let days = refDay - d;

  // Adjust for negative days by borrowing from the previous month
  if (days < 0) {
    months -= 1;
    // Days in previous month of refDate
    const prevMonthLastDay = new Date(refYear, refMonth - 1, 0).getDate();
    days += prevMonthLastDay;
  }

  // Adjust for negative months by borrowing from years
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  // Calculate approximate decimal age for precise threshold comparisons
  const decimalAge = Number((years + months / 12 + days / 365.25).toFixed(3));

  let formatted = `${years} year${years === 1 ? '' : 's'}`;
  if (months > 0) {
    formatted += `, ${months} month${months === 1 ? '' : 's'}`;
  }
  if (years < 6 && days > 0) {
    formatted += `, ${days} day${days === 1 ? '' : 's'}`;
  }

  return {
    years,
    months,
    days,
    decimalAge,
    formatted,
    referenceDateUsed: refIso,
    isValid: true,
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

