// src/utils/pricing.ts
import { WINTER_PRICING } from '../data/winterCourses';
import { DiscountRule } from '../data/types';

export interface PricingStep {
  description: string;
  amount: number;
}

/**
 * Compute base price for a given term fee and number of terms.
 */
export function computeBasePrice(termFee: number, terms: number): number {
  return termFee * terms;
}

/**
 * Get bundle discount percent for a given number of terms.
 */
export function getBundleDiscount(terms: number): number {
  const discount = WINTER_PRICING.bundleDiscounts.find(d => d.terms === terms);
  return discount ? discount.discountPercent : 0;
}

/**
 * Compute final price and return breakdown steps.
 */
export function calculatePricing(termFee: number, terms: number, siblingCount: number, isYoungestSibling: boolean): { finalPrice: number; steps: PricingStep[] } {
  const steps: PricingStep[] = [];
  const base = computeBasePrice(termFee, terms);
  steps.push({ description: `${terms} Term${terms > 1 ? 's' : ''} x ${termFee} EGP`, amount: base });
  // Bundle discount
  const bundlePercent = getBundleDiscount(terms);
  const bundleDiscount = -(base * bundlePercent) / 100;
  if (bundleDiscount !== 0) {
    steps.push({ description: `${bundlePercent}% Bundle Discount`, amount: bundleDiscount });
  }
  // Sibling discount eligibility check
  let siblingDiscount = 0;
  if (siblingCount > 1 && isYoungestSibling) {
    siblingDiscount = -(base * WINTER_PRICING.siblingDiscountPercent) / 100;
    steps.push({ description: `${WINTER_PRICING.siblingDiscountPercent}% Sibling Discount`, amount: siblingDiscount });
  }
  const finalPrice = base + bundleDiscount + siblingDiscount;
  steps.push({ description: 'Final Price', amount: finalPrice });
  return { finalPrice, steps };
}
