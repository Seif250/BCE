import React, { useState } from 'react';
import {
  Copy,
  Check,
  AlertCircle,
  CreditCard,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { CalculationResult, RegistrationType } from '../../data/types';
import { useLanguage } from '../../i18n/LanguageContext';
import { useToast } from '../ui/ToastContext';
import { WINTER_PRICING } from '../../data/winterCourses';
import { ADULT_COURSES } from '../../data/adultCourses';
import { CallScriptsDualCard } from './CallScriptsDualCard';
import { InstallmentsCollapsible } from './InstallmentsCollapsible';
import { WinterTermsSelector, WinterTermCardData } from './WinterTermsSelector';

interface ResultCardProps {
  result: CalculationResult;
  selectedTerms?: number;
  onSelectTerms?: (terms: number) => void;
  selectedPackageCredits?: number;
  onSelectPackageCredits?: (credits: number) => void;
  siblingCount?: number;
  isYoungestSibling?: boolean;
  registrationType?: RegistrationType;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  result,
  selectedTerms = 1,
  onSelectTerms,
  selectedPackageCredits,
  onSelectPackageCredits,
  siblingCount = 1,
  isYoungestSibling = false,
  registrationType = 'New',
}) => {
  const { language, isRTL } = useLanguage();
  const isAr = language === 'ar';
  const { showToast } = useToast();

  const [copiedPrice, setCopiedPrice] = useState(false);
  const [showExplain, setShowExplain] = useState(false);

  const handleCopyPrice = async (price: number) => {
    try {
      await navigator.clipboard.writeText(String(price));
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = String(price);
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    setCopiedPrice(true);
    showToast(isAr ? 'تم نسخ السعر' : 'Copied price');
    setTimeout(() => setCopiedPrice(false), 2000);
  };

  // Determine base term price for Winter Block
  const isEarlyYears = result.calculatedAge >= 4 && result.calculatedAge <= 5;
  const isIeltsTeens = result.calculatedAge >= 15 && result.academicLevel.value.includes('IELTS');
  const baseTermFee = isEarlyYears
    ? WINTER_PRICING.earlyYearsTermFee
    : isIeltsTeens
    ? WINTER_PRICING.ieltsTeensTermFee
    : WINTER_PRICING.primaryAndSecondaryTermFee;

  // Check active additional discounts
  const isSiblingDiscountActive = Boolean(siblingCount > 1 && isYoungestSibling);

  // Multi-term winter packages: [1, 2, 3, 4]
  const winterTermCards: WinterTermCardData[] = [
    { terms: 1, bundleDiscount: 0, label: isAr ? 'ترم واحد' : '1 Term' },
    { terms: 2, bundleDiscount: 0.05, label: isAr ? 'ترمين (خصم 5%)' : '2 Terms (5% Off)' },
    { terms: 3, bundleDiscount: 0.10, label: isAr ? '3 ترمات (خصم 10%)' : '3 Terms (10% Off)' },
    { terms: 4, bundleDiscount: 0.15, label: isAr ? '4 ترمات (خصم 15%)' : '4 Terms (15% Off)' },
  ].map((item) => {
    const rawTotal = baseTermFee * item.terms;
    const siblingRate = isSiblingDiscountActive ? WINTER_PRICING.siblingDiscountPercent / 100 : 0;
    const totalDiscountRate = item.bundleDiscount + siblingRate;
    const discountAmt = Math.round(rawTotal * totalDiscountRate);
    const finalAmt = rawTotal - discountAmt;
    const totalPercentage = Math.round(totalDiscountRate * 100);

    return {
      ...item,
      rawTotal,
      discountAmt,
      finalAmt,
      totalPercentage,
    };
  });

  // Adult packages if program is Adult
  const adultProduct = ADULT_COURSES.find(
    (p) => p.name === result.recommendedCourse.value || p.levels.includes(result.academicLevel.value)
  ) || ADULT_COURSES[1];

  return (
    <div className="space-y-4">
      {/* 1. COMPACT RESULT HEADER: Level + Placement Test Badge */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-4 relative overflow-hidden">
        <div
          className={`absolute top-0 w-2 h-full bg-bc-teal-500 ${
            isRTL ? 'left-0' : 'right-0'
          }`}
        />

        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              {isAr ? 'المستوى المقترح / المرحلة' : 'Recommended Level / Stage'}
            </span>
            <div className="flex items-center space-x-2 rtl:space-x-reverse mt-0.5">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {result.academicLevel.value}
              </h2>
              {result.academicLevel.status === 'needs_confirmation' && (
                <span title={`Source: ${result.academicLevel.source}\nStatus: ${result.academicLevel.status}`}>
                  <AlertCircle className="w-4 h-4 text-amber-600 inline" aria-hidden="true" />
                </span>
              )}
            </div>
          </div>

          {/* Placement Test Badge */}
          <div className="flex flex-col sm:items-end gap-1">
            <div
              className="px-3 py-1.5 rounded-lg border flex items-center space-x-1.5 rtl:space-x-reverse text-xs font-bold bg-emerald-50 text-emerald-900 border-emerald-300"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
              <span>
                {result.placementTest.required
                  ? (isAr ? 'تم اجتياز الاختبار (Passed)' : 'Placement Test: Passed / Completed')
                  : (isAr ? 'لا يحتاج امتحان تحديد مستوى (مرحلة مبكرة)' : 'Placement Test: Not Required (Early Years)')}
              </span>
            </div>
            {result.placementTest.required && (
              <span className="text-[10px] text-slate-500 font-medium">
                {isAr
                  ? `رسوم الاختبار ${result.placementTest.fee} ج.م (في حال طلب العميل حجز اختبار جديد)`
                  : `Standard test fee: ${result.placementTest.fee} EGP (if booking new test)`}
              </span>
            )}
          </div>
        </div>

        {/* Schedule & Duration line */}
        <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
          <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
            <Clock className="w-3.5 h-3.5 text-bc-teal-600 flex-shrink-0" aria-hidden="true" />
            <span>
              <strong>{isAr ? 'المواعيد والمدة:' : 'Schedule:'}</strong> {result.durationAndSessions}
            </span>
          </div>
          {result.summerMapping.value && (
            <div className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {isAr ? 'معادل الصيف:' : 'Summer Camp:'} {result.summerMapping.value}
            </div>
          )}
        </div>
      </div>

      {/* 2. DYNAMIC PRICING CARDS */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
              {isAr ? 'خيارات الأسعار والخصومات' : 'Pricing & Discount Options'}
            </span>
            {result.priceNote && (
              <span className="text-[11px] text-slate-500 font-normal">
                ({result.priceNote})
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
            {/* Copy Price Button */}
            {result.finalPrice !== null && (
              <button
                type="button"
                onClick={() => handleCopyPrice(result.finalPrice!)}
                className={`inline-flex items-center space-x-1 rtl:space-x-reverse px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                  copiedPrice
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
                title={isAr ? 'نسخ السعر' : 'Copy Price'}
              >
                {copiedPrice ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                )}
                <span>{copiedPrice ? (isAr ? 'تم النسخ' : 'Copied!') : (isAr ? 'نسخ السعر' : 'Copy Price')}</span>
              </button>
            )}

            {/* Explain Calculation Toggle */}
            <button
              type="button"
              onClick={() => setShowExplain(!showExplain)}
              className="inline-flex items-center space-x-1 rtl:space-x-reverse px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200"
              aria-expanded={showExplain}
            >
              <span>{isAr ? 'شرح الحساب' : 'Explain'}</span>
              {showExplain ? (
                <ChevronUp className="w-3 h-3" aria-hidden="true" />
              ) : (
                <ChevronDown className="w-3 h-3" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* PROMINENT ACTIVE DISCOUNTS BANNER */}
        {result.discountsApplied.length > 0 && (
          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 flex flex-wrap items-center justify-between gap-2 animate-fade-in">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-black text-emerald-950 flex items-center space-x-1 rtl:space-x-reverse">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 inline" aria-hidden="true" />
                <span>{isAr ? 'الخصومات المطبقة فوراً:' : 'Applied Discounts:'}</span>
              </span>
              {result.discountsApplied.map((d, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-md text-xs font-black bg-white text-emerald-800 border border-emerald-300 shadow-2xs inline-flex items-center gap-1"
                >
                  <Check className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                  <span>{d.name} ({d.percentage}%): -{d.amount.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}</span>
                </span>
              ))}
            </div>
            <div className="text-xs font-extrabold text-emerald-900 bg-emerald-100/80 px-2.5 py-1 rounded-md">
              {isAr ? 'إجمالي الخصم:' : 'Total Savings:'} -{result.discountAmount.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
            </div>
          </div>
        )}

        {/* WINTER MULTI-TERM CARDS GRID */}
        {result.program.value === 'Winter Block' && (
          <WinterTermsSelector
            cards={winterTermCards}
            selectedTerms={selectedTerms}
            onSelectTerms={onSelectTerms}
            isAr={isAr}
          />
        )}

        {/* ADULT COURSE PACKAGES GRID */}
        {result.program.value === 'Adult' && adultProduct && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            {adultProduct.packages.map((pkg) => {
              const isSelected = selectedPackageCredits === pkg.credits;
              const isReReg = registrationType === 'Re-registration';
              const pkgDiscount = isReReg ? Math.round(pkg.price * 0.10) : 0;
              const pkgFinal = pkg.price - pkgDiscount;
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => onSelectPackageCredits && onSelectPackageCredits(pkg.credits)}
                  aria-pressed={isSelected}
                  className={`p-3.5 rounded-xl border text-center relative transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#00205B] text-white border-[#00205B] shadow-md ring-2 ring-bc-teal-400 scale-[1.02]'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <span
                      className={`text-xs font-bold block ${
                        isSelected ? 'text-bc-teal-300' : 'text-slate-600'
                      }`}
                    >
                      {pkg.credits} {isAr ? 'ساعة / رصيد' : 'Credits'}
                    </span>

                    {/* HERO PRICE */}
                    <div className="my-2">
                      <span
                        className={`text-xl sm:text-2xl font-black block tracking-tight ${
                          isSelected ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {pkgFinal.toLocaleString()}
                        <span className="text-xs font-bold mr-1 rtl:ml-1 rtl:mr-0 opacity-85">
                          {isAr ? 'ج.م' : 'EGP'}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="space-y-0.5 pt-1.5 border-t border-slate-200/50">
                    {pkgDiscount > 0 && (
                      <span
                        className={`text-xs font-bold block ${
                          isSelected ? 'text-emerald-300' : 'text-emerald-600'
                        }`}
                      >
                        {isAr ? `وفر ${pkgDiscount.toLocaleString()} ج.م (خصم 10%)` : `Save ${pkgDiscount.toLocaleString()} EGP (10%)`}
                      </span>
                    )}
                    {pkg.credits >= 40 && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5 inline-flex items-center gap-1 ${
                          isSelected
                            ? 'bg-bc-teal-400/20 text-bc-teal-200 border border-bc-teal-400/30'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        <CreditCard className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
                        <span>{isAr ? 'متاح تقسيط 6 و 12 شهر' : '6M & 12M Installments'}</span>
                      </span>
                    )}
                    <span
                      className={`text-[10px] block ${
                        isSelected ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {pkg.durationOrLevels}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Calculation Explanation Drawer */}
        {showExplain && (
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5 animate-fade-in">
            <div className="flex justify-between text-slate-600">
              <span>{isAr ? 'السعر الأساسي:' : 'Base Price:'}</span>
              <span className="font-bold">
                {result.basePrice?.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
              </span>
            </div>
            {result.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>{isAr ? `إجمالي الخصم (${result.discountPercentage}%):` : `Total Discount (${result.discountPercentage}%):`}</span>
                <span className="font-bold">
                  -{result.discountAmount.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                </span>
              </div>
            )}
            {result.discountsApplied.map((d, i) => (
              <div key={i} className="text-[11px] text-emerald-800 pl-2 rtl:pr-2">
                • {d.name}: {d.description} (-{d.amount.toLocaleString()} {isAr ? 'ج.م' : 'EGP'})
              </div>
            ))}
            <div className="flex justify-between font-extrabold text-slate-900 pt-1.5 border-t border-slate-200 text-sm">
              <span>{isAr ? 'المبلغ النهائي المطلوب:' : 'Final Amount Due:'}</span>
              <span className="text-[#00205B]">
                {result.finalPrice?.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 3. DUAL CALL PITCH / SCRIPT (ARABIC & ENGLISH SIDE-BY-SIDE) */}
      <CallScriptsDualCard
        quickCustomerAnswerAr={result.quickCustomerAnswerAr}
        quickCustomerAnswerEn={result.quickCustomerAnswerEn}
        isAr={isAr}
      />

      {/* 4. COMPACT COLLAPSIBLE SECONDARY SECTIONS: Installments */}
      <InstallmentsCollapsible
        installmentEligibility={result.installmentEligibility}
        isAr={isAr}
        defaultOpen={true}
      />
    </div>
  );
};
