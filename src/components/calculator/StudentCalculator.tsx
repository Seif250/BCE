import React, { useState, useEffect, useCallback } from 'react';
import { calculateAge } from '../../utils/age';
import { useLanguage } from '../../i18n/LanguageContext';
import { CalculationInput, CalculationResult, ProgramFamily, ProgramType } from '../../data/types';
import { evaluateStudent } from '../../engine/courseEngine';
import { ResultCard } from './ResultCard';
import { DiscountSimulator } from './DiscountSimulator';

export const StudentCalculator: React.FC = () => {
  const { t, language, isRTL } = useLanguage();

  const [dob, setDob] = useState('');
  const [manualOverride, setManualOverride] = useState(false);
  const [overrideProgramFamily, setOverrideProgramFamily] = useState<ProgramFamily>('Auto');
  const [selectedSeason, setSelectedSeason] = useState<'Winter Block' | 'Summer School'>('Winter Block');

  const [existingLevel, setExistingLevel] = useState('');

  // Discount simulator values
  const [terms, setTerms] = useState(1);
  const [siblingCount, setSiblingCount] = useState(1);
  const [isYoungestSibling, setIsYoungestSibling] = useState(false);

  const [result, setResult] = useState<CalculationResult | null>(null);

  // Compute age and category
  const computeAgeInfo = useCallback(() => {
    const { years } = calculateAge(dob);
    return { age: years } as const;
  }, [dob]);

  const handleCalculate = () => {
    let programToPass: 'auto' | ProgramType = 'auto';
    
    // Determine effective program family for calculation logic
    let family = 'Young Learner';
    if (manualOverride && overrideProgramFamily !== 'Auto') {
      family = overrideProgramFamily;
    } else {
      const { age } = computeAgeInfo();
      family = age >= 18 ? 'Adult' : 'Young Learner';
    }

    if (family === 'Adult') {
      programToPass = 'Adult';
    } else {
      programToPass = selectedSeason;
    }

    const input: CalculationInput = {
      dob,
      selectedProgram: programToPass,
      registrationType: 'New',
      existingLevel: existingLevel || undefined,
      numberOfTerms: terms,
      siblingCount,
      isYoungestSibling,
      isManualOverride: manualOverride,
      overrideProgramFamily: overrideProgramFamily,
    };
    
    const calcResult = evaluateStudent(input);
    setResult(calcResult);
  };

  const handleReset = () => {
    setDob('');
    setManualOverride(false);
    setOverrideProgramFamily('Auto');
    setSelectedSeason('Winter Block');
    setExistingLevel('');
    setTerms(1);
    setSiblingCount(1);
    setIsYoungestSibling(false);
    setResult(null);
  };

  // Keyboard shortcuts: Enter = calculate / reset, Esc = reset
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (result) {
          handleReset();
        } else {
          handleCalculate();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleReset();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [result, dob, manualOverride, overrideProgramFamily, selectedSeason, existingLevel, terms, siblingCount, isYoungestSibling]);

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-2">
        <h1 className="text-2xl font-bold">{t.calcTitle || 'Sales Assistant'}</h1>
        <button onClick={handleReset} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">↺ {t.resetBtn || 'Reset'}</button>
      </div>

      {/* DOB */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="dob-input">{t.dobLabel || 'Date of Birth'} *</label>
        <input id="dob-input" type="date" value={dob} onChange={e => setDob(e.target.value)} className="border rounded w-full px-3 py-2" />
      </div>

      {/* Manual Override */}
      <div className="flex items-center space-x-2">
        <input type="checkbox" id="override-toggle" checked={manualOverride} onChange={e => setManualOverride(e.target.checked)} />
        <label htmlFor="override-toggle">{t.manualOverrideTitle || 'Manual Override'}</label>
        {manualOverride && (
          <div className="flex space-x-2 items-center ml-4">
            <select value={overrideProgramFamily} onChange={e => setOverrideProgramFamily(e.target.value as ProgramFamily)} className="border rounded px-2 py-1">
              <option value="Auto">Auto Detect</option>
              <option value="Adult">Adult</option>
              <option value="Young Learner">Young Learner</option>
            </select>
          </div>
        )}
      </div>

      {/* Program / Season Selector for Young Learners */}
      {(!manualOverride || overrideProgramFamily === 'Young Learner' || overrideProgramFamily === 'Auto') && (
        <div>
          <label className="block text-sm font-medium mb-1">{t.programSeasonLabel || 'Program / Season'}</label>
          <select value={selectedSeason} onChange={e => setSelectedSeason(e.target.value as any)} className="border rounded w-full px-3 py-2">
            <option value="Winter Block">{t.programWinter || 'Winter Block (YL Terms 1–4)'}</option>
            <option value="Summer School">{t.programSummer || 'Summer School (YL Camps 1–3)'}</option>
          </select>
        </div>
      )}

      {/* Existing Level */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="level-input">{t.existingLevelLabel || 'Existing Level'} ({t.optional || 'Optional'})</label>
        <input id="level-input" type="text" value={existingLevel} onChange={e => setExistingLevel(e.target.value)} placeholder={t.noLevelPlaceholder || 'e.g. LP Primary Plus 2'} className="border rounded w-full px-3 py-2" />
      </div>

      {/* Discount Simulator */}
      <DiscountSimulator
        terms={terms}
        setTerms={setTerms}
        siblingCount={siblingCount}
        setSiblingCount={setSiblingCount}
        isYoungestSibling={isYoungestSibling}
        setIsYoungestSibling={setIsYoungestSibling}
      />

      {/* Result */}
      {result && <ResultCard result={result} />}
    </div>
  );
};
