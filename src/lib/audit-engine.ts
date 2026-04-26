import { Degree, RequirementCategory, Course, UserCourse } from "@prisma/client";

export type AuditReport = {
  degreeName: string;
  totalCreditsRequired: number;
  totalCreditsCompleted: number;
  categories: CategoryProgress[];
  isGraduationReady: boolean;
};

export type CategoryProgress = {
  id: string;
  name: string;
  requiredCredits: number;
  completedCredits: number;
  isComplete: boolean;
  missingMandatoryCourses: string[]; // Codes of courses that must be taken
};

/**
 * Core logic for auditing a degree.
 * This function handles the allocation of courses to requirement "buckets".
 */
export function auditDegree(
  degree: Degree & { 
    categories: (RequirementCategory & { 
      courses: Course[] 
    })[] 
  },
  transcript: UserCourse[]
): AuditReport {
  let totalCreditsCompleted = 0;
  const categoriesProgress: CategoryProgress[] = [];
  
  // Track which courses from transcript are "used" to avoid double counting.
  // In most universities, a course can only satisfy one requirement.
  const usedCourseCodes = new Set<string>();

  // Sort categories by priority: Mandatory first, then more specific pools.
  const sortedCategories = [...degree.categories].sort((a, b) => {
    const aMandatory = a.name.toLowerCase().includes("mandatory");
    const bMandatory = b.name.toLowerCase().includes("mandatory");
    if (aMandatory && !bMandatory) return -1;
    if (!aMandatory && bMandatory) return 1;
    return 0;
  });

  for (const category of sortedCategories) {
    let completedInCat = 0;
    const missingMandatoryCourses: string[] = [];
    const isMandatoryType = category.name.toLowerCase().includes("mandatory");

    if (isMandatoryType) {
      // Mandatory: Check each specific course in the requirement's list
      for (const catCourse of category.courses) {
        const completed = transcript.find(uc => uc.courseCode === catCourse.code);
        if (completed) {
          completedInCat += catCourse.credits;
          usedCourseCodes.add(catCourse.code);
        } else {
          missingMandatoryCourses.push(catCourse.code);
        }
      }
    } else {
      // Elective/Pool: Count unused courses from transcript that belong here
      for (const userCourse of transcript) {
        if (usedCourseCodes.has(userCourse.courseCode)) continue;
        
        const isInCategory = category.courses.some(c => c.code === userCourse.courseCode);
        if (isInCategory) {
          completedInCat += userCourse.credits;
          usedCourseCodes.add(userCourse.courseCode);
        }
      }
    }

    categoriesProgress.push({
      id: category.id,
      name: category.name,
      requiredCredits: category.requiredCredits,
      completedCredits: completedInCat,
      isComplete: completedInCat >= category.requiredCredits && missingMandatoryCourses.length === 0,
      missingMandatoryCourses
    });
  }
  
  // Final sum of all completed credits from all categories
  totalCreditsCompleted = categoriesProgress.reduce((sum, cat) => sum + cat.completedCredits, 0);

  return {
    degreeName: degree.name,
    totalCreditsRequired: degree.totalCredits,
    totalCreditsCompleted,
    categories: categoriesProgress,
    isGraduationReady: totalCreditsCompleted >= degree.totalCredits && 
                      categoriesProgress.every(c => c.isComplete)
  };
}
