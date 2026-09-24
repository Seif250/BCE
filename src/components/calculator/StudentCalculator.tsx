import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  CalculationInput,
  CalculationResult,
  ProgramFamily,
  ProgramType,
  RegistrationType,
  VarioTiming,
} from '../../data/types';
import {
  evaluateStudent,
  getAcademicLevelsForAge,
} from '../../engine/courseEngine';
import { calculateAge } from '../../engine/ageCalculator';
import { ADULT_COURSES } from '../../data/adultCourses';
import { WINTER_PRICING } from '../../data/winterCourses';
import { ResultCard } from './ResultCard';
import { DiscountSimulator } from './DiscountSimulator';
import { DateOfBirthInput } from './DateOfBirthInput';
import { SingleStudentEligibilityStrip } from './SingleStudentEligibilityStrip';
import { AdultProgramControls } from './AdultProgramControls';
import { MultiChildFamilySection, FamilyChildItem } from './MultiChildFamilySection';
import {
  RotateCcw,
  Sparkles,
  Sliders,
  ChevronDown,
  ChevronUp,
  Users,
} from 'lucide-react';
import { FamilyResultCard, CalculatedSiblingInfo } from './FamilyResultCard';
import { useToast } from '../ui/ToastContext';

export type FamilyChildState = FamilyChildItem;

