import React, { useState, useMemo } from 'react';
import {
  Sun,
  Calendar,
  Clock,
  Percent,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
  Copy,
  Check,
  Search,
} from 'lucide-react';
import {
  SUMMER_CAMPS,
  SUMMER_PRICING_CONFIG,
  SUMMER_DISCOUNT_RULES,
  SUMMER_OPERATIONAL_NOTES,
} from '../../data/summerCamps';
import { WINTER_ACADEMIC_LEVELS } from '../../data/winterCourses';
import { useLanguage } from '../../i18n/LanguageContext';
import { PAGE_TRANSLATIONS } from '../../i18n/pageTranslations';

export const SummerPage: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const pt = PAGE_TRANSLATIONS[language].summer;
  const common = PAGE_TRANSLATIONS[language].common;

  const [selectedCampIds, setSelectedCampIds] = useState<number[]>([1, 2]);
  const [isStarter, setIsStarter] = useState<boolean>(false);
  const [customCampPrice, setCustomCampPrice] = useState<string>('');
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [mappingSearch, setMappingSearch] = useState<string>('');

  const filteredMapping = useMemo(() => {
    if (!mappingSearch.trim()) return WINTER_ACADEMIC_LEVELS;
    const q = mappingSearch.toLowerCase();
    return WINTER_ACADEMIC_LEVELS.filter(
      (lvl) =>
        lvl.name.toLowerCase().includes(q) ||
        lvl.ageGroupName.toLowerCase().includes(q) ||
        (lvl.summerMapping && lvl.summerMapping.toLowerCase().includes(q))
    );
  }, [mappingSearch]);

  const toggleCamp = (num: number) => {
    if (selectedCampIds.includes(num)) {
      if (selectedCampIds.length > 1) {
        setSelectedCampIds(selectedCampIds.filter((id) => id !== num));
      }
    } else {
      setSelectedCampIds([...selectedCampIds, num].sort());
    }
  };

  const effectivePricePerCamp = customCampPrice
    ? Number(customCampPrice)
    : SUMMER_PRICING_CONFIG.defaultPricePerCamp;

  const campCount = selectedCampIds.length;
  let baseTotal: number | null = null;
  let discountTotal = 0;
  let finalTotal: number | null = null;

  if (effectivePricePerCamp !== null && !isNaN(effectivePricePerCamp)) {
    baseTotal = effectivePricePerCamp * campCount;
    if (campCount === 2) {
      discountTotal = Math.round(effectivePricePerCamp * 0.10);
    } else if (campCount === 3) {
      if (isStarter) {
        discountTotal = Math.round(effectivePricePerCamp * 0.10 * 2);
      } else {
        discountTotal = Math.round(effectivePricePerCamp * 0.10);
      }
    }
    finalTotal = baseTotal - discountTotal;
  }

  const handleCopySummerSummary = () => {
    const text =
      language === 'ar'
        ? `المدرسة الصيفية بالمجلس الثقافي البريطاني (Summer School 2026): 3 معسكرات صيفية، مدة كل معسكر 30 ساعة على مدار أسبوعين (3 ساعات يومياً: ساعتين إنجليزي + ساعة نشاط من الأحد للخميس). مواعيد المعسكرات: 1) من 5 لـ 16 يوليو، 2) من 26 يوليو لـ 6 أغسطس، 3) من 9 لـ 20 أغسطس. وعند حجز معسكرين يستحق العميل خصم 10% على المعسكر الثاني.`
        : `British Council Summer School 2026: 3 camps, 30 hours over 2 weeks (3 hrs/day Sun-Thu). Camp 1: 5-16 Jul, Camp 2: 26 Jul-6 Aug, Camp 3: 9-20 Aug. 10% discount on 2nd camp.`;
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-3">
        <div className="flex items-center space-x-2 rtl:space-x-reverse text-bc-navy-900">
          <Sun className="w-7 h-7 text-amber-500" />
          <h1 className="text-2xl font-black tracking-tight">{pt.title}</h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {pt.subtitle}
        </p>
      </div>

      {/* QUICK HIGHLIGHTS / TAKE (المفيد في ثواني للصيف) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/40 shadow-sm">
          <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block mb-0.5">
            {pt.quickHighlights.campsTitle}
          </span>
          <span className="text-xl font-black text-amber-800 block">
            {pt.quickHighlights.campsValue}
          </span>
          <span className="text-[10px] text-slate-600 block mt-0.5">
            {pt.quickHighlights.campsDesc}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/40 shadow-sm">
          <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block mb-0.5">
            {pt.quickHighlights.datesTitle}
          </span>
          <span className="text-xl font-black text-slate-900 block">
            {pt.quickHighlights.datesValue}
          </span>
          <span className="text-[10px] text-slate-600 block mt-0.5">
            {pt.quickHighlights.datesDesc}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-purple-200 bg-purple-50/40 shadow-sm">
          <span className="text-[11px] font-bold text-purple-900 uppercase tracking-wider block mb-0.5">
            {pt.quickHighlights.repetitionRuleTitle}
          </span>
          <span className="text-xl font-black text-purple-900 block">
            {pt.quickHighlights.repetitionRuleValue}
          </span>
          <span className="text-[10px] text-slate-600 block mt-0.5">
            {pt.quickHighlights.repetitionRuleDesc}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 shadow-sm">
          <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block mb-0.5">
            {pt.quickHighlights.discountTitle}
          </span>
          <span className="text-xl font-black text-emerald-800 block">
            {pt.quickHighlights.discountValue}
          </span>
          <span className="text-[10px] text-emerald-700 block mt-0.5">
            {pt.quickHighlights.discountDesc}
          </span>
        </div>
      </div>

      {/* QUICK SUMMARY CALLOUT */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50/40 border border-amber-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-amber-950 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>{language === 'ar' ? 'ملخص عروض وتواريخ الصيف للعميل:' : 'Summer Camp Summary for Customer:'}</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {language === 'ar'
              ? '3 معسكرات صيفية مكثفة (أسبوعين لكل معسكر، 3 ساعات يومياً أحد-خميس). خصم 10% على المعسكر الثاني عند حجز معسكرين. معسكر 1 ومعسكر 3 نفس المنهج تماماً ما عدا Starters.'
              : '3 intensive camps (2 weeks each, 3h/day Sun-Thu). 10% discount on 2nd camp when booking 2 camps. Camp 1 and 3 share the same curriculum except for Starters.'}
          </p>
        </div>
        <button
          onClick={handleCopySummerSummary}
          className="self-start sm:self-center flex-shrink-0 flex items-center space-x-1.5 rtl:space-x-reverse px-3.5 py-2 rounded-lg bg-bc-navy-800 hover:bg-bc-navy-900 text-white text-xs font-bold shadow transition-all"
        >
          {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedSummary ? common.copied : common.copyAnswer}</span>
        </button>
      </div>

      {/* 3 LARGE CAMP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {SUMMER_CAMPS.map((camp) => {
          const isSelected = selectedCampIds.includes(camp.campNumber);
          const campTitle =
            camp.campNumber === 1 ? pt.camp1 : camp.campNumber === 2 ? pt.camp2 : pt.camp3;

          return (
            <div
              key={camp.campNumber}
              onClick={() => toggleCamp(camp.campNumber)}
              className={`cursor-pointer rounded-2xl border transition-all p-5 space-y-4 relative overflow-hidden ${
                isSelected
                  ? 'bg-amber-50/70 border-amber-400 shadow-md ring-2 ring-amber-400/40'
                  : 'bg-white border-slate-200 hover:border-amber-300 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-200/80 text-amber-950">
                  {language === 'ar' ? `معسكر ${camp.campNumber}` : `Camp ${camp.campNumber}`}
                </span>
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    isSelected ? 'bg-amber-600 text-white' : 'border border-slate-300'
                  }`}
                >
                  {isSelected ? '✓' : ''}
                </span>
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900">{campTitle}</h3>
                <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-amber-900 font-bold text-sm mt-1">
                  <Calendar className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>{camp.displayDates}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>
                    {camp.durationHours} {language === 'ar' ? 'ساعة على مدار' : 'hours over'} {camp.durationWeeks} {language === 'ar' ? 'أسابيع' : 'weeks'}
                  </span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{camp.dailySchedule}</span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{language === 'ar' ? 'أيام الأحد إلى الخميس' : camp.daysOfWeek}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-white/80 border border-amber-200/80 text-[11px] text-amber-950">
                <strong>{language === 'ar' ? 'ملاحظة المنهج:' : 'Content note:'}</strong> {camp.contentNotes}
              </div>
            </div>
          );
        })}
      </div>

      {/* Multi-Camp Interactive Calculator */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2 rtl:space-x-reverse">
              <Percent className="w-4 h-4 text-amber-600" />
              <span>{pt.campCalculatorTitle}</span>
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'ar'
                ? 'اضغط على كروت المعسكرات بالأعلى لمعاينة الخصم الفوري والمبلغ المطلوب:'
                : 'Select multiple camps above to preview discount calculations.'}
            </p>
          </div>

          {/* Configurable camp price input */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <label className="text-xs text-slate-600 font-medium whitespace-nowrap">
              {pt.pricePerCampLabel}
            </label>
            <input
              type="number"
              placeholder={language === 'ar' ? 'غير مسعر بالملف' : 'Source: unlisted'}
              value={customCampPrice}
              onChange={(e) => setCustomCampPrice(e.target.value)}
              className="w-36 px-2.5 py-1.5 text-xs rounded border border-slate-300 focus:ring-1 focus:ring-amber-500 font-medium"
            />
          </div>
        </div>

        {campCount === 3 && (
          <label className="flex items-center space-x-2 rtl:space-x-reverse text-xs font-semibold text-amber-950 p-2.5 bg-amber-50 rounded-lg border border-amber-200 cursor-pointer">
            <input
              type="checkbox"
              checked={isStarter}
              onChange={(e) => setIsStarter(e.target.checked)}
              className="rounded text-amber-600 w-4 h-4"
            />
            <span>{pt.starterCheckboxLabel}</span>
          </label>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center pt-2">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 block mb-1">
              {language === 'ar' ? 'المعسكرات المختارة' : 'Selected Camps'}
            </span>
            <span className="text-lg font-bold text-slate-800">
              {campCount} {language === 'ar' ? 'معسكرات' : 'Camps'}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {selectedCampIds.map((c) => (language === 'ar' ? `معسكر ${c}` : `Camp ${c}`)).join(', ')}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 block mb-1">{pt.basePrice}</span>
            <span className="text-lg font-bold text-slate-900">
              {baseTotal !== null ? `${baseTotal.toLocaleString()} ${language === 'ar' ? 'جنيه' : 'EGP'}` : (language === 'ar' ? 'غير محدد' : 'N/A')}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
            <span className="text-xs text-emerald-800 font-bold block mb-1">{pt.campDiscount}</span>
            <span className="text-lg font-black text-emerald-700">
              {discountTotal > 0
                ? `-${discountTotal.toLocaleString()} ${language === 'ar' ? 'جنيه' : 'EGP'}`
                : '0'}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-bc-navy-900 text-white border border-bc-navy-800">
            <span className="text-xs text-bc-teal-300 font-bold block mb-1">{pt.finalPrice}</span>
            <span className="text-xl font-black text-white">
              {finalTotal !== null ? `${finalTotal.toLocaleString()} ${language === 'ar' ? 'جنيه' : 'EGP'}` : (language === 'ar' ? 'غير محدد' : 'N/A')}
            </span>
          </div>
        </div>
      </div>

      {/* Strict Summer-to-Winter Mapping Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900">{pt.mappingTitle}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{pt.mappingDesc}</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className={`w-3.5 h-3.5 text-slate-400 absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2`} />
            <input
              type="text"
              value={mappingSearch}
              onChange={(e) => setMappingSearch(e.target.value)}
              placeholder={language === 'ar' ? 'بحث في المستويات (مثال: Primary Plus)...' : 'Search mapping (e.g. Primary Plus)...'}
              className={`w-full ${isRTL ? 'pr-8 pl-3' : 'pl-8 pr-3'} py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50/50 shadow-inner`}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                <th className={`p-2.5 ${isRTL ? 'text-right' : 'text-left'}`}>{pt.colWinterLevel}</th>
                <th className={`p-2.5 ${isRTL ? 'text-right' : 'text-left'}`}>{pt.colSummerCourse}</th>
                <th className={`p-2.5 ${isRTL ? 'text-right' : 'text-left'}`}>{pt.colNotes}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMapping.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-6 text-center text-slate-400 text-xs">
                    {language === 'ar' ? 'لا توجد مستويات مطابقة لكلمة البحث.' : 'No matching levels found.'}
                  </td>
                </tr>
              ) : (
                filteredMapping.map((lvl) => (
                  <tr key={lvl.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-2.5 font-bold text-slate-900">
                      {lvl.name} <span className="text-[11px] font-normal text-slate-500">({lvl.ageGroupName})</span>
                    </td>
                    <td className="p-2.5 font-semibold text-amber-900">
                      {lvl.summerMapping ? (
                        <span className="bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 font-bold text-xs">
                          {lvl.summerMapping}
                        </span>
                      ) : (
                        <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200 text-[10px] font-bold">
                          {language === 'ar' ? 'غير محدد بالملف المصدر' : 'Unmapped in source sheet'}
                        </span>
                      )}
                    </td>
                    <td className="p-2.5 text-slate-600 text-[11px]">
                      {lvl.summerMapping
                        ? (language === 'ar' ? 'مطابقة معتمدة مباشرة' : 'Standard mapped summer stream')
                        : (language === 'ar' ? 'يتطلب تأكيد يدوي من المشرف الأكاديمي' : 'Requires confirmation from senior teacher')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
