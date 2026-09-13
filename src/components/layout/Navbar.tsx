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

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md text-slate-800 border-b border-[#E6EAF0] shadow-subtle">
      <div className="w-full px-3 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* 1. Brand Logo & Title */}
          <div className="flex items-center space-x-2.5 rtl:space-x-reverse flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[#062A67] flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4 text-bc-teal-400" />
            </div>
            <div>
              <span className="text-sm sm:text-base font-black text-[#062A67] tracking-tight block">
                Sales Assistant
              </span>
            </div>
          </div>

          {/* 2. Quick Global Search Button */}
          <div className="flex-1 max-w-md mx-3 sm:mx-6 hidden md:block">
            <button
              type="button"
              onClick={onOpenSearch}
              className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-[#F7F9FC] border border-[#E6EAF0] text-slate-400 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-100/70 transition-all text-xs group"
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-bc-teal-600 transition-colors flex-shrink-0" />
                <span className="truncate">
                  {language === 'ar'
                    ? 'بحث سريع بالكورسات، الأسعار، المستويات، الفروع...'
                    : 'Search courses, fees, levels, branches...'}
                </span>
              </div>
              <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono bg-white border border-[#E6EAF0] rounded text-slate-400">
                Ctrl K
              </kbd>
            </button>
          </div>

          {/* 3. Right Status, Phone, and Language Toggle */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            {/* Mobile Search Trigger */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="p-1.5 md:hidden rounded-lg text-slate-600 hover:bg-slate-100 border border-[#E6EAF0]"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Online Status Pill */}
            <div className="flex items-center space-x-1.5 rtl:space-x-reverse px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span>{language === 'ar' ? 'متصل' : 'Online'}</span>
            </div>

            {/* Official WhatsApp/Phone Pill */}
            <a
              href={`https://wa.me/${GENERAL_CONTACT_INFO.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center space-x-1.5 rtl:space-x-reverse px-2.5 py-1 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-[#E6EAF0] text-[11px] font-bold transition-colors"
              title="WhatsApp Call Desk"
            >
              <PhoneCall className="w-3 h-3 text-emerald-600" />
              <span className="font-mono text-xs">{GENERAL_CONTACT_INFO.whatsappNumber}</span>
            </a>

            {/* Language Switcher Button */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex items-center space-x-1 rtl:space-x-reverse px-2.5 py-1 rounded-md bg-white hover:bg-slate-50 text-slate-700 border border-[#E6EAF0] font-bold text-xs transition-colors shadow-2xs"
              title="تغيير اللغة / Change Language"
            >
              <Languages className="w-3.5 h-3.5 text-slate-500" />
              <span>{language === 'ar' ? 'English' : 'عربي'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

