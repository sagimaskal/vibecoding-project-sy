import requirementRules from '../data/requirementRules.json';
import { Course } from '../lib/types';

/**
 * Result of a requirement evaluation
 */
export interface EvaluationResult {
  canMoveToYearB: boolean;
  status: 'regular_pass' | 'conditional_pass' | 'not_passed';
  canMoveToYearC: boolean;
  missingRequirements: string[];
  failedRequirements: string[];
  conditionalRequirements: string[];
  eligibleForMicro: boolean;
  eligibleForEconometrics: boolean;
  notes: string[];
}

/**
 * Evaluates student progress against academic rules
 * @param studentCourses Array of courses completed by the student
 */
export function evaluateRequirements(studentCourses: any[]): EvaluationResult {
  const result: EvaluationResult = {
    canMoveToYearB: false,
    status: 'not_passed',
    canMoveToYearC: false,
    missingRequirements: [],
    failedRequirements: [],
    conditionalRequirements: [],
    eligibleForMicro: false,
    eligibleForEconometrics: false,
    notes: []
  };

  const rules = requirementRules.transitions;
  const courseMap = new Map(studentCourses.map(c => [c.number || c.course_id, c]));

  // --- 1. Year A to Year B: Regular Pass Evaluation ---
  let regularPassGroups = 0;
  const totalRegularGroups = rules.YearAtoB.regularPass.groups.length;

  for (const group of rules.YearAtoB.regularPass.groups) {
    const evaluation = evaluateGroup(group, courseMap);
    if (evaluation.passed) {
      regularPassGroups++;
    } else {
      if (evaluation.failed) result.failedRequirements.push(group.name);
      else result.missingRequirements.push(group.name);
    }
  }

  const isRegularPass = regularPassGroups === totalRegularGroups;

  // --- 2. Year A to Year B: Conditional Pass Evaluation ---
  let isConditionalPass = false;
  if (!isRegularPass) {
    const econCond = rules.YearAtoB.conditionalPass.economics;
    const econEvaluated = evaluateConditionalEcon(econCond, courseMap);
    
    const mathCond = rules.YearAtoB.conditionalPass.mathStats;
    const mathEvaluated = evaluateConditionalMath(mathCond, courseMap);

    if (econEvaluated.passed && mathEvaluated.passed) {
      isConditionalPass = true;
      result.status = 'conditional_pass';
      result.notes.push(rules.YearAtoB.conditionalPass.notes);
    }

    // Eligibility for Micro (needs at least one conditional criteria)
    if (econEvaluated.passed || mathEvaluated.passed) {
      result.eligibleForMicro = true;
    }
  } else {
    result.status = 'regular_pass';
    result.canMoveToYearB = true;
    result.eligibleForMicro = true;
  }

  if (isConditionalPass) result.canMoveToYearB = true;

  // --- 3. Econometrics Eligibility ---
  const statsA = courseMap.get("57340");
  const statsB = courseMap.get("57341") || courseMap.get("52220");
  if (isPassed(statsA, 60) && isPassed(statsB, 60)) {
    result.eligibleForEconometrics = true;
  }

  // --- 4. Year B to Year C Transition ---
  // Must have passed ALL Year A mandatory courses (Regular Pass)
  if (isRegularPass) {
    // In a real system, we'd also check if they are in Year B and finished Year B courses.
    // For now, based on prompt: "Registration allowed if passed all mandatory Year A courses".
    result.canMoveToYearC = true; 
  }

  return result;
}

/**
 * Helper to check if a course is passed with a minimum grade
 */
function isPassed(course: any, minGrade: number): boolean {
  if (!course) return false;
  
  // 1. If status is provided, follow it strictly
  if (course.status) {
    if (course.status === 'not_completed') return false;
    if (course.status === 'completed_without_grade') return true;
    if (course.status === 'completed_with_grade') {
        return (course.grade !== undefined && course.grade !== null) ? course.grade >= minGrade : false;
    }
  }

  // 2. Fallback for older data or missing status
  if (course.grade === undefined || course.grade === null) return true; 
  return course.grade >= minGrade;
}

/**
 * Evaluates a requirement group (e.g., Calculus) including alternatives
 */
function evaluateGroup(group: any, courseMap: Map<string, any>) {
  // Check primary required courses
  if (group.courses) {
    const grades = group.courses.map(c => courseMap.get(c.courseId)?.grade);
    const allPresent = group.courses.every(c => courseMap.has(c.courseId));
    const allPassed = group.courses.every(c => isPassed(courseMap.get(c.courseId), c.minGrade));
    
    let avgPassed = true;
    if (group.averageRequirement) {
        const validGrades = grades.filter(g => g !== undefined && g !== null);
        if (validGrades.length === grades.length) {
            const avg = validGrades.reduce((a, b) => a + b, 0) / validGrades.length;
            avgPassed = avg >= group.averageRequirement;
        } else {
            avgPassed = true; // Assume pass if grade missing but marked completed
        }
    }

    if (allPresent && allPassed && avgPassed) return { passed: true };
  }

  if (group.required) {
    const allPassed = group.required.every(c => isPassed(courseMap.get(c.courseId), c.minGrade));
    const allPresent = group.required.every(c => courseMap.has(c.courseId));
    if (allPresent && allPassed) return { passed: true };
  }

  // Check alternatives
  if (group.alternatives) {
    for (const alt of group.alternatives) {
      const altPassed = alt.courses.every(c => isPassed(courseMap.get(c.courseId), c.minGrade));
      const altPresent = alt.courses.every(c => courseMap.has(c.courseId));
      if (altPresent && altPassed) return { passed: true };
    }
  }

  return { passed: false, failed: false }; // Simplified failure detection
}

function evaluateConditionalEcon(cond: any, courseMap: Map<string, any>) {
  const courses = cond.courses.map(id => courseMap.get(id));
  if (courses.some(c => !c)) return { passed: false };
  
  const allAboveMin = courses.every(c => isPassed(c, cond.minGradePerCourse));
  const grades = courses.map(c => c.grade).filter(g => g !== undefined && g !== null);
  
  let avgPassed = true;
  if (grades.length === courses.length) {
    const avg = grades.reduce((a, b) => a + b, 0) / grades.length;
    avgPassed = avg >= cond.minAverage;
  }

  return { passed: allAboveMin && avgPassed };
}

function evaluateConditionalMath(cond: any, courseMap: Map<string, any>) {
  const passedCount = cond.pool.filter(id => isPassed(courseMap.get(id), cond.minGrade)).length;
  return { passed: passedCount >= cond.requiredCount };
}
