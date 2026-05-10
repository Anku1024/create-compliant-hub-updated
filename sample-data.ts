// lib/sample-data.ts
// Drop-in sample data for the DHCS Compliance Hub MVP
// Replace these with Supabase calls in Phase 2

export type PriorityLevel = 'High' | 'Medium' | 'Low'
export type CAPStatus = 'Open' | 'In Progress' | 'Submitted' | 'Closed'
export type ProgramArea = 'Mental Health' | 'SUD' | 'Access & Timeliness' | 'Quality Improvement'
export type Severity = 'Critical' | 'Major' | 'Minor'
export type ActionStatus = 'Completed' | 'In Progress' | 'Pending'
export type AutomationLevel = 'Full Auto' | 'Semi-Auto' | 'AI Draft' | 'Human Required'

export interface CAP {
  id: string
  cap_number: string
  title: string
  description: string
  program_area: ProgramArea
  priority: PriorityLevel
  status: CAPStatus
  assigned_to: string | null
  issued_date: string
  due_date: string
  issuing_entity: string
  summary: string
  findings_count: number
  actions_count: number
  actions_completed: number
  questions_answered: number
  questions_total: number
  is_overdue: boolean
  days_overdue: number | null
  thirty_day_met: boolean
  thirty_day_response_date: string | null
  overdue_actions: number
}

export interface Finding {
  id: string
  cap_id: string
  description: string
  severity: Severity
  mhp_code: string | null
  status: 'Open' | 'Resolved'
}

export interface Question {
  id: string
  cap_id: string
  question_number: number
  question_text: string
  finding_reference: string
  automation_level: AutomationLevel
  ai_draft: string | null
  ai_source_cap: string | null
  ai_confidence: number | null
  answered: boolean
  answer_text: string | null
}

export interface Action {
  id: string
  cap_id: string
  title: string
  description: string
  owner: string
  due_date: string
  status: ActionStatus
  is_overdue: boolean
  days_overdue: number | null
}

export interface EmailThread {
  id: string
  cap_id: string | null
  from_address: string
  subject: string
  date: string
  preview: string
  attachments: string[]
  is_new: boolean
  direction: 'inbound' | 'outbound'
}

export interface Note {
  id: string
  cap_id: string
  author_name: string
  body: string
  created_at: string
}

