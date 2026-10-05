import { describe, it, expect } from 'vitest';
import { calculateAge } from '../ageCalculator';
import { evaluateStudent, getAgeGroup } from '../courseEngine';
import {
  getAcademicStageInfo,
  getAcademicYearStart,
  getAdultTransitionStatus,
  getBirthdayAtAge,
  getNextStage,
} from '../academicStage';
import { ADULT_TRANSITION_ALERT_MONTHS } from '../../data/academicYearRules';

const REF = '2026-10-05';
const status = (dob: string, ref = REF) => {
  const stage = getAgeGroup(calculateAge(dob, ref).years);
  return getAdultTransitionStatus(dob, stage, ref);
};

describe('Chronological age (unchanged)', () => {
  it('normal age with years/months/days', () => {
    const a = calculateAge('2015-03-20', REF);
    expect([a.years, a.months, a.days]).toEqual([11, 6, 15]);
  });
  it('exactly 18 / one day before / one month before', () => {
    expect(calculateAge('2008-10-05', REF).years).toBe(18);
    expect(calculateAge('2008-10-06', REF).years).toBe(17);
    const m = calculateAge('2008-11-05', REF);
    expect([m.years, m.months, m.days]).toEqual([17, 11, 0]);
  });
});

describe('Academic year (1 September) — stage only', () => {
  const dob = '2020-09-01'; // turns 6 on 1 Sep 2026

  it('31 Aug belongs to the previous academic year', () => {
    expect(getAcademicYearStart('2026-08-31')).toBe('2025-09-01');
    const info = getAcademicStageInfo(dob, '2026-08-31');
    expect(info.ageAtAcademicYearStart).toBe(5);
    expect(info.academicStage?.name).toBe('Early Years 3');
    expect(calculateAge(dob, '2026-08-31').years).toBe(5);
  });

  it('1 Sep itself starts the new academic year', () => {
    expect(getAcademicYearStart('2026-09-01')).toBe('2026-09-01');
    const info = getAcademicStageInfo(dob, '2026-09-01');
    expect(info.ageAtAcademicYearStart).toBe(6);
    expect(info.academicStage?.name).toBe('Lower Primary');
  });

  it('2 Sep stays in the academic year that began on 1 Sep', () => {
    expect(getAcademicYearStart('2026-09-02')).toBe('2026-09-01');
    expect(getAcademicStageInfo(dob, '2026-09-02').academicStage?.name).toBe('Lower Primary');
  });

  it('does NOT shift chronological age (birthday after 1 Sep)', () => {
    const late = '2020-09-02';
    const ref = '2026-09-05';
    expect(calculateAge(late, ref).years).toBe(6); // real age unchanged
    expect(getAcademicStageInfo(late, ref).ageAtAcademicYearStart).toBe(5); // academic snapshot
    const r = evaluateStudent({ dob: late, referenceDate: ref } as never);
    expect(r.ageYears).toBe(6); // actual age still 6
    expect(r.ageGroup.value).toBe('Early Years 3'); // stage follows academic year
    expect(r.academicStage.stageName).toBe('Early Years 3');
  });
});

