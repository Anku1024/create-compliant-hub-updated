# v0.dev / Vercel AI Prompt — DHCS Compliance Hub MVP

## HOW TO USE
1. Go to v0.dev
2. Paste the entire prompt below (everything after "--- PROMPT START ---")
3. It will generate a Next.js + TypeScript + Tailwind React component
4. Deploy directly to Vercel or download and run locally with `npm run dev`

---

## TECH STACK (v0 will use these automatically)
- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Lucide React icons
- Supabase (data layer — see supabase_schema.sql for setup)

---
--- PROMPT START ---

Build a complete DHCS Compliance Hub MVP dashboard as a Next.js 14 + TypeScript + Tailwind CSS application. This is a multi-product compliance management system for California county behavioral health departments. The data comes from Supabase — use the sample data provided below in the component state for the MVP demo.

## PRODUCT OVERVIEW

The app has 3 top-level products accessible via a product tab bar:
1. **CAPs** — Corrective Action Plans (DHCS-issued compliance notices)
2. **BHINs** — Behavioral Health Information Notices
3. **Newsletters** — DHCS newsletters and bulletins

Only CAPs is fully built in this MVP. BHINs and Newsletters show a "Coming soon" placeholder.

---

## DESIGN SYSTEM

### Colors (use these exact hex values in Tailwind inline styles or CSS vars)
```
Navy:        #1B3A6B  — headers, table heads, primary text
Blue:        #2563A8  — section headings, H2
Action blue: #185FA5  — buttons, links, active states
Light blue:  #E6F1FB  — active chip bg, button secondary bg
Muted blue:  #85B7EB  — borders, ring accents
Dark:        #1A202C  — body text
Slate:       #64748B  — secondary text, captions
Light gray:  #F8FAFC  — alternating row bg, card bg
Mid gray:    #E2E8F0  — borders, dividers
Red text:    #A32D2D / #791F1F
Red bg:      #FCEBEB / #FEE2E2 / #F7C1C1
Green text:  #3B6D11 / #27500A / #065F46
Green bg:    #EAF3DE / #D1FAE5 / #C0DD97
Amber text:  #633806 / #92400E
Amber bg:    #FAEEDA / #FEF3C7 / #FAC775
Purple bg/text: #EEEDFE / #3C3489  (Mental Health tag)
Teal bg/text:   #E1F5EE / #085041  (Access & Timeliness tag)
Pink bg/text:   #FBEAF0 / #993556  (Quality Improvement tag)
```

### Typography
- Font: system-ui / Inter (Tailwind default)
- Weights: 400 and 500 ONLY (never 600 or 700)
- Nav items: 12px
- Table headers: 11px
- Badges: 10px, font-weight 500
- Body: 12-14px
- Page titles: 17px font-weight 500
- CAP detail title: 15px font-weight 500

### Component styles
- Cards: white bg, border `0.5px solid #E2E8F0`, border-radius 12px, padding 14px 16px
- Buttons primary: bg #185FA5, text #E6F1FB, border-radius 8px, 12px font
- Buttons ghost: transparent bg, border `0.5px solid #E2E8F0`, same sizing
- Badges: 10px, font-weight 500, padding `2px 7px`, border-radius 3px
- Table rows: hover bg #F8FAFC, border-bottom `0.5px solid #E2E8F0`
- All borders: always 0.5px (never 1px except 2px for active nav indicator)
- No box shadows anywhere

---

## GLOBAL LAYOUT

```
┌─────────────────────────────────────────────────────────┐
│  NAVBAR (white, border-bottom)                          │
│  [Logo] [Users] [News] [My Items] [NACT] [TADT]         │
│         [CAPs*] [BHINs] [Newsletters]                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  PRODUCT TAB BAR (below nav, gray bg)                   │
│  [CAPs ●] [BHINs] [Newsletters]                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ACTIVE PRODUCT CONTENT AREA                            │
│  (padding 18px 20px)                                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## NAVBAR (top)

Horizontal bar, white bg, border-bottom `0.5px solid #E2E8F0`.
Items: Users | News | My Items | NACT | TADT | CAPs | BHINs | Newsletters
Active item style: color #185FA5, border-bottom `2px solid #185FA5`, font-weight 500.
"CAPs" is active by default.
Each nav item: padding `11px 13px`, font-size 12px.