// ─────────────────────────────────────────────────────────────
// CAPs
// ─────────────────────────────────────────────────────────────
export const SAMPLE_CAPS: CAP[] = [
  {
    id: 'cap-001',
    cap_number: 'CAP-2024-001',
    title: 'Mental Health Documentation Standards',
    description: 'Incomplete assessments, missing signatures, inconsistent note formats',
    program_area: 'Mental Health',
    priority: 'High',
    status: 'In Progress',
    assigned_to: 'R. Patel',
    issued_date: '2024-01-14',
    due_date: '2024-04-14',
    issuing_entity: 'DHCS',
    summary: 'DHCS identified deficiencies in mental health documentation standards across county facilities during FY2024 network certification review.',
    findings_count: 3,
    actions_count: 3,
    actions_completed: 1,
    questions_answered: 1,
    questions_total: 3,
    is_overdue: true,
    days_overdue: 21,
    thirty_day_met: true,
    thirty_day_response_date: '2024-02-13',
    overdue_actions: 1,
  },
  {
    id: 'cap-002',
    cap_number: 'CAP-2024-002',
    title: 'SUD Service Access Timeliness',
    description: '30-day contact rule violations, provider ratio gaps across SUD clinics',
    program_area: 'Access & Timeliness',
    priority: 'High',
    status: 'Open',
    assigned_to: null,
    issued_date: '2024-01-31',
    due_date: '2024-04-30',
    issuing_entity: 'DHCS',
    summary: 'County SUD programs failed to meet 30-day initial contact requirements and provider-to-client ratio standards.',
    findings_count: 3,
    actions_count: 3,
    actions_completed: 0,
    questions_answered: 0,
    questions_total: 3,
    is_overdue: true,
    days_overdue: 5,
    thirty_day_met: false,
    thirty_day_response_date: null,
    overdue_actions: 0,
  },
  {
    id: 'cap-003',
    cap_number: 'CAP-2023-015',
    title: 'Quality Improvement Program Compliance',
    description: 'QI program structure deficiencies, audit cycle gaps identified',
    program_area: 'Quality Improvement',
    priority: 'Medium',
    status: 'Submitted',
    assigned_to: 'L. Chen',
    issued_date: '2023-11-09',
    due_date: '2024-02-09',
    issuing_entity: 'DHCS',
    summary: 'County QI program lacked required committee structure and documented audit cycles per DHCS standards.',
    findings_count: 3,
    actions_count: 3,
    actions_completed: 3,
    questions_answered: 3,
    questions_total: 3,
    is_overdue: false,
    days_overdue: null,
    thirty_day_met: true,
    thirty_day_response_date: '2023-12-09',
    overdue_actions: 0,
  },
  {
    id: 'cap-004',
    cap_number: 'CAP-2024-003',
    title: 'MHP274 Provider Network Data Quality',
    description: 'Provider FTE exceeding 100%, expired contract dates, missing service types',
    program_area: 'Access & Timeliness',
    priority: 'High',
    status: 'Open',
    assigned_to: null,
    issued_date: '2026-05-02',
    due_date: '2026-06-02',
    issuing_entity: 'DHCS',
    summary: 'Annual network certification identified multiple MHP274 data quality errors including FTE calculations and expired provider contracts.',
    findings_count: 4,
    actions_count: 4,
    actions_completed: 0,
    questions_answered: 0,
    questions_total: 4,
    is_overdue: false,
    days_overdue: null,
    thirty_day_met: false,
    thirty_day_response_date: null,
    overdue_actions: 0,
  },
  {
    id: 'cap-005',
    cap_number: 'CAP-2023-008',
    title: 'Psychiatric Crisis Response Timeliness',
    description: 'Crisis response times exceeding DHCS thresholds at 3 of 5 sites',
    program_area: 'Mental Health',
    priority: 'Medium',
    status: 'Closed',
    assigned_to: 'M. Torres',
    issued_date: '2023-07-15',
    due_date: '2023-10-15',
    issuing_entity: 'DHCS',
    summary: 'Psychiatric crisis response times at Modesto, Ceres, and Turlock sites exceeded the 60-minute DHCS standard in Q2 2023.',
    findings_count: 2,
    actions_count: 4,
    actions_completed: 4,
    questions_answered: 2,
    questions_total: 2,
    is_overdue: false,
    days_overdue: null,
    thirty_day_met: true,
    thirty_day_response_date: '2023-08-14',
    overdue_actions: 0,
  },
]

