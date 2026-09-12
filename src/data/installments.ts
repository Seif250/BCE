// Source: EG outbound Knowledge base.xlsx — Adult and YL WB sheets
// Installment guidelines, criteria, and administrative expense rates

export interface AdultInstallmentTier {
  months: 6 | 12;
  adminRate: number; // 0.09 or 0.15
  adminPercentageLabel: string;
}

export const ADULT_INSTALLMENT_RULES = {
  paymentMethod: 'Credit Card (student must pay the whole amount with a credit card)',
  eligibleCreditPackages: [40, 60],
  applicableRegistrations: ['New Registration', 'Re-registration'],
  tenures: [
    {
      months: 6,
      adminRate: 0.09,
      adminPercentageLabel: '9%',
    },
    {
      months: 12,
      adminRate: 0.15,
      adminPercentageLabel: '15%',
    },
  ] as AdultInstallmentTier[],
  referenceSource: 'Installment Charges Calculator - Updated.xlsx',
  notes: [
    'Valid ONLY for 40 credits and 60 credits packages.',
    'Student must pay full amount with a credit card.',
    'Administrative expense: 9% for 6 months, 15% for 12 months.',
    'Applicable for both new registration and re-registration.',
    'Use the official Installment Charges Calculator workbook for final bank-verified installment charges.',
  ],
};

export const YL_INSTALLMENT_RULES = {
  minTermsRequired: 2,
  applicablePrograms: ['Winter Block'],
  referenceSource: 'Installment Charges Calculator - Updated.xlsx',
  notes: [
    'No installment available for 1 single term booking.',
    'Bookings must start from 2 terms to qualify for installment options.',
    'Use official Installment Charges Calculator - Updated.xlsx for final schedule.',
  ],
};
