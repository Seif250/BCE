import { describe, it, expect } from 'vitest';
import {
  getAgeCategory,
  getAgeGroup,
  getPlacementTestRule,
  getSummerLevelMapping,
  evaluateStudent,
} from '../courseEngine';
import { calculateAge } from '../ageCalculator';

describe('Age Calculation Engine', () => {
  it('calculates exact age at boundary birthdays', () => {
    // Reference date: 2026-09-11
    const ref = '2026-09-11';

    // Age exactly 4
    expect(calculateAge('2022-09-11', ref).years).toBe(4);
    // Age exactly 5
    expect(calculateAge('2021-09-11', ref).years).toBe(5);
    // Age exactly 6
    expect(calculateAge('2020-09-11', ref).years).toBe(6);
    // Age exactly 8
    expect(calculateAge('2018-09-11', ref).years).toBe(8);
    // Age exactly 9
    expect(calculateAge('2017-09-11', ref).years).toBe(9);
    // Age exactly 11
    expect(calculateAge('2015-09-11', ref).years).toBe(11);
    // Age exactly 12
    expect(calculateAge('2014-09-11', ref).years).toBe(12);
    // Age exactly 14
    expect(calculateAge('2012-09-11', ref).years).toBe(14);
    // Age exactly 15
    expect(calculateAge('2011-09-11', ref).years).toBe(15);
    // Age exactly 17
    expect(calculateAge('2009-09-11', ref).years).toBe(17);
    // Age exactly 18
    expect(calculateAge('2008-09-11', ref).years).toBe(18);
  });

  it('correctly handles one day before and after birthday', () => {
    const ref = '2026-09-11';
    // Birthday is tomorrow (Sep 12): still 5 years old
    expect(calculateAge('2020-09-12', ref).years).toBe(5);
    // Birthday was yesterday (Sep 10): already 6 years old
    expect(calculateAge('2020-09-10', ref).years).toBe(6);
  });
});

describe('Age Category & Group Mapping', () => {
  it('identifies boundary age categories correctly', () => {
    expect(getAgeCategory(3)).toBe('Outside Supported Range');
    expect(getAgeCategory(4)).toBe('Early Years');
    expect(getAgeCategory(5)).toBe('Early Years');
    expect(getAgeCategory(6)).toBe('Young Learner');
    expect(getAgeCategory(8)).toBe('Young Learner');
    expect(getAgeCategory(9)).toBe('Young Learner');
    expect(getAgeCategory(11)).toBe('Young Learner');
    expect(getAgeCategory(12)).toBe('Young Learner');
    expect(getAgeCategory(14)).toBe('Young Learner');
    expect(getAgeCategory(15)).toBe('Young Learner');
    expect(getAgeCategory(17)).toBe('Young Learner');
    expect(getAgeCategory(18)).toBe('Adult');
    expect(getAgeCategory(25)).toBe('Adult');
  });

  it('maps each exact age to the correct Young Learner age group', () => {
    expect(getAgeGroup(4)?.name).toBe('Early Years 2');
    expect(getAgeGroup(5)?.name).toBe('Early Years 3');
    expect(getAgeGroup(6)?.name).toContain('Lower Primary');
    expect(getAgeGroup(8)?.name).toContain('Lower Primary');
    expect(getAgeGroup(9)?.name).toContain('Upper Primary');
    expect(getAgeGroup(11)?.name).toContain('Upper Primary');
    expect(getAgeGroup(12)?.name).toContain('Lower Secondary');
    expect(getAgeGroup(14)?.name).toContain('Lower Secondary');
    expect(getAgeGroup(15)?.name).toContain('Upper Secondary');
    expect(getAgeGroup(17)?.name).toContain('Upper Secondary');
    expect(getAgeGroup(18)?.name).toContain('Adult');
  });
});

