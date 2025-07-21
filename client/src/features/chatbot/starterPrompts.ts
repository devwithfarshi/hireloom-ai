import { StarterPrompt } from './types';

export const starterPrompts: StarterPrompt[] = [
  {
    id: 'create-job',
    title: 'Create a Job',
    description: 'Help me create a new job posting',
    prompt: 'I want to create a new job posting. Can you guide me through the process and help me write an effective job description?',
    category: 'job',
  },
  {
    id: 'update-job',
    title: 'Update an Existing Job',
    description: 'Modify or improve a job posting',
    prompt: 'I need to update an existing job posting. Can you help me identify what changes might improve it and guide me through the update process?',
    category: 'job',
  },
  {
    id: 'get-applicants',
    title: 'Get Applicants for a Job',
    description: 'View and analyze job applicants',
    prompt: 'I want to review applicants for one of my job postings. Can you help me access the applicant list and provide insights on candidate evaluation?',
    category: 'application',
  },
  {
    id: 'improve-job-description',
    title: 'Improve Job Description',
    description: 'Enhance job posting effectiveness',
    prompt: 'I have a job posting that\'s not getting enough quality applicants. Can you help me analyze and improve the job description to attract better candidates?',
    category: 'job',
  },
  {
    id: 'candidate-screening',
    title: 'Candidate Screening Tips',
    description: 'Learn effective screening strategies',
    prompt: 'What are the best practices for screening candidates effectively? Can you provide tips on evaluating resumes and conducting initial assessments?',
    category: 'application',
  },
  {
    id: 'hiring-analytics',
    title: 'Hiring Analytics',
    description: 'Understand recruitment metrics',
    prompt: 'I want to understand my hiring performance better. Can you help me analyze recruitment metrics and identify areas for improvement?',
    category: 'general',
  },
  {
    id: 'interview-questions',
    title: 'Interview Questions',
    description: 'Generate effective interview questions',
    prompt: 'I need help creating effective interview questions for a specific role. Can you suggest relevant questions based on the job requirements?',
    category: 'application',
  },
  {
    id: 'onboarding-process',
    title: 'Onboarding Process',
    description: 'Optimize new hire onboarding',
    prompt: 'How can I improve my onboarding process for new hires? What are the key elements of an effective onboarding experience?',
    category: 'general',
  },
];

export const getStarterPromptsByCategory = (category?: string) => {
  if (!category) return starterPrompts;
  return starterPrompts.filter(prompt => prompt.category === category);
};