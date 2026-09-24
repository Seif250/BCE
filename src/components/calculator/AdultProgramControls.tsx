import React from 'react';
import { Tag } from 'lucide-react';
import { ProgramFamily, RegistrationType } from '../../data/types';

interface AdultProgramControlsProps {
  effectiveFamily: ProgramFamily;
  selectedAdultProduct: string;
  onSelectAdultProduct: (val: any) => void;
  existingLevel: string;
  onSelectExistingLevel: (lvl: string) => void;
  availableLevels: Array<{ id: string; name: string }>;
  levelSelectRef: React.RefObject<HTMLSelectElement | null>;
  registrationType: RegistrationType;
  onSelectRegistrationType: (type: RegistrationType) => void;
  isAr: boolean;
  existingLevelLabel: string;
  optionalLabel: string;
  noLevelPlaceholder: string;
}

export const AdultProgramControls: React.FC<AdultProgramControlsProps> = ({
  effectiveFamily,
  selectedAdultProduct,
  onSelectAdultProduct,
  existingLevel,
  onSelectExistingLevel,
  availableLevels,
  levelSelectRef,
  registrationType,
  onSelectRegistrationType,
  isAr,
  existingLevelLabel,
  optionalLabel,
  noLevelPlaceholder,
}) => {
  return (
    <div className="space-y-3">
      {/* DYNAMIC PROGRAM CONTROLS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {effectiveFamily === 'Adult' && (
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
              {isAr ? 'كورس الكبار (Product)' : 'Adult Product'}
            </label>
            <select
              value={selectedAdultProduct}
              onChange={(e) => onSelectAdultProduct(e.target.value)}
              className="w-full text-xs font-bold py-2 px-3 border border-slate-300 rounded-xl bg-white text-slate-900 outline-none focus:ring-2 focus:ring-bc-teal-400"
            >
              <option value="beginner">Beginner Courses (المبتدئين)</option>
              <option value="bce">BCE - British Council English (العام)</option>
              <option value="ielts-coach">IELTS Coach (تحضير آيلتس)</option>
              <option value="english-online">English Online (أونلاين تفاعلي)</option>
            </select>
          </div>
        )}

        <div>
          <label
            htmlFor="level-select"
            className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1"
          >
            {existingLevelLabel || 'Current Level'} ({optionalLabel || 'Optional'})
          </label>
          <select
            ref={levelSelectRef}
            id="level-select"
            value={existingLevel}
            onChange={(e) => onSelectExistingLevel(e.target.value)}
            className="w-full text-xs py-2 px-3 border border-slate-300 rounded-xl bg-white text-slate-900 outline-none focus:ring-2 focus:ring-bc-teal-400 font-medium"
          >
            <option value="">
              {noLevelPlaceholder || (isAr ? 'لم يتم تحديد المستوى — يمكن استخدام Placement Test' : 'No level specified — PT required')}
            </option>
            {availableLevels.map((lvl) => (
              <option key={lvl.id} value={lvl.name}>
                {lvl.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Registration Pills (Adults Only) */}
      {effectiveFamily === 'Adult' && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-100">
          <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
            <span className="text-[11px] font-bold text-slate-500 uppercase">
              {isAr ? 'نوع التسجيل:' : 'Registration:'}
            </span>
            <button
              type="button"
              onClick={() => onSelectRegistrationType('New')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                registrationType === 'New'
                  ? 'bg-bc-navy-900 text-white border-bc-navy-900 shadow-2xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {isAr ? 'طالب جديد' : 'New'}
            </button>
            <button
              type="button"
              onClick={() => onSelectRegistrationType('Re-registration')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1.5 rtl:space-x-reverse ${
                registrationType === 'Re-registration'
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs ring-1 ring-emerald-500'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Tag className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
              <span>{isAr ? 'إعادة تسجيل (خصم 10%)' : 'Re-registration (10% Off)'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