describe('Placement Test Business Rules', () => {
  it('does NOT require Placement Test for ages 4 and 5 (Ducks & Owls)', () => {
    const pt4 = getPlacementTestRule(4, 'Winter Block');
    expect(pt4.required).toBe(false);
    expect(pt4.fee).toBe(0);

    const pt5 = getPlacementTestRule(5, 'Winter Block');
    expect(pt5.required).toBe(false);
    expect(pt5.fee).toBe(0);
  });

  it('requires Placement Test for ages 6 to 17 (200 EGP, 20-30 min, valid 6m)', () => {
    const pt6 = getPlacementTestRule(6, 'Winter Block');
    expect(pt6.required).toBe(true);
    expect(pt6.fee).toBe(200);

    const pt15 = getPlacementTestRule(15, 'Winter Block');
    expect(pt15.required).toBe(true);
    expect(pt15.fee).toBe(200);
  });

  it('requires Placement Test for standard Adult courses (200 EGP)', () => {
    const ptAdult = getPlacementTestRule(25, 'Adult', 'bce');
    expect(ptAdult.required).toBe(true);
    expect(ptAdult.fee).toBe(200);
  });
});

describe('Summer Level Mappings (Strict Excel Fidelity)', () => {
  it('maps known levels accurately according to YL SC sheet', () => {
    expect(getSummerLevelMapping('LP Starter A')).toBe('LP Starter A');
    expect(getSummerLevelMapping('LP Primary Plus 1')).toBe('LP Camels');
    expect(getSummerLevelMapping('LP Primary Plus 2')).toBe('LP Crocodiles');
    expect(getSummerLevelMapping('UP Primary Plus 4')).toBe('UP Eagles');
    expect(getSummerLevelMapping('UP Primary Plus 6')).toBe('UP Whales');
    expect(getSummerLevelMapping('Secondary Plus A1')).toBe('Seconadry Elementary');
    expect(getSummerLevelMapping('Secondary Plus B1.2')).toBe('Secondary Intermediate+');
    expect(getSummerLevelMapping('Upper Secondary Plus C1.1')).toBe('US C1');
  });

  it('returns null for blank Excel mappings without inventing data', () => {
    expect(getSummerLevelMapping('LP Primary Plus 3')).toBeNull();
    expect(getSummerLevelMapping('UP Primary Plus 3')).toBeNull();
    expect(getSummerLevelMapping('UP Primary Plus 5')).toBeNull();
    expect(getSummerLevelMapping('Secondary Plus B2.2')).toBeNull();
    expect(getSummerLevelMapping('Upper Secondary Plus B2.1')).toBeNull();
  });
});

describe('Winter Pricing and Bundle Discounts', () => {
  const ref = '2026-09-11';

  it('calculates single term for Primary/Secondary at 5800 EGP', () => {
    const res = evaluateStudent({
      dob: '2016-01-01', // Age 10: Upper Primary
      referenceDate: ref,
      selectedProgram: 'Winter Block',
      registrationType: 'New',
      numberOfTerms: 1,
    });

    expect(res.basePrice).toBe(5800);
    expect(res.finalPrice).toBe(5800);
    expect(res.discountsApplied.length).toBe(0);
  });

  it('applies 5% bundle discount for 2 terms', () => {
    const res = evaluateStudent({
      dob: '2016-01-01', // Age 10
      referenceDate: ref,
      selectedProgram: 'Winter Block',
      registrationType: 'New',
      numberOfTerms: 2,
    });

    // 5800 * 2 = 11600. 5% discount = 580. Final = 11020.
    expect(res.basePrice).toBe(11600);
    expect(res.discountAmount).toBe(580);
    expect(res.finalPrice).toBe(11020);
    expect(res.discountsApplied[0].name).toBe('Bundle Discount');
  });

  it('applies 10% bundle discount for 3 terms', () => {
    const res = evaluateStudent({
      dob: '2016-01-01',
      referenceDate: ref,
      selectedProgram: 'Winter Block',
      registrationType: 'New',
      numberOfTerms: 3,
    });

    // 5800 * 3 = 17400. 10% discount = 1740. Final = 15660.
    expect(res.basePrice).toBe(17400);
    expect(res.discountAmount).toBe(1740);
    expect(res.finalPrice).toBe(15660);
  });

  it('applies 15% bundle discount for 4 terms', () => {
    const res = evaluateStudent({
      dob: '2016-01-01',
      referenceDate: ref,
      selectedProgram: 'Winter Block',
      registrationType: 'New',
      numberOfTerms: 4,
    });

    // 5800 * 4 = 23200. 15% discount = 3480. Final = 19720.
    expect(res.basePrice).toBe(23200);
    expect(res.discountAmount).toBe(3480);
    expect(res.finalPrice).toBe(19720);
  });

  it('calculates Early Years term fee at 6400 EGP', () => {
    const res = evaluateStudent({
      dob: '2022-01-01', // Age 4
      referenceDate: ref,
      selectedProgram: 'Winter Block',
      registrationType: 'New',
      numberOfTerms: 1,
    });

    expect(res.basePrice).toBe(6400);
    expect(res.finalPrice).toBe(6400);
    expect(res.academicLevel.value).toBe('Early Years 2 (Ducks)');
  });

  it('applies 10% sibling discount to youngest child', () => {
    const res = evaluateStudent({
      dob: '2016-01-01',
      referenceDate: ref,
      selectedProgram: 'Winter Block',
      registrationType: 'New',
      numberOfTerms: 1,
      siblingCount: 2,
      isYoungestSibling: true,
    });

    // 5800 base, 10% sibling discount = 580. Final = 5220.
    expect(res.basePrice).toBe(5800);
    expect(res.discountAmount).toBe(580);
    expect(res.finalPrice).toBe(5220);
    expect(res.discountsApplied.some((d) => d.name === 'Sibling Discount')).toBe(true);
  });
});

