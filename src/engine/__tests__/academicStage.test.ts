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
    expect(r.ageYears).toBe(6);
    expect(r.ageGroup.value).toBe('Lower Primary');
    expect(r.academicStage.stageName).toBe('Early Years 3');
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
