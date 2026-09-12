import React from 'react';
import {
  Calculator,
  GraduationCap,
  Snowflake,
  Sun,
  Percent,
  Building2,
  CreditCard,
  ExternalLink,
  BookOpen,
  Settings,
  X,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export type NavSection =
  | 'calculator'
  | 'adult'
  | 'winter'
  | 'summer'
  | 'pricing'
  | 'branches'
  | 'installments'
  | 'links'
  | 'quick-ref'
  | 'settings';

interface SidebarProps {
  currentSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: NavSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSelectSection,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { t, isRTL, language } = useLanguage();

  const navItems: NavItem[] = [
    {
      id: 'calculator',
      label: t.navCalculator,
      icon: Calculator,
      badge: language === 'ar' ? 'الرئيسية' : 'Hero Tool',
      badgeColor: 'bg-bc-teal-500/20 text-bc-teal-700 border-bc-teal-300',
    },
    {
      id: 'adult',
      label: t.navAdult,
      icon: GraduationCap,
      badge: language === 'ar' ? '٤ باقات' : '4 Products',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      id: 'winter',
      label: t.navWinter,
      icon: Snowflake,
      badge: language === 'ar' ? '٤ ترمات' : '4 Terms',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    },
    {
      id: 'summer',
      label: t.navSummer,
      icon: Sun,
      badge: language === 'ar' ? '٣ معسكرات' : '3 Camps',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      id: 'pricing',
      label: t.navPricing,
      icon: Percent,
    },
    {
      id: 'branches',
      label: t.navBranches,
      icon: Building2,
      badge: language === 'ar' ? '٦ فروع' : '6 Centers',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'installments',
      label: t.navInstallments,
      icon: CreditCard,
    },
    {
      id: 'links',
      label: t.navLinks,
      icon: ExternalLink,
      badge: language === 'ar' ? 'داخلي' : 'Internal',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    },
    {
      id: 'quick-ref',
      label: t.navQuickRef,
      icon: BookOpen,
      badge: language === 'ar' ? 'مهم' : 'Cheat Sheet',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      id: 'settings',
      label: t.navSettings,
      icon: Settings,
    },
  ];

  const handleSelect = (id: NavSection) => {
    onSelectSection(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 z-40 w-64 bg-white shadow-sm flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isRTL
            ? `right-0 border-l border-slate-200 ${isOpenMobile ? 'translate-x-0' : 'translate-x-full'}`
            : `left-0 border-r border-slate-200 ${isOpenMobile ? 'translate-x-0' : '-translate-x-full'}`
        }`}
      >
        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="flex items-center justify-between px-2 mb-2 lg:hidden">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {language === 'ar' ? 'القائمة' : 'Navigation'}
            </span>
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {language === 'ar' ? 'عمليات المبيعات وخدمة العملاء' : 'Call Center Operations'}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left rtl:text-right ${
                  isActive
                    ? 'bg-bc-navy-900 text-white shadow-md ring-1 ring-bc-navy-700'
                    : 'text-slate-700 hover:bg-slate-100/90 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-3 rtl:space-x-reverse truncate">
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 ${
                      isActive ? 'text-bc-teal-400' : 'text-slate-500'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`ml-2 rtl:ml-0 rtl:mr-2 px-1.5 py-0.5 text-[10px] font-bold rounded-md border ${
                      isActive
                        ? 'bg-bc-navy-950 text-bc-teal-300 border-bc-navy-800'
                        : item.badgeColor || 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Source & Version Footer */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 space-y-1">
          <div className="flex items-center justify-between font-bold text-slate-700">
            <span>{language === 'ar' ? 'مصدر البيانات' : 'Data Source'}</span>
            <span className="text-emerald-700 font-mono text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>{language === 'ar' ? 'معتمد رسمياً' : 'Verified'}</span>
            </span>
          </div>
          <p className="truncate text-slate-700 font-mono text-[10px]" title="EG outbound Knowledge base.xlsx">
            EG outbound Knowledge base.xlsx
          </p>
          <div className="text-[10px] text-slate-400">
            {language === 'ar' ? 'نظام سريع فوري • متوافق مع كافة الأجهزة' : 'High-speed frontend • Zero backend delay'}
          </div>
        </div>
      </aside>
    </>
  );
};
