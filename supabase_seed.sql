-- ============================================================
-- DHCS Compliance Hub — Seed Data
-- Run AFTER supabase_schema.sql
-- Creates demo profiles, CAPs, findings, questions, actions,
-- email threads, and notes for the MVP demo.
-- ============================================================

-- ── DEMO PROFILES ────────────────────────────────────────────
-- Note: In production these come from auth.users.
-- For seeding, insert directly with fixed UUIDs.
-- Drop the auth.users FK (if present from older schema) so demo
-- profiles can be seeded without real auth.users rows.
alter table public.profiles drop constraint if exists profiles_id_fkey;

insert into public.profiles (id, full_name, email, role, department) values
  ('00000000-0000-0000-0000-000000000001', 'R. Patel',   'r.patel@stancounty.ca.gov',   'staff', 'Quality Assurance'),
  ('00000000-0000-0000-0000-000000000002', 'L. Chen',    'l.chen@stancounty.ca.gov',    'staff', 'Compliance'),
  ('00000000-0000-0000-0000-000000000003', 'M. Torres',  'm.torres@stancounty.ca.gov',  'staff', 'Behavioral Health'),
  ('00000000-0000-0000-0000-000000000004', 'S. Nguyen',  's.nguyen@stancounty.ca.gov',  'staff', 'SUD Programs'),
  ('00000000-0000-0000-0000-000000000005', 'Admin User', 'admin@stancounty.ca.gov',     'admin', 'Administration')
on conflict (id) do nothing;

-- ── CAPS ─────────────────────────────────────────────────────
insert into public.caps (id, cap_number, title, description, program_area, priority, status,
  assigned_to, issued_date, due_date, issuing_entity, summary, thirty_day_met, thirty_day_response_date) values

('ca000001-0000-0000-0000-000000000001',
 'CAP-2024-001', 'Mental Health Documentation Standards',
 'Incomplete assessments, missing signatures, inconsistent note formats',
 'Mental Health', 'High', 'In Progress',
 '00000000-0000-0000-0000-000000000001',
 '2024-01-14', '2024-04-14', 'DHCS',
 'DHCS identified deficiencies in mental health documentation standards across county facilities during FY2024 network certification review.',
 true, '2024-02-13'),

('ca000002-0000-0000-0000-000000000002',
 'CAP-2024-002', 'SUD Service Access Timeliness',
 '30-day contact rule violations, provider ratio gaps across SUD clinics',
 'Access & Timeliness', 'High', 'Open',
 null,
 '2024-01-31', '2024-04-30', 'DHCS',
 'County SUD programs failed to meet 30-day initial contact requirements and provider-to-client ratio standards.',
 false, null),

('ca000003-0000-0000-0000-000000000003',
 'CAP-2023-015', 'Quality Improvement Program Compliance',
 'QI program structure deficiencies, audit cycle gaps identified',
 'Quality Improvement', 'Medium', 'Submitted',
 '00000000-0000-0000-0000-000000000002',
 '2023-11-09', '2024-02-09', 'DHCS',
 'County QI program lacked required committee structure and documented audit cycles per DHCS standards.',
 true, '2023-12-09'),

('ca000004-0000-0000-0000-000000000004',
 'CAP-2024-003', 'MHP274 Provider Network Data Quality',
 'Provider FTE exceeding 100%, expired contract dates, missing service types',
 'Access & Timeliness', 'High', 'Open',
 null,
 '2026-05-02', '2026-06-02', 'DHCS',
 'Annual network certification identified multiple MHP274 data quality errors including FTE calculations and expired provider contracts.',
 false, null),

('ca000005-0000-0000-0000-000000000005',
 'CAP-2023-008', 'Psychiatric Crisis Response Timeliness',
 'Crisis response times exceeding DHCS thresholds at 3 of 5 sites',
 'Mental Health', 'Medium', 'Closed',
 '00000000-0000-0000-0000-000000000003',
 '2023-07-15', '2023-10-15', 'DHCS',
 'Psychiatric crisis response times at Modesto, Ceres, and Turlock sites exceeded the 60-minute DHCS standard in Q2 2023.',
 true, '2023-08-14');

