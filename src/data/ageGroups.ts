// src/data/ageGroups.ts

/**
 * Exact age‑group mapping as defined in the source Excel workbook.
 * The keys are the age in years; the values contain the group name
 * and any sub‑group identifier used elsewhere in the UI.
 */
export const AGE_GROUPS: Record<number, { group: string; subGroup: string }> = {
  4: { group: 'Early Years', subGroup: '2' },
  5: { group: 'Early Years', subGroup: '3' },
  // Lower Primary: ages 6, 7, 8
  6: { group: 'Lower Primary', subGroup: '' },
  7: { group: 'Lower Primary', subGroup: '' },
  8: { group: 'Lower Primary', subGroup: '' },
  // Upper Primary: ages 9, 10, 11
  9: { group: 'Upper Primary', subGroup: '' },
  10: { group: 'Upper Primary', subGroup: '' },
  11: { group: 'Upper Primary', subGroup: '' },
  // Lower Secondary: ages 12, 13, 14
  12: { group: 'Lower Secondary', subGroup: '' },
  13: { group: 'Lower Secondary', subGroup: '' },
  14: { group: 'Lower Secondary', subGroup: '' },
  // Upper Secondary: ages 15, 16, 17
  15: { group: 'Upper Secondary', subGroup: '' },
  16: { group: 'Upper Secondary', subGroup: '' },
  17: { group: 'Upper Secondary', subGroup: '' },
};