// ─────────────────────────────────────────────────────────────
// FINDINGS
// ─────────────────────────────────────────────────────────────
export const SAMPLE_FINDINGS: Finding[] = [
  { id: 'f001', cap_id: 'cap-001', description: 'Incomplete client assessment documentation in 15% of reviewed records', severity: 'Major', mhp_code: null, status: 'Open' },
  { id: 'f002', cap_id: 'cap-001', description: 'Missing supervisor signatures on treatment plans across all 4 facilities', severity: 'Critical', mhp_code: null, status: 'Open' },
  { id: 'f003', cap_id: 'cap-001', description: 'Inconsistent progress note formats between Modesto and Ceres facilities', severity: 'Minor', mhp_code: null, status: 'Open' },
  { id: 'f004', cap_id: 'cap-002', description: '28% of new SUD clients not contacted within 30 days of referral in Q4 2023', severity: 'Critical', mhp_code: null, status: 'Open' },
  { id: 'f005', cap_id: 'cap-002', description: 'Provider-to-client ratio below DHCS standard in 2 of 4 SUD outpatient clinics', severity: 'Major', mhp_code: 'MHP007', status: 'Open' },
  { id: 'f006', cap_id: 'cap-002', description: 'No documented timeliness monitoring process or escalation protocol in place', severity: 'Major', mhp_code: null, status: 'Open' },
  { id: 'f007', cap_id: 'cap-003', description: 'QI committee membership does not include required consumer representative', severity: 'Major', mhp_code: null, status: 'Resolved' },
  { id: 'f008', cap_id: 'cap-003', description: 'Annual QI work plan not completed for FY2023', severity: 'Major', mhp_code: null, status: 'Resolved' },
  { id: 'f009', cap_id: 'cap-003', description: 'QI meeting minutes not documented for 3 of last 4 quarterly meetings', severity: 'Minor', mhp_code: null, status: 'Resolved' },
  { id: 'f010', cap_id: 'cap-004', description: 'Provider FTE for rendering providers exceeds 100% across all sites and age groups', severity: 'Critical', mhp_code: 'MHP007', status: 'Open' },
  { id: 'f011', cap_id: 'cap-004', description: 'Frequent listings of expired provider contract dates in MHP274 submission', severity: 'Major', mhp_code: 'MHP008c', status: 'Open' },
  { id: 'f012', cap_id: 'cap-004', description: 'Plan does not list provider for Intensive Outpatient service type at main site', severity: 'Major', mhp_code: 'MHP010', status: 'Open' },
  { id: 'f013', cap_id: 'cap-004', description: 'Geographic access standard not met for rural areas — nearest provider >45 miles', severity: 'Minor', mhp_code: 'MHP011', status: 'Open' },
  { id: 'f014', cap_id: 'cap-005', description: 'Crisis response times exceeded 60-minute DHCS standard at 3 of 5 sites in Q2 2023', severity: 'Critical', mhp_code: null, status: 'Resolved' },
  { id: 'f015', cap_id: 'cap-005', description: 'On-call psychiatrist coverage gap on weekends at Turlock site', severity: 'Major', mhp_code: null, status: 'Resolved' },
]

