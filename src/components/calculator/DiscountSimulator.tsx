// src/components/calculator/DiscountSimulator.tsx
import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Users, Tag, Clock, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { RegistrationType, VarioTiming } from '../../data/types';

interface DiscountSimulatorProps {
  terms: number;
  setTerms: (t: number) => void;
  siblingCount: number;
  setSiblingCount: (c: number) => void;
  isYoungestSibling?: boolean;
  setIsYoungestSibling?: (v: boolean) => void;
  registrationType?: RegistrationType;
  setRegistrationType?: (r: RegistrationType) => void;
  isAdult?: boolean;
  varioTiming?: VarioTiming;
  setVarioTiming?: (t: VarioTiming) => void;
  selectedSeason?: 'Winter Block' | 'Summer School';
}

export const DiscountSimulator: React.FC<DiscountSimulatorProps> = ({
  terms,
  setTerms,
  siblingCount,
  setSiblingCount,
  registrationType = 'New',
  setRegistrationType,
  isAdult = false,
  varioTiming = 'none',
  setVarioTiming,
  selectedSeason = 'Winter Block',
}) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const isWinterYL = !isAdult && selectedSeason === 'Winter Block';

  return (
    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Terms selector */}
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1.5 flex items-center space-x-1 rtl:space-x-reverse">
            <Tag className="w-3.5 h-3.5 text-bc-teal-600" />
            <span>{isAr ? 'عدد الترمات المحجوزة (خصم الحزم)' : 'Bundle Discount (Terms)'}</span>
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[1, 2, 3, 4].map((n) => {
              const discountText = n === 1 ? '0%' : n === 2 ? '5%' : n === 3 ? '10%' : '15%';
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setTerms(n)}
                  className={`py-1.5 px-1 text-center rounded-lg border font-bold text-xs transition-all ${
                    terms === n
                      ? 'bg-bc-navy-900 text-white border-bc-navy-900 shadow-2xs ring-1 ring-bc-navy-800'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div>{n} {isAr ? 'ترم' : 'Term'}</div>
                  <div className={`text-[9px] ${terms === n ? 'text-bc-teal-300 font-bold' : 'text-slate-500 font-semibold'}`}>
                    {discountText}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Siblings Count */}
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1.5 flex items-center space-x-1 rtl:space-x-reverse">
            <Users className="w-3.5 h-3.5 text-bc-teal-600" />
            <span>{isAr ? 'عدد الأطفال المسجلين (خصم الأخ الأصغر 10%)' : 'Sibling Discount (10% on youngest)'}</span>
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {[1, 2, 3].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setSiblingCount(c);
                }}
                className={`py-2 px-1 text-center rounded-lg border font-bold text-xs transition-all ${
                  siblingCount === c
                    ? 'bg-bc-navy-900 text-white border-bc-navy-900 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {c === 1
                  ? (isAr ? 'طفل واحد (لا يوجد خصم)' : '1 Child (No discount)')
                  : c === 2
                  ? (isAr ? 'طفلان (خصم للأصغر)' : '2 Children')
                  : (isAr ? '3 أو أكثر (خصم للأصغر)' : '3+ Children')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Vario Section (Winter Block Only) */}
      {isWinterYL && setVarioTiming && (
        <div className="pt-2 border-t border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center space-x-1.5 rtl:space-x-reverse">
              <Clock className="w-3.5 h-3.5 text-bc-teal-600" />
              <span>{isAr ? 'حالة فاريو (Vario - التسجيل بعد بدء الكورس)' : 'Vario Status (Late Registration)'}</span>
            </label>
            <span className="text-[10px] text-slate-500 font-medium">
              {isAr ? 'يخصم عبر SMS • لا يدمج إلا مع الإخوة' : 'SMS amount • Combines with sibling only'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
            {(
              [
                { id: 'none', labelAr: 'غير مطبق', labelEn: 'None' },
                { id: 'before_first_class', labelAr: 'قبل الحصة 1', labelEn: 'Before 1st class' },
                { id: 'after_first_class', labelAr: 'بعد الحصة 1 (مؤهل)', labelEn: 'After 1st class' },
                { id: 'after_second_class', labelAr: 'بعد حصتين (حد أقصى)', labelEn: 'After 2 classes' },
                { id: 'after_more_than_two_classes', labelAr: 'بعد > 2 حصص', labelEn: '>2 classes' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setVarioTiming(opt.id)}
                className={`py-1.5 px-1.5 text-center rounded-lg border font-bold text-[11px] transition-all ${
                  varioTiming === opt.id
                    ? 'bg-bc-navy-900 text-white border-bc-navy-900 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {isAr ? opt.labelAr : opt.labelEn}
              </button>
            ))}
          </div>

          {/* Vario Status Feedback Box */}
          {varioTiming && varioTiming !== 'none' && (
            <div
              className={`p-2.5 rounded-xl border text-[11px] space-y-1 ${
                varioTiming === 'after_first_class' || varioTiming === 'after_second_class'
                  ? 'bg-cyan-50/70 border-cyan-200 text-cyan-950'
                  : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              <div className="flex items-center space-x-1.5 rtl:space-x-reverse font-bold">
                {varioTiming === 'after_first_class' || varioTiming === 'after_second_class' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-700" />
                    <span>
                      {isAr
                        ? 'مؤهل لخصم فاريو — المبلغ يحدد ويخصم عبر رسائل SMS'
                        : 'Vario Eligible — Amount determined and deducted on SMS'}
                    </span>
                  </>
                ) : (
                  <>
                    <Info className="w-3.5 h-3.5 text-slate-500" />
                    <span>
                      {varioTiming === 'before_first_class'
                        ? isAr
                          ? 'فاريو غير مطبق قبل حضور أول حصة'
                          : 'Vario not applicable before first class'
                        : isAr
                        ? 'فاريو غير متاح بعد أكثر من حصتين (تجاوز الحد الأقصى)'
                        : 'Vario not applicable after more than 2 classes'}
                    </span>
                  </>
                )}
              </div>

              {(varioTiming === 'after_first_class' || varioTiming === 'after_second_class') && (
                <div className="space-y-0.5 text-[10px] text-cyan-900">
                  <p>
                    {isAr
                      ? '• النافذة المسموحة: بعد الحصة الأولى وحتى حصتين كحد أقصى.'
                      : '• Eligible window: after 1st class, up to 2 classes maximum.'}
                  </p>
                  <p>
                    {isAr
                      ? '• لا يمكن حساب قيمة الخصم من قاعدة البيانات الحالية لعدم وجود نسبة أو رقم ثابت.'
                      : '• Exact Vario amount cannot be calculated from current KB; amount is determined from SMS.'}
                  </p>
                  <p>
                    {isAr
                      ? '• يُدمج حصرياً مع خصم الإخوة فقط.'
                      : '• Can be combined with sibling discount only.'}
                  </p>
                  {terms > 1 && (
                    <div className="flex items-center space-x-1 rtl:space-x-reverse text-amber-700 font-bold pt-1">
                      <AlertTriangle className="w-3 h-3 text-amber-600 flex-shrink-0" />
                      <span>
                        {isAr
                          ? 'تنبيه: دمج فاريو مع حزم الترمات يتطلب التأكيد الإداري (Discount combination requires confirmation).'
                          : 'Warning: Discount combination with Bundle requires confirmation.'}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Registration Type (New vs Re-registration) - Adults Only */}
      {isAdult && setRegistrationType && (
        <div className="flex items-center justify-between pt-1 border-t border-slate-200">
          <span className="text-[11px] font-bold text-slate-500 uppercase">
            {isAr ? 'نوع التسجيل:' : 'Registration:'}
          </span>
          <div className="flex space-x-1.5 rtl:space-x-reverse">
            <button
              type="button"
              onClick={() => setRegistrationType('New')}
              className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                registrationType === 'New'
                  ? 'bg-bc-navy-900 text-white border-bc-navy-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {isAr ? 'طالب جديد' : 'New'}
            </button>
            <button
              type="button"
              onClick={() => setRegistrationType('Re-registration')}
              className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                registrationType === 'Re-registration'
                  ? 'bg-emerald-700 text-white border-emerald-700'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {isAr ? 'إعادة تسجيل (خصم 10%)' : 'Re-registration (10%)'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

