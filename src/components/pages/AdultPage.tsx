import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  CreditCard,
  Mail,
  ShieldAlert,
  Copy,
  Check,
  CheckCircle2,
  Calendar,
  Clock,
} from 'lucide-react';
import { ADULT_COURSES } from '../../data/adultCourses';
import { useLanguage } from '../../i18n/LanguageContext';
import { PAGE_TRANSLATIONS } from '../../i18n/pageTranslations';

export const AdultPage: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const pt = PAGE_TRANSLATIONS[language].adult;
  const common = PAGE_TRANSLATIONS[language].common;

  const [activeTab, setActiveTab] = useState<string>('beginner');
  const [copiedAnswer, setCopiedAnswer] = useState(false);

  const currentCourse = ADULT_COURSES.find((c) => c.id === activeTab) || ADULT_COURSES[0];

  const courseDetail =
    pt.courseDetails && (pt.courseDetails as any)[activeTab]
      ? (pt.courseDetails as any)[activeTab]
      : {
          name: currentCourse.name,
          description: currentCourse.description,
          sessionDuration: currentCourse.sessionDuration,
          attendanceMode: currentCourse.attendanceMode,
          schedule: currentCourse.schedule,
          reRegistrationRule: currentCourse.reRegistrationRule,
          levels: currentCourse.levels,
        };

  const handleCopyAnswer = () => {
    navigator.clipboard.writeText(pt.quickAnswerCard.content);
    setCopiedAnswer(true);
    setTimeout(() => setCopiedAnswer(false), 2000);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-3 rtl:space-x-reverse text-bc-navy-900">
          <GraduationCap className="w-8 h-8 text-bc-navy-800" />
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{pt.title}</h1>
        </div>
        <p className="text-sm sm:text-base text-slate-500 mt-1">
          {pt.subtitle}
        </p>
      </div>

      {/* QUICK SUMMARY STRIP (شريط الأسعار والمصروفات المختصر) */}
      <div className="bg-slate-900 text-white px-4 py-2.5 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm border border-slate-800">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-semibold">
          <span className="flex items-center space-x-1 rtl:space-x-reverse">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            <span className="text-slate-300">{language === 'ar' ? 'الشتوي:' : 'Winter:'}</span>
            <strong className="text-white">5,800 {language === 'ar' ? 'ج' : 'EGP'}</strong>
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="flex items-center space-x-1 rtl:space-x-reverse">
            <span className="w-2 h-2 rounded-full bg-sky-400 inline-block" />
            <span className="text-slate-300">{language === 'ar' ? 'الحضانة (EY):' : 'Early Years:'}</span>
            <strong className="text-white">6,400 {language === 'ar' ? 'ج' : 'EGP'}</strong>
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="flex items-center space-x-1 rtl:space-x-reverse">
            <span className="w-2 h-2 rounded-full bg-purple-400 inline-block" />
            <span className="text-slate-300">{language === 'ar' ? 'آيلتس الشباب:' : 'IELTS Teens:'}</span>
            <strong className="text-white">5,600 {language === 'ar' ? 'ج' : 'EGP'}</strong>
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="flex items-center space-x-1 rtl:space-x-reverse">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            <span className="text-slate-300">{language === 'ar' ? 'تحديد مستوى PT:' : 'Placement Test:'}</span>
            <strong className="text-amber-300">200 {language === 'ar' ? 'ج' : 'EGP'}</strong>
          </span>
        </div>

        <div className="text-[11px] font-bold text-bc-teal-300 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
          {language === 'ar' ? '18+ سنة كبار • خصم 10% إعادة التسجيل (خلال 3 شهور)' : '18+ Adult • 10% Re-registration Discount (3M window)'}
        </div>
      </div>

      {/* QUICK ANSWER FOR CALLS */}
      <div className="bg-gradient-to-r from-bc-navy-50 to-emerald-50/50 border border-bc-navy-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-bc-navy-900 font-extrabold text-sm sm:text-base">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span>{pt.quickAnswerCard.title}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-semibold">
            {pt.quickAnswerCard.content}
          </p>
        </div>
        <button
          onClick={handleCopyAnswer}
          className="self-start sm:self-center flex-shrink-0 flex items-center space-x-2 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-bc-navy-800 hover:bg-bc-navy-900 text-white text-xs sm:text-sm font-bold shadow-md transition-all"
        >
          {copiedAnswer ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copiedAnswer ? common.copied : common.copyAnswer}</span>
        </button>
      </div>

      {/* Product Selection Tabs */}
      <div className="flex flex-wrap gap-2.5 border-b border-slate-200 pb-3">
        {ADULT_COURSES.map((course) => {
          const isActive = activeTab === course.id;
          const tabLabel =
            course.id === 'beginner'
              ? pt.tabs.beginner
              : course.id === 'bce'
              ? pt.tabs.bce
              : course.id === 'ielts-coach'
              ? pt.tabs.ielts
              : pt.tabs.online;

          return (
            <button
              key={course.id}
              onClick={() => setActiveTab(course.id)}
              className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                isActive
                  ? 'bg-bc-navy-800 text-white shadow-md ring-2 ring-bc-navy-800/20 scale-[1.02]'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tabLabel}
            </button>
          );
        })}
      </div>

      {/* Main Course Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details & Packages */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">{courseDetail.name}</h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">{courseDetail.description}</p>
              </div>
              <span className="text-xs sm:text-sm font-mono font-bold bg-bc-navy-50 text-bc-navy-800 px-3.5 py-1.5 rounded-lg border border-bc-navy-200">
                {currentCourse.code}
              </span>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block font-semibold mb-1">{pt.specs.sessionDuration}</span>
                <span className="font-bold text-slate-900">{courseDetail.sessionDuration}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block font-semibold mb-1">{pt.specs.attendanceMode}</span>
                <span className="font-bold text-slate-900">{courseDetail.attendanceMode}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2">
                <span className="text-slate-500 block font-semibold mb-1">{pt.specs.schedule}</span>
                <span className="font-bold text-slate-900 leading-relaxed">{courseDetail.schedule}</span>
              </div>
            </div>
          </div>

          {/* Packages Table */}
          {currentCourse.packages.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">{pt.packagesTable.title}</h3>
                <span className="text-xs text-slate-400 font-mono">{common.sourceExcel}</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                      <th className={`p-3.5 ${isRTL ? 'text-right' : 'text-left'}`}>{pt.packagesTable.colCredits}</th>
                      <th className={`p-3.5 ${isRTL ? 'text-right' : 'text-left'}`}>{pt.packagesTable.colValidity}</th>
                      <th className={`p-3.5 ${isRTL ? 'text-left' : 'text-right'}`}>{pt.packagesTable.colPrice}</th>
                      <th className={`p-3.5 ${isRTL ? 'text-left' : 'text-right'} text-emerald-700`}>{pt.packagesTable.colReReg}</th>
                      <th className="p-3.5 text-center">{pt.quickHighlights.installmentTitle}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentCourse.packages.map((pkg) => {
                      const reRegFee = Math.round(pkg.price * 0.9);
                      const isInstallmentEligible = pkg.credits === 40 || pkg.credits === 60;
                      return (
                        <tr key={pkg.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5 font-bold text-slate-900">
                            {pkg.credits} {language === 'ar' ? 'ساعة / كريديت' : 'Credits'}
                            {pkg.reRegisterOnly && (
                              <span className="block text-[11px] text-amber-700 font-semibold">
                                {language === 'ar' ? 'تجديد فقط' : 'Re-register Only'}
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-slate-700">{pkg.durationOrLevels}</td>
                          <td className={`p-3.5 ${isRTL ? 'text-left' : 'text-right'} font-black text-slate-900 text-sm sm:text-base`}>
                            {pkg.price.toLocaleString()} {language === 'ar' ? 'جنيه' : 'EGP'}
                          </td>
                          <td className={`p-3.5 ${isRTL ? 'text-left' : 'text-right'} font-bold text-emerald-700 text-sm sm:text-base`}>
                            {reRegFee.toLocaleString()} {language === 'ar' ? 'جنيه' : 'EGP'}
                          </td>
                          <td className="p-3.5 text-center">
                            {isInstallmentEligible ? (
                              <span className="inline-block px-3 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                {language === 'ar' ? 'متاح 6 و 12 شهر' : '6M / 12M OK'}
                              </span>
                            ) : (
                              <span className="text-slate-400 text-xs">
                                {language === 'ar' ? 'كاش فقط' : 'Full Only'}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-900 flex items-start space-x-2.5 rtl:space-x-reverse">
                <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>{language === 'ar' ? 'ميزة إعادة التسجيل:' : 'Re-registration Benefit:'}</strong>{' '}
                  {courseDetail.reRegistrationRule}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center space-y-4">
              <Mail className="w-10 h-10 text-bc-teal-600 mx-auto" />
              <h3 className="font-extrabold text-lg text-slate-900">
                {language === 'ar' ? 'اشتراك المنصة العالمية أونلاين' : 'Global Online Subscription'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                {language === 'ar'
                  ? 'برنامج English Online مدار من خلال المنصة العالمية للمجلس الثقافي البريطاني والدعم والتسجيل متاح عبر البريد الرسمي:'
                  : 'English Online is managed via the global British Council portal. Support inquiries and registrations are handled through:'}
              </p>
              <span className="inline-block font-mono text-sm sm:text-base text-bc-navy-900 font-bold bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
                support.englishonline@britishcouncil.org
              </span>
            </div>
          )}

          {/* Academic Levels & Progression */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3.5">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
              {language === 'ar' ? 'المستويات التابعة والتدرج الأكاديمي' : 'Curriculum Levels & Progression'}
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {courseDetail.levels.map((lvl: string, index: number) => (
                <span
                  key={index}
                  className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-bc-navy-50 text-bc-navy-900 border border-bc-navy-200"
                >
                  {lvl}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Operational Rules & PT */}
        <div className="space-y-6">
          {/* Placement Test Rules */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center space-x-2.5 rtl:space-x-reverse border-b border-slate-100 pb-3">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                {language === 'ar' ? 'شروط امتحان تحديد المستوى (PT)' : 'Placement Test Policy'}
              </h3>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <div className="flex items-center justify-between font-medium">
                <span>{language === 'ar' ? 'رسوم الامتحان:' : 'Fee:'}</span>
                <span className="font-black text-slate-900 text-base">
                  {currentCourse.placementTest.fee} {language === 'ar' ? 'جنيه' : 'EGP'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>{language === 'ar' ? 'مدة الامتحان:' : 'Duration:'}</span>
                <span className="font-semibold">{currentCourse.placementTest.duration}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{language === 'ar' ? 'مدة الصلاحية:' : 'Validity:'}</span>
                <span className="font-bold text-amber-900">{currentCourse.placementTest.validity}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{language === 'ar' ? 'سياسة الاسترداد:' : 'Refund Policy:'}</span>
                <span className="font-bold text-rose-700">
                  {language === 'ar' ? 'غير قابلة للاسترداد نهائياً' : 'Non-Refundable'}
                </span>
              </div>
              {currentCourse.placementTest.notes && (
                <p className="pt-2.5 text-xs text-slate-500 border-t border-slate-100 leading-relaxed">
                  {language === 'ar'
                    ? 'في حالة عدم ظهور مستوى للطالب، يحق له إعادة امتحان تحديد المستوى بعد 3 شهور.'
                    : currentCourse.placementTest.notes}
                </p>
              )}
            </div>
          </div>

          {/* Operational Rules Checklist */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3.5">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
              {pt.keyRulesTitle}
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
              {pt.rulesList.map((rule, idx) => (
                <li key={idx} className="flex items-start space-x-2.5 rtl:space-x-reverse">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Installment Summary Card */}
          <div className="bg-bc-navy-900 text-white rounded-2xl shadow-sm p-6 space-y-4">
            <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
              <CreditCard className="w-5 h-5 text-bc-teal-400" />
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-bc-teal-300">
                {language === 'ar' ? 'شروط تقسيط الكبار بالفيزا' : 'Adult Installment Rule'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {language === 'ar'
                ? 'التقسيط متاح فقط لباقات الـ 40 والـ 60 ساعة. ويجب دفع المبلغ كاملاً ببطاقة ائتمان بنكية:'
                : 'Valid ONLY for 40 and 60 credit packages. Must pay whole amount with credit card:'}
            </p>
            <div className="grid grid-cols-2 gap-3 text-center text-xs sm:text-sm">
              <div className="p-3 rounded-xl bg-bc-navy-800 border border-bc-navy-700">
                <span className="block text-slate-300 text-xs mb-0.5">
                  {language === 'ar' ? 'تقسيط 6 شهور' : '6 Months'}
                </span>
                <strong className="text-bc-teal-300 text-base font-black">
                  {language === 'ar' ? '9% مصاريف' : '9% Admin Exp'}
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-bc-navy-800 border border-bc-navy-700">
                <span className="block text-slate-300 text-xs mb-0.5">
                  {language === 'ar' ? 'تقسيط 12 شهر' : '12 Months'}
                </span>
                <strong className="text-bc-teal-300 text-base font-black">
                  {language === 'ar' ? '15% مصاريف' : '15% Admin Exp'}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