// ─────────────────────────────────────────────────────────────
// QUESTIONS
// ─────────────────────────────────────────────────────────────
export const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 'q001', cap_id: 'cap-001', question_number: 1,
    question_text: 'Describe the root cause of incomplete client assessment documentation found in 15% of reviewed records.',
    finding_reference: 'Incomplete client assessment documentation in 15% of reviewed records (Major)',
    automation_level: 'AI Draft',
    ai_draft: null, ai_source_cap: null, ai_confidence: null,
    answered: true,
    answer_text: 'Root cause analysis identified insufficient staff training on the updated assessment template rolled out in Q3 2023. 12 of 15 flagged records were completed by staff hired after July 2023 who did not receive the updated template training. Additionally, the EHR system did not enforce required fields, allowing incomplete records to be finalized.',
  },
  {
    id: 'q002', cap_id: 'cap-001', question_number: 2,
    question_text: 'Provide a corrective action plan to address missing supervisor signatures on all treatment plans.',
    finding_reference: 'Missing supervisor signatures on treatment plans across all 4 facilities (Critical)',
    automation_level: 'AI Draft',
    ai_draft: 'The county will implement a mandatory electronic co-signature workflow via the EHR system requiring supervisor approval on all treatment plans before finalization. All supervisors will complete refresher training on documentation requirements by May 1, 2024. A weekly automated compliance report will flag any unsigned plans pending over 48 hours. Compliance will be monitored monthly for 90 days post-implementation with results reported to QI committee.',
    ai_source_cap: 'CAP-2023-008',
    ai_confidence: 81,
    answered: false,
    answer_text: null,
  },
  {
    id: 'q003', cap_id: 'cap-001', question_number: 3,
    question_text: 'How will the county standardize progress note formats across all facilities to ensure consistency?',
    finding_reference: 'Inconsistent progress note formats between Modesto and Ceres facilities (Minor)',
    automation_level: 'Human Required',
    ai_draft: null, ai_source_cap: null, ai_confidence: null,
    answered: false,
    answer_text: null,
  },
  {
    id: 'q004', cap_id: 'cap-002', question_number: 1,
    question_text: "Describe the county's specific plan to achieve 30-day initial contact compliance for all new SUD referrals.",
    finding_reference: '28% of new SUD clients not contacted within 30 days of referral in Q4 2023 (Critical)',
    automation_level: 'AI Draft',
    ai_draft: 'The county will implement a daily automated outreach tracking report identifying clients not yet contacted within 25 days of referral, creating a 5-day buffer before the deadline. Care coordinators will be paired to ensure backup coverage. A dedicated SUD intake coordinator position will be created and filled within 60 days. Timeliness compliance will be tracked weekly with a target of 95% within 30 days by Q2 2024.',
    ai_source_cap: 'CAP-2022-004',
    ai_confidence: 76,
    answered: false,
    answer_text: null,
  },
  {
    id: 'q005', cap_id: 'cap-002', question_number: 2,
    question_text: 'What specific corrective steps will address the provider-to-client ratio deficiencies at the 2 underperforming SUD clinics?',
    finding_reference: 'Provider-to-client ratio below DHCS standard in 2 of 4 SUD clinics (Major)',
    automation_level: 'AI Draft',
    ai_draft: 'The county will conduct an immediate provider needs assessment across all SUD clinic sites. A targeted recruitment campaign for licensed SUD counselors will launch within 30 days with a 90-day fill timeline. Two new counselor positions have been approved in the current budget cycle. Interim licensed contractor staffing will be procured to maintain ratio compliance while permanent hiring is completed.',
    ai_source_cap: 'CAP-2023-002',
    ai_confidence: 68,
    answered: false,
    answer_text: null,
  },
  {
    id: 'q006', cap_id: 'cap-002', question_number: 3,
    question_text: 'Describe the ongoing monitoring process the county will implement to sustain timeliness compliance after corrective actions are complete.',
    finding_reference: 'No documented timeliness monitoring process or escalation protocol in place (Major)',
    automation_level: 'Human Required',
    ai_draft: null, ai_source_cap: null, ai_confidence: null,
    answered: false,
    answer_text: null,
  },
  {
    id: 'q007', cap_id: 'cap-003', question_number: 1,
    question_text: 'Describe the corrective actions taken to restructure the QI committee to include all required membership categories.',
    finding_reference: 'QI committee membership does not include required consumer representative (Major)',
    automation_level: 'Semi-Auto',
    ai_draft: null, ai_source_cap: null, ai_confidence: null,
    answered: true,
    answer_text: 'The county restructured its QI committee to include clinical directors, administrative leadership, a peer support specialist, and two consumer representatives recruited through the county mental health board. Membership roster was updated in November 2023 and ratified by the BH Director.',
  },
  {
    id: 'q008', cap_id: 'cap-003', question_number: 2,
    question_text: 'Provide the completed FY2023 QI work plan and describe how future work plans will be completed by the required deadline.',
    finding_reference: 'Annual QI work plan not completed for FY2023 (Major)',
    automation_level: 'Semi-Auto',
    ai_draft: null, ai_source_cap: null, ai_confidence: null,
    answered: true,
    answer_text: 'The FY2023 QI work plan was completed retroactively and is attached to this response. Going forward, the QI Coordinator will be responsible for initiating the work plan process no later than September 1 each year, with board approval by October 31.',
  },
  {
    id: 'q009', cap_id: 'cap-003', question_number: 3,
    question_text: 'How will the county ensure QI meeting minutes are consistently documented and retained going forward?',
    finding_reference: 'QI meeting minutes not documented for 3 of last 4 quarterly meetings (Minor)',
    automation_level: 'Semi-Auto',
    ai_draft: null, ai_source_cap: null, ai_confidence: null,
    answered: true,
    answer_text: 'A standardized meeting minutes template has been adopted and assigned to the QI Coordinator as a standing responsibility. Minutes will be circulated within 5 business days of each meeting and stored in the shared compliance document repository accessible to all committee members.',
  },
  {
    id: 'q010', cap_id: 'cap-004', question_number: 1,
    question_text: 'Explain how the county will correct FTE reporting for rendering providers to ensure totals do not exceed 100% across all sites.',
    finding_reference: 'Provider FTE exceeds 100% across all sites and age groups (MHP007 - Critical)',
    automation_level: 'Full Auto',
    ai_draft: 'The county will audit all provider FTE allocations in the current MHP274 submission. Providers assigned to multiple sites will have FTE prorated accurately to sum to 100% maximum. HR records will be cross-referenced against submission data quarterly. A validation check will be added to the pre-submission workflow to flag any provider exceeding 100% FTE.',
    ai_source_cap: 'CAP-2022-011',
    ai_confidence: 91,
    answered: false,
    answer_text: null,
  },
  {
    id: 'q011', cap_id: 'cap-004', question_number: 2,
    question_text: 'Describe the process the county will implement to prevent submission of expired provider contract dates.',
    finding_reference: 'Frequent listings of expired provider contract dates in MHP274 submission (MHP008c - Major)',
    automation_level: 'Full Auto',
    ai_draft: 'The county will implement a contract expiration alert system notifying the contracts team 90 days before any provider contract expires. The MHP274 submission process will include a pre-submission validation step that blocks submission if any contract end dates are in the past. All existing contracts will be audited and updated within 45 days.',
    ai_source_cap: 'CAP-2022-011',
    ai_confidence: 88,
    answered: false,
    answer_text: null,
  },
  {
    id: 'q012', cap_id: 'cap-004', question_number: 3,
    question_text: 'Identify the specific site and service type gap for MHP010 and provide a timeline for adding the required provider.',
    finding_reference: 'No provider listed for Intensive Outpatient service type at main site (MHP010 - Major)',
    automation_level: 'Human Required',
    ai_draft: null, ai_source_cap: null, ai_confidence: null,
    answered: false,
    answer_text: null,
  },
  {
    id: 'q013', cap_id: 'cap-004', question_number: 4,
    question_text: "Describe the county's plan to meet geographic access standards for rural areas identified as out-of-compliance.",
    finding_reference: 'Geographic access standard not met — nearest provider >45 miles in rural areas (MHP011 - Minor)',
    automation_level: 'Human Required',
    ai_draft: null, ai_source_cap: null, ai_confidence: null,
    answered: false,
    answer_text: null,
  },
]

