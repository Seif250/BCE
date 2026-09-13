import React, { useState } from 'react';
import {
  Copy,
  Check,
  Calendar,
  AlertCircle,
  CreditCard,
  Building,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles,
  Info,
  Languages,
} from 'lucide-react';
import { CalculationResult } from '../../data/types';
import { useLanguage } from '../../i18n/LanguageContext';

interface ResultCardProps {
  result: CalculationResult;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const { t, language, isRTL } = useLanguage();

  // Quick answer language selection: default to active app language
  const [answerLang, setAnswerLang] = useState<'ar' | 'en'>(language);
  const [copied, setCopied] = useState(false);

  // Sync answerLang when app language switches
  React.useEffect(() => {
    setAnswerLang(language);
  }, [language]);

  const activeAnswer =
    answerLang === 'ar' ? result.quickCustomerAnswerAr : result.quickCustomerAnswerEn;

  const handleCopyAnswer = async () => {
    try {
      await navigator.clipboard.writeText(activeAnswer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = activeAnswer;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Early Years':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Young Learner':
        return 'bg-bc-teal-50 text-bc-teal-800 border-bc-teal-200';
      case 'Adult':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      default:
        return 'bg-rose-50 text-rose-800 border-rose-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner: Age, Group, Category */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow p-5 relative overflow-hidden">
        <div
          className={`absolute top-0 w-2.5 h-full bg-bc-teal-500 ${
            isRTL ? 'left-0' : 'right-0'
          }`}
        />

        {result.isManualOverrideActive && (
          <div className="mb-3 inline-flex items-center space-x-1.5 rtl:space-x-reverse px-2.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-xs font-semibold">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>{t.manualOverrideActiveBadge}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {result.calculatedAge} {t.yearsOld}
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${getCategoryColor(
                  result.ageCategory.value
                )}`}
              >
                {result.ageCategory.value}
              </span>
              {result.ageCategory.status === 'needs_confirmation' && (
                <span title={`Source: ${result.ageCategory.source}\nStatus: ${result.ageCategory.status}`}>
                  <AlertCircle className="inline-block w-4 h-4 text-amber-600 ml-1" />
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-slate-600 mt-0.5">
              {t.ageGroupLabel}: <strong className="text-slate-900">{result.ageGroup.value}</strong>
              {result.ageGroup.status === 'needs_confirmation' && (
                <span title={`Source: ${result.ageGroup.source}\nStatus: ${result.ageGroup.status}`}>
                  <AlertCircle className="inline-block w-4 h-4 text-amber-600 ml-1" />
                </span>
              )}
              {result.ageMonths > 0 && (
                <span className="text-xs text-slate-400 mx-1.5 font-normal">
                  ({result.ageYears}y {result.ageMonths}m {result.ageDays}d)
                </span>
              )}
            </p>
          </div>

          <div className="text-right rtl:text-left">
            <span className="text-xs text-slate-400 block font-medium">
              {t.programSeasonLabel}
            </span>
            <span className="inline-block font-bold text-xs text-bc-navy-800 bg-bc-navy-50 px-3 py-1 rounded-lg border border-bc-navy-200">
              {result.program.value}
            </span>
            {result.program.status === 'needs_confirmation' && (
              <span title={`Source: ${result.program.source}\nStatus: ${result.program.status}`}>
                <AlertCircle className="inline-block w-4 h-4 text-amber-600 ml-1" />
              </span>
            )}
          </div>
        </div>

        {/* Core Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          {/* Recommended Course & Level */}
          <div className="p-4 rounded-xl bg-slate-50/90 border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              {t.recommendedCourseTitle}
            </span>
            <div className="font-extrabold text-slate-900 text-base">
              {result.recommendedCourse.value}
            </div>
            {result.recommendedCourse.status === 'needs_confirmation' && (
              <span title={`Source: ${result.recommendedCourse.source}\nStatus: ${result.recommendedCourse.status}`}>
                <AlertCircle className="inline-block w-4 h-4 text-amber-600 ml-1" />
              </span>
            )}
            <div className="text-xs text-slate-600 mt-1.5 flex items-center space-x-1.5 rtl:space-x-reverse">
              <span>{t.academicLevelLabel}:</span>
              <span className="font-bold text-bc-navy-900 bg-white px-2.5 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                {result.academicLevel.value}
              </span>
              {result.academicLevel.status === 'needs_confirmation' && (
                <span title={`Source: ${result.academicLevel.source}\nStatus: ${result.academicLevel.status}`}>
                  <AlertCircle className="inline-block w-4 h-4 text-amber-600 ml-1" />
                </span>
              )}
            </div>

            {/* Summer mapping if available */}
            {result.summerMapping.value !== null && (
              <div className="mt-2.5 pt-2.5 border-t border-slate-200 text-xs flex items-center justify-between">
                <span className="text-amber-800 font-medium flex items-center space-x-1 rtl:space-x-reverse">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t.summerMappingLabel}</span>
                </span>
                <span className="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {result.summerMapping.value}
                </span>
              </div>
            )}
            {result.summerMapping.status === 'needs_confirmation' && (
              <span title={`Source: ${result.summerMapping.source}\nStatus: ${result.summerMapping.status}`}>
                <AlertCircle className="inline-block w-4 h-4 text-amber-600 ml-1" />
              </span>
            )}
            {result.summerMapping.value === null && result.program.value === 'Summer School' && (
              <div className="mt-2 text-xs text-slate-500 italic">
                {t.summerMappingNotSpecified}
              </div>
            )}
          </div>

          {/* Placement Test Status */}
          <div
            className={`p-4 rounded-xl border ${
              result.placementTest.required
                ? 'bg-amber-50/80 border-amber-300/80 text-amber-950'
                : 'bg-emerald-50/80 border-emerald-300/80 text-emerald-950'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">{t.ptTitle}</span>
              <span
                className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${
                  result.placementTest.required
                    ? 'bg-amber-200 text-amber-900 border-amber-300'
                    : 'bg-emerald-200 text-emerald-900 border-emerald-300'
                }`}
              >
                {result.placementTest.required ? t.ptRequired : t.ptNotRequired}
              </span>
            </div>

            {result.placementTest.required ? (
              <div className="text-xs space-y-1.5 mt-1">
                <div className="flex items-center justify-between font-semibold">
                  <span>{t.ptFee}:</span>
                  <span className="text-base font-black text-amber-950">
                    {result.placementTest.fee} {language === 'ar' ? 'جنيه مصري' : 'EGP'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-amber-800">
                  <span>{t.ptDuration}:</span>
                  <span className="font-medium">{result.placementTest.duration}</span>
                </div>
                <div className="flex items-center justify-between text-amber-800">
                  <span>{t.ptValidity}:</span>
                  <span className="font-medium">{result.placementTest.validity}</span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-emerald-800 mt-2 flex items-center space-x-1.5 rtl:space-x-reverse">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="font-medium">{result.placementTest.reason}</span>
              </div>
            )}
          </div>
        </div>

        {/* Schedule & Duration row */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center space-x-2 rtl:space-x-reverse text-xs text-slate-600">
          <Clock className="w-4 h-4 text-bc-teal-600 flex-shrink-0" />
          <span>
            <strong>{t.scheduleLabel}:</strong> {result.durationAndSessions}
          </span>
        </div>
      </div>

      {/* QUICK SALES CALL SCRIPT / SUGGESTED ANSWER */}
      <div className="bg-gradient-to-br from-bc-navy-950 to-bc-navy-900 text-white rounded-2xl shadow-sm p-5 border border-bc-navy-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
            <span className="p-1.5 rounded-lg bg-bc-teal-500/20 text-bc-teal-300 border border-bc-teal-500/30">
              <FileText className="w-4 h-4" />
            </span>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-bc-teal-300 block">
                {language === 'ar' ? 'صيغة الرد المقترح للعميل في المكالمة' : 'Suggested Call Pitch'}
              </span>
              <span className="text-[11px] text-slate-400">
                {language === 'ar' ? 'ملخص المعلومات والأسعار للرد الفوري أثناء المكالمة' : 'Instant response guide during phone calls'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            {/* Toggle Answer Language (AR / EN) */}
            <div className="flex items-center rounded-xl bg-bc-navy-900 p-0.5 border border-bc-navy-700">
              <button
                type="button"
                onClick={() => setAnswerLang('ar')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  answerLang === 'ar'
                    ? 'bg-bc-teal-500 text-bc-navy-950 shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                🇪🇬 مصري
              </button>
              <button
                type="button"
                onClick={() => setAnswerLang('en')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  answerLang === 'en'
                    ? 'bg-bc-teal-500 text-bc-navy-950 shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                🇬🇧 English
              </button>
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopyAnswer}
              className={`inline-flex items-center space-x-1.5 rtl:space-x-reverse px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow ${
                copied
                  ? 'bg-emerald-500 text-white'
                  : 'bg-bc-teal-500 text-bc-navy-950 hover:bg-bc-teal-400 hover:scale-[1.02]'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{t.copiedToast}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{t.copyQuickAnswerBtn}</span>
                </>
              )}
            </button>
          </div>
        </div>

        <p
          className={`text-sm sm:text-base text-slate-100 leading-relaxed bg-bc-navy-900/70 p-4 rounded-xl border border-bc-navy-800 font-sans ${
            answerLang === 'ar' ? 'text-right dir-rtl' : 'text-left dir-ltr'
          }`}
          dir={answerLang === 'ar' ? 'rtl' : 'ltr'}
        >
          "{activeAnswer}"
        </p>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span>{t.quickAnswerDisclaimer}</span>
          <span className="font-mono text-bc-teal-300/80">{result.sourceSheet}</span>
        </div>
      </div>

      {/* Pricing & Discounts Breakdown Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2 rtl:space-x-reverse">
            <span>{t.pricingBreakdownTitle}</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">{result.priceNote}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-xs text-slate-500 font-medium block mb-1">{t.basePriceLabel}</span>
            <span className="text-xl font-bold text-slate-800">
              {result.basePrice !== null
                ? `${result.basePrice.toLocaleString()} ${language === 'ar' ? 'ج.م' : 'EGP'}`
                : t.priceNotAvailable}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-center">
            <span className="text-xs text-emerald-700 font-semibold block mb-1">
              {t.totalDiscountLabel}
            </span>
            <span className="text-xl font-extrabold text-emerald-700">
              {result.discountAmount > 0
                ? `-${result.discountAmount.toLocaleString()} ${
                    language === 'ar' ? 'ج.م' : 'EGP'
                  } (${result.discountPercentage}%)`
                : language === 'ar'
                ? '٠ ج.م'
                : '0 EGP'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-gradient-to-br from-bc-navy-900 to-bc-navy-800 border border-bc-navy-700 text-center text-white shadow-sm">
            <span className="text-xs text-bc-teal-300 font-bold block mb-1">
              {t.finalAmountDueLabel}
            </span>
            <span className="text-2xl font-black text-white">
              {result.finalPrice !== null
                ? `${result.finalPrice.toLocaleString()} ${language === 'ar' ? 'ج.م' : 'EGP'}`
                : t.priceNotAvailable}
            </span>
          </div>
        </div>

        {/* Applied Discounts List */}
        {result.discountsApplied.length > 0 && (
          <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200/80 space-y-1.5">
            <span className="text-xs font-black text-emerald-900 block">
              {t.applicableDiscountsLabel}
            </span>
            {result.discountsApplied.map((disc, idx) => (
              <div
                key={idx}
                className="text-xs text-emerald-800 flex items-center justify-between"
              >
                <span>
                  • <strong>{disc.name}</strong>: {disc.description}
                </span>
                <span className="font-bold text-emerald-900 ml-2 rtl:mr-2 rtl:ml-0 whitespace-nowrap bg-white px-2 py-0.5 rounded border border-emerald-200">
                  -{disc.amount.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Installments & Branch Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Installments Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <CreditCard className="w-4 h-4 text-bc-navy-700" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                {t.installmentsTitle}
              </span>
            </div>
            <span
              className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full ${
                result.installmentEligibility.eligible
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {result.installmentEligibility.eligible ? t.eligibleBadge : t.notEligibleBadge}
            </span>
          </div>

          <p className="text-xs text-slate-600 font-medium">{result.installmentEligibility.reason}</p>

          {/* Supported Bank Badges */}
          <div className="flex flex-wrap gap-1 text-[10px] font-semibold text-slate-600 pb-1">
            <span className="bg-slate-100 px-1.5 py-0.5 rounded">CIB</span>
            <span className="bg-slate-100 px-1.5 py-0.5 rounded">NBE (الأهلي)</span>
            <span className="bg-slate-100 px-1.5 py-0.5 rounded">Banque Misr (مصر)</span>
            <span className="bg-slate-100 px-1.5 py-0.5 rounded">ValU (فاليو)</span>
            <span className="bg-slate-100 px-1.5 py-0.5 rounded">Aman (أمان)</span>
          </div>

          {result.installmentEligibility.options.length > 0 && (
            <div className="space-y-1.5 pt-1">
              {result.installmentEligibility.options.map((opt, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 border border-slate-200 font-medium hover:bg-slate-100 transition-colors"
                >
                  <span>
                    <strong>{opt.tenureMonths} {language === 'ar' ? 'شهور' : 'Months'}</strong> ({opt.adminPercent}% {language === 'ar' ? 'مصاريف إدارية' : 'Admin Exp.'})
                  </span>
                  <span className="font-bold text-bc-navy-900">
                    {opt.monthlyPayment !== null
                      ? `~${opt.monthlyPayment.toLocaleString()} ${language === 'ar' ? 'ج.م / شهر' : 'EGP / mo'}`
                      : t.monthlyEstimate}
                  </span>
                </div>
              ))}
            </div>
          )}

          <p className="text-[11px] text-slate-400 italic pt-1">
            {result.installmentEligibility.notes}
          </p>
        </div>

        {/* Branch Info Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-2.5">
          <div className="flex items-center space-x-2 rtl:space-x-reverse pb-2 border-b border-slate-100">
            <Building className="w-4 h-4 text-bc-teal-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              {t.branchInfoTitle}
            </span>
          </div>

          {result.branchInfo ? (
            <div className="text-xs space-y-1.5 text-slate-700">
              <div className="font-black text-slate-900 text-sm">
                {language === 'ar' && result.branchInfo.nameAr ? result.branchInfo.nameAr : result.branchInfo.name}
              </div>
              <div>
                <strong>{t.branchLocationLabel}:</strong>{' '}
                {language === 'ar' && result.branchInfo.addressAr ? result.branchInfo.addressAr : result.branchInfo.address}
              </div>
              <div>
                <strong>{t.branchHoursLabel}:</strong>{' '}
                {language === 'ar' && result.branchInfo.workingHoursAr ? result.branchInfo.workingHoursAr : result.branchInfo.workingHours}
              </div>
              <div>
                <strong>{t.branchDaysLabel}:</strong>{' '}
                {language === 'ar' && result.branchInfo.workingDaysAr ? result.branchInfo.workingDaysAr : result.branchInfo.workingDays}
              </div>
              {result.branchInfo.manager && (
                <div className="text-slate-500 text-[11px]">
                  {t.branchManagerLabel}: {result.branchInfo.manager}
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-slate-500 flex items-center space-x-2 rtl:space-x-reverse py-4">
              <Info className="w-4 h-4 text-slate-400" />
              <span>{t.selectBranchPrompt}</span>
            </div>
          )}
        </div>
      </div>

      {/* Operational Notes Collapsible / List */}
      {result.operationalNotes.length > 0 && (
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">
            {t.operationalNotesTitle}
          </span>
          <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
            {result.operationalNotes.slice(0, 5).map((note, idx) => (
              <li key={idx} className="leading-snug">
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