export const StudentCalculator: React.FC = () => {
  const { t, language, isRTL } = useLanguage();
  const isAr = language === 'ar';

  // Core Inputs
  const [dob, setDob] = useState('');
  const [resetTrigger, setResetTrigger] = useState(0);

  // Manual Override
  const [manualOverrideFamily, setManualOverrideFamily] = useState<ProgramFamily>('Auto');

  // Young Learner Season
  const [selectedSeason, setSelectedSeason] = useState<'Winter Block' | 'Summer School'>('Winter Block');

  // Adult Course Product & Package
  const [selectedAdultProduct, setSelectedAdultProduct] = useState<'beginner' | 'bce' | 'ielts-coach' | 'english-online'>('bce');
  const [selectedPackageCredits, setSelectedPackageCredits] = useState<number>(20);

  // Academic Level
  const [existingLevel, setExistingLevel] = useState('');

  // Discount Simulator Values
  const [terms, setTerms] = useState(1);
  const [siblingCount, setSiblingCount] = useState(1);
  const [registrationType, setRegistrationType] = useState<RegistrationType>('New');
  const [varioTiming, setVarioTiming] = useState<VarioTiming>('none');

  // Collapsible Sections
  const [showDiscountSim, setShowDiscountSim] = useState(false);

  // Multi-Child Family Calculator State (Dynamic 2 to 5 Children)
  const [isMultiChildMode, setIsMultiChildMode] = useState(false);
  const [familyChildren, setFamilyChildren] = useState<FamilyChildState[]>([
    { id: 'child-1', name: isAr ? 'الطفل 1' : 'Child 1', dob: '', termsCount: 2, resetTrigger: 0 },
    { id: 'child-2', name: isAr ? 'الطفل 2' : 'Child 2', dob: '', termsCount: 2, resetTrigger: 0 },
  ]);

  const handleAddChild = () => {
    if (familyChildren.length >= 5) {
      showToast(isAr ? 'الحد الأقصى هو 5 أطفال' : 'Maximum is 5 children');
      return;
    }
    const nextNum = familyChildren.length + 1;
    setFamilyChildren((prev) => [
      ...prev,
      {
        id: `child-${Date.now()}`,
        name: isAr ? `الطفل ${nextNum}` : `Child ${nextNum}`,
        dob: '',
        termsCount: 2,
        resetTrigger: 0,
      },
    ]);
    showToast(isAr ? `تمت إضافة طفل آخر (${nextNum})` : `Added Child ${nextNum}`);
  };

  const handleRemoveChild = (id: string) => {
    if (familyChildren.length <= 2) {
      showToast(isAr ? 'يجب أن يكون هناك طفلان على الأقل لحساب الإخوة' : 'At least 2 children required');
      return;
    }
    setFamilyChildren((prev) => prev.filter((c) => c.id !== id));
  };

  const handleUpdateChildDob = (id: string, newDob: string) => {
    setFamilyChildren((prev) =>
      prev.map((c) => (c.id === id ? { ...c, dob: newDob } : c))
    );
  };

  const handleUpdateChildTerms = (id: string, termsCount: number) => {
    setFamilyChildren((prev) =>
      prev.map((c) => (c.id === id ? { ...c, termsCount } : c))
    );
  };

  // Refs for keyboard navigation and scrolling
  const levelSelectRef = useRef<HTMLSelectElement>(null);
  const eligibilityRef = useRef<HTMLDivElement>(null);

  const handleCalculate = () => {
    setTimeout(() => {
      eligibilityRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 40);
  };

  const { showToast } = useToast();

  // Calculate age info when DOB is filled (Single student mode)
  const ageInfo = useMemo(() => {
    if (!dob) return null;
    const { years, months, days } = calculateAge(dob);
    return { years, months, days };
  }, [dob]);

  // Determine effective program family
  const isAdultAuto = ageInfo ? ageInfo.years >= 18 : false;
  const isManualOverrideActive = manualOverrideFamily !== 'Auto';
  const effectiveFamily: 'Adult' | 'Young Learner' = isManualOverrideActive
    ? (manualOverrideFamily as 'Adult' | 'Young Learner')
    : isAdultAuto
    ? 'Adult'
    : 'Young Learner';

  // State Invalidation when effectiveFamily changes (Section AF)
  const prevFamilyRef = useRef<string>(effectiveFamily);
  useEffect(() => {
    if (prevFamilyRef.current !== effectiveFamily) {
      prevFamilyRef.current = effectiveFamily;
      setExistingLevel('');
      setTerms(1);
      setSiblingCount(1);
      setVarioTiming('none');
      if (effectiveFamily === 'Young Learner') {
        setRegistrationType('New');
      }
    }
  }, [effectiveFamily]);

  // State Invalidation when season changes
  const prevSeasonRef = useRef<string>(selectedSeason);
  useEffect(() => {
    if (prevSeasonRef.current !== selectedSeason) {
      prevSeasonRef.current = selectedSeason;
      setExistingLevel('');
      setVarioTiming('none');
    }
  }, [selectedSeason]);

  // State Invalidation when adult product changes
  const prevProductRef = useRef<string>(selectedAdultProduct);
  useEffect(() => {
    if (prevProductRef.current !== selectedAdultProduct) {
      prevProductRef.current = selectedAdultProduct;
      setExistingLevel('');
    }
  }, [selectedAdultProduct]);

  // Get age group title
  const ageGroupDisplay = useMemo(() => {
    if (!ageInfo) return '';
    const y = ageInfo.years;
    if (y < 4) return isAr ? 'أقل من 4 سنوات (خارج النطاق)' : 'Under 4y (Outside Range)';
    if (y === 4) return isAr ? 'مرحلة مبكرة 2 (Early Years 2)' : 'Early Years 2 (4y)';
    if (y === 5) return isAr ? 'مرحلة مبكرة 3 (Early Years 3)' : 'Early Years 3 (5y)';
    if (y >= 6 && y <= 8) return isAr ? 'ابتدائي أدنى (Lower Primary 6–8)' : 'Lower Primary (6–8y)';
    if (y >= 9 && y <= 11) return isAr ? 'ابتدائي أعلى (Upper Primary 9–11)' : 'Upper Primary (9–11y)';
    if (y >= 12 && y <= 14) return isAr ? 'إعدادي (Lower Secondary 12–14)' : 'Lower Secondary (12–14y)';
    if (y >= 15 && y <= 17) return isAr ? 'ثانوي (Upper Secondary 15–17)' : 'Upper Secondary (15–17y)';
    return isAr ? 'بالغ (Adults 18+)' : 'Adult (18+)';
  }, [ageInfo, isAr]);

  // Available academic levels for this age
  const availableLevels = useMemo(() => {
    if (!ageInfo) return [];
    if (effectiveFamily === 'Adult') {
      const prod = ADULT_COURSES.find((p) => p.id === selectedAdultProduct) || ADULT_COURSES[1];
      return prod.levels.map((lvl) => ({ id: lvl, name: lvl }));
    }
    return getAcademicLevelsForAge(ageInfo.years);
  }, [ageInfo, effectiveFamily, selectedAdultProduct]);

  // Single student evaluation
  const result: CalculationResult | null = useMemo(() => {
    if (!dob || !ageInfo) return null;

    let programToPass: ProgramType = 'Winter Block';
    if (effectiveFamily === 'Adult') {
      programToPass = 'Adult';
    } else {
      programToPass = selectedSeason;
    }

    const input: CalculationInput = {
      dob,
      selectedProgram: programToPass,
      selectedAdultProduct,
      selectedPackageCredits,
      registrationType: effectiveFamily === 'Adult' ? registrationType : 'New',
      existingLevel: existingLevel || undefined,
      numberOfTerms: terms,
      siblingCount,
      isYoungestSibling: false,
      varioTiming: effectiveFamily === 'Young Learner' && selectedSeason === 'Winter Block' ? varioTiming : 'none',
      isManualOverride: isManualOverrideActive,
      overrideProgramFamily: manualOverrideFamily,
    };

    return evaluateStudent(input);
  }, [
    dob,
    ageInfo,
    effectiveFamily,
    selectedSeason,
    selectedAdultProduct,
    selectedPackageCredits,
    registrationType,
    existingLevel,
    terms,
    siblingCount,
    varioTiming,
    isManualOverrideActive,
    manualOverrideFamily,
  ]);

  // Dynamic Family evaluation (Shared terms rule strictly applied)
  const calculatedFamilyChildren: CalculatedSiblingInfo[] = useMemo(() => {
    if (!isMultiChildMode) return [];

    const validChildren = familyChildren
      .map((c) => {
        if (!c.dob) return null;
        const { years, months, days } = calculateAge(c.dob);
        const totalMonths = years * 12 + months;
        return {
          ...c,
          ageYears: years,
          ageMonths: months,
          totalMonths,
        };
      })
      .filter((c): c is NonNullable<typeof c> => c !== null);

    if (validChildren.length < 2) return [];

    // Sort descending by age: oldest child first
    const sorted = [...validChildren].sort((a, b) => b.totalMonths - a.totalMonths);

    return sorted.map((child, index) => {
      const isEldest = index === 0;
      const isEarlyYears = child.ageYears < 6;
      const baseTermFee = isEarlyYears
        ? WINTER_PRICING.earlyYearsTermFee
        : WINTER_PRICING.primaryAndSecondaryTermFee;
      const rawBaseTotal = baseTermFee * child.termsCount;

      const bundleConf = WINTER_PRICING.bundleDiscounts.find((b) => b.terms === child.termsCount);
      const bundleDiscountPercent = bundleConf ? bundleConf.discountPercent : 0;
      const bundleRate = bundleDiscountPercent / 100;
      const bundleDiscountAmount = Math.round(rawBaseTotal * bundleRate);

      let sharedTermsWithOlder = 0;
      let nonSharedTerms = child.termsCount;
      let siblingDiscountAmount = 0;

      if (!isEldest) {
        // Overlapping terms with older siblings:
        const olderTerms = Math.max(...sorted.slice(0, index).map((o) => o.termsCount));
        sharedTermsWithOlder = Math.min(child.termsCount, olderTerms);
        nonSharedTerms = child.termsCount - sharedTermsWithOlder;
        const siblingRate = WINTER_PRICING.siblingDiscountPercent / 100;
        siblingDiscountAmount = Math.round(baseTermFee * sharedTermsWithOlder * siblingRate);
      }

      const totalDiscountAmount = bundleDiscountAmount + siblingDiscountAmount;
      const finalChildPrice = rawBaseTotal - totalDiscountAmount;

      const y = child.ageYears;
      let ageGroupDisplay = '';
      if (y === 4) ageGroupDisplay = isAr ? 'مرحلة مبكرة 2 (4 سنين)' : 'Early Years 2 (4y)';
      else if (y === 5) ageGroupDisplay = isAr ? 'مرحلة مبكرة 3 (5 سنين)' : 'Early Years 3 (5y)';
      else if (y >= 6 && y <= 8) ageGroupDisplay = isAr ? 'ابتدائي أدنى (6–8)' : 'Lower Primary (6–8y)';
      else if (y >= 9 && y <= 11) ageGroupDisplay = isAr ? 'ابتدائي أعلى (9–11)' : 'Upper Primary (9–11y)';
      else if (y >= 12 && y <= 14) ageGroupDisplay = isAr ? 'إعدادي (12–14)' : 'Lower Secondary (12–14y)';
      else if (y >= 15 && y <= 17) ageGroupDisplay = isAr ? 'ثانوي (15–17)' : 'Upper Secondary (15–17y)';
      else ageGroupDisplay = isAr ? 'بالغ (18+)' : 'Adult (18+)';

      return {
        id: child.id,
        name: child.name,
        dob: child.dob,
        ageYears: child.ageYears,
        ageMonths: child.ageMonths,
        ageGroupDisplay,
        category: isEarlyYears ? 'Early Years' : 'Young Learner',
        baseTermFee,
        termsCount: child.termsCount,
        isEldest,
        sharedTermsWithOlder,
        nonSharedTerms,
        bundleDiscountPercent,
        bundleDiscountAmount,
        siblingDiscountAmount,
        totalDiscountAmount,
        rawBaseTotal,
        finalChildPrice,
        placementTestFee: WINTER_PRICING.placementTestFee,
        placementTestRequired: !isEarlyYears,
        level: child.level || (isEarlyYears ? (y === 4 ? 'Ducks' : 'Owls') : 'Level Assigned on Call'),
      };
    });
  }, [familyChildren, isMultiChildMode, isAr]);


  // Sync current price for Installments page
  useEffect(() => {
    let finalPrice: number | undefined;
    if (isMultiChildMode && calculatedFamilyChildren.length >= 2) {
      finalPrice = calculatedFamilyChildren.reduce((acc, c) => acc + c.finalChildPrice, 0);
    } else {
      finalPrice = result?.finalPrice ?? undefined;
    }
    if (finalPrice) {
      localStorage.setItem('bce_last_price', String(finalPrice));
    }
  }, [isMultiChildMode, calculatedFamilyChildren, result]);

  // Global Hotkeys: Alt+N (Reset)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'n' || e.key === 'N' || e.key === 'ى')) {
        e.preventDefault();
        handleReset();
        showToast(isAr ? 'تم بدء طالب جديد (Alt+N)' : 'Started new student (Alt+N)');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAr, showToast]);

  // Handle Reset / New Student
  const handleReset = () => {
    setDob('');
    setFamilyChildren([
      { id: 'child-1', name: isAr ? 'الطفل 1' : 'Child 1', dob: '', termsCount: 2, resetTrigger: Date.now() },
      { id: 'child-2', name: isAr ? 'الطفل 2' : 'Child 2', dob: '', termsCount: 2, resetTrigger: Date.now() },
    ]);
    setManualOverrideFamily('Auto');
    setSelectedSeason('Winter Block');
    setSelectedAdultProduct('bce');
    setSelectedPackageCredits(20);
    setExistingLevel('');
    setTerms(1);
    setSiblingCount(1);
    setVarioTiming('none');
    setRegistrationType('New');
    setResetTrigger((prev) => prev + 1);
  };


  // Keyboard Enter flow: Advance from DOB input to Level select
  const handleDobEnterNext = () => {
    levelSelectRef.current?.focus();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 font-sans text-slate-900">
      {/* 1. COMPACT HEADER BAR */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t.calcTitle || 'Student Calculator'}
            </h1>
            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-bc-teal-50 text-bc-teal-800 border border-bc-teal-200">
              <Sparkles className="w-3 h-3 text-bc-teal-600 mr-1 rtl:ml-1 rtl:mr-0" />
              {isAr ? 'حساب فوري مباشر' : 'Live Calculation'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.calcSubtitle || 'Quickly determine eligibility, level, prices, and discounts.'}
          </p>
        </div>

        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {/* Multi-Child Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMultiChildMode(!isMultiChildMode)}
            className={`flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-2 rounded-xl text-xs font-black transition-all border ${
              isMultiChildMode
                ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-2xs ring-1 ring-amber-400'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
            title={isAr ? 'التبديل لحساب إخوة متعددين' : 'Toggle Multi-Child Mode'}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{isMultiChildMode ? (isAr ? 'وضع الإخوة (نشط)' : 'Multi-Child (Active)') : (isAr ? '+ حساب إخوة' : '+ Sibling')}</span>
          </button>

          {/* New Student / Reset Button */}
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center space-x-1.5 rtl:space-x-reverse px-3.5 py-2 rounded-xl text-xs font-black bg-slate-100 hover:bg-bc-teal-500 hover:text-bc-navy-950 text-slate-700 transition-all shadow-2xs border border-slate-200 hover:border-bc-teal-400 group flex-shrink-0"
            title={isAr ? 'إعادة تعيين وبدء حساب طالب جديد (Alt+N)' : 'Reset & Start New Student (Alt+N)'}
          >
            <RotateCcw className="w-3.5 h-3.5 group-hover:-rotate-90 transition-transform text-slate-500 group-hover:text-bc-navy-950" />
            <span>{t.resetBtn || 'New Student'}</span>
          </button>
        </div>
      </div>

      {/* 2. DATE OF BIRTH INPUT CARDS */}
      {!isMultiChildMode ? (
        /* Single Student Mode */
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-4 space-y-3">
          <DateOfBirthInput
            value={dob}
            onChange={setDob}
            onEnterNext={handleDobEnterNext}
            onCalculate={handleCalculate}
            resetTrigger={resetTrigger}
          />

          {/* DYNAMIC ELIGIBILITY STRIP & CONTROLS */}
          {ageInfo && (
            <div ref={eligibilityRef} className="space-y-3">
              <SingleStudentEligibilityStrip
                ageInfo={ageInfo}
                effectiveFamily={effectiveFamily}
                ageGroupDisplay={ageGroupDisplay}
                selectedSeason={selectedSeason}
                isManualOverrideActive={isManualOverrideActive}
                manualOverrideFamily={manualOverrideFamily}
                onClearManualOverride={() => setManualOverrideFamily('Auto')}
                isAr={isAr}
                yearsOldLabel={t.yearsOld}
              />

              <AdultProgramControls
                effectiveFamily={effectiveFamily}
                selectedAdultProduct={selectedAdultProduct}
                onSelectAdultProduct={setSelectedAdultProduct}
                existingLevel={existingLevel}
                onSelectExistingLevel={setExistingLevel}
                availableLevels={availableLevels}
                levelSelectRef={levelSelectRef}
                registrationType={registrationType}
                onSelectRegistrationType={setRegistrationType}
                isAr={isAr}
                existingLevelLabel={t.existingLevelLabel}
                optionalLabel={t.optional}
                noLevelPlaceholder={t.noLevelPlaceholder}
              />
            </div>
          )}
        </div>
      ) : (
        /* Dynamic Multi-Child Family Mode (Up to 5 Children) */
        <MultiChildFamilySection
          familyChildren={familyChildren}
          calculatedFamilyChildren={calculatedFamilyChildren}
          onAddChild={handleAddChild}
          onRemoveChild={handleRemoveChild}
          onUpdateChildDob={handleUpdateChildDob}
          onUpdateChildTerms={handleUpdateChildTerms}
          onCalculate={handleCalculate}
          isAr={isAr}
        />
      )}

      {/* 4. RESULT CARD (Single or Multi-Child Family Card) */}
      {isMultiChildMode && calculatedFamilyChildren.length >= 2 ? (
        <div id="result-section">
          <FamilyResultCard
            childrenData={calculatedFamilyChildren}
            onUpdateChildTerms={handleUpdateChildTerms}
          />
        </div>
      ) : result ? (
        <div id="result-section" className="animate-fade-in">
          <ResultCard
            result={result}
            selectedTerms={terms}
            onSelectTerms={setTerms}
            selectedPackageCredits={selectedPackageCredits}
            onSelectPackageCredits={setSelectedPackageCredits}
            siblingCount={siblingCount}
            isYoungestSibling={false}
            registrationType={registrationType}
          />
        </div>
      ) : null}

      {/* 5. COLLAPSIBLE SECONDARY TOOLS (Discount Simulator & Manual Override) */}
      <div className="space-y-2 pt-1">
        {/* Discount Simulator Collapsible */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={() => setShowDiscountSim(!showDiscountSim)}
            className="w-full p-3.5 flex items-center justify-between text-slate-800 font-bold hover:bg-slate-50 transition-colors text-xs sm:text-sm"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Sliders className="w-4 h-4 text-bc-teal-600" />
              <span>{isAr ? 'محاكي الخصومات والحزم (Discount Simulator)' : 'Discount & Bundle Simulator'}</span>
              {(terms > 1 || (effectiveFamily === 'Adult' && registrationType === 'Re-registration') || varioTiming !== 'none') && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                  {isAr ? 'خصومات مفعلة' : 'Discounts Active'}
                </span>
              )}
            </div>
            {showDiscountSim ? (
              <ChevronUp className="w-4 h-4 text-slate-500" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" aria-hidden="true" />
            )}
          </button>

          {showDiscountSim && (
            <div className="p-3.5 border-t border-slate-200 bg-slate-50/70">
              <DiscountSimulator
                terms={terms}
                setTerms={setTerms}
                siblingCount={siblingCount}
                setSiblingCount={setSiblingCount}
                registrationType={registrationType}
                setRegistrationType={setRegistrationType}
                isAdult={effectiveFamily === 'Adult'}
                varioTiming={varioTiming}
                setVarioTiming={setVarioTiming}
                selectedSeason={selectedSeason}
              />
            </div>
          )}
        </div>


      </div>
    </div>
  );
};
