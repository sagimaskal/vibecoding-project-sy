# Product Requirements Document: HUJI Degree Tracker

## 1. Document Control
- **Version**: 1.2 (Final Refactor)
- **Status**: READY FOR APPROVAL
- **Role**: Single Source of Truth (SSOT)
- **Change Rules**: 
  - Any deviation in implementation from this document constitutes a bug unless the document is updated.
  - Changes require explicit sign-off and version increment.

---

## 2. Overview & Purpose
### 2.1 Problem Statement
Students in the Economics and Business Administration dual-degree program at the Hebrew University lack a unified, real-time interface to track credit (N.Z.) requirements. Manual tracking in spreadsheets is prone to attribution errors and graduation delays.

### 2.2 Solution
A localized (Hebrew RTL) web portal that provides deterministic degree validation via a centralized rules engine. The system allows manual course entry, visualizes progress per major, and persists data locally.

---

## 3. User Flow
1.  **Landing**: Entry point explaining system capabilities.
2.  **Onboarding**: Identity capture (Name/Email) saved to `localStorage`.
3.  **Configuration**: Degree combination selection (Restricted to Economics + Business).
4.  **Portal Navigation**: Access to three primary views via a persistent sidebar:
    - **Stats**: Visualization of degree progress.
    - **Courses**: Management of course data.
    - **About**: System documentation and rules.

---

## 4. System Structure (Pages)
### 4.1 Landing Page (`/`)
- **Purpose**: Inform users and provide entry.
- **Components**: Feature grid, Hero section, "Enter System" CTA.
### 4.2 Login Page (`/login`)
- **Purpose**: Identity initialization.
- **Components**: Name and Email input fields.
### 4.3 Setup Page (`/setup`)
- **Purpose**: Major validation.
- **Components**: Major selection cards (Economics, Business, CS, Law, etc.).
### 4.4 Stats Page (`/portal/stats`)
- **Purpose**: Progress visualization.
- **Components**: Dual major dashboards, requirement progress bars, system alerts.
### 4.5 Course Management Page (`/portal/courses`)
- **Purpose**: CRUD operations for academic data.
- **Components**: Add Course CTA, search filter, course list table, edit/delete actions.
### 4.6 About Page (`/portal/about`)
- **Purpose**: Reference and documentation.
- **Components**: Rules explanation, usage guide.

---

## 5. Functional Requirements
- **Identity**: Display the student's name in the sidebar and portal views.
- **Course CRUD**: Users must be able to Create, Read, Update, and Delete courses.
- **Validation**: Prevent duplicate entries based on `Course Number`.
- **Search**: Filter course list by `Course Name` or `Course Number`.
- **Data persistence**: All data must survive browser refreshes.

---

## 6. Academic Rules Engine
### 6.1 Attribution Logic
- **Single Attribution**: One course attributes to exactly one `Major` and one `Category`.
- **No Double Counting**: A course cannot contribute credits to both majors simultaneously.
- **Avnei Pina**: Treated as a standard category within whichever major the user assigns it to.

### 6.2 Credit Requirements (Fixed Constants)
#### Economics (Total: 64 N.Z.)
- Mandatory: 40
- Core: 8
- Elective: 8
- Research: 4
- Avnei Pina: 4

#### Business Administration (Total: 60 N.Z.)
- Mandatory: 27
- Elective: 17
- Mandatory Elective: 8
- Research: 4
- Avnei Pina: 4

### 6.3 Calculation Logic
- `CategoryProgress = min(100, (CompletedCategoryCredits / RequiredCategoryCredits) * 100)`
- `MajorTotal = Sum of all credits assigned to major`
- `RemainingCredits = max(0, TargetCredits - MajorTotal)`

---

## 7. Data Model
### 7.1 Course Entity
- `id`: UUID (Primary Key)
- `name`: String (Non-nullable)
- `number`: String (Unique identifier, numeric only)
- `credits`: Float (0.5 increments, 0.5 to 20.0)
- `year`: Enum `[א, ב, ג, ד+]`
- `semester`: Enum `[א, ב, קיץ]`
- `major`: Enum `[Economics, Business]`
- `category`: Enum (Scoped by Major)
- `grade`: Integer (0-100, Nullable)

