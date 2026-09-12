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
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 relative overflow-hidden">
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
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {result.calculatedAge} {t.yearsOld}
              </h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getCategoryColor(
                  result.ageCategory
                )}`}
              >
                {result.ageCategory}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-600 mt-0.5">
              {t.ageGroupLabel}: <strong className="text-slate-900">{result.ageGroup}</strong>
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
            <span className="inline-block font-bold text-sm text-bc-navy-800 bg-bc-navy-50 px-2.5 py-1 rounded-md border border-bc-navy-200">
              {result.program}
            </span>
          </div>
        </div>

        {/* Core Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          {/* Recommended Course & Level */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              {t.recommendedCourseTitle}
            </span>
            <div className="font-bold text-slate-900 text-base">
              {result.recommendedCourse}
            </div>
            <div className="text-xs text-slate-600 mt-1 flex items-center space-x-1.5 rtl:space-x-reverse">
              <span>{t.academicLevelLabel}:</span>
              <span className="font-semibold text-bc-navy-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                {result.academicLevel}
              </span>
            </div>

            {/* Summer mapping if available */}
            {result.summerMapping !== null && (
              <div className="mt-2.5 pt-2 border-t border-slate-200/80 text-xs flex items-center justify-between">
                <span className="text-amber-800 font-medium flex items-center space-x-1 rtl:space-x-reverse">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t.summerMappingLabel}</span>
                </span>
                <span className="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {result.summerMapping}
                </span>
              </div>
            )}
            {result.summerMapping === null && result.program === 'Summer School' && (
              <div className="mt-2 text-xs text-slate-500 italic">
                {t.summerMappingNotSpecified}
              </div>
            )}
          </div>

          {/* Placement Test Status */}
          <div
            className={`p-3.5 rounded-lg border ${
              result.placementTest.required
                ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">{t.ptTitle}</span>
              <span
                className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                  result.placementTest.required
                    ? 'bg-amber-200 text-amber-900'
                    : 'bg-emerald-200 text-emerald-900'
                }`}
              >
                {result.placementTest.required ? t.ptRequired : t.ptNotRequired}
              </span>
            </div>

            {result.placementTest.required ? (
              <div className="text-xs space-y-1 mt-1">
                <div className="flex items-center justify-between font-semibold">
                  <span>{t.ptFee}:</span>
                  <span className="text-sm font-extrabold text-amber-950">
                    {result.placementTest.fee} {language === 'ar' ? 'جنيه مصري' : 'EGP'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-amber-800">
                  <span>{t.ptDuration}:</span>
                  <span>{result.placementTest.duration}</span>
                </div>
                <div className="flex items-center justify-between text-amber-800">
                  <span>{t.ptValidity}:</span>
                  <span>{result.placementTest.validity}</span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-emerald-800 mt-2 flex items-center space-x-1.5 rtl:space-x-reverse">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{result.placementTest.reason}</span>
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

      {/* QUICK ANSWER HERO CARD (BILINGUAL FOR PHONE CALL & WHATSAPP) */}
      <div className="bg-gradient-to-br from-bc-navy-900 to-bc-navy-800 text-white rounded-xl shadow-md p-5 border border-bc-navy-700 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="p-1 rounded bg-bc-teal-500/20 text-bc-teal-300">
              <FileText className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-bc-teal-300">
              {t.salesQuickAnswerTitle}
            </span>
          </div>

          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            {/* Toggle Answer Language (AR / EN) */}
            <div className="flex items-center rounded-lg bg-bc-navy-950 p-0.5 border border-bc-navy-700">
              <button
                type="button"
                onClick={() => setAnswerLang('ar')}
                className={`px-2 py-1 text-xs font-bold rounded transition-all ${
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
                className={`px-2 py-1 text-xs font-bold rounded transition-all ${
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
              className={`inline-flex items-center space-x-2 rtl:space-x-reverse px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                copied
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
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
          className={`text-sm sm:text-base text-slate-100 leading-relaxed bg-bc-navy-950/40 p-3.5 rounded-lg border border-bc-navy-700/60 font-sans ${
            answerLang === 'ar' ? 'text-right dir-rtl' : 'text-left dir-ltr'
          }`}
          dir={answerLang === 'ar' ? 'rtl' : 'ltr'}
        >
          "{activeAnswer}"
        </p>

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>{t.quickAnswerDisclaimer}</span>
          <span className="font-mono text-bc-teal-300/80">{result.sourceSheet}</span>
        </div>
      </div>

      {/* Pricing & Discounts Breakdown Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2 rtl:space-x-reverse">
            <span>{t.pricingBreakdownTitle}</span>
          </h3>
          <span className="text-xs text-slate-500">{result.priceNote}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <span className="text-xs text-slate-500 block mb-1">{t.basePriceLabel}</span>
            <span className="text-lg font-bold text-slate-800">
              {result.basePrice !== null
                ? `${result.basePrice.toLocaleString()} ${language === 'ar' ? 'ج.م' : 'EGP'}`
                : t.priceNotAvailable}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 text-center">
            <span className="text-xs text-emerald-700 font-medium block mb-1">
              {t.totalDiscountLabel}
            </span>
            <span className="text-lg font-bold text-emerald-800">
              {result.discountAmount > 0
                ? `-${result.discountAmount.toLocaleString()} ${
                    language === 'ar' ? 'ج.م' : 'EGP'
                  } (${result.discountPercentage}%)`
                : language === 'ar'
                ? '٠ ج.م'
                : '0 EGP'}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-bc-navy-50 border border-bc-navy-200 text-center">
            <span className="text-xs text-bc-navy-700 font-semibold block mb-1">
              {t.finalAmountDueLabel}
            </span>
            <span className="text-xl font-extrabold text-bc-navy-900">
              {result.finalPrice !== null
                ? `${result.finalPrice.toLocaleString()} ${language === 'ar' ? 'ج.م' : 'EGP'}`
                : t.priceNotAvailable}
            </span>
          </div>
        </div>

        {/* Applied Discounts List */}
        {result.discountsApplied.length > 0 && (
          <div className="p-3 rounded-lg bg-emerald-50/40 border border-emerald-100 space-y-1.5">
            <span className="text-xs font-bold text-emerald-900 block">
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
                <span className="font-bold text-emerald-900 ml-2 rtl:mr-2 rtl:ml-0 whitespace-nowrap">
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
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <CreditCard className="w-4 h-4 text-bc-navy-700" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                {t.installmentsTitle}
              </span>
            </div>
            <span
              className={`px-2 py-0.5 text-[11px] font-bold rounded-full ${
                result.installmentEligibility.eligible
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {result.installmentEligibility.eligible ? t.eligibleBadge : t.notEligibleBadge}
            </span>
          </div>

          <p className="text-xs text-slate-600">{result.installmentEligibility.reason}</p>

          {result.installmentEligibility.options.length > 0 && (
            <div className="space-y-1.5 pt-1">
              {result.installmentEligibility.options.map((opt, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs p-2 rounded bg-slate-50 border border-slate-200 font-medium"
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
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2">
          <div className="flex items-center space-x-2 rtl:space-x-reverse pb-2 border-b border-slate-100">
            <Building className="w-4 h-4 text-bc-teal-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              {t.branchInfoTitle}
            </span>
          </div>

          {result.branchInfo ? (
            <div className="text-xs space-y-1.5 text-slate-700">
              <div className="font-bold text-slate-900 text-sm">{result.branchInfo.name}</div>
              <div>
                <strong>{t.branchLocationLabel}:</strong> {result.branchInfo.address}
              </div>
              <div>
                <strong>{t.branchHoursLabel}:</strong> {result.branchInfo.workingHours}
              </div>
              <div>
                <strong>{t.branchDaysLabel}:</strong> {result.branchInfo.workingDays}
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
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
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
