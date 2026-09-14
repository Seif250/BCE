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
import {
  RotateCcw,
  Sparkles,
  Sliders,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Calendar,
  Layers,
  GraduationCap,
  Baby,

  Users,
  Plus,
  Trash2,
} from 'lucide-react';
import { FamilyResultCard, CalculatedSiblingInfo } from './FamilyResultCard';
import { useToast } from '../ui/ToastContext';

export interface FamilyChildState {
  id: string;
  name: string;
  dob: string;
  termsCount: number;
  level?: string;
  resetTrigger: number;
}

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
  const [showManualOverride, setShowManualOverride] = useState(false);

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
    showToast(isAr ? `✓ تمت إضافة طفل آخر (${nextNum})` : `✓ Added Child ${nextNum}`);
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
  const resultRef = useRef<HTMLDivElement>(null);

  const handleCalculate = () => {
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
        showToast(isAr ? '✓ تم بدء طالب جديد (Alt+N)' : '✓ Started new student (Alt+N)');
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
            <span>[↻ {t.resetBtn || 'New Student'}]</span>
          </button>
        </div>
      </div>

      {/* 2. DATE OF BIRTH INPUT CARDS */}
      {!isMultiChildMode ? (
        /* Single Student Mode */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-3">
          <DateOfBirthInput
            value={dob}
            onChange={setDob}
            onEnterNext={handleDobEnterNext}
            onCalculate={handleCalculate}
            resetTrigger={resetTrigger}
          />

          {/* DYNAMIC ELIGIBILITY STRIP (Shown once DOB is valid) */}
          {ageInfo && (
            <div className="pt-2 animate-fade-in space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* Age Card */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-8 h-8 rounded-lg bg-bc-teal-100 text-bc-teal-800 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {ageInfo.years}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      {isAr ? 'العمر المحسوب' : 'Calculated Age'}
                    </span>
                    <div className="text-sm font-black text-slate-900">
                      {ageInfo.years} {t.yearsOld || (isAr ? 'سنة' : 'Years')}
                    </div>
                  </div>
                </div>

                {/* Age Group Card */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center flex-shrink-0">
                    {effectiveFamily === 'Adult' ? (
                      <GraduationCap className="w-4 h-4" />
                    ) : (
                      <Baby className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      {isAr ? 'الفئة العمرية' : 'Age Group'}
                    </span>
                    <div className="text-xs font-black text-slate-900 truncate" title={ageGroupDisplay}>
                      {ageGroupDisplay}
                    </div>
                  </div>
                </div>

                {/* Inferred Program Card */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      {isAr ? 'البرنامج المستنتج' : 'Inferred Program'}
                    </span>
                    <div className="text-xs font-black text-slate-900 truncate">
                      {effectiveFamily === 'Adult'
                        ? (isAr ? 'Adult • كورسات الكبار' : 'Adult English')
                        : (isAr ? `Young Learner • ${selectedSeason}` : `Young Learner • ${selectedSeason}`)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Manual Override Active Badge */}
              {isManualOverrideActive && (
                <div className="p-2 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-between text-xs text-amber-900 font-bold">
                  <span className="flex items-center space-x-1.5 rtl:space-x-reverse">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>
                      {isAr
                        ? `تعديل يدوي نشط: تم تحويل البرنامج إلى (${manualOverrideFamily})`
                        : `Manual Override Active: Switched to (${manualOverrideFamily})`}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setManualOverrideFamily('Auto')}
                    className="text-[11px] underline hover:text-amber-950"
                  >
                    {isAr ? 'إلغاء التعديل اليدوي' : 'Reset to Auto'}
                  </button>
                </div>
              )}

              {/* DYNAMIC PROGRAM CONTROLS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {effectiveFamily === 'Adult' && (
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                      {isAr ? 'كورس الكبار (Product)' : 'Adult Product'}
                    </label>
                    <select
                      value={selectedAdultProduct}
                      onChange={(e) => setSelectedAdultProduct(e.target.value as any)}
                      className="w-full text-xs font-bold py-2 px-3 border border-slate-300 rounded-xl bg-white text-slate-900 outline-none focus:ring-2 focus:ring-bc-teal-400"
                    >
                      <option value="beginner">Beginner Courses (المبتدئين)</option>
                      <option value="bce">BCE - British Council English (العام)</option>
                      <option value="ielts-coach">IELTS Coach (تحضير آيلتس)</option>
                      <option value="english-online">English Online (أونلاين تفاعلي)</option>
                    </select>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="level-select"
                    className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1"
                  >
                    {t.existingLevelLabel || 'Current Level'} ({t.optional || 'Optional'})
                  </label>
                  <select
                    ref={levelSelectRef}
                    id="level-select"
                    value={existingLevel}
                    onChange={(e) => setExistingLevel(e.target.value)}
                    className="w-full text-xs py-2 px-3 border border-slate-300 rounded-xl bg-white text-slate-900 outline-none focus:ring-2 focus:ring-bc-teal-400 font-medium"
                  >
                    <option value="">
                      {t.noLevelPlaceholder || (isAr ? 'لم يتم تحديد المستوى — يمكن استخدام Placement Test' : 'No level specified — PT required')}
                    </option>
                    {availableLevels.map((lvl) => (
                      <option key={lvl.id} value={lvl.name}>
                        {lvl.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quick Registration Pills (Adults Only) */}
              {effectiveFamily === 'Adult' && (
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-100">
                  <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">
                      {isAr ? 'نوع التسجيل:' : 'Registration:'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setRegistrationType('New')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        registrationType === 'New'
                          ? 'bg-[#062A67] text-white border-[#062A67] shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isAr ? 'طالب جديد' : 'New'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegistrationType('Re-registration')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        registrationType === 'Re-registration'
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs ring-1 ring-emerald-500'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      🏷️ {isAr ? 'إعادة تسجيل (خصم 10%)' : 'Re-registration (10% Off)'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Dynamic Multi-Child Family Mode (Up to 5 Children) */
        <div className="space-y-3">
          {/* Multi-Child Header Bar */}
          <div className="bg-amber-50/80 border border-amber-200/90 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black flex-shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black text-amber-950 block">
                  {isAr ? 'حاسبة الإخوة المتعددين (Multi-Child Family)' : 'Multi-Child Family Calculator'}
                </span>
                <span className="text-[10px] text-amber-800 font-medium">
                  {isAr
                    ? 'يتم تطبيق خصم 10% للأصغر حصرياً على الترمات المشتركة مع إخوته الأكبر.'
                    : '10% sibling discount applies to younger children strictly on shared terms with older siblings.'}
                </span>
              </div>
            </div>

            {/* Add Another Child Button */}
            <button
              type="button"
              onClick={handleAddChild}
              disabled={familyChildren.length >= 5}
              className={`inline-flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-xl text-xs font-black border transition-all ${
                familyChildren.length >= 5
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-amber-400 hover:bg-amber-500 text-slate-950 border-amber-500 shadow-2xs'
              }`}
              title={familyChildren.length >= 5 ? (isAr ? 'الحد الأقصى 5 أطفال' : 'Max 5 children') : (isAr ? 'إضافة طفل آخر' : 'Add sibling')}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAr ? '+ طفل آخر' : '+ Add Sibling'}</span>
              <span className="text-[10px] opacity-75">({familyChildren.length}/5)</span>
            </button>
          </div>

          {/* Children Cards Grid */}
          <div className={`grid grid-cols-1 ${familyChildren.length === 2 ? 'md:grid-cols-2' : familyChildren.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'} gap-3`}>
            {familyChildren.map((child, index) => {
              const calcInfo = calculatedFamilyChildren.find((c) => c.id === child.id);
              return (
                <div key={child.id} className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                      <span className="w-5 h-5 rounded-md bg-[#062A67] text-white flex items-center justify-center font-bold text-xs">
                        {index + 1}
                      </span>
                      <span className="text-xs font-black text-slate-900">{child.name}</span>
                    </div>

                    <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                      {calcInfo && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            calcInfo.isEldest
                              ? 'bg-slate-200 text-slate-800'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}
                        >
                          {calcInfo.isEldest ? (isAr ? 'الأكبر' : 'Eldest') : (isAr ? 'خصم أخوة' : 'Sibling')}
                        </span>
                      )}
                      {familyChildren.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveChild(child.id)}
                          className="text-rose-500 hover:text-rose-700 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                          title={isAr ? 'حذف هذا الطفل' : 'Remove child'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <DateOfBirthInput
                    value={child.dob}
                    onChange={(val) => handleUpdateChildDob(child.id, val)}
                    onCalculate={handleCalculate}
                    resetTrigger={child.resetTrigger}
                  />

                  {/* Individual Terms Selector */}
                  <div className="pt-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      {isAr ? 'عدد الترمات:' : 'Terms:'}
                    </span>
                    <div className="grid grid-cols-4 gap-1">
                      {[1, 2, 3, 4].map((tNum) => (
                        <button
                          key={tNum}
                          type="button"
                          onClick={() => handleUpdateChildTerms(child.id, tNum)}
                          className={`py-1 text-xs font-black rounded-lg border transition-all ${
                            child.termsCount === tNum
                              ? 'bg-[#062A67] text-white border-[#062A67]'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {tNum} {isAr ? 'ترم' : 'T'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {calcInfo && (
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600 bg-slate-50 p-2 rounded-xl">
                      <span><strong>{isAr ? 'العمر:' : 'Age:'}</strong> {calcInfo.ageYears} {isAr ? 'سنة' : 'y'}</span>
                      <span>•</span>
                      <span className="truncate max-w-[130px]" title={calcInfo.ageGroupDisplay}>
                        <strong>{isAr ? 'المرحلة:' : 'Stage:'}</strong> {calcInfo.ageGroupDisplay}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. RESULT CARD (Single or Multi-Child Family Card) */}
      {isMultiChildMode && calculatedFamilyChildren.length >= 2 ? (
        <div ref={resultRef} id="result-section">
          <FamilyResultCard
            childrenData={calculatedFamilyChildren}
            onUpdateChildTerms={handleUpdateChildTerms}
          />
        </div>
      ) : result ? (
        <div ref={resultRef} id="result-section" className="animate-fade-in">
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
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={() => setShowDiscountSim(!showDiscountSim)}
            className="w-full p-3.5 flex items-center justify-between text-slate-800 font-bold hover:bg-slate-50 transition-colors text-xs sm:text-sm"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Sliders className="w-4 h-4 text-bc-teal-600" />
              <span>{isAr ? '▸ محاكي الخصومات والحزم (Discount Simulator)' : '▸ Discount & Bundle Simulator'}</span>
              {(terms > 1 || (effectiveFamily === 'Adult' && registrationType === 'Re-registration') || varioTiming !== 'none') && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                  {isAr ? 'خصومات مفعلة' : 'Discounts Active'}
                </span>
              )}
            </div>
            {showDiscountSim ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
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


        {/* Manual Override Collapsible */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={() => setShowManualOverride(!showManualOverride)}
            className="w-full p-3.5 flex items-center justify-between text-slate-800 font-bold hover:bg-slate-50 transition-colors text-xs sm:text-sm"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>{isAr ? '▸ لوحة التعديل اليدوي (Manual Override)' : '▸ Manual Override Controls'}</span>
              {isManualOverrideActive && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300">
                  {manualOverrideFamily}
                </span>
              )}
            </div>
            {showManualOverride ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {showManualOverride && (
            <div className="p-3.5 border-t border-slate-200 bg-slate-50/70 space-y-2">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                  {isAr ? 'تجاوز نوع البرنامج يدويًا:' : 'Override Program Family:'}
                </label>
                <div className="flex space-x-2 rtl:space-x-reverse">
                  {(['Auto', 'Adult', 'Young Learner'] as const).map((family) => (
                    <button
                      key={family}
                      type="button"
                      onClick={() => setManualOverrideFamily(family)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        manualOverrideFamily === family
                          ? 'bg-bc-navy-900 text-white border-bc-navy-900 shadow-2xs ring-1 ring-bc-navy-800'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {family === 'Auto'
                        ? (isAr ? 'تلقائي (Auto)' : 'Auto Detect')
                        : family === 'Adult'
                        ? (isAr ? 'بالغ (Adult)' : 'Adult')
                        : (isAr ? 'صغار السن (Young Learner)' : 'Young Learner')}
                    </button>
                  ))}
                </div>
              </div>

              {effectiveFamily === 'Young Learner' && (
                <div className="space-y-1.5 pt-2 border-t border-slate-200">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                    {isAr ? 'تغيير الموسم (لبرامج الصغار):' : 'Override Season (YL):'}
                  </label>
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <button
                      type="button"
                      onClick={() => setSelectedSeason('Winter Block')}
                      className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                        selectedSeason === 'Winter Block'
                          ? 'bg-bc-navy-900 text-white border-bc-navy-900 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      ❄️ {isAr ? 'الشتوي الأساسي (Winter Block)' : 'Winter Block (Default)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedSeason('Summer School')}
                      className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                        selectedSeason === 'Summer School'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      ☀️ {isAr ? 'المدرسة الصيفية (Summer School)' : 'Summer School'}
                    </button>
                  </div>
                </div>
              )}

              <p className="text-[11px] text-slate-500 pt-1">
                {isAr
                  ? 'ملاحظة: النظام يحدد البرنامج والموسم تلقائياً حسب السن (صغار السن + شتوي افتراضياً). استخدم هذه اللوحة فقط في الحالات الاستثنائية.'
                  : 'Note: System determines family and season automatically from age (defaulting to Winter Block for YL). Use this panel only for exceptions.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