### 7.2 User Entity
- `id`: UUID
- `name`: String
- `email`: String (Unique)
- `majors`: Enum Array `[Economics, Business]`

---

## 8. System State & Persistence
- **Primary Storage**: `localStorage`.
- **Keys**: `huji_degree_courses`, `huji_user_name`.
- **Sync Trigger**: Write to storage on every state mutation (Add/Edit/Delete).
- **Initialization**: Hydrate application state from storage on mount.

---

## 9. API Design
*Note: Prepared for future backend integration.*

### 9.1 POST /courses
- **Body**: `{ name, number, credits, year, semester, major, category, grade? }`
- **Validation**: Check if `number` already exists for the authenticated user.
- **Errors**: `400 Bad Request` (Invalid fields), `409 Conflict` (Duplicate number).

### 9.2 GET /courses
- **Response**: `Array<Course>`
- **Filtering**: Support query params for `major`.

### 9.3 PATCH /courses/:id
- **Body**: Partial course object.
- **Validation**: If `number` is changed, verify uniqueness.

### 9.4 DELETE /courses/:id
- **Response**: `204 No Content`

---

## 10. Component Specification
### 10.1 Course Table
- **Columns**: Year/Semester, Course Name, Course Number, N.Z., Major/Category, Grade, Actions.
- **Behavior**: Hovering a row highlights actions (Edit/Delete).
### 10.2 Progress Bar
- **Visuals**: Color-coded (Red < 30%, Orange < 80%, Green >= 80%).
- **Animation**: 1000ms easing on load/update.

---

## 11. UX Behavior & System Feedback
- **Loading State**: Show skeleton screens during `localStorage` hydration.
- **Success Feedback**: Visual confirmation (e.g., row highlight) when a course is added or updated.
- **Error Feedback**: Modal or browser alert for invalid operations (e.g., duplicate ID).
- **Empty State**: Centered graphic with a "Start by adding your first course" CTA.

---

## 12. Edge Cases & Failure Handling
- **Changing Majors**: Currently, the system only supports Econ+Bus. If the majors list changes, courses assigned to a removed major must be flagged as "Orphaned".
- **Duplicate Variation**: Same `Course Number` with different `Name` is blocked.
- **Overflow**: Credits exceeding a category requirement cap the progress bar at 100% but are included in the major's total sum.
- **Invalid Grade**: Input values < 0 or > 100 are rejected at the UI level and blocked by the model.

---

## 13. User Scenarios
### 13.1 Freshman Setup
1. User logs in for the first time.
2. Selects Economics and Business.
3. System initializes empty state.
4. User adds "Introduction to Microeconomics" (57101, 4 N.Z.).
5. Economics Mandatory progress bar moves to 10%.

### 13.2 Mid-Degree Data Correction
1. Senior student realizes a course was miscategorized.
2. User edits "Statistics" from Business-Mandatory to Economics-Mandatory.
3. Business stats immediately drop; Economics stats increase.
4. Business dashboard flags missing mandatory credits.

### 13.3 Duplicate Prevention
1. User attempts to add "Macroeconomics" (57102).
2. User already has "Macro" (57102) in the list.
3. System triggers alert: `"קורס זה כבר הוזן..."` and prevents save.

---

## 14. Constraints & Rules
- **Localization**: All user-facing text must be in Hebrew.
- **Layout**: Right-to-Left (RTL).
- **Scope**: Deterministic logic only for Economics and Business Administration.

---

## 15. Future Expansion
- Integration with HUJI transcript PDF parsing.
- Support for Accounting, CS, Law, and Psychology.
- Cloud database synchronization (PostgreSQL).

---

## 16. Open Questions / Needs Decision
- Should the system automatically handle "Core" to "Elective" overflow for Economics?
- Should we implement a GPA (Average) display based on the `grade` field?

---

**STATUS: READY FOR APPROVAL**
