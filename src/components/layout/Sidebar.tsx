import React, { useState, useEffect } from 'react';
import {
  Calculator,
  GraduationCap,
  Snowflake,
  Sun,
  Building2,
  CreditCard,
  ExternalLink,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export type NavSection =
  | 'calculator'
  | 'adult'
  | 'winter'
  | 'summer'
  | 'branches'
  | 'installments'
  | 'links'
  | 'quick-ref';

interface SidebarProps {
  currentSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

interface NavItem {
  id: NavSection;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  isHero?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSelectSection,
  isOpenMobile,
  onCloseMobile,
  isExpanded,
  onToggleExpand,
}) => {
  const { t, isRTL, language } = useLanguage();

  const primaryItems: NavItem[] = [
    {
      id: 'calculator',
      label: language === 'ar' ? 'حاسبة الطالب' : 'Student Calculator',
      shortLabel: language === 'ar' ? 'الحاسبة' : 'Calc',
      icon: Calculator,
      isHero: true,
    },
    {
      id: 'adult',
      label: language === 'ar' ? 'أسعار الكبار' : 'Adult English',
      shortLabel: language === 'ar' ? 'الكبار' : 'Adult',
      icon: GraduationCap,
    },
    {
      id: 'winter',
      label: language === 'ar' ? 'أسعار الشتوي' : 'Winter Block',
      shortLabel: language === 'ar' ? 'الشتوي' : 'Winter',
      icon: Snowflake,
    },
    {
      id: 'summer',
      label: language === 'ar' ? 'معسكرات الصيف' : 'Summer School',
      shortLabel: language === 'ar' ? 'الصيف' : 'Summer',
      icon: Sun,
    },
    {
      id: 'branches',
      label: language === 'ar' ? 'الفروع والمواعيد' : 'Branches & Hours',
      shortLabel: language === 'ar' ? 'الفروع' : 'Branches',
      icon: Building2,
    },
    {
      id: 'installments',
      label: language === 'ar' ? 'التقسيط بالفيزا' : 'Installments',
      shortLabel: language === 'ar' ? 'التقسيط' : 'Installments',
      icon: CreditCard,
    },
  ];

  const secondaryItems: NavItem[] = [
    {
      id: 'quick-ref',
      label: language === 'ar' ? 'إجابات المكالمات' : 'Call Q&A',
      shortLabel: language === 'ar' ? 'الإجابات' : 'Q&A',
      icon: BookOpen,
    },
    {
      id: 'links',
      label: language === 'ar' ? 'روابط النظام' : 'System Portals',
      shortLabel: language === 'ar' ? 'الروابط' : 'Links',
      icon: ExternalLink,
    },
  ];

  const handleSelect = (id: NavSection) => {
    onSelectSection(id);
    onCloseMobile();
  };

  const renderNavButton = (item: NavItem) => {
    const Icon = item.icon;
    const isActive = currentSection === item.id;

    return (
      <div key={item.id} className="relative group/nav">
        <button
          type="button"
          onClick={() => handleSelect(item.id)}
          className={`w-full flex items-center ${
            isExpanded ? 'px-3.5 py-2.5 justify-start space-x-3 rtl:space-x-reverse' : 'p-3 justify-center'
          } rounded-xl text-xs font-bold transition-all relative ${
            isActive
              ? 'bg-[#062A67] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
          }`}
          title={!isExpanded ? item.label : undefined}
        >
          {/* Hero Indicator Dot */}
          {item.isHero && (
            <span className={`w-1.5 h-1.5 rounded-full absolute ${isExpanded ? 'top-3 right-3 rtl:right-auto rtl:left-3' : 'top-1.5 right-1.5'} ${isActive ? 'bg-bc-teal-400' : 'bg-amber-400'}`} />
          )}

          <Icon
            className={`w-[18px] h-[18px] flex-shrink-0 transition-transform group-hover/nav:scale-105 ${
              isActive ? 'text-bc-teal-300' : item.isHero ? 'text-[#062A67]' : 'text-slate-500'
            }`}
          />

          {isExpanded && (
            <span className="truncate text-xs font-bold tracking-tight">
              {item.label}
            </span>
          )}
        </button>

        {/* Hover Tooltip (shown only when collapsed on desktop) */}
        {!isExpanded && (
          <div
            className={`hidden lg:group-hover/nav:flex fixed z-50 px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold shadow-lg pointer-events-none whitespace-nowrap animate-fade-in ${
              isRTL ? '-translate-x-full mr-2' : 'translate-x-0 ml-2'
            }`}
            style={{
              [isRTL ? 'right' : 'left']: '76px',
            }}
          >
            {item.label}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-14 bottom-0 z-40 ${
          isExpanded ? 'w-60' : 'w-[72px]'
        } bg-white flex flex-col justify-between transition-all duration-200 ease-in-out border-[#E6EAF0] lg:translate-x-0 ${
          isRTL
            ? `right-0 border-l ${isOpenMobile ? 'translate-x-0 w-64' : 'translate-x-full lg:translate-x-0'}`
            : `left-0 border-r ${isOpenMobile ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}`
        }`}
      >
        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-1">
          {/* Mobile Header */}
          <div className="flex items-center justify-between px-2 mb-2 lg:hidden">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {language === 'ar' ? 'القائمة' : 'Navigation'}
            </span>
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Primary Core Sections */}
          <div className="space-y-1">
            {primaryItems.map(renderNavButton)}
          </div>

          {/* Subtle Section Divider */}
          <div className="my-2 border-t border-[#E6EAF0]" />

          {/* Secondary Reference Sections */}
          <div className="space-y-1">
            {secondaryItems.map(renderNavButton)}
          </div>
        </div>

        {/* Sidebar Footer: Expand / Collapse Toggle (Desktop only) */}
        <div className="p-2.5 border-t border-[#E6EAF0] bg-[#F7F9FC]/60 hidden lg:flex items-center justify-between">
          <button
            type="button"
            onClick={onToggleExpand}
            className={`w-full flex items-center ${
              isExpanded ? 'justify-between px-2.5' : 'justify-center'
            } py-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-white text-xs font-bold transition-all border border-transparent hover:border-[#E6EAF0]`}
            title={isExpanded ? (language === 'ar' ? 'طي القائمة' : 'Collapse') : (language === 'ar' ? 'توسيع القائمة' : 'Expand')}
          >
            {isExpanded ? (
              <>
                <span className="text-[11px] text-slate-500">
                  {language === 'ar' ? 'تصغير الشريط' : 'Collapse'}
                </span>
                {isRTL ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
              </>
            ) : (
              isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
