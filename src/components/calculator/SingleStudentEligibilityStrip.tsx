import React from 'react';
import { Baby, GraduationCap, Layers, AlertTriangle } from 'lucide-react';
import { ProgramFamily } from '../../data/types';

interface SingleStudentEligibilityStripProps {
  ageInfo: { years: number; months: number; days: number };
  effectiveFamily: ProgramFamily;
  ageGroupDisplay: string;
  selectedSeason: string;
  isManualOverrideActive: boolean;
  manualOverrideFamily: string;
  onClearManualOverride: () => void;
  isAr: boolean;
  yearsOldLabel: string;
}

export const SingleStudentEligibilityStrip: React.FC<SingleStudentEligibilityStripProps> = ({
  ageInfo,
  effectiveFamily,
  ageGroupDisplay,
  selectedSeason,
  isManualOverrideActive,
  manualOverrideFamily,
  onClearManualOverride,
  isAr,
  yearsOldLabel,
}) => {
  return (
    <div className="pt-2 animate-fade-in space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {/* Age Card */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-8 h-8 rounded-lg bg-bc-teal-100 text-bc-teal-800 flex items-center justify-center font-bold text-sm flex-shrink-0">
            {ageInfo.years}
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">
              {isAr ? 'العمر المحسوب' : 'Calculated Age'}
            </span>
            <div className="text-sm font-black text-slate-900">
              {ageInfo.years} {yearsOldLabel || (isAr ? 'سنة' : 'Years')}
            </div>
          </div>
        </div>

        {/* Age Group Card */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-8 h-8 rounded-lg bg-bc-teal-100 text-bc-teal-900 flex items-center justify-center flex-shrink-0">
            {effectiveFamily === 'Adult' ? (
              <GraduationCap className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Baby className="w-4 h-4" aria-hidden="true" />
            )}
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">
              {isAr ? 'الفئة العمرية' : 'Age Group'}
            </span>
            <div className="text-xs font-black text-slate-900 truncate" title={ageGroupDisplay}>
              {ageGroupDisplay}
            </div>
          </div>
        </div>

        {/* Inferred Program Card */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
            <Layers className="w-4 h-4" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">
              {isAr ? 'البرنامج المستنتج' : 'Inferred Program'}
            </span>
            <div className="text-xs font-black text-slate-900 truncate">
              {effectiveFamily === 'Adult'
                ? (isAr ? 'Adult • كورسات الكبار' : 'Adult English')
                : (isAr ? `Young Learner • ${selectedSeason}` : `Young Learner • ${selectedSeason}`)}
            </div>
          </div>
        </div>
      </div>

      {/* Manual Override Active Badge */}
      {isManualOverrideActive && (
        <div className="p-2 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-between text-xs text-amber-900 font-bold">
          <span className="flex items-center space-x-1.5 rtl:space-x-reverse">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" aria-hidden="true" />
            <span>
              {isAr
                ? `تعديل يدوي نشط: تم تحويل البرنامج إلى (${manualOverrideFamily})`
                : `Manual Override Active: Switched to (${manualOverrideFamily})`}
            </span>
          </span>
          <button
            type="button"
            onClick={onClearManualOverride}
            className="text-[11px] underline hover:text-amber-950"
          >
            {isAr ? 'إلغاء التعديل اليدوي' : 'Reset to Auto'}
          </button>
        </div>
      )}
    </div>
  );
};
