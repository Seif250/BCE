import React, { useState, useMemo } from 'react';
import {
  Calendar,
  RotateCcw,
  Sparkles,
  Sliders,
  AlertTriangle,
  Layers,
  Building2,
  Users,
  Sun,
  Snowflake,
  GraduationCap,
  CreditCard,
} from 'lucide-react';
import { CalculationInput, ProgramType, RegistrationType, AgeCategory } from '../../data/types';
import { evaluateStudent } from '../../engine/courseEngine';
import { ResultCard } from './ResultCard';
import { BRANCHES } from '../../data/branches';
import { WINTER_ACADEMIC_LEVELS } from '../../data/winterCourses';
import { ADULT_COURSES } from '../../data/adultCourses';
import { useLanguage } from '../../i18n/LanguageContext';

export const StudentCalculator: React.FC = () => {
  const { t, language, isRTL } = useLanguage();

  // Default DOB: 10 years old (Upper Primary)
  const defaultDob = '2016-03-15';

  const [dob, setDob] = useState<string>(defaultDob);
  const [selectedProgram, setSelectedProgram] = useState<'auto' | ProgramType>('auto');
  const [registrationType, setRegistrationType] = useState<RegistrationType>('New');
  const [existingLevel, setExistingLevel] = useState<string>('');
  const [preferredBranch, setPreferredBranch] = useState<string>('agu');

  // Winter options
  const [numberOfTerms, setNumberOfTerms] = useState<number>(1);
  const [siblingCount, setSiblingCount] = useState<number>(1);
  const [isYoungestSibling, setIsYoungestSibling] = useState<boolean>(false);

  // Summer options
  const [selectedCamps, setSelectedCamps] = useState<number[]>([1]);
  const [isStarterLevel, setIsStarterLevel] = useState<boolean>(false);

  // Adult options
  const [selectedAdultProduct, setSelectedAdultProduct] = useState<'beginner' | 'bce' | 'ielts-coach'>('bce');
  const [selectedPackageCredits, setSelectedPackageCredits] = useState<number>(20);

  // Manual Override
  const [isManualOverride, setIsManualOverride] = useState<boolean>(false);
  const [overrideAge, setOverrideAge] = useState<number>(10);
  const [overrideAgeCategory, setOverrideAgeCategory] = useState<AgeCategory>('Young Learner');
  const [overrideAcademicLevel, setOverrideAcademicLevel] = useState<string>('');

  // Quick Age preset helper (sets DOB so student has that age today)
  const handleQuickAgePreset = (targetAge: number) => {
    const today = new Date();
    const targetYear = today.getFullYear() - targetAge;
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    setDob(`${targetYear}-${month}-${day}`);
    setExistingLevel('');
  };

  // Reset to default
  const handleReset = () => {
    setDob(defaultDob);
    setSelectedProgram('auto');
    setRegistrationType('New');
    setExistingLevel('');
    setPreferredBranch('agu');
    setNumberOfTerms(1);
    setSiblingCount(1);
    setIsYoungestSibling(false);
    setSelectedCamps([1]);
    setIsStarterLevel(false);
    setSelectedAdultProduct('bce');
    setSelectedPackageCredits(20);
    setIsManualOverride(false);
  };

  // Camp toggle helper
  const handleToggleCamp = (campNum: number) => {
    if (selectedCamps.includes(campNum)) {
      if (selectedCamps.length > 1) {
        setSelectedCamps(selectedCamps.filter((c) => c !== campNum));
      }
    } else {
      setSelectedCamps([...selectedCamps, campNum].sort());
    }
  };

  // Memoized Calculation: Runs synchronously in 0 milliseconds!
  const calculationResult = useMemo(() => {
    const input: CalculationInput = {
      dob,
      selectedProgram,
      registrationType,
      existingLevel: existingLevel || undefined,
      preferredBranch: preferredBranch || undefined,
      numberOfTerms,
      siblingCount,
      isYoungestSibling,
      selectedCamps,
      isStarterLevel,
      selectedAdultProduct,
      selectedPackageCredits,
      isManualOverride,
      overrideAge: isManualOverride ? Number(overrideAge) : undefined,
      overrideAgeCategory: isManualOverride ? overrideAgeCategory : undefined,
      overrideAcademicLevel: isManualOverride ? overrideAcademicLevel : undefined,
    };

    return evaluateStudent(input);
  }, [
    dob,
    selectedProgram,
    registrationType,
    existingLevel,
    preferredBranch,
    numberOfTerms,
    siblingCount,
    isYoungestSibling,
    selectedCamps,
    isStarterLevel,
    selectedAdultProduct,
    selectedPackageCredits,
    isManualOverride,
    overrideAge,
    overrideAgeCategory,
    overrideAcademicLevel,
  ]);

  const quickPresets = [
    { label: language === 'ar' ? '🦆 ٤ سنين (Ducks)' : '🦆 4 (Ducks)', age: 4 },
    { label: language === 'ar' ? '🦉 ٥ سنين (Owls)' : '🦉 5 (Owls)', age: 5 },
    { label: language === 'ar' ? '🎒 ٧ سنين (ابتدائي أصغر)' : '🎒 7 (LP)', age: 7 },
    { label: language === 'ar' ? '📘 ١٠ سنين (ابتدائي أكبر)' : '📘 10 (UP)', age: 10 },
    { label: language === 'ar' ? '⚡ ١٣ سنة (إعدادي)' : '⚡ 13 (Sec)', age: 13 },
    { label: language === 'ar' ? '🎓 ١٦ سنة (ثانوي)' : '🎓 16 (US)', age: 16 },
    { label: language === 'ar' ? '💼 ٢٠+ (كبار)' : '💼 20+ (Adult)', age: 20 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-bc-navy-900 tracking-tight flex items-center space-x-2 rtl:space-x-reverse">
            <span>{t.calcTitle}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t.calcSubtitle}
          </p>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-3.5 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>{t.resetBtn}</span>
        </button>
      </div>

      {/* Executive KPI Stats Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-10 h-10 rounded-xl bg-bc-navy-50 text-bc-navy-800 flex items-center justify-center flex-shrink-0 border border-bc-navy-100">
            <Building2 className="w-5 h-5 text-bc-navy-800" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              {language === 'ar' ? 'الفروع المعتمدة' : 'Branches'}
            </span>
            <span className="text-sm font-black text-slate-900">
              {language === 'ar' ? '٦ فروع رئيسية بمصر' : '6 Centers in Egypt'}
            </span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0 border border-amber-200">
            <GraduationCap className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              {language === 'ar' ? 'تحديد المستوى (PT)' : 'Placement Test'}
            </span>
            <span className="text-sm font-black text-slate-900">
              {language === 'ar' ? '٢٠٠ ج.م (صالح ٦ شهور)' : '200 EGP (6 Mo. Valid)'}
            </span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 border border-emerald-200">
            <CreditCard className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              {language === 'ar' ? 'التقسيط البنكي' : 'Bank Installments'}
            </span>
            <span className="text-sm font-black text-slate-900">
              {language === 'ar' ? 'حتى ١٢ شهر بدون فوائد' : 'Up to 12 Months 0%'}
            </span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-10 h-10 rounded-xl bg-bc-teal-50 text-bc-teal-700 flex items-center justify-center flex-shrink-0 border border-bc-teal-200">
            <Sparkles className="w-5 h-5 text-bc-teal-600" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              {language === 'ar' ? 'دقة البيانات والسرعة' : 'Data Speed'}
            </span>
            <span className="text-sm font-black text-bc-teal-700">
              {language === 'ar' ? '٠ ثانية • معتمد ١٠٠٪' : '0 sec • 100% Policy'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Inputs (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5 rtl:space-x-reverse">
              <Calendar className="w-4 h-4 text-bc-teal-600" />
              <span>{t.studentParameters}</span>
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {t.liveCalcBadge}
            </span>
          </div>

          {/* Quick Age Presets (Extreme Speed for Call Center!) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              {t.quickPresetsLabel}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {quickPresets.map((preset) => (
                <button
                  key={preset.age}
                  type="button"
                  onClick={() => handleQuickAgePreset(preset.age)}
                  className="px-2.5 py-1.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-bc-navy-900 hover:text-white text-slate-700 border border-slate-200 shadow-2xs hover:shadow transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date of Birth Input */}
          <div>
            <label htmlFor="dob-input" className="block text-xs font-bold text-slate-700 mb-1">
              {t.dobLabel} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="dob-input"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bc-teal-500 focus:border-transparent text-sm font-medium text-slate-900 shadow-sm"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {t.dobHelp}
            </p>
          </div>

          {/* Program / Season Selector */}
          <div>
            <label htmlFor="program-select" className="block text-xs font-bold text-slate-700 mb-1">
              {t.programLabel}
            </label>
            <select
              id="program-select"
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value as 'auto' | ProgramType)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bc-teal-500 focus:border-transparent text-sm font-medium text-slate-900 shadow-sm bg-white"
            >
              <option value="auto">{t.programAuto}</option>
              <option value="Winter Block">{t.programWinter}</option>
              <option value="Summer School">{t.programSummer}</option>
              <option value="Adult">{t.programAdult}</option>
            </select>
          </div>

          {/* Registration Status & Branch */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="reg-select" className="block text-xs font-bold text-slate-700 mb-1">
                {t.regTypeLabel}
              </label>
              <select
                id="reg-select"
                value={registrationType}
                onChange={(e) => setRegistrationType(e.target.value as RegistrationType)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-900 bg-white"
              >
                <option value="New">{t.regNew}</option>
                <option value="Re-registration">{t.regReturning}</option>
              </select>
            </div>

            {/* Preferred Branch */}
            <div>
              <label htmlFor="branch-select" className="block text-xs font-bold text-slate-700 mb-1">
                {t.branchLabel}
              </label>
              <select
                id="branch-select"
                value={preferredBranch}
                onChange={(e) => setPreferredBranch(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-900 bg-white"
              >
                {BRANCHES.map((b) => (
                  <option key={b.id} value={b.id}>
                    {language === 'ar' && b.nameAr ? b.nameAr : b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Existing Level (Optional) */}
          <div>
            <label htmlFor="level-select" className="block text-xs font-bold text-slate-700 mb-1">
              {t.existingLevelLabel} <span className="text-slate-400 font-normal">({language === 'ar' ? 'اختياري' : 'Optional'})</span>
            </label>
            <select
              id="level-select"
              value={existingLevel}
              onChange={(e) => setExistingLevel(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-900 bg-white"
            >
              <option value="">{t.noLevelPlaceholder}</option>
              <optgroup label={language === 'ar' ? 'مستويات البرنامج الشتوي (Winter Levels)' : 'Winter Academic Levels'}>
                {WINTER_ACADEMIC_LEVELS.map((lvl) => (
                  <option key={lvl.id} value={lvl.name}>
                    {lvl.name} ({lvl.ageGroupName})
                  </option>
                ))}
              </optgroup>
              <optgroup label={language === 'ar' ? 'كورسات خاصة' : 'Special Courses'}>
                <option value="IELTS for Teens">IELTS for Teens (15–17 yrs)</option>
              </optgroup>
            </select>
          </div>

          {/* SEASON SPECIFIC CONTROLS */}

          {/* A. Winter Controls */}
          {calculationResult.program === 'Winter Block' && (
            <div className="p-3.5 rounded-lg bg-sky-50/70 border border-sky-200 space-y-3">
              <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-xs font-bold text-sky-900">
                <Snowflake className="w-4 h-4 text-sky-600" />
                <span>{t.winterTermsLabel}</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-sky-950 mb-1">
                  {t.termsCountLabel}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { term: 1, label: t.terms1, badge: null },
                    { term: 2, label: t.terms2, badge: '5% OFF' },
                    { term: 3, label: t.terms3, badge: '10% OFF' },
                    { term: 4, label: t.terms4, badge: '15% OFF' },
                  ].map(({ term, label, badge }) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setNumberOfTerms(term)}
                      className={`py-1.5 text-xs font-bold rounded border text-center transition-all ${
                        numberOfTerms === term
                          ? 'bg-bc-navy-800 text-white border-bc-navy-900 shadow-sm'
                          : 'bg-white text-slate-700 border-sky-300 hover:bg-sky-100'
                      }`}
                    >
                      {term} {term === 1 ? (language === 'ar' ? 'ترم' : 'Term') : (language === 'ar' ? 'ترمات' : 'Terms')}
                      {badge && <span className="block text-[10px] text-emerald-600">{badge}</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sibling discount toggle */}
              <div className="pt-2 border-t border-sky-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-medium text-sky-950">{t.siblingCountLabel}</label>
                  <select
                    value={siblingCount}
                    onChange={(e) => setSiblingCount(Number(e.target.value))}
                    className="px-2 py-1 rounded border border-sky-300 text-xs bg-white text-slate-800"
                  >
                    <option value={1}>{language === 'ar' ? 'طفل واحد' : '1 Child'}</option>
                    <option value={2}>{language === 'ar' ? 'طفلين' : '2 Children'}</option>
                    <option value={3}>{language === 'ar' ? '٣ أطفال أو أكثر' : '3+ Children'}</option>
                  </select>
                </div>

                {siblingCount > 1 && (
                  <label className="flex items-center space-x-2 rtl:space-x-reverse text-xs text-sky-950 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isYoungestSibling}
                      onChange={(e) => setIsYoungestSibling(e.target.checked)}
                      className="rounded text-bc-teal-600 focus:ring-bc-teal-500 w-4 h-4"
                    />
                    <span>{t.isYoungestLabel}</span>
                  </label>
                )}
              </div>
            </div>
          )}

          {/* B. Summer Controls */}
          {calculationResult.program === 'Summer School' && (
            <div className="p-3.5 rounded-lg bg-amber-50/80 border border-amber-200 space-y-3">
              <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-xs font-bold text-amber-900">
                <Sun className="w-4 h-4 text-amber-600" />
                <span>{t.summerCampsLabel}</span>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-amber-950">{language === 'ar' ? 'حدد المعسكرات:' : 'Select Camps:'}</label>
                <div className="space-y-1.5">
                  {[
                    { id: 1, label: t.camp1Label },
                    { id: 2, label: t.camp2Label },
                    { id: 3, label: t.camp3Label },
                  ].map((camp) => (
                    <label
                      key={camp.id}
                      className="flex items-center space-x-2 rtl:space-x-reverse text-xs text-amber-950 p-2 rounded bg-white border border-amber-200 cursor-pointer hover:bg-amber-100/50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCamps.includes(camp.id)}
                        onChange={() => handleToggleCamp(camp.id)}
                        className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                      />
                      <span className="font-semibold">{camp.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Starter status for 3 camps discount */}
              {selectedCamps.length === 3 && (
                <label className="flex items-center space-x-2 rtl:space-x-reverse text-xs text-amber-950 font-medium cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={isStarterLevel}
                    onChange={(e) => setIsStarterLevel(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                  />
                  <span>{t.starterLevelCheckbox}</span>
                </label>
              )}
            </div>
          )}

          {/* C. Adult Controls */}
          {calculationResult.program === 'Adult' && (
            <div className="p-3.5 rounded-lg bg-indigo-50/70 border border-indigo-200 space-y-3">
              <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-xs font-bold text-indigo-900">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <span>{language === 'ar' ? 'خيارات وباقات كورس الكبار' : 'Adult Course & Package Options'}</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-indigo-950 mb-1">{t.adultProductLabel}</label>
                <select
                  value={selectedAdultProduct}
                  onChange={(e) =>
                    setSelectedAdultProduct(e.target.value as 'beginner' | 'bce' | 'ielts-coach')
                  }
                  className="w-full px-2.5 py-1.5 rounded border border-indigo-300 text-xs bg-white text-slate-800"
                >
                  <option value="beginner">Beginner Courses (5 Levels, 10-60 Credits)</option>
                  <option value="bce">British Council English (BCE) (10-60 Credits)</option>
                  <option value="ielts-coach">IELTS Coach (10 or 20 Credits)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-indigo-950 mb-1">{t.adultPackageLabel}</label>
                <select
                  value={selectedPackageCredits}
                  onChange={(e) => setSelectedPackageCredits(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded border border-indigo-300 text-xs bg-white text-slate-800"
                >
                  {selectedAdultProduct === 'ielts-coach' ? (
                    <>
                      <option value={10}>10 Credits (5 Weeks) — 4,700 EGP</option>
                      <option value={20}>20 Credits (10 Weeks) — 7,200 EGP</option>
                    </>
                  ) : (
                    <>
                      {registrationType === 'Re-registration' && (
                        <option value={10}>10 Credits (1 Level / 2 Mo) — 3,850 EGP</option>
                      )}
                      <option value={20}>20 Credits (2 Levels / 3 Mo) — 6,000 EGP</option>
                      <option value={40}>40 Credits (4 Levels / 6 Mo) — 10,000 EGP (Installments OK)</option>
                      <option value={60}>60 Credits (9 Mo) — 13,300 EGP (Installments OK)</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          )}

          {/* MANUAL OVERRIDE SECTION */}
          <div className="pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 rtl:space-x-reverse text-xs font-bold text-slate-700 cursor-pointer">
                <Sliders className="w-3.5 h-3.5 text-slate-500" />
                <span>{t.manualOverrideTitle}</span>
              </label>
              <input
                type="checkbox"
                checked={isManualOverride}
                onChange={(e) => setIsManualOverride(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
              />
            </div>

            {isManualOverride && (
              <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-300 space-y-2 text-xs">
                <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-amber-800 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>{t.manualOverrideActiveBadge}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700">{t.overrideAgeLabel}</label>
                    <input
                      type="number"
                      value={overrideAge}
                      onChange={(e) => setOverrideAge(Number(e.target.value))}
                      className="w-full px-2 py-1 rounded border border-amber-300 text-xs bg-white"
                      min={1}
                      max={99}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700">{t.overrideCategoryLabel}</label>
                    <select
                      value={overrideAgeCategory}
                      onChange={(e) => setOverrideAgeCategory(e.target.value as AgeCategory)}
                      className="w-full px-2 py-1 rounded border border-amber-300 text-xs bg-white"
                    >
                      <option value="Early Years">Early Years (4–5)</option>
                      <option value="Young Learner">Young Learner (6–17)</option>
                      <option value="Adult">Adult (18+)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700">{t.overrideLevelLabel}</label>
                  <input
                    type="text"
                    value={overrideAcademicLevel}
                    onChange={(e) => setOverrideAcademicLevel(e.target.value)}
                    placeholder="e.g. LP Primary Plus 2"
                    className="w-full px-2 py-1 rounded border border-amber-300 text-xs bg-white"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Results Display (7 Cols) */}
        <div className="lg:col-span-7">
          <ResultCard result={calculationResult} />
        </div>
      </div>
    </div>
  );
};