-- ── FINDINGS ─────────────────────────────────────────────────
insert into public.findings (id, cap_id, description, severity, mhp_code, status) values

-- CAP-2024-001
('f0000001-0000-0000-0000-000000000001', 'ca000001-0000-0000-0000-000000000001',
 'Incomplete client assessment documentation in 15% of reviewed records', 'Major', null, 'Open'),
('f0000002-0000-0000-0000-000000000002', 'ca000001-0000-0000-0000-000000000001',
 'Missing supervisor signatures on treatment plans across all 4 facilities', 'Critical', null, 'Open'),
('f0000003-0000-0000-0000-000000000003', 'ca000001-0000-0000-0000-000000000001',
 'Inconsistent progress note formats between Modesto and Ceres facilities', 'Minor', null, 'Open'),

-- CAP-2024-002
('f0000004-0000-0000-0000-000000000004', 'ca000002-0000-0000-0000-000000000002',
 '28% of new SUD clients not contacted within 30 days of referral in Q4 2023', 'Critical', null, 'Open'),
('f0000005-0000-0000-0000-000000000005', 'ca000002-0000-0000-0000-000000000002',
 'Provider-to-client ratio below DHCS standard in 2 of 4 SUD outpatient clinics', 'Major', 'MHP007', 'Open'),
('f0000006-0000-0000-0000-000000000006', 'ca000002-0000-0000-0000-000000000002',
 'No documented timeliness monitoring process or escalation protocol in place', 'Major', null, 'Open'),

-- CAP-2023-015
('f0000007-0000-0000-0000-000000000007', 'ca000003-0000-0000-0000-000000000003',
 'QI committee membership does not include required consumer representative', 'Major', null, 'Resolved'),
('f0000008-0000-0000-0000-000000000008', 'ca000003-0000-0000-0000-000000000003',
 'Annual QI work plan not completed for FY2023', 'Major', null, 'Resolved'),
('f0000009-0000-0000-0000-000000000009', 'ca000003-0000-0000-0000-000000000003',
 'QI meeting minutes not documented for 3 of last 4 quarterly meetings', 'Minor', null, 'Resolved'),

-- CAP-2024-003
('f0000010-0000-0000-0000-000000000010', 'ca000004-0000-0000-0000-000000000004',
 'Provider FTE for rendering providers exceeds 100% across all sites and age groups', 'Critical', 'MHP007', 'Open'),
('f0000011-0000-0000-0000-000000000011', 'ca000004-0000-0000-0000-000000000004',
 'Frequent listings of expired provider contract dates in MHP274 submission', 'Major', 'MHP008c', 'Open'),
('f0000012-0000-0000-0000-000000000012', 'ca000004-0000-0000-0000-000000000004',
 'Plan does not list provider for Intensive Outpatient service type at main site', 'Major', 'MHP010', 'Open'),
('f0000013-0000-0000-0000-000000000013', 'ca000004-0000-0000-0000-000000000004',
 'Geographic access standard not met for rural areas — nearest provider >45 miles', 'Minor', 'MHP011', 'Open'),

-- CAP-2023-008
('f0000014-0000-0000-0000-000000000014', 'ca000005-0000-0000-0000-000000000005',
 'Crisis response times exceeded 60-minute DHCS standard at 3 of 5 sites in Q2 2023', 'Critical', null, 'Resolved'),
('f0000015-0000-0000-0000-000000000015', 'ca000005-0000-0000-0000-000000000005',
 'On-call psychiatrist coverage gap on weekends at Turlock site', 'Major', null, 'Resolved');

-- ── QUESTIONS ────────────────────────────────────────────────
insert into public.questions (id, cap_id, question_number, question_text, finding_reference,
  automation_level, ai_draft, ai_source_cap, ai_confidence, answered, answer_text) values

