import React, { useState, useEffect } from 'react';
import { FileText, Copy, Check } from 'lucide-react';
import { useToast } from '../ui/ToastContext';

interface CallScriptsDualCardProps {
  quickCustomerAnswerAr: string;
  quickCustomerAnswerEn: string;
  isAr: boolean;
}

export const CallScriptsDualCard: React.FC<CallScriptsDualCardProps> = ({
  quickCustomerAnswerAr,
  quickCustomerAnswerEn,
  isAr,
}) => {
  const { showToast } = useToast();
  const [copiedAr, setCopiedAr] = useState(false);
  const [copiedEn, setCopiedEn] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'c' || e.key === 'C' || e.key === 'ؤ')) {
        e.preventDefault();
        handleCopyText(isAr ? quickCustomerAnswerAr : quickCustomerAnswerEn, isAr ? 'ar' : 'en');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [quickCustomerAnswerAr, quickCustomerAnswerEn, isAr]);

  const handleCopyText = async (text: string, type: 'ar' | 'en') => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }

    if (type === 'ar') {
      setCopiedAr(true);
      showToast(isAr ? 'تم نسخ رد العميل (بالعربي)' : 'Copied Arabic customer answer');
      setTimeout(() => setCopiedAr(false), 2000);
    } else {
      setCopiedEn(true);
      showToast(isAr ? 'تم نسخ رد العميل (بالإنجليزي)' : 'Copied English customer answer');
      setTimeout(() => setCopiedEn(false), 2000);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {/* Arabic Call Script */}
      <div className="bg-gradient-to-br from-[#00205B] to-[#041d48] text-white rounded-xl shadow-xs p-4 border border-[#00205B] flex flex-col justify-between space-y-2.5">
        <div className="flex items-center justify-between border-b border-white/15 pb-2">
          <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
            <FileText className="w-4 h-4 text-bc-teal-400" aria-hidden="true" />
            <span className="text-xs font-bold text-bc-teal-300">
              {isAr ? 'الرد بالعربي (للمكالمة)' : 'Arabic Call Script'}
            </span>
            <span className="text-[10px] font-mono bg-white/10 px-1 rounded text-slate-300">
              Alt+C
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleCopyText(quickCustomerAnswerAr, 'ar')}
            className={`inline-flex items-center space-x-1 rtl:space-x-reverse px-2.5 py-1 rounded-lg text-xs font-bold transition-all shadow-xs ${
              copiedAr
                ? 'bg-emerald-500 text-white'
                : 'bg-bc-teal-500 text-[#00205B] hover:bg-bc-teal-400'
            }`}
          >
            {copiedAr ? <Check className="w-3.5 h-3.5" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
            <span>{copiedAr ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ الرد' : 'Copy Answer')}</span>
          </button>
        </div>

        <p
          className="text-xs sm:text-sm text-slate-100 leading-relaxed bg-black/20 p-3 rounded-lg border border-white/10 text-right dir-rtl font-sans flex-1"
          dir="rtl"
        >
          "{quickCustomerAnswerAr}"
        </p>
      </div>

      {/* English Call Script */}
      <div className="bg-gradient-to-br from-[#00205B] to-[#041d48] text-white rounded-xl shadow-xs p-4 border border-[#00205B] flex flex-col justify-between space-y-2.5">
        <div className="flex items-center justify-between border-b border-white/15 pb-2">
          <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
            <FileText className="w-4 h-4 text-bc-teal-400" aria-hidden="true" />
            <span className="text-xs font-bold text-bc-teal-300">
              {isAr ? 'الرد بالإنجليزي (للمكالمة)' : 'English Call Script'}
            </span>
            <span className="text-[10px] font-mono bg-white/10 px-1 rounded text-slate-300">
              Alt+E
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleCopyText(quickCustomerAnswerEn, 'en')}
            className={`inline-flex items-center space-x-1 rtl:space-x-reverse px-2.5 py-1 rounded-lg text-xs font-bold transition-all shadow-xs ${
              copiedEn
                ? 'bg-emerald-500 text-white'
                : 'bg-bc-teal-500 text-[#00205B] hover:bg-bc-teal-400'
            }`}
          >
            {copiedEn ? <Check className="w-3.5 h-3.5" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
            <span>{copiedEn ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ الرد' : 'Copy Answer')}</span>
          </button>
        </div>

        <p
          className="text-xs sm:text-sm text-slate-100 leading-relaxed bg-black/20 p-3 rounded-lg border border-white/10 text-left dir-ltr font-sans flex-1"
          dir="ltr"
        >
          "{quickCustomerAnswerEn}"
        </p>
      </div>
    </div>
  );
};