---

## PRODUCT TAB BAR

Below navbar. Background #F8FAFC, border-bottom `0.5px solid #E2E8F0`.
Three product tabs: **CAPs** | **BHINs** | **Newsletters**

Active tab style: white background, border-radius `8px 8px 0 0`, color #185FA5, font-weight 500.

When BHINs or Newsletters is clicked, show a centered placeholder:
- Icon (FileX or similar)
- Title: "BHINs — Coming Soon" or "Newsletters — Coming Soon"  
- Subtitle: "This module is under development. Check back in the next release."
- Button: "Back to CAPs" that switches to CAPs tab

---

## CAPS MODULE — FULL IMPLEMENTATION

### State Management

Use React `useState` hooks with the sample data arrays provided below. No API calls in MVP — data lives in component state. Structure the main component with:

```typescript
interface CAP {
  id: string
  cap_number: string
  title: string
  description: string
  program_area: 'Mental Health' | 'SUD' | 'Access & Timeliness' | 'Quality Improvement'
  priority: 'High' | 'Medium' | 'Low'
  status: 'Open' | 'In Progress' | 'Submitted' | 'Closed'
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

interface Finding {
  id: string
  cap_id: string
  description: string
  severity: 'Critical' | 'Major' | 'Minor'
  mhp_code: string | null
  status: 'Open' | 'Resolved'
}

interface Question {
  id: string
  cap_id: string
  question_number: number
  question_text: string
  finding_reference: string
  automation_level: 'Full Auto' | 'Semi-Auto' | 'AI Draft' | 'Human Required'
  ai_draft: string | null
  ai_source_cap: string | null
  ai_confidence: number | null
  answered: boolean
  answer_text: string | null
}

interface Action {
  id: string
  cap_id: string
  title: string
  description: string
  owner: string
  due_date: string
  status: 'Completed' | 'In Progress' | 'Pending'
  is_overdue: boolean
  days_overdue: number | null
}

interface EmailThread {
  id: string
  cap_id: string
  from: string
  subject: string
  date: string
  preview: string
  attachments: string[]
  is_new: boolean
  direction: 'inbound' | 'outbound'
}
```

### CAPS VIEW — 3 SCREENS

**Screen 1: Dashboard (default)**
**Screen 2: CAP Detail** (clicking a row)
**Screen 3: Edit Form** (clicking Edit button)

Manage current screen via `useState<'dashboard' | 'detail' | 'edit'>` and `selectedCapId`.

---

### SCREEN 1: CAP DASHBOARD

#### Period Selector
Row with "Period:" label + 6 pill buttons:
- Current open (default active)
- This month
- Last month  
- This quarter
- Last quarter
- Year to date

Active pill: bg `#E6F1FB`, color `#0C447C`, border `0.5px solid #85B7EB`, border-radius 20px.
Inactive: transparent bg, border `0.5px solid #E2E8F0`, color `#64748B`.

When "Current open" is selected → show **Live View** (KPI cards + alert + table).
When any other period is selected → show **Report View** (analytics mode).

#### Live View — 6 KPI Cards
Grid: 6 columns, gap 8px.
Card: bg `#F8FAFC`, border-radius 8px, padding `10px 12px`.
Label: 10px, color `#64748B`. Value: 20px, font-weight 500. Sub-note: 10px, color `#64748B`.

| # | Label | Value | Sub | Color |
|---|-------|-------|-----|-------|
| 1 | Total CAPs | 3 | FY2026 Q2 | default |
| 2 | Open | 1 | Needs assignment | #A32D2D (red) |
| 3 | In Progress | 1 | Actions underway | default |
| 4 | Overdue actions | 2 | Past deadline | #A32D2D (red) |
| 5 | Questions answered | 4/9 | Across all open CAPs | default |
| 6 | 30-day compliance | 2/3 | Responded on time | #3B6D11 (green) |

#### Alert Banner
bg `#FEF3C7`, border `0.5px solid #FAC775`, border-radius 8px, padding `8px 12px`.
Icon: Mail. Text: "**New DHCS email** — CAP-2024-003 issued May 2, 2026. MHP274 data quality findings."
Link "View →" in #185FA5 that navigates to email inbox view.

