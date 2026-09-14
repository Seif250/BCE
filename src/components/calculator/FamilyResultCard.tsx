import React, { useState } from 'react';
import {
  Copy,
  Check,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
  Users,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { CalculationResult } from '../../data/types';
import { useLanguage } from '../../i18n/LanguageContext';
import { useToast } from '../ui/ToastContext';

interface FamilyResultCardProps {
  result1: CalculationResult;
  result2: CalculationResult;
  selectedTerms: number;
  onSelectTerms: (terms: number) => void;
  youngerIndex: 1 | 2;
}

export const FamilyResultCard: React.FC<FamilyResultCardProps> = ({
  result1,
  result2,
  selectedTerms,
  onSelectTerms,
  youngerIndex,
}) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const { showToast } = useToast();

  const [copiedAr, setCopiedAr] = useState(false);
  const [copiedEn, setCopiedEn] = useState(false);
  const [copiedCrm, setCopiedCrm] = useState(false);
  const [showInstallments, setShowInstallments] = useState(true);

  // Totals for the selected terms
  const totalBase = (result1.basePrice || 0) + (result2.basePrice || 0);
  const totalDiscount = (result1.discountAmount || 0) + (result2.discountAmount || 0);
  const totalFinal = (result1.finalPrice || 0) + (result2.finalPrice || 0);

  // Multi-term family cards (1, 2, 3, 4 terms)
  const baseTermFee1 = result1.calculatedAge <= 5 ? 6400 : 5800;
  const baseTermFee2 = result2.calculatedAge <= 5 ? 6400 : 5800;

  const familyTermCards = [
    { terms: 1, bundleDiscount: 0, label: isAr ? 'ترم واحد' : '1 Term', popular: false },
    { terms: 2, bundleDiscount: 0.05, label: isAr ? 'ترمين (خصم 5%)' : '2 Terms (5% Off)', popular: false },
    { terms: 3, bundleDiscount: 0.10, label: isAr ? '3 ترمات (خصم 10%)' : '3 Terms (10% Off)', popular: true },
    { terms: 4, bundleDiscount: 0.15, label: isAr ? '4 ترمات (خصم 15%)' : '4 Terms (15% Off)', popular: false },
  ].map((item) => {
    // Child 1 raw total
    const raw1 = baseTermFee1 * item.terms;
    const rate1 = item.bundleDiscount + (youngerIndex === 1 ? 0.10 : 0);
    const final1 = raw1 - Math.round(raw1 * rate1);

    // Child 2 raw total
    const raw2 = baseTermFee2 * item.terms;
    const rate2 = item.bundleDiscount + (youngerIndex === 2 ? 0.10 : 0);
    const final2 = raw2 - Math.round(raw2 * rate2);

    const totalRaw = raw1 + raw2;
    const finalAmt = final1 + final2;
    const discountAmt = totalRaw - finalAmt;
    const totalPercentage = Math.round((discountAmt / totalRaw) * 100);

    return {
      ...item,
      totalRaw,
      finalAmt,
      discountAmt,
      totalPercentage,
    };
  });

  // Installment calculations for the family total
  const isInstallmentEligible = selectedTerms >= 2;
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
      showToast(isAr ? '✓ تم نسخ الرد العائلي (بالعربي)' : '✓ Copied Arabic family answer');
      setTimeout(() => setCopiedAr(false), 2000);
    } else if (type === 'en') {
      setCopiedEn(true);
      showToast(isAr ? '✓ تم نسخ الرد العائلي (بالإنجليزي)' : '✓ Copied English family answer');
      setTimeout(() => setCopiedEn(false), 2000);
    } else {
      setCopiedCrm(true);
      showToast(isAr ? '✓ تم نسخ ملخص الأسرة للـ CRM' : '✓ Copied Family CRM Summary');
      setTimeout(() => setCopiedCrm(false), 2000);
    }
  };

  // Generate Family Pitches
  const familyAnswerAr = `إجمالي الحجز للطفلين (${result1.calculatedAge} سنوات + الطفل الأصغر ${result2.calculatedAge} سنوات بعد خصم الإخوة 10%): ${totalFinal.toLocaleString()} جنيه مصري لـ (${selectedTerms} ترم). الطالب الأول ${result1.placementTest.required ? `يحتاج امتحان تحديد مستوى (${result1.placementTest.fee} ج)` : 'معفي من امتحان تحديد المستوى'}، والطفل الثاني ${result2.placementTest.required ? `يحتاج امتحان تحديد مستوى (${result2.placementTest.fee} ج)` : 'معفي من تحديد المستوى'}.${isInstallmentEligible ? ` ومتاح تقسيط المبلغ بالفيزا بقسط شهري تقريبي ~${inst6Monthly.toLocaleString()} ج على 6 شهور أو ~${inst12Monthly.toLocaleString()} ج على 12 شهر.` : ''}`;

  const familyAnswerEn = `Family bundle for both children (${result1.calculatedAge}y and younger sibling ${result2.calculatedAge}y with 10% sibling discount): total fee is ${totalFinal.toLocaleString()} EGP for (${selectedTerms} term/s). Child 1: ${result1.placementTest.required ? 'PT required' : 'PT exempt'}; Child 2: ${result2.placementTest.required ? 'PT required' : 'PT exempt'}.${isInstallmentEligible ? ` Credit card installment is approx ~${inst6Monthly.toLocaleString()} EGP/mo (6 months) or ~${inst12Monthly.toLocaleString()} EGP/mo (12 months).` : ''}`;

  const generateFamilyCrm = () => {
    return `[ملخص مبيعات المجلس الثقافي البريطاني - حزمة عائلية]
- الطفل 1: ${result1.calculatedAge} سنة (${result1.ageGroup.value}) | المستوى: ${result1.academicLevel.value} | PT: ${result1.placementTest.required ? 'مطلوب 200 ج' : 'معفي'} | الرسوم: ${result1.finalPrice?.toLocaleString()} ج
- الطفل 2: ${result2.calculatedAge} سنة (${result2.ageGroup.value}) [الطفل الأصغر - خصم 10%] | المستوى: ${result2.academicLevel.value} | PT: ${result2.placementTest.required ? 'مطلوب 200 ج' : 'معفي'} | الرسوم: ${result2.finalPrice?.toLocaleString()} ج
- إجمالي الأسرة المطلوبة: ${totalFinal.toLocaleString()} ج.م (وفر العميل: ${totalDiscount.toLocaleString()} ج.م)
- البرنامج: Winter Block (${selectedTerms} ترم)
${isInstallmentEligible ? `- التقسيط: 6 شهور (~${inst6Monthly.toLocaleString()} ج/ش) أو 12 شهر (~${inst12Monthly.toLocaleString()} ج/ش)` : '- غير متاح تقسيط لترم واحد'}`;
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* 1. FAMILY HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#062A67] to-[#041d48] text-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-10 h-10 rounded-xl bg-bc-teal-400 text-[#062A67] flex items-center justify-center font-black">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <h2 className="text-lg sm:text-xl font-black">
                {isAr ? 'حساب حزمة الأسرة المشتركة (طفلين)' : 'Family Sibling Calculation (2 Children)'}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-400 text-[#062A67]">
                ✓ {isAr ? 'خصم الأخ الأصغر 10% مطبق تلقائياً' : '10% Sibling Discount Applied'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {isAr
                ? 'تم تطبيق خصم الأخوة على الطفل الأصغر سناً وحساب الإجمالي المشترك'
                : 'Sibling discount automatically assigned to younger child.'}
            </p>
          </div>
        </div>

        <div className="text-right rtl:text-left">
          <span className="text-[10px] text-slate-300 block">
            {isAr ? 'إجمالي الأسرة المطلوب' : 'Total Family Fee'}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-white">
            {totalFinal.toLocaleString()}{' '}
            <span className="text-xs font-bold text-bc-teal-300">{isAr ? 'ج.م' : 'EGP'}</span>
          </span>
        </div>
      </div>

      {/* 2. SIDE-BY-SIDE CHILDREN PROFILES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Child 1 Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <span className="w-6 h-6 rounded-lg bg-bc-teal-100 text-[#062A67] flex items-center justify-center font-black text-xs">
                1
              </span>
              <span className="text-sm font-black text-slate-900">
                {isAr ? 'الطفل الأول' : 'Child 1'}
              </span>
              <span className="text-xs text-slate-500 font-bold">
                ({result1.calculatedAge} {isAr ? 'سنوات' : 'years'})
              </span>
            </div>
            {youngerIndex === 1 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                👶 {isAr ? 'الأصغر (خصم 10%)' : 'Younger (10% Off)'}
              </span>
            )}
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">{isAr ? 'المرحلة:' : 'Stage:'}</span>
              <strong className="text-slate-900">{result1.ageGroup.value}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{isAr ? 'المستوى المقترح:' : 'Level:'}</span>
              <strong className="text-slate-900">{result1.academicLevel.value}</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">{isAr ? 'موقف امتحان PT:' : 'Placement Test:'}</span>
              {result1.placementTest.required ? (
                <span className="text-amber-800 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                  مطلوب ({result1.placementTest.fee} ج)
                </span>
              ) : (
                <span className="text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  ✓ معفي من الامتحان
                </span>
              )}
            </div>
            <div className="flex justify-between font-black text-sm pt-2 border-t border-slate-100">
              <span>{isAr ? 'المبلغ المطلوب:' : 'Fee:'}</span>
              <span className="text-[#062A67]">
                {result1.finalPrice?.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
              </span>
            </div>
          </div>
        </div>

        {/* Child 2 Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-900 flex items-center justify-center font-black text-xs">
                2
              </span>
              <span className="text-sm font-black text-slate-900">
                {isAr ? 'الطفل الثاني (الأخ)' : 'Child 2 (Sibling)'}
              </span>
              <span className="text-xs text-slate-500 font-bold">
                ({result2.calculatedAge} {isAr ? 'سنوات' : 'years'})
              </span>
            </div>
            {youngerIndex === 2 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                👶 {isAr ? 'الأصغر (خصم 10%)' : 'Younger (10% Off)'}
              </span>
            )}
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">{isAr ? 'المرحلة:' : 'Stage:'}</span>
              <strong className="text-slate-900">{result2.ageGroup.value}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{isAr ? 'المستوى المقترح:' : 'Level:'}</span>
              <strong className="text-slate-900">{result2.academicLevel.value}</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">{isAr ? 'موقف امتحان PT:' : 'Placement Test:'}</span>
              {result2.placementTest.required ? (
                <span className="text-amber-800 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                  مطلوب ({result2.placementTest.fee} ج)
                </span>
              ) : (
                <span className="text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  ✓ معفي من الامتحان
                </span>
              )}
            </div>
            <div className="flex justify-between font-black text-sm pt-2 border-t border-slate-100">
              <span>{isAr ? 'المبلغ المطلوب:' : 'Fee:'}</span>
              <span className="text-[#062A67]">
                {result2.finalPrice?.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MULTI-TERM FAMILY PRICING GRID */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-800">
            {isAr ? 'باقات وترمات الأسرة المشتركة' : 'Family Combined Multi-Term Packages'}
          </span>
          <span className="text-xs font-bold text-emerald-700">
            {isAr ? `إجمالي التوفير: ${totalDiscount.toLocaleString()} ج.م` : `Total Savings: ${totalDiscount.toLocaleString()} EGP`}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {familyTermCards.map((card) => {
            const isSelected = selectedTerms === card.terms;
            return (
              <button
                key={card.terms}
                type="button"
                onClick={() => onSelectTerms(card.terms)}
                className={`p-3.5 rounded-xl border text-center relative transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#062A67] to-[#041d48] text-white border-[#062A67] shadow-md ring-2 ring-bc-teal-400 scale-[1.02]'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  {card.popular && (
                    <span
                      className={`inline-block mb-1 text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                    >
                      {isAr ? 'الأكثر طلباً' : 'Best Value'}
                    </span>
                  )}
                  <span
                    className={`text-xs font-bold block ${
                      isSelected ? 'text-bc-teal-300' : 'text-slate-600'
                    }`}
                  >
                    {card.label}
                  </span>
                  <div className="my-2">
                    <span
                      className={`text-xl sm:text-2xl font-black block tracking-tight ${
                        isSelected ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {card.finalAmt.toLocaleString()}
                      <span className="text-xs font-bold mr-1 rtl:ml-1 rtl:mr-0 opacity-80">
                        {isAr ? 'ج.م' : 'EGP'}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="space-y-0.5 pt-1.5 border-t border-slate-200/50">
                  <span
                    className={`text-xs font-bold block ${
                      isSelected ? 'text-emerald-300' : 'text-emerald-600'
                    }`}
                  >
                    {isAr
                      ? `وفر ${card.discountAmt.toLocaleString()} ج.م (${card.totalPercentage}%)`
                      : `Save ${card.discountAmt.toLocaleString()} EGP (${card.totalPercentage}%)`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. DUAL FAMILY CALL PITCH CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Arabic Family Script */}
        <div className="bg-gradient-to-br from-[#062A67] to-[#041d48] text-white rounded-2xl shadow-sm p-4 border border-[#062A67] flex flex-col justify-between space-y-2.5">
          <div className="flex items-center justify-between border-b border-white/15 pb-2">
            <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
              <FileText className="w-4 h-4 text-bc-teal-400" />
              <span className="text-xs font-bold text-bc-teal-300">
                🇪🇬 الرد العائلي للعميل (بالعربي)
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleCopyText(familyAnswerAr, 'ar')}
              className={`inline-flex items-center space-x-1 rtl:space-x-reverse px-2.5 py-1 rounded-lg text-xs font-bold transition-all shadow ${
                copiedAr
                  ? 'bg-emerald-500 text-white'
                  : 'bg-bc-teal-500 text-[#062A67] hover:bg-bc-teal-400'
              }`}
            >
              {copiedAr ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAr ? 'تم النسخ!' : 'نسخ رد الأسرة'}</span>
            </button>
          </div>

          <p
            className="text-xs sm:text-sm text-slate-100 leading-relaxed bg-black/20 p-3 rounded-xl border border-white/10 text-right dir-rtl font-sans flex-1"
            dir="rtl"
          >
            "{familyAnswerAr}"
          </p>
        </div>

        {/* English Family Script */}
        <div className="bg-gradient-to-br from-[#062A67] to-[#041d48] text-white rounded-2xl shadow-sm p-4 border border-[#062A67] flex flex-col justify-between space-y-2.5">
          <div className="flex items-center justify-between border-b border-white/15 pb-2">
            <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
              <FileText className="w-4 h-4 text-bc-teal-400" />
              <span className="text-xs font-bold text-bc-teal-300">
                🇬🇧 Family Answer (English)
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleCopyText(familyAnswerEn, 'en')}
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
            "{familyAnswerEn}"
          </p>
        </div>
      </div>

      {/* 5. FAMILY CRM SUMMARY */}
      <div className="bg-gradient-to-r from-slate-50 via-white to-slate-50 rounded-2xl border border-slate-200/90 shadow-sm p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5 rtl:space-x-reverse min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[#062A67] text-bc-teal-300 flex items-center justify-center font-bold text-sm flex-shrink-0">
            📋
          </div>
          <div className="min-w-0">
            <span className="text-xs font-black text-slate-900 block">
              {isAr ? 'ملخص المكالمة العائلية للـ CRM' : 'Family CRM Call Summary'}
            </span>
            <p className="text-[11px] text-slate-500 truncate">
              {isAr ? 'ينسخ فوراً بيانات الطفلين والإجمالي معاً للصقها في Salesforce' : 'Copies both children profiles & total for Salesforce'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleCopyText(generateFamilyCrm(), 'crm')}
          className={`flex-shrink-0 inline-flex items-center justify-center space-x-1.5 rtl:space-x-reverse px-4 py-2 rounded-xl text-xs font-black shadow-sm transition-all ${
            copiedCrm
              ? 'bg-emerald-600 text-white'
              : 'bg-[#062A67] hover:bg-[#041d48] text-white hover:scale-[1.02]'
          }`}
        >
          {copiedCrm ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-bc-teal-300" />}
          <span>{copiedCrm ? (isAr ? 'تم نسخ ملخص الـ CRM!' : 'Copied!') : (isAr ? 'نسخ ملخص الـ CRM' : 'Copy Family CRM')}</span>
        </button>
      </div>

      {/* 6. FAMILY INSTALLMENT OPTIONS (6M 9% & 12M 15%) */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden text-xs">
        <button
          type="button"
          onClick={() => setShowInstallments(!showInstallments)}
          className="w-full p-3.5 flex items-center justify-between text-slate-700 font-bold hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <CreditCard className="w-4 h-4 text-[#062A67]" />
            <span className="font-extrabold text-slate-900">
              {isAr ? 'خيارات تقسيط إجمالي الأسرة بالفيزا' : 'Family Credit Card Installments'}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                isInstallmentEligible
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {isInstallmentEligible
                ? (isAr ? 'متاح للتقسيط (6 و 12 شهر)' : 'Eligible (6M & 12M)')
                : (isAr ? 'غير متاح لترم واحد' : 'Not Eligible for 1 Term')}
            </span>
          </div>
          {showInstallments ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {showInstallments && isInstallmentEligible && (
          <div className="p-3.5 bg-slate-50 border-t border-slate-200 space-y-3">
            <p className="text-xs font-semibold text-slate-700">
              {isAr
                ? `✓ متاح تقسيط إجمالي حجز الأسرة (${totalFinal.toLocaleString()} ج.م) ببطاقة الائتمان البنكية:`
                : `Installment for family total (${totalFinal.toLocaleString()} EGP):`}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* 6 Months */}
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-slate-900 block">
                    {isAr ? '6 شهور' : '6 Months'}
                  </span>
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 mt-0.5 inline-block">
                    {isAr ? 'مصاريف إدارية: 9%' : 'Admin fee: 9%'}
                  </span>
                </div>
                <div className="text-right rtl:text-left">
                  <strong className="text-sm sm:text-base font-black text-[#062A67] block">
                    ~{inst6Monthly.toLocaleString()} {isAr ? 'ج.م/شهر' : 'EGP/mo'}
                  </strong>
                  <span className="text-[10px] text-slate-400 block">
                    {isAr ? `إجمالي: ${inst6Total.toLocaleString()} ج.م` : `Total: ${inst6Total.toLocaleString()} EGP`}
                  </span>
                </div>
              </div>

              {/* 12 Months */}
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-slate-900 block">
                    {isAr ? '12 شهر' : '12 Months'}
                  </span>
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 mt-0.5 inline-block">
                    {isAr ? 'مصاريف إدارية: 15%' : 'Admin fee: 15%'}
                  </span>
                </div>
                <div className="text-right rtl:text-left">
                  <strong className="text-sm sm:text-base font-black text-[#062A67] block">
                    ~{inst12Monthly.toLocaleString()} {isAr ? 'ج.م/شهر' : 'EGP/mo'}
                  </strong>
                  <span className="text-[10px] text-slate-400 block">
                    {isAr ? `إجمالي: ${inst12Total.toLocaleString()} ج.م` : `Total: ${inst12Total.toLocaleString()} EGP`}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 italic">
              {isAr
                ? 'ملاحظة: الحسابات تقريبية وترجع للآلة الحاسبة البنكية الرسمية والشروط الخاصة بكل بنك مصدر للبطاقة.'
                : 'Note: Calculations are approximate and subject to official bank calculator.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