describe('Academic-year stage drives course / price / placement test', () => {
  const dob = '2020-09-01'; // turns 6 on 1 Sep 2026
  const run = (ref: string) => evaluateStudent({ dob, referenceDate: ref } as never);

  it('31 Aug: Early Years 3 (Owls), 6,400 EGP, no placement test', () => {
    const r = run('2026-08-31');
    expect(r.ageYears).toBe(5);
    expect(r.ageGroup.value).toBe('Early Years 3');
    expect(r.academicLevel.value).toBe('Early Years 3 (Owls)');
    expect(r.basePrice).toBe(6400);
    expect(r.placementTest.required).toBe(false);
  });

  it('1 Sep: new academic year → Lower Primary, 5,800 EGP, placement test 200 EGP', () => {
    const r = run('2026-09-01');
    expect(r.ageYears).toBe(6);
    expect(r.ageGroup.value).toBe('Lower Primary');
    expect(r.basePrice).toBe(5800);
    expect(r.placementTest.required).toBe(true);
    expect(r.placementTest.fee).toBe(200);
  });

  it('2 Sep: stays Lower Primary, 5,800 EGP, placement test', () => {
    const r = run('2026-09-02');
    expect(r.ageGroup.value).toBe('Lower Primary');
    expect(r.basePrice).toBe(5800);
    expect(r.placementTest.required).toBe(true);
  });

  it('birthday 2 Sep: actual age 6 but academic stage Early Years 3 pricing until next 1 Sep', () => {
    const r = evaluateStudent({ dob: '2020-09-02', referenceDate: '2026-09-02' } as never);
    expect(r.ageYears).toBe(6);
    expect(r.calculatedAge).toBe(6);
    expect(r.ageGroup.value).toBe('Early Years 3');
    expect(r.basePrice).toBe(6400);
    expect(r.placementTest.required).toBe(false);
  });

  it('bundle discounts still apply on top of the stage-based price', () => {
    const r = evaluateStudent({ dob: '2020-09-02', referenceDate: '2026-09-02', numberOfTerms: 2 } as never);
    expect(r.basePrice).toBe(12800);
    expect(r.finalPrice).toBe(12800 - 640);
  });
});

describe('Next stage', () => {
  it('Upper Secondary → Adult, Adult → none', () => {
    expect(getNextStage(getAgeGroup(17))?.name).toBe('Adult');
    expect(getNextStage(getAgeGroup(14))?.name).toBe('Upper Secondary');
    expect(getNextStage(getAgeGroup(18))).toBeNull();
  });
});

describe('Adult transition alert', () => {
  it('uses the configured threshold', () => {
    expect(ADULT_TRANSITION_ALERT_MONTHS).toBe(1);
    expect(status('2008-11-05').thresholdMonths).toBe(1);
  });
  it('more than 1 month before 18 → no alert', () => {
    expect(status('2008-11-06').showAlert).toBe(false);
    expect(status('2009-03-01').showAlert).toBe(false);
  });
  it('exactly 1 month before 18 → alert', () => {
    const s = status('2008-11-05');
    expect(s.showAlert).toBe(true);
    expect(s.daysUntilAdult).toBe(31);
  });
  it('less than 1 month before 18 → alert', () => {
    const s = status('2008-10-30');
    expect(s.showAlert).toBe(true);
    expect(s.daysUntilAdult).toBe(25);
    expect(s.eighteenthBirthday).toBe('2026-10-30');
  });
  it('one day before 18 (birthday tomorrow) → alert', () => {
    const s = status('2008-10-06');
    expect(s.showAlert).toBe(true);
    expect(s.daysUntilAdult).toBe(1);
  });
  it('turns 18 today → Adult, no alert', () => {
    const s = status('2008-10-05');
    expect(s.isAdult).toBe(true);
    expect(s.showAlert).toBe(false);
    const r = evaluateStudent({ dob: '2008-10-05', referenceDate: REF } as never);
    expect(r.ageGroup.value).toBe('Adult');
    expect(r.adultTransition.showAlert).toBe(false);
  });
  it('already 18 → no alert', () => {
    expect(status('2005-01-01').showAlert).toBe(false);
  });
  it('threshold is configurable (2 months)', () => {
    const dob = '2008-11-20';
    const stage = getAgeGroup(calculateAge(dob, REF).years);
    expect(getAdultTransitionStatus(dob, stage, REF, 1).showAlert).toBe(false);
    expect(getAdultTransitionStatus(dob, stage, REF, 2).showAlert).toBe(true);
  });
  it('leap-day birthday rolls to 1 Mar consistently with calculateAge', () => {
    expect(getBirthdayAtAge('2008-02-29', 18)).toBe('2026-03-01');
    const before = status('2008-02-29', '2026-02-28');
    expect(before.showAlert).toBe(true);
    expect(before.daysUntilAdult).toBe(1);
    expect(calculateAge('2008-02-29', '2026-03-01').years).toBe(18);
    expect(status('2008-02-29', '2026-03-01').isAdult).toBe(true);
  });
});

