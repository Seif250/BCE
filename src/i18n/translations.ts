// Bilingual Dictionary: English & Egyptian Arabic (المصري)
// Designed for British Council Egypt Call Center & Sales Team

export type Language = 'en' | 'ar';

export interface Translations {
  // Brand & Navbar
  brandTitle: string;
  brandSubtitle: string;
  appName: string;
  searchPlaceholder: string;
  searchShortcut: string;
  offlineReady: string;
  whatsappLabel: string;
  langSwitchButton: string;
  quickActionsTitle: string;

  // Sidebar / Nav Sections
  navCalculator: string;
  navAdult: string;
  navWinter: string;
  navSummer: string;
  navBranches: string;
  navInstallments: string;
  navLinks: string;
  navQuickRef: string;

  // Calculator Form
  calcTitle: string;
  calcSubtitle: string;
  resetBtn: string;
  studentParameters: string;
  liveCalcBadge: string;
  quickPresetsLabel: string;
  dobLabel: string;
  dobHelp: string;
  programLabel: string;
  programAuto: string;
  programWinter: string;
  programSummer: string;
  programAdult: string;
  regTypeLabel: string;
  regNew: string;
  regReturning: string;
  branchLabel: string;
  existingLevelLabel: string;
  optional: string;
  noLevelPlaceholder: string;

  // Winter Options
  winterTermsLabel: string;
  termsCountLabel: string;
  terms1: string;
  terms2: string;
  terms3: string;
  terms4: string;
  siblingCountLabel: string;
  isYoungestLabel: string;
  discountSimulatorTitle: string;
  termsLabel: string;

  // Summer Options
  summerCampsLabel: string;
  camp1Label: string;
  camp2Label: string;
  camp3Label: string;
  starterLevelCheckbox: string;

  // Adult Options
  adultProductLabel: string;
  adultPackageLabel: string;

  // Manual Override
  manualOverrideTitle: string;
  manualOverrideActiveBadge: string;
  overrideAgeLabel: string;
  overrideCategoryLabel: string;
  overrideLevelLabel: string;

  // Result Card
  yearsOld: string;
  ageGroupLabel: string;
  programSeasonLabel: string;
  recommendedCourseTitle: string;
  academicLevelLabel: string;
  summerMappingLabel: string;
  summerMappingNotSpecified: string;
  ptTitle: string;
  ptRequired: string;
  ptNotRequired: string;
  ptFee: string;
  ptDuration: string;
  ptValidity: string;
  scheduleLabel: string;

  // Quick Answer
  salesQuickAnswerTitle: string;
  copyQuickAnswerBtn: string;
  copiedToast: string;
  quickAnswerDisclaimer: string;

  // Pricing & Breakdown
  pricingBreakdownTitle: string;
  basePriceLabel: string;
  totalDiscountLabel: string;
  finalAmountDueLabel: string;
  applicableDiscountsLabel: string;
  priceNotAvailable: string;

  // Installments Card
  installmentsTitle: string;
  eligibleBadge: string;
  notEligibleBadge: string;
  monthlyEstimate: string;

  // Branch Card
  branchInfoTitle: string;
  branchLocationLabel: string;
  branchHoursLabel: string;
  branchDaysLabel: string;
  branchManagerLabel: string;
  selectBranchPrompt: string;

  // Operational Notes
  operationalNotesTitle: string;

  // Common buttons
  copyBtn: string;
  copiedBtn: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    brandTitle: 'British Council Egypt',
    brandSubtitle: 'Sales Assistant & Instant Call Calculator',
    appName: 'Sales Assistant',
    searchPlaceholder: 'Search courses, levels, fees, branches...',
    searchShortcut: 'Ctrl + K',
    offlineReady: 'Offline Ready',
    whatsappLabel: 'WhatsApp',
    langSwitchButton: '🇪🇬 عربي (مصر)',
    quickActionsTitle: 'Quick Actions:',

