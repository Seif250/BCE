import React from 'react';
import { Search, ShieldCheck, PhoneCall, Clock, Languages, Sparkles } from 'lucide-react';
import { GENERAL_CONTACT_INFO } from '../../data/branches';
import { useLanguage } from '../../i18n/LanguageContext';

interface NavbarProps {
  onOpenSearch: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const { language, toggleLanguage, t } = useLanguage();

  const todayFormatted = new Date().toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <header className="sticky top-0 z-30 bg-bc-navy-950/95 backdrop-blur-md text-white border-b border-bc-navy-800 shadow-lg">
      <div className="w-full px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Logo (Official British Council Styling) */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse flex-shrink-0">
            {/* Iconic British Council Official Logo Image */}
            <div className="relative flex-shrink-0">
              <img
                src="/bc-logo.png"
                alt="British Council"
                className="w-10 h-10 rounded-xl object-contain shadow-md border border-white/20 hover:scale-105 transition-transform"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-bc-navy-950 rounded-full animate-pulse"></span>
            </div>

            <div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="font-black text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5">
                  <span>BRITISH COUNCIL</span>
                </span>
                <span className="inline-flex items-center space-x-1 rtl:space-x-reverse px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>{language === 'ar' ? 'نظام مصر المعتمد ٢٠٢٦' : 'Egypt Portal 2026'}</span>
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-bc-teal-300 font-medium hidden sm:block">
                {language === 'ar'
                  ? 'بوابة المبيعات وحساب الأسعار الفورية لمكالمات العملاء'
                  : 'Outbound Sales & Live Call Knowledge Base'}
              </p>
            </div>
          </div>

          {/* Quick Global Search Button */}
          <div className="flex-1 max-w-lg mx-4 hidden md:block">
            <button
              onClick={onOpenSearch}
              className="w-full flex items-center justify-between px-4 py-2 rounded-xl bg-bc-navy-900/90 border border-bc-navy-700/90 text-slate-300 hover:text-white hover:border-bc-teal-400/80 hover:bg-bc-navy-900 transition-all text-xs sm:text-sm shadow-inner group"
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Search className="w-4 h-4 text-bc-teal-400 group-hover:scale-110 transition-transform flex-shrink-0" />
                <span className="truncate">
                  {language === 'ar'
                    ? 'بحث سريع بالكورسات، الأسعار، المستويات، الفروع...'
                    : 'Search courses, levels, fees, branches...'}
                </span>
              </div>
              <kbd className="hidden lg:inline-flex items-center px-2 py-0.5 text-[11px] font-mono bg-bc-navy-950 border border-bc-navy-700 rounded-md text-slate-300 shadow-sm">
                Ctrl + K
              </kbd>
            </button>
          </div>

          {/* Right Status & Quick Contacts */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            {/* Language Switcher Button (Prominent Luxury Style) */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-xl bg-gradient-to-r from-bc-teal-500 to-bc-teal-400 hover:from-bc-teal-400 hover:to-bc-teal-300 text-bc-navy-950 font-black text-xs transition-all shadow-md hover:scale-105 active:scale-95"
              title="تغيير اللغة / Change Language"
            >
              <Languages className="w-4 h-4" />
              <span>{t.langSwitchButton}</span>
            </button>

            <button
              onClick={onOpenSearch}
              className="p-2 md:hidden rounded-xl bg-bc-navy-800 text-slate-200 hover:text-white border border-bc-navy-700"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* WhatsApp Quick Tag */}
            <a
              href={`https://wa.me/${GENERAL_CONTACT_INFO.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="hidden 2xl:flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-semibold hover:bg-emerald-900/60 transition-colors"
              title="رقم واتساب المبيعات الرسمي"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono">{GENERAL_CONTACT_INFO.whatsappNumber}</span>
            </a>

            {/* Date Tag */}
            <div className="hidden xl:flex items-center space-x-1.5 rtl:space-x-reverse text-xs text-slate-300 bg-bc-navy-900/80 px-3 py-1.5 rounded-xl border border-bc-navy-800">
              <Clock className="w-3.5 h-3.5 text-bc-teal-400" />
              <span>{todayFormatted}</span>
            </div>

            {/* Offline Ready Badge */}
            <div className="hidden sm:flex items-center space-x-1.5 rtl:space-x-reverse text-xs text-bc-teal-300 bg-bc-teal-950/60 border border-bc-teal-500/40 px-2.5 py-1.5 rounded-xl">
              <ShieldCheck className="w-3.5 h-3.5 text-bc-teal-400" />
              <span>{t.offlineReady}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