describe('Adult Packages and Re-registration', () => {
  const ref = '2026-09-11';

  it('calculates BCE package prices correctly', () => {
    // BCE 20 credits: 6000 EGP
    const res20 = evaluateStudent({
      dob: '1995-05-15',
      referenceDate: ref,
      selectedProgram: 'Adult',
      selectedAdultProduct: 'bce',
      selectedPackageCredits: 20,
      registrationType: 'New',
    });
    expect(res20.basePrice).toBe(6000);
    expect(res20.finalPrice).toBe(6000);

    // BCE 40 credits: 10000 EGP
    const res40 = evaluateStudent({
      dob: '1995-05-15',
      referenceDate: ref,
      selectedProgram: 'Adult',
      selectedAdultProduct: 'bce',
      selectedPackageCredits: 40,
      registrationType: 'New',
    });
    expect(res40.basePrice).toBe(10000);

    // BCE 60 credits: 13300 EGP
    const res60 = evaluateStudent({
      dob: '1995-05-15',
      referenceDate: ref,
      selectedProgram: 'Adult',
      selectedAdultProduct: 'bce',
      selectedPackageCredits: 60,
      registrationType: 'New',
    });
    expect(res60.basePrice).toBe(13300);
  });

  it('applies 10% re-registration discount for adult returning within 3 months', () => {
    const res = evaluateStudent({
      dob: '1995-05-15',
      referenceDate: ref,
      selectedProgram: 'Adult',
      selectedAdultProduct: 'bce',
      selectedPackageCredits: 40,
      registrationType: 'Re-registration',
    });

    // 10000 base, 10% re-reg discount = 1000. Final = 9000.
    expect(res.basePrice).toBe(10000);
    expect(res.discountAmount).toBe(1000);
    expect(res.finalPrice).toBe(9000);
  });
});

describe('Installment Eligibility Rules', () => {
  const ref = '2026-09-11';

  it('Adult: 40 and 60 credits are eligible for 6M (9%) and 12M (15%) installments', () => {
    const res = evaluateStudent({
      dob: '1995-05-15',
      referenceDate: ref,
      selectedProgram: 'Adult',
      selectedAdultProduct: 'bce',
      selectedPackageCredits: 40,
      registrationType: 'New',
    });

    expect(res.installmentEligibility.eligible).toBe(true);
    expect(res.installmentEligibility.options.length).toBe(2);
    // 6 months option: 9% admin fee
    const opt6 = res.installmentEligibility.options.find((o) => o.tenureMonths === 6);
    expect(opt6?.adminPercent).toBe(9);
    expect(opt6?.adminFee).toBe(900); // 10000 * 0.09
    expect(opt6?.totalWithAdmin).toBe(10900);

    // 12 months option: 15% admin fee
    const opt12 = res.installmentEligibility.options.find((o) => o.tenureMonths === 12);
    expect(opt12?.adminPercent).toBe(15);
    expect(opt12?.adminFee).toBe(1500); // 10000 * 0.15
    expect(opt12?.totalWithAdmin).toBe(11500);
  });

  it('Adult: 20 credits is NOT eligible for installments', () => {
    const res = evaluateStudent({
      dob: '1995-05-15',
      referenceDate: ref,
      selectedProgram: 'Adult',
      selectedAdultProduct: 'bce',
      selectedPackageCredits: 20,
      registrationType: 'New',
    });

    expect(res.installmentEligibility.eligible).toBe(false);
  });

  it('Young Learner: 1 term is NOT eligible for installments', () => {
    const res = evaluateStudent({
      dob: '2016-01-01',
      referenceDate: ref,
      selectedProgram: 'Winter Block',
      registrationType: 'New',
      numberOfTerms: 1,
    });

    expect(res.installmentEligibility.eligible).toBe(false);
    expect(res.installmentEligibility.reason).toContain('No installment for 1 term');
  });

  it('Young Learner: 2 or more terms ARE eligible for installments', () => {
    const res = evaluateStudent({
      dob: '2016-01-01',
      referenceDate: ref,
      selectedProgram: 'Winter Block',
      registrationType: 'New',
      numberOfTerms: 2,
    });

    expect(res.installmentEligibility.eligible).toBe(true);
  });
});

