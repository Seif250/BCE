import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export interface DateOfBirthInputProps {
  value: string; // ISO format: YYYY-MM-DD or empty
  onChange: (isoDate: string) => void;
  onEnterNext?: () => void;
  onCalculate?: () => void;
  resetTrigger?: number;
}

export const DateOfBirthInput: React.FC<DateOfBirthInputProps> = ({
  value,
  onChange,
  onEnterNext,
  onCalculate,
  resetTrigger = 0,
}) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);
  const lastEmittedIsoRef = useRef<string>('');

  // Sync external value changes (e.g., reset or presets)
  useEffect(() => {
    if (!value) {
      setDay('');
      setMonth('');
      setYear('');
      setErrorMsg('');
      lastEmittedIsoRef.current = '';
      return;
    }
    // Avoid cyclic overwrite of local inputs when the value came from our own typing
    if (value === lastEmittedIsoRef.current) {
      return;
    }
    const parts = value.split('-');
    if (parts.length === 3) {
      setYear(parts[0]);
      setMonth(parts[1]);
      setDay(parts[2]);
      setErrorMsg('');
      lastEmittedIsoRef.current = value;
    }
  }, [value]);

  // Auto focus Day input on mount and on reset
  useEffect(() => {
    dayRef.current?.focus();
  }, [resetTrigger]);

  // Normalize Eastern Arabic numerals (٠-٩ / ۰-۹) to standard Western digits
  const normalizeArabicDigits = (str: string): string => {
    return str
      .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632))
      .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776));
  };

  // Pure validation function
  const parseAndValidate = (dRaw: string, mRaw: string, yRaw: string) => {
    if (!dRaw || !mRaw || !yRaw) {
      return {
        valid: false,
        iso: '',
        d: dRaw,
        m: mRaw,
        y: yRaw,
        error: isAr ? 'يرجى إدخال التاريخ بالكامل' : 'Please enter full date',
      };
    }
    const dNum = parseInt(dRaw, 10);
    const mNum = parseInt(mRaw, 10);
    let yNum = parseInt(yRaw, 10);

    if (isNaN(dNum) || isNaN(mNum) || isNaN(yNum)) {
      return {
        valid: false,
        iso: '',
        d: dRaw,
        m: mRaw,
        y: yRaw,
        error: isAr ? 'أرقام غير صحيحة' : 'Invalid numbers',
      };
    }

    // Auto-convert 2-digit year (e.g. 16 -> 2016, 95 -> 1995)
    const now = new Date();
    const currentYear = now.getFullYear();
    if (yRaw.length === 2) {
      const curYear2Digits = currentYear % 100;
      yNum = yNum <= curYear2Digits ? 2000 + yNum : 1900 + yNum;
    }

    if (mNum < 1 || mNum > 12) {
      return {
        valid: false,
        iso: '',
        d: dRaw,
        m: mRaw,
        y: String(yNum),
        error: isAr ? 'الشهر غير صحيح (1-12)' : 'Month must be 1-12',
      };
    }

    const daysInMonth = new Date(yNum, mNum, 0).getDate();
    if (dNum < 1 || dNum > daysInMonth) {
      return {
        valid: false,
        iso: '',
        d: dRaw,
        m: mRaw,
        y: String(yNum),
        error: isAr
          ? `اليوم غير صحيح لهذا الشهر (1-${daysInMonth})`
          : `Day must be 1-${daysInMonth}`,
      };
    }

    if (yNum < 1930 || yNum > currentYear) {
      return {
        valid: false,
        iso: '',
        d: dRaw,
        m: mRaw,
        y: String(yNum),
        error: isAr
          ? `السنة يجب أن تكون بين 1930 و ${currentYear}`
          : `Year must be 1930-${currentYear}`,
      };
    }

    const paddedD = String(dNum).padStart(2, '0');
    const paddedM = String(mNum).padStart(2, '0');
    const fullY = String(yNum);
    const iso = `${fullY}-${paddedM}-${paddedD}`;

    return { valid: true, iso, d: paddedD, m: paddedM, y: fullY, error: '' };
  };

  // Validate and emit date
  const updateAndEmit = (d: string, m: string, y: string, showErrorIfIncomplete = false): boolean => {
    const isDayReady = d.length >= 1;
    const isMonthReady = m.length >= 1;
    const isYearReady = y.length >= 2;

    if (isDayReady && isMonthReady && isYearReady) {
      const res = parseAndValidate(d, m, y);
      if (res.valid) {
        setErrorMsg('');
        // CRITICAL: DO NOT overwrite local user state (day/month) with forced padded strings!
        // The ISO string res.iso already contains properly formatted YYYY-MM-DD for the engine.
        lastEmittedIsoRef.current = res.iso;
        onChange(res.iso);
        return true;
      } else {
        if (showErrorIfIncomplete) {
          setErrorMsg(res.error);
        }
      }
    } else {
      if (showErrorIfIncomplete && (d || m || y)) {
        setErrorMsg(isAr ? 'يرجى إكمال اليوم والشهر والسنة' : 'Please complete day, month, and year');
      }
    }
    // If not fully valid, clear emitted date
    if (value !== '') {
      lastEmittedIsoRef.current = '';
      onChange('');
    }
    return false;
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = normalizeArabicDigits(e.target.value);

    // If user typed/pasted full 8 digits: DDMMYYYY
    const onlyDigits = raw.replace(/\D/g, '');
    if (onlyDigits.length === 8 && !onlyDigits.startsWith('19') && !onlyDigits.startsWith('20')) {
      const d = onlyDigits.slice(0, 2);
      const m = onlyDigits.slice(2, 4);
      const y = onlyDigits.slice(4, 8);
      setDay(d);
      setMonth(m);
      setYear(y);
      setErrorMsg('');
      updateAndEmit(d, m, y, true);
      return;
    }

    const val = onlyDigits.slice(0, 2);
    setDay(val);
    setErrorMsg('');
    if (val.length === 2) {
      updateAndEmit(val, month, year, false);
      monthRef.current?.focus();
      monthRef.current?.select();
    } else {
      if (value !== '') {
        lastEmittedIsoRef.current = '';
        onChange('');
      }
    }
  };

  const handleDayBlur = () => {
    // Do NOT auto-pad with '0' on blur to avoid corrupting multi-digit input
    if (day && month && year) {
      updateAndEmit(day, month, year, false);
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = normalizeArabicDigits(e.target.value);
    const val = raw.replace(/\D/g, '').slice(0, 2);
    setMonth(val);
    setErrorMsg('');
    if (val.length === 2) {
      updateAndEmit(day, val, year, false);
      yearRef.current?.focus();
      yearRef.current?.select();
    } else {
      if (value !== '') {
        lastEmittedIsoRef.current = '';
        onChange('');
      }
    }
  };

  const handleMonthBlur = () => {
    // Do NOT auto-pad with '0' on blur
    if (day && month && year) {
      updateAndEmit(day, month, year, false);
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = normalizeArabicDigits(e.target.value);
    const val = raw.replace(/\D/g, '').slice(0, 4);
    setYear(val);
    setErrorMsg('');
    if (val.length === 4) {
      updateAndEmit(day, month, val, true);
    } else {
      if (value !== '') {
        lastEmittedIsoRef.current = '';
        onChange('');
      }
    }
  };

  const handleYearBlur = () => {
    if (day && month && year.length >= 2) {
      updateAndEmit(day, month, year, true);
    }
  };

  const handleDayKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === '/' || e.key === 'Tab') {
      if (e.key !== 'Tab') {
        e.preventDefault();
      }
      if (day.length >= 1) {
        if (month && year) {
          const ok = updateAndEmit(day, month, year, true);
          if (ok) {
            onCalculate?.();
            onEnterNext?.();
            return;
          }
        }
        monthRef.current?.focus();
        monthRef.current?.select();
      }
    }
  };

  const handleMonthKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !month) {
      e.preventDefault();
      dayRef.current?.focus();
    } else if (e.key === 'Enter' || e.key === '/' || e.key === 'Tab') {
      if (e.key !== 'Tab') {
        e.preventDefault();
      }
      if (month.length >= 1) {
        if (day && year) {
          const ok = updateAndEmit(day, month, year, true);
          if (ok) {
            onCalculate?.();
            onEnterNext?.();
            return;
          }
        }
        yearRef.current?.focus();
        yearRef.current?.select();
      }
    }
  };

  const handleYearKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !year) {
      e.preventDefault();
      monthRef.current?.focus();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const ok = updateAndEmit(day, month, year, true);
      if (ok) {
        onCalculate?.();
        onEnterNext?.();
      } else {
        if (!day) {
          dayRef.current?.focus();
        } else if (!month) {
          monthRef.current?.focus();
        } else if (!year) {
          yearRef.current?.focus();
        }
      }
    }
  };

  // Clipboard paste support (e.g. 15/05/2016 or 2016-05-15 or 15052016)
  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text').trim();
    if (!text) return;

    // ISO: YYYY-MM-DD or YYYY/MM/DD
    const isoMatch = text.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
    if (isoMatch) {
      e.preventDefault();
      const [_, y, m, d] = isoMatch;
      const res = parseAndValidate(d, m, y);
      if (res.valid) {
        setDay(res.d);
        setMonth(res.m);
        setYear(res.y);
        setErrorMsg('');
        lastEmittedIsoRef.current = res.iso;
        onChange(res.iso);
        onCalculate?.();
        onEnterNext?.();
        return;
      }
    }

    // Standard: DD/MM/YYYY or DD-MM-YYYY
    const stdMatch = text.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})$/);
    if (stdMatch) {
      e.preventDefault();
      const [_, d, m, y] = stdMatch;
      const res = parseAndValidate(d, m, y);
      if (res.valid) {
        setDay(res.d);
        setMonth(res.m);
        setYear(res.y);
        setErrorMsg('');
        lastEmittedIsoRef.current = res.iso;
        onChange(res.iso);
        onCalculate?.();
        onEnterNext?.();
        return;
      }
    }

    // 8 Digits: DDMMYYYY or YYYYMMDD
    if (/^\d{8}$/.test(text)) {
      if (text.startsWith('19') || text.startsWith('20')) {
        const y = text.slice(0, 4);
        const m = text.slice(4, 6);
        const d = text.slice(6, 8);
        const res = parseAndValidate(d, m, y);
        if (res.valid) {
          e.preventDefault();
          setDay(res.d);
          setMonth(res.m);
          setYear(res.y);
          setErrorMsg('');
          lastEmittedIsoRef.current = res.iso;
          onChange(res.iso);
          onCalculate?.();
          onEnterNext?.();
          return;
        }
      } else {
        const d = text.slice(0, 2);
        const m = text.slice(2, 4);
        const y = text.slice(4, 8);
        const res = parseAndValidate(d, m, y);
        if (res.valid) {
          e.preventDefault();
          setDay(res.d);
          setMonth(res.m);
          setYear(res.y);
          setErrorMsg('');
          lastEmittedIsoRef.current = res.iso;
          onChange(res.iso);
          onCalculate?.();
          onEnterNext?.();
          return;
        }
      }
    }
  };

  // Quick Preset setter
  const applyPresetAge = (targetYears: number) => {
    const today = new Date();
    const y = today.getFullYear() - targetYears;
    const m = '06';
    const d = '15';
    const iso = `${y}-${m}-${d}`;
    setDay(d);
    setMonth(m);
    setYear(String(y));
    setErrorMsg('');
    lastEmittedIsoRef.current = iso;
    onChange(iso);
    if (onCalculate) {
      onCalculate();
    }
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
    <div className="space-y-2.5" onPaste={handlePaste}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5 rtl:space-x-reverse">
          <Calendar className="w-4 h-4 text-[#062A67]" />
          <span>
            {isAr
              ? 'تاريخ ميلاد الطالب (يوم / شهر / سنة)'
              : 'Date of Birth (DD / MM / YYYY)'}{' '}
            *
          </span>
        </label>
        <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
          {isAr ? 'اضغط Enter للحساب فوراً' : 'Press Enter to calculate instantly'}
        </span>
      </div>

      {/* Segmented Input: DD / MM / YYYY + Clear Button */}
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        {/* Day */}
        <div className="w-20 sm:w-24">
          <div className="relative">
            <input
              ref={dayRef}
              id="dob-day-input"
              type="text"
              dir="ltr"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={2}
              placeholder={isAr ? 'يوم' : 'DD'}
              value={day}
              onChange={handleDayChange}
              onBlur={handleDayBlur}
              onKeyDown={handleDayKeyDown}
              className="w-full text-center text-lg sm:text-xl font-mono font-black py-2 px-1 border-2 border-slate-300 focus:border-[#062A67] focus:ring-2 focus:ring-bc-teal-200 rounded-xl bg-white text-slate-900 transition-all shadow-2xs outline-none"
            />
            <span className="block text-[10px] text-center text-slate-400 font-medium mt-0.5">
              {isAr ? 'اليوم' : 'Day'}
            </span>
          </div>
        </div>

        <span className="text-xl font-bold text-slate-300 mb-4 select-none">/</span>

        {/* Month */}
        <div className="w-20 sm:w-24">
          <div className="relative">
            <input
              ref={monthRef}
              id="dob-month-input"
              type="text"
              dir="ltr"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={2}
              placeholder={isAr ? 'شهر' : 'MM'}
              value={month}
              onChange={handleMonthChange}
              onBlur={handleMonthBlur}
              onKeyDown={handleMonthKeyDown}
              className="w-full text-center text-lg sm:text-xl font-mono font-black py-2 px-1 border-2 border-slate-300 focus:border-[#062A67] focus:ring-2 focus:ring-bc-teal-200 rounded-xl bg-white text-slate-900 transition-all shadow-2xs outline-none"
            />
            <span className="block text-[10px] text-center text-slate-400 font-medium mt-0.5">
              {isAr ? 'الشهر' : 'Month'}
            </span>
          </div>
        </div>

        <span className="text-xl font-bold text-slate-300 mb-4 select-none">/</span>

        {/* Year */}
        <div className="w-28 sm:w-32">
          <div className="relative">
            <input
              ref={yearRef}
              id="dob-year-input"
              type="text"
              dir="ltr"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              placeholder={isAr ? 'سنة' : 'YYYY'}
              value={year}
              onChange={handleYearChange}
              onBlur={handleYearBlur}
              onKeyDown={handleYearKeyDown}
              className="w-full text-center text-lg sm:text-xl font-mono font-black py-2 px-2 border-2 border-slate-300 focus:border-[#062A67] focus:ring-2 focus:ring-bc-teal-200 rounded-xl bg-white text-slate-900 transition-all shadow-2xs outline-none"
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
              setErrorMsg('');
              onChange('');
              dayRef.current?.focus();
            }}
            className="text-xs text-slate-400 hover:text-rose-600 px-2 py-1 mb-4 rounded-md hover:bg-slate-100 transition-colors"
            title={isAr ? 'مسح التاريخ' : 'Clear Date'}
          >
            ✕
          </button>
        )}
      </div>

      {/* Inline Validation Error if any */}
      {errorMsg && (
        <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-xs font-bold text-rose-600 animate-fade-in">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

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
