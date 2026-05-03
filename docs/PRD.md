# PRD: Academic Resume Builder & Degree Tracker

## 1. Document Control
- **Version:** 1.0.0
- **Status:** READY FOR APPROVAL
- **Last Updated:** 2026-05-03
- **Project:** vibecoding-project-sy

## 2. Overview & Purpose
The objective is to provide students at the Hebrew University (HUJI) in the Economics and Business Administration double-major track with a tool to:
1. Track academic progress against specific departmental requirements.
2. Automatically generate a professional, English-language academic resume based on completed courses and grades.

## 3. User Flow
1. **Landing:** User enters name/email on Login Page.
2. **Dashboard:** User views progress bars for Economics and Business Administration.
3. **Course Management:** User adds/edits courses with name, number, credits, grade, and category.
4. **Resume Selection:** User "stars" top-performing or relevant courses for the resume.
5. **Resume Generation:** User clicks "Generate Resume" to view a polished, LTR English CV.
6. **Export:** User prints or saves the resume as PDF.

## 4. System Structure (Pages)
- **Login Page (`/`):** Simple entry point.
- **Dashboard (`/dashboard`):** The primary workspace featuring:
    - Overall Progress Section (Summary).
    - Major-specific dashboards (Economics/Business).
    - Alerts/Missing Requirements section.
    - Course Table (CRUD).
- **Resume Page (`/dashboard/resume`):** A printable resume template (LTR).

## 5. Functional Requirements
- **Progress Tracking:** Real-time calculation of completed vs. required credits.
- **Course CRUD:** Ability to add, read, update, and delete courses.
- **Starred Courses:** Maximum 5 courses can be highlighted on the resume.
- **GPA Calculation:** Average grade weighted by credits.
- **Resume Export:** Clean, minimalist template for professional use.

## 6. Academic Rules Engine

### 6.1. Economics (Total: 64 Credits)
- **Mandatory:** 40 credits.
- **Core:** 8 credits.
- **Elective:** 8 credits.
- **Research:** 4 credits.
- **Avnei Pina (Cornerstone):** 4 credits.

### 6.2. Business Administration (Total: 60 Credits)
- **Mandatory:** 27 credits.
- **Elective:** 17 credits.
- **Mandatory Elective:** 8 credits.
- **Research:** 4 credits.
- **Avnei Pina (Cornerstone):** 4 credits.

### 6.3. Logic Constraints
- **Shared Courses:** Some courses may count for both majors or satisfy specific shared requirements (e.g., Statistics).
- **Duplicate Prevention:** No two courses can have the same `number`.

## 7. Data Model

### 7.1. Course Interface
```typescript
export interface Course {
  id: string;
  name: string;
  number: string;
  credits: number;
  major: 'Economics' | 'Business' | 'Shared';
  category: EconomicsCategory | BusinessCategory;
  grade?: number;
  starred?: boolean;
}
```

### 7.2. Enums
- **EconomicsCategory:** `Mandatory`, `Core`, `Elective`, `Research`, `Avnei Pina`
- **BusinessCategory:** `Mandatory`, `Elective`, `Mandatory Elective`, `Research`, `Avnei Pina`

## 8. System State & Persistence
- **Client-side:** Data is stored in `localStorage` (`huji_degree_courses`) for immediate session persistence.
- **Server-side:** Prisma + SQLite used for structured data management (Seed data).

## 9. API Design

### 9.1. POST /api/courses
- **Description:** Add a new course.
- **Request Body:** `Omit<Course, 'id'>`
- **Validation:** `number` must be unique; `credits` and `grade` must be numeric.
- **Success Response:** `201 Created` with the full `Course` object.
- **Error Response:** `400 Bad Request` (Validation failed), `409 Conflict` (Duplicate course number).

### 9.2. GET /api/courses
- **Description:** Retrieve all courses for the user.
- **Response Structure:** `Course[]`
- **Success Response:** `200 OK`.

### 9.3. PATCH /api/courses/:id
- **Description:** Update an existing course.
- **Request Body:** `Partial<Omit<Course, 'id'>>`
- **Success Response:** `200 OK` with updated `Course`.
- **Error Response:** `404 Not Found`.

### 9.4. DELETE /api/courses/:id
- **Description:** Remove a course.
- **Success Response:** `204 No Content`.
- **Error Response:** `404 Not Found`.

## 10. Component Specification
- **MajorDashboard:** Reusable component for displaying progress bars and category breakdown.
- **CourseTable:** Interactive list with search and CRUD actions.
- **AddCourseModal:** Form for data entry with validation.
- **ResumeTemplate:** LTR-styled component for resume view.

## 11. UX Behavior & System Feedback
- **RTL/LTR:** Dashboard is RTL (Hebrew); Resume is LTR (English).
- **Real-time Updates:** Progress bars animate immediately upon course addition/deletion.
- **Validation Messages:** Alert user when a duplicate course number is entered.
- **Visual Cues:** Progress bar colors change (Red -> Orange -> Green) based on percentage.

## 12. Edge Cases & Failure Handling
- **Changing Majors:** If a user changes the major of a course, it must be removed from the previous major's stats and added to the new one.
- **Duplicate Numbers:** System prevents adding a course with a number that already exists in the list.
- **Exceeding Limits:** If credits exceed a category requirement, they are shown as 100% complete, but the surplus credits do not overflow into other categories unless defined.
- **Critical Deletion:** Deleting a course updates all GPA and progress calculations instantly.
- **Empty State:** Display a helpful message and "Add Course" call-to-action when no courses exist.
- **Invalid Inputs:** Grade must be 0-100; Credits must be > 0.

## 13. User Scenarios
- **Scenario A:** Student adds a mandatory Economics course and sees the "Economics - Mandatory" progress bar move.
- **Scenario B:** Student "stars" their 5 highest-graded courses to see them featured prominently in the "Key Coursework" section of the resume.
- **Scenario C:** Student generates a resume and notices the skills section automatically includes "Quantitative Analysis" because they completed "Statistics" and "Econometrics".

## 14. Constraints & Rules
- Minimalist aesthetic using Zinc/Slate colors.
- Maximum 5 starred courses for resume.
- Grade field is optional but required for GPA inclusion.

## 15. Future Expansion
- **LLM Integration:** Generate descriptive bullet points for featured courses.
- **Multi-user Support:** Migration from `localStorage` to full Auth-based DB storage.
- **Advanced Skills Mapping:** More granular skills derived from course syllabus data.

## 16. Open Questions / Needs Decision
- Should "Shared" courses split credits or count fully for both?
- Is there a need for "Year/Semester" filtering in the dashboard?

STATUS: READY FOR APPROVAL
