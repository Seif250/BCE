// src/utils/recommendations.ts
import { DiscountRule } from '../data/types';
import { WINTER_PRICING } from '../data/winterCourses';

export interface DiscountInfo {
  name: string;
  description: string;
  amount: number;
}

/**
 * Compute applicable discounts based on terms, sibling count, and youngest sibling flag.
 * Returns an array of discount info objects.
 */
export function computeApplicableDiscounts(params: {
  basePrice: number;
  terms: number;
  siblingCount: number;
  isYoungestSibling: boolean;
}): DiscountInfo[] {
  const discounts: DiscountInfo[] = [];
  // Bundle discount
  const bundle = WINTER_PRICING.bundleDiscounts.find(d => d.terms === params.terms);
  if (bundle && bundle.discountPercent) {
    const amount = -(params.basePrice * bundle.discountPercent) / 100;
    discounts.push({
      name: 'Bundle Discount',
      description: `${bundle.discountPercent}% off for ${params.terms} terms`,
      amount,
    });
  }
  // Sibling discount
  if (params.siblingCount > 1 && params.isYoungestSibling) {
    const amount = -(params.basePrice * WINTER_PRICING.siblingDiscountPercent) / 100;
    discounts.push({
      name: 'Sibling Discount',
      description: `${WINTER_PRICING.siblingDiscountPercent}% off (youngest sibling)`,
      amount,
    });
  }
  return discounts;
}