    navCalculator: 'Student Calculator',
    navAdult: 'Adult Courses',
    navWinter: 'Winter Block',
    navSummer: 'Summer Camps',
    navBranches: 'Branches & Hours',
    navInstallments: 'Installments',
    navLinks: 'System Links',
    navQuickRef: 'Call Quick Answers',

    calcTitle: 'Student Calculator',
    calcSubtitle: 'Calculate eligibility, level, prices, and discounts quickly.',
    resetBtn: 'New Student',
    studentParameters: 'Student Parameters',
    liveCalcBadge: 'Live Calculation',
    quickPresetsLabel: '⚡ Quick Age Presets (Call Shortcuts)',
    dobLabel: 'Date of Birth',
    dobHelp: 'Calculates exact calendar age, age group, and PT requirement.',
    programLabel: 'Program / Season',
    programAuto: 'Auto Detect (Default based on Age)',
    programWinter: 'Winter Block (YL Terms 1–4)',
    programSummer: 'Summer School (YL Camps 1–3)',
    programAdult: 'Adult Courses (Beginner, BCE, IELTS)',
    regTypeLabel: 'Registration Type',
    regNew: 'New Student',
    regReturning: 'Re-registration (10% Disc)',
    branchLabel: 'Preferred Branch',
    existingLevelLabel: 'Current Level',
    optional: 'Optional',
    noLevelPlaceholder: 'No level specified — PT required to determine level',

    winterTermsLabel: 'Winter Term Booking & Bundle Discounts',
    termsCountLabel: 'Number of Terms Booked:',
    terms1: '1 Term',
    terms2: '2 Terms',
    terms3: '3 Terms',
    terms4: '4 Terms',
    siblingCountLabel: 'Number of Children Registering:',
    isYoungestLabel: 'This is the youngest child (eligible for 10% Sibling Discount)',
    discountSimulatorTitle: 'Discount Simulator',
    termsLabel: 'Terms',

    summerCampsLabel: 'Summer School Camps Selection',
    camp1Label: 'Camp 1 (5 Jul – 16 Jul 2026)',
    camp2Label: 'Camp 2 (26 Jul – 6 Aug 2026)',
    camp3Label: 'Camp 3 (9 Aug – 20 Aug 2026)',
    starterLevelCheckbox: 'Student is Starter Level (Starter A / B) — unlocks 10% on Camp 2 & 3',

    adultProductLabel: 'Product:',
    adultPackageLabel: 'Package:',

    manualOverrideTitle: 'Manual Override Panel',
    manualOverrideActiveBadge: 'MANUAL OVERRIDE ACTIVE',
    overrideAgeLabel: 'Override Age:',
    overrideCategoryLabel: 'Category:',
    overrideLevelLabel: 'Override Level:',

    yearsOld: 'Years Old',
    ageGroupLabel: 'Age Group',
    programSeasonLabel: 'Program / Season',
    recommendedCourseTitle: 'Recommended Course',
    academicLevelLabel: 'Academic Level',
    summerMappingLabel: 'Summer Camp Mapping:',
    summerMappingNotSpecified: 'Summer mapping not specified in current source.',
    ptTitle: 'Placement Test',
    ptRequired: 'REQUIRED',
    ptNotRequired: 'NOT REQUIRED',
    ptFee: 'PT Fee',
    ptDuration: 'Duration',
    ptValidity: 'Validity',
    scheduleLabel: 'Schedule',

    salesQuickAnswerTitle: 'Sales Call Quick Answer',
    copyQuickAnswerBtn: 'COPY QUICK ANSWER',
    copiedToast: 'COPIED TO CLIPBOARD!',
    quickAnswerDisclaimer: 'Clean customer-ready summary (internal codes excluded)',

