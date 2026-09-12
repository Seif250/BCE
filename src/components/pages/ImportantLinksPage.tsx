import React, { useState } from 'react';
import {
  ExternalLink,
  ShieldCheck,
  Search,
  Compass,
} from 'lucide-react';
import { IMPORTANT_LINKS } from '../../data/importantLinks';
import { CRM_TASK_CODES, CRM_COMPLAINT_QUEUES } from '../../data/crmAffiliates';
import { useLanguage } from '../../i18n/LanguageContext';
import { PAGE_TRANSLATIONS } from '../../i18n/pageTranslations';

export const ImportantLinksPage: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const pt = PAGE_TRANSLATIONS[language].importantLinks;
  const common = PAGE_TRANSLATIONS[language].common;

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const categories = [
    { id: 'all', label: pt.categoryTabs.all },
    { id: 'Platform', label: pt.categoryTabs.platform },
    { id: 'Finance & Installments', label: pt.categoryTabs.finance },
    { id: 'Internal Forms & Archive', label: pt.categoryTabs.internal },
    { id: 'Team & Rota', label: pt.categoryTabs.team },
  ];

  const filteredLinks = IMPORTANT_LINKS.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      !search.trim() ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-3">
        <div className="flex items-center space-x-2 rtl:space-x-reverse text-bc-navy-900">
          <Compass className="w-7 h-7 text-bc-navy-800" />
          <h1 className="text-2xl font-black tracking-tight">{pt.title}</h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {pt.subtitle}
        </p>
      </div>

      {/* Security Privacy Notice */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-300/80 text-xs text-slate-700 flex items-start space-x-3 rtl:space-x-reverse">
        <ShieldCheck className="w-5 h-5 text-bc-navy-800 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-slate-900 block font-bold">{pt.securityBannerTitle}:</strong>
          <span className="leading-relaxed">
            {pt.securityBannerDesc}
          </span>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeCategory === cat.id
                  ? 'bg-bc-navy-800 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className={`w-3.5 h-3.5 text-slate-400 absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2`} />
          <input
            type="text"
            placeholder={common.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full ${isRTL ? 'pr-8 pl-3' : 'pl-8 pr-3'} py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-bc-teal-500 bg-white`}
          />
        </div>
      </div>

      {/* Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLinks.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3 flex flex-col justify-between hover:border-bc-teal-400 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  {item.category}
                </span>
                {item.url ? (
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    {language === 'ar' ? 'بوابة مباشرة' : 'Live Portal'}
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    {language === 'ar' ? 'مستند داخلي' : 'Internal Document'}
                  </span>
                )}
              </div>

              <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
              {item.notes && <p className="text-xs text-slate-500 leading-relaxed">{item.notes}</p>}
            </div>

            <div className="pt-2 border-t border-slate-100">
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center space-x-1.5 rtl:space-x-reverse px-3 py-2 rounded-lg bg-bc-navy-800 text-white text-xs font-bold hover:bg-bc-navy-900 transition-colors"
                >
                  <span>{pt.openLink}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-bc-teal-400" />
                </a>
              ) : (
                <div className="w-full py-1.5 px-2 text-center text-xs text-slate-400 bg-slate-50 rounded border border-slate-200 font-mono">
                  {language === 'ar' ? 'راجع شيربوينت الداخلي للفرع' : 'Refer to Corporate Teams / SharePoint'}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Internal CRM Task Codes Reference Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h2 className="text-sm font-extrabold text-bc-navy-900 uppercase tracking-wider">
            {language === 'ar' ? 'أكواد مهام خدمة العملاء CRM (مرجع تشغيلي داخلي)' : 'CRM Task Codes Reference (Internal Only)'}
          </h2>
          <span className="text-[10px] font-bold bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
            {language === 'ar' ? 'داخلي للسيستم' : 'System Codes'}
          </span>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          {language === 'ar'
            ? 'هذه الأكواد خاصة بإسناد مهام السيستم في CRM Affiliates وتظل مفصولة تماماً عن أي ردود موجهة للعميل.'
            : 'These codes are for CRM workflow routing and are strictly isolated from customer-facing text.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
          {CRM_TASK_CODES.map((t, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-mono font-bold text-bc-navy-900 block text-sm">{t.taskName}</span>
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
  );
};
