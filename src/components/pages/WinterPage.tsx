import React, { useState } from 'react';
import {
  Snowflake,
  Clock,
  Percent,
  CheckCircle2,
  Calendar,
  Layers,
  Award,
  AlertCircle,
  Sparkles,
  Copy,
  Check,
} from 'lucide-react';
import {
  WINTER_AGE_GROUPS,
  WINTER_ACADEMIC_LEVELS,
  WINTER_PRICING,
  IELTS_FOR_TEENS_INFO,
} from '../../data/winterCourses';
import { useLanguage } from '../../i18n/LanguageContext';
import { PAGE_TRANSLATIONS } from '../../i18n/pageTranslations';

export const WinterPage: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const pt = PAGE_TRANSLATIONS[language].winter;
  const common = PAGE_TRANSLATIONS[language].common;

  const [selectedAgeGroupId, setSelectedAgeGroupId] = useState<string>('all');
  const [copiedAnswer, setCopiedAnswer] = useState(false);

  const filteredLevels =
    selectedAgeGroupId === 'all'
      ? WINTER_ACADEMIC_LEVELS
      : WINTER_ACADEMIC_LEVELS.filter((lvl) => lvl.ageGroupId === selectedAgeGroupId);

  const handleCopyAnswer = () => {
    navigator.clipboard.writeText(pt.quickAnswerCard.content);
    setCopiedAnswer(true);
    setTimeout(() => setCopiedAnswer(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-3">
        <div className="flex items-center space-x-2 rtl:space-x-reverse text-bc-navy-900">
          <Snowflake className="w-7 h-7 text-sky-600" />
          <h1 className="text-2xl font-black tracking-tight">{pt.title}</h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {pt.subtitle}
        </p>
      </div>

      {/* QUICK TAKE / HIGHLIGHTS (المفيد في ثواني للشتوي) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 shadow-sm">
          <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block mb-0.5">
            {pt.quickHighlights.earlyYearsTitle}
          </span>
          <span className="text-xl font-black text-emerald-800 block">
            {pt.quickHighlights.earlyYearsValue}
          </span>
          <span className="text-[10px] text-emerald-700 block mt-0.5">
            {pt.quickHighlights.earlyYearsDesc}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/40 shadow-sm">
          <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block mb-0.5">
            {pt.quickHighlights.primarySecondaryTitle}
          </span>
          <span className="text-xl font-black text-slate-900 block">
            {pt.quickHighlights.primarySecondaryValue}
          </span>
          <span className="text-[10px] text-slate-600 block mt-0.5">
            {pt.quickHighlights.primarySecondaryDesc}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/40 shadow-sm">
          <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block mb-0.5">
            {pt.quickHighlights.bundleDiscountTitle}
          </span>
          <span className="text-xl font-black text-amber-800 block">
            {pt.quickHighlights.bundleDiscountValue}
          </span>
          <span className="text-[10px] text-amber-700 block mt-0.5">
            {pt.quickHighlights.bundleDiscountDesc}
          </span>
        </div>

        <div className="bg-bc-navy-900 text-white p-4 rounded-xl shadow-xs border border-bc-navy-800">
          <span className="text-[11px] font-bold text-bc-teal-300 uppercase tracking-wider block mb-0.5">
            {pt.quickHighlights.ieltsTeensTitle}
          </span>
          <span className="text-xl font-black block">
            {pt.quickHighlights.ieltsTeensValue}
          </span>
          <span className="text-[10px] text-slate-300 block mt-0.5">
            {pt.quickHighlights.ieltsTeensDesc}
          </span>
        </div>
      </div>

      {/* QUICK ANSWER FOR CALLS */}
      <div className="bg-gradient-to-r from-sky-50 to-emerald-50/40 border border-sky-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-bc-navy-900 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span>{pt.quickAnswerCard.title}</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {pt.quickAnswerCard.content}
          </p>
        </div>
        <button
          onClick={handleCopyAnswer}
          className="self-start sm:self-center flex-shrink-0 flex items-center space-x-1.5 rtl:space-x-reverse px-3.5 py-2 rounded-lg bg-bc-navy-800 hover:bg-bc-navy-900 text-white text-xs font-bold shadow transition-all"
        >
          {copiedAnswer ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedAnswer ? common.copied : common.copyAnswer}</span>
        </button>
      </div>

      {/* Structure & Discount Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Winter Structure Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2 rtl:space-x-reverse">
            <Clock className="w-4 h-4 text-sky-600" />
            <span>{pt.termStructureTitle}</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {pt.termStructureDesc}
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[11px] mb-0.5">
                {language === 'ar' ? 'أيام الحصص:' : 'Class Days:'}
              </span>
              <strong className="text-slate-900 font-bold">
                {language === 'ar' ? 'خميس، جمعة، أو سبت' : 'Thu, Fri, or Sat'}
              </strong>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[11px] mb-0.5">
                {language === 'ar' ? 'مدة الحصة:' : 'Session Duration:'}
              </span>
              <strong className="text-slate-900 font-bold">
                {language === 'ar' ? 'ساعتين أسبوعياً (9 أسابيع)' : '2 Hours / week (9 wks)'}
              </strong>
            </div>
          </div>
        </div>

        {/* Discounts Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2 rtl:space-x-reverse">
            <Percent className="w-4 h-4 text-emerald-600" />
            <span>{language === 'ar' ? 'خصومات الترمات والأخوات (Winter Discounts)' : 'Winter Block Discounts'}</span>
          </h3>

          <div className="space-y-2.5">
            <div className="p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200 text-xs">
              <span className="font-bold text-emerald-950 block mb-1.5">
                {language === 'ar' ? '1. خصم حزم الترمات (Bundle Discount):' : '1. Bundle Discounts:'}
              </span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white p-1.5 rounded border border-emerald-200 font-semibold text-slate-800">
                  {language === 'ar' ? 'ترمين:' : '2 Terms:'} <strong className="text-emerald-700 font-black">5%</strong>
                </div>
                <div className="bg-white p-1.5 rounded border border-emerald-200 font-semibold text-slate-800">
                  {language === 'ar' ? '3 ترمات:' : '3 Terms:'} <strong className="text-emerald-700 font-black">10%</strong>
                </div>
                <div className="bg-white p-1.5 rounded border border-emerald-200 font-semibold text-slate-800">
                  {language === 'ar' ? '4 ترمات:' : '4 Terms:'} <strong className="text-emerald-700 font-black">15%</strong>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <span className="font-bold text-slate-900 block mb-0.5">{pt.siblingRuleTitle}</span>
              <p className="text-slate-600 leading-snug">
                {pt.siblingRuleDesc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* IELTS for Teens Dedicated Card */}
      <div className="bg-bc-navy-900 text-white rounded-xl shadow-xs p-5 border border-bc-navy-800">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-bc-navy-700">
          <div>
            <span className="text-xs font-mono font-bold text-bc-teal-300 uppercase tracking-wider">
              {language === 'ar' ? 'كورس اختبارات متخصص للشباب' : 'Specialized Examination Course'}
            </span>
            <h3 className="text-xl font-extrabold text-white mt-0.5">
              {language === 'ar' ? 'كورس IELTS للشباب (من 15 لـ 17 سنة)' : 'IELTS for Teens (Ages 15–17)'}
            </h3>
          </div>
          <div className={`${isRTL ? 'text-left' : 'text-right'}`}>
            <span className="text-xs text-slate-300 block">{language === 'ar' ? 'سعر الكورس' : 'Tuition Fee'}</span>
            <span className="text-2xl font-black text-bc-teal-300">
              {IELTS_FOR_TEENS_INFO.winterFee.toLocaleString()} {language === 'ar' ? 'جنيه' : 'EGP'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
          <div>
            <span className="text-slate-400 block mb-0.5">{language === 'ar' ? 'الفئة المستهدفة:' : 'Eligibility:'}</span>
            <span className="font-bold text-white">{language === 'ar' ? 'المرحلة الثانوية (15–17 سنة)' : 'Upper Secondary (Ages 15–17)'}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">{language === 'ar' ? 'الحد الأدنى للالتحاق:' : 'Entry Level Required:'}</span>
            <span className="font-bold text-bc-teal-300">{language === 'ar' ? 'مستوى متوسط (B1) في تحديد المستوى' : 'Intermediate (B1)'}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">{language === 'ar' ? 'مدة وعدد ساعات الكورس:' : 'Course Duration:'}</span>
            <span className="font-bold text-white">{language === 'ar' ? '18 ساعة في الشتاء / 20 ساعة بالصيف' : '18 Hours in Winter / 20 Hours in Summer'}</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-bc-navy-800 text-xs text-amber-200 flex items-center space-x-2 rtl:space-x-reverse">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-400" />
          <span>{IELTS_FOR_TEENS_INFO.repeatRule}</span>
        </div>
      </div>

      {/* Age Groups & Academic Progression Table with Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              {pt.levelsTableTitle}
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {pt.filterLabel}
            </span>
          </div>

          {/* Age group filter pills */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedAgeGroupId('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedAgeGroupId === 'all'
                  ? 'bg-bc-navy-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {pt.allAges} ({WINTER_ACADEMIC_LEVELS.length})
            </button>
            {WINTER_AGE_GROUPS.map((grp) => {
              const count = WINTER_ACADEMIC_LEVELS.filter((l) => l.ageGroupId === grp.id).length;
              const isSelected = selectedAgeGroupId === grp.id;
              return (
                <button
                  key={grp.id}
                  onClick={() => setSelectedAgeGroupId(grp.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-bc-navy-800 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {grp.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                <th className={`p-3 ${isRTL ? 'text-right' : 'text-left'}`}>{pt.colAgeGroup}</th>
                <th className={`p-3 ${isRTL ? 'text-right' : 'text-left'}`}>{pt.colStream}</th>
                <th className={`p-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {language === 'ar' ? 'المستوى الصيفي المناظر' : 'Summer School Mapping'}
                </th>
                <th className={`p-3 ${isRTL ? 'text-right' : 'text-left'}`}>{pt.colTermsToComplete}</th>
                <th className="p-3 text-center">{pt.colPT}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLevels.map((lvl) => {
                const noPt = lvl.minAge < 6;
                return (
                  <tr key={lvl.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-semibold text-slate-600">{lvl.ageGroupName}</td>
                    <td className="p-3 font-bold text-slate-900">{lvl.name}</td>
                    <td className="p-3">
                      {lvl.summerMapping ? (
                        <span className="font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {lvl.summerMapping}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">
                          {language === 'ar' ? 'غير محدد بالملف' : 'Not specified in source'}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-slate-700">
                      {lvl.termsToComplete || (language === 'ar' ? '3–4 ترمات' : '3–4 terms')}
                    </td>
                    <td className="p-3 text-center">
                      {noPt ? (
                        <span className="inline-block px-2.5 py-1 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {language === 'ar' ? 'بدون امتحان (معفي)' : 'No PT Needed'}
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-1 text-[10px] font-bold rounded bg-amber-100 text-amber-800 border border-amber-200">
                          {language === 'ar' ? 'امتحان 200 جنيه' : '200 EGP PT'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
