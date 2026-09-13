import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, NavSection } from './components/layout/Sidebar';
import { LiveCallCompanion } from './components/layout/LiveCallCompanion';
import { StudentCalculator } from './components/calculator/StudentCalculator';
import { AdultPage } from './components/pages/AdultPage';
import { WinterPage } from './components/pages/WinterPage';
import { SummerPage } from './components/pages/SummerPage';
import { BranchesPage } from './components/pages/BranchesPage';
import { InstallmentsPage } from './components/pages/InstallmentsPage';
import { ImportantLinksPage } from './components/pages/ImportantLinksPage';
import { QuickReferencePage } from './components/pages/QuickReferencePage';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';
import {
  Menu,
  Maximize2,
  Columns,
} from 'lucide-react';

function MainApp() {
  const [currentSection, setCurrentSection] = useState<NavSection>('calculator');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFullWidth, setIsFullWidth] = useState<boolean>(() => {
    const saved = localStorage.getItem('bce_full_width');
    return saved === 'true';
  });

  const { t, isRTL, language } = useLanguage();

  const toggleFullWidth = () => {
    setIsFullWidth((prev) => {
      const next = !prev;
      localStorage.setItem('bce_full_width', String(next));
      return next;
    });
  };

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top Navbar */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        activeSection={currentSection}
      />

      {/* Main App Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left/Right Navigation Sidebar */}
        <Sidebar
          currentSection={currentSection}
          onSelectSection={setCurrentSection}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Spacious Content Area */}
        <main
          className={`flex-1 ${
            isRTL ? 'lg:mr-64' : 'lg:ml-64'
          } p-4 sm:p-6 lg:p-8 overflow-y-auto w-full transition-all`}
        >
          {/* Mobile Top Bar */}
          <div className="mb-4 flex items-center justify-between lg:hidden bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center space-x-2 rtl:space-x-reverse"
            >
              <Menu className="w-5 h-5 text-bc-navy-800" />
              <span className="text-xs font-bold uppercase tracking-wider">
                {language === 'ar' ? 'القائمة' : 'Menu'}
              </span>
            </button>

            <span className="text-sm font-black text-bc-navy-900 capitalize">
              {currentSection.replace('-', ' ')}
            </span>
          </div>

          {/* Desktop Top Utilities Bar: Full Width Toggle */}
          <div className="hidden xl:flex items-center justify-end mb-4">
            <button
              onClick={toggleFullWidth}
              className="flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-xl text-xs font-bold transition-all bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs"
              title={
                isFullWidth
                  ? (language === 'ar' ? 'إظهار المساعد السريع للمكالمة' : 'Show Live Companion')
                  : (language === 'ar' ? 'توسيع الصفحة بكامل الشاشة' : 'Expand to Full Width')
              }
            >
              {isFullWidth ? (
                <>
                  <Columns className="w-3.5 h-3.5 text-bc-teal-600" />
                  <span>{language === 'ar' ? 'المساعد السريع للمكالمة' : 'Live Companion'}</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-bc-navy-800" />
                  <span>{language === 'ar' ? 'ملء الشاشة' : 'Full Width'}</span>
                </>
              )}
            </button>
          </div>

          {/* Main Layout Grid: Main Content + Optional Live Companion */}
          <div className="flex gap-6 items-start w-full">
            {/* Active View Router */}
            <div className="flex-1 min-w-0 animate-fade-in space-y-6">
              {currentSection === 'calculator' && <StudentCalculator />}
              {currentSection === 'adult' && <AdultPage />}
              {currentSection === 'winter' && <WinterPage />}
              {currentSection === 'summer' && <SummerPage />}
              {currentSection === 'branches' && <BranchesPage />}
              {currentSection === 'installments' && <InstallmentsPage />}
              {currentSection === 'links' && <ImportantLinksPage />}
              {currentSection === 'quick-ref' && <QuickReferencePage />}
            </div>

            {/* Live Call Companion Widget (Fills the wide space on screens >= 1280px) */}
            {!isFullWidth && (
              <div className="hidden xl:block sticky top-2">
                <LiveCallCompanion
                  onToggleFullWidth={toggleFullWidth}
                  isFullWidth={isFullWidth}
                />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectSection={(section) => setCurrentSection(section)}
      />
    </div>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}

export default App;
