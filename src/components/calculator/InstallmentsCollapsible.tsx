import React, { useState } from 'react';
import { CreditCard, ChevronDown, ChevronUp, CheckCircle2, AlertCircle } from 'lucide-react';
import { CalculationResult } from '../../data/types';

interface InstallmentsCollapsibleProps {
  installmentEligibility: CalculationResult['installmentEligibility'];
  isAr: boolean;
  defaultOpen?: boolean;
}

export const InstallmentsCollapsible: React.FC<InstallmentsCollapsibleProps> = ({
  installmentEligibility,
  isAr,
  defaultOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden text-xs shadow-xs">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3.5 flex items-center justify-between text-slate-700 font-bold hover:bg-slate-50 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <CreditCard className="w-4 h-4 text-[#00205B]" aria-hidden="true" />
          <span className="font-extrabold text-slate-900">
            {isAr ? 'خيارات التقسيط بالفيزا' : 'Credit Card Installment Options'}
          </span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
              installmentEligibility.eligible
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {installmentEligibility.eligible
              ? (isAr ? 'متاح للتقسيط (6 و 12 شهر)' : 'Eligible (6M & 12M)')
              : (isAr ? 'غير متاح لترم واحد' : 'Not Eligible for 1 Term')}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-slate-500" aria-hidden="true" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-500" aria-hidden="true" />
        )}
      </button>

      {isOpen && (
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 space-y-3">
          <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-xs font-semibold text-slate-700">
            {installmentEligibility.eligible ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" aria-hidden="true" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" aria-hidden="true" />
            )}
            <span>
              {isAr
                ? installmentEligibility.eligible
                  ? 'متاح التقسيط ببطاقة الائتمان البنكية عند حجز ترمين أو أكثر:'
                  : 'التقسيط غير متاح لترم واحد فقط. الحد الأدنى للتأهل هو حجز ترمين فأكثر.'
                : installmentEligibility.reason}
            </span>
          </div>

          {installmentEligibility.options.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {installmentEligibility.options.map((opt, i) => {
                const is6M = opt.tenureMonths === 6;
                const planTitle = is6M
                  ? (isAr ? 'تقسيط على 6 شهور' : '6-Month Plan')
                  : (isAr ? 'تقسيط على 12 شهر' : '12-Month Plan');

                return (
                  <div
                    key={i}
                    className={`p-3.5 rounded-xl bg-white border transition-all shadow-xs flex flex-col justify-between space-y-3 ${
                      is6M
                        ? 'border-bc-teal-200 hover:border-bc-teal-400 hover:shadow-xs'
                        : 'border-slate-200 hover:border-[#00205B] hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                        <CreditCard className={`w-4 h-4 ${is6M ? 'text-bc-teal-700' : 'text-[#00205B]'}`} aria-hidden="true" />
                        <span className="text-xs sm:text-sm font-black text-slate-900">
                          {planTitle}
                        </span>
                      </div>
                      <span
                        className={`text-[11px] font-black px-2 py-0.5 rounded-md border ${
                          is6M
                            ? 'bg-bc-teal-50 text-bc-teal-800 border-bc-teal-200'
                            : 'bg-slate-100 text-[#00205B] border-slate-200'
                        }`}
                      >
                        {isAr ? `${opt.adminPercent}% مصاريف إدارية` : `${opt.adminPercent}% Admin Fee`}
                      </span>
                    </div>

                    {/* Total & Monthly Payment */}
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] uppercase font-bold text-slate-500 block">
                          {isAr ? 'إجمالي المبلغ (Total):' : 'Total Price (with Admin):'}
                        </span>
                        <div className="text-base sm:text-lg font-black text-emerald-800 tracking-tight">
                          {opt.totalWithAdmin?.toLocaleString()}{' '}
                          <span className="text-xs font-bold text-slate-600">{isAr ? 'ج.م' : 'EGP'}</span>
                        </div>
                      </div>
                      <div className="text-right rtl:text-left">
                        <span className="text-[11px] font-bold text-slate-500 block">
                          {isAr ? 'القسط الشهري:' : 'Monthly Payment:'}
                        </span>
                        <div className="text-sm sm:text-base font-black text-[#00205B]">
                          ~{opt.monthlyPayment?.toLocaleString()}{' '}
                          <span className="text-[11px] font-bold text-slate-500">{isAr ? 'ج.م/شهر' : 'EGP/mo'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <p className="text-[10px] text-slate-500 font-medium italic">
            {isAr
              ? 'ملاحظة: الحسابات تقريبية وترجع للآلة الحاسبة البنكية الرسمية والشروط الخاصة بكل بنك مصدر للبطاقة.'
              : installmentEligibility.notes}
          </p>
        </div>
      )}
    </div>
  );
};
