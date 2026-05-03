# Product Requirements Document: HUJI Degree Tracker & Academic Resume Builder

## 1. Document Control
- **Version**: 1.4
- **Status**: READY FOR REVIEW
- **Role**: Single Source of Truth
- **Rule**: Any implementation that contradicts this document is considered a bug unless the PRD is updated and approved.

---

## 2. Product Overview
The HUJI Degree Tracker & Academic Resume Builder is a centralized academic utility designed for students at the Hebrew University. It addresses the fragmentation of academic data by providing a clear, localized interface for tracking degree progress and a streamlined way to convert that data into a professional resume.

The product consists of two separate modules:
**A. Degree Tracker**: A localized tool for verifying academic requirements.
**B. Academic Resume Builder**: A tool for generating professional English-language resumes.

---

## 3. Product Scope

### 3.1 In Scope
- **Hebrew RTL Degree Tracking Dashboard**: Optimized for the local student experience.
- **Support for Economics + Business Administration**: Currently limited to this dual-major combination.
- **Manual Course Entry**: Users input their own academic data.
- **Credit Progress Tracking**: Automatic calculation of completed vs. required N.Z.
- **GPA Calculation**: Weighted average based on entered grades (where available).
- **Local Persistence**: Data stored exclusively via `localStorage`.
- **English LTR Resume Builder**: Generation of a professional CV based on profile data.
- **Course Selection (Starring)**: Ability to "star" up to 5 courses to feature on the resume.
- **Resume Export**: Preview and browser-based print/PDF export.

### 3.2 Out of Scope for Current Version
- Real university authentication/login.
- Official HUJI system integration (Mina/HUJI-Net).
- Transcript PDF parsing/automatic upload.
- Active backend database persistence (Prisma/SQLite used for seeding/future only).
- Multi-user cloud synchronization.
- Automatic official academic validation (System is for personal tracking only).
- Support for additional majors (Accounting, CS, Law, etc.).

---

## 4. User Flow
1. **Landing Page**: Overview of the tool and entry point.
2. **Login / Identity Capture**: Capture Name and Email (Saved to `localStorage`).
3. **Degree Setup**: Confirm the Economics + Business Administration combination.
4. **Portal/Dashboard**: Access to primary modules.
5. **Stats Page**: Visualization of N.Z. progress (Hebrew, RTL).
6. **Courses Page**: CRUD interface for course data and "starring" (Hebrew, RTL).
7. **Resume Page**: Selection of featured content and preview (English, LTR).
8. **About Page**: Reference documentation and project rules.

---

## 5. Module A - Degree Tracker Requirements
- **Purpose**: Provide a deterministic view of degree progress for HUJI students.
- **Supported Combination**: Economics (Double Major) + Business Administration (Double Major).
- **Course CRUD**: Full Create, Read, Update, and Delete capabilities for courses.
- **Search**: Filter the course list by Name or Course Number.
- **Duplicate Prevention**: System must block entries sharing the same Course Number for a single user.
- **Credit Tracking**: Real-time updates to progress bars per major and category.
- **GPA Calculation**: Weighted average displayed prominently on the dashboard.
- **Empty State**: Clear visual guidance for first-time users to add their first course.
- **Error State**: Validations for invalid credits, grades, or duplicate IDs.

---

## 6. Academic Rules Engine
This section defines the logic for degree calculations.

### 6.1 Logic Constraints
- **Single Attribution**: A course belongs to exactly one major and one category.
- **No Double Counting**: Credits cannot be split or shared between majors in this version.
- **Credit Summation**: Credits are summed by Major and then by Category.
- **Overflow Behavior**: If credits exceed a category requirement, the category progress is capped at 100%. However, excess credits still contribute to the Major Total unless explicitly marked otherwise.
- **Grade Optionality**: Grades are not mandatory.
- **GPA calculation**: Calculated using only courses that have a valid numeric grade.

### 6.2 Credit Constants

#### Economics (Total Target: 64 N.Z.)
- Mandatory: 40
- Core: 8
- Elective: 8
- Research: 4
- Avnei Pina: 4

#### Business Administration (Total Target: 60 N.Z.)
- Mandatory: 27
- Elective: 17
- Mandatory Elective: 8
- Research: 4
- Avnei Pina: 4

### 6.3 Formulas
- `CategoryProgress = min(100, (CompletedCategoryCredits / RequiredCategoryCredits) * 100)`
- `MajorRemainingCredits = max(0, RequiredMajorCredits - CompletedMajorCredits)`
- `GPA = (Sum of (Grade * Credits)) / (Sum of Credits for courses with grades)`

