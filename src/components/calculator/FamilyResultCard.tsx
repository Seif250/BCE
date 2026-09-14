import React, { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Users,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useToast } from '../ui/ToastContext';

export interface CalculatedSiblingInfo {
  id: string;
  name: string;
  dob: string;
  ageYears: number;
  ageMonths: number;
  ageGroupDisplay: string;
  category: string;
  baseTermFee: number;
  termsCount: number;
  isEldest: boolean;
  sharedTermsWithOlder: number;
  nonSharedTerms: number;
  bundleDiscountPercent: number;
  bundleDiscountAmount: number;
  siblingDiscountAmount: number;
  totalDiscountAmount: number;
  rawBaseTotal: number;
  finalChildPrice: number;
  placementTestFee: number;
  placementTestRequired: boolean;
  level: string;
}

export interface FamilyResultCardProps {
  childrenData: CalculatedSiblingInfo[];
  onUpdateChildTerms: (id: string, terms: number) => void;
  onUpdateChildLevel?: (id: string, level: string) => void;
}

export const FamilyResultCard: React.FC<FamilyResultCardProps> = ({
  childrenData,
  onUpdateChildTerms,
}) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const { showToast } = useToast();

  const [copiedAr, setCopiedAr] = useState(false);
  const [copiedEn, setCopiedEn] = useState(false);
  const [copiedCrm, setCopiedCrm] = useState(false);
  const [showInstallments, setShowInstallments] = useState(true);

  // Totals for all children
  const totalBase = childrenData.reduce((acc, c) => acc + c.rawBaseTotal, 0);
  const totalBundleDiscount = childrenData.reduce((acc, c) => acc + c.bundleDiscountAmount, 0);
  const totalSiblingDiscount = childrenData.reduce((acc, c) => acc + c.siblingDiscountAmount, 0);
  const totalDiscount = totalBundleDiscount + totalSiblingDiscount;
  const totalFinal = childrenData.reduce((acc, c) => acc + c.finalChildPrice, 0);

  // Installment calculations: eligible if any child has >= 2 terms
  const maxTerms = Math.max(...childrenData.map((c) => c.termsCount));
  const isInstallmentEligible = maxTerms >= 2;
  const inst6Total = Math.round(totalFinal * 1.09);
  const inst6Monthly = Math.round(inst6Total / 6);
  const inst12Total = Math.round(totalFinal * 1.15);
  const inst12Monthly = Math.round(inst12Total / 12);

  // Copy handler with Toast
  const handleCopyText = async (text: string, type: 'ar' | 'en' | 'crm') => {
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
      showToast(isAr ? '✓ تم نسخ رد العرض للعميل (بالعربي)' : '✓ Copied Arabic family answer');
      setTimeout(() => setCopiedAr(false), 2000);
    } else if (type === 'en') {
      setCopiedEn(true);
      showToast(isAr ? '✓ تم نسخ رد العرض (بالإنجليزي)' : '✓ Copied English family answer');
      setTimeout(() => setCopiedEn(false), 2000);
    } else {
      setCopiedCrm(true);
      showToast('✓ Copied Family CRM Summary (English)');
      setTimeout(() => setCopiedCrm(false), 2000);
    }
  };

  // Arabic and English Sales Pitch to Parent
  const familyAnswerAr = `إجمالي الحجز للأسرة (${childrenData.length} أطفال): ${totalFinal.toLocaleString()} جنيه مصري بدلاً من ${totalBase.toLocaleString()} جنيه (وفرتم ${totalDiscount.toLocaleString()} جنيه بفضل خصومات الحزم وخصم الإخوة 10% على الترمات المشتركة للطفل الأصغر).` +
    (isInstallmentEligible ? ` ومتاح تقسيط المبلغ بالكامل بالفيزا بقسط شهري تقريبي ~${inst6Monthly.toLocaleString()} ج على 6 شهور أو ~${inst12Monthly.toLocaleString()} ج على 12 شهر.` : '');

  const familyAnswerEn = `Family total for ${childrenData.length} children: ${totalFinal.toLocaleString()} EGP instead of ${totalBase.toLocaleString()} EGP (Total savings: ${totalDiscount.toLocaleString()} EGP from bundle and 10% sibling discount on shared terms).` +
    (isInstallmentEligible ? ` Credit card installment is approx ~${inst6Monthly.toLocaleString()} EGP/mo (6M) or ~${inst12Monthly.toLocaleString()} EGP/mo (12M).` : '');

  // Generate Family CRM Summary (ALWAYS IN ENGLISH as requested)
  const generateFamilyCrm = () => {
    const lines = childrenData.map((c) => {
      const role = c.isEldest ? 'Eldest Child (Full/Bundle Rate)' : `Younger Sibling (Shared terms with older: ${c.sharedTermsWithOlder})`;
      const discounts = [];
      if (c.bundleDiscountPercent > 0) {
        discounts.push(`${c.bundleDiscountPercent}% Bundle (-${c.bundleDiscountAmount.toLocaleString()} EGP)`);
      }
      if (c.siblingDiscountAmount > 0) {
        discounts.push(`10% Sibling on ${c.sharedTermsWithOlder} shared term(s) (-${c.siblingDiscountAmount.toLocaleString()} EGP)`);
      }
      const discountText = discounts.length > 0 ? discounts.join(' + ') : 'None';
      const ptText = c.placementTestRequired
        ? `Passed / Completed (Assigned Level: ${c.level} | Standard PT fee: ${c.placementTestFee} EGP if new test needed)`
        : 'Not Required (Early Years 4-5)';

      return `• ${c.name} (${role}):
  - Age: ${c.ageYears}y (${c.ageGroupDisplay}) | Level: ${c.level}
  - Booking: ${c.termsCount} Term(s) | Base Fee: ${c.rawBaseTotal.toLocaleString()} EGP
  - Discounts Applied: ${discountText}
  - Net Student Fee: ${c.finalChildPrice.toLocaleString()} EGP
  - Placement Test: ${ptText}`;
    });

    const instLines = isInstallmentEligible
      ? `• Installments (Credit Card):
  - 6 Months: ~${inst6Monthly.toLocaleString()} EGP/mo (Total: ${inst6Total.toLocaleString()} EGP with 9% admin fee)
  - 12 Months: ~${inst12Monthly.toLocaleString()} EGP/mo (Total: ${inst12Total.toLocaleString()} EGP with 15% admin fee)`
      : '• Installments: Available for 2 or more terms.';

    return `=== BRITISH COUNCIL FAMILY / MULTI-CHILD CALL SUMMARY (CRM) ===
• Total Children: ${childrenData.length}
${lines.join('\n')}
------------------------------------------------------------
• Combined Family Total: ${totalFinal.toLocaleString()} EGP (Total Saved: ${totalDiscount.toLocaleString()} EGP)
${instLines}
• Note: 10% Sibling discount applies strictly to shared/overlapping terms with older siblings.
============================================================`;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 's' || e.key === 'S' || e.key === 'س')) {
        e.preventDefault();
        handleCopyText(generateFamilyCrm(), 'crm');
      } else if (e.altKey && (e.key === 'c' || e.key === 'C' || e.key === 'ؤ')) {
        e.preventDefault();
        handleCopyText(isAr ? familyAnswerAr : familyAnswerEn, isAr ? 'ar' : 'en');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [childrenData, isAr, familyAnswerAr, familyAnswerEn]);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* 1. FAMILY HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#062A67] to-[#041d48] text-white rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-10 h-10 rounded-xl bg-bc-teal-400 text-[#062A67] flex items-center justify-center font-black flex-shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black">
                {isAr ? `حساب حزمة الأسرة (${childrenData.length} أطفال)` : `Family Sibling Calculation (${childrenData.length} Children)`}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-400 text-[#062A67]">
                ✓ {isAr ? 'خصم الأخ الأصغر 10% مطبق على الترمات المشتركة' : '10% Sibling Discount on Shared Terms'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {isAr
                ? 'يُطبق خصم الأخوة (10%) تلقائياً على كل طفل أصغر سناً في حدود عدد الترمات المشتركة مع إخوته الأكبر'
                : '10% sibling discount applies to younger children on terms overlapping with older siblings.'}
            </p>
          </div>
        </div>

        {/* Global CRM Copy Button */}
        <button
          type="button"
          onClick={() => handleCopyText(generateFamilyCrm(), 'crm')}
          className="inline-flex items-center justify-center space-x-1.5 rtl:space-x-reverse px-3.5 py-2 rounded-xl text-xs font-black bg-bc-teal-400 hover:bg-bc-teal-300 text-[#062A67] transition-all shadow-sm flex-shrink-0"
          title="Copy English Family CRM Summary (Alt+S)"
        >
          {copiedCrm ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copiedCrm ? '✓ Copied CRM' : '📋 نسخ ملخص الـ CRM (Alt+S)'}</span>
        </button>
      </div>

      {/* 2. SIDE-BY-SIDE CHILDREN BREAKDOWN CARDS */}
      <div className={`grid grid-cols-1 ${childrenData.length === 2 ? 'sm:grid-cols-2' : childrenData.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4'} gap-3`}>
        {childrenData.map((child) => (
          <div
            key={child.id}
            className={`p-4 rounded-2xl border transition-all ${
              child.isEldest
                ? 'bg-slate-50/80 border-slate-300 shadow-2xs'
                : 'bg-emerald-50/40 border-emerald-300 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 mb-2.5">
              <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <span>{child.name}</span>
                <span className="text-[10px] text-slate-500 font-medium">({child.ageYears} سنة)</span>
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  child.isEldest
                    ? 'bg-slate-200 text-slate-800'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}
              >
                {child.isEldest
                  ? (isAr ? 'الطفل الأكبر' : 'Eldest')
                  : (isAr ? 'خصم أخوة 10%' : '10% Sibling')}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>{isAr ? 'المرحلة:' : 'Stage:'}</span>
                <span className="font-bold text-slate-900 truncate max-w-[140px]" title={child.ageGroupDisplay}>
                  {child.ageGroupDisplay}
                </span>
              </div>

              {/* Interactive Terms Selector for this child */}
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  {isAr ? 'عدد الترمات المحجوزة:' : 'Booked Terms:'}
                </span>
                <div className="grid grid-cols-4 gap-1">
                  {[1, 2, 3, 4].map((tNum) => (
                    <button
                      key={tNum}
                      type="button"
                      onClick={() => onUpdateChildTerms(child.id, tNum)}
                      className={`py-1 text-[11px] font-black rounded-lg border transition-all ${
                        child.termsCount === tNum
                          ? 'bg-[#062A67] text-white border-[#062A67] shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {tNum} {isAr ? 'ترم' : 'T'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pricing breakdown for this child */}
              <div className="pt-2 border-t border-slate-200/60 space-y-1 text-[11px]">
                <div className="flex justify-between text-slate-500">
                  <span>{isAr ? 'السعر الأساسي:' : 'Base Fee:'}</span>
                  <span>{child.rawBaseTotal.toLocaleString()} {isAr ? 'ج' : 'EGP'}</span>
                </div>

                {child.bundleDiscountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>{isAr ? `خصم الحزمة (${child.bundleDiscountPercent}%):` : `Bundle (${child.bundleDiscountPercent}%):`}</span>
                    <span>-{child.bundleDiscountAmount.toLocaleString()} {isAr ? 'ج' : 'EGP'}</span>
                  </div>
                )}

                {!child.isEldest && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>
                      {isAr
                        ? `خصم الأخوات (10% على ${child.sharedTermsWithOlder} ترم مشترك):`
                        : `Sibling (10% on ${child.sharedTermsWithOlder} shared T):`}
                    </span>
                    <span>-{child.siblingDiscountAmount.toLocaleString()} {isAr ? 'ج' : 'EGP'}</span>
                  </div>
                )}

                <div className="flex justify-between font-black text-xs text-slate-900 pt-1 border-t border-slate-200">
                  <span>{isAr ? 'الصافي للطالب:' : 'Student Net:'}</span>
                  <span className="text-[#062A67] font-black">{child.finalChildPrice.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}</span>
                </div>
              </div>

              {/* Placement Test Status */}
              <div className="pt-1.5 flex items-center justify-between text-[10px] text-slate-500">
                <span>{isAr ? 'امتحان المستوى:' : 'Placement Test:'}</span>
                <span className="font-bold text-emerald-700">
                  {child.placementTestRequired
                    ? (isAr ? 'مجتاز (محدد بالمكالمة)' : 'Passed (Confirmed)')
                    : (isAr ? 'معفي (مرحلة مبكرة)' : 'Exempt (EY)')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. UNIFIED FAMILY TOTAL & SAVINGS SUMMARY */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              {isAr ? 'الإجمالي المطلوب لكامل الأسرة' : 'Combined Family Total'}
            </span>
            <div className="flex items-baseline space-x-2 rtl:space-x-reverse mt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-[#062A67]">
                {totalFinal.toLocaleString()} {isAr ? 'جنيه مصري' : 'EGP'}
              </span>
              {totalDiscount > 0 && (
                <span className="text-xs text-slate-400 line-through">
                  {totalBase.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {totalDiscount > 0 && (
              <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <span className="block text-[10px] text-emerald-600 font-normal">
                  {isAr ? 'إجمالي التوفير العائلي' : 'Total Family Savings'}
                </span>
                <span>-{totalDiscount.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}</span>
              </div>
            )}

            {/* Copy Arabic Sales Pitch */}
            <button
              type="button"
              onClick={() => handleCopyText(familyAnswerAr, 'ar')}
              className={`inline-flex items-center space-x-1 rtl:space-x-reverse px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                copiedAr
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
              title="Copy Arabic answer to parent"
            >
              {copiedAr ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copiedAr ? 'تم النسخ' : (isAr ? 'نسخ عرض السعر للعميل' : 'Copy Pitch')}</span>
            </button>
          </div>
        </div>

        {/* 4. FAMILY INSTALLMENTS (6 & 12 Months) */}
        {isInstallmentEligible ? (
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs font-extrabold text-slate-900">
                <CreditCard className="w-4 h-4 text-bc-teal-600" />
                <span>{isAr ? 'خيارات تقسيط إجمالي الأسرة بالفيزا' : 'Family Credit Card Installment Options'}</span>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                {isAr ? 'متاح للأسرة' : 'Eligible'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 6 Months Option */}
              <div className="p-3 rounded-xl bg-white border border-bc-teal-200 shadow-2xs flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900">
                      {isAr ? 'تقسيط 6 شهور' : '6-Month Plan'}
                    </span>
                    <span className="text-[10px] font-bold bg-bc-teal-50 text-bc-teal-800 px-1.5 py-0.2 rounded border border-bc-teal-200">
                      9%
                    </span>
                  </div>
                  <div className="text-sm font-black text-bc-teal-800 mt-0.5">
                    ~{inst6Monthly.toLocaleString()} {isAr ? 'ج.م/شهر' : 'EGP/mo'}
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {isAr ? `إجمالي مع المصاريف: ${inst6Total.toLocaleString()} ج.م` : `Total: ${inst6Total.toLocaleString()} EGP`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleCopyText(
                      isAr
                        ? `تقسيط الأسرة على 6 شهور بالفيزا: بقسط شهري تقريبي ~${inst6Monthly.toLocaleString()} ج.م (إجمالي المبلغ مع 9% مصاريف إدارية: ${inst6Total.toLocaleString()} ج.م).`
                        : `Family 6-month installment: ~${inst6Monthly.toLocaleString()} EGP/mo (Total with 9% admin fee: ${inst6Total.toLocaleString()} EGP).`,
                      'ar'
                    )
                  }
                  className="px-2.5 py-1.5 rounded-lg bg-bc-teal-50 hover:bg-bc-teal-100 text-bc-teal-900 border border-bc-teal-200 text-xs font-bold transition-all"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 12 Months Option */}
              <div className="p-3 rounded-xl bg-white border border-indigo-200 shadow-2xs flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900">
                      {isAr ? 'تقسيط 12 شهر' : '12-Month Plan'}
                    </span>
                    <span className="text-[10px] font-bold bg-indigo-50 text-indigo-800 px-1.5 py-0.2 rounded border border-indigo-200">
                      15%
                    </span>
                  </div>
                  <div className="text-sm font-black text-indigo-900 mt-0.5">
                    ~{inst12Monthly.toLocaleString()} {isAr ? 'ج.م/شهر' : 'EGP/mo'}
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {isAr ? `إجمالي مع المصاريف: ${inst12Total.toLocaleString()} ج.م` : `Total: ${inst12Total.toLocaleString()} EGP`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleCopyText(
                      isAr
                        ? `تقسيط الأسرة على 12 شهر بالفيزا: بقسط شهري تقريبي ~${inst12Monthly.toLocaleString()} ج.م (إجمالي المبلغ مع 15% مصاريف إدارية: ${inst12Total.toLocaleString()} ج.م).`
                        : `Family 12-month installment: ~${inst12Monthly.toLocaleString()} EGP/mo (Total with 15% admin fee: ${inst12Total.toLocaleString()} EGP).`,
                      'ar'
                    )
                  }
                  className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-bold transition-all"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span>
              {isAr
                ? 'التقسيط متاح عند حجز ترمين أو أكثر لأي من الأطفال.'
                : 'Installments available when booking 2 or more terms.'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
