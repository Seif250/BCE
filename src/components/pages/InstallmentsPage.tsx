import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Calculator,
  Info,
  Copy,
  Check,
  Zap,
} from 'lucide-react';
import { ADULT_INSTALLMENT_RULES, YL_INSTALLMENT_RULES } from '../../data/installments';
import { useLanguage } from '../../i18n/LanguageContext';
import { PAGE_TRANSLATIONS } from '../../i18n/pageTranslations';
import { useToast } from '../ui/ToastContext';

export const InstallmentsPage: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const pt = PAGE_TRANSLATIONS[language].installments;
  const common = PAGE_TRANSLATIONS[language].common;
  const { showToast } = useToast();

  const [selectedPreset, setSelectedPreset] = useState<string>('adult-40');
  const [customAmount, setCustomAmount] = useState<string>('10000');
  const [copiedPlan, setCopiedPlan] = useState<string | null>(null);
  const [lastCalculatedPrice, setLastCalculatedPrice] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('bce_last_price');
    if (saved) {
      const p = Number(saved);
      if (!isNaN(p) && p > 0) {
        setLastCalculatedPrice(p);
      }
    }
  }, []);

  const presets = [
    {
      id: 'adult-40',
      label: language === 'ar' ? 'باقة كبار 40 ساعة (10,000 ج)' : 'Adult 40 Credits (10,000 EGP)',
      amount: 10000,
      type: 'Adult',
    },
    {
      id: 'adult-60',
      label: language === 'ar' ? 'باقة كبار 60 ساعة (13,300 ج)' : 'Adult 60 Credits (13,300 EGP)',
      amount: 13300,
      type: 'Adult',
    },
    {
      id: 'yl-2',
      label: language === 'ar' ? 'صغار: ترمين شتوي (11,020 ج)' : 'YL Winter 2 Terms (11,020 EGP)',
      amount: 11020,
      type: 'YL',
    },
    {
      id: 'yl-3',
      label: language === 'ar' ? 'صغار: 3 ترمات شتوي (15,660 ج)' : 'YL Winter 3 Terms (15,660 EGP)',
      amount: 15660,
      type: 'YL',
    },
    {
      id: 'yl-4',
      label: language === 'ar' ? 'صغار: 4 ترمات شتوي (19,720 ج)' : 'YL Winter 4 Terms (19,720 EGP)',
      amount: 19720,
      type: 'YL',
    },
  ];

  const handleSelectPreset = (id: string, amount: number) => {
    setSelectedPreset(id);
    setCustomAmount(String(amount));
  };

  const amountNumber = Number(customAmount) || 0;

  // 6 Months calculations (9% admin fee)
  const admin6 = Math.round(amountNumber * 0.09);
  const total6 = amountNumber + admin6;
  const monthly6 = Math.round(total6 / 6);

  // 12 Months calculations (15% admin fee)
  const admin12 = Math.round(amountNumber * 0.15);
  const total12 = amountNumber + admin12;
  const monthly12 = Math.round(total12 / 12);

  const handleCopyQuote = (months: number, total: number, monthly: number) => {
    const text =
      language === 'ar'
        ? `المبلغ الإجمالي للكورس: ${amountNumber.toLocaleString()} جنيه. تقسيط ${months} شهور بالفيزا بقسط شهري تقريبي ~${monthly.toLocaleString()} جنيه (إجمالي المبلغ مع المصاريف الإدارية: ${total.toLocaleString()} جنيه).`
        : `Course fee: ${amountNumber.toLocaleString()} EGP. ${months}-month credit card installment is approx ~${monthly.toLocaleString()} EGP/month (Total with admin fee: ${total.toLocaleString()} EGP).`;
    navigator.clipboard.writeText(text);
    setCopiedPlan(`plan-${months}`);
    showToast(language === 'ar' ? `تم نسخ عرض تقسيط ${months} شهور` : `Copied ${months}-month quote`);
    setTimeout(() => setCopiedPlan(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-3">
        <div className="flex items-center space-x-2 rtl:space-x-reverse text-bc-navy-900">
          <CreditCard className="w-7 h-7 text-bc-navy-800" />
          <h1 className="text-2xl font-black tracking-tight">{pt.title}</h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {pt.subtitle}
        </p>
      </div>

      {/* QUICK HIGHLIGHTS / TAKE (المفيد في ثواني للتقسيط) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-bc-teal-200 bg-bc-teal-50/40 shadow-sm">
          <span className="text-[11px] font-bold text-bc-navy-900 uppercase tracking-wider block mb-0.5">
            {pt.quickHighlights.months6Title}
          </span>
          <span className="text-xl font-black text-bc-teal-800 block">
            {pt.quickHighlights.months6Value}
          </span>
          <span className="text-[10px] text-slate-600 block mt-0.5">
            {pt.quickHighlights.months6Desc}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-bc-navy-200 bg-bc-navy-50/30 shadow-xs">
          <span className="text-[11px] font-bold text-bc-navy-900 uppercase tracking-wider block mb-0.5">
            {pt.quickHighlights.months12Title}
          </span>
          <span className="text-xl font-black text-bc-navy-900 block">
            {pt.quickHighlights.months12Value}
          </span>
          <span className="text-[10px] text-slate-600 block mt-0.5">
            {pt.quickHighlights.months12Desc}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-bc-teal-200 bg-bc-teal-50/30 shadow-xs">
          <span className="text-[11px] font-bold text-bc-teal-900 uppercase tracking-wider block mb-0.5">
            {pt.quickHighlights.adultEligibleTitle}
          </span>
          <span className="text-xl font-black text-bc-teal-800 block">
            {pt.quickHighlights.adultEligibleValue}
          </span>
          <span className="text-[10px] text-slate-600 block mt-0.5">
            {pt.quickHighlights.adultEligibleDesc}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/40 shadow-sm">
          <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block mb-0.5">
            {pt.quickHighlights.ylEligibleTitle}
          </span>
          <span className="text-xl font-black text-amber-800 block">
            {pt.quickHighlights.ylEligibleValue}
          </span>
          <span className="text-[10px] text-slate-600 block mt-0.5">
            {pt.quickHighlights.ylEligibleDesc}
          </span>
        </div>
      </div>

      {/* Rules Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Adult Rules */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-extrabold text-bc-navy-900 uppercase tracking-wider">
              {language === 'ar' ? 'شروط تقسيط كورسات الكبار' : 'Adult Installment Policy'}
            </h2>
            <span className="text-[10px] font-bold bg-bc-navy-50 text-bc-navy-800 px-2 py-0.5 rounded border border-bc-navy-200">
              {language === 'ar' ? 'باقات 40 و 60 فقط' : '40 & 60 Credits'}
            </span>
          </div>

          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start space-x-2 rtl:space-x-reverse">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>{language === 'ar' ? 'طريقة السداد:' : 'Payment Method:'}</strong>{' '}
                {language === 'ar'
                  ? 'يتم الدفع بالكامل عبر بطاقة ائتمان بنكية (Credit Card).'
                  : 'Student must pay the full amount using a credit card.'}
              </span>
            </li>
            <li className="flex items-start space-x-2 rtl:space-x-reverse">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>{language === 'ar' ? 'فترات التقسيط:' : 'Tenures Available:'}</strong>{' '}
                {language === 'ar' ? 'متاح على 6 شهور أو 12 شهر.' : 'Available over 6 or 12 months.'}
              </span>
            </li>
            <li className="flex items-start space-x-2 rtl:space-x-reverse">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>{language === 'ar' ? 'المصاريف الإدارية:' : 'Administrative Fee:'}</strong>{' '}
                <strong>9%</strong> {language === 'ar' ? 'لـ 6 شهور، و' : 'for 6M, and'}{' '}
                <strong>15%</strong> {language === 'ar' ? 'لـ 12 شهر.' : 'for 12M.'}
              </span>
            </li>
            <li className="flex items-start space-x-2 rtl:space-x-reverse">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>{language === 'ar' ? 'التسجيل الجديد والتجديد:' : 'Registration Types:'}</strong>{' '}
                {language === 'ar'
                  ? 'يطبق على التسجيل الجديد وإعادة التسجيل بنفس الشروط.'
                  : 'Applicable for both new registration and re-registration.'}
              </span>
            </li>
          </ul>
        </div>

        {/* Young Learner Rules */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-extrabold text-bc-navy-900 uppercase tracking-wider">
              {language === 'ar' ? 'شروط تقسيط الأطفال والشباب' : 'Young Learner Installment Policy'}
            </h2>
            <span className="text-[10px] font-bold bg-sky-50 text-sky-800 px-2 py-0.5 rounded border border-sky-200">
              {language === 'ar' ? 'ترمين فأكثر بالشتوي' : 'Winter Block 2+ Terms'}
            </span>
          </div>

          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start space-x-2 rtl:space-x-reverse">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span className="font-bold text-slate-900">
                {language === 'ar' ? 'ممنوع نهائياً تقسيط ترم واحد فقط.' : 'No installment for 1 single term booking.'}
              </span>
            </li>
            <li className="flex items-start space-x-2 rtl:space-x-reverse">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                {language === 'ar'
                  ? 'يجب أن يسجل الطالب في ترمين على الأقل للتأهل لنظام التقسيط.'
                  : 'Bookings must start from 2 terms or more to qualify for installments.'}
              </span>
            </li>
            <li className="flex items-start space-x-2 rtl:space-x-reverse">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                {language === 'ar'
                  ? 'يمكن دمج التقسيط مع خصم حزم الترمات وخصم الأخوات.'
                  : 'Can be combined with Winter Bundle and Sibling discounts.'}
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* INTERACTIVE INSTALLMENT SIMULATOR */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-5">
        <div className="flex items-center space-x-2 rtl:space-x-reverse border-b border-slate-100 pb-3">
          <Calculator className="w-5 h-5 text-bc-teal-600" />
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              {pt.simulatorTitle}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {pt.simulatorDesc}
            </p>
          </div>
        </div>

        {/* Quick Presets */}
        <div>
          {lastCalculatedPrice && (
            <div className="mb-3.5 p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/5 border border-emerald-300 flex flex-wrap items-center justify-between gap-2 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
                  <Zap className="w-4 h-4" />
                </span>
                <div>
                  <div className="text-xs font-black text-emerald-950">
                    {language === 'ar' ? 'سعر آخر طالب تم حسابه في الحاسبة:' : 'Last Calculated Student Price:'}
                  </div>
                  <div className="text-xs text-emerald-700 font-bold">
                    {lastCalculatedPrice.toLocaleString()} {language === 'ar' ? 'جنيه مصري' : 'EGP'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedPreset('last-calc');
                  setCustomAmount(String(lastCalculatedPrice));
                  showToast(
                    language === 'ar'
                      ? `تم استيراد سعر الطالب: ${lastCalculatedPrice.toLocaleString()} ج.م`
                      : `Auto-filled student price: ${lastCalculatedPrice.toLocaleString()} EGP`
                  );
                }}
                className={`px-3 py-1.5 text-xs font-black rounded-lg border transition-all inline-flex items-center gap-1.5 ${
                  selectedPreset === 'last-calc'
                    ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm ring-2 ring-emerald-500/30'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700 shadow-sm'
                }`}
              >
                <Zap className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                <span>{language === 'ar' ? 'حساب التقسيط لهذا المبلغ الآن' : 'Calculate Installments for This Price'}</span>
              </button>
            </div>
          )}

          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            {language === 'ar' ? 'اختر باقة سريعة أثناء المكالمة:' : 'Select Course Package Preset:'}
          </label>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectPreset(p.id, p.amount)}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg border transition-all ${
                  selectedPreset === p.id
                    ? 'bg-bc-navy-800 text-white border-bc-navy-900 shadow-sm ring-2 ring-bc-navy-800/20'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Amount Input */}
        <div className="max-w-xs">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {pt.customAmountLabel}
          </label>
          <input
            type="number"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setSelectedPreset('');
            }}
            className="w-full px-3.5 py-2 text-sm font-bold text-slate-900 rounded-lg border border-slate-300 focus:ring-2 focus:ring-bc-teal-500"
          />
        </div>

        {/* 6 vs 12 Months Comparison Cards with Copy Quote */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* 6 Months Option */}
          <div className="p-5 rounded-xl border border-bc-teal-200 bg-bc-teal-50/40 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-bc-navy-950">{pt.plan6Title}</span>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-bc-teal-100 text-bc-teal-800">
                  9% {language === 'ar' ? 'مصاريف' : 'Admin'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span>{pt.baseAmount}</span>
                  <span className="font-semibold">{amountNumber.toLocaleString()} {language === 'ar' ? 'جنيه' : 'EGP'}</span>
                </div>
                <div className="flex justify-between text-bc-teal-900 font-medium">
                  <span>{pt.adminFee} (9%):</span>
                  <span>+{admin6.toLocaleString()} {language === 'ar' ? 'جنيه' : 'EGP'}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-bc-teal-200/60">
                  <span>{pt.totalWithAdmin}</span>
                  <span>{total6.toLocaleString()} {language === 'ar' ? 'جنيه' : 'EGP'}</span>
                </div>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-bc-teal-300 text-center shadow-sm relative">
                <span className="absolute top-2 right-2 rtl:right-auto rtl:left-2 px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-200">
                  ≈ {language === 'ar' ? 'تقريبي' : 'Approximate'}
                </span>
                <span className="text-[11px] text-slate-500 block mb-0.5">{pt.monthlyPayment}</span>
                <span className="text-2xl font-black text-bc-navy-900 block">
                  ~{monthly6.toLocaleString()} {language === 'ar' ? 'جنيه' : 'EGP'}{' '}
                  <span className="text-xs font-normal text-slate-500">
                    / {language === 'ar' ? 'شهرياً لمدة 6 شهور' : 'mo for 6 mos'}
                  </span>
                </span>
              </div>
            </div>

            <button
              onClick={() => handleCopyQuote(6, total6, monthly6)}
              className="w-full mt-3 py-2 px-3 rounded-lg bg-bc-navy-800 hover:bg-bc-navy-900 text-white text-xs font-bold flex items-center justify-center space-x-1.5 rtl:space-x-reverse transition-all"
            >
              {copiedPlan === 'plan-6' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPlan === 'plan-6' ? common.copied : (language === 'ar' ? 'نسخ عرض الـ 6 شهور للعميل' : 'Copy 6-Month Quote')}</span>
            </button>
          </div>

          {/* 12 Months Option */}
          <div className="p-5 rounded-xl border border-bc-navy-200 bg-bc-navy-50/20 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-bc-navy-950">{pt.plan12Title}</span>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-bc-navy-100 text-bc-navy-900 border border-bc-navy-200">
                  15% {language === 'ar' ? 'مصاريف' : 'Admin'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span>{pt.baseAmount}</span>
                  <span className="font-semibold">{amountNumber.toLocaleString()} {language === 'ar' ? 'جنيه' : 'EGP'}</span>
                </div>
                <div className="flex justify-between text-bc-navy-900 font-medium">
                  <span>{pt.adminFee} (15%):</span>
                  <span>+{admin12.toLocaleString()} {language === 'ar' ? 'جنيه' : 'EGP'}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-bc-navy-200/60">
                  <span>{pt.totalWithAdmin}</span>
                  <span>{total12.toLocaleString()} {language === 'ar' ? 'جنيه' : 'EGP'}</span>
                </div>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-bc-navy-300 text-center shadow-xs relative">
                <span className="absolute top-2 right-2 rtl:right-auto rtl:left-2 px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-200">
                  ≈ {language === 'ar' ? 'تقريبي' : 'Approximate'}
                </span>
                <span className="text-[11px] text-slate-500 block mb-0.5">{pt.monthlyPayment}</span>
                <span className="text-2xl font-black text-bc-navy-900 block">
                  ~{monthly12.toLocaleString()} {language === 'ar' ? 'جنيه' : 'EGP'}{' '}
                  <span className="text-xs font-normal text-slate-500">
                    / {language === 'ar' ? 'شهرياً لمدة 12 شهر' : 'mo for 12 mos'}
                  </span>
                </span>
              </div>
            </div>

            <button
              onClick={() => handleCopyQuote(12, total12, monthly12)}
              className="w-full mt-3 py-2 px-3 rounded-lg bg-bc-navy-800 hover:bg-bc-navy-900 text-white text-xs font-bold flex items-center justify-center space-x-1.5 rtl:space-x-reverse transition-all"
            >
              {copiedPlan === 'plan-12' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPlan === 'plan-12' ? common.copied : (language === 'ar' ? 'نسخ عرض الـ 12 شهر للعميل' : 'Copy 12-Month Quote')}</span>
            </button>
          </div>
        </div>

        {/* Bank Card Note & Official Calculator Rule Disclaimer */}
        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-300 text-xs text-amber-950 flex items-start space-x-2.5 rtl:space-x-reverse">
          <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="block font-bold">
              {language === 'ar'
                ? 'قاعدة أساسية: السعر والقسط النهائي يرجع للـ official calculator والبنك'
                : 'Core Rule: Final installment amount must refer to the official calculator & issuing bank'}
            </strong>
            <p className="leading-relaxed text-amber-900">
              {pt.bankNote}{' '}
              {language === 'ar'
                ? '(الأرقام المعروضة أعلاه تقريبية استرشادية للمساعدة في توجيه العميل أثناء المكالمة).'
                : '(Figures shown above are approximate guidelines to assist during customer calls).'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