// ─────────────────────────────────────────────────────────────
// ACTIONS
// ─────────────────────────────────────────────────────────────
export const SAMPLE_ACTIONS: Action[] = [
  { id: 'a001', cap_id: 'cap-001', title: 'Standardize assessment templates', description: 'Implement standardized assessment template across all 4 county facilities in EHR system', owner: 'Clinical Director', due_date: '2024-02-27', status: 'Completed', is_overdue: false, days_overdue: null },
  { id: 'a002', cap_id: 'cap-001', title: 'Electronic signature workflow', description: 'Establish mandatory electronic co-signature workflow for supervisors in EHR', owner: 'IT Manager', due_date: '2024-03-14', status: 'In Progress', is_overdue: true, days_overdue: 51 },
  { id: 'a003', cap_id: 'cap-001', title: 'Staff training program', description: 'Conduct documentation standards training for all clinical staff county-wide', owner: 'Education Dept', due_date: '2024-04-01', status: 'In Progress', is_overdue: false, days_overdue: null },
  { id: 'a004', cap_id: 'cap-002', title: 'Implement daily outreach tracking report', description: 'Automated daily report flagging SUD clients approaching 25-day outreach mark', owner: 'IT Manager', due_date: '2024-03-15', status: 'Pending', is_overdue: false, days_overdue: null },
  { id: 'a005', cap_id: 'cap-002', title: 'SUD counselor recruitment campaign', description: 'Post and fill 2 approved licensed SUD counselor positions', owner: 'HR Director', due_date: '2024-05-01', status: 'Pending', is_overdue: false, days_overdue: null },
  { id: 'a006', cap_id: 'cap-002', title: 'Establish monthly timeliness audit', description: 'Create recurring QI review process for 30-day compliance monitoring', owner: 'QI Coordinator', due_date: '2024-04-15', status: 'Pending', is_overdue: false, days_overdue: null },
  { id: 'a007', cap_id: 'cap-003', title: 'Restructure QI committee membership', description: 'Add consumer representatives and required membership categories', owner: 'BH Director', due_date: '2023-12-15', status: 'Completed', is_overdue: false, days_overdue: null },
  { id: 'a008', cap_id: 'cap-003', title: 'Complete FY2023 QI work plan', description: 'Retroactively complete and board-approve FY2023 annual QI work plan', owner: 'QI Coordinator', due_date: '2024-01-10', status: 'Completed', is_overdue: false, days_overdue: null },
  { id: 'a009', cap_id: 'cap-003', title: 'Implement meeting minutes documentation process', description: 'Adopt standardized minutes template and document retention in shared repository', owner: 'QI Coordinator', due_date: '2024-01-20', status: 'Completed', is_overdue: false, days_overdue: null },
  { id: 'a010', cap_id: 'cap-004', title: 'Audit and correct FTE allocations', description: 'Cross-reference all provider FTE against HR records and correct MHP274 submission', owner: 'Contracts Manager', due_date: '2026-05-20', status: 'Pending', is_overdue: false, days_overdue: null },
  { id: 'a011', cap_id: 'cap-004', title: 'Contract expiration alert system', description: 'Implement 90-day contract renewal alerts and pre-submission validation', owner: 'IT Manager', due_date: '2026-05-25', status: 'Pending', is_overdue: false, days_overdue: null },
  { id: 'a012', cap_id: 'cap-004', title: 'Recruit IOP service provider', description: 'Identify and contract Intensive Outpatient provider for main site', owner: 'Network Manager', due_date: '2026-06-01', status: 'Pending', is_overdue: false, days_overdue: null },
  { id: 'a013', cap_id: 'cap-004', title: 'Rural access telehealth expansion', description: 'Expand telehealth coverage to meet geographic access standard in rural areas', owner: 'Clinical Director', due_date: '2026-06-01', status: 'Pending', is_overdue: false, days_overdue: null },
]

