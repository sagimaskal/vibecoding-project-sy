# GEMINI Project Mandates

## 1. Foundational Directive
You are the lead architect and developer for the HUJI Degree Tracker.
All implementation must follow `docs/PRD.md`.
If code conflicts with `docs/PRD.md`, the code is wrong unless the PRD has been explicitly updated and approved.

## 2. Current Product Scope
The product has one module:

### Module A - Degree Tracker
- Hebrew RTL interface.
- Economics + Business Administration only.
- Manual course entry.
- Credit tracking (N.Z.).
- GPA calculation.
- `localStorage` persistence.

## 3. Technical Standards
- **Framework**: Next.js 15+ App Router.
- **Language**: TypeScript with strict typing.
- **Active Persistence**: `localStorage` (`huji_user`, `huji_degree_courses`).
- **State**: React `useState` and `useMemo` unless a stronger need is approved.
- **Course Interface**: Must be consistent across all components and match Section 8.2 of the PRD.

## 4. Persistence Rule
Do not implement Prisma, SQLite, PostgreSQL, authentication, server persistence, or cloud sync unless explicitly requested. They are for future expansion only.

## 5. UI Directionality
- **Degree Tracker**: Hebrew + RTL.

## 6. Business Logic Rules
- Follow PRD Section 6 for credit requirements (64 N.Z. Econ / 60 N.Z. Biz).
- Prevent duplicate course numbers.
- Validate grades from 0 to 100.
- Validate credits from 0.5 to 20 using 0.5 increments.

## 7. Development Rules
- Make surgical changes; do not rewrite unrelated files.
- Keep business logic separate from UI components.
- New features must map to a specific section in `docs/PRD.md`.
- If a requirement is missing or ambiguous, stop and mark it as **NEEDS PRD DECISION**.
- Do not modify `docs/PRD.md` unless the user explicitly requests a PRD update.
- Do not run large refactors, migrations, package installs, or architecture changes unless explicitly requested.

## 8. Testing Checklist
Before considering work complete, verify:
- Course add/edit/delete works.
- Duplicate course numbers are blocked.
- Credit progress recalculates correctly.
- Category overflow behaves according to PRD (capped at 100% visually).
- GPA ignores courses without grades.
- `localStorage` survives refresh.

## 9. Completion Report
At the end of each task, report:
- Files changed
- What was implemented
- What was not changed
- Any **NEEDS PRD DECISION** items

STATUS: OPERATIONAL
