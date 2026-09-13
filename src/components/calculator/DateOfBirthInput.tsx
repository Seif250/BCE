import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Sparkles } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface DateOfBirthInputProps {
  value: string; // ISO format: YYYY-MM-DD or empty
  onChange: (isoDate: string) => void;
  onEnterNext?: () => void;
  resetTrigger?: number;
}

export const DateOfBirthInput: React.FC<DateOfBirthInputProps> = ({
  value,
  onChange,
  onEnterNext,
  resetTrigger = 0,
}) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  // Sync external value changes (e.g., reset or presets)
  useEffect(() => {
    if (!value) {
      setDay('');
      setMonth('');
      setYear('');
      return;
    }
    const parts = value.split('-');
    if (parts.length === 3) {
      setYear(parts[0]);
      setMonth(parts[1]);
      setDay(parts[2]);
    }
  }, [value]);

  // Auto focus Day input on mount and on reset
  useEffect(() => {
    dayRef.current?.focus();
  }, [resetTrigger]);

  // Validate and emit date
  const updateAndEmit = (d: string, m: string, y: string) => {
    if (d.length === 2 && m.length === 2 && y.length === 4) {
      const dNum = parseInt(d, 10);
      const mNum = parseInt(m, 10);
      const yNum = parseInt(y, 10);
      const now = new Date();
      const currentYear = now.getFullYear();

      if (
        mNum >= 1 &&
        mNum <= 12 &&
        dNum >= 1 &&
        dNum <= 31 &&
        yNum >= 1930 &&
        yNum <= currentYear
      ) {
        // Check days in month
        const daysInMonth = new Date(yNum, mNum, 0).getDate();
        if (dNum <= daysInMonth) {
          const iso = `${yNum}-${String(mNum).padStart(2, '0')}-${String(dNum).padStart(2, '0')}`;
          onChange(iso);
          return;
        }
      }
    }
    // If not fully valid, clear emitted date
    if (value !== '') {
      onChange('');
    }
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 2);
    setDay(val);
    updateAndEmit(val, month, year);
    if (val.length === 2) {
      monthRef.current?.focus();
      monthRef.current?.select();
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 2);
    setMonth(val);
    updateAndEmit(day, val, year);
    if (val.length === 2) {
      yearRef.current?.focus();
      yearRef.current?.select();
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setYear(val);
    updateAndEmit(day, month, val);
  };

  const handleDayKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === '/' || e.key === 'ArrowRight' || e.key === 'Tab') {
      if (day.length >= 1 && e.key !== 'Tab') {
        e.preventDefault();
        monthRef.current?.focus();
        monthRef.current?.select();
      }
    }
  };

  const handleMonthKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !month) {
      e.preventDefault();
      dayRef.current?.focus();
    } else if (e.key === 'Enter' || e.key === '/' || e.key === 'ArrowRight') {
      if (month.length >= 1) {
        e.preventDefault();
        yearRef.current?.focus();
        yearRef.current?.select();
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      dayRef.current?.focus();
    }
  };

  const handleYearKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !year) {
      e.preventDefault();
      monthRef.current?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      monthRef.current?.focus();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (onEnterNext) {
        onEnterNext();
      }
    }
  };

  // Quick Preset setter
  const applyPresetAge = (targetYears: number) => {
    const today = new Date();
    const y = today.getFullYear() - targetYears;
    // Set middle of year for consistent band representation
    const m = '06';
    const d = '15';
    const iso = `${y}-${m}-${d}`;
    setDay(d);
    setMonth(m);
    setYear(String(y));
    onChange(iso);
    if (onEnterNext) {
      setTimeout(() => onEnterNext(), 50);
    }
  };

  const presets = [
    { label: isAr ? '4 سنين' : '4y (EY2)', years: 4, desc: 'Early Years 2' },
    { label: isAr ? '5 سنين' : '5y (EY3)', years: 5, desc: 'Early Years 3' },
    { label: isAr ? '8 سنين' : '8y (LP)', years: 8, desc: 'Lower Primary' },
    { label: isAr ? '10 سنين' : '10y (UP)', years: 10, desc: 'Upper Primary' },
    { label: isAr ? '14 سنة' : '14y (LS)', years: 14, desc: 'Lower Secondary' },
    { label: isAr ? '16 سنة' : '16y (US)', years: 16, desc: 'Upper Secondary' },
    { label: isAr ? '18+ سنة' : '18y+ (Adult)', years: 20, desc: 'Adult' },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5 rtl:space-x-reverse">
          <Calendar className="w-4 h-4 text-bc-teal-600" />
          <span>{isAr ? 'تاريخ ميلاد الطالب (يوم / شهر / سنة)' : 'Date of Birth (DD / MM / YYYY)'} *</span>
        </label>
        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
          {isAr ? 'اضغط Enter للانتقال للخطوة التالية' : 'Press Enter to advance'}
        </span>
      </div>

      {/* Segmented Input: DD / MM / YYYY */}
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        {/* Day */}
        <div className="flex-1 max-w-[90px]">
          <div className="relative">
            <input
              ref={dayRef}
              id="dob-day-input"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={2}
              placeholder={isAr ? 'يوم' : 'DD'}
              value={day}
              onChange={handleDayChange}
              onKeyDown={handleDayKeyDown}
              className="w-full text-center text-lg sm:text-xl font-mono font-black py-2 px-1 border-2 border-slate-300 focus:border-bc-teal-500 focus:ring-2 focus:ring-bc-teal-200 rounded-xl bg-white text-slate-900 transition-all shadow-2xs outline-none"
            />
            <span className="block text-[10px] text-center text-slate-400 font-medium mt-0.5">
              {isAr ? 'اليوم' : 'Day'}
            </span>
          </div>
        </div>

        <span className="text-xl font-bold text-slate-300 mb-4 select-none">/</span>

        {/* Month */}
        <div className="flex-1 max-w-[90px]">
          <div className="relative">
            <input
              ref={monthRef}
              id="dob-month-input"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={2}
              placeholder={isAr ? 'شهر' : 'MM'}
              value={month}
              onChange={handleMonthChange}
              onKeyDown={handleMonthKeyDown}
              className="w-full text-center text-lg sm:text-xl font-mono font-black py-2 px-1 border-2 border-slate-300 focus:border-bc-teal-500 focus:ring-2 focus:ring-bc-teal-200 rounded-xl bg-white text-slate-900 transition-all shadow-2xs outline-none"
            />
            <span className="block text-[10px] text-center text-slate-400 font-medium mt-0.5">
              {isAr ? 'الشهر' : 'Month'}
            </span>
          </div>
        </div>

        <span className="text-xl font-bold text-slate-300 mb-4 select-none">/</span>

        {/* Year */}
        <div className="flex-1 max-w-[130px]">
          <div className="relative">
            <input
              ref={yearRef}
              id="dob-year-input"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              placeholder={isAr ? 'سنة' : 'YYYY'}
              value={year}
              onChange={handleYearChange}
              onKeyDown={handleYearKeyDown}
              className="w-full text-center text-lg sm:text-xl font-mono font-black py-2 px-2 border-2 border-slate-300 focus:border-bc-teal-500 focus:ring-2 focus:ring-bc-teal-200 rounded-xl bg-white text-slate-900 transition-all shadow-2xs outline-none"
            />
            <span className="block text-[10px] text-center text-slate-400 font-medium mt-0.5">
              {isAr ? 'السنة' : 'Year'}
            </span>
          </div>
        </div>

        {/* Quick Clear icon if filled */}
        {(day || month || year) && (
          <button
            type="button"
            onClick={() => {
              setDay('');
              setMonth('');
              setYear('');
              onChange('');
              dayRef.current?.focus();
            }}
            className="text-xs text-slate-400 hover:text-slate-700 px-2 py-1 mb-4 rounded-md hover:bg-slate-100 transition-colors"
            title={isAr ? 'مسح التاريخ' : 'Clear Date'}
          >
            ✕
          </button>
        )}
      </div>

      {/* Quick Age Presets */}
      <div className="pt-1 flex items-center space-x-1 rtl:space-x-reverse overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0 flex items-center space-x-0.5 rtl:space-x-reverse mr-1">
          <Sparkles className="w-3 h-3 text-amber-500 inline" />
          <span>{isAr ? 'سريع:' : 'Quick:'}</span>
        </span>
        {presets.map((p) => (
          <button
            key={p.years}
            type="button"
            onClick={() => applyPresetAge(p.years)}
            className="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-bc-teal-50 text-slate-700 hover:text-bc-teal-900 border border-slate-200 hover:border-bc-teal-300 transition-all whitespace-nowrap"
            title={p.desc}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
};
