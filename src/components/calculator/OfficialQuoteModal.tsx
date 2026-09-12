import React from 'react';
import { X, Printer, CheckCircle2, Building, Calendar, Phone, Mail } from 'lucide-react';
import { CalculationResult } from '../../data/types';
import { useLanguage } from '../../i18n/LanguageContext';
import { GENERAL_CONTACT_INFO } from '../../data/branches';

interface OfficialQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: CalculationResult;
}

export const OfficialQuoteModal: React.FC<OfficialQuoteModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  const { language, isRTL } = useLanguage();

  if (!isOpen) return null;

  const today = new Date().toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const quoteNumber = `BC-EG-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden print:shadow-none print:border-none print:w-full">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="bg-bc-navy-900 text-white p-4 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <img
              src="/bc-logo.png"
              alt="BC"
              className="w-8 h-8 rounded-lg object-contain shadow flex-shrink-0"
            />
            <div>
              <h2 className="text-sm font-bold text-white">
                {language === 'ar' ? 'عرض سعر رسمي معتمد للعميل' : 'Official Course Quotation'}
              </h2>
              <span className="text-xs text-bc-teal-300">
                {language === 'ar' ? 'جاهز للطباعة أو الحفظ كـ PDF للمدير والعميل' : 'Print ready or export as PDF'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 rtl:space-x-reverse px-3.5 py-1.5 rounded-lg bg-bc-teal-500 hover:bg-bc-teal-400 text-bc-navy-950 font-bold text-xs shadow transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>{language === 'ar' ? 'طباعة العرض' : 'Print Quote'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-bc-navy-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Quotation Sheet */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-800 font-sans" dir={isRTL ? 'rtl' : 'ltr'}>
          {/* Header of Quotation */}
          <div className="flex items-start justify-between border-b-2 border-bc-navy-800 pb-5">
            <div className="space-y-1">
              {/* Official British Council Full Logo Image */}
              <div className="flex items-center space-x-3 rtl:space-x-reverse mb-2">
                <img
                  src="/bc-logo-full.png"
                  alt="British Council"
                  className="h-10 sm:h-12 object-contain"
                />
              </div>
              <p className="text-xs text-slate-500">
                {language === 'ar'
                  ? 'المجلس الثقافي البريطاني - مصر • نظام المبيعات وخدمة العملاء المعتمد'
                  : 'British Council Egypt • Official Sales & Customer Advisory Service'}
              </p>
            </div>

            <div className="text-right rtl:text-left space-y-1 text-xs">
              <div className="inline-block px-2.5 py-1 bg-bc-navy-50 text-bc-navy-900 font-mono font-bold rounded border border-bc-navy-200">
                {quoteNumber}
              </div>
              <div className="text-slate-500">{today}</div>
              {result.branchInfo && (
                <div className="font-bold text-slate-800">
                  {language === 'ar' && result.branchInfo.nameAr ? result.branchInfo.nameAr : result.branchInfo.name}
                </div>
              )}
            </div>
          </div>

          {/* Student & Course Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                {language === 'ar' ? 'بيانات الطالب والفئة العمرية' : 'Student & Age Category'}
              </span>
              <div className="text-base font-extrabold text-slate-900">
                {result.calculatedAge} {language === 'ar' ? 'سنوات' : 'Years Old'}
                <span className="text-xs font-medium text-slate-500 mx-2">
                  ({result.ageCategory})
                </span>
              </div>
              <div className="text-xs text-slate-600 mt-1">
                <strong>{language === 'ar' ? 'المجموعة العمرية:' : 'Age Group:'}</strong> {result.ageGroup}
              </div>
              <div className="text-xs text-slate-600 mt-0.5">
                <strong>{language === 'ar' ? 'البرنامج المختار:' : 'Program:'}</strong> {result.program}
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                {language === 'ar' ? 'الكورس والمستوى الأكاديمي الموصى به' : 'Recommended Course & Level'}
              </span>
              <div className="text-base font-bold text-bc-navy-900">
                {result.recommendedCourse}
              </div>
              <div className="text-xs text-slate-700 mt-1">
                <strong>{language === 'ar' ? 'المستوى الأكاديمي:' : 'Academic Level:'}</strong>{' '}
                <span className="font-bold text-bc-teal-700">{result.academicLevel}</span>
              </div>
              {result.summerMapping && (
                <div className="text-xs text-amber-800 mt-1">
                  <strong>{language === 'ar' ? 'معادل الصيف:' : 'Summer Equivalent:'}</strong> {result.summerMapping}
                </div>
              )}
            </div>
          </div>

          {/* Placement Test Condition */}
          <div className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
            result.placementTest.required
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>
                <strong>{language === 'ar' ? 'امتحان تحديد المستوى:' : 'Placement Test:'}</strong>{' '}
                {result.placementTest.required
                  ? (language === 'ar' ? `مطلوب (${result.placementTest.fee} ج.م • المدة: ${result.placementTest.duration})` : `Required (${result.placementTest.fee} EGP • Duration: ${result.placementTest.duration})`)
                  : result.placementTest.reason}
              </span>
            </div>
            <span className="font-bold">
              {result.placementTest.required ? (language === 'ar' ? 'صلاحية ٦ شهور' : 'Valid 6 Months') : (language === 'ar' ? 'تسجيل مباشر' : 'Direct Booking')}
            </span>
          </div>

          {/* Financial Breakdown Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left rtl:text-right">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px]">
                <tr>
                  <th className="p-3">{language === 'ar' ? 'بيان الرسوم والمصاريف' : 'Item Description'}</th>
                  <th className="p-3 text-center">{language === 'ar' ? 'المدة / الترمات' : 'Duration / Terms'}</th>
                  <th className="p-3 text-right rtl:text-left">{language === 'ar' ? 'المبلغ المستحق' : 'Amount'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3 font-semibold text-slate-800">
                    {result.recommendedCourse} ({result.program})
                  </td>
                  <td className="p-3 text-center text-slate-600">
                    {result.durationAndSessions}
                  </td>
                  <td className="p-3 text-right rtl:text-left font-bold text-slate-900">
                    {result.basePrice !== null
                      ? `${result.basePrice.toLocaleString()} ${language === 'ar' ? 'ج.م' : 'EGP'}`
                      : '-'}
                  </td>
                </tr>

                {result.discountsApplied.map((disc, i) => (
                  <tr key={i} className="bg-emerald-50/50 text-emerald-800">
                    <td className="p-3 font-medium">
                      ✓ {disc.name} ({disc.description})
                    </td>
                    <td className="p-3 text-center">-</td>
                    <td className="p-3 text-right rtl:text-left font-bold text-emerald-700">
                      -{disc.amount.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                    </td>
                  </tr>
                ))}

                <tr className="bg-bc-navy-50 font-bold text-sm text-bc-navy-950">
                  <td className="p-3">
                    {language === 'ar' ? 'إجمالي المبلغ الصافي المستحق' : 'Total Net Payable Amount'}
                  </td>
                  <td className="p-3 text-center text-xs text-slate-500">
                    {result.priceNote}
                  </td>
                  <td className="p-3 text-right rtl:text-left font-black text-base text-bc-navy-900">
                    {result.finalPrice !== null
                      ? `${result.finalPrice.toLocaleString()} ${language === 'ar' ? 'ج.م' : 'EGP'}`
                      : '-'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Installment Options Summary */}
          {result.installmentEligibility.eligible && result.installmentEligibility.options.length > 0 && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
              <span className="font-bold text-slate-800 block uppercase tracking-wider">
                💳 {language === 'ar' ? 'خيارات التقسيط البنكي المعتمدة (بدون فوائد مع كبرى البنوك)' : 'Approved Bank Installment Options'}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {result.installmentEligibility.options.map((opt, i) => (
                  <div key={i} className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                    <span className="block font-bold text-slate-900">
                      {opt.tenureMonths} {language === 'ar' ? 'شهور' : 'Months'}
                    </span>
                    <span className="text-bc-teal-700 font-extrabold text-sm block mt-0.5">
                      {opt.monthlyPayment !== null
                        ? `~${opt.monthlyPayment.toLocaleString()} ${language === 'ar' ? 'ج.م/ش' : 'EGP/mo'}`
                        : '-'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {opt.adminPercent}% {language === 'ar' ? 'مصاريف' : 'Admin'}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-slate-500">
                {language === 'ar'
                  ? '• متاح لحاملي بطاقات الائتمان من: CIB، البنك الأهلي المصري (NBE)، بنك مصر، فاليو (ValU)، أمان (Aman).'
                  : '• Available for credit card holders of: CIB, NBE, Banque Misr, ValU, Aman.'}
              </p>
            </div>
          )}

          {/* Terms & Official Notes */}
          <div className="text-[11px] text-slate-500 border-t border-slate-200 pt-4 space-y-1">
            <p className="font-semibold text-slate-700">
              {language === 'ar' ? 'الشروط والأحكام العامة:' : 'General Terms & Conditions:'}
            </p>
            <p>
              • {language === 'ar'
                ? 'عرض السعر ساري لمدة ١٤ يوماً من تاريخ إصداره، ويخضع لتوفر الأماكن في الفروع.'
                : 'This quotation is valid for 14 days from the date of issue, subject to seat availability.'}
            </p>
            <p>
              • {language === 'ar'
                ? 'الحجز مؤكد فقط بعد إتمام سداد الرسوم واجتياز امتحان تحديد المستوى للمستويات المقررة.'
                : 'Registration is confirmed only after fee payment and completing the placement test where applicable.'}
            </p>
          </div>

          {/* Official Sign-off & Contact Footer */}
          <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div>
              <div className="font-bold text-slate-800">
                {language === 'ar' ? 'خدمة العملاء والمبيعات الهاتفية:' : 'Sales & Support Contact:'}
              </div>
              <div className="text-slate-600 flex items-center space-x-3 rtl:space-x-reverse mt-1">
                <span>💬 واتساب: {GENERAL_CONTACT_INFO.whatsappNumber}</span>
                <span>✉️ الدعم: {GENERAL_CONTACT_INFO.englishOnlineSupportEmail}</span>
              </div>
            </div>

            <div className="text-center">
              <div className="h-10 border-b border-dashed border-slate-400 w-44 mb-1"></div>
              <span className="text-[11px] text-slate-500">
                {language === 'ar' ? 'توقيع مستشار المبيعات / الختم' : 'Authorized Signature / Stamp'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
