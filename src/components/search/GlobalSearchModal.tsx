import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  X,
  ArrowRight,
  GraduationCap,
  Snowflake,
  Sun,
  Building2,
  CreditCard,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { NavSection } from '../layout/Sidebar';
import { ADULT_COURSES } from '../../data/adultCourses';
import { WINTER_ACADEMIC_LEVELS, WINTER_AGE_GROUPS, WINTER_PRICING, IELTS_FOR_TEENS_INFO } from '../../data/winterCourses';
import { SUMMER_CAMPS } from '../../data/summerCamps';
import { BRANCHES } from '../../data/branches';
import { IMPORTANT_LINKS } from '../../data/importantLinks';
import { useLanguage } from '../../i18n/LanguageContext';

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  section: NavSection;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSection: (section: NavSection) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectSection,
}) => {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener for Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Build searchable index
  const searchIndex: SearchItem[] = useMemo(() => {
    const items: SearchItem[] = [];

    // 1. Adult Courses & Packages
    ADULT_COURSES.forEach((course) => {
      items.push({
        id: `adult-${course.id}`,
        title: course.name,
        subtitle: `${course.description} • PT: ${course.placementTest.fee} EGP`,
        section: 'adult',
        category: 'Adult Course',
        icon: GraduationCap,
      });

      course.packages.forEach((pkg) => {
        items.push({
          id: `adult-pkg-${pkg.id}`,
          title: `${course.name} — ${pkg.label}`,
          subtitle: `Fees: ${pkg.price.toLocaleString()} EGP • ${pkg.durationOrLevels}`,
          section: 'adult',
          category: 'Adult Package',
          icon: GraduationCap,
        });
      });
    });

    // 2. Winter Age Groups & Levels
    WINTER_AGE_GROUPS.forEach((grp) => {
      items.push({
        id: `winter-grp-${grp.id}`,
        title: grp.name,
        subtitle: `Ages ${grp.minAge}–${Math.floor(grp.maxAge)} • ${grp.description}`,
        section: 'winter',
        category: 'Winter Age Group',
        icon: Snowflake,
      });
    });

    WINTER_ACADEMIC_LEVELS.forEach((lvl) => {
      items.push({
        id: `winter-lvl-${lvl.id}`,
        title: lvl.name,
        subtitle: `${lvl.ageGroupName} • Summer Mapping: ${lvl.summerMapping || 'Not specified'}`,
        section: 'winter',
        category: 'Academic Level',
        icon: Snowflake,
      });
    });

    // IELTS for Teens
    items.push({
      id: 'ielts-teens',
      title: IELTS_FOR_TEENS_INFO.name,
      subtitle: `Ages 15–17 • Fee: ${IELTS_FOR_TEENS_INFO.winterFee} EGP • Min Level: Intermediate (B1)`,
      section: 'winter',
      category: 'Special Course',
      icon: GraduationCap,
    });

    // 3. Summer Camps
    SUMMER_CAMPS.forEach((camp) => {
      items.push({
        id: `summer-camp-${camp.campNumber}`,
        title: camp.name,
        subtitle: `${camp.displayDates} • ${camp.durationHours}h over 2 weeks • Sun–Thu`,
        section: 'summer',
        category: 'Summer Camp',
        icon: Sun,
      });
    });

    // 4. Branches
    BRANCHES.forEach((b) => {
      items.push({
        id: `branch-${b.id}`,
        title: `${b.name} Branch`,
        subtitle: `${b.address} • Hours: ${b.workingHours}`,
        section: 'branches',
        category: 'Branch',
        icon: Building2,
      });
    });

    // 5. Installments
    items.push({
      id: 'inst-adult',
      title: 'Adult Installments (6 or 12 Months)',
      subtitle: 'Valid for 40 & 60 credits packages • 9% for 6M, 15% for 12M admin expense',
      section: 'installments',
      category: 'Installments',
      icon: CreditCard,
    });
    items.push({
      id: 'inst-yl',
      title: 'Young Learner Installments (2+ Terms)',
      subtitle: 'No installment for 1 term; bookings must start from 2 terms',
      section: 'installments',
      category: 'Installments',
      icon: CreditCard,
    });

    // 6. Important Links
    IMPORTANT_LINKS.forEach((link) => {
      items.push({
        id: `link-${link.id}`,
        title: link.title,
        subtitle: `${link.category} • ${link.notes || 'Internal link'}`,
        section: 'links',
        category: 'Important Link',
        icon: ExternalLink,
      });
    });

    return items;
  }, []);

  // Filtered search results
  const filteredItems = useMemo(() => {
    if (!query.trim()) {
      return searchIndex.slice(0, 8); // show popular initial suggestions
    }
    const q = query.toLowerCase();
    return searchIndex
      .filter((item) => item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q) || item.category.toLowerCase().includes(q))
      .slice(0, 15);
  }, [query, searchIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 md:p-20 flex justify-center">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-fade-in flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="relative border-b border-slate-200 p-4 bg-slate-50 flex items-center">
          <Search className="w-5 h-5 text-bc-teal-600 mr-3 rtl:mr-0 rtl:ml-3 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none text-base font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="ml-2 rtl:ml-0 rtl:mr-2 hidden sm:inline-block px-2 py-0.5 text-xs font-mono bg-white border border-slate-300 rounded text-slate-500 shadow-sm">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-100">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              {language === 'ar'
                ? `لا توجد نتائج مطابقة لـ "${query}"`
                : `No results found for "${query}"`}
            </div>
          ) : (
            filteredItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectSection(item.section);
                    onClose();
                  }}
                  className="w-full text-left rtl:text-right p-3 rounded-lg hover:bg-slate-100/80 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3 rtl:space-x-reverse truncate">
                    <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-bc-teal-500 group-hover:text-white text-slate-600 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-sm font-bold text-slate-900 group-hover:text-bc-navy-900 truncate">
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-500 truncate">{item.subtitle}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 rtl:space-x-reverse flex-shrink-0 ml-3 rtl:ml-0 rtl:mr-3">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {item.category}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-bc-teal-600 transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-all" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>
            {language === 'ar'
              ? 'اضغط على أي نتيجة للانتقال للقسم المطلوب مباشرة'
              : 'Click any item to open the corresponding section'}
          </span>
          <span className="text-[11px] font-mono text-slate-400">Ctrl + K / Cmd + K</span>
        </div>
      </div>
    </div>
  );
};
