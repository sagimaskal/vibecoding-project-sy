# PRD: Academic Resume Builder & Degree Tracker

## 1. Document Control
- **Version:** 1.2.0
- **Status:** READY FOR APPROVAL
- **Last Updated:** 2026-05-03
- **Role:** Single Source of Truth (SSOT)
- **Project:** vibecoding-project-sy

---

## 2. Overview & Purpose
### System Purpose
The objective is to provide students at the Hebrew University (HUJI) in the Economics and Business Administration double-major track with a centralized, RTL-native portal to:
1. Track academic progress against specific departmental requirements using a deterministic rules engine.
2. Automatically generate a professional, English-language academic resume based on completed courses and grades.

---

## 3. User Flow
1. **Landing:** User enters name/email on Login Page.
2. **Dashboard:** User views progress bars and academic status for Economics and Business Administration.
3. **Course Management:** User adds/edits courses with name, number, credits, grade, and category.
4. **Resume Selection:** User "stars" top-performing or relevant courses for the resume.
5. **Resume Generation:** User clicks "Generate Resume" to view a polished, LTR English CV.
6. **Export:** User prints or saves the resume as PDF.

---

## 4. System Structure (Pages)
- **Login Page (`/`):** Simple entry point.
- **Dashboard (`/dashboard`):** The primary workspace featuring:
    - Overall Progress Section (Summary).
    - Major-specific dashboards (Economics/Business).
    - Alerts/Missing Requirements section.
    - Course Table (CRUD).
- **Resume Page (`/dashboard/resume`):** A printable, professional resume template (LTR).

---

## 5. Functional Requirements & Enforceable Logic

### 5.1 Course Management Logic
| Feature | Rule | Validation / Constraint | Failure Scenario |
| :--- | :--- | :--- | :--- |
| **Course Identity** | `Course Number` is the unique identifier. | Must be numeric string. | Different names for same number are blocked. |
| **Duplication** | No two courses can share the same `Course Number`. | System-wide unique constraint per user. | Alert: `"קורס זה כבר הוזן..."` |
| **Attribution** | 1 Course = 1 Major + 1 Category. | Selection restricted to active major categories. | No "unassigned" courses allowed. |
| **Credit Units** | Credits must be in increments of 0.5. | `Number > 0`, `Max 20`. | Input rejected if <= 0. |
| **Grade Handling** | Grades are optional (0-100). | `0 <= Grade <= 100` OR `null`. | Input rejected if outside range. |

### 5.2 Resume Builder Requirements
- **Automatic Academic Summary:** Generate a "Skills" section based on course categories.
- **Starred Courses:** Maximum 5 courses can be highlighted on the resume.
- **GPA Calculation:** Average grade weighted by credits.
- **English Export:** Automatic translation or mapping of course categories to English for the resume view.

---

## 6. Academic Rules Engine

### 6.1 Credits Attribution Engine
1.  **Selection-Based Routing**: A course is attributed to a major based on the `Major` field.
2.  **No Double Counting**: The engine sums credits grouped by `(Major, Category)`.
3.  **Overflow Behavior**: 
    - If `CurrentCategoryCredits > RequiredCategoryCredits`, the category progress bar shows 100%.
    - Surplus credits contribute to the **Major Total**.
4.  **Major Totals**:
    - **Economics (Target 64)**: Mandatory: 40 | Core: 8 | Elective: 8 | Research: 4 | Avnei Pina: 4.
    - **Business (Target 60)**: Mandatory: 27 | Elective: 17 | Mandatory Elective: 8 | Research: 4 | Avnei Pina: 4.

---

## 7. Data Model

### 7.1 Course Entity
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
  year?: 'א' | 'ב' | 'ג' | 'ד+';
  semester?: 'א' | 'ב' | 'קיץ';
}
```

### 7.2 Enums
- **EconomicsCategory:** `Mandatory`, `Core`, `Elective`, `Research`, `Avnei Pina`
- **BusinessCategory:** `Mandatory`, `Elective`, `Mandatory Elective`, `Research`, `Avnei Pina`

---

## 8. System State & Persistence
- **Local Storage Strategy:** 
  - Key: `huji_degree_courses`.
  - Hydrated on `ComponentDidMount`.
  - Writes on every state change (Debounced).
- **Backend (Future):** Prisma + SQLite for structured data management.

---

## 9. API Design

### 9.1 POST /api/courses
- **Description:** Add a new course.
- **Validation:** Unique number, valid credits/grade.
- **Response:** `201 Created` with Course object.

### 9.2 GET /api/courses
- **Response:** `Course[]`.

### 9.3 PATCH /api/courses/:id
- **Description:** Update course attributes.
- **Response:** `200 OK`.

### 9.4 DELETE /api/courses/:id
- **Response:** `204 No Content`.

---

## 10. Component Specification
- **MajorDashboard:** Visual progress bars for credit requirements.
- **CourseTable:** Year/Sem, Name, ID, Credits, Grade, Actions.
- **AddCourseModal:** Form with dynamic categories based on Major.
- **ResumeTemplate:** Professional LTR layout for academic CV.

---

## 11. UX Behavior & System Feedback
- **RTL/LTR:** Dashboard is RTL; Resume is LTR.
- **Real-time Updates:** Progress bars and GPA update instantly.
- **Visual Cues:** Red/Orange/Green progress bars based on completion.
- **Alerts:** Dynamic warnings for missing mandatory requirements.

---

## 12. Edge Cases & Failure Handling
- **Changing Majors:** Recalculates all stats immediately.
- **Duplicate Numbers:** Blocked at input level with clear feedback.
- **Exceeding Limits:** 100% cap on progress bars; total credits reflect actual sum.
- **Empty State:** Help text and clear CTA for first-time users.

---

## 13. User Scenarios
- **Scenario A:** Student adds a mandatory Economics course and sees the "Economics - Mandatory" progress bar move.
- **Scenario B:** Student "stars" their top 5 courses to feature them in the "Key Coursework" section of the resume.
- **Scenario C:** Senior student moves a course between majors to optimize credit distribution.

---

## 14. Constraints & Rules
- Minimalist aesthetic using Zinc/Slate colors.
- Maximum 5 starred courses for resume.
- Grade must be numeric (0-100).

---

## 15. Future Expansion
- **Automated Parser:** HUJI PDF Transcript upload.
- **LLM Integration:** Bullet point generation for resume skills.
- **Multi-user Support:** Migration to full Auth-based DB storage.

---

## 16. Open Questions / Needs Decision
- Detailed mapping for "Shared" courses (double-counting vs. splitting).
- Default English translations for all Hebrew course names.

**STATUS: READY FOR APPROVAL**
