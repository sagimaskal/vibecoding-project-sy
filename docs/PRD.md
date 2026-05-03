# Product Requirements Document: HUJI Degree Tracker & Academic Resume Builder

## 1. Document Control
- **Version**: 1.3 (Unified Strategy)
- **Status**: READY FOR APPROVAL
- **Role**: Single Source of Truth (SSOT)
- **Change Rules**: 
  - Any deviation in implementation from this document constitutes a bug unless the document is updated.
  - Changes require explicit sign-off and version increment.

---

## 2. Overview & Purpose
### 2.1 Problem Statement
Students in the Economics and Business Administration dual-degree program at the Hebrew University lack a unified, real-time interface to track credit (N.Z.) requirements and a simple way to generate professional English-language resumes from their academic data.

### 2.2 Solution
A localized (Hebrew RTL) web portal for deterministic degree validation combined with an English (LTR) academic resume generator. The system allows manual course entry, visualizes progress, and exports polished CVs.

---

## 3. User Flow
1.  **Landing**: Entry point explaining system capabilities.
2.  **Onboarding**: Identity capture (Name/Email) saved to `localStorage`.
3.  **Configuration**: Degree combination selection (Restricted to Economics + Business).
4.  **Portal Navigation**: Access via persistent sidebar:
    - **Stats**: Visualization of degree progress (RTL).
    - **Courses**: Management of course data (RTL).
    - **Resume**: Selection and export of academic resume (LTR).
    - **About**: System documentation and rules.

---

## 4. System Structure (Pages)
### 4.1 Landing Page (`/`)
- **Purpose**: Inform users and provide entry.
### 4.2 Login Page (`/login`)
- **Purpose**: Identity initialization (Name/Email).
### 4.3 Setup Page (`/setup`)
- **Purpose**: Major validation (Economics + Business).
### 4.4 Stats Page (`/portal/stats`)
- **Purpose**: Progress visualization (Dual major dashboards).
### 4.5 Course Management Page (`/portal/courses`)
- **Purpose**: CRUD operations and "starring" courses for the resume.
### 4.6 Resume Page (`/portal/resume`)
- **Purpose**: Preview and export (PDF/Print) of the LTR English resume.
### 4.7 About Page (`/portal/about`)
- **Purpose**: Reference and documentation.

---

## 5. Functional Requirements
- **Identity**: Display the student's name across all portal views.
- **Course CRUD**: Create, Read, Update, and Delete academic courses.
- **Resume Builder**:
    - **Starring**: Users can "star" up to 5 courses to highlight on the resume.
    - **Export**: Generate a minimalist LTR resume template.
- **Validation**: Prevent duplicate entries based on `Course Number`.
- **Search**: Filter course list by name or number.
- **Data persistence**: All data survives browser refreshes via `localStorage`.

---

## 6. Academic Rules Engine
### 6.1 Attribution Logic
- **Single Attribution**: One course attributes to exactly one `Major` and one `Category`.
- **No Double Counting**: A course cannot contribute credits to both majors simultaneously.

### 6.2 Credit Requirements (Fixed Constants)
#### Economics (Total: 64 N.Z.)
- Mandatory: 40 | Core: 8 | Elective: 8 | Research: 4 | Avnei Pina: 4
#### Business Administration (Total: 60 N.Z.)
- Mandatory: 27 | Elective: 17 | Mandatory Elective: 8 | Research: 4 | Avnei Pina: 4

### 6.3 Calculation Logic
- `CategoryProgress = min(100, (CompletedCategoryCredits / RequiredCategoryCredits) * 100)`
- `MajorTotal = Sum of all credits assigned to major`
- `GPA = Weighted average of grades (where provided)`

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
- `starred`: Boolean (Default: false, for Resume)

### 7.2 User Entity
- `id`: UUID
- `name`: String
- `email`: String (Unique)
- `majors`: Enum Array `[Economics, Business]`

---

## 8. System State & Persistence
- **Primary Storage**: `localStorage`.
- **Keys**: `huji_degree_courses`, `huji_user_name`.
- **Initialization**: Hydrate application state from storage on mount.

---

## 9. UX Behavior & System Feedback
- **Directionality**: 
    - **RTL**: Dashboard, Stats, Courses (Hebrew).
    - **LTR**: Resume Builder (English).
- **Visuals**: Color-coded progress bars (Red/Orange/Green).
- **Feedback**: Instant updates to stats when a course is added/edited/deleted.

---

**STATUS: READY FOR APPROVAL (v1.3)**