-- CAP-2024-001 (1 answered, 2 open)
('b0000001-0000-0000-0000-000000000001', 'ca000001-0000-0000-0000-000000000001', 1,
 'Describe the root cause of incomplete client assessment documentation found in 15% of reviewed records.',
 'Incomplete client assessment documentation in 15% of reviewed records (Major)',
 'AI Draft', null, null, null, true,
 'Root cause analysis identified insufficient staff training on the updated assessment template rolled out in Q3 2023. 12 of 15 flagged records were completed by staff hired after July 2023 who did not receive the updated template training. Additionally, the EHR system did not enforce required fields, allowing incomplete records to be finalized.'),

('b0000002-0000-0000-0000-000000000002', 'ca000001-0000-0000-0000-000000000001', 2,
 'Provide a corrective action plan to address missing supervisor signatures on all treatment plans.',
 'Missing supervisor signatures on treatment plans across all 4 facilities (Critical)',
 'AI Draft',
 'The county will implement a mandatory electronic co-signature workflow via the EHR system requiring supervisor approval on all treatment plans before finalization. All supervisors will complete refresher training on documentation requirements by May 1, 2024. A weekly automated compliance report will flag any unsigned plans pending over 48 hours. Compliance will be monitored monthly for 90 days post-implementation with results reported to QI committee.',
 'CAP-2023-008', 81, false, null),

('b0000003-0000-0000-0000-000000000003', 'ca000001-0000-0000-0000-000000000001', 3,
 'How will the county standardize progress note formats across all facilities to ensure consistency?',
 'Inconsistent progress note formats between Modesto and Ceres facilities (Minor)',
 'Human Required', null, null, null, false, null),

-- CAP-2024-002 (all open)
('b0000004-0000-0000-0000-000000000004', 'ca000002-0000-0000-0000-000000000002', 1,
 'Describe the county''s specific plan to achieve 30-day initial contact compliance for all new SUD referrals.',
 '28% of new SUD clients not contacted within 30 days of referral in Q4 2023 (Critical)',
 'AI Draft',
 'The county will implement a daily automated outreach tracking report identifying clients not yet contacted within 25 days of referral, creating a 5-day buffer before the deadline. Care coordinators will be paired to ensure backup coverage. A dedicated SUD intake coordinator position will be created and filled within 60 days. Timeliness compliance will be tracked weekly with a target of 95% within 30 days by Q2 2024.',
 'CAP-2022-004', 76, false, null),

('b0000005-0000-0000-0000-000000000005', 'ca000002-0000-0000-0000-000000000002', 2,
 'What specific corrective steps will address the provider-to-client ratio deficiencies at the 2 underperforming SUD clinics?',
 'Provider-to-client ratio below DHCS standard in 2 of 4 SUD clinics (Major)',
 'AI Draft',
 'The county will conduct an immediate provider needs assessment across all SUD clinic sites. A targeted recruitment campaign for licensed SUD counselors will launch within 30 days with a 90-day fill timeline. Two new counselor positions have been approved in the current budget cycle. Interim licensed contractor staffing will be procured to maintain ratio compliance while permanent hiring is completed.',
 'CAP-2023-002', 68, false, null),

('b0000006-0000-0000-0000-000000000006', 'ca000002-0000-0000-0000-000000000002', 3,
 'Describe the ongoing monitoring process the county will implement to sustain timeliness compliance after corrective actions are complete.',
 'No documented timeliness monitoring process or escalation protocol in place (Major)',
 'Human Required', null, null, null, false, null),

-- CAP-2023-015 (all answered)
('b0000007-0000-0000-0000-000000000007', 'ca000003-0000-0000-0000-000000000003', 1,
 'Describe the corrective actions taken to restructure the QI committee to include all required membership categories.',
 'QI committee membership does not include required consumer representative (Major)',
 'Semi-Auto', null, null, null, true,
 'The county restructured its QI committee to include clinical directors, administrative leadership, a peer support specialist, and two consumer representatives recruited through the county mental health board. Membership roster was updated in November 2023 and ratified by the BH Director.'),

