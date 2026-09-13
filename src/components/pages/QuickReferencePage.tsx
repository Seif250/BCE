import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  HelpCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Search,
  Sparkles,
  PhoneCall,
  ChevronRight,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { PAGE_TRANSLATIONS } from '../../i18n/pageTranslations';

interface BilingualFaq {
  id: string;
  category: 'pt' | 'yl' | 'adult' | 'fees' | 'branches';
  question: {
    en: string;
    ar: string;
  };
  quickAnswer: {
    en: string;
    ar: string;
  };
  detailedNotes: {
    en: string[];
    ar: string[];
  };
}

const FAQS_DATA: BilingualFaq[] = [
  {
    id: 'faq-pt-yl',
    category: 'pt',
    question: {
      en: 'Does my child need a Placement Test (PT)?',
      ar: 'هل ابني محتاج امتحان تحديد مستوى (Placement Test)؟',
    },
    quickAnswer: {
      en: 'Ages 4 & 5 (Ducks & Owls) do NOT need a Placement Test. Starting from age 6, a Placement Test is mandatory (fee: 200 EGP, 20–30 mins, valid 6 months, non-refundable).',
      ar: 'سن 4 و 5 سنين (Ducks و Owls) بيدخلوا بدون أي امتحان تحديد مستوى نهائياً. من أول سن 6 سنين حتى 17 سنة لازم امتحان تحديد مستوى (رسومه 200 جنيه، مدته من 20 لـ 30 دقيقة، وصلاحية النتيجة 6 شهور، وغير قابلة للاسترداد).',
    },
    detailedNotes: {
      en: [
        'Age 4 = Early Years 2 (Ducks): Direct enrollment, no PT required.',
        'Age 5 = Early Years 3 (Owls): Direct enrollment, no PT required.',
        'Ages 6 to 17: Placement Test required (200 EGP).',
        'Valid for 6 months across all British Council Egypt branches.',
      ],
      ar: [
        'سن 4 سنين (Ducks): تسجيل مباشر فوراً بدون امتحان.',
        'سن 5 سنين (Owls): تسجيل مباشر فوراً بدون امتحان.',
        'من سن 6 إلى 17 سنة: امتحان تحديد مستوى إلزامي بمصروفات 200 جنيه.',
        'صلاحية النتيجة 6 شهور صالحة للتسجيل في أي فرع في مصر.',
      ],
    },
  },
  {
    id: 'faq-course-age',
    category: 'yl',
    question: {
      en: 'What course does my child take based on their age?',
      ar: 'ابني هيدخل كورس إيه حسب سنه وتاريخ ميلاده؟',
    },
    quickAnswer: {
      en: 'Ages 4 (Ducks), 5 (Owls), 6–8 (Lower Primary), 9–11 (Upper Primary), 12–14 (Lower Secondary), 15–17 (Upper Secondary). Exact level within the age group is determined by the Placement Test.',
      ar: 'المراحل العمرية عندنا: سن 4 (Ducks)، سن 5 (Owls)، من 6 لـ 8 (Lower Primary)، من 9 لـ 11 (Upper Primary)، من 12 لـ 14 (Lower Secondary)، ومن 15 لـ 17 (Upper Secondary). والمستوى الأكاديمي جوه المرحلة بيتحدد بدقة بعد امتحان الـ 200 جنيه.',
    },
    detailedNotes: {
      en: [
        'Age groups define the peer cohort and course stream.',
        'Within each stream, courses progress through numbered levels (e.g. Primary Plus 1, 2, 3...).',
        'EY3 is NOT the same as LP Starter A; they are complementary.',
      ],
      ar: [
        'كل مرحلة عمرية بتضمن وجود الطفل مع أقرانه في نفس السن والتفكير.',
        'جوه كل مرحلة فيه مستويات متدرجة (Primary Plus 1, 2, 3...) لضمان التطور.',
        'منهج سن 5 (EY3) مش مكرر لمنهج Starter A في الابتدائي؛ الاتنين مكملين لبعض.',
      ],
    },
  },
  {
    id: 'faq-summer-camps',
    category: 'yl',
    question: {
      en: 'Can a student register for 2 or 3 Summer Camps? Are they different?',
      ar: 'ينفع الطالب يحجز معسكرين أو 3 في الصيف؟ وهل المنهج مختلف؟',
    },
    quickAnswer: {
      en: 'Yes! Registering for 2 camps gives a 10% discount on the 2nd camp. Registering for 3 camps gives 10% on the 2nd and 3rd camp for Starters only. Note that Camp 1 and Camp 3 share the same curriculum, except for Starters A & B.',
      ar: 'أكيد ينفع! لو سجل في معسكرين بياخد خصم 10% على المعسكر الثاني. ولو سجل في 3 معسكرات بياخد 10% على الثاني والثالث لطلاب المبتدئين (Starters). وخلي بال حضرتك إن معسكر 1 ومعسكر 3 ليهم نفس المنهج بالظبط، ما عدا مرحلة المبتدئين Starters A و B مختلفة.',
    },
    detailedNotes: {
      en: [
        'Camp 1: 5 Jul – 16 Jul 2026',
        'Camp 2: 26 Jul – 6 Aug 2026',
        'Camp 3: 9 Aug – 20 Aug 2026',
        'Each camp is 30 hours over 2 weeks (3 hours/day: 2h English + 1h activity, Sunday to Thursday).',
      ],
      ar: [
        'معسكر 1: من 5 إلى 16 يوليو 2026.',
        'معسكر 2: من 26 يوليو إلى 6 أغسطس 2026.',
        'معسكر 3: من 9 إلى 20 أغسطس 2026.',
        'كل معسكر 30 ساعة على مدار أسبوعين (3 ساعات يومياً: ساعتين كورس + ساعة نشاط، من الأحد للخميس).',
      ],
    },
  },
  {
    id: 'faq-winter-discounts',
    category: 'fees',
    question: {
      en: 'What discounts are available for the Winter Block?',
      ar: 'إيه هي الخصومات المتاحة للبرنامج الشتوي (Winter Block)؟',
    },
    quickAnswer: {
      en: 'Bundle discount: 5% for 2 terms, 10% for 3 terms, 15% for 4 terms. Sibling discount: 10% on the youngest child when registering 2 or more siblings in the same term.',
      ar: 'عندنا نوعين من الخصومات: 1) خصم الحزم (Bundle): لو حجزت ترمين بتاخد خصم 5%، 3 ترمات خصم 10%، و4 ترمات خصم 15%. 2) خصم الأخوات: 10% على الطفل الأصغر لما تسجل لطفلين أو أكتر في نفس الترم.',
    },
    detailedNotes: {
      en: [
        'Primary & Secondary standard term fee: 5,800 EGP per term.',
        'Early Years (Ducks & Owls) term fee: 6,400 EGP per term.',
        'IELTS for Teens term fee: 5,600 EGP per term.',
        'Sibling discount requires youngest child booked in the same term as older sibling.',
      ],
      ar: [
        'مصروفات الترم للابتدائي والإعدادي والثانوي: 5,800 جنيه للترم.',
        'مصروفات ترم الحضانة سن 4 و 5 سنين: 6,400 جنيه للترم.',
        'كورس آيلتس الشباب: 5,600 جنيه للكورس.',
        'خصم الأخوات بيشترط حجز الأخ الصغير في نفس الترم مع أخوه الأكبر.',
      ],
    },
  },
  {
    id: 'faq-installments',
    category: 'fees',
    question: {
      en: 'Can I pay course fees in installments using a credit card?',
      ar: 'هل متاح تقسيط المصروفات بالفيزا والبطاقات الائتمانية؟',
    },
    quickAnswer: {
      en: 'Yes. For Adults, installments are available exclusively for 40-credit (10,000 EGP) and 60-credit (13,300 EGP) packages over 6 months (9% admin fee) or 12 months (15% admin fee). For Young Learners, booking must be at least 2 terms (single terms cannot be installed).',
      ar: 'نعم متاح بالفيزا (Credit Card). للكبار: متاح حصرياً لباقات الـ 40 ساعة (10,000 ج) والـ 60 ساعة (13,300 ج) على 6 شهور (مصاريف 9%) أو 12 شهر (مصاريف 15%). وللصغار: يشترط حجز ترمين على الأقل (ممنوع تقسيط ترم واحد).',
    },
    detailedNotes: {
      en: [
        'Payment must be made using an eligible credit card.',
        'Adult 10 & 20 credits packages are NOT eligible for installments.',
        'Young Learner single-term bookings cannot be installed.',
        'Admin fee: 9% for 6 months, 15% for 12 months.',
      ],
      ar: [
        'السداد ببطاقة ائتمان بنكية سارية بالفرع أو أونلاين.',
        'باقات الكبار 10 و 20 ساعة كاش فقط وغير مسموح تقسيطها.',
        'حجز ترم واحد فقط للأطفال غير مسموح بتقسيطه.',
        'المصاريف الإدارية 9% لـ 6 شهور و 15% لـ 12 شهر.',
      ],
    },
  },
  {
    id: 'faq-adult-re-reg',
    category: 'adult',
    question: {
      en: 'What is the Adult re-registration discount policy?',
      ar: 'إيه هو خصم إعادة التسجيل لكورسات الكبار (Re-registration)؟',
    },
    quickAnswer: {
      en: 'When re-registering within 3 months of expiration, the student gets a 10% discount on any credit package and recovers all their expired credits.',
      ar: 'لو الطالب جدد باقة جديدة خلال 3 شهور من انتهاء باقته القديمة، بيستفيد بخصم 10% فوري على الباقة الجديدة، وبيرجعله كل الساعات اللي انتهت ومش متبقية من الباقة السابقة!',
    },
    detailedNotes: {
      en: [
        'Window: within 3 months from last attended session.',
        'Applies across Beginner, BCE, and IELTS Coach packages.',
        'Expired credits from previous packages are reinstated as per official source rule.',
      ],
      ar: [
        'المدة المسموحة: خلال 3 شهور من تاريخ آخر حصة حضرها الطالب.',
        'الخصم متاح على باقات Beginner و BCE و IELTS Coach.',
        'استرجاع الساعات القديمة ميزة رسمية مثبتة في الملف المصدر.',
      ],
    },
  },
  {
    id: 'faq-branch-hours',
    category: 'branches',
    question: {
      en: 'What are the branch working hours, days, and WhatsApp?',
      ar: 'إيه هي مواعيد وأيام عمل الفروع ورقم الواتساب؟',
    },
    quickAnswer: {
      en: 'All branches operate Sunday to Thursday. Official WhatsApp: 01022212064. Agouza: 10am–7pm. City Stars: 1pm–8pm. New Cairo & October: 12pm–7pm. Alex KLS: 11am–1pm & 2pm–6pm.',
      ar: 'جميع الفروع بتشتغل من الأحد إلى الخميس. رقم الواتساب الرسمي الموحد: 01022212064. فرع العجوزة: من 10 صباحاً لـ 7 مساءً. سيتي ستارز: من 1 ظهراً لـ 8 مساءً. التجمع وأكتوبر: من 12 ظهراً لـ 7 مساءً. الإسكندرية (كفر عبده): من 11 لـ 1 ظهراً ومن 2 لـ 6 مساءً.',
    },
    detailedNotes: {
      en: [
        'Agouza: 192 El Nil Street, Agouza.',
        'City Stars: Gate 5, Phase 1, 6th Floor.',
        'Aspire New Cairo: Al-Banafseg 1st Settlement.',
        'October: Dream Land Compound Gate 3/4.',
        'Alex BSA: Teaching center only (No Customer Service desk).',
      ],
      ar: [
        'فرع العجوزة: 192 شارع النيل، العجوزة.',
        'فرع سيتي ستارز: بوابة 5، المرحلة الأولى، الدور السادس.',
        'فرع التجمع (Aspire): البنفسج، التجمع الأول.',
        'فرع أكتوبر: كمبوند دريم لاند، بوابة 3 أو 4.',
        'فرع الإسكندرية BSA: مركز تدريس فقط (لا يوجد به مكتب خدمة عملاء).',
      ],
    },
  },
];

