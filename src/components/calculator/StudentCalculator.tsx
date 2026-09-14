import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  CalculationInput,
  CalculationResult,
  ProgramFamily,
  ProgramType,
  RegistrationType,
} from '../../data/types';
import {
  evaluateStudent,
  getAcademicLevelsForAge,
} from '../../engine/courseEngine';
import { calculateAge } from '../../engine/ageCalculator';
import { ADULT_COURSES } from '../../data/adultCourses';
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
} from 'lucide-react';
import { FamilyResultCard } from './FamilyResultCard';
import { useToast } from '../ui/ToastContext';

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
  const [isYoungestSibling, setIsYoungestSibling] = useState(false);
  const [registrationType, setRegistrationType] = useState<RegistrationType>('New');

  // Collapsible Sections
  const [showDiscountSim, setShowDiscountSim] = useState(false);
  const [showManualOverride, setShowManualOverride] = useState(false);

  // Multi-Child Family Calculator State
  const [isMultiChildMode, setIsMultiChildMode] = useState(false);
  const [child2Dob, setChild2Dob] = useState('');
  const [child2ResetTrigger, setChild2ResetTrigger] = useState(0);

  // Refs for keyboard navigation and scrolling
  const levelSelectRef = useRef<HTMLSelectElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleCalculate = () => {
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 40);
  };

  const { showToast } = useToast();

  // Calculate age info when DOB is filled
  const ageInfo = useMemo(() => {
    if (!dob) return null;
    const { years, months, days } = calculateAge(dob);
    return { years, months, days };
  }, [dob]);

  // Child 2 age info
  const ageInfo2 = useMemo(() => {
    if (!child2Dob) return null;
    const { years, months, days } = calculateAge(child2Dob);
    return { years, months, days };
  }, [child2Dob]);

  // Determine who is younger between Child 1 and Child 2
  const isChild2Younger = useMemo(() => {
    if (!ageInfo || !ageInfo2) return false;
    if (ageInfo2.years < ageInfo.years) return true;
    if (ageInfo2.years === ageInfo.years && ageInfo2.months < ageInfo.months) return true;
    return false;
  }, [ageInfo, ageInfo2]);

  const isChild1Younger = useMemo(() => {
    if (!ageInfo || !ageInfo2) return false;
    return !isChild2Younger;
  }, [ageInfo, ageInfo2, isChild2Younger]);

  const effectiveIsYoungest = isMultiChildMode ? isChild1Younger : isYoungestSibling;
  const effectiveSiblingCount = isMultiChildMode ? 2 : siblingCount;

  // Determine effective program family
  const isAdultAuto = ageInfo ? ageInfo.years >= 18 : false;
  const isManualOverrideActive = manualOverrideFamily !== 'Auto';
  const effectiveFamily: 'Adult' | 'Young Learner' = isManualOverrideActive
    ? (manualOverrideFamily as 'Adult' | 'Young Learner')
    : isAdultAuto
    ? 'Adult'
    : 'Young Learner';

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

  // Automatic live calculation result
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
      registrationType,
      existingLevel: existingLevel || undefined,
      numberOfTerms: terms,
      siblingCount: effectiveSiblingCount,
      isYoungestSibling: effectiveIsYoungest,
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
    effectiveSiblingCount,
    effectiveIsYoungest,
    isManualOverrideActive,
    manualOverrideFamily,
  ]);

  // Child 2 evaluation
  const result2: CalculationResult | null = useMemo(() => {
    if (!isMultiChildMode || !child2Dob || !ageInfo2) return null;

    const input: CalculationInput = {
      dob: child2Dob,
      selectedProgram: 'Winter Block',
      registrationType,
      numberOfTerms: terms,
      siblingCount: 2,
      isYoungestSibling: isChild2Younger,
    };

    return evaluateStudent(input);
  }, [isMultiChildMode, child2Dob, ageInfo2, registrationType, terms, isChild2Younger]);

  // Sync current price for Installments page
  useEffect(() => {
    const finalPrice = isMultiChildMode && result && result2
      ? (result.finalPrice || 0) + (result2.finalPrice || 0)
      : result?.finalPrice;
    if (finalPrice) {
      localStorage.setItem('bce_last_price', String(finalPrice));
    }
  }, [isMultiChildMode, result, result2]);

  // Global Hotkeys: Alt+N (Reset), Alt+C (Copy AR), Alt+E (Copy EN), Alt+S (Copy CRM)
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
    setChild2Dob('');
    setManualOverrideFamily('Auto');
    setSelectedSeason('Winter Block');
    setSelectedAdultProduct('bce');
    setSelectedPackageCredits(20);
    setExistingLevel('');
    setTerms(1);
    setSiblingCount(1);
    setIsYoungestSibling(false);
    setRegistrationType('New');
    setResetTrigger((prev) => prev + 1);
    setChild2ResetTrigger((prev) => prev + 1);
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

              {/* Quick Registration & Sibling Toggles */}
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

                {/* Quick Sibling Toggle if Young Learner */}
                {effectiveFamily === 'Young Learner' && (
                  <label className="flex items-center space-x-1.5 rtl:space-x-reverse cursor-pointer text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors">
                    <input
                      type="checkbox"
                      checked={siblingCount > 1 && isYoungestSibling}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSiblingCount(2);
                          setIsYoungestSibling(true);
                        } else {
                          setIsYoungestSibling(false);
                        }
                      }}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                    />
                    <span>{isAr ? '👶 هذا هو الطفل الأصغر (خصم 10%)' : '👶 Youngest Sibling (10% Off)'}</span>
                  </label>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Multi-Child Family Mode (Child 1 & Child 2 Side-by-Side) */
        <div className="space-y-3">
          {/* Child 1 Input Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-black text-slate-900 flex items-center space-x-1.5 rtl:space-x-reverse">
                <span className="w-5 h-5 rounded-md bg-bc-teal-100 text-[#062A67] flex items-center justify-center font-bold text-xs">1</span>
                <span>{isAr ? 'تاريخ ميلاد الطفل الأول' : 'Child 1 Date of Birth'}</span>
              </span>
              {ageInfo && isChild1Younger && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                  👶 {isAr ? 'الأخ الأصغر (مستحق خصم 10%)' : 'Younger Sibling (10% Off)'}
                </span>
              )}
            </div>
            <DateOfBirthInput
              value={dob}
              onChange={setDob}
              onEnterNext={handleDobEnterNext}
              onCalculate={handleCalculate}
              resetTrigger={resetTrigger}
            />
            {ageInfo && (
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-xl">
                <span><strong>{isAr ? 'العمر:' : 'Age:'}</strong> {ageInfo.years} {isAr ? 'سنة' : 'years'}</span>
                <span>•</span>
                <span><strong>{isAr ? 'المرحلة:' : 'Stage:'}</strong> {ageGroupDisplay}</span>
              </div>
            )}
          </div>

          {/* Child 2 Input Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-black text-slate-900 flex items-center space-x-1.5 rtl:space-x-reverse">
                <span className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-900 flex items-center justify-center font-bold text-xs">2</span>
                <span>{isAr ? 'تاريخ ميلاد الطفل الثاني (الأخ / الأخت)' : 'Child 2 Date of Birth (Sibling)'}</span>
              </span>
              {ageInfo2 && isChild2Younger && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                  👶 {isAr ? 'الأخ الأصغر (مستحق خصم 10%)' : 'Younger Sibling (10% Off)'}
                </span>
              )}
            </div>
            <DateOfBirthInput
              value={child2Dob}
              onChange={setChild2Dob}
              onCalculate={handleCalculate}
              resetTrigger={child2ResetTrigger}
            />
            {ageInfo2 && (
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-xl">
                <span><strong>{isAr ? 'العمر:' : 'Age:'}</strong> {ageInfo2.years} {isAr ? 'سنة' : 'years'}</span>
                <span>•</span>
                <span><strong>{isAr ? 'المرحلة:' : 'Stage:'}</strong> {result2?.ageGroup.value}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. RESULT CARD (Single or Multi-Child Family Card) */}
      {isMultiChildMode && result && result2 ? (
        <div ref={resultRef} id="result-section">
          <FamilyResultCard
            result1={result}
            result2={result2}
            selectedTerms={terms}
            onSelectTerms={setTerms}
            youngerIndex={isChild2Younger ? 2 : 1}
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
            isYoungestSibling={isYoungestSibling}
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
              {(terms > 1 || siblingCount > 1 || registrationType === 'Re-registration') && (
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
                isYoungestSibling={isYoungestSibling}
                setIsYoungestSibling={setIsYoungestSibling}
                registrationType={registrationType}
                setRegistrationType={setRegistrationType}
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