    pricingBreakdownTitle: 'Tuition & Pricing Breakdown',
    basePriceLabel: 'Base Price',
    totalDiscountLabel: 'Total Discount',
    finalAmountDueLabel: 'Final Amount Due',
    applicableDiscountsLabel: 'Applicable Discounts:',
    priceNotAvailable: 'Price not available in current source',

    installmentsTitle: 'Installments',
    eligibleBadge: 'ELIGIBLE',
    notEligibleBadge: 'NOT ELIGIBLE',
    monthlyEstimate: 'Estimated Monthly Installment',

    branchInfoTitle: 'Branch & Center Info',
    branchLocationLabel: 'Location',
    branchHoursLabel: 'Hours',
    branchDaysLabel: 'Days',
    branchManagerLabel: 'Branch Manager',
    selectBranchPrompt: 'Select a preferred branch in the calculator to see specific location & hours.',

    operationalNotesTitle: 'Important Operational Notes',

    copyBtn: 'Copy',
    copiedBtn: 'Copied!',
  },

  ar: {
    brandTitle: 'المجلس الثقافي البريطاني مصر',
    brandSubtitle: 'المساعد الذكي لموظف المبيعات وحاسبة الأسعار السريعة',
    appName: 'حاسبة المبيعات',
    searchPlaceholder: 'ابحث عن الكورسات، المستويات، الأسعار، الفروع...',
    searchShortcut: 'Ctrl + K',
    offlineReady: 'يعمل بدون إنترنت',
    whatsappLabel: 'واتساب',
    langSwitchButton: '🇬🇧 English',
    quickActionsTitle: 'إجراءات سريعة:',

    navCalculator: 'حاسبة الطالب',
    navAdult: 'أسعار الكبار',
    navWinter: 'أسعار الشتوي',
    navSummer: 'معسكرات الصيف',
    navBranches: 'الفروع والمواعيد',
    navInstallments: 'التقسيط',
    navLinks: 'روابط النظام',
    navQuickRef: 'إجابات المكالمات',

    calcTitle: 'حاسبة الطالب',
    calcSubtitle: 'احسب الأهلية، المستوى، الأسعار والخصومات بسرعة وأنت مع العميل على الخط.',
    resetBtn: 'طالب جديد',
    studentParameters: 'بيانات الطالب والمكالمة',
    liveCalcBadge: 'حساب فوري مباشر',
    quickPresetsLabel: '⚡ اختصارات سريعة لسن الطالب أثناء المكالمة',
    dobLabel: 'تاريخ ميلاد الطالب (Date of Birth)',
    dobHelp: 'بيحسب السن بالسنة والشهر واليوم، والمرحلة الدراسية، وهل محتاج تحديد مستوى ولا لأ.',
    programLabel: 'البرنامج / الموسم',
    programAuto: 'تحديد تلقائي (حسب سن الطالب)',
    programWinter: 'البرنامج الشتوي - Winter Block (من ترم 1 لـ 4)',
    programSummer: 'المدرسة الصيفية - Summer Camps (معسكرات 1 لـ 3)',
    programAdult: 'كورسات الكبار - Adult Courses (Beginner, BCE, IELTS)',
    regTypeLabel: 'نوع التسجيل',
    regNew: 'طالب جديد (New Registration)',
    regReturning: 'إعادة تسجيل (خصم 10% Re-registration)',
    branchLabel: 'الفرع المفضل',
    existingLevelLabel: 'المستوى الحالي للطالب',
    optional: 'اختياري',
    noLevelPlaceholder: 'لم يتم تحديد المستوى — يمكن استخدام Placement Test',

    winterTermsLabel: 'حجز الترمات وخصم الحزم (Winter Block)',
    termsCountLabel: 'عدد الترمات المحجوزة:',
    terms1: 'ترم واحد',
    terms2: 'ترمين (خصم 5%)',
    terms3: '3 ترمات (خصم 10%)',
    terms4: '4 ترمات (خصم 15%)',
    siblingCountLabel: 'عدد الأخوات اللي بيسجلوا سوا:',
    isYoungestLabel: 'ده أصغر طفل في الأخوات (بيستحق خصم الأخوات 10%)',
    discountSimulatorTitle: 'محاكي الخصومات',
    termsLabel: 'عدد الترمات',

    summerCampsLabel: 'اختيار معسكرات الصيف (Summer Camps)',
    camp1Label: 'معسكر 1 (من 5 يوليو لـ 16 يوليو 2026)',
    camp2Label: 'معسكر 2 (من 26 يوليو لـ 6 أغسطس 2026)',
    camp3Label: 'معسكر 3 (من 9 أغسطس لـ 20 أغسطس 2026)',
    starterLevelCheckbox: 'الطالب في مستوى المبتدئين (Starter A أو B) — خصم 10% على معسكر 2 و 3',

    adultProductLabel: 'نوع الكورس:',
    adultPackageLabel: 'الباقة وعدد الساعات (Credits):',

    manualOverrideTitle: 'لوحة التعديل اليدوي (Manual Override)',
    manualOverrideActiveBadge: 'التعديل اليدوي مفعّل حالياً',
    overrideAgeLabel: 'تعديل السن يدوياً:',
    overrideCategoryLabel: 'الفئة:',
    overrideLevelLabel: 'تعديل المستوى:',

    yearsOld: 'سنة',
    ageGroupLabel: 'المرحلة العمرية',
    programSeasonLabel: 'البرنامج / الموسم',
    recommendedCourseTitle: 'الكورس المقترح للطالب',
    academicLevelLabel: 'المستوى الأكاديمي',
    summerMappingLabel: 'مستوى المعسكر الصيفي الموازي:',
    summerMappingNotSpecified: 'المستوى الصيفي غير محدد في الملف المصدر.',
    ptTitle: 'امتحان تحديد المستوى (Placement Test)',
    ptRequired: 'مطلوب إلزامي',
    ptNotRequired: 'غير مطلوب (معفي)',
    ptFee: 'رسوم الامتحان',
    ptDuration: 'مدة الامتحان',
    ptValidity: 'صلاحية النتيجة',
    scheduleLabel: 'مواعيد وعدد الحصص',

    salesQuickAnswerTitle: 'الرد السريع للعميل على المكالمة (جاهز للقراءة أو النسخ)',
    copyQuickAnswerBtn: 'نسخ الإجابة للعميل',
    copiedToast: 'تم النسخ بنجاح للحافظة!',
    quickAnswerDisclaimer: 'ملخص احترافي جاهز للعميل ومناسب للواتساب (خالي من أي أكواد داخلية)',

    pricingBreakdownTitle: 'تفاصيل المصروفات والخصومات المطبقة',
    basePriceLabel: 'المصروفات الأساسية',
    totalDiscountLabel: 'إجمالي الخصم',
    finalAmountDueLabel: 'المبلغ النهائي المطلوب',
    applicableDiscountsLabel: 'الخصومات المطبقة:',
    priceNotAvailable: 'السعر غير مدرج بالملف المصدر حالياً',

    installmentsTitle: 'إمكانية التقسيط بالفيزا',
    eligibleBadge: 'متاح التقسيط',
    notEligibleBadge: 'غير متاح التقسيط',
    monthlyEstimate: 'القسط الشهري التقريبي',

    branchInfoTitle: 'معلومات الفرع ومواعيد العمل',
    branchLocationLabel: 'العنوان',
    branchHoursLabel: 'مواعيد العمل',
    branchDaysLabel: 'أيام العمل',
    branchManagerLabel: 'مدير الفرع',
    selectBranchPrompt: 'اختر الفرع المفضل من الحاسبة لعرض العنوان ومواعيد خدمة العملاء بالتفصيل.',

    operationalNotesTitle: 'ملاحظات تشغيلية هامة للسيستم',

    copyBtn: 'نسخ',
    copiedBtn: 'تم النسخ!',
  },
};