('b0000008-0000-0000-0000-000000000008', 'ca000003-0000-0000-0000-000000000003', 2,
 'Provide the completed FY2023 QI work plan and describe how future work plans will be completed by the required deadline.',
 'Annual QI work plan not completed for FY2023 (Major)',
 'Semi-Auto', null, null, null, true,
 'The FY2023 QI work plan was completed retroactively and is attached to this response. Going forward, the QI Coordinator will be responsible for initiating the work plan process no later than September 1 each year, with board approval by October 31.'),

('b0000009-0000-0000-0000-000000000009', 'ca000003-0000-0000-0000-000000000003', 3,
 'How will the county ensure QI meeting minutes are consistently documented and retained going forward?',
 'QI meeting minutes not documented for 3 of last 4 quarterly meetings (Minor)',
 'Semi-Auto', null, null, null, true,
 'A standardized meeting minutes template has been adopted and assigned to the QI Coordinator as a standing responsibility. Minutes will be circulated within 5 business days of each meeting and stored in the shared compliance document repository.'),

-- CAP-2024-003 (all open, 2 with Full Auto drafts)
('b0000010-0000-0000-0000-000000000010', 'ca000004-0000-0000-0000-000000000004', 1,
 'Explain how the county will correct FTE reporting for rendering providers to ensure totals do not exceed 100% across all sites.',
 'Provider FTE exceeds 100% across all sites and age groups (MHP007 - Critical)',
 'Full Auto',
 'The county will audit all provider FTE allocations in the current MHP274 submission. Providers assigned to multiple sites will have FTE prorated accurately to sum to 100% maximum. HR records will be cross-referenced against submission data quarterly. A validation check will be added to the pre-submission workflow to flag any provider exceeding 100% FTE.',
 'CAP-2022-011', 91, false, null),

('b0000011-0000-0000-0000-000000000011', 'ca000004-0000-0000-0000-000000000004', 2,
 'Describe the process the county will implement to prevent submission of expired provider contract dates.',
 'Frequent listings of expired provider contract dates in MHP274 submission (MHP008c - Major)',
 'Full Auto',
 'The county will implement a contract expiration alert system notifying the contracts team 90 days before any provider contract expires. The MHP274 submission process will include a pre-submission validation step that blocks submission if any contract end dates are in the past. All existing contracts will be audited and updated within 45 days.',
 'CAP-2022-011', 88, false, null),

('b0000012-0000-0000-0000-000000000012', 'ca000004-0000-0000-0000-000000000004', 3,
 'Identify the specific site and service type gap for MHP010 and provide a timeline for adding the required provider.',
 'No provider listed for Intensive Outpatient service type at main site (MHP010 - Major)',
 'Human Required', null, null, null, false, null),

('b0000013-0000-0000-0000-000000000013', 'ca000004-0000-0000-0000-000000000004', 4,
 'Describe the county''s plan to meet geographic access standards for rural areas identified as out-of-compliance.',
 'Geographic access standard not met — nearest provider >45 miles in rural areas (MHP011 - Minor)',
 'Human Required', null, null, null, false, null);

-- ── CORRECTIVE ACTIONS ───────────────────────────────────────
insert into public.actions (id, cap_id, title, description, owner, due_date, status, completed_at) values

-- CAP-2024-001
('a0000001-0000-0000-0000-000000000001', 'ca000001-0000-0000-0000-000000000001',
 'Standardize assessment templates',
 'Implement standardized assessment template across all 4 county facilities in EHR system',
 'Clinical Director', '2024-02-27', 'Completed', '2024-02-25'),

