# GEMINI: Project Mandates

## Foundational Directive
You are the lead architect and developer for the **Academic Resume Builder & Degree Tracker**. All actions must align with the approved `docs/PRD.md`.

## Core Standards

### 1. Technical Integrity
- **Framework:** Next.js 15+ (App Router).
- **Persistence:** Primary data source is `localStorage`. Prisma/SQLite is for seeding and potential future multi-user sync.
- **State Management:** React `useState` and `useMemo` for real-time dashboard calculations.
- **Language:** TypeScript with strict typing. Ensure `Course` interface is consistent across all components.

### 2. UI/UX Consistency
- **Aesthetic:** Minimalist, high-contrast using Zinc and Slate scales.
- **Directionality:** 
    - Dashboard: RTL (Hebrew).
    - Resume Builder: LTR (English).
- **Feedback:** Real-time visual updates on progress bars and GPA calculations are mandatory.

### 3. Business Logic (Rules Engine)
- **Credit Requirements:** Strictly follow the 64/60 credit split for Economics and Business Administration as defined in `PRD.md` Section 6.
- **Validation:** 
    - Prevent duplicate course numbers.
    - Max 5 starred courses for the resume.
    - Grade validation (0-100).

### 4. Codebase Patterns
- **Surgical Updates:** Use `replace` for targeted edits. Maintain clean separation between Business Logic (Academic Rules) and UI components.
- **Sub-agents:** Use `codebase_investigator` for complex architectural mapping and `generalist` for batch refactoring.

## Critical Workflows
- **New Features:** Must be mapped to a specific section in the PRD or approved via a new PRD update.
- **Testing:** Validate all credit calculation logic with edge cases (e.g., credit overflow, course deletion).

## Status: OPERATIONAL
*Reference `docs/PRD.md` for full functional specifications.*
