import React from 'react';
import { Users, Plus, Trash2 } from 'lucide-react';
import { DateOfBirthInput } from './DateOfBirthInput';
import { CalculatedSiblingInfo } from './FamilyResultCard';

export interface FamilyChildItem {
  id: string;
  name: string;
  dob: string;
  termsCount: number;
  resetTrigger: number;
  level?: string;
}

interface MultiChildFamilySectionProps {
  familyChildren: FamilyChildItem[];
  calculatedFamilyChildren: CalculatedSiblingInfo[];
  onAddChild: () => void;
  onRemoveChild: (id: string) => void;
  onUpdateChildDob: (id: string, newDob: string) => void;
  onUpdateChildTerms: (id: string, count: number) => void;
  onCalculate?: () => void;
  isAr: boolean;
}

export const MultiChildFamilySection: React.FC<MultiChildFamilySectionProps> = ({
  familyChildren,
  calculatedFamilyChildren,
  onAddChild,
  onRemoveChild,
  onUpdateChildDob,
  onUpdateChildTerms,
  onCalculate,
  isAr,
}) => {
  return (
    <div className="space-y-3">
      {/* Multi-Child Header Bar */}
      <div className="bg-amber-50/80 border border-amber-200/90 p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black flex-shrink-0">
            <Users className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <span className="text-xs font-black text-amber-950 block">
              {isAr ? 'حاسبة الإخوة المتعددين (Multi-Child Family)' : 'Multi-Child Family Calculator'}
            </span>
            <span className="text-[10px] text-amber-800 font-medium">
              {isAr
                ? 'يتم تطبيق خصم 10% للأصغر حصرياً على الترمات المشتركة مع إخوته الأكبر.'
                : '10% sibling discount applies to younger children strictly on shared terms with older siblings.'}
            </span>
          </div>
        </div>

        {/* Add Another Child Button */}
        <button
          type="button"
          onClick={onAddChild}
          disabled={familyChildren.length >= 5}
          className={`inline-flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-lg text-xs font-black border transition-all ${
            familyChildren.length >= 5
              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
              : 'bg-amber-400 hover:bg-amber-500 text-slate-950 border-amber-500 shadow-2xs'
          }`}
          title={familyChildren.length >= 5 ? (isAr ? 'الحد الأقصى 5 أطفال' : 'Max 5 children') : (isAr ? 'إضافة طفل آخر' : 'Add sibling')}
        >
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{isAr ? '+ طفل آخر' : '+ Add Sibling'}</span>
          <span className="text-[10px] opacity-75">({familyChildren.length}/5)</span>
        </button>
      </div>

      {/* Children Cards Grid */}
      <div className={`grid grid-cols-1 ${familyChildren.length === 2 ? 'md:grid-cols-2' : familyChildren.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'} gap-3`}>
        {familyChildren.map((child, index) => {
          const calcInfo = calculatedFamilyChildren.find((c) => c.id === child.id);
          return (
            <div key={child.id} className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                  <span className="w-5 h-5 rounded-md bg-[#00205B] text-white flex items-center justify-center font-bold text-xs">
                    {index + 1}
                  </span>
                  <span className="text-xs font-black text-slate-900">{child.name}</span>
                </div>

                <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                  {calcInfo && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        calcInfo.isEldest
                          ? 'bg-slate-200 text-slate-800'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      {calcInfo.isEldest ? (isAr ? 'الأكبر' : 'Eldest') : (isAr ? 'خصم أخوة' : 'Sibling')}
                    </span>
                  )}
                  {familyChildren.length > 2 && (
                    <button
                      type="button"
                      onClick={() => onRemoveChild(child.id)}
                      className="text-rose-500 hover:text-rose-700 p-1 rounded-md hover:bg-rose-50 transition-colors"
                      title={isAr ? 'حذف هذا الطفل' : 'Remove child'}
                      aria-label={isAr ? 'حذف هذا الطفل' : 'Remove child'}
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>

              {/* DOB input for this child */}
              <DateOfBirthInput
                value={child.dob}
                onChange={(dob) => onUpdateChildDob(child.id, dob)}
                onCalculate={onCalculate}
                resetTrigger={child.resetTrigger}
              />

              {/* Individual Terms Selector */}
              <div className="pt-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  {isAr ? 'عدد الترمات:' : 'Terms:'}
                </span>
                <div className="grid grid-cols-4 gap-1">
                  {[1, 2, 3, 4].map((tNum) => (
                    <button
                      key={tNum}
                      type="button"
                      onClick={() => onUpdateChildTerms(child.id, tNum)}
                      className={`py-1 text-xs font-black rounded-lg border transition-all ${
                        child.termsCount === tNum
                          ? 'bg-[#00205B] text-white border-[#00205B]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {tNum} {isAr ? 'ترم' : 'T'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Child Info Pill when calculated */}
              {calcInfo && (
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span><strong>{isAr ? 'العمر:' : 'Age:'}</strong> {calcInfo.ageYears} {isAr ? 'سنة' : 'y'}</span>
                  <span>•</span>
                  <span className="truncate max-w-[130px]" title={calcInfo.ageGroupDisplay}>
                    <strong>{isAr ? 'المرحلة:' : 'Stage:'}</strong> {calcInfo.ageGroupDisplay}
                  </span>
                  {calcInfo.finalChildPrice > 0 && (
                    <>
                      <span>•</span>
                      <span className="font-bold text-[#00205B]">
                        {calcInfo.finalChildPrice.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