('a0000002-0000-0000-0000-000000000002', 'ca000001-0000-0000-0000-000000000001',
 'Electronic signature workflow',
 'Establish mandatory electronic co-signature workflow for supervisors in EHR',
 'IT Manager', '2024-03-14', 'In Progress', null),

('a0000003-0000-0000-0000-000000000003', 'ca000001-0000-0000-0000-000000000001',
 'Staff training program',
 'Conduct documentation standards training for all clinical staff county-wide',
 'Education Dept', '2024-04-01', 'In Progress', null),

-- CAP-2024-002
('a0000004-0000-0000-0000-000000000004', 'ca000002-0000-0000-0000-000000000002',
 'Implement daily outreach tracking report',
 'Automated daily report flagging SUD clients approaching 25-day outreach mark',
 'IT Manager', '2024-03-15', 'Pending', null),

('a0000005-0000-0000-0000-000000000005', 'ca000002-0000-0000-0000-000000000002',
 'SUD counselor recruitment campaign',
 'Post and fill 2 approved licensed SUD counselor positions',
 'HR Director', '2024-05-01', 'Pending', null),

('a0000006-0000-0000-0000-000000000006', 'ca000002-0000-0000-0000-000000000002',
 'Establish monthly timeliness audit',
 'Create recurring QI review process for 30-day compliance monitoring',
 'QI Coordinator', '2024-04-15', 'Pending', null),

-- CAP-2023-015
('a0000007-0000-0000-0000-000000000007', 'ca000003-0000-0000-0000-000000000003',
 'Restructure QI committee membership',
 'Add consumer representatives and required membership categories',
 'BH Director', '2023-12-15', 'Completed', '2023-12-10'),

('a0000008-0000-0000-0000-000000000008', 'ca000003-0000-0000-0000-000000000003',
 'Complete FY2023 QI work plan',
 'Retroactively complete and board-approve FY2023 annual QI work plan',
 'QI Coordinator', '2024-01-10', 'Completed', '2024-01-08'),

('a0000009-0000-0000-0000-000000000009', 'ca000003-0000-0000-0000-000000000003',
 'Implement meeting minutes documentation process',
 'Adopt standardized minutes template and document retention in shared repository',
 'QI Coordinator', '2024-01-20', 'Completed', '2024-01-18'),

-- CAP-2024-003
('a0000010-0000-0000-0000-000000000010', 'ca000004-0000-0000-0000-000000000004',
 'Audit and correct FTE allocations',
 'Cross-reference all provider FTE against HR records and correct MHP274 submission',
 'Contracts Manager', '2026-05-20', 'Pending', null),

('a0000011-0000-0000-0000-000000000011', 'ca000004-0000-0000-0000-000000000004',
 'Contract expiration alert system',
 'Implement 90-day contract renewal alerts and pre-submission validation',
 'IT Manager', '2026-05-25', 'Pending', null),

('a0000012-0000-0000-0000-000000000012', 'ca000004-0000-0000-0000-000000000004',
 'Recruit IOP service provider',
 'Identify and contract Intensive Outpatient provider for main site',
 'Network Manager', '2026-06-01', 'Pending', null),

('a0000013-0000-0000-0000-000000000013', 'ca000004-0000-0000-0000-000000000004',
 'Rural access telehealth expansion',
 'Expand telehealth coverage to meet geographic access standard in rural areas',
 'Clinical Director', '2026-06-01', 'Pending', null);

-- ── EMAIL THREADS ────────────────────────────────────────────
insert into public.email_threads (id, cap_id, from_address, subject, received_at, preview,
  direction, is_new, classification) values

('e0000001-0000-0000-0000-000000000001', 'ca000001-0000-0000-0000-000000000001',
 'NAOS@DHCS.CA.GOV', 'CAP-2024-001 Issued — Mental Health Documentation Standards',
 '2024-01-14 14:23:00+00',
 'These are the data you submitted to DHCS and your findings. You are required to provide a response within 30 calendar days.',
 'inbound', false, 'cap_notice'),

