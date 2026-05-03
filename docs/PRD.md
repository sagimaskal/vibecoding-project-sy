# Product Requirements Document: HUJI Degree Tracker

## 1. Overview
### What the system is
The **HUJI Degree Tracker** is a professional web-based academic management portal designed for students at the Hebrew University of Jerusalem. It enables students to manage their course history, track credit (N.Z) progress in real-time, and validate their standing against specific degree requirements.

### Who it is for
Initially, the system is strictly tailored for dual-degree students in **Economics (כלכלה)** and **Business Administration (מנהל עסקים)**.

### What problem it solves
Dual-degree students often struggle with fragmented university systems and complex, department-specific rules. Tracking requirements across two different faculties using manual spreadsheets is error-prone and stressful.

### Why it matters
Incorrect credit tracking can lead to delayed graduation or missed prerequisites. This system provides a "Fintech-grade" dashboard that gives students clarity, confidence, and control over their academic journey.

---

## 2. Core Value Proposition
- **Automated Validation**: Instant calculation of completed vs. remaining credits based on exact HUJI departmental rules.
- **Visual Clarity**: High-end progress bars and category breakdowns that turn raw data into actionable insights.
- **RTL Native**: Built from the ground up for Hebrew speakers with a modern, responsive interface.
- **Persistence**: Data is saved automatically, ensuring the student's personal area is always up to date.

---

## 3. User Flow
1.  **Entry**: User arrives at a modern Landing Page explaining the product.
2.  **Onboarding**: User logs in with a Name and Email (capturing identity).
3.  **Setup**: User selects their degree combination.
    - If "Economics + Business": Proceed to Portal.
    - If any other combination: Show "Unsupported" message.
4.  **Portal Access**: User enters the Personal Area with a persistent sidebar.
5.  **Navigation**: User toggles between "Stats" (Overview), "Courses" (Management), and "About" (Information).

---

## 4. System Structure (Pages)
### Landing Page
- **Purpose**: Conversion and education.
- **Components**: Hero section, features grid, "Enter System" CTA.
- **User Actions**: Click to login.

### Login Page
- **Purpose**: Identity capture.
- **Components**: Name/Email input fields.
- **User Actions**: Submit form to save identity to local storage.

### Degree Selection Page
- **Purpose**: Configuration.
- **Components**: Major selection cards/dropdowns.
- **User Actions**: Choose two majors; proceed if valid.

### Personal Dashboard (Stats)
- **Purpose**: High-level progress tracking.
- **Components**: Two major-specific cards with progress bars and category lists (Mandatory, Elective, etc.).
- **User Actions**: View stats; read system alerts.

### Course List Page
- **Purpose**: Data management.
- **Components**: "Add Course" button, Search bar, Course Table (showing Year, Semester, Name, Number, Credits, Major, Category, and Grade).
- **User Actions**: Add, Edit, or Delete courses.

### About / System Rules Page
- **Purpose**: Documentation.
- **Components**: System scope explanation, usage guide, manual entry rules.
- **User Actions**: Reference rules for credit attribution.

---

## 5. Functional Requirements
### User Identity
- System must capture and display the student's name in the personal area.
- **NEEDS DECISION**: Transition from local-only storage to server-side authentication (Auth0/Firebase).

### Course Management
- Users can add courses with: Name, Number (Unique ID), Credits, Year, Semester, Major, Category, and Grade (Optional).
- System must prevent duplicate entries based on the **Course Number**.
- Users can edit any field of an existing course.
- Users can delete courses with immediate stat recalculation.

### Credit Tracking (N.Z)
- **Economics Rules**: Total 64 (Mandatory 40, Core 8, Electives 8, Research 4, Avnei Pina 4).
- **Business Rules**: Total 60 (Mandatory 27, Electives 17, Mandatory Electives 8, Research 4, Avnei Pina 4).
- **Recalculation**: Stats must update instantly upon any data change.

### Logic Constraints
- **Strict Attribution**: A course belongs to exactly ONE major and ONE category. No double-counting is allowed at this stage.
- **Avnei Pina**: Treated as a distinct category under the major it is assigned to.

---

## 6. Data Model (High Level)
### User
- Name (String)
- Email (String)
- Selected Majors (Array of Strings)

### Course
- ID (UUID)
- Name (String)
- Number (String/Unique)
- Credits (Number)
- Year (String: A/B/C/D+)
- Semester (Enum: A/B/Summer)
- Major (Enum: Economics/Business)
- Category (Enum based on Major)
- Grade (Number/Optional)

### Degree Requirement
- Major Name
- Total Credits Required
- Category Map (Name -> Required Credits)

---

## 7. UX / UI Guidelines
- **Direction**: Right-to-Left (RTL) across all views.
- **Style**: "Fintech-Modern" - clean white/zinc backgrounds, subtle shadows, large typography.
- **Hierarchy**: Most important data (Total Progress %) must be largest.
- **Feedback**: Immediate visual cues for success (adding) or error (duplicates).
- **Accessibility**: High contrast text; responsive layout for mobile use during registration periods.

---

## 8. Constraints & Rules
- **Scope**: Support is limited to Economics and Business Administration only.
- **Validation**: System must show an alert: `"קורס זה כבר הוזן למערכת ולא ניתן לספור אותו פעמיים"` if a duplicate number is detected.
- **Storage**: Currently relies on `localStorage`. 
- **NEEDS DECISION**: Database schema for PostgreSQL/SQLite integration.

---

## 9. Future Expansion
- **Database Integration**: Migrate from browser storage to a permanent cloud database.
- **Major Support**: Expand logic to include Accounting, Computer Science, and Law.
- **Automation**: Feature to upload PDF transcripts for automatic course parsing.
- **GPA Calculation**: Automated weighted GPA based on entered grades.

---

## 10. Open Questions / Needs Decision
1.  **Authentication**: When should we implement a real secure login (Passwords/SSO)?
2.  **Shared Courses**: Will we support the "Shared Course" logic (where one course counts for both majors) in the next version?
3.  **Avnei Pina Limits**: Should the system flag if a student enters more than the required 4 N.Z of Avnei Pina?

---

**STATUS: DRAFT - Pending Approval**
