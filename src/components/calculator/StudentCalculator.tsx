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
} from 'lucide-react';

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

  // Refs for keyboard navigation
  const levelSelectRef = useRef<HTMLSelectElement>(null);

  // Calculate age info when DOB is filled
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
      siblingCount,
      isYoungestSibling,
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
    isYoungestSibling,
    isManualOverrideActive,
    manualOverrideFamily,
  ]);

  // Handle Reset / New Student
  const handleReset = () => {
    setDob('');
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

        {/* New Student / Reset Button */}
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center space-x-1.5 rtl:space-x-reverse px-3.5 py-2 rounded-xl text-xs font-black bg-slate-100 hover:bg-bc-teal-500 hover:text-bc-navy-950 text-slate-700 transition-all shadow-2xs border border-slate-200 hover:border-bc-teal-400 group flex-shrink-0"
          title={isAr ? 'إعادة تعيين وبدء حساب طالب جديد' : 'Reset & Start New Student'}
        >
          <RotateCcw className="w-3.5 h-3.5 group-hover:-rotate-90 transition-transform text-slate-500 group-hover:text-bc-navy-950" />
          <span>[↻ {t.resetBtn || 'New Student'}]</span>
        </button>
      </div>

      {/* 2. DATE OF BIRTH INPUT CARD */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-3">
        <DateOfBirthInput
          value={dob}
          onChange={setDob}
          onEnterNext={handleDobEnterNext}
          resetTrigger={resetTrigger}
        />

        {/* 3. DYNAMIC ELIGIBILITY STRIP (Shown once DOB is valid) */}
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
              {/* If Young Learner: Season pills (Winter / Summer) */}
              {effectiveFamily === 'Young Learner' && (
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    {isAr ? 'الموسم الحالي' : 'Season Track'}
                  </label>
                  <div className="flex space-x-1.5 rtl:space-x-reverse">
                    <button
                      type="button"
                      onClick={() => setSelectedSeason('Winter Block')}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                        selectedSeason === 'Winter Block'
                          ? 'bg-bc-navy-900 text-white border-bc-navy-900 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      ❄️ {isAr ? 'البرنامج الشتوي (Winter Block)' : 'Winter Block'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedSeason('Summer School')}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                        selectedSeason === 'Summer School'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      ☀️ {isAr ? 'المدرسة الصيفية (Summer School)' : 'Summer School'}
                    </button>
                  </div>
                </div>
              )}

              {/* If Adult: Product dropdown */}
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

              {/* Current / Existing Level (Optional) */}
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
          </div>
        )}
      </div>

      {/* 4. RESULT CARD (Only shown when DOB is filled) */}
      {result && (
        <div className="animate-fade-in">
          <ResultCard
            result={result}
            selectedTerms={terms}
            onSelectTerms={setTerms}
            selectedPackageCredits={selectedPackageCredits}
            onSelectPackageCredits={setSelectedPackageCredits}
          />
        </div>
      )}

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
              <p className="text-[11px] text-slate-500 pt-1">
                {isAr
                  ? 'ملاحظة: السن والفئة العمرية يظلان محسوبين بدقة من تاريخ الميلاد، بينما يتم تحويل البرنامج فقط.'
                  : 'Note: Exact age and age group remain computed from Date of Birth.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
