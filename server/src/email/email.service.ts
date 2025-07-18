import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import {
  ApplicationDetails,
  CandidateDetails,
  InterviewDetails,
  JobDetails,
  SecurityAlertDetails,
  SystemMaintenanceDetails
} from './templates';

export interface EmailPayload {
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
}

@Injectable()
export class EmailService {
  constructor(
    @InjectQueue('email') private readonly emailQueue: Queue,
    private readonly configService: ConfigService,
  ) {}

  async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${this.configService.get(
      'CLIENT_URL',
    )}/verify-email?token=${token}`;

    await this.emailQueue.add('verification-email', {
      to: email,
      subject: 'Verify your email',
      template: 'verification',
      context: {
        verificationUrl,
      },
    });
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${this.configService.get(
      'CLIENT_URL',
    )}/reset-password?token=${token}`;

    await this.emailQueue.add('reset-password-email', {
      to: email,
      subject: 'Reset your password',
      template: 'reset-password',
      context: {
        resetUrl,
      },
    });
  }

  async sendEmail(payload: EmailPayload) {
    await this.emailQueue.add('send-email', payload);
  }

  // Welcome email after successful verification
  async sendWelcomeEmail(email: string, userName: string, userRole: string) {
    await this.emailQueue.add('welcome-email', {
      to: email,
      subject: 'Welcome to ATS Platform!',
      template: 'welcome',
      context: {
        userName,
        userRole,
      },
    });
  }

  // Application status update notifications
  async sendApplicationStatusUpdate(
    candidateEmail: string,
    candidateName: string,
    application: ApplicationDetails
  ) {
    await this.emailQueue.add('application-status-update', {
      to: candidateEmail,
      subject: `Application Update - ${application.job.title}`,
      template: 'application-status-update',
      context: {
        candidateName,
        application,
      },
    });
  }

  // Application confirmation for candidates
  async sendApplicationConfirmation(
    candidateEmail: string,
    candidateName: string,
    job: JobDetails,
    applicationId: string
  ) {
    await this.emailQueue.add('application-confirmation', {
      to: candidateEmail,
      subject: `Application Received - ${job.title}`,
      template: 'application-confirmation',
      context: {
        candidateName,
        job,
        applicationId,
      },
    });
  }

  // Interview invitation
  async sendInterviewInvitation(
    candidateEmail: string,
    candidateName: string,
    job: JobDetails,
    interviewDetails: InterviewDetails
  ) {
    await this.emailQueue.add('interview-invitation', {
      to: candidateEmail,
      subject: `Interview Invitation - ${job.title}`,
      template: 'interview-invitation',
      context: {
        candidateName,
        job,
        interviewDetails,
      },
    });
  }

  // New job posting confirmation for recruiters
  async sendJobPostingConfirmation(
    recruiterEmail: string,
    recruiterName: string,
    job: JobDetails
  ) {
    await this.emailQueue.add('job-posting-confirmation', {
      to: recruiterEmail,
      subject: `Job Posted Successfully - ${job.title}`,
      template: 'job-posting-confirmation',
      context: {
        recruiterName,
        job,
      },
    });
  }

  // New application notification for recruiters
  async sendNewApplicationNotification(
    recruiterEmail: string,
    recruiterName: string,
    job: JobDetails,
    candidate: CandidateDetails,
    applicationId: string
  ) {
    await this.emailQueue.add('new-application-notification', {
      to: recruiterEmail,
      subject: `New Application - ${job.title}`,
      template: 'new-application-notification',
      context: {
        recruiterName,
        job,
        candidate,
        applicationId,
      },
    });
  }

  // Job match notifications for candidates
  async sendJobMatchNotification(
    candidateEmail: string,
    candidateName: string,
    jobs: JobDetails[],
    matchScore: number
  ) {
    await this.emailQueue.add('job-match-notification', {
      to: candidateEmail,
      subject: `${jobs.length} New Job Match${jobs.length > 1 ? 'es' : ''} Found`,
      template: 'job-match-notification',
      context: {
        candidateName,
        jobs,
        matchScore,
      },
    });
  }

  // Job closing reminder for recruiters
  async sendJobClosingReminder(
    recruiterEmail: string,
    recruiterName: string,
    job: JobDetails,
    applicationsCount: number,
    daysUntilClose: number
  ) {
    await this.emailQueue.add('job-closing-reminder', {
      to: recruiterEmail,
      subject: `Job Closing Soon - ${job.title}`,
      template: 'job-closing-reminder',
      context: {
        recruiterName,
        job,
        applicationsCount,
        daysUntilClose,
      },
    });
  }

  // System maintenance notifications
  async sendSystemMaintenanceNotification(
    userEmail: string,
    userName: string,
    maintenanceDetails: SystemMaintenanceDetails
  ) {
    await this.emailQueue.add('system-maintenance', {
      to: userEmail,
      subject: 'Scheduled Maintenance Notification',
      template: 'system-maintenance',
      context: {
        userName,
        maintenanceDetails,
      },
    });
  }

  // Security alerts
  async sendSecurityAlert(
    userEmail: string,
    userName: string,
    alertDetails: SecurityAlertDetails
  ) {
    const alertMessages = {
      login: 'New Login Detected',
      password_change: 'Password Changed Successfully',
      suspicious_activity: 'Suspicious Activity Detected',
      data_breach: 'Security Incident Notification'
    };

    await this.emailQueue.add('security-alert', {
      to: userEmail,
      subject: `Security Alert - ${alertMessages[alertDetails.alertType]}`,
      template: 'security-alert',
      context: {
        userName,
        userEmail,
        alertDetails,
      },
    });
  }

  // Account deactivation notification
  async sendAccountDeactivationNotification(
    userEmail: string,
    userName: string,
    reason: string,
    reactivationSteps?: string[]
  ) {
    await this.emailQueue.add('account-deactivation', {
      to: userEmail,
      subject: 'Account Deactivated - ATS Platform',
      template: 'account-deactivation',
      context: {
        userName,
        reason,
        reactivationSteps,
      },
    });
  }

  // Data export notification
  async sendDataExportNotification(
    userEmail: string,
    userName: string,
    exportType: string,
    downloadUrl: string,
    expirationDate: string
  ) {
    await this.emailQueue.add('data-export', {
      to: userEmail,
      subject: 'Data Export Ready - ATS Platform',
      template: 'data-export',
      context: {
        userName,
        exportType,
        downloadUrl,
        expirationDate,
      },
    });
  }
}