('e0000002-0000-0000-0000-000000000002', 'ca000001-0000-0000-0000-000000000001',
 'r.patel@stancounty.ca.gov', 'RE: CAP-2024-001 — 30-day response submitted',
 '2024-02-13 09:45:00+00',
 'We acknowledge receipt of the CAP findings and have initiated corrective actions as outlined in the attached response plan.',
 'outbound', false, 'cap_notice'),

('e0000003-0000-0000-0000-000000000003', 'ca000002-0000-0000-0000-000000000002',
 'NAOS@DHCS.CA.GOV', 'CAP-2024-002 Issued — SUD Service Access Timeliness',
 '2024-01-31 11:05:00+00',
 'Findings related to SUD service access and timeliness compliance have been identified. Response required within 30 days.',
 'inbound', false, 'cap_notice'),

('e0000004-0000-0000-0000-000000000004', 'ca000003-0000-0000-0000-000000000003',
 'NAOS@DHCS.CA.GOV', 'CAP-2023-015 Issued — Quality Improvement Program Compliance',
 '2023-11-09 10:12:00+00',
 'Quality improvement program compliance review findings attached. 30-day response required.',
 'inbound', false, 'cap_notice'),

('e0000005-0000-0000-0000-000000000005', 'ca000004-0000-0000-0000-000000000004',
 'NAOS@DHCS.CA.GOV', 'CAP-2024-003 Issued — MHP274 Provider Network Data Quality',
 '2026-05-02 13:30:00+00',
 'The FY2025-26 Annual Network Certification Results findings are attached. Response required by June 2, 2026. Questions 1-4 must be answered.',
 'inbound', true, 'cap_notice'),

('e0000006-0000-0000-0000-000000000006', null,
 'NAOS@DHCS.CA.GOV', 'FY2025-26 Annual Network Certification Results & CAP Webinar',
 '2024-03-05 15:00:00+00',
 'The FY2025-26 Annual Network Certification Results & CAP Webinar has been posted to the DHCS YouTube channel. Slide deck attached.',
 'inbound', false, 'webinar');

-- Email attachments
insert into public.email_attachments (email_id, filename) values
('e0000001-0000-0000-0000-000000000001', 'CAP-2024-001_Results.pdf'),
('e0000001-0000-0000-0000-000000000001', 'Findings_Detail.pdf'),
('e0000002-0000-0000-0000-000000000002', 'Response_Plan_CAP-2024-001.pdf'),
('e0000003-0000-0000-0000-000000000003', 'CAP-2024-002_Results.pdf'),
('e0000004-0000-0000-0000-000000000004', 'CAP-2023-015_Results.pdf'),
('e0000005-0000-0000-0000-000000000005', 'CAP-2024-003_Results.pdf'),
('e0000005-0000-0000-0000-000000000005', 'MHP274_Findings_Detail.pdf');

-- ── NOTES ────────────────────────────────────────────────────
insert into public.notes (cap_id, author_id, author_name, body, created_at) values

('ca000001-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'R. Patel',
 'IT team confirmed e-signature module is in QA testing. Expected go-live April 5. Will update action status once confirmed.',
 '2024-03-20 10:30:00+00'),

('ca000001-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005', 'Admin',
 '30-day response submitted to DHCS on Feb 13. Awaiting acknowledgement from NAOS.',
 '2024-02-14 09:00:00+00'),

('ca000002-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000005', 'Admin',
 'CAP received. Needs immediate assignment — 30-day deadline approaching. Escalating to BH Director.',
 '2024-02-01 08:15:00+00'),

('ca000003-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'L. Chen',
 'All three corrective actions completed and documented. Final response package submitted to DHCS Dec 9. Awaiting closure confirmation.',
 '2023-12-09 16:45:00+00'),

('ca000004-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000005', 'Admin',
 'New CAP received May 2. MHP274 data quality findings — FTE, contracts, and service type gaps. Needs assignment by EOD.',
 '2026-05-02 14:00:00+00');
