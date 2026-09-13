// src/utils/eligibility.ts
import { calculateAge } from './age';
import { AGE_GROUPS } from '../data/ageGroups';

export type CustomerType = 'Adult' | 'Young Learner';

/**
 * Determine the customer type based on age.
 * Ages 18 and above are Adult, otherwise Young Learner.
 * This can be overridden manually in the UI.
 */
export function getCustomerType(ageYears: number): CustomerType {
  return ageYears >= 18 ? 'Adult' : 'Young Learner';
}

/**
 * Map an age in years to the exact age group using the source workbook mapping.
 * Returns the group name and any sub‑group identifier.
 */
export function mapAgeToGroup(ageYears: number): { group: string; subGroup: string } {
  // Direct lookup for defined ages
  const mapping = AGE_GROUPS[ageYears];
  if (mapping) {
    return { group: mapping.group, subGroup: mapping.subGroup };
  }
  // Ages 18 and above are classified as Adult
  if (ageYears >= 18) {
    return { group: 'Adult', subGroup: '' };
  }
  // If age is outside defined ranges (e.g., <4), mark as Unknown
  return { group: 'Unknown', subGroup: '' };
}

/**
 * Determine if a Placement Test is required.
 * For ages 4 or 5 the test is mandatory (200 EGP), otherwise not required.
 */
export function getPlacementTestInfo(ageYears: number) {
  // Ages 4–5 do NOT require a placement test; ages 6+ do.
  if (ageYears >= 4 && ageYears <= 5) {
    return { required: false, reason: 'Not required for this age group' };
  }
  return { required: true, fee: 200, duration: '30 min', validity: '6 months' };
}

/**
 * Convenience wrapper that, given a DOB string, returns all eligibility data.
 */
export function evaluateEligibility(dob: string) {
  const age = calculateAge(dob);
  const customerType = getCustomerType(age.years);
  const ageGroup = mapAgeToGroup(age.years);
  const placementTest = getPlacementTestInfo(age.years);
  return {
    age,
    customerType,
    ageGroup,
    placementTest,
  };
}
