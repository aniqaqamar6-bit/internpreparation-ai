export type CareerGoal = 
  | 'Artificial Intelligence'
  | 'Web Development'
  | 'Mobile Development'
  | 'Cyber Security'
  | 'Data Science'
  | 'Cloud Computing';

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface StudentProfile {
  name: string;
  university: string;
  degree: string;
  semester: string;
  careerGoal: CareerGoal;
  currentSkills: string[];
  experienceLevel: ExperienceLevel;
}

export interface SuggestedProject {
  title: string;
  description: string;
  techStack: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  whyItMatters: string;
}

export interface ReadinessAnalysis {
  score: number; // 0-100
  readinessLevel: 'Not Ready' | 'Getting There' | 'Almost Ready' | 'Internship Ready';
  summary: string;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  recommendedTechnologies: string[];
  suggestedProjects: SuggestedProject[];
  learningAdvice: string[];
  nextSteps: string[];
}

export interface KeywordMatch {
  keyword: string;
  matched: boolean;
  category: 'Technical' | 'Soft Skills' | 'Tool/Framework';
}

export interface ResumeAnalysis {
  resumeScore: number; // 0-100
  atsFriendlinessScore: number; // 0-100
  overallVerdict: string;
  strengths: string[];
  weaknesses: string[];
  missingInformation: string[];
  improvementSuggestions: string[];
  keywordMatch: KeywordMatch[];
  extractedTextPreview?: string;
}

export interface SkillGapItem {
  skill: string;
  reason: string;
  priority: 'High' | 'Medium' | 'Low';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedHours: string;
  resources: {
    title: string;
    url: string;
    type: 'Documentation' | 'Course' | 'Interactive' | 'Article' | 'YouTube';
  }[];
}

export interface SkillGapReport {
  highPriority: SkillGapItem[];
  mediumPriority: SkillGapItem[];
  lowPriority: SkillGapItem[];
  overallSummary: string;
}

export interface RoadmapWeek {
  weekNumber: number;
  title: string;
  focusArea: string;
  topics: string[];
  miniProject: {
    name: string;
    description: string;
    deliverables: string[];
  };
  practiceTasks: string[];
  milestone: string;
}

export interface LearningRoadmap {
  title: string;
  summary: string;
  targetRole: string;
  weeks: RoadmapWeek[];
}

export interface InterviewMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  feedback?: {
    score: number;
    strengths: string[];
    improvements: string[];
    sampleAnswerSnippet?: string;
  };
}

export type ActiveTab = 
  | 'home'
  | 'assessment'
  | 'dashboard'
  | 'resume'
  | 'skillgap'
  | 'roadmap'
  | 'interview'
  | 'about';
