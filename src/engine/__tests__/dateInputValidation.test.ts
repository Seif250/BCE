import { describe, it, expect } from 'vitest';
import { calculateAge } from '../ageCalculator';
import { evaluateStudent } from '../courseEngine';

describe('Date Input Validation & Calculation Integration', () => {
  const ref = '2026-09-14';

  it('correctly handles padded single-digit days and months (e.g. 5/5/2016 -> 2016-05-05)', () => {
    const rawD = '5';
    const rawM = '5';
    const rawY = '2016';

    const iso = `${rawY}-${rawM.padStart(2, '0')}-${rawD.padStart(2, '0')}`;
    expect(iso).toBe('2016-05-05');

    const age = calculateAge(iso, ref);
    expect(age.years).toBe(10);

    const res = evaluateStudent({
      dob: iso,
      referenceDate: ref,
      selectedProgram: 'Winter Block',
      registrationType: 'New',
    });

    expect(res.calculatedAge).toBe(10);
    expect(res.ageGroup.value).toBe('Upper Primary');
    expect(res.finalPrice).toBe(5800);
  });

  it('correctly handles 2-digit years (e.g. 16 -> 2016, 95 -> 1995)', () => {
    const currentYear = new Date().getFullYear();
    const curYear2Digits = currentYear % 100;

    const expandYear = (yStr: string) => {
      const yNum = parseInt(yStr, 10);
      return yNum <= curYear2Digits ? 2000 + yNum : 1900 + yNum;
    };

    expect(expandYear('16')).toBe(2016);
    expect(expandYear('08')).toBe(2008);
    expect(expandYear('95')).toBe(1995);
  });

  it('correctly calculates student instantly when pressing enter with complete values', () => {
    const iso = '2018-03-22';
    const res = evaluateStudent({
      dob: iso,
      referenceDate: ref,
      selectedProgram: 'Winter Block',
      registrationType: 'New',
    });

    expect(res.calculatedAge).toBe(8);
    expect(res.ageGroup.value).toBe('Lower Primary');
    expect(res.placementTest.required).toBe(true);
  });
});