describe('Quick Answer stays clean', () => {
  it('no internal wording is copied, but a customer-facing hint is included', () => {
    const r = evaluateStudent({ dob: '2008-10-30', referenceDate: REF } as never);
    expect(r.adultTransition.showAlert).toBe(true);
    for (const txt of [r.quickCustomerAnswerEn, r.quickCustomerAnswerAr]) {
      expect(txt).not.toMatch(/alert|internal|agent/i);
    }
    expect(r.quickCustomerAnswerEn).toContain('turning 18 soon');
  });
  it('no hint when not approaching 18', () => {
    const r = evaluateStudent({ dob: '2010-01-01', referenceDate: REF } as never);
    expect(r.quickCustomerAnswerEn).not.toContain('turning 18');
  });
});

describe('Final Business-Rule Boundary Matrix — Independent Verification', () => {
  // -------------------------------------------------------------
  // 1. September boundary across EVERY Young Learner stage transition
  // -------------------------------------------------------------

  describe('Transition 1: Early Years → Lower Primary (Age 5 → 6)', () => {
    const dob = '2020-09-01'; // turns 6 on 1 Sep 2026

    it('August 31: Early Years 3 (Owls), 6,400 EGP, no PT', () => {
      const res = evaluateStudent({ dob, referenceDate: '2026-08-31' } as never);
      expect(res.ageYears).toBe(5);
      expect(res.ageGroup.value).toBe('Early Years 3');
      expect(res.basePrice).toBe(6400);
      expect(res.placementTest.required).toBe(false);
    });

    it('September 1: Lower Primary, 5,800 EGP, PT required (200 EGP)', () => {
      const res = evaluateStudent({ dob, referenceDate: '2026-09-01' } as never);
      expect(res.ageYears).toBe(6);
      expect(res.ageGroup.value).toBe('Lower Primary');
      expect(res.basePrice).toBe(5800);
      expect(res.placementTest.required).toBe(true);
      expect(res.placementTest.fee).toBe(200);
    });

    it('September 2: Lower Primary, 5,800 EGP, PT required', () => {
      const res = evaluateStudent({ dob, referenceDate: '2026-09-02' } as never);
      expect(res.ageYears).toBe(6);
      expect(res.ageGroup.value).toBe('Lower Primary');
      expect(res.basePrice).toBe(5800);
      expect(res.placementTest.required).toBe(true);
    });

    it('Birthday on Sep 2: actual age 6, but academic stage Early Years 3 on Sep 2', () => {
      const res = evaluateStudent({ dob: '2020-09-02', referenceDate: '2026-09-02' } as never);
      expect(res.ageYears).toBe(6);
      expect(res.ageGroup.value).toBe('Early Years 3');
      expect(res.basePrice).toBe(6400);
      expect(res.placementTest.required).toBe(false);
    });
  });

  describe('Transition 2: Lower Primary → Upper Primary (Age 8 → 9)', () => {
    const dob = '2017-09-01'; // turns 9 on 1 Sep 2026

    it('August 31: Lower Primary (age 8 at 2025-09-01)', () => {
      const res = evaluateStudent({ dob, referenceDate: '2026-08-31' } as never);
      expect(res.ageYears).toBe(8);
      expect(res.ageGroup.value).toBe('Lower Primary');
      expect(res.nextStage).toBe('Upper Primary');
    });

    it('September 1: Upper Primary (age 9 at 2026-09-01)', () => {
      const res = evaluateStudent({ dob, referenceDate: '2026-09-01' } as never);
      expect(res.ageYears).toBe(9);
      expect(res.ageGroup.value).toBe('Upper Primary');
      expect(res.nextStage).toBe('Lower Secondary');
    });

    it('September 2: Upper Primary', () => {
      const res = evaluateStudent({ dob, referenceDate: '2026-09-02' } as never);
      expect(res.ageYears).toBe(9);
      expect(res.ageGroup.value).toBe('Upper Primary');
    });

    it('Birthday on Sep 2: actual age 9, but academic stage Lower Primary on Sep 2', () => {
      const res = evaluateStudent({ dob: '2017-09-02', referenceDate: '2026-09-02' } as never);
      expect(res.ageYears).toBe(9);
      expect(res.ageGroup.value).toBe('Lower Primary');
    });
  });

  describe('Transition 3: Upper Primary → Lower Secondary (Age 11 → 12)', () => {
    const dob = '2014-09-01'; // turns 12 on 1 Sep 2026

    it('August 31: Upper Primary (age 11 at 2025-09-01)', () => {
      const res = evaluateStudent({ dob, referenceDate: '2026-08-31' } as never);
      expect(res.ageYears).toBe(11);
      expect(res.ageGroup.value).toBe('Upper Primary');
      expect(res.nextStage).toBe('Lower Secondary');
    });

    it('September 1: Lower Secondary (age 12 at 2026-09-01)', () => {
      const res = evaluateStudent({ dob, referenceDate: '2026-09-01' } as never);
      expect(res.ageYears).toBe(12);
      expect(res.ageGroup.value).toBe('Lower Secondary');
      expect(res.nextStage).toBe('Upper Secondary');
    });

    it('September 2: Lower Secondary', () => {
      const res = evaluateStudent({ dob, referenceDate: '2026-09-02' } as never);
      expect(res.ageYears).toBe(12);
      expect(res.ageGroup.value).toBe('Lower Secondary');
    });

    it('Birthday on Sep 2: actual age 12, but academic stage Upper Primary on Sep 2', () => {
      const res = evaluateStudent({ dob: '2014-09-02', referenceDate: '2026-09-02' } as never);
      expect(res.ageYears).toBe(12);
      expect(res.ageGroup.value).toBe('Upper Primary');
    });
  });

  describe('Transition 4: Lower Secondary → Upper Secondary (Age 14 → 15)', () => {
    const dob = '2011-09-01'; // turns 15 on 1 Sep 2026

    it('August 31: Lower Secondary (age 14 at 2025-09-01)', () => {
      const res = evaluateStudent({ dob, referenceDate: '2026-08-31' } as never);
      expect(res.ageYears).toBe(14);
      expect(res.ageGroup.value).toBe('Lower Secondary');
      expect(res.nextStage).toBe('Upper Secondary');
    });

    it('September 1: Upper Secondary (age 15 at 2026-09-01)', () => {
      const res = evaluateStudent({ dob, referenceDate: '2026-09-01' } as never);
      expect(res.ageYears).toBe(15);
      expect(res.ageGroup.value).toBe('Upper Secondary');
      expect(res.nextStage).toBe('Adult');
    });

    it('September 2: Upper Secondary', () => {
      const res = evaluateStudent({ dob, referenceDate: '2026-09-02' } as never);
      expect(res.ageYears).toBe(15);
      expect(res.ageGroup.value).toBe('Upper Secondary');
    });

    it('Birthday on Sep 2: actual age 15, but academic stage Lower Secondary on Sep 2', () => {
      const res = evaluateStudent({ dob: '2011-09-02', referenceDate: '2026-09-02' } as never);
      expect(res.ageYears).toBe(15);
      expect(res.ageGroup.value).toBe('Lower Secondary');
    });
  });

  describe('Transition 5: Upper Secondary → Adults (Age 17 → 18)', () => {
    const dob = '2008-09-01'; // turns 18 on 1 Sep 2026

    it('August 31 (17 years + 364 days): Upper Secondary, Next is Adult, Alert active', () => {
      const res = evaluateStudent({ dob, referenceDate: '2026-08-31' } as never);
      expect(res.ageYears).toBe(17);
      expect(res.ageMonths).toBe(11);
      expect(res.ageGroup.value).toBe('Upper Secondary');
      expect(res.nextStage).toBe('Adult');
      expect(res.adultTransition.isAdult).toBe(false);
      expect(res.adultTransition.daysUntilAdult).toBe(1);
      expect(res.adultTransition.showAlert).toBe(true);
    });

    it('September 1 (Exactly 18 years): MUST be Adult, no alert', () => {
      const res = evaluateStudent({ dob, referenceDate: '2026-09-01' } as never);
      expect(res.ageYears).toBe(18);
      expect(res.calculatedAge).toBe(18);
      expect(res.ageGroup.value).toBe('Adult');
      expect(res.program.value).toBe('Adult');
      expect(res.adultTransition.isAdult).toBe(true);
      expect(res.adultTransition.showAlert).toBe(false);
    });

    it('September 2 (18+ years): MUST be Adult, no alert', () => {
      const res = evaluateStudent({ dob, referenceDate: '2026-09-02' } as never);
      expect(res.ageYears).toBe(18);
      expect(res.ageGroup.value).toBe('Adult');
      expect(res.adultTransition.isAdult).toBe(true);
      expect(res.adultTransition.showAlert).toBe(false);
    });
  });

  // -------------------------------------------------------------
  // 2. Critical Invariant: chronologicalAge >= 18 MUST ALWAYS be Adult
  // -------------------------------------------------------------

  describe('Invariant: chronologicalAge >= 18 is ALWAYS Adult regardless of academic stage', () => {
    it('turns 18 in October (after 1 Sep start, so academic age was 17): becomes Adult immediately upon turning 18', () => {
      // DOB: 2008-10-10.
      // On 2026-09-01 (academic start), student was 17 years old.
      // On 2026-10-10, student turns 18 chronologically.
      const res = evaluateStudent({ dob: '2008-10-10', referenceDate: '2026-10-10' } as never);
      expect(res.ageYears).toBe(18);
      expect(res.academicStage.ageAtAcademicYearStart).toBe(17); // snapshot on 1 Sep was 17
      expect(res.ageGroup.value).toBe('Adult'); // invariant: MUST be Adult!
      expect(res.program.value).toBe('Adult');
      expect(res.adultTransition.isAdult).toBe(true);
      expect(res.adultTransition.showAlert).toBe(false);
    });

    it('already 19 or 20 years old is consistently Adult', () => {
      const res = evaluateStudent({ dob: '2006-05-15', referenceDate: '2026-10-05' } as never);
      expect(res.ageYears).toBe(20);
      expect(res.ageGroup.value).toBe('Adult');
      expect(res.adultTransition.isAdult).toBe(true);
      expect(res.adultTransition.showAlert).toBe(false);
    });
  });

  // -------------------------------------------------------------
  // 3. Adult Transition Alert conditions
  // -------------------------------------------------------------

  describe('Adult Transition Alert condition checks', () => {
    it('chronologicalAge < 18 + nextStage === Adult + within 1-month threshold → ALERT', () => {
      // Reference date: 2026-10-05
      // 18th birthday: 2026-10-25 (in 20 days)
      const res = evaluateStudent({ dob: '2008-10-25', referenceDate: '2026-10-05' } as never);
      expect(res.ageYears).toBe(17);
      expect(res.nextStage).toBe('Adult');
      expect(res.adultTransition.isAdult).toBe(false);
      expect(res.adultTransition.daysUntilAdult).toBe(20);
      expect(res.adultTransition.showAlert).toBe(true);
    });

    it('chronologicalAge < 18 + nextStage === Adult + MORE than 1 month away → NO ALERT', () => {
      // 18th birthday: 2026-12-01 (almost 2 months away)
      const res = evaluateStudent({ dob: '2008-12-01', referenceDate: '2026-10-05' } as never);
      expect(res.ageYears).toBe(17);
      expect(res.nextStage).toBe('Adult');
      expect(res.adultTransition.showAlert).toBe(false);
    });

    it('younger student (e.g. age 14, nextStage is Upper Secondary) → NO ALERT', () => {
      const res = evaluateStudent({ dob: '2012-10-05', referenceDate: '2026-10-05' } as never);
      expect(res.nextStage).toBe('Upper Secondary');
      expect(res.adultTransition.showAlert).toBe(false);
    });
  });
});

