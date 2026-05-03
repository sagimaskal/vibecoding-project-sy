# Product Requirements Document: HUJI Degree Tracker (Technical Specification)

## 1. Document Control
- **Version**: 1.1
- **Status**: DRAFT - UPDATED, REQUIRES APPROVAL
- **Role**: Single Source of Truth (SSOT)
- **Rules**: 
  - Any change to this document requires explicit approval from the lead developer and product owner.
  - Updates must be versioned sequentially.
  - Conflicts between code and this document are resolved in favor of this document.

---

## 2. Overview & System Purpose
### Problem Statement
Dual-degree students at the Hebrew University face fragmented data across university portals (Mina/HUJI-Net) and static PDF requirement sheets. Manual tracking leads to errors in credit attribution and graduation delays.

### Solution
A centralized, RTL-native portal that applies a deterministic rules engine to user-provided course data to validate degree progress for Economics and Business Administration combinations.

---

## 3. Functional Requirements & Enforceable Logic

### 3.1 Course Management Logic
| Feature | Rule | Validation / Constraint | Failure Scenario |
| :--- | :--- | :--- | :--- |
| **Course Identity** | `Course Number` is the unique identifier. | Must be numeric string. | Different names for same number are blocked. |
| **Duplication** | No two courses can share the same `Course Number`. | System-wide unique constraint per user. | Alert: `"קורס זה כבר הוזן למערכת ולא ניתן לספור אותו פעמיים"` |
| **Attribution** | 1 Course = 1 Major + 1 Category. | Selection restricted to active major categories. | No "unassigned" courses allowed in calculations. |
| **Credit Units** | Credits must be in increments of 1 or 0.5. | `Number > 0`, `Max 20`. | Input rejected if non-numeric or <= 0. |
| **Grade Handling** | Grades are optional (0-100). | `0 <= Grade <= 100` OR `null`. | Input rejected if outside range. |

### 3.2 Academic Rules Engine (Economics + Business)
#### Credits Attribution Engine
1.  **Selection-Based Routing**: A course is attributed to a major based on the `Major` field and a specific `Category` field.
2.  **No Double Counting**: The engine sums credits grouped by `(Major, Category)`. A single course ID can only appear in one group sum.
3.  **Overflow Behavior**: 
    - If `CurrentCategoryCredits > RequiredCategoryCredits`, the category progress bar shows 100%.
    - The excess credits contribute to the **Major Total** but are flagged with a "Core/Elective Overflow" visual indicator.
4.  **Major Totals**:
    - **Economics Total**: Sum of all categories. Target: 64 N.Z.
    - **Business Total**: Sum of all categories. Target: 60 N.Z.

#### Exact Degree Constants
- **Economics (Target 64)**: 
  - Mandatory: 40 | Core: 8 | Elective: 8 | Research: 4 | Avnei Pina: 4.
- **Business (Target 60)**:
  - Mandatory: 27 | Elective: 17 | Mandatory Elective: 8 | Research: 4 | Avnei Pina: 4.

---

## 4. Data Model (Production Ready)

### 4.1 Entities
**User**
- `id`: UUID (Primary Key)
- `name`: String (Non-nullable)
- `email`: String (Unique, Non-nullable)
- `majors`: Enum Array `[Economics, Business]` (Non-nullable)

**Course**
- `id`: UUID (Primary Key)
- `userId`: UUID (Foreign Key -> User.id)
- `name`: String (Max 100 chars)
- `number`: String (Unique per `userId`)
- `credits`: Float (Min 0.5, Max 20)
- `year`: Enum `[א, ב, ג, ד+]`
- `semester`: Enum `[א, ב, קיץ]`
- `major`: Enum `[Economics, Business]`
- `category`: Enum (Specific to Major)
- `grade`: Integer (Range 0-100, Optional)

### 4.2 Constraints
- **Uniqueness**: `(userId, number)` must be unique.
- **Integrity**: `category` must exist within the `major` requirement map.

---

## 5. System State & Persistence

### 5.1 Local Storage Strategy (Current)
- **Key**: `huji_degree_courses` (JSON Stringified Array of Courses).
- **Key**: `huji_user_name` (String).
- **Sync**: Writes occur on every state change (Debounced 300ms).
- **Refresh Behavior**: State hydrated from `localStorage` on `ComponentDidMount`.

### 5.2 Transition to Backend (PostgreSQL)
- **NEEDS DECISION**: Define API endpoints for `POST /courses` and `GET /stats`.
- **Consistency Risk**: Multiple devices (Mobile/Desktop) will cause `localStorage` drift. Sync strategy needed (Timestamp-based "Last Write Wins").

---

## 6. Component Specification

### 6.1 Course Table Component
- **Header**: Year/Sem, Name, ID, Credits, Major/Cat, Grade, Actions.
- **Row States**:
  - `Default`: Display mode.
  - `Editing`: Inline inputs or Modal popup.
  - `Deleting`: Transition opacity to 50% before removal.
- **Empty State**: Show "📂 טרם הוזנו קורסים למערכת" with a large "Add Course" CTA.

### 6.2 Add/Edit Modal
- **Validation Trigger**: `OnSubmit`.
- **Inputs**: 
  - Name: Text.
  - Number: Numeric Text.
  - Credits: Select/Number.
  - Major: Toggle `Economics | Business`.
  - Category: Dynamic dropdown based on Major selection.
  - Grade: Optional number.

---

## 7. UX Behavior & Feedback

| Action | Success Feedback | Error Feedback | Loading State |
| :--- | :--- | :--- | :--- |
| **Add Course** | Row animates in (fade-in); Progress bars update instantly. | Alert box for duplicates. | None (Local-only). |
| **Update Major** | All stats re-calculate; Orphaned courses flagged red. | "Combination not supported" block. | 200ms blur overlay. |
| **Reset Data** | Confirm dialog -> Empty state animation. | None. | 300ms spinner. |
| **Edit Grade** | Visual "Saved" checkmark near field. | Red border if > 100. | Inline indicator. |

---

## 8. User Scenarios

### Scenario 1: Freshman (The "Clean Slate")
- **Action**: User enters for the first time.
- **Behavior**: Home -> Login -> Setup (Econ+Biz).
- **Result**: Portal is empty. Stats show "0/124 N.Z". User adds "Microeconomics" (4 N.Z, Mandatory). Progress bar for Econ-Mandatory moves to 10%.

### Scenario 2: Senior (Near Graduation)
- **Action**: User has 120 N.Z entered. Realizes they assigned "Statistics" to Business but it's needed in Economics.
- **Behavior**: User clicks "Edit" on Statistics. Changes Major to "Economics". 
- **Result**: Business total drops by 4. Economics total increases. System flags "Mandatory Business" as incomplete (Red).

### Scenario 3: Data Correction (The Duplicate)
- **Action**: User forgets they entered "Macroeconomics" (57102) and tries to add it again under a different name "Intro to Macro".
- **Behavior**: User hits "Save".
- **Result**: System blocks save. Alert: `"קורס זה כבר הוזן..."`. Fields remain populated for user to correct the number or cancel.

---

## 9. Future Expansion (Roadmap)
1. **Automated Parser**: Integration with HUJI PDF Transcript upload.
2. **Additional Majors**: Logic maps for CS, Law, Psychology.
3. **Multi-User Sync**: Move `localStorage` to Prisma/PostgreSQL.

---

**STATUS: DRAFT - UPDATED, REQUIRES APPROVAL**
