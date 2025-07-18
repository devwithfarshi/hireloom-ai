// Authentication Templates
export {
  getVerificationEmailTemplate,
  getPasswordResetEmailTemplate,
  getWelcomeEmailTemplate
} from './auth.templates';

// Application Templates
export {
  getApplicationStatusUpdateTemplate,
  getApplicationConfirmationTemplate,
  getInterviewInvitationTemplate
} from './application.templates';

// Job Templates
export {
  getNewJobPostingTemplate,
  getNewApplicationNotificationTemplate,
  getJobMatchNotificationTemplate,
  getJobClosingReminderTemplate
} from './job.templates';

// System Templates
export {
  getSystemMaintenanceTemplate,
  getSecurityAlertTemplate,
  getAccountDeactivationTemplate,
  getDataExportTemplate
} from './system.templates';

// Base Template
export { getBaseTemplate } from './base.template';

// Template Types
export interface EmailTemplateContext {
  [key: string]: any;
}

export interface JobDetails {
  id: string;
  title: string;
  company: string;
  location: string;
  employmentType: string;
  description: string;
  experience: number;
  tags: string[];
  isRemote: boolean;
}

export interface ApplicationDetails {
  id: string;
  status: string;
  score?: number;
  notes?: string;
  job: JobDetails;
}

export interface CandidateDetails {
  name: string;
  email: string;
  experience: number;
  skills: string[];
  location: string;
}

export interface InterviewDetails {
  date: string;
  time: string;
  type: 'phone' | 'video' | 'in-person';
  location?: string;
  meetingLink?: string;
  interviewer: string;
  duration: string;
}

export interface SystemMaintenanceDetails {
  startTime: string;
  endTime: string;
  description: string;
  affectedServices: string[];
}

export interface SecurityAlertDetails {
  alertType: 'login' | 'password_change' | 'suspicious_activity' | 'data_breach';
  timestamp: string;
  location?: string;
  ipAddress?: string;
  userAgent?: string;
}