#### Report View (non-current periods)
Replace KPI cards + alert banner with:

**6 Stat Cards** (3-column grid):
| Stat | Value | Change |
|------|-------|--------|
| CAPs in period | 7 | ↓ 2 vs prior (green) |
| Closed | 5 | 71% closure rate |
| Overdue responses | 3 | ↑ 1 vs prior (red) |
| Avg resolution | 16d | ↓ 2 days (green) |
| 30-day compliance | 86% | ↑ 4% (green) |
| AI draft acceptance | 74% | ↑ 8% (green) |

**2-column grid** below:
- Left: "CAPs by month" — 6 vertical bars (Nov-Apr), heights: 35,50,42,65,48,78px. Blue (#85B7EB) for Nov-Mar, red (#F09595) for Apr. Chart total height 90px.
- Right: "Findings by category" — 5 horizontal bar rows: Timeliness 8/80%, Documentation 6/60%, Provider FTE 5/50%, Contract dates 3/30%, Quality 2/20%.

#### Filter Bar
Filter chips: All (active) | High priority | Overdue | My items | Submitted
Same pill style as period chips.
Search input (right-aligned): placeholder "Search CAPs…", width 160px.

Implement actual filtering on the table rows based on active filter + search text.

#### CAP Table
White card wrapper, border `0.5px solid #E2E8F0`, border-radius 12px, overflow hidden.

**9 columns:**
| Col | Header | Width | Content |
|-----|--------|-------|---------|
| 1 | CAP ID | 110px | Blue link + small gray issuer/date below |
| 2 | Title & description | auto | Bold title + muted subtitle |
| 3 | Priority | 80px | Colored badge |
| 4 | Status | 90px | Colored badge |
| 5 | Program | 85px | Colored tag badge |
| 6 | Assigned to | 90px | Name or red "Unassigned" with alert icon |
| 7 | Due date | 90px | Red if overdue + days text, amber if soon |
| 8 | Findings answered | 100px | SVG ring + clickable button |
| 9 | Actions | 90px | Status badge |

**Progress Ring (column 8):**
SVG 34x34, viewBox "0 0 34 34".
- Background circle: cx=17, cy=17, r=13, fill=none, stroke=#E2E8F0, strokeWidth=3
- Foreground arc: same center, fill=none, strokeWidth=3, strokeLinecap=round, strokeDashoffset=20.4
- Total circumference: 81.6 (= 2π × 13)
- Fill per answered ratio: `dashFilled = (answered/total) * 81.6`
- strokeDasharray: `${dashFilled} ${81.6 - dashFilled}`
- Color: 0% → #F09595, partial → #EF9F27, 100% → #97C459

Button below ring: "0/3", "1/3", "3/3" text.
- Default: bg #E6F1FB, color #0C447C, border #85B7EB
- 0/3 (red): bg #FEE2E2, color #A32D2D, border #F09595
- 3/3 (green): bg #EAF3DE, color #27500A, border #C0DD97
Click → navigate to CAP detail.

**Badge helper function:**
```typescript
const priorityBadge = (p: string) => ({
  High:   { bg: '#F7C1C1', text: '#791F1F' },
  Medium: { bg: '#FAC775', text: '#633806' },
  Low:    { bg: '#E6F1FB', text: '#0C447C' },
}[p] ?? { bg: '#E2E8F0', text: '#4A5568' })

const statusBadge = (s: string) => ({
  'Open':        { bg: '#FCEBEB', text: '#A32D2D' },
  'In Progress': { bg: '#FAEEDA', text: '#633806' },
  'Submitted':   { bg: '#EAF3DE', text: '#27500A' },
  'Closed':      { bg: '#E2E8F0', text: '#4A5568' },
}[s] ?? { bg: '#E2E8F0', text: '#4A5568' })

const programBadge = (p: string) => ({
  'Mental Health':       { bg: '#EEEDFE', text: '#3C3489' },
  'SUD':                 { bg: '#EEEDFE', text: '#3C3489' },
  'Access & Timeliness': { bg: '#E1F5EE', text: '#085041' },
  'Quality Improvement': { bg: '#FBEAF0', text: '#993556' },
}[p] ?? { bg: '#E2E8F0', text: '#4A5568' })
```

---

### SCREEN 2: CAP DETAIL

Back button → returns to dashboard.

**Detail Header Card** (white, border, border-radius 12px, padding 14-16px):
- Row 1: CAP Number (15px/500/navy) + badges + "Edit" ghost button (right-aligned)
- Title: 15px/500
- Subtitle: "Issued by [entity] · Assigned to: [name]" 12px gray
- Meta row: Issued date | Due date (red if overdue) | 30-day status
- Progress bar: 5px height, #185FA5 fill, width = (actions_completed/actions_count * 100)%
- Stats grid (5 cols, border-top): Findings | Questions answered | Actions | Overdue | Completed

**6 Tabs:** Questions & answers | Findings | Actions | Email thread | Documents | Notes

Tabs row: border-bottom `0.5px solid #E2E8F0`, active tab: color #185FA5, border-bottom `2px solid #185FA5`.

#### Tab 1: Questions & Answers (default)

Header row: title + progress pill + "Submit all responses" button.

Each question is an accordion item:
- **Collapsed header**: status dot (circle 24px) + question text + status badge + chevron
  - Dot: green+check = answered, amber+clock = AI draft ready, red+pencil = not answered
  - Click → expand/collapse
- **Expanded body** (bg #F8FAFC, border-top):
  - Finding context box: border-left `3px solid #EF9F27`, bg white, 11px, "**Finding:** [text]"
  - If AI draft exists: blue box (bg #E6F1FB), label "✨ AI draft — based on [source] (confidence: X%)", draft text in #0C447C
  - If no AI draft: red box (bg #FCEBEB), label "⚠ No AI draft — new question type", red text
  - Textarea: full width, resize vertical, min-height 60px, 12px font
  - Buttons: "Accept AI draft" (green), "Edit draft" (ghost), "Save answer" (primary blue)
  - Accept → copies draft text to textarea, marks as answered
  - Save → if textarea non-empty, marks as answered

Update `questions_answered` count in parent CAP state when an answer is saved.

#### Tab 2: Findings
List of finding rows, each: finding text + severity badge (Critical/Major/Minor).
Critical: bg #F7C1C1 text #791F1F | Major: bg #FAEEDA text #633806 | Minor: bg #E6F1FB text #0C447C

#### Tab 3: Actions Timeline
Each action: colored dot + name + status badge + description + owner + due date.
Dot: green=Completed, amber=In Progress, gray=Pending.
Show overdue badge + days overdue in red if applicable.

#### Tab 4: Email Thread
List of emails with: from, date, subject, preview, attachment badges.
Direction: inbound (DHCS) in default style, outbound (Internal) with subtle left indent.

#### Tab 5: Documents
List of document items: icon (red for DHCS PDFs, blue for uploads) + name + meta + download icon.
Upload button at bottom.

#### Tab 6: Notes
List of timestamped notes with author + text.
Textarea + "Add note" button at bottom.

---

### SCREEN 3: EDIT FORM

Header: "Edit [CAP number]" + subtitle + Cancel (ghost) + "Save changes" (primary) buttons.

5 tabs: Overview | Findings | Actions | Documents | Notes (only Overview has content for MVP).

2-column grid form:
- CAP Number * (text, read-only in edit mode)
- Issuing Entity * (select)
- CAP Title * (text, full-width)
- Program Area * (select: Mental Health / SUD / Access & Timeliness / Quality Improvement)
- Priority * (select: High / Medium / Low)
- Status * (select: Open / In Progress / Submitted / Closed)
- Assigned To * (select: R. Patel / L. Chen / M. Torres / S. Nguyen / Unassigned)
- Issued Date * (date input)
- Due Date * (date input)
- Summary (textarea, full-width)

Bottom stats bar: Findings count | Actions count | Completed count (3-col, bordered).

On "Save changes": update the CAP in state array, return to detail view.

---

## SAMPLE DATA

Use this exact data in your initial state:

### caps (array of 5 records)

```typescript
const initialCaps: CAP[] = [
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
```

### findings (array)

```typescript
const initialFindings: Finding[] = [
  // CAP-2024-001
  { id: 'f001', cap_id: 'cap-001', description: 'Incomplete client assessment documentation in 15% of reviewed records', severity: 'Major', mhp_code: null, status: 'Open' },
  { id: 'f002', cap_id: 'cap-001', description: 'Missing supervisor signatures on treatment plans across all 4 facilities', severity: 'Critical', mhp_code: null, status: 'Open' },
  { id: 'f003', cap_id: 'cap-001', description: 'Inconsistent progress note formats between Modesto and Ceres facilities', severity: 'Minor', mhp_code: null, status: 'Open' },
  // CAP-2024-002
  { id: 'f004', cap_id: 'cap-002', description: '28% of new SUD clients not contacted within 30 days of referral in Q4 2023', severity: 'Critical', mhp_code: null, status: 'Open' },
  { id: 'f005', cap_id: 'cap-002', description: 'Provider-to-client ratio below DHCS standard in 2 of 4 SUD outpatient clinics', severity: 'Major', mhp_code: 'MHP007', status: 'Open' },
  { id: 'f006', cap_id: 'cap-002', description: 'No documented timeliness monitoring process or escalation protocol in place', severity: 'Major', mhp_code: null, status: 'Open' },
  // CAP-2023-015
  { id: 'f007', cap_id: 'cap-003', description: 'QI committee membership does not include required consumer representative', severity: 'Major', mhp_code: null, status: 'Resolved' },
  { id: 'f008', cap_id: 'cap-003', description: 'Annual QI work plan not completed for FY2023', severity: 'Major', mhp_code: null, status: 'Resolved' },
  { id: 'f009', cap_id: 'cap-003', description: 'QI meeting minutes not documented for 3 of last 4 quarterly meetings', severity: 'Minor', mhp_code: null, status: 'Resolved' },
  // CAP-2024-003
  { id: 'f010', cap_id: 'cap-004', description: 'Provider FTE for rendering providers exceeds 100% across all sites and age groups', severity: 'Critical', mhp_code: 'MHP007', status: 'Open' },
  { id: 'f011', cap_id: 'cap-004', description: 'Frequent listings of expired provider contract dates in MHP274 submission', severity: 'Major', mhp_code: 'MHP008c', status: 'Open' },
  { id: 'f012', cap_id: 'cap-004', description: 'Plan does not list provider for Intensive Outpatient service type at main site', severity: 'Major', mhp_code: 'MHP010', status: 'Open' },
  { id: 'f013', cap_id: 'cap-004', description: 'Geographic access standard not met for rural areas — nearest provider >45 miles', severity: 'Minor', mhp_code: 'MHP011', status: 'Open' },
  // CAP-2023-008
  { id: 'f014', cap_id: 'cap-005', description: 'Crisis response times exceeded 60-minute DHCS standard at 3 of 5 sites in Q2 2023', severity: 'Critical', mhp_code: null, status: 'Resolved' },
  { id: 'f015', cap_id: 'cap-005', description: 'On-call psychiatrist coverage gap on weekends at Turlock site', severity: 'Major', mhp_code: null, status: 'Resolved' },
]
```

### questions (array)

```typescript
const initialQuestions: Question[] = [
  // CAP-2024-001 questions
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
  // CAP-2024-002 questions
  {
    id: 'q004', cap_id: 'cap-002', question_number: 1,
    question_text: 'Describe the county\'s specific plan to achieve 30-day initial contact compliance for all new SUD referrals.',
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
  // CAP-2023-015 questions (all answered)
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
    answer_text: 'A standardized meeting minutes template has been adopted and assigned to the QI Coordinator as a standing responsibility. Minutes will be circulated within 5 business days of each meeting and stored in the shared compliance document repository accessible to all committee members and the DHCS liaison.',
  },
  // CAP-2024-003 questions
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
    ai_draft: 'The county will implement a contract expiration alert system that notifies the contracts team 90 days before any provider contract expires. The MHP274 submission process will include a pre-submission validation step that blocks submission if any contract end dates are in the past. All existing contracts will be audited and updated within 45 days.',
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
    question_text: 'Describe the county\'s plan to meet geographic access standards for rural areas identified as out-of-compliance.',
    finding_reference: 'Geographic access standard not met — nearest provider >45 miles in rural areas (MHP011 - Minor)',
    automation_level: 'Human Required',
    ai_draft: null, ai_source_cap: null, ai_confidence: null,
    answered: false,
    answer_text: null,
  },
]
```

### actions (array)

```typescript
const initialActions: Action[] = [
  // CAP-2024-001
  { id: 'a001', cap_id: 'cap-001', title: 'Standardize assessment templates', description: 'Implement standardized assessment template across all 4 county facilities in EHR system', owner: 'Clinical Director', due_date: '2024-02-27', status: 'Completed', is_overdue: false, days_overdue: null },
  { id: 'a002', cap_id: 'cap-001', title: 'Electronic signature workflow', description: 'Establish mandatory electronic co-signature workflow for supervisors in EHR', owner: 'IT Manager', due_date: '2024-03-14', status: 'In Progress', is_overdue: true, days_overdue: 51 },
  { id: 'a003', cap_id: 'cap-001', title: 'Staff training program', description: 'Conduct documentation standards training for all clinical staff county-wide', owner: 'Education Dept', due_date: '2024-04-01', status: 'In Progress', is_overdue: false, days_overdue: null },
  // CAP-2024-002
  { id: 'a004', cap_id: 'cap-002', title: 'Implement daily outreach tracking report', description: 'Automated daily report flagging SUD clients approaching 25-day outreach mark', owner: 'IT Manager', due_date: '2024-03-15', status: 'Pending', is_overdue: false, days_overdue: null },
  { id: 'a005', cap_id: 'cap-002', title: 'SUD counselor recruitment campaign', description: 'Post and fill 2 approved licensed SUD counselor positions', owner: 'HR Director', due_date: '2024-05-01', status: 'Pending', is_overdue: false, days_overdue: null },
  { id: 'a006', cap_id: 'cap-002', title: 'Establish monthly timeliness audit', description: 'Create recurring QI review process for 30-day compliance monitoring', owner: 'QI Coordinator', due_date: '2024-04-15', status: 'Pending', is_overdue: false, days_overdue: null },
  // CAP-2023-015
  { id: 'a007', cap_id: 'cap-003', title: 'Restructure QI committee membership', description: 'Add consumer representatives and required membership categories', owner: 'BH Director', due_date: '2023-12-15', status: 'Completed', is_overdue: false, days_overdue: null },
  { id: 'a008', cap_id: 'cap-003', title: 'Complete FY2023 QI work plan', description: 'Retroactively complete and board-approve FY2023 annual QI work plan', owner: 'QI Coordinator', due_date: '2024-01-10', status: 'Completed', is_overdue: false, days_overdue: null },
  { id: 'a009', cap_id: 'cap-003', title: 'Implement meeting minutes process', description: 'Adopt standardized minutes template and document retention in shared repository', owner: 'QI Coordinator', due_date: '2024-01-20', status: 'Completed', is_overdue: false, days_overdue: null },
  // CAP-2024-003
  { id: 'a010', cap_id: 'cap-004', title: 'Audit and correct FTE allocations', description: 'Cross-reference all provider FTE against HR records and correct MHP274 submission', owner: 'Contracts Manager', due_date: '2026-05-20', status: 'Pending', is_overdue: false, days_overdue: null },
  { id: 'a011', cap_id: 'cap-004', title: 'Contract expiration alert system', description: 'Implement 90-day contract renewal alerts and pre-submission validation', owner: 'IT Manager', due_date: '2026-05-25', status: 'Pending', is_overdue: false, days_overdue: null },
  { id: 'a012', cap_id: 'cap-004', title: 'Recruit IOP service provider', description: 'Identify and contract Intensive Outpatient provider for main site', owner: 'Network Manager', due_date: '2026-06-01', status: 'Pending', is_overdue: false, days_overdue: null },
  { id: 'a013', cap_id: 'cap-004', title: 'Rural access telehealth expansion', description: 'Expand telehealth coverage to meet geographic access standard in rural areas', owner: 'Clinical Director', due_date: '2026-06-01', status: 'Pending', is_overdue: false, days_overdue: null },
]
```

### emails (array)

```typescript
const initialEmails: EmailThread[] = [
  { id: 'e001', cap_id: 'cap-001', from: 'NAOS@DHCS.CA.GOV', subject: 'CAP-2024-001 Issued — Mental Health Documentation Standards', date: '2024-01-14', preview: 'These are the data you submitted to DHCS and your findings. You are required to provide a response to these questions within 30 calendar days...', attachments: ['CAP-2024-001_Results.pdf', 'Findings_Detail.pdf'], is_new: false, direction: 'inbound' },
  { id: 'e002', cap_id: 'cap-001', from: 'R. Patel (Internal)', subject: 'RE: CAP-2024-001 — 30-day response submitted', date: '2024-02-13', preview: 'We acknowledge receipt of the CAP findings and have initiated corrective actions as outlined in the attached response plan...', attachments: ['Response_Plan_CAP-2024-001.pdf'], is_new: false, direction: 'outbound' },
  { id: 'e003', cap_id: 'cap-002', from: 'NAOS@DHCS.CA.GOV', subject: 'CAP-2024-002 Issued — SUD Service Access Timeliness', date: '2024-01-31', preview: 'Findings related to SUD service access and timeliness compliance have been identified. Response required within 30 days...', attachments: ['CAP-2024-002_Results.pdf'], is_new: false, direction: 'inbound' },
  { id: 'e004', cap_id: 'cap-003', from: 'NAOS@DHCS.CA.GOV', subject: 'CAP-2023-015 Issued — Quality Improvement Program', date: '2023-11-09', preview: 'Quality improvement program compliance review findings attached. 30-day response required...', attachments: ['CAP-2023-015_Results.pdf'], is_new: false, direction: 'inbound' },
  { id: 'e005', cap_id: 'cap-003', from: 'L. Chen (Internal)', subject: 'RE: CAP-2023-015 — Response and closure documents submitted', date: '2023-12-09', preview: 'All corrective actions have been completed and documented. Submitting final response package for DHCS review...', attachments: ['CAP-2023-015_FinalResponse.pdf', 'QI_Committee_Roster.pdf'], is_new: false, direction: 'outbound' },
  { id: 'e006', cap_id: 'cap-004', from: 'NAOS@DHCS.CA.GOV', subject: 'CAP-2024-003 Issued — MHP274 Data Quality Findings', date: '2026-05-02', preview: 'The FY2025-26 Annual Network Certification Results & CAP Webinar findings are attached. Response required by June 2, 2026...', attachments: ['CAP-2024-003_Results.pdf', 'MHP274_Findings_Detail.pdf'], is_new: true, direction: 'inbound' },
  { id: 'e007', cap_id: null, from: 'NAOS@DHCS.CA.GOV', subject: 'FY2025-26 Annual Network Certification Results & CAP Webinar', date: '2024-03-05', preview: 'The FY2025-26 Annual Network Certification Results & CAP Webinar has been posted to the Department of Health Care Services YouTube channel...', attachments: [], is_new: false, direction: 'inbound' },
]
```

---

## SUPABASE INTEGRATION NOTES (for Phase 2)

Structure the component so that the initial state arrays can be easily swapped for Supabase client calls:

```typescript
// Replace initialCaps with:
const { data: caps } = await supabase.from('caps').select('*').order('issued_date', { ascending: false })

// Replace initialFindings with:
const { data: findings } = await supabase.from('findings').select('*').eq('cap_id', selectedCapId)
```

Create a `lib/supabase.ts` file stub:
```typescript
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

---

## ADDITIONAL REQUIREMENTS

1. **Responsive**: works at min-width 768px. Table scrolls horizontally on smaller screens.
2. **TypeScript**: full type safety, no `any` types.
3. **No external state management**: useState and prop drilling only (MVP scope).
4. **Accessible**: semantic HTML, aria-labels on icon-only buttons, proper heading hierarchy.
5. **No toast libraries**: show inline success/error states only.
6. **Tab badge counts**: Questions & answers tab shows "X open" badge. Auto-updates when questions are answered.
7. **Filtering**: the filter chips actually filter the table rows in real time.
8. **Search**: searches cap_number, title, description, assigned_to fields.
9. **Edit saves to state**: saving the edit form updates the caps array in state.
10. **New CAP button**: opens a blank edit form with empty fields (no data pre-filled).

--- PROMPT END ---
