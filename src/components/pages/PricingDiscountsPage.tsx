import React, { useState } from 'react';
import {
  Percent,
  CreditCard,
  CheckCircle2,
  Calendar,
  Sparkles,
  Info,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { WINTER_PRICING, IELTS_FOR_TEENS_INFO } from '../../data/winterCourses';
import { ADULT_COURSES } from '../../data/adultCourses';
import { useLanguage } from '../../i18n/LanguageContext';
import { PAGE_TRANSLATIONS } from '../../i18n/pageTranslations';

export const PricingDiscountsPage: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const pt = PAGE_TRANSLATIONS[language].pricing;
  const common = PAGE_TRANSLATIONS[language].common;

  const [categoryFilter, setCategoryFilter] = useState<'all' | 'yl' | 'adult'>('all');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-3">
        <div className="flex items-center space-x-2 rtl:space-x-reverse text-bc-navy-900">
          <Percent className="w-7 h-7 text-bc-teal-600" />
          <h1 className="text-2xl font-black tracking-tight">{pt.title}</h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {pt.subtitle}
        </p>
      </div>

      {/* QUICK HIGHLIGHTS / TAKE (المفيد في الأسعار) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/40 shadow-sm">
          <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block mb-0.5">
            {pt.quickHighlights.winterTerm}
          </span>
          <span className="text-xl font-black text-slate-900 block">
            {pt.quickHighlights.winterTermFee}
          </span>
          <span className="text-[10px] text-slate-600 block mt-0.5">
            {language === 'ar' ? 'للترم الواحد (9 أسابيع)' : 'Per term (9 sessions)'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 shadow-sm">
          <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block mb-0.5">
            {pt.quickHighlights.earlyYearsTerm}
          </span>
          <span className="text-xl font-black text-emerald-800 block">
            {pt.quickHighlights.earlyYearsTermFee}
          </span>
          <span className="text-[10px] text-emerald-700 block mt-0.5">
            {language === 'ar' ? 'بدون امتحان تحديد مستوى' : 'No PT required'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/40 shadow-sm">
          <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block mb-0.5">
            {pt.quickHighlights.ptFee}
          </span>
          <span className="text-xl font-black text-amber-800 block">
            {pt.quickHighlights.ptFeeValue}
          </span>
          <span className="text-[10px] text-amber-700 block mt-0.5">
            {language === 'ar' ? 'صلاحية النتيجة 6 شهور' : 'Valid 6 months'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-purple-200 bg-purple-50/40 shadow-sm">
          <span className="text-[11px] font-bold text-purple-900 uppercase tracking-wider block mb-0.5">
            {pt.quickHighlights.adult40}
          </span>
          <span className="text-xl font-black text-purple-900 block">
            {pt.quickHighlights.adult40Fee}
          </span>
          <span className="text-[10px] text-slate-600 block mt-0.5">
            {language === 'ar' ? 'متاح تقسيطها على 6 و 12 شهر' : 'Eligible for 6M/12M installments'}
          </span>
        </div>
      </div>

      {/* 1. MASTER PRICING TABLE WITH CATEGORY FILTER */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">{pt.tableTitle}</h2>
            <span className="text-[11px] font-mono text-slate-400">{common.sourceExcel}</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                categoryFilter === 'all'
                  ? 'bg-bc-navy-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {common.all}
            </button>
            <button
              onClick={() => setCategoryFilter('yl')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                categoryFilter === 'yl'
                  ? 'bg-bc-navy-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {language === 'ar' ? 'الأطفال والشباب (YL)' : 'Young Learners'}
            </button>
            <button
              onClick={() => setCategoryFilter('adult')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                categoryFilter === 'adult'
                  ? 'bg-bc-navy-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {language === 'ar' ? 'كورسات الكبار (Adults)' : 'Adult Courses'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                <th className={`p-3 ${isRTL ? 'text-right' : 'text-left'}`}>{pt.colProgram}</th>
                <th className={`p-3 ${isRTL ? 'text-right' : 'text-left'}`}>{pt.colCourse}</th>
                <th className={`p-3 ${isRTL ? 'text-right' : 'text-left'}`}>{pt.colPackage}</th>
                <th className={`p-3 ${isRTL ? 'text-left' : 'text-right'}`}>{pt.colFee}</th>
                <th className="p-3 text-center">{pt.colPT}</th>
                <th className={`p-3 ${isRTL ? 'text-right' : 'text-left'}`}>{language === 'ar' ? 'ملاحظات' : 'Notes'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Early Years */}
              {(categoryFilter === 'all' || categoryFilter === 'yl') && (
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-emerald-800">
                    {language === 'ar' ? 'الحضانة والسن الصغير (4–5 سنين)' : 'Early Years (Ages 4–5)'}
                  </td>
                  <td className="p-3 font-semibold text-slate-900">Ducks & Owls</td>
                  <td className="p-3 text-slate-600">
                    {language === 'ar' ? 'للترم الواحد (9 حصص)' : 'Per Term (9 sessions)'}
                  </td>
                  <td className={`p-3 ${isRTL ? 'text-left' : 'text-right'} font-black text-slate-900 text-sm`}>
                    {WINTER_PRICING.earlyYearsTermFee.toLocaleString()} {language === 'ar' ? 'جنيه' : 'EGP'}
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {language === 'ar' ? 'بدون امتحان' : 'No PT'}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500">
                    {language === 'ar' ? '4 ترمات في السنة، الحصة ساعتين' : '4 terms available; 2h per session'}
                  </td>
                </tr>
              )}

              {/* Young Learner Primary & Secondary */}
              {(categoryFilter === 'all' || categoryFilter === 'yl') && (
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-sky-800">
                    {language === 'ar' ? 'الابتدائي والإعدادي والثانوي (6–17)' : 'Young Learner (Ages 6–17)'}
                  </td>
                  <td className="p-3 font-semibold text-slate-900">Primary & Secondary Plus</td>
                  <td className="p-3 text-slate-600">
                    {language === 'ar' ? 'للترم الواحد (9 حصص)' : 'Per Term (9 sessions)'}
                  </td>
                  <td className={`p-3 ${isRTL ? 'text-left' : 'text-right'} font-black text-slate-900 text-sm`}>
                    {WINTER_PRICING.primaryAndSecondaryTermFee.toLocaleString()} {language === 'ar' ? 'جنيه' : 'EGP'}
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      200 {language === 'ar' ? 'ج' : 'EGP'}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500">
                    {language === 'ar' ? 'خميس/جمعة/سبت؛ يطبق خصم الحزم والأخوات' : 'Thu/Fri/Sat; Bundle & Sibling discounts apply'}
                  </td>
                </tr>
              )}

              {/* IELTS for Teens */}
              {(categoryFilter === 'all' || categoryFilter === 'yl') && (
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-indigo-800">
                    {language === 'ar' ? 'آيلتس الشباب (15–17 سنة)' : 'IELTS for Teens (Ages 15–17)'}
                  </td>
                  <td className="p-3 font-semibold text-slate-900">Upper Secondary (B1 Min)</td>
                  <td className="p-3 text-slate-600">
                    {language === 'ar' ? 'للكورس (18 ساعة)' : 'Per Term (18 hrs)'}
                  </td>
                  <td className={`p-3 ${isRTL ? 'text-left' : 'text-right'} font-black text-slate-900 text-sm`}>
                    {IELTS_FOR_TEENS_INFO.winterFee.toLocaleString()} {language === 'ar' ? 'جنيه' : 'EGP'}
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      200 {language === 'ar' ? 'ج' : 'EGP'}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500">
                    {language === 'ar' ? 'يحضر مرة واحدة فقط' : 'Can only be attended once'}
                  </td>
                </tr>
              )}

              {/* Adult Beginner */}
              {(categoryFilter === 'all' || categoryFilter === 'adult') &&
                ADULT_COURSES[0].packages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-bc-navy-800">
                      {language === 'ar' ? 'كبار — مبتدئين (Beginner)' : 'Adult — Beginner'}
                    </td>
                    <td className="p-3 text-slate-900">Beginner A–E</td>
                    <td className="p-3 text-slate-600">{pkg.label}</td>
                    <td className={`p-3 ${isRTL ? 'text-left' : 'text-right'} font-bold text-slate-900`}>
                      {pkg.price.toLocaleString()} {language === 'ar' ? 'جنيه' : 'EGP'}
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        200 {language === 'ar' ? 'ج' : 'EGP'}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">{pkg.durationOrLevels}</td>
                  </tr>
                ))}

              {/* Adult BCE */}
              {(categoryFilter === 'all' || categoryFilter === 'adult') &&
                ADULT_COURSES[1].packages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-bc-navy-800">
                      {language === 'ar' ? 'كبار — إنجليزي عام (BCE)' : 'Adult — BCE'}
                    </td>
                    <td className="p-3 text-slate-900">CEFR A1–C1</td>
                    <td className="p-3 text-slate-600">{pkg.label}</td>
                    <td className={`p-3 ${isRTL ? 'text-left' : 'text-right'} font-bold text-slate-900`}>
                      {pkg.price.toLocaleString()} {language === 'ar' ? 'جنيه' : 'EGP'}
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        200 {language === 'ar' ? 'ج' : 'EGP'}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">{pkg.durationOrLevels}</td>
                  </tr>
                ))}

              {/* Adult IELTS Coach */}
              {(categoryFilter === 'all' || categoryFilter === 'adult') &&
                ADULT_COURSES[2].packages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-bc-navy-800">
                      {language === 'ar' ? 'كبار — تحضير آيلتس (IELTS Coach)' : 'Adult — IELTS Coach'}
                    </td>
                    <td className="p-3 text-slate-900">B1 Intermediate Entry</td>
                    <td className="p-3 text-slate-600">{pkg.label}</td>
                    <td className={`p-3 ${isRTL ? 'text-left' : 'text-right'} font-bold text-slate-900`}>
                      {pkg.price.toLocaleString()} {language === 'ar' ? 'جنيه' : 'EGP'}
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        200 {language === 'ar' ? 'ج' : 'EGP'}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">{pkg.durationOrLevels}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. MASTER DISCOUNTS RULES */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-extrabold text-slate-900">{pt.discountRulesTitle}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
          <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
            <strong className="text-emerald-950 font-bold block">1. {language === 'ar' ? 'خصم الحزم (Winter Bundle):' : 'Winter Bundle:'}</strong>
            <p className="leading-relaxed">{pt.rule1}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1">
            <strong className="text-blue-950 font-bold block">2. {language === 'ar' ? 'خصم الأخوات (Sibling):' : 'Sibling Discount:'}</strong>
            <p className="leading-relaxed">{pt.rule2}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200 space-y-1">
            <strong className="text-purple-950 font-bold block">3. {language === 'ar' ? 'تجديد الكبار (Re-registration):' : 'Adult Renewal:'}</strong>
            <p className="leading-relaxed">{pt.rule3}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1">
            <strong className="text-amber-950 font-bold block">4. {language === 'ar' ? 'معسكرات الصيف (Summer Camps):' : 'Summer Camps:'}</strong>
            <p className="leading-relaxed">{pt.rule4}</p>
          </div>

          <div className="md:col-span-2 p-3.5 rounded-xl bg-rose-50/60 border border-rose-200 space-y-1">
            <strong className="text-rose-950 font-bold block">⚠️ {language === 'ar' ? 'سياسة منع ازدواج الخصومات (Non-Stacking):' : 'Non-Stacking Policy:'}</strong>
            <p className="leading-relaxed text-rose-900">{pt.rule5}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
