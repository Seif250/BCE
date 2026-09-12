import React from 'react';
import { Search, ShieldCheck, PhoneCall, Clock, Languages } from 'lucide-react';
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
    <header className="sticky top-0 z-30 bg-bc-navy-800 text-white border-b border-bc-navy-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Logo */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-9 h-9 rounded-lg bg-bc-teal-500 flex items-center justify-center font-extrabold text-bc-navy-950 text-xl tracking-tighter shadow-sm flex-shrink-0">
              BC
            </div>
            <div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="font-bold text-base sm:text-lg tracking-tight text-white">
                  {t.brandTitle}
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-bc-teal-500/20 text-bc-teal-300 border border-bc-teal-400/30">
                  {language === 'ar' ? 'مصر' : 'Sales Assistant'}
                </span>
              </div>
              <p className="text-xs text-slate-300 hidden sm:block">
                {t.brandSubtitle}
              </p>
            </div>
          </div>

          {/* Quick Global Search Button */}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <button
              onClick={onOpenSearch}
              className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-bc-navy-900/80 border border-bc-navy-600/70 text-slate-300 hover:text-white hover:border-bc-teal-400/60 hover:bg-bc-navy-900 transition-all text-sm shadow-inner group"
            >
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-bc-teal-400 group-hover:scale-110 transition-transform" />
                <span>Search courses, levels, fees, branches...</span>
              </div>
              <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-xs font-mono bg-bc-navy-800 border border-bc-navy-600 rounded text-slate-400">
                Ctrl + K
              </kbd>
            </button>
          </div>

          {/* Right Status & Quick Contacts */}
          <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
            {/* Language Switcher Button (Prominent) */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-lg bg-bc-teal-500 hover:bg-bc-teal-400 text-bc-navy-950 font-extrabold text-xs transition-all shadow-sm hover:shadow"
              title="تغيير اللغة / Change Language"
            >
              <Languages className="w-4 h-4" />
              <span>{t.langSwitchButton}</span>
            </button>

            <button
              onClick={onOpenSearch}
              className="p-2 md:hidden rounded-lg bg-bc-navy-700/60 text-slate-200 hover:text-white"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* WhatsApp Quick Tag */}
            <div className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-medium">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>{GENERAL_CONTACT_INFO.whatsappNumber}</span>
            </div>

            {/* Date Tag */}
            <div className="hidden sm:flex items-center space-x-1.5 text-xs text-slate-300 bg-bc-navy-900/60 px-2.5 py-1 rounded-md border border-bc-navy-700">
              <Clock className="w-3.5 h-3.5 text-bc-teal-400" />
              <span>{todayFormatted}</span>
            </div>

            {/* Offline Ready Badge */}
            <div className="hidden sm:flex items-center space-x-1 text-xs text-bc-teal-300 bg-bc-teal-950/50 border border-bc-teal-500/40 px-2 py-1 rounded-md">
              <ShieldCheck className="w-3.5 h-3.5 text-bc-teal-400" />
              <span>{t.offlineReady}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
