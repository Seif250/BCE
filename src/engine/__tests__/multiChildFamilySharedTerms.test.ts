import { describe, it, expect } from 'vitest';

describe('Multi-Child Sibling Shared Terms Discount Calculation', () => {
  // Calculation helper mirroring the exact logic in StudentCalculator
  function calculateFamily(
    children: { name: string; ageYears: number; termsCount: number }[]
  ) {
    // Sort oldest first
    const sorted = [...children].sort((a, b) => b.ageYears - a.ageYears);

    return sorted.map((child, index) => {
      const isEldest = index === 0;
      const isEarlyYears = child.ageYears < 6;
      const baseTermFee = isEarlyYears ? 6400 : 5800;
      const rawBaseTotal = baseTermFee * child.termsCount;

      let bundleDiscountPercent = 0;
      if (child.termsCount === 2) bundleDiscountPercent = 5;
      else if (child.termsCount === 3) bundleDiscountPercent = 10;
      else if (child.termsCount === 4) bundleDiscountPercent = 15;

      const bundleRate = bundleDiscountPercent / 100;
      const bundleDiscountAmount = Math.round(rawBaseTotal * bundleRate);

      let sharedTermsWithOlder = 0;
      let siblingDiscountAmount = 0;

      if (!isEldest) {
        const olderTerms = Math.max(...sorted.slice(0, index).map((o) => o.termsCount));
        sharedTermsWithOlder = Math.min(child.termsCount, olderTerms);
        siblingDiscountAmount = Math.round(baseTermFee * sharedTermsWithOlder * 0.10);
      }

      const totalDiscountAmount = bundleDiscountAmount + siblingDiscountAmount;
      const finalChildPrice = rawBaseTotal - totalDiscountAmount;

      return {
        ...child,
        isEldest,
        baseTermFee,
        rawBaseTotal,
        sharedTermsWithOlder,
        bundleDiscountPercent,
        bundleDiscountAmount,
        siblingDiscountAmount,
        totalDiscountAmount,
        finalChildPrice,
      };
    });
  }

  it('applies sibling discount ONLY to shared term when eldest has 1 term and younger has 2 terms', () => {
    // Eldest (10 yrs): 1 term
    // Younger (7 yrs): 2 terms
    const results = calculateFamily([
      { name: 'Child 1', ageYears: 10, termsCount: 1 },
      { name: 'Child 2', ageYears: 7, termsCount: 2 },
    ]);

    const eldest = results.find((c) => c.ageYears === 10)!;
    const younger = results.find((c) => c.ageYears === 7)!;

    // Eldest: 5800 * 1 = 5800, no discount
    expect(eldest.isEldest).toBe(true);
    expect(eldest.rawBaseTotal).toBe(5800);
    expect(eldest.bundleDiscountAmount).toBe(0);
    expect(eldest.siblingDiscountAmount).toBe(0);
    expect(eldest.finalChildPrice).toBe(5800);

    // Younger: 5800 * 2 = 11600 base
    // 5% bundle discount on 2 terms = 580 EGP
    // Overlapping terms with eldest = min(2, 1) = 1 term
    // 10% sibling discount on 1 shared term = 5800 * 1 * 0.10 = 580 EGP
    // Total discount = 580 + 580 = 1160 EGP
    // Final price = 11600 - 1160 = 10440 EGP
    expect(younger.isEldest).toBe(false);
    expect(younger.sharedTermsWithOlder).toBe(1);
    expect(younger.rawBaseTotal).toBe(11600);
    expect(younger.bundleDiscountAmount).toBe(580);
    expect(younger.siblingDiscountAmount).toBe(580);
    expect(younger.totalDiscountAmount).toBe(1160);
    expect(younger.finalChildPrice).toBe(10440);

    // Total Family Price
    const familyTotal = eldest.finalChildPrice + younger.finalChildPrice;
    expect(familyTotal).toBe(16240);
  });

  it('applies sibling discount on all terms when both siblings book the same number of terms', () => {
    // Eldest (12 yrs): 3 terms
    // Younger (8 yrs): 3 terms
    const results = calculateFamily([
      { name: 'Child 1', ageYears: 12, termsCount: 3 },
      { name: 'Child 2', ageYears: 8, termsCount: 3 },
    ]);

    const eldest = results.find((c) => c.ageYears === 12)!;
    const younger = results.find((c) => c.ageYears === 8)!;

    // Eldest: 5800 * 3 = 17400, 10% bundle (1740), final = 15660
    expect(eldest.bundleDiscountAmount).toBe(1740);
    expect(eldest.siblingDiscountAmount).toBe(0);
    expect(eldest.finalChildPrice).toBe(15660);

    // Younger: 5800 * 3 = 17400, 10% bundle (1740) + 10% sibling on 3 shared terms (1740) = 3480 discount
    // Final = 13920
    expect(younger.sharedTermsWithOlder).toBe(3);
    expect(younger.bundleDiscountAmount).toBe(1740);
    expect(younger.siblingDiscountAmount).toBe(1740);
    expect(younger.finalChildPrice).toBe(13920);
  });

  it('correctly calculates for 4 children with varying terms', () => {
    const results = calculateFamily([
      { name: 'Child 1', ageYears: 14, termsCount: 2 }, // Eldest (2 terms)
      { name: 'Child 2', ageYears: 10, termsCount: 1 }, // 1 term (shared 1 with Child 1)
      { name: 'Child 3', ageYears: 8, termsCount: 3 },  // 3 terms (shared max(2,1)=2 terms)
      { name: 'Child 4', ageYears: 4, termsCount: 2 },  // 2 terms, EY (6400/term, shared max(2,1,3)=2 terms)
    ]);

    expect(results.length).toBe(4);
    expect(results[0].isEldest).toBe(true);
    expect(results[1].sharedTermsWithOlder).toBe(1);
    expect(results[2].sharedTermsWithOlder).toBe(2);
    expect(results[3].sharedTermsWithOlder).toBe(2);
    expect(results[3].baseTermFee).toBe(6400);
    expect(results[3].siblingDiscountAmount).toBe(6400 * 2 * 0.10); // 1280
  });
});
