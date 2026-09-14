import React, { useState, useEffect } from 'react';
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
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { CalculationResult, RegistrationType } from '../../data/types';
import { useLanguage } from '../../i18n/LanguageContext';
import { useToast } from '../ui/ToastContext';
import { WINTER_PRICING } from '../../data/winterCourses';
import { ADULT_COURSES } from '../../data/adultCourses';

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
  const { t, language, isRTL } = useLanguage();
  const isAr = language === 'ar';
  const { showToast } = useToast();

  const [copiedAr, setCopiedAr] = useState(false);
  const [copiedEn, setCopiedEn] = useState(false);
  const [copiedPrice, setCopiedPrice] = useState(false);
  const [copiedCrm, setCopiedCrm] = useState(false);
  const [showExplain, setShowExplain] = useState(false);
  const [showInstallments, setShowInstallments] = useState(true);
  const [showBranch, setShowBranch] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 's' || e.key === 'S' || e.key === 'س')) {
        e.preventDefault();
        handleCopyText(generateCrmSummary(), 'crm');
      } else if (e.altKey && (e.key === 'c' || e.key === 'C' || e.key === 'ؤ')) {
        e.preventDefault();
        handleCopyText(isAr ? result.quickCustomerAnswerAr : result.quickCustomerAnswerEn, isAr ? 'ar' : 'en');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [result, isAr]);

  const handleCopyText = async (text: string, type: 'ar' | 'en' | 'price' | 'crm') => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }

    if (type === 'ar') {
      setCopiedAr(true);
      showToast(isAr ? '✓ تم نسخ رد العميل (بالعربي)' : '✓ Copied Arabic customer answer');
      setTimeout(() => setCopiedAr(false), 2000);
    } else if (type === 'en') {
      setCopiedEn(true);
      showToast(isAr ? '✓ تم نسخ رد العميل (بالإنجليزي)' : '✓ Copied English customer answer');
      setTimeout(() => setCopiedEn(false), 2000);
    } else if (type === 'price') {
      setCopiedPrice(true);
      showToast(isAr ? '✓ تم نسخ السعر' : '✓ Copied price');
      setTimeout(() => setCopiedPrice(false), 2000);
    } else {
      setCopiedCrm(true);
      showToast(isAr ? '✓ تم نسخ ملخص المكالمة للـ CRM' : '✓ Copied CRM Call Summary');
      setTimeout(() => setCopiedCrm(false), 2000);
    }
  };

  const generateCrmSummary = () => {
    const ageStr = `${result.calculatedAge} yrs`;
    const levelStr = result.academicLevel.value;
    const ptStr = result.placementTest.required
      ? `Placement Test: Completed / Passed (Level confirmed on call | Test fee: ${result.placementTest.fee} EGP if new test required)`
      : `Placement Test: Not Required (Early Years 4–5)`;
    const courseStr = result.recommendedCourse.value;
    const termsStr = result.program.value === 'Winter Block' ? `${selectedTerms} Term(s)` : `${result.durationAndSessions}`;
    const priceStr = `${result.finalPrice?.toLocaleString()} EGP`;
    const discountStr = result.discountsApplied.length > 0
      ? ` [Discounts: ${result.discountsApplied.map(d => d.name === 'Vario' ? 'Vario (deducted on SMS)' : `${d.name} (${d.percentage}%)`).join(', ')}]`
      : ' [No Discounts]';

    const instStr = result.installmentEligibility.eligible && result.installmentEligibility.options.length >= 2
      ? `\n• Installments (Credit Card):\n  - 6 Months: ~${result.installmentEligibility.options[0]?.monthlyPayment?.toLocaleString()} EGP/mo (Total: ${result.installmentEligibility.options[0]?.totalWithAdmin?.toLocaleString()} EGP with 9% admin fee)\n  - 12 Months: ~${result.installmentEligibility.options[1]?.monthlyPayment?.toLocaleString()} EGP/mo (Total: ${result.installmentEligibility.options[1]?.totalWithAdmin?.toLocaleString()} EGP with 15% admin fee)`
      : '';

    return `=== BRITISH COUNCIL SALES CALL SUMMARY (CRM) ===
• Student: Age ${ageStr} | Age Group: ${result.ageGroup.value}
• Program: ${courseStr} | Booking: ${termsStr}
• Assigned Level: ${levelStr}
• Placement Test: ${ptStr}
• Total Course Fee: ${priceStr}${discountStr}${instStr}
• Status: Ready for booking / payment link
=================================================`;
  };

  // Determine base term price for Winter Block
  const isEarlyYears = result.calculatedAge >= 4 && result.calculatedAge <= 5;
  const isIeltsTeens = result.calculatedAge >= 15 && result.academicLevel.value.includes('IELTS');
  const baseTermFee = isEarlyYears
    ? WINTER_PRICING.earlyYearsTermFee // 6400
    : isIeltsTeens
    ? WINTER_PRICING.ieltsTeensTermFee // 5600
    : WINTER_PRICING.primaryAndSecondaryTermFee; // 5800

  // Check active additional discounts
  const isSiblingDiscountActive = Boolean(siblingCount > 1 && isYoungestSibling);
  const isReRegistrationActive = registrationType === 'Re-registration';

  // Multi-term winter packages: [1, 2, 3, 4]
  const winterTermCards = [
    { terms: 1, bundleDiscount: 0, label: isAr ? 'ترم واحد' : '1 Term', popular: false },
    { terms: 2, bundleDiscount: 0.05, label: isAr ? 'ترمين (خصم 5%)' : '2 Terms (5% Off)', popular: false },
    { terms: 3, bundleDiscount: 0.10, label: isAr ? '3 ترمات (خصم 10%)' : '3 Terms (10% Off)', popular: true },
    { terms: 4, bundleDiscount: 0.15, label: isAr ? '4 ترمات (خصم 15%)' : '4 Terms (15% Off)', popular: false },
  ].map((item) => {
    const rawTotal = baseTermFee * item.terms;

    // Sum all applicable discounts for this term count (bundle + sibling if eligible)
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
      siblingRate,
    };
  });

  // Adult packages if program is Adult
  const adultProduct = ADULT_COURSES.find((p) => p.name === result.recommendedCourse.value || p.levels.includes(result.academicLevel.value)) || ADULT_COURSES[1];

  return (
    <div className="space-y-4">
      {/* 1. COMPACT RESULT HEADER: Level + Placement Test Badge */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 relative overflow-hidden">
        <div
          className={`absolute top-0 w-2 h-full bg-bc-teal-500 ${
            isRTL ? 'left-0' : 'right-0'
          }`}
        />

        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {isAr ? 'المستوى المقترح / المرحلة' : 'Recommended Level / Stage'}
            </span>
            <div className="flex items-center space-x-2 rtl:space-x-reverse mt-0.5">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {result.academicLevel.value}
              </h2>
              {result.academicLevel.status === 'needs_confirmation' && (
                <span title={`Source: ${result.academicLevel.source}\nStatus: ${result.academicLevel.status}`}>
                  <AlertCircle className="w-4 h-4 text-amber-600 inline" />
                </span>
              )}
            </div>
          </div>

          {/* Placement Test Badge */}
          <div className="flex flex-col sm:items-end gap-1">
            <div
              className={`px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 rtl:space-x-reverse text-xs font-bold ${
                result.placementTest.required
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                  : 'bg-emerald-50 text-emerald-900 border-emerald-300'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
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
            <Clock className="w-3.5 h-3.5 text-bc-teal-600 flex-shrink-0" />
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
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-3">
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
                onClick={() =>
                  handleCopyText(
                    `${result.finalPrice?.toLocaleString()} ${isAr ? 'جنيه مصري' : 'EGP'} (${result.priceNote})`,
                    'price'
                  )
                }
                className={`inline-flex items-center space-x-1 rtl:space-x-reverse px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                  copiedPrice
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
                title={isAr ? 'نسخ السعر' : 'Copy Price'}
              >
                {copiedPrice ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copiedPrice ? (isAr ? 'تم النسخ' : 'Copied!') : (isAr ? 'نسخ السعر' : 'Copy Price')}</span>
              </button>
            )}

            {/* Explain Calculation Toggle */}
            <button
              type="button"
              onClick={() => setShowExplain(!showExplain)}
              className="inline-flex items-center space-x-1 rtl:space-x-reverse px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200"
            >
              <span>{isAr ? 'شرح الحساب' : 'Explain'}</span>
              {showExplain ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* PROMINENT ACTIVE DISCOUNTS BANNER */}
        {result.discountsApplied.length > 0 && (
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 flex flex-wrap items-center justify-between gap-2 animate-fade-in">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-black text-emerald-950 flex items-center space-x-1 rtl:space-x-reverse">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 inline" />
                <span>{isAr ? 'الخصومات المطبقة فوراً:' : 'Applied Discounts:'}</span>
              </span>
              {result.discountsApplied.map((d, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg text-xs font-black bg-white text-emerald-800 border border-emerald-300 shadow-2xs"
                >
                  ✓ {d.name} ({d.percentage}%): -{d.amount.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                </span>
              ))}
            </div>
            <div className="text-xs font-extrabold text-emerald-900 bg-emerald-100/80 px-2.5 py-1 rounded-lg">
              {isAr ? 'إجمالي الخصم:' : 'Total Savings:'} -{result.discountAmount.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
            </div>
          </div>
        )}

        {/* WINTER MULTI-TERM CARDS GRID */}
        {result.program.value === 'Winter Block' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            {winterTermCards.map((card) => {
              const isSelected = selectedTerms === card.terms;
              return (
                <button
                  key={card.terms}
                  type="button"
                  onClick={() => onSelectTerms && onSelectTerms(card.terms)}
                  className={`p-3.5 rounded-xl border text-center relative transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#062A67] to-[#041d48] text-white border-[#062A67] shadow-md ring-2 ring-bc-teal-400 scale-[1.02]'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                  }`}
                >
                  <div>
                    {/* Subtle Best Value Badge */}
                    {card.popular && (
                      <span
                        className={`inline-block mb-1 text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 shadow-xs'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {isAr ? 'الأكثر طلباً • Best Value' : 'Best Value'}
                      </span>
                    )}

                    <span
                      className={`text-xs font-bold block ${
                        isSelected ? 'text-bc-teal-300' : 'text-slate-600'
                      }`}
                    >
                      {card.label}
                    </span>

                    {/* HERO PRICE NUMBER (24-28px bold) */}
                    <div className="my-2">
                      <span
                        className={`text-2xl sm:text-3xl font-black block tracking-tight ${
                          isSelected ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {card.finalAmt.toLocaleString()}
                        <span className="text-xs font-bold mr-1 rtl:ml-1 rtl:mr-0 opacity-85">
                          {isAr ? 'ج.م' : 'EGP'}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="space-y-0.5 pt-1.5 border-t border-slate-200/50">
                    {/* Bundle discount note directly underneath */}
                    {card.bundleDiscount > 0 && (
                      <span
                        className={`text-[11px] font-medium block ${
                          isSelected ? 'text-slate-300' : 'text-slate-500'
                        }`}
                      >
                        {isAr
                          ? `يشمل خصم حزمة ${Math.round(card.bundleDiscount * 100)}%`
                          : `includes ${Math.round(card.bundleDiscount * 100)}% bundle discount`}
                      </span>
                    )}

                    {card.discountAmt > 0 && (
                      <span
                        className={`text-xs font-bold block ${
                          isSelected ? 'text-emerald-300' : 'text-emerald-600'
                        }`}
                      >
                        {isAr
                          ? `وفر ${card.discountAmt.toLocaleString()} ج.م (${card.totalPercentage}%)`
                          : `Save ${card.discountAmt.toLocaleString()} EGP (${card.totalPercentage}%)`}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
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
                  className={`p-3.5 rounded-xl border text-center relative transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#062A67] to-[#041d48] text-white border-[#062A67] shadow-md ring-2 ring-bc-teal-400 scale-[1.02]'
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
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5 animate-fade-in">
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
              <span className="text-bc-navy-900">
                {result.finalPrice?.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 3. DUAL CALL PITCH / SCRIPT (ARABIC & ENGLISH SIDE-BY-SIDE) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Arabic Call Script */}
        <div className="bg-gradient-to-br from-[#062A67] to-[#041d48] text-white rounded-2xl shadow-sm p-4 border border-[#062A67] flex flex-col justify-between space-y-2.5">
          <div className="flex items-center justify-between border-b border-white/15 pb-2">
            <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
              <FileText className="w-4 h-4 text-bc-teal-400" />
              <span className="text-xs font-bold text-bc-teal-300">
                🇪🇬 الرد بالعربي (للمكالمة)
              </span>
              <span className="text-[10px] font-mono bg-white/10 px-1 rounded text-slate-300">
                Alt+C
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleCopyText(result.quickCustomerAnswerAr, 'ar')}
              className={`inline-flex items-center space-x-1 rtl:space-x-reverse px-2.5 py-1 rounded-lg text-xs font-bold transition-all shadow ${
                copiedAr
                  ? 'bg-emerald-500 text-white'
                  : 'bg-bc-teal-500 text-[#062A67] hover:bg-bc-teal-400'
              }`}
            >
              {copiedAr ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAr ? 'تم النسخ!' : 'نسخ الرد'}</span>
            </button>
          </div>

          <p
            className="text-xs sm:text-sm text-slate-100 leading-relaxed bg-black/20 p-3 rounded-xl border border-white/10 text-right dir-rtl font-sans flex-1"
            dir="rtl"
          >
            "{result.quickCustomerAnswerAr}"
          </p>
        </div>

        {/* English Call Script */}
        <div className="bg-gradient-to-br from-[#062A67] to-[#041d48] text-white rounded-2xl shadow-sm p-4 border border-[#062A67] flex flex-col justify-between space-y-2.5">
          <div className="flex items-center justify-between border-b border-white/15 pb-2">
            <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
              <FileText className="w-4 h-4 text-bc-teal-400" />
              <span className="text-xs font-bold text-bc-teal-300">
                🇬🇧 Customer Answer (English)
              </span>
              <span className="text-[10px] font-mono bg-white/10 px-1 rounded text-slate-300">
                Alt+E
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleCopyText(result.quickCustomerAnswerEn, 'en')}
              className={`inline-flex items-center space-x-1 rtl:space-x-reverse px-2.5 py-1 rounded-lg text-xs font-bold transition-all shadow ${
                copiedEn
                  ? 'bg-emerald-500 text-white'
                  : 'bg-bc-teal-500 text-[#062A67] hover:bg-bc-teal-400'
              }`}
            >
              {copiedEn ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedEn ? 'Copied!' : 'Copy Answer'}</span>
            </button>
          </div>

          <p
            className="text-xs sm:text-sm text-slate-100 leading-relaxed bg-black/20 p-3 rounded-xl border border-white/10 text-left dir-ltr font-sans flex-1"
            dir="ltr"
          >
            "{result.quickCustomerAnswerEn}"
          </p>
        </div>
      </div>

      {/* 3.5 CRM CALL SUMMARY ACTION STRIP */}
      <div className="bg-gradient-to-r from-slate-50 via-white to-slate-50 rounded-2xl border border-slate-200/90 shadow-sm p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5 rtl:space-x-reverse min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[#062A67] text-bc-teal-300 flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-2xs">
            📋
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <span className="text-xs font-black text-slate-900">
                {isAr ? 'ملخص المكالمة الجاهز للـ CRM' : 'CRM Call Summary (Salesforce)'}
              </span>
              <span className="text-[10px] font-mono font-bold bg-slate-200/70 text-slate-700 px-1.5 py-0.2 rounded">
                Alt+S
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate">
              {isAr
                ? 'ينسخ فوراً: السن، المرحلة، المستوى، موقف PT، السعر وخيارات التقسيط للصقها بالملاحظات'
                : 'One-click copy of student profile, level, fees, PT status, and installments'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleCopyText(generateCrmSummary(), 'crm')}
          className={`flex-shrink-0 inline-flex items-center justify-center space-x-1.5 rtl:space-x-reverse px-4 py-2 rounded-xl text-xs font-black shadow-sm transition-all ${
            copiedCrm
              ? 'bg-emerald-600 text-white'
              : 'bg-[#062A67] hover:bg-[#041d48] text-white hover:scale-[1.02]'
          }`}
        >
          {copiedCrm ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-bc-teal-300" />}
          <span>{copiedCrm ? (isAr ? 'تم نسخ ملخص الـ CRM!' : 'Copied!') : (isAr ? 'نسخ ملخص الـ CRM' : 'Copy CRM Summary')}</span>
        </button>
      </div>

      {/* 4. COMPACT COLLAPSIBLE SECONDARY SECTIONS: Installments & Branches */}
      <div className="space-y-2 pt-1">
        {/* Installments Collapsible */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden text-xs">
          <button
            type="button"
            onClick={() => setShowInstallments(!showInstallments)}
            className="w-full p-3.5 flex items-center justify-between text-slate-700 font-bold hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <CreditCard className="w-4 h-4 text-[#062A67]" />
              <span className="font-extrabold text-slate-900">
                {isAr ? 'خيارات التقسيط بالفيزا' : 'Credit Card Installment Options'}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  result.installmentEligibility.eligible
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {result.installmentEligibility.eligible
                  ? (isAr ? 'متاح للتقسيط (6 و 12 شهر)' : 'Eligible (6M & 12M)')
                  : (isAr ? 'غير متاح لترم واحد' : 'Not Eligible for 1 Term')}
              </span>
            </div>
            {showInstallments ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {showInstallments && (
            <div className="p-3.5 bg-slate-50 border-t border-slate-200 space-y-3">
              <p className="text-xs font-semibold text-slate-700">
                {isAr
                  ? result.installmentEligibility.eligible
                    ? '✓ متاح التقسيط ببطاقة الائتمان البنكية عند حجز ترمين أو أكثر:'
                    : 'التقسيط غير متاح لترم واحد فقط. الحد الأدنى للتأهل هو حجز ترمين فأكثر.'
                  : result.installmentEligibility.reason}
              </p>

              {result.installmentEligibility.options.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {result.installmentEligibility.options.map((opt, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-black text-slate-900 block">
                          {opt.tenureMonths} {isAr ? 'شهور' : 'Months'}
                        </span>
                        <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 mt-0.5 inline-block">
                          {isAr ? `مصاريف إدارية: ${opt.adminPercent}%` : `Admin fee: ${opt.adminPercent}%`}
                        </span>
                      </div>
                      <div className="text-right rtl:text-left">
                        <strong className="text-sm sm:text-base font-black text-[#062A67] block">
                          ~{opt.monthlyPayment?.toLocaleString()} {isAr ? 'ج.م/شهر' : 'EGP/mo'}
                        </strong>
                        <span className="text-[10px] text-slate-400 block">
                          {isAr ? `إجمالي: ${opt.totalWithAdmin?.toLocaleString()} ج.م` : `Total: ${opt.totalWithAdmin?.toLocaleString()} EGP`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-[10px] text-slate-400 italic">
                {isAr
                  ? 'ملاحظة: الحسابات تقريبية وترجع للآلة الحاسبة البنكية الرسمية والشروط الخاصة بكل بنك مصدر للبطاقة.'
                  : result.installmentEligibility.notes}
              </p>
            </div>
          )}
        </div>

        {/* Branch Info Collapsible */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden text-xs">
          <button
            type="button"
            onClick={() => setShowBranch(!showBranch)}
            className="w-full p-3 flex items-center justify-between text-slate-700 font-bold hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Building className="w-4 h-4 text-bc-teal-600" />
              <span>{isAr ? 'بيانات الفرع ومواعيد العمل' : 'Branch & Center Information'}</span>
            </div>
            {showBranch ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {showBranch && (
            <div className="p-3 bg-slate-50 border-t border-slate-200 space-y-1.5 text-slate-700">
              {result.branchInfo ? (
                <>
                  <div className="font-bold text-slate-900">{isAr ? result.branchInfo.nameAr : result.branchInfo.name}</div>
                  <div><strong>{isAr ? 'العنوان:' : 'Address:'}</strong> {isAr ? result.branchInfo.addressAr : result.branchInfo.address}</div>
                  <div><strong>{isAr ? 'المواعيد:' : 'Hours:'}</strong> {isAr ? result.branchInfo.workingHoursAr : result.branchInfo.workingHours}</div>
                  <div><strong>{isAr ? 'الأيام:' : 'Days:'}</strong> {isAr ? result.branchInfo.workingDaysAr : result.branchInfo.workingDays}</div>
                </>
              ) : (
                <div className="text-slate-500 flex items-center space-x-1.5 rtl:space-x-reverse">
                  <Info className="w-4 h-4 text-slate-400" />
                  <span>{isAr ? 'اختر الفرع من الخيارات لرؤية مواعيده وعنوانه' : 'Select a branch to view address and hours'}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