---

## 7. Module B - Academic Resume Builder Requirements
- **Separation**: The Resume Builder is a distinct module utilizing data from Module A.
- **Directionality**: The interface and output are English and Left-to-Right (LTR).
- **Identity Integration**: Uses name and email from the user profile.
- **Starring Logic**: 
    - User can select (star) up to 5 courses.
    - If a user attempts to star a 6th course, the action is blocked with an error message.
- **Resume Content**: Features user identity and the list of starred/featured courses.
- **Export**: Optimized for browser-based printing and "Save as PDF".
- **Non-Interference**: Calculations or state changes in Module B must not alter the academic stats in Module A.

---

## 8. Data Model

### 8.1 User Entity
- `id`: Unique identifier (UUID).
- `name`: Student name.
- `email`: Student email.
- `majors`: Array of selected majors (Default: `['Economics', 'Business']`).

### 8.2 Course Entity
- `id`: Unique identifier (UUID).
- `userId`: Reference to User.
- `name`: Course title.
- `number`: Course number (Unique per user).
- `credits`: Numeric value (0.5 to 20.0, in 0.5 increments).
- `year`: Academic year (`א`, `ב`, `ג`, `ד+`).
- `semester`: Academic semester (`א`, `ב`, `קיץ`).
- `major`: Associated major (`Economics` or `Business`).
- `category`: Category within the major (Scoped by selection).
- `grade`: Optional integer (0-100).
- `starred`: Boolean flag for the Resume Builder.

### 8.3 Validation Rules
- **Course Number**: Must be unique per user.
- **Credits**: Range 0.5 to 20.0; must be 0.5 increments.
- **Grade**: Optional; must be 0-100 if provided.
- **Starred Limit**: Maximum 5 courses per user.

---

## 9. Persistence
- **Active Layer**: `localStorage` is the only active persistence layer for the current MVP.
- **Inactive Layers**: Prisma, SQLite, and PostgreSQL are for future development and are not used for active user state.
- **Storage Keys**:
    - `huji_user`: Stores the User object.
    - `huji_degree_courses`: Stores the array of Course objects.
- **Behavior**:
    - Data survives page refreshes.
    - Data is browser-specific and device-specific.
    - Clearing browser storage will delete all user data.

---

## 10. API Design - Future Only
*Note: These endpoints are for future planning and are NOT to be implemented in the current version.*
- `GET /courses`: Retrieve all courses.
- `POST /courses`: Create a new course entry.
- `PATCH /courses/:id`: Update an existing course.
- `DELETE /courses/:id`: Remove a course entry.

---

## 11. UI / UX Requirements

### 11.1 Degree Tracker (Module A)
- **Language**: Hebrew.
- **Directionality**: Right-to-Left (RTL).
- **Design**: Clean dashboard with progress bars and clear display of remaining credits.
- **Feedback**: Validation messages and alerts must be in Hebrew.

### 11.2 Resume Builder (Module B)
- **Language**: English.
- **Directionality**: Left-to-Right (LTR).
- **Design**: Minimalist resume layout optimized for professional aesthetics and print clarity.

### 11.3 Shared Standards
- **Aesthetic**: High contrast (Zinc/Slate scales).
- **Responsiveness**: Mobile-friendly navigation.
- **Empty States**: Helpful messaging when no data is present.
- **Errors**: Clear visual feedback for validation failures.

---

## 12. Edge Cases
- **Duplicate Course Number**: Blocked with a specific error message.
- **Invalid Grade/Credits**: Input rejected by form validation.
- **Starred Limit**: User cannot star more than 5 courses.
- **Category Overflow**: Visual capping at 100% while retaining credit sum.
- **Data Deletion**: Confirmations for course deletion.
- **Unsupported Combination**: System defaults to Econ+Bus; others are currently blocked.

---

## 13. Constraints
- Limited to Economics and Business Administration majors.
- No automated synchronization with HUJI systems.
- Persistence restricted to local browser storage.
- Module B (Resume) must not modify Module A (Academic) logic.

---

## 14. Future Expansion
- Integration of more majors (Law, Accounting, CS).
- Cloud-based backend synchronization.
- Automated transcript import (PDF parsing).
- Advanced/Multiple resume templates.

---

## 15. Open Questions
- Should overflow credits move between categories automatically?
- Should GPA appear on the dashboard by default or be togglable?
- Should resume export be print-only or require server-side PDF generation?
- Should shared-course logic (courses counting for both majors) be supported in v2.0?

---

STATUS: READY FOR REVIEW
