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
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold bg-bc-navy-50 text-bc-navy-900 px-2 py-0.5 rounded border border-bc-navy-200">
                      {branch.code}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1">{branchName}</h3>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${
                      branch.customerServiceAvailable
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}
                  >
                    {branch.customerServiceAvailable
                      ? (language === 'ar' ? 'مكتب خدمة عملاء نشط' : 'CS Desk Active')
                      : (language === 'ar' ? 'بدون مكتب خدمة عملاء' : 'No CS Desk')}
                  </span>
                </div>

                {/* Address with one-click copy */}
                <div className="text-xs text-slate-700 flex items-start space-x-2 rtl:space-x-reverse bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="block font-medium leading-relaxed">{branchAddress}</span>
                    <button
                      onClick={() => handleCopy(branchAddress, `addr-${branch.id}`)}
                      className="mt-1.5 text-bc-teal-700 hover:text-bc-teal-900 font-bold inline-flex items-center space-x-1 rtl:space-x-reverse text-[11px]"
                    >
                      {copiedId === `addr-${branch.id}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{common.copied}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{pt.cardLabels.copyAddress}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Working Hours & Days */}
                <div className="space-y-1.5 text-xs text-slate-700 pt-1">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>
                      <strong className="text-slate-900">{pt.cardLabels.hours}</strong> {branchHours}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>
                      <strong className="text-slate-900">{pt.cardLabels.days}</strong> {branchDays}
                    </span>
                  </div>
                </div>

              {/* Personnel (Manager & Senior Teachers) */}
              {(branch.manager || branch.adultSeniorTeacher) && (
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                  {branch.manager && (
                    <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-slate-800">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {pt.cardLabels.manager} <strong>{branch.manager}</strong>
                      </span>
                    </div>
                  )}
                  {branch.adultSeniorTeacher && (
                    <div className="text-[11px] text-slate-600">
                      {pt.cardLabels.seniorTeacher} {branch.adultSeniorTeacher}
                    </div>
                  )}
                  {branch.ylSeniorTeacher && (
                    <div className="text-[11px] text-slate-600">
                      {language === 'ar' ? 'كبير معلمي الصغار:' : 'YL Senior Teacher:'} {branch.ylSeniorTeacher}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Email Contact with Copy */}
            {branch.emails.length > 0 && (
              <div className="pt-3 border-t border-slate-100 text-[11px] space-y-1">
                <span className="text-slate-500 font-bold block">{pt.cardLabels.email}</span>
                {branch.emails.map((email, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between font-mono text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-200"
                  >
                    <span className="truncate mr-2 rtl:ml-2 rtl:mr-0 text-xs">{email}</span>
                    <button
                      onClick={() => handleCopy(email, `email-${branch.id}-${idx}`)}
                      className="text-slate-500 hover:text-slate-800 flex items-center space-x-1 rtl:space-x-reverse font-sans text-[11px]"
                      title={pt.cardLabels.copyEmail}
                    >
                      {copiedId === `email-${branch.id}-${idx}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
      </div>
    </div>
  );
};