export const QuickReferencePage: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const pt = PAGE_TRANSLATIONS[language].quickRef;
  const common = PAGE_TRANSLATIONS[language].common;

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: pt.categoryChips.all },
    { id: 'pt', label: language === 'ar' ? 'تحديد المستوى (PT)' : 'Placement Test' },
    { id: 'yl', label: pt.categoryChips.yl },
    { id: 'adult', label: pt.categoryChips.adult },
    { id: 'fees', label: pt.categoryChips.fees },
    { id: 'branches', label: pt.categoryChips.operations },
  ];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredFaqs = useMemo(() => {
    return FAQS_DATA.filter((item) => {
      // Category filter
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }
      // Search filter
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      const questionText = item.question[language].toLowerCase();
      const answerText = item.quickAnswer[language].toLowerCase();
      return questionText.includes(q) || answerText.includes(q);
    });
  }, [activeCategory, search, language]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-3">
        <div className="flex items-center space-x-2 rtl:space-x-reverse text-bc-navy-900">
          <BookOpen className="w-7 h-7 text-bc-navy-800" />
          <h1 className="text-2xl font-black tracking-tight">{pt.title}</h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {pt.subtitle}
        </p>
      </div>

      {/* Search Input & Category Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className={`w-4 h-4 text-slate-400 absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2`} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={pt.searchPlaceholder}
            className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bc-teal-500 bg-slate-50/50 shadow-inner`}
          />
        </div>

        {/* Category Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeCategory === c.id
                  ? 'bg-bc-navy-800 text-white shadow-sm ring-2 ring-bc-navy-800/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Cards List */}
      <div className="space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
            {language === 'ar' ? 'لا توجد نتائج تطابق بحثك حالياً.' : 'No matching questions found.'}
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const question = faq.question[language];
            const quickAnswer = faq.quickAnswer[language];
            const notes = faq.detailedNotes[language];

            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-3.5 hover:border-bc-teal-400 transition-colors"
              >
                {/* 1. Question Title & Quick Copy Button Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-2.5">
                  <div className="flex items-start space-x-2 rtl:space-x-reverse">
                    <HelpCircle className="w-5 h-5 text-bc-navy-800 flex-shrink-0 mt-0.5" />
                    <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                      {question}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(quickAnswer, faq.id)}
                    className={`self-start sm:self-auto flex items-center space-x-1.5 rtl:space-x-reverse px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-all flex-shrink-0 ${
                      copiedId === faq.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-bc-navy-900 hover:bg-bc-navy-800 text-white'
                    }`}
                  >
                    {copiedId === faq.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>{common.copied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-bc-teal-300" />
                        <span>{language === 'ar' ? 'نسخ للعميل' : 'Copy for Customer'}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 2. Customer-Facing Answer (الإجابة المباشرة للعميل) */}
                <div className="bg-slate-50/90 border border-slate-200/80 rounded-xl p-3.5 relative overflow-hidden">
                  <div className="flex items-center space-x-1.5 rtl:space-x-reverse mb-1 text-bc-teal-700 font-bold text-[11px] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'الإجابة المباشرة للعميل:' : 'Customer-Facing Answer:'}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed">
                    "{quickAnswer}"
                  </p>
                </div>

                {/* 3. Collapsible Internal Operational Details (▸ تفاصيل داخلية) */}
                {notes && notes.length > 0 && (
                  <details className="group pt-0.5">
                    <summary className="cursor-pointer text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center space-x-1.5 rtl:space-x-reverse select-none list-none py-1 transition-colors">
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-open:rotate-90 rtl:group-open:-rotate-90 transition-transform" />
                      <span>{language === 'ar' ? '▸ تفاصيل داخلية وملاحظات تشغيلية' : '▸ Internal Operational Notes'}</span>
                    </summary>
                    <div className="mt-2 pl-5 rtl:pr-5 border-l-2 rtl:border-r-2 rtl:border-l-0 border-slate-200 py-1">
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {notes.map((note, idx) => (
                          <li key={idx} className="flex items-start space-x-2 rtl:space-x-reverse">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span className="leading-snug">{note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </details>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
