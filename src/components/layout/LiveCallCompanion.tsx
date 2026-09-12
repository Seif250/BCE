import React, { useState } from 'react';
import {
  Sparkles,
  Calculator,
  PhoneCall,
  Mail,
  Clock,
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Layers,
  Percent,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { calculateAge } from '../../engine/ageCalculator';
import { evaluateStudent } from '../../engine/courseEngine';
import { GENERAL_CONTACT_INFO } from '../../data/branches';

interface LiveCallCompanionProps {
  onToggleFullWidth: () => void;
  isFullWidth: boolean;
}

export const LiveCallCompanion: React.FC<LiveCallCompanionProps> = ({
  onToggleFullWidth,
  isFullWidth,
}) => {
  const { language, isRTL } = useLanguage();

  const [dob, setDob] = useState<string>('2018-05-15');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const quickAgePresets = [
    { label: language === 'ar' ? '٤ سنين' : 'Age 4', dob: '2022-03-10' },
    { label: language === 'ar' ? '٥ سنين' : 'Age 5', dob: '2021-03-10' },
    { label: language === 'ar' ? '٧ سنين' : 'Age 7', dob: '2019-03-10' },
    { label: language === 'ar' ? '١٠ سنين' : 'Age 10', dob: '2016-03-10' },
    { label: language === 'ar' ? '١٣ سنة' : 'Age 13', dob: '2013-03-10' },
    { label: language === 'ar' ? '١٦ سنة' : 'Age 16', dob: '2010-03-10' },
    { label: language === 'ar' ? '٢٠ سنة' : 'Adult 20', dob: '2006-03-10' },
  ];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Evaluate current DOB
  let calculation = null;
  try {
    if (dob) {
      calculation = evaluateStudent({
        dob,
        registrationType: 'New',
        termCount: 1,
        siblingCount: 1,
        isYoungest: false,
        summerCampsSelected: [],
        isStarterLevel: false,
      });
    }
  } catch (e) {
    calculation = null;
  }

  const quickAnswerText = calculation
    ? calculation.quickCustomerAnswer[language]
    : '';

  return (
    <aside className="w-80 lg:w-96 flex-shrink-0 bg-white border-slate-200 shadow-sm flex flex-col h-full rounded-2xl border overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-bc-navy-900 to-bc-navy-800 text-white flex items-center justify-between">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Sparkles className="w-5 h-5 text-bc-teal-300" />
          <div>
            <h3 className="font-extrabold text-sm leading-tight">
              {language === 'ar' ? 'المساعد السريع للمكالمة' : 'Live Call Companion'}
            </h3>
            <span className="text-[10px] text-bc-teal-300 block">
              {language === 'ar' ? '⚡ وصول فوري دون مغادرة الصفحة' : '⚡ Instant info across all pages'}
            </span>
          </div>
        </div>

        <button
          onClick={onToggleFullWidth}
          className="p-1.5 rounded-lg bg-bc-navy-700/80 hover:bg-bc-navy-700 text-white text-xs flex items-center space-x-1 rtl:space-x-reverse transition-all border border-bc-navy-600"
          title={language === 'ar' ? 'توسيع الصفحة لملء الشاشة' : 'Expand to Full Width'}
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="text-[11px] font-bold">
            {language === 'ar' ? 'ملء الشاشة' : 'Full Width'}
          </span>
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin text-xs">
        {/* 1. MINI FAST CALCULATOR */}
        <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-slate-900 flex items-center space-x-1.5 rtl:space-x-reverse text-xs">
              <Calculator className="w-4 h-4 text-bc-teal-600" />
              <span>{language === 'ar' ? 'فحص سن ومستوى الطالب' : 'Quick Student Check'}</span>
            </span>
            <span className="text-[10px] font-bold text-bc-navy-800 bg-bc-navy-50 px-2 py-0.5 rounded border border-bc-navy-200">
              {language === 'ar' ? 'حساب فوري' : 'Instant'}
            </span>
          </div>

          {/* Quick Age Buttons */}
          <div className="flex flex-wrap gap-1.5">
            {quickAgePresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => setDob(preset.dob)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                  dob === preset.dob
                    ? 'bg-bc-navy-800 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* DOB input */}
          <div>
            <label className="block text-[11px] text-slate-500 font-bold mb-1">
              {language === 'ar' ? 'أو اختر تاريخ الميلاد:' : 'Or pick Date of Birth:'}
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 bg-white focus:ring-1 focus:ring-bc-teal-500"
            />
          </div>

          {/* Fast Result Card */}
          {calculation && (
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">
                    {language === 'ar' ? 'السن المحسوب:' : 'Calculated Age:'}
                  </span>
                  <strong className="text-sm font-black text-slate-900">
                    {calculation.age.years} {language === 'ar' ? 'سنة' : 'years'} ({calculation.age.months} {language === 'ar' ? 'شهر' : 'mos'})
                  </strong>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    calculation.placementTestRequired
                      ? 'bg-amber-50 text-amber-900 border-amber-200'
                      : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  }`}
                >
                  {calculation.placementTestRequired
                    ? (language === 'ar' ? 'امتحان 200 ج' : '200 EGP PT')
                    : (language === 'ar' ? 'بدون امتحان (معفي)' : 'No PT Needed')}
                </span>
              </div>

              <div className="space-y-1 text-slate-700 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'ar' ? 'المرحلة:' : 'Stage:'}</span>
                  <strong className="text-bc-navy-900">{calculation.ageGroup ? calculation.ageGroup.name : 'N/A'}</strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'ar' ? 'السعر الرسمي:' : 'Standard Fee:'}</span>
                  <strong className="text-emerald-700 font-extrabold text-xs">
                    {calculation.pricing.basePrice !== null
                      ? `${calculation.pricing.basePrice.toLocaleString()} ${language === 'ar' ? 'جنيه' : 'EGP'}`
                      : (language === 'ar' ? 'حسب الباقة' : 'Per package')}
                  </strong>
                </div>
              </div>

              <button
                onClick={() => handleCopy(quickAnswerText, 'mini-answer')}
                className="w-full py-1.5 px-2.5 rounded-lg bg-bc-navy-800 hover:bg-bc-navy-900 text-white text-[11px] font-bold flex items-center justify-center space-x-1.5 rtl:space-x-reverse transition-all shadow-sm"
              >
                {copiedId === 'mini-answer' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{language === 'ar' ? 'تم نسخ الرد للعميل!' : 'Copied Answer!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'نسخ الرد للمكالمة' : 'Copy Answer'}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* 2. INSTANT RATE CARD */}
        <div className="space-y-2.5">
          <div className="flex items-center space-x-1.5 rtl:space-x-reverse font-extrabold text-slate-900 text-xs">
            <Percent className="w-4 h-4 text-emerald-600" />
            <span>{language === 'ar' ? 'كارت الأسعار الموحد في ثواني' : 'Quick Rate Card'}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px]">{language === 'ar' ? 'ترم الشتوي (6–17)' : 'Winter Term'}</span>
              <strong className="text-slate-900 text-xs font-black">5,800 {language === 'ar' ? 'ج' : 'EGP'}</strong>
              <span className="text-[10px] text-amber-700 block font-semibold">+ 200 ج امتحان</span>
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200">
              <span className="text-emerald-900 block text-[10px]">{language === 'ar' ? 'ترم الحضانة (4–5)' : 'Early Years'}</span>
              <strong className="text-emerald-800 text-xs font-black">6,400 {language === 'ar' ? 'ج' : 'EGP'}</strong>
              <span className="text-[10px] text-emerald-700 block font-bold">بدون امتحان نهائياً</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px]">{language === 'ar' ? 'كبار 40 ساعة (قسط)' : 'Adult 40 Credits'}</span>
              <strong className="text-slate-900 text-xs font-black">10,000 {language === 'ar' ? 'ج' : 'EGP'}</strong>
              <span className="text-[10px] text-bc-teal-700 block font-semibold">متاح 6 و 12 شهر</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px]">{language === 'ar' ? 'كبار 60 ساعة (قسط)' : 'Adult 60 Credits'}</span>
              <strong className="text-slate-900 text-xs font-black">13,300 {language === 'ar' ? 'ج' : 'EGP'}</strong>
              <span className="text-[10px] text-bc-teal-700 block font-semibold">متاح 6 و 12 شهر</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-200 text-[11px] text-amber-950 font-medium">
            <strong>{language === 'ar' ? 'خصم الحزم:' : 'Bundles:'}</strong>{' '}
            {language === 'ar' ? 'ترمين 5% • 3 ترمات 10% • 4 ترمات 15%' : '2 terms 5% • 3 terms 10% • 4 terms 15%'}
          </div>
        </div>

        {/* 3. DIRECT CONTACT CHANNELS */}
        <div className="space-y-2">
          <div className="flex items-center space-x-1.5 rtl:space-x-reverse font-extrabold text-slate-900 text-xs">
            <PhoneCall className="w-4 h-4 text-emerald-600" />
            <span>{language === 'ar' ? 'أرقام وقنوات التحويل للعميل' : 'Direct Support Channels'}</span>
          </div>

          <div className="space-y-1.5">
            {/* WhatsApp */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-slate-800">
              <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="font-bold text-[11px]">{language === 'ar' ? 'واتساب:' : 'WhatsApp:'}</span>
                <span className="font-mono font-bold text-xs">{GENERAL_CONTACT_INFO.whatsappNumber}</span>
              </div>
              <button
                onClick={() => handleCopy(GENERAL_CONTACT_INFO.whatsappNumber, 'side-wa')}
                className="p-1 rounded text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100"
                title="Copy"
              >
                {copiedId === 'side-wa' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Email Support */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800">
              <div className="flex items-center space-x-1.5 rtl:space-x-reverse truncate mr-1">
                <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="font-mono text-[10px] truncate">support.englishonline@britishcouncil.org</span>
              </div>
              <button
                onClick={() => handleCopy('support.englishonline@britishcouncil.org', 'side-email')}
                className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-200 flex-shrink-0"
                title="Copy"
              >
                {copiedId === 'side-email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* 4. BRANCH WORKING HOURS */}
        <div className="space-y-2">
          <div className="flex items-center space-x-1.5 rtl:space-x-reverse font-extrabold text-slate-900 text-xs">
            <Clock className="w-4 h-4 text-bc-navy-800" />
            <span>{language === 'ar' ? 'مواعيد خدمة العملاء بالفروع' : 'Branch Working Hours'}</span>
          </div>

          <div className="space-y-1 text-[11px] text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <div className="flex justify-between border-b border-slate-200/60 pb-1">
              <span>{language === 'ar' ? 'العجوزة (AGU):' : 'Agouza:'}</span>
              <strong className="text-slate-900">10:00 AM – 7:00 PM</strong>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-1 pt-1">
              <span>{language === 'ar' ? 'سيتي ستارز (CTS):' : 'City Stars:'}</span>
              <strong className="text-slate-900">1:00 PM – 8:00 PM</strong>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-1 pt-1">
              <span>{language === 'ar' ? 'التجمع وأكتوبر:' : 'New Cairo & Oct:'}</span>
              <strong className="text-slate-900">12:00 PM – 7:00 PM</strong>
            </div>
            <div className="flex justify-between pt-1">
              <span>{language === 'ar' ? 'الإسكندرية (KLS):' : 'Alexandria:'}</span>
              <strong className="text-slate-900">11:00 AM – 6:00 PM</strong>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
