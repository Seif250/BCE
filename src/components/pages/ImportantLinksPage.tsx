import React, { useState } from 'react';
import {
  ExternalLink,
  ShieldCheck,
  Search,
  Compass,
  Star,
  Wrench,
  Lock,
  ChevronDown,
} from 'lucide-react';
import { IMPORTANT_LINKS } from '../../data/importantLinks';
import { CRM_TASK_CODES } from '../../data/crmAffiliates';
import { useLanguage } from '../../i18n/LanguageContext';
import { PAGE_TRANSLATIONS } from '../../i18n/pageTranslations';

export const ImportantLinksPage: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const pt = PAGE_TRANSLATIONS[language].importantLinks;
  const common = PAGE_TRANSLATIONS[language].common;

  const [search, setSearch] = useState<string>('');
  const [internalOpen, setInternalOpen] = useState<boolean>(false);

  // Group definitions
  const mostUsedIds = ['link-ziwo', 'link-sms', 'link-salesforce', 'link-cms3', 'link-paymob'];
  const toolIds = ['link-yl-calc', 'link-inst-calc'];

  const matchesSearch = (item: typeof IMPORTANT_LINKS[0]) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      (item.notes && item.notes.toLowerCase().includes(q))
    );
  };

  const mostUsedLinks = IMPORTANT_LINKS.filter((item) => mostUsedIds.includes(item.id) && matchesSearch(item));
  const toolsLinks = IMPORTANT_LINKS.filter((item) => toolIds.includes(item.id) && matchesSearch(item));
  const internalLinks = IMPORTANT_LINKS.filter((item) => !mostUsedIds.includes(item.id) && !toolIds.includes(item.id) && matchesSearch(item));

  // If user is searching, auto-expand internal section so search results are visible
  const isInternalExpanded = internalOpen || Boolean(search.trim());

  const renderLinkCard = (item: typeof IMPORTANT_LINKS[0], isCompact = false) => (
    <div
      key={item.id}
      className={`bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 flex flex-col justify-between hover:border-bc-teal-400 transition-colors ${
        isCompact ? 'space-y-2.5' : 'space-y-3'
      }`}
    >
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
            {item.category}
          </span>
          {item.url ? (
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              {language === 'ar' ? 'بوابة مباشرة' : 'Live Portal'}
            </span>
          ) : (
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
              {language === 'ar' ? 'مستند داخلي' : 'Internal Document'}
            </span>
          )}
        </div>

        <h3 className="font-extrabold text-slate-900 text-sm">{item.title}</h3>
        {item.notes && <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{item.notes}</p>}
      </div>

      <div className="pt-2 border-t border-slate-100">
        {item.url ? (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center space-x-1.5 rtl:space-x-reverse px-3 py-2 rounded-xl bg-bc-navy-900 hover:bg-bc-navy-800 text-white text-xs font-bold transition-all shadow-xs"
          >
            <span>{pt.openLink}</span>
            <ExternalLink className="w-3.5 h-3.5 text-bc-teal-300" />
          </a>
        ) : (
          <div className="w-full py-1.5 px-2 text-center text-[11px] text-slate-400 bg-slate-50 rounded-xl border border-slate-200 font-mono">
            {language === 'ar' ? 'عبر شيربوينت / تيمز الداخلي' : 'Access via Corporate Teams / SharePoint'}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-bc-navy-900">
            <Compass className="w-7 h-7 text-bc-navy-800" />
            <h1 className="text-2xl font-black tracking-tight">{pt.title}</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {pt.subtitle}
          </p>
        </div>

        {/* Instant Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className={`w-3.5 h-3.5 text-slate-400 absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2`} />
          <input
            type="text"
            placeholder={common.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full ${isRTL ? 'pr-8 pl-3' : 'pl-8 pr-3'} py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bc-teal-500 bg-white shadow-xs`}
          />
        </div>
      </div>

      {/* Security Privacy Notice */}
      <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200/80 text-xs text-slate-700 flex items-start space-x-2.5 rtl:space-x-reverse">
        <ShieldCheck className="w-4 h-4 text-bc-navy-800 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="text-slate-900 font-bold">{pt.securityBannerTitle}:</strong>
          <span className="leading-relaxed"> {pt.securityBannerDesc}</span>
        </div>
      </div>

      {/* SECTION 1: MOST USED (الأكثر استخداماً) */}
      {mostUsedLinks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              {language === 'ar' ? 'الأنظمة الأكثر استخداماً (Daily Core Platforms)' : 'Daily Core Platforms'}
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
              {mostUsedLinks.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
            {mostUsedLinks.map((item) => renderLinkCard(item))}
          </div>
        </div>
      )}

      {/* SECTION 2: TOOLS & CALCULATORS (أدوات وحاسبات) */}
      {toolsLinks.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Wrench className="w-4 h-4 text-bc-teal-600" />
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              {language === 'ar' ? 'أدوات وحاسبات رسمية (Tools & Calculators)' : 'Tools & Official Calculators'}
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-bc-teal-50 text-bc-teal-800 border border-bc-teal-200">
              {toolsLinks.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {toolsLinks.map((item) => renderLinkCard(item))}
          </div>
        </div>
      )}

      {/* SECTION 3: INTERNAL FORMS & CRM CODES (Collapsed by Default) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden pt-1">
        <button
          type="button"
          onClick={() => setInternalOpen(!internalOpen)}
          className="w-full p-4 flex items-center justify-between text-slate-800 font-bold hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Lock className="w-4 h-4 text-slate-500" />
            <span className="text-xs sm:text-sm font-black text-slate-800">
              {language === 'ar'
                ? '▸ نماذج وفِرق العمل والأرشيف الداخلي (Internal Forms & Team Rota)'
                : '▸ Internal Forms, Team Rota & Archives'}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
              {internalLinks.length + CRM_TASK_CODES.length} {language === 'ar' ? 'عنصر' : 'items'}
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform ${
              isInternalExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isInternalExpanded && (
          <div className="p-4 border-t border-slate-200 bg-slate-50/70 space-y-6">
            {/* Internal links grid */}
            {internalLinks.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {internalLinks.map((item) => renderLinkCard(item, true))}
              </div>
            )}

            {/* Internal CRM Task Codes Reference Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-xs font-black text-bc-navy-900 uppercase tracking-wider">
                  {language === 'ar' ? 'أكواد مهام خدمة العملاء CRM (مرجع تشغيلي داخلي)' : 'CRM Task Codes Reference (Internal Only)'}
                </h3>
                <span className="text-[10px] font-bold bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
                  {language === 'ar' ? 'داخلي للسيستم' : 'System Codes'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {CRM_TASK_CODES.map((t, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-mono font-bold text-bc-navy-900 block text-xs">{t.taskName}</span>
                    <div className="text-[11px] text-slate-600 space-y-0.5">
                      <div><strong>{language === 'ar' ? 'الكود المستخدم:' : 'Used Code:'}</strong> <code className="text-bc-teal-700 font-bold">{t.usedCode}</code></div>
                      <div><strong>{language === 'ar' ? 'عند الفوز:' : 'Won Code:'}</strong> <code className="text-emerald-700 font-bold">{t.wonCode}</code></div>
                      <div><strong>{language === 'ar' ? 'عند الخسارة:' : 'Lost Code:'}</strong> <code className="text-rose-700 font-bold">{t.lostCode}</code></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
