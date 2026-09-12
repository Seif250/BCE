// Source: EG outbound Knowledge base.xlsx — CRM Affiliates sheet
// Internal task codes for CRM tracking (LED, ANR, Queues)
// Kept isolated as internal reference only, never leaked into customer quick answer copy

export interface CrmTaskCode {
  taskName: string;
  usedCode: string;
  wonCode: string;
  lostCode: string;
}

export const CRM_TASK_CODES: CrmTaskCode[] = [
  {
    taskName: 'Assign',
    usedCode: 'LED',
    wonCode: 'LED-CC or LED-CS',
    lostCode: 'LED',
  },
  {
    taskName: 'Attend not registered',
    usedCode: 'ANR',
    wonCode: 'ANR-CC or ANR-CS',
    lostCode: 'ANR',
  },
];

export const CRM_COMPLAINT_QUEUES = [
  'Egypt Young learners Complaints Queue',
  'Egypt Adult learners Complaints Queue',
];
