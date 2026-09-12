import React from 'react';
import {
  Settings,
  Database,
  FileCode,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { PAGE_TRANSLATIONS } from '../../i18n/pageTranslations';

export const SettingsNotesPage: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const pt = PAGE_TRANSLATIONS[language].settingsNotes;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-3">
        <div className="flex items-center space-x-2 rtl:space-x-reverse text-bc-navy-900">
          <Settings className="w-7 h-7 text-slate-700" />
          <h1 className="text-2xl font-black tracking-tight">{pt.title}</h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {pt.subtitle}
        </p>
      </div>

      {/* Data Source & Privacy Banner */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2 rtl:space-x-reverse">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{pt.excelVerificationTitle}</span>
          </h2>
          <span className="text-xs font-mono bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded border border-emerald-200 font-bold">
            {language === 'ar' ? 'بيانات ثابتة مدمجة' : 'Bundled Static Data'}
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          {pt.excelVerificationDesc}
        </p>

        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
          <div className="font-bold text-slate-800">
            {language === 'ar' ? 'حماية بيانات الدخول وسرية النظام:' : 'Privacy & Credential Protection:'}
          </div>
          <p className="leading-relaxed">
            {language === 'ar'
              ? 'تطبيقاً لتوجيهات الأمان والسرية، لا يحتوي هذا التطبيق على أي كلمات مرور أو مفاتيح CRM سرية. كما تم عزل أكواد إسناد المهام الداخلية (مثل LED و ANR) بحيث لا تظهر أبداً في الردود الموجهة للعملاء.'
              : 'In strict adherence to the privacy directive, no CRM passwords, employee credentials, or secret API tokens are bundled into this client-side code. The CRM Affiliates sheet codes (LED, ANR) are kept strictly segregated in internal reference objects and never leaked into customer-facing quick answers.'}
          </p>
        </div>
      </div>

      {/* File Locations Directory */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2 rtl:space-x-reverse">
            <FileCode className="w-4 h-4 text-bc-navy-800" />
            <span>{pt.dataFilesTitle}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{pt.dataFilesDesc}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <strong className="text-bc-navy-900 font-mono text-sm">src/data/adultCourses.ts</strong>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-100 text-indigo-800">
                {language === 'ar' ? 'الكبار' : 'Adult'}
              </span>
            </div>
            <p className="text-slate-600">
              {language === 'ar'
                ? 'يحتوي على مستويات Beginner A–E، ومستويات BCE A1–C1، وباقات الآيلتس (10، 20، 40، 60 ساعة)، والأسعار ومواعيد الحصص، وقاعدة خصم 10% لإعادة التسجيل.'
                : 'Contains Beginner levels A–E, BCE levels A1–C1, IELTS Coach packages (10, 20, 40, 60 credits), pricing, schedules, and 10% re-registration discount rules.'}
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <strong className="text-bc-navy-900 font-mono text-sm">src/data/winterCourses.ts</strong>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-sky-100 text-sky-800">
                {language === 'ar' ? 'الشتوي للأطفال' : 'Winter YL'}
              </span>
            </div>
            <p className="text-slate-600">
              {language === 'ar'
                ? 'يحتوي على المراحل العمرية للأطفال (4، 5، 6–8، 9–11، 12–14، 15–17)، وقواعد الـ 4 ترمات، ورسوم الترم (5800 ج، 6400 ج، 5600 ج)، وخصم الحزم والأخوات.'
                : 'Contains Young Learner age bands (4, 5, 6–8, 9–11, 12–14, 15–17), 4-term rules, term fees (5800 EGP, 6400 EGP, 5600 EGP), bundle discounts (5%, 10%, 15%), and sibling discounts.'}
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <strong className="text-bc-navy-900 font-mono text-sm">src/data/summerCamps.ts</strong>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-100 text-amber-800">
                {language === 'ar' ? 'معسكرات الصيف' : 'Summer YL'}
              </span>
            </div>
            <p className="text-slate-600">
              {language === 'ar'
                ? 'يحتوي على مواعيد المعسكرات الثلاثة (5–16 يوليو، 26 يوليو–6 أغسطس، 9–20 أغسطس 2026)، وقاعدة الـ 30 ساعة، وخصومات المعسكرات ومطابقة المستويات.'
                : 'Contains 3 Summer Camp dates (5–16 Jul, 26 Jul–6 Aug, 9–20 Aug 2026), 30-hour structure, summer discounts (10% on 2nd; 10% on 2nd & 3rd for starters), and configurable camp prices.'}
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <strong className="text-bc-navy-900 font-mono text-sm">src/data/branches.ts</strong>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800">
                {language === 'ar' ? 'الفروع' : 'Branches'}
              </span>
            </div>
            <p className="text-slate-600">
              {language === 'ar'
                ? 'يحتوي على عناوين الفروع المعتمدة (العجوزة، سيتي ستارز، التجمع، أكتوبر، وفرعي الإسكندرية)، ومواعيد العمل، وبيانات المديرين وكبار المعلمين.'
                : 'Contains official branch locations (Agouza, City Stars, Aspire New Cairo, October, Alex BSA, Alex KLS), working hours, customer service availability, managers, and contacts.'}
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <strong className="text-bc-navy-900 font-mono text-sm">src/data/installments.ts</strong>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-100 text-purple-800">
                {language === 'ar' ? 'التقسيط' : 'Finance'}
              </span>
            </div>
            <p className="text-slate-600">
              {language === 'ar'
                ? 'يحتوي على نسب المصاريف الإدارية (9% لـ 6 شهور، 15% لـ 12 شهر) وقواعد أهلية باقات الكبار والشتوي.'
                : 'Contains credit card installment rules for Adults (40 & 60 credits packages, 6M @ 9%, 12M @ 15%) and Young Learners (minimum 2 terms).'}
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <strong className="text-bc-navy-900 font-mono text-sm">src/data/importantLinks.ts</strong>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-200 text-slate-800">
                {language === 'ar' ? 'الروابط' : 'Links'}
              </span>
            </div>
            <p className="text-slate-600">
              {language === 'ar'
                ? 'يحتوي على اختصارات بوابات العمل الداخلية ZIWO، و Salesforce، و SAP SMS، وشيربوينت.'
                : 'Contains internal shortcuts for ZIWO, Salesforce, SAP SMS, CMS3, Paymob, and corporate SharePoint tools.'}
            </p>
          </div>
        </div>
      </div>

      {/* How to Update Data Step-by-Step Guide */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <h2 className="text-base font-extrabold text-slate-900">
          {language === 'ar' ? 'خطوات تحديث الأسعار للمواسم القادمة' : 'How to Update Course Data (Future Seasons)'}
        </h2>

        <ol className="list-decimal list-inside space-y-3 text-xs text-slate-700">
          <li className="leading-relaxed">
            <strong>{language === 'ar' ? 'تحديث المصروفات:' : 'Updating Tuition Fees:'}</strong>{' '}
            {language === 'ar'
              ? 'افتح ملف `src/data/winterCourses.ts` أو `src/data/adultCourses.ts` وعدل الأرقام مباشرة، وستنعكس تلقائياً في الحاسبة والجداول.'
              : 'Open `src/data/winterCourses.ts` or `src/data/adultCourses.ts` and update the numeric fee values.'}
          </li>
          <li className="leading-relaxed">
            <strong>{language === 'ar' ? 'تشغيل الاختبارات التلقائية:' : 'Running Verification Tests:'}</strong>{' '}
            {language === 'ar'
              ? 'شغل أمر `pnpm test` للتأكد من استمرار نجاح كافة الاختبارات الحسابية.'
              : 'Execute `pnpm test` to ensure all boundary age conditions and discount rules continue to pass.'}
          </li>
          <li className="leading-relaxed">
            <strong>{language === 'ar' ? 'بناء النسخة للإنتاج (Cloudflare Pages):' : 'Building for Production:'}</strong>{' '}
            {language === 'ar'
              ? 'شغل أمر `pnpm run build` لإنشاء ملفات البناء المحسنة في مجلد `dist/`.'
              : 'Run `pnpm run build` to produce the static output in the `dist/` directory.'}
          </li>
        </ol>
      </div>
    </div>
  );
};
