export type Major = 'Economics' | 'Business';

export type EconomicsCategory = 
  | 'Mandatory' 
  | 'Core' 
  | 'Elective' 
  | 'Research' 
  | 'Avnei Pina';

export type BusinessCategory = 
  | 'Mandatory' 
  | 'Elective' 
  | 'Mandatory Elective' 
  | 'Research' 
  | 'Avnei Pina';

export interface Course {
  id: string;
  name: string;
  number: string;
  credits: number;
  major: Major | 'Shared';
  category: EconomicsCategory | BusinessCategory;
  year: string;
  semester: 'א' | 'ב' | 'קיץ';
  grade?: number;
  starred?: boolean;
}

export interface ResumeData {
  fullName: string;
  email: string;
  phone?: string;
  linkedIn?: string;
  education: {
    institution: string;
    degree: string;
    startYear: string;
    endYear: string;
    gpa?: number;
  };
  skills: string[];
  featuredCourses: Course[];
}

export interface DegreeRequirement {
  total: number;
  categories: {
    name: string;
    key: string;
    required: number;
  }[];
}

export const ECONOMICS_REQUIREMENTS: DegreeRequirement = {
  total: 64,
  categories: [
    { name: 'חובה', key: 'Mandatory', required: 40 },
    { name: 'ליבה', key: 'Core', required: 8 },
    { name: 'בחירה', key: 'Elective', required: 8 },
    { name: 'סמינר/מחקר', key: 'Research', required: 4 },
    { name: 'אבני פינה', key: 'Avnei Pina', required: 4 },
  ]
};

export const BUSINESS_REQUIREMENTS: DegreeRequirement = {
  total: 60,
  categories: [
    { name: 'חובה', key: 'Mandatory', required: 27 },
    { name: 'בחירה', key: 'Elective', required: 17 },
    { name: 'בחירת חובה', key: 'Mandatory Elective', required: 8 },
    { name: 'סמינר/מחקר', key: 'Research', required: 4 },
    { name: 'אבני פינה', key: 'Avnei Pina', required: 4 },
  ]
};
