import { describe, it, expect } from 'vitest';
import { evaluateStudent } from '../courseEngine';

describe('Sales Assistant End-to-End Calculator Flow', () => {
  const ref = '2026-09-13';

  it('classifies a 10-year-old child to Upper Primary and Winter Block', () => {
    const res = evaluateStudent({
      dob: '2016-05-15',
      referenceDate: ref,
      selectedProgram: 'Winter Block',
      registrationType: 'New',
      numberOfTerms: 1,
      siblingCount: 1,
      isYoungestSibling: false,
    });

    expect(res.calculatedAge).toBe(10);
    expect(res.ageGroup.value).toBe('Upper Primary');
    expect(res.program.value).toBe('Winter Block');
    expect(res.placementTest.required).toBe(true);
    expect(res.placementTest.fee).toBe(200);
    expect(res.finalPrice).toBe(5800);
    expect(res.quickCustomerAnswerAr).toContain('5,800');
    expect(res.quickCustomerAnswerAr).toContain('200');
  });

  it('classifies a 4-year-old child to Early Years 2 with NO placement test', () => {
    const res = evaluateStudent({
      dob: '2022-04-10',
      referenceDate: ref,
      selectedProgram: 'Winter Block',
      registrationType: 'New',
      numberOfTerms: 1,
      siblingCount: 1,
      isYoungestSibling: false,
    });

    expect(res.calculatedAge).toBe(4);
    expect(res.ageGroup.value).toBe('Early Years 2');
    expect(res.placementTest.required).toBe(false);
    expect(res.finalPrice).toBe(6400);
    expect(res.quickCustomerAnswerAr).toContain('معفي من امتحان تحديد المستوى');
  });

  it('classifies an adult to Adult English BCE package', () => {
    const res = evaluateStudent({
      dob: '2000-01-01',
      referenceDate: ref,
      selectedProgram: 'Adult',
      selectedAdultProduct: 'bce',
      selectedPackageCredits: 40,
      registrationType: 'New',
    });

    expect(res.calculatedAge).toBe(26);
    expect(res.program.value).toBe('Adult');
    expect(res.placementTest.required).toBe(true);
    expect(res.placementTest.fee).toBe(200);
    expect(res.finalPrice).toBe(10000);
  });

  it('applies 10% re-registration discount for Young Learner', () => {
    const res = evaluateStudent({
      dob: '2016-05-15',
      referenceDate: ref,
      selectedProgram: 'Winter Block',
      numberOfTerms: 1,
      registrationType: 'Re-registration',
    });

    // 5800 - 10% (580) = 5220
    expect(res.basePrice).toBe(5800);
    expect(res.discountAmount).toBe(580);
    expect(res.finalPrice).toBe(5220);
    expect(res.discountsApplied.some((d) => d.name === 'Re-registration Discount')).toBe(true);
  });

  it('applies combined discounts for bundle (10% for 3 terms) + sibling discount (10%)', () => {
    const res = evaluateStudent({
      dob: '2016-05-15',
      referenceDate: ref,
      selectedProgram: 'Winter Block',
      numberOfTerms: 3,
      siblingCount: 2,
      isYoungestSibling: true,
      registrationType: 'New',
    });

    // Base: 5800 * 3 = 17400
    // Discounts: 10% bundle + 10% sibling = 20% total = 3480
    // Final: 17400 - 3480 = 13920
    expect(res.basePrice).toBe(17400);
    expect(res.discountPercentage).toBe(20);
    expect(res.discountAmount).toBe(3480);
    expect(res.finalPrice).toBe(13920);
  });

  it('applies 10% re-registration discount for Adult (BCE package)', () => {
    const res = evaluateStudent({
      dob: '2000-01-01',
      referenceDate: ref,
      selectedProgram: 'Adult',
      selectedAdultProduct: 'bce',
      selectedPackageCredits: 20,
      registrationType: 'Re-registration',
    });

    expect(res.basePrice).toBe(6000);
    expect(res.discountAmount).toBe(600);
    expect(res.finalPrice).toBe(5400);
    expect(res.discountsApplied.some((d) => d.name === 'Re-registration Discount')).toBe(true);
  });
});
