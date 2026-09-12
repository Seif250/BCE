# British Council Egypt — Internal Sales Knowledge Base & Calculator

A fast, modern, responsive internal Sales Knowledge Base and live-call Calculator web application built for **British Council Egypt English Courses**.

Strictly normalized from and verified against `EG outbound Knowledge base.xlsx`.

---

## Key Features

1. **Student Eligibility & Price Calculator (Default Home Screen)**:
   - Instant Date of Birth calculation (exact calendar years, months, and days).
   - Instant Age Group categorization:
     - Age 4: **Early Years 2 (Ducks)** — No Placement Test, 6,400 EGP / term.
     - Age 5: **Early Years 3 (Owls)** — No Placement Test, 6,400 EGP / term.
     - Ages 6–8: **Lower Primary** — 200 EGP Placement Test, 5,800 EGP / term.
     - Ages 9–11: **Upper Primary** — 200 EGP Placement Test, 5,800 EGP / term.
     - Ages 12–14: **Lower Secondary** — 200 EGP Placement Test, 5,800 EGP / term.
     - Ages 15–17: **Upper Secondary** — 200 EGP Placement Test, 5,800 EGP / term, eligible for **IELTS for Teens** (5,600 EGP).
     - Age 18+: **Adult Courses** (Beginner, BCE, IELTS Coach, English Online).
   - **Bundle Discounts**: 2 terms = 5%, 3 terms = 10%, 4 terms = 15%.
   - **Sibling Discount**: 10% discount on the youngest child when registering more than 1 child in the same term.
   - **Summer Camp Discounts**: 10% on 2nd camp for 2 camps; 10% on 2nd & 3rd camp for 3 camps (Starters only).
   - **Prominent "COPY QUICK ANSWER" button**: One-click copy of a clean, customer-ready summary without internal operational notes.
   - **Manual Override Mode**: Clearly marked with an amber badge for special customer cases.
2. **Adult Courses Directory**:
   - Beginner Courses (5 levels A–E, E is complementary, 10/20/40/60 credits packages, Sun–Thu offline).
   - BCE (British Council English CEFR A1–C1, advisory sessions after 15/30/50 classes, assessment classes after 10 speaking sessions).
   - IELTS Coach (B1 min entry, F2F Agouza & CTS or virtual, 10 & 20 credit packages).
   - English Online (100% online global platform, support: `support.englishonline@britishcouncil.org`).
   - 10% re-registration discount within 3 months + recovery of expired credits.
3. **Young Learner — Winter Block**:
   - 4 terms, 9 sessions over 9 weeks, 1 session/week (Thu/Fri/Sat), 2h per session.
   - Complete academic progression tables and completion requirements (3–4 terms vs. 6–8 terms).
   - IELTS for Teens (15–17 yrs, 18h winter, 5,600 EGP).
4. **Young Learner — Summer School**:
   - 3 Summer Camps:
     - **Camp 1**: 5 Jul 2026 – 16 Jul 2026
     - **Camp 2**: 26 Jul 2026 – 6 Aug 2026
     - **Camp 3**: 9 Aug 2026 – 20 Aug 2026
   - 30 hours over 2 weeks (3 hrs/day: 2h class + 1h activity, Sun–Thu).
   - SC1 and SC3 share the same curriculum content (except Starters A & B).
   - Strict 1-to-1 Winter-to-Summer level mapping with unmapped levels explicitly marked.
5. **Branches Directory**:
   - Searchable branch directory across Agouza (AGU), City Stars (CTS), Aspire School New Cairo, October / Choueifat, Alexandria BSA, and Alexandria KLS.
   - Working hours, working days (Sun–Thu), managers, senior teachers, and contact emails.
   - General WhatsApp: `01022212064`.
6. **Credit Card Installments Guidelines**:
   - Adult: Valid for 40 and 60 credit packages over 6 months (9% admin fee) or 12 months (15% admin fee).
   - Young Learner: Minimum 2 terms required (no installment for 1 term).
7. **Important Links**:
   - Safe internal shortcuts to ZIWO, Salesforce / MyFatoorah, SAP SMS, CMS3, Paymob Lightning Cases, and corporate SharePoint tools.
8. **Call Center Quick Reference Cheat Sheet**:
   - Instant answers to frequent telephone questions.
9. **Global Keyboard Search (`Ctrl+K` / `Cmd+K`)**:
   - Instant search across all courses, packages, levels, branches, and operational policies.

---

## Technology Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS (custom British Council color palette `#00205B` and `#00A3B5`)
- **Testing**: Vitest (21 automated unit tests)
- **Deployment**: Static build ready for Cloudflare Pages (no backend or database required)

---

## How to Update Course Data

All business values are centralized in `src/data/`. **You never need to edit UI components to change prices or rules.**

| Business Item | File Location | What You Can Edit |
|---|---|---|
| **Adult Prices & Packages** | `src/data/adultCourses.ts` | Package prices (3850, 6000, 10000, 13300 EGP), credits, schedules, re-registration discount rate |
| **Winter Term Fees & Age Bands** | `src/data/winterCourses.ts` | Primary & Secondary fee (5800), Early Years fee (6400), IELTS for Teens fee (5600), PT fee (200), bundle discounts (5%, 10%, 15%), sibling discount (10%) |
| **Summer Camp Dates & Pricing** | `src/data/summerCamps.ts` | Camp start/end dates, display dates, camp discount rules, and optional `defaultPricePerCamp` |
| **Branches & Working Hours** | `src/data/branches.ts` | Locations, hours, working days, managers, senior teachers, emails, WhatsApp number |
| **Installment Rules** | `src/data/installments.ts` | Admin rates (9% for 6M, 15% for 12M), eligible packages, YL minimum term count |
| **Important Links** | `src/data/importantLinks.ts` | Operational portal URLs, categories, and reference notes |

---

## Local Development & Testing

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Run Automated Unit Tests
```bash
pnpm test
```
Runs 24 Vitest tests verifying:
- Boundary birthday calculations (ages 4, 5, 6, 8, 9, 11, 12, 14, 15, 17, 18+).
- Placement test requirement rules.
- Winter bundle discounts (5%, 10%, 15%) and sibling discounts.
- Adult packages and 10% re-registration discounts.
- Credit card installment eligibility.
- Strict summer level mappings.
- Bilingual answer generation (Arabic & English).

### 3. Start Development Server
```bash
pnpm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Build for Production
```bash
pnpm run build
```
Creates an optimized static bundle in the `dist/` directory.

---

## Cloudflare Pages Deployment Instructions

This application is 100% client-side and static, optimized for **Cloudflare Pages**.

### Method 1: Git Integration (Recommended)
1. Push your repository to GitHub or GitLab.
2. In the [Cloudflare Dashboard](https://dash.cloudflare.com/), go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select this repository.
4. Configure build settings:
   - **Framework preset**: `Vite` (or `None`)
   - **Build command**: `pnpm run build`
   - **Build output directory**: `dist`
   - **Node.js Version**: `20.x` (or `18.x`)
5. Click **Save and Deploy**.

### Method 2: Direct Upload via Wrangler CLI
```bash
# Build the application
pnpm run build

# Deploy directly with Wrangler
pnpm dlx wrangler pages deploy dist --project-name british-council-egypt-sales-kb
```

The repository includes `public/_redirects` to handle Single Page Application (SPA) routing automatically on Cloudflare Pages.
