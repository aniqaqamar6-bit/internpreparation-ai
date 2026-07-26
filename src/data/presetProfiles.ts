import { StudentProfile, CareerGoal } from '../types';

export const SARAH_PERSONA: StudentProfile = {
  name: 'Sarah',
  university: 'Tech State University',
  degree: 'BS Computer Science',
  semester: 'Semester 6',
  careerGoal: 'Artificial Intelligence',
  currentSkills: ['Python', 'Java', 'SQL', 'Git', 'Problem Solving', 'HTML/CSS'],
  experienceLevel: 'Intermediate',
};

export const AVAILABLE_SKILLS = [
  'Python',
  'Java',
  'C++',
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Express.js',
  'SQL',
  'PostgreSQL',
  'MongoDB',
  'Git',
  'GitHub',
  'Machine Learning',
  'Deep Learning',
  'PyTorch',
  'TensorFlow',
  'Data Structures & Algorithms',
  'HTML/CSS',
  'Tailwind CSS',
  'Docker',
  'AWS',
  'Cloud Computing',
  'REST APIs',
  'GraphQL',
  'Cyber Security',
  'Linux',
  'Communication',
  'Problem Solving',
  'Team Collaboration',
  'System Design Basics'
];

export const CAREER_GOALS: { goal: CareerGoal; description: string; coreStack: string[] }[] = [
  {
    goal: 'Artificial Intelligence',
    description: 'Build ML models, Neural Networks, NLP, Computer Vision, and AI applications.',
    coreStack: ['Python', 'Machine Learning', 'PyTorch/TensorFlow', 'Data Structures', 'SQL', 'REST APIs', 'Math/Linear Algebra']
  },
  {
    goal: 'Web Development',
    description: 'Design and deploy modern full-stack web applications and microservices.',
    coreStack: ['JavaScript/TypeScript', 'React', 'Node.js', 'Express', 'SQL/NoSQL', 'Git', 'REST APIs', 'HTML/CSS']
  },
  {
    goal: 'Mobile Development',
    description: 'Develop iOS and Android mobile applications using React Native or Flutter.',
    coreStack: ['React Native / Flutter', 'JavaScript/Dart', 'Mobile UI/UX', 'REST APIs', 'Firebase', 'State Management']
  },
  {
    goal: 'Cyber Security',
    description: 'Secure computer networks, audit code vulnerabilities, and ethical hacking.',
    coreStack: ['Linux', 'Networking Fundamentals', 'Python', 'Security Principles', 'Penetration Testing', 'Cryptography Basics']
  },
  {
    goal: 'Data Science',
    description: 'Analyze complex datasets, extract business insights, and build predictive pipelines.',
    coreStack: ['Python', 'SQL', 'Pandas/NumPy', 'Data Visualization', 'Statistics', 'Machine Learning Basics']
  },
  {
    goal: 'Cloud Computing',
    description: 'Architect, deploy, and scale serverless and containerized cloud applications.',
    coreStack: ['AWS/GCP', 'Docker', 'Kubernetes Basics', 'Linux', 'CI/CD Pipelines', 'Python/Shell Scripting']
  }
];

export const UNIVERSITIES_LIST = [
  'Tech State University',
  'Stanford University',
  'Carnegie Mellon University',
  'MIT',
  'UC Berkeley',
  'Georgia Tech',
  'University of Illinois Urbana-Champaign',
  'University of Texas at Austin',
  'National University of Sciences & Tech',
  'Other / International University'
];

export const SEMESTERS_LIST = [
  'Semester 1',
  'Semester 2',
  'Semester 3',
  'Semester 4',
  'Semester 5',
  'Semester 6',
  'Semester 7',
  'Semester 8',
  'Fresh Graduate'
];
