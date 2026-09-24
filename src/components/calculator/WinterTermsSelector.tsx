import React from 'react';

export interface WinterTermCardData {
  terms: number;
  label: string;
  bundleDiscount: number;
  rawTotal: number;
  discountAmt: number;
  finalAmt: number;
  totalPercentage: number;
}

interface WinterTermsSelectorProps {
  cards: WinterTermCardData[];
  selectedTerms: number;
  onSelectTerms?: (terms: number) => void;
  isAr: boolean;
}

export const WinterTermsSelector: React.FC<WinterTermsSelectorProps> = ({
  cards,
  selectedTerms,
  onSelectTerms,
  isAr,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
      {cards.map((card) => {
        const isSelected = selectedTerms === card.terms;
        return (
          <button
            key={card.terms}
            type="button"
            onClick={() => onSelectTerms && onSelectTerms(card.terms)}
            aria-pressed={isSelected}
            className={`p-3.5 rounded-xl border text-center relative transition-all cursor-pointer flex flex-col justify-between ${
              isSelected
                ? 'bg-[#00205B] text-white border-[#00205B] shadow-md ring-2 ring-bc-teal-400 scale-[1.02]'
                : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300 hover:shadow-xs'
            }`}
          >
            <div>
              <span
                className={`text-xs font-bold block ${
                  isSelected ? 'text-bc-teal-300' : 'text-slate-600'
                }`}
              >
                {card.label}
              </span>

              {/* HERO PRICE NUMBER */}
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
              {card.bundleDiscount > 0 && (
                <span
                  className={`text-[11px] font-medium block ${
                    isSelected ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {isAr
                    ? `يشمل خصم حزمة ${Math.round(card.bundleDiscount * 100)}%`
                    : `Includes ${Math.round(card.bundleDiscount * 100)}% bundle discount`}
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
  );
};