describe('Bilingual Quick Answer Generation (English & Egyptian Arabic)', () => {
  const ref = '2026-09-11';

  it('generates accurate English quick answers', () => {
    const res = evaluateStudent({
      dob: '2016-01-01', // Age 10
      referenceDate: ref,
      selectedProgram: 'Winter Block',
      registrationType: 'New',
      numberOfTerms: 1,
    });

    expect(res.quickCustomerAnswerEn).toContain('Based on the student\'s age (10 years)');
    expect(res.quickCustomerAnswerEn).toContain('Upper Primary');
    expect(res.quickCustomerAnswerEn).toContain('Placement Test is required');
  });

  it('generates polite, natural Egyptian Arabic quick answers (بالمصري)', () => {
    const res = evaluateStudent({
      dob: '2016-01-01', // Age 10
      referenceDate: ref,
      selectedProgram: 'Winter Block',
      registrationType: 'New',
      numberOfTerms: 1,
    });

    expect(res.quickCustomerAnswerAr).toContain('بناءً على سن الطالب (10 سنين)');
    expect(res.quickCustomerAnswerAr).toContain('Upper Primary');
    expect(res.quickCustomerAnswerAr).toContain('مطلوب أداء امتحان تحديد مستوى');
    expect(res.quickCustomerAnswerAr).toContain('5,800 جنيه مصري');
  });

  it('generates Early Years Arabic answer confirming no placement test needed', () => {
    const res = evaluateStudent({
      dob: '2022-01-01', // Age 4
      referenceDate: ref,
      selectedProgram: 'Winter Block',
      registrationType: 'New',
      numberOfTerms: 1,
    });

    expect(res.quickCustomerAnswerAr).toContain('السن ده معفي من امتحان تحديد المستوى');
    expect(res.quickCustomerAnswerAr).toContain('6,400 جنيه مصري');
  });

  it('applies 10% re-registration discount in Winter Block', () => {
    const res = evaluateStudent({
      dob: '2016-01-01', // Age 10
      referenceDate: ref,
      selectedProgram: 'Winter Block',
      registrationType: 'Re-registration',
      numberOfTerms: 1,
    });

    expect(res.basePrice).toBe(5800);
    expect(res.discountAmount).toBe(580);
    expect(res.finalPrice).toBe(5220);
    expect(res.discountsApplied.some((d) => d.name === 'Re-registration Discount')).toBe(true);
    expect(res.quickCustomerAnswerAr).toContain('إعادة التسجيل (10%)');
  });

  it('combines Sibling Discount and Re-registration Discount in Winter Block', () => {
    const res = evaluateStudent({
      dob: '2016-01-01', // Age 10
      referenceDate: ref,
      selectedProgram: 'Winter Block',
      registrationType: 'Re-registration',
      numberOfTerms: 1,
      siblingCount: 2,
      isYoungestSibling: true,
    });

    // 5800 - 580 (sibling) - 580 (re-reg) = 4640
    expect(res.basePrice).toBe(5800);
    expect(res.discountAmount).toBe(1160);
    expect(res.finalPrice).toBe(4640);
    expect(res.discountsApplied.length).toBe(2);
  });
});
