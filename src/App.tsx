import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { ToastProvider } from './components/ui/ToastContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, NavSection } from './components/layout/Sidebar';
import { StudentCalculator } from './components/calculator/StudentCalculator';
import { AdultPage } from './components/pages/AdultPage';
import { WinterPage } from './components/pages/WinterPage';
import { SummerPage } from './components/pages/SummerPage';
import { BranchesPage } from './components/pages/BranchesPage';
import { InstallmentsPage } from './components/pages/InstallmentsPage';
import { ImportantLinksPage } from './components/pages/ImportantLinksPage';
import { QuickReferencePage } from './components/pages/QuickReferencePage';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';
import { Menu } from 'lucide-react';

function MainApp() {
  const [currentSection, setCurrentSection] = useState<NavSection>('calculator');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(() => {
    const saved = localStorage.getItem('bce_sidebar_expanded');
    return saved === 'true';
  });

  const { t, isRTL, language } = useLanguage();

  const toggleSidebarExpand = () => {
    setIsSidebarExpanded((prev) => {
      const next = !prev;
      localStorage.setItem('bce_sidebar_expanded', String(next));
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
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col font-sans text-slate-900">
      {/* Top Navbar */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        activeSection={currentSection}
      />

      {/* Main App Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left/Right Modern Slim Sidebar */}
        <Sidebar
          currentSection={currentSection}
          onSelectSection={setCurrentSection}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          isExpanded={isSidebarExpanded}
          onToggleExpand={toggleSidebarExpand}
        />

        {/* Content Area with 25-30% reduced padding */}
        <main
          className={`flex-1 ${
            isSidebarExpanded
              ? isRTL ? 'lg:mr-60' : 'lg:ml-60'
              : isRTL ? 'lg:mr-[72px]' : 'lg:ml-[72px]'
          } p-3 sm:p-4 lg:p-5 overflow-y-auto w-full transition-all`}
        >
          {/* Mobile Top Bar */}
          <div className="mb-3 flex items-center justify-between lg:hidden bg-white p-2.5 rounded-xl border border-[#E6EAF0] shadow-subtle">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center space-x-1.5 rtl:space-x-reverse"
            >
              <Menu className="w-5 h-5 text-bc-navy-800" />
              <span className="text-xs font-bold uppercase tracking-wider">
                {language === 'ar' ? 'القائمة' : 'Menu'}
              </span>
            </button>

            <span className="text-xs font-black text-bc-navy-900 capitalize">
              {currentSection.replace('-', ' ')}
            </span>
          </div>

          {/* Main Layout: Active View Router */}
          <div className="w-full animate-fade-in space-y-4">
            {currentSection === 'calculator' && <StudentCalculator />}
            {currentSection === 'adult' && <AdultPage />}
            {currentSection === 'winter' && <WinterPage />}
            {currentSection === 'summer' && <SummerPage />}
            {currentSection === 'branches' && <BranchesPage />}
            {currentSection === 'installments' && <InstallmentsPage />}
            {currentSection === 'links' && <ImportantLinksPage />}
            {currentSection === 'quick-ref' && <QuickReferencePage />}
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
      <ToastProvider>
        <MainApp />
      </ToastProvider>
    </LanguageProvider>
  );
}

export default App;
