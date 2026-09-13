import React, { useState, useMemo } from 'react';
import {
  Building2,
  MapPin,
  Clock,
  Calendar,
  PhoneCall,
  Copy,
  Check,
  Search,
  User,
  ShieldCheck,
  ChevronDown,
  Mail,
} from 'lucide-react';
import { BRANCHES, GENERAL_CONTACT_INFO } from '../../data/branches';
import { useLanguage } from '../../i18n/LanguageContext';
import { PAGE_TRANSLATIONS } from '../../i18n/pageTranslations';

export const BranchesPage: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const pt = PAGE_TRANSLATIONS[language].branches;
  const common = PAGE_TRANSLATIONS[language].common;

  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState<'all' | 'cairo' | 'alex'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredBranches = useMemo(() => {
    return BRANCHES.filter((b) => {
      // City filter
      const isAlex = b.code.startsWith('ALX');
      if (cityFilter === 'alex' && !isAlex) return false;
      if (cityFilter === 'cairo' && isAlex) return false;

      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        b.name.toLowerCase().includes(q) ||
        b.address.toLowerCase().includes(q) ||
        b.code.toLowerCase().includes(q) ||
        (b.manager && b.manager.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, cityFilter]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-bc-navy-900">
            <Building2 className="w-7 h-7 text-emerald-600" />
            <h1 className="text-2xl font-black tracking-tight">{pt.title}</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {pt.subtitle}
          </p>
        </div>

        {/* Global WhatsApp Tag */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse bg-emerald-50 border border-emerald-300 px-3.5 py-2 rounded-xl text-emerald-900 text-xs font-bold self-start sm:self-auto shadow-sm">
          <PhoneCall className="w-4 h-4 text-emerald-600" />
          <span>{pt.quickHighlights.whatsappTitle}: {GENERAL_CONTACT_INFO.whatsappNumber}</span>
        </div>
      </div>

      {/* QUICK HIGHLIGHTS / TAKE (المفيد في ثواني للفروع) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block mb-0.5">
              {pt.quickHighlights.whatsappTitle}
            </span>
            <span className="text-xl font-black text-emerald-800 block">
              {pt.quickHighlights.whatsappValue}
            </span>
            <span className="text-[10px] text-emerald-700 block mt-0.5">
              {pt.quickHighlights.whatsappDesc}
            </span>
          </div>
          <button
            onClick={() => handleCopy(pt.quickHighlights.whatsappValue, 'wa-main')}
            className="p-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold flex items-center space-x-1 rtl:space-x-reverse transition-all"
            title="Copy WhatsApp"
          >
            {copiedId === 'wa-main' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/40 shadow-sm">
          <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block mb-0.5">
            {pt.quickHighlights.workingDaysTitle}
          </span>
          <span className="text-xl font-black text-slate-900 block">
            {pt.quickHighlights.workingDaysValue}
          </span>
          <span className="text-[10px] text-slate-600 block mt-0.5">
            {pt.quickHighlights.workingDaysDesc}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-purple-200 bg-purple-50/40 shadow-sm">
          <span className="text-[11px] font-bold text-purple-900 uppercase tracking-wider block mb-0.5">
            {pt.quickHighlights.branchesCountTitle}
          </span>
          <span className="text-xl font-black text-purple-900 block">
            {pt.quickHighlights.branchesCountValue}
          </span>
          <span className="text-[10px] text-slate-600 block mt-0.5">
            {pt.quickHighlights.branchesCountDesc}
          </span>
        </div>
      </div>

      {/* City Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* City Chips */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCityFilter('all')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              cityFilter === 'all'
                ? 'bg-bc-navy-800 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {pt.cityFilters.all}
          </button>
          <button
            onClick={() => setCityFilter('cairo')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              cityFilter === 'cairo'
                ? 'bg-bc-navy-800 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {pt.cityFilters.cairo}
          </button>
          <button
            onClick={() => setCityFilter('alex')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              cityFilter === 'alex'
                ? 'bg-bc-navy-800 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {pt.cityFilters.alex}
          </button>
        </div>

        {/* Instant Search input */}
        <div className="relative w-full sm:w-72">
          <Search className={`w-4 h-4 text-slate-400 absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={common.search}
            className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bc-teal-500 bg-white shadow-sm`}
          />
        </div>
      </div>

      {/* Branch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBranches.map((branch) => {
          const branchName = language === 'ar' && branch.nameAr ? branch.nameAr : branch.name;
          const branchAddress = language === 'ar' && branch.addressAr ? branch.addressAr : branch.address;
          const branchHours = language === 'ar' && branch.workingHoursAr ? branch.workingHoursAr : branch.workingHours;
          const branchDays = language === 'ar' && branch.workingDaysAr ? branch.workingDaysAr : branch.workingDays;

          return (
            <div
              key={branch.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-3 hover:border-bc-teal-400 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold bg-bc-navy-50 text-bc-navy-900 px-2 py-0.5 rounded border border-bc-navy-200">
                      {branch.code}
                    </span>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 mt-0.5">{branchName}</h3>
                  </div>

                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full border flex-shrink-0 ${
                      branch.customerServiceAvailable
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}
                  >
                    {branch.customerServiceAvailable
                      ? (language === 'ar' ? 'خدمة عملاء' : 'CS Desk')
                      : (language === 'ar' ? 'تدريس فقط' : 'Teaching Only')}
                  </span>
                </div>

                {/* Address with one-click copy */}
                <div className="text-xs text-slate-700 flex items-start space-x-2 rtl:space-x-reverse bg-slate-50/80 p-2 rounded-xl border border-slate-200/80">
                  <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <span className="block font-medium leading-snug line-clamp-2">{branchAddress}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(branchAddress, `addr-${branch.id}`)}
                      className="mt-1 text-bc-teal-700 hover:text-bc-teal-900 font-bold inline-flex items-center space-x-1 rtl:space-x-reverse text-[11px]"
                    >
                      {copiedId === `addr-${branch.id}` ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>{common.copied}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>{pt.cardLabels.copyAddress}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>
                    <strong className="text-slate-900">{pt.cardLabels.hours}:</strong> {branchHours}
                  </span>
                </div>

                {/* Manager */}
                {branch.manager && (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs text-slate-700">
                    <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>
                      <strong className="text-slate-900">{pt.cardLabels.manager}:</strong> {branch.manager}
                    </span>
                  </div>
                )}

                {/* Primary Email */}
                {branch.emails.length > 0 && (
                  <div className="flex items-center justify-between text-xs font-mono bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <div className="flex items-center space-x-1.5 rtl:space-x-reverse min-w-0">
                      <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate text-[11px] text-slate-800">{branch.emails[0]}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(branch.emails[0], `email-${branch.id}-0`)}
                      className="text-slate-500 hover:text-slate-800 flex items-center space-x-1 rtl:space-x-reverse text-[11px] font-sans font-bold flex-shrink-0 ml-1.5 rtl:mr-1.5 rtl:ml-0"
                    >
                      {copiedId === `email-${branch.id}-0` ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Expandable Details (التفاصيل) */}
              <details className="group pt-2 border-t border-slate-100 mt-2">
                <summary className="cursor-pointer text-xs font-bold text-bc-navy-900 hover:text-bc-teal-700 flex items-center justify-between list-none py-1 select-none transition-colors">
                  <span>{language === 'ar' ? '▸ التفاصيل (الأيام والمعلمين)' : '▸ Details & Staff'}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-open:rotate-180 transition-transform" />
                </summary>

                <div className="mt-2 space-y-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>
                      <strong className="text-slate-900">{pt.cardLabels.days}:</strong> {branchDays}
                    </span>
                  </div>

                  {branch.adultSeniorTeacher && (
                    <div>
                      <strong className="text-slate-900">{pt.cardLabels.seniorTeacher}:</strong> {branch.adultSeniorTeacher}
                    </div>
                  )}

                  {branch.ylSeniorTeacher && (
                    <div>
                      <strong className="text-slate-900">{language === 'ar' ? 'كبير معلمي الصغار:' : 'YL Senior Teacher:'}</strong> {branch.ylSeniorTeacher}
                    </div>
                  )}

                  {branch.emails.length > 1 && (
                    <div className="pt-1.5 border-t border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{language === 'ar' ? 'إيميلات بديلة:' : 'Additional Emails:'}</span>
                      {branch.emails.slice(1).map((em, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[11px] font-mono">
                          <span className="truncate">{em}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(em, `email-${branch.id}-${idx + 1}`)}
                            className="text-slate-400 hover:text-slate-700"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </details>
            </div>
          );
        })}
      </div>
    </div>
  );
};