// ─────────────────────────────────────────────────────────────
// EMAILS
// ─────────────────────────────────────────────────────────────
export const SAMPLE_EMAILS: EmailThread[] = [
  { id: 'e001', cap_id: 'cap-001', from_address: 'NAOS@DHCS.CA.GOV', subject: 'CAP-2024-001 Issued — Mental Health Documentation Standards', date: '2024-01-14', preview: 'These are the data you submitted to DHCS and your findings. You are required to provide a response to these questions within 30 calendar days of this notice.', attachments: ['CAP-2024-001_Results.pdf', 'Findings_Detail.pdf'], is_new: false, direction: 'inbound' },
  { id: 'e002', cap_id: 'cap-001', from_address: 'R. Patel (Internal)', subject: 'RE: CAP-2024-001 — 30-day response submitted', date: '2024-02-13', preview: 'We acknowledge receipt of the CAP findings and have initiated corrective actions as outlined in the attached response plan.', attachments: ['Response_Plan_CAP-2024-001.pdf'], is_new: false, direction: 'outbound' },
  { id: 'e003', cap_id: 'cap-002', from_address: 'NAOS@DHCS.CA.GOV', subject: 'CAP-2024-002 Issued — SUD Service Access Timeliness', date: '2024-01-31', preview: 'Findings related to SUD service access and timeliness compliance have been identified. Response required within 30 days.', attachments: ['CAP-2024-002_Results.pdf'], is_new: false, direction: 'inbound' },
  { id: 'e004', cap_id: 'cap-003', from_address: 'NAOS@DHCS.CA.GOV', subject: 'CAP-2023-015 Issued — Quality Improvement Program Compliance', date: '2023-11-09', preview: 'Quality improvement program compliance review findings attached. 30-day response required.', attachments: ['CAP-2023-015_Results.pdf'], is_new: false, direction: 'inbound' },
  { id: 'e005', cap_id: 'cap-004', from_address: 'NAOS@DHCS.CA.GOV', subject: 'CAP-2024-003 Issued — MHP274 Provider Network Data Quality', date: '2026-05-02', preview: 'The FY2025-26 Annual Network Certification Results findings are attached. Response required by June 2, 2026. Questions 1-4 must be answered in full.', attachments: ['CAP-2024-003_Results.pdf', 'MHP274_Findings_Detail.pdf'], is_new: true, direction: 'inbound' },
  { id: 'e006', cap_id: null, from_address: 'NAOS@DHCS.CA.GOV', subject: 'FY2025-26 Annual Network Certification Results & CAP Webinar', date: '2024-03-05', preview: 'The FY2025-26 Annual Network Certification Results & CAP Webinar has been posted to the DHCS YouTube channel. Slide deck attached.', attachments: ['CAP_Webinar_Slides.pdf'], is_new: false, direction: 'inbound' },
]

