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
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { CalculationResult } from '../../data/types';
import { useLanguage } from '../../i18n/LanguageContext';
import { WINTER_PRICING } from '../../data/winterCourses';
import { ADULT_COURSES } from '../../data/adultCourses';

interface ResultCardProps {
  result: CalculationResult;
  selectedTerms?: number;
  onSelectTerms?: (terms: number) => void;
  selectedPackageCredits?: number;
  onSelectPackageCredits?: (credits: number) => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  result,
  selectedTerms = 1,
  onSelectTerms,
  selectedPackageCredits,
  onSelectPackageCredits,
}) => {
  const { t, language, isRTL } = useLanguage();
  const isAr = language === 'ar';

  const [copiedAr, setCopiedAr] = useState(false);
  const [copiedEn, setCopiedEn] = useState(false);
  const [copiedPrice, setCopiedPrice] = useState(false);
  const [showExplain, setShowExplain] = useState(false);
  const [showInstallments, setShowInstallments] = useState(false);
  const [showBranch, setShowBranch] = useState(false);

  const handleCopyText = async (text: string, type: 'ar' | 'en' | 'price') => {
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
      setTimeout(() => setCopiedAr(false), 2000);
    } else if (type === 'en') {
      setCopiedEn(true);
      setTimeout(() => setCopiedEn(false), 2000);
    } else {
      setCopiedPrice(true);
      setTimeout(() => setCopiedPrice(false), 2000);
    }
  };

  // Determine base term price for Winter Block
  const isEarlyYears = result.calculatedAge >= 4 && result.calculatedAge <= 5;
  const isIeltsTeens = result.calculatedAge >= 15 && result.academicLevel.value.includes('IELTS');
  const baseTermFee = isEarlyYears
    ? WINTER_PRICING.earlyYearsTermFee // 6400
    : isIeltsTeens
    ? WINTER_PRICING.ieltsTeensTermFee // 5600
    : WINTER_PRICING.primaryAndSecondaryTermFee; // 5800

  // Multi-term winter packages: [1, 2, 3, 4]
  const winterTermCards = [
    { terms: 1, discount: 0, label: isAr ? 'ترم واحد' : '1 Term', popular: false },
    { terms: 2, discount: 0.05, label: isAr ? 'ترمين (خصم 5%)' : '2 Terms (5% Off)', popular: false },
    { terms: 3, discount: 0.10, label: isAr ? '3 ترمات (خصم 10%)' : '3 Terms (10% Off)', popular: true },
    { terms: 4, discount: 0.15, label: isAr ? '4 ترمات (خصم 15%)' : '4 Terms (15% Off)', popular: false },
  ].map((item) => {
    const rawTotal = baseTermFee * item.terms;
    const discountAmt = Math.round(rawTotal * item.discount);
    const finalAmt = rawTotal - discountAmt;
    return {
      ...item,
      rawTotal,
      discountAmt,
      finalAmt,
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
          <div
            className={`px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 rtl:space-x-reverse text-xs font-bold ${
              result.placementTest.required
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-emerald-50 text-emerald-900 border-emerald-300'
            }`}
          >
            {result.placementTest.required ? (
              <>
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>
                  {isAr ? 'امتحان تحديد مستوى PT مطلوب' : 'Placement Test Required'} (
                  {result.placementTest.fee} {isAr ? 'ج.م' : 'EGP'})
                </span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{isAr ? 'لا يحتاج امتحان تحديد مستوى' : 'Placement Test NOT Required'}</span>
              </>
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
                  className={`p-3 rounded-xl border text-center relative transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-b from-bc-navy-950 to-bc-navy-900 text-white border-bc-navy-900 shadow-md ring-2 ring-bc-teal-400 scale-[1.02]'
                      : 'bg-slate-50/90 hover:bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                  }`}
                >
                  {/* Popular Star Badge */}
                  {card.popular && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full shadow-xs flex items-center space-x-0.5">
                      <Sparkles className="w-2.5 h-2.5 text-slate-950 inline" />
                      <span>{isAr ? '⭐ الأكثر طلباً' : '⭐ Best Value'}</span>
                    </span>
                  )}

                  <span
                    className={`text-xs font-bold block ${
                      isSelected ? 'text-bc-teal-300' : 'text-slate-600'
                    }`}
                  >
                    {card.label}
                  </span>

                  <div className="mt-1">
                    <span
                      className={`text-base sm:text-lg font-black block tracking-tight ${
                        isSelected ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {card.finalAmt.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                    </span>
                  </div>

                  {card.discount > 0 && (
                    <span
                      className={`text-[10px] font-medium block mt-0.5 ${
                        isSelected ? 'text-emerald-300' : 'text-emerald-600'
                      }`}
                    >
                      {isAr ? `وفر ${card.discountAmt.toLocaleString()} ج.م` : `Save ${card.discountAmt.toLocaleString()} EGP`}
                    </span>
                  )}
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
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => onSelectPackageCredits && onSelectPackageCredits(pkg.credits)}
                  className={`p-3 rounded-xl border text-center relative transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-b from-bc-navy-950 to-bc-navy-900 text-white border-bc-navy-900 shadow-md ring-2 ring-bc-teal-400 scale-[1.02]'
                      : 'bg-slate-50/90 hover:bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span
                    className={`text-xs font-bold block ${
                      isSelected ? 'text-bc-teal-300' : 'text-slate-600'
                    }`}
                  >
                    {pkg.credits} {isAr ? 'ساعة / رصيد' : 'Credits'}
                  </span>
                  <div className="mt-1">
                    <span
                      className={`text-base sm:text-lg font-black block tracking-tight ${
                        isSelected ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {pkg.price.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] block mt-0.5 ${
                      isSelected ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {pkg.durationOrLevels}
                  </span>
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
        <div className="bg-gradient-to-br from-bc-navy-950 to-bc-navy-900 text-white rounded-2xl shadow-sm p-4 border border-bc-navy-800 flex flex-col justify-between space-y-2.5">
          <div className="flex items-center justify-between border-b border-bc-navy-800 pb-2">
            <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
              <FileText className="w-4 h-4 text-bc-teal-400" />
              <span className="text-xs font-bold text-bc-teal-300">
                🇪🇬 الرد بالعربي (للمكالمة)
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleCopyText(result.quickCustomerAnswerAr, 'ar')}
              className={`inline-flex items-center space-x-1 rtl:space-x-reverse px-2.5 py-1 rounded-lg text-xs font-bold transition-all shadow ${
                copiedAr
                  ? 'bg-emerald-500 text-white'
                  : 'bg-bc-teal-500 text-bc-navy-950 hover:bg-bc-teal-400'
              }`}
            >
              {copiedAr ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAr ? 'تم النسخ!' : 'نسخ الرد'}</span>
            </button>
          </div>

          <p
            className="text-xs sm:text-sm text-slate-100 leading-relaxed bg-bc-navy-900/80 p-3 rounded-xl border border-bc-navy-800 text-right dir-rtl font-sans flex-1"
            dir="rtl"
          >
            "{result.quickCustomerAnswerAr}"
          </p>

          <span className="text-[10px] text-slate-400 block text-right font-mono">
            {result.sourceSheet}
          </span>
        </div>

        {/* English Call Script */}
        <div className="bg-gradient-to-br from-bc-navy-950 to-bc-navy-900 text-white rounded-2xl shadow-sm p-4 border border-bc-navy-800 flex flex-col justify-between space-y-2.5">
          <div className="flex items-center justify-between border-b border-bc-navy-800 pb-2">
            <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
              <FileText className="w-4 h-4 text-bc-teal-400" />
              <span className="text-xs font-bold text-bc-teal-300">
                🇬🇧 Customer Answer (English)
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleCopyText(result.quickCustomerAnswerEn, 'en')}
              className={`inline-flex items-center space-x-1 rtl:space-x-reverse px-2.5 py-1 rounded-lg text-xs font-bold transition-all shadow ${
                copiedEn
                  ? 'bg-emerald-500 text-white'
                  : 'bg-bc-teal-500 text-bc-navy-950 hover:bg-bc-teal-400'
              }`}
            >
              {copiedEn ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedEn ? 'Copied!' : 'Copy Answer'}</span>
            </button>
          </div>

          <p
            className="text-xs sm:text-sm text-slate-100 leading-relaxed bg-bc-navy-900/80 p-3 rounded-xl border border-bc-navy-800 text-left dir-ltr font-sans flex-1"
            dir="ltr"
          >
            "{result.quickCustomerAnswerEn}"
          </p>

          <span className="text-[10px] text-slate-400 block text-left font-mono">
            Clean pitch format
          </span>
        </div>
      </div>

      {/* 4. COMPACT COLLAPSIBLE SECONDARY SECTIONS: Installments & Branches */}
      <div className="space-y-2 pt-1">
        {/* Installments Collapsible */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden text-xs">
          <button
            type="button"
            onClick={() => setShowInstallments(!showInstallments)}
            className="w-full p-3 flex items-center justify-between text-slate-700 font-bold hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <CreditCard className="w-4 h-4 text-bc-navy-700" />
              <span>{isAr ? 'خيارات التقسيط بالفيزا' : 'Credit Card Installment Options'}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  result.installmentEligibility.eligible
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {result.installmentEligibility.eligible
                  ? (isAr ? 'متاح للتقسيط' : 'Eligible')
                  : (isAr ? 'غير متاح' : 'Not Eligible')}
              </span>
            </div>
            {showInstallments ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {showInstallments && (
            <div className="p-3 bg-slate-50 border-t border-slate-200 space-y-2">
              <p className="text-slate-600">{result.installmentEligibility.reason}</p>
              {result.installmentEligibility.options.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {result.installmentEligibility.options.map((opt, i) => (
                    <div key={i} className="p-2 rounded-lg bg-white border border-slate-200 flex justify-between">
                      <span>{opt.tenureMonths} {isAr ? 'شهور' : 'Months'}</span>
                      <strong className="text-bc-navy-900">~{opt.monthlyPayment?.toLocaleString()} {isAr ? 'ج.م/شهر' : 'EGP/mo'}</strong>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-[10px] text-slate-400 italic">{result.installmentEligibility.notes}</p>
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
