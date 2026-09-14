// src/components/calculator/DiscountSimulator.tsx
import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Users, Tag, Sparkles } from 'lucide-react';
import { RegistrationType } from '../../data/types';

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
}

export const DiscountSimulator: React.FC<DiscountSimulatorProps> = ({
  terms,
  setTerms,
  siblingCount,
  setSiblingCount,
  registrationType = 'New',
  setRegistrationType,
  isAdult = false,
}) => {
  const { t, language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Terms selector */}
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1.5 flex items-center space-x-1 rtl:space-x-reverse">
            <Tag className="w-3.5 h-3.5 text-bc-teal-600" />
            <span>{isAr ? 'عدد الترمات المحجوزة' : 'Number of Terms'}</span>
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
                  <div className={`text-[9px] ${terms === n ? 'text-bc-teal-300' : 'text-slate-400'}`}>
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
            <span>{isAr ? 'عدد الأطفال المسجلين معًا' : 'Number of Children'}</span>
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
                  ? (isAr ? 'طفل واحد' : '1 Child')
                  : c === 2
                  ? (isAr ? 'طفلان' : '2 Children')
                  : (isAr ? '3 أو أكثر' : '3+ Children')}
              </button>
            ))}
          </div>
        </div>
      </div>

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