// ─────────────────────────────────────────────────────────────
// NOTES
// ─────────────────────────────────────────────────────────────
export const SAMPLE_NOTES: Note[] = [
  { id: 'n001', cap_id: 'cap-001', author_name: 'R. Patel', body: 'IT team confirmed e-signature module is in QA testing. Expected go-live April 5. Will update action status once confirmed.', created_at: '2024-03-20T10:30:00Z' },
  { id: 'n002', cap_id: 'cap-001', author_name: 'Admin', body: '30-day response submitted to DHCS on Feb 13. Awaiting acknowledgement from NAOS.', created_at: '2024-02-14T09:00:00Z' },
  { id: 'n003', cap_id: 'cap-002', author_name: 'Admin', body: 'CAP received. Needs immediate assignment — 30-day deadline approaching in 3 days. Escalating to BH Director.', created_at: '2024-02-01T08:15:00Z' },
  { id: 'n004', cap_id: 'cap-003', author_name: 'L. Chen', body: 'All three corrective actions completed and documented. Final response package submitted to DHCS Dec 9. Awaiting closure confirmation.', created_at: '2023-12-09T16:45:00Z' },
  { id: 'n005', cap_id: 'cap-004', author_name: 'Admin', body: 'New CAP received May 2. MHP274 data quality findings — FTE, contracts, and service type gaps. Needs assignment by EOD. High priority.', created_at: '2026-05-02T14:00:00Z' },
]

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
export const getCapFindings = (capId: string) =>
  SAMPLE_FINDINGS.filter(f => f.cap_id === capId)

export const getCapQuestions = (capId: string) =>
  SAMPLE_QUESTIONS.filter(q => q.cap_id === capId).sort((a, b) => a.question_number - b.question_number)

export const getCapActions = (capId: string) =>
  SAMPLE_ACTIONS.filter(a => a.cap_id === capId)

export const getCapEmails = (capId: string) =>
  SAMPLE_EMAILS.filter(e => e.cap_id === capId)

export const getCapNotes = (capId: string) =>
  SAMPLE_NOTES.filter(n => n.cap_id === capId)

export const getAllInboxEmails = () =>
  SAMPLE_EMAILS.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

export const ASSIGNEES = ['R. Patel', 'L. Chen', 'M. Torres', 'S. Nguyen', 'Unassigned']
export const PROGRAM_AREAS: ProgramArea[] = ['Mental Health', 'SUD', 'Access & Timeliness', 'Quality Improvement']
export const PRIORITIES: PriorityLevel[] = ['High', 'Medium', 'Low']
export const STATUSES: CAPStatus[] = ['Open', 'In Progress', 'Submitted', 'Closed']
