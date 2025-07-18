import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bullmq';
import * as nodemailer from 'nodemailer';
import { EmailPayload } from './email.service';
import {
  getVerificationEmailTemplate,
  getPasswordResetEmailTemplate,
  getWelcomeEmailTemplate,
  getApplicationStatusUpdateTemplate,
  getApplicationConfirmationTemplate,
  getInterviewInvitationTemplate,
  getNewJobPostingTemplate,
  getNewApplicationNotificationTemplate,
  getJobMatchNotificationTemplate,
  getJobClosingReminderTemplate,
  getSystemMaintenanceTemplate,
  getSecurityAlertTemplate,
  getAccountDeactivationTemplate,
  getDataExportTemplate
} from './templates';

@Processor('email')
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    super();
    this.initializeTransporter();
  }

  private initializeTransporter() {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT'),
      secure: this.configService.get('MAIL_PORT') === 465,
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASSWORD'),
      },
    });
  }

  async process(job: Job<EmailPayload, any, string>): Promise<any> {
    this.logger.debug(`Processing job ${job.id} of type ${job.name}`);
    const { to, subject, template, context } = job.data;

    try {
      let html = '';

      // Generate HTML based on template type
      switch (template) {
        case 'verification':
          html = getVerificationEmailTemplate(context.verificationUrl, to);
          break;
        
        case 'reset-password':
          html = getPasswordResetEmailTemplate(context.resetUrl, to);
          break;
        
        case 'welcome':
          html = getWelcomeEmailTemplate(context.userName, context.userRole);
          break;
        
        case 'application-status-update':
          html = getApplicationStatusUpdateTemplate(context.candidateName, context.application);
          break;
        
        case 'application-confirmation':
          html = getApplicationConfirmationTemplate(context.candidateName, context.job, context.applicationId);
          break;
        
        case 'interview-invitation':
          html = getInterviewInvitationTemplate(context.candidateName, context.job, context.interviewDetails);
          break;
        
        case 'job-posting-confirmation':
          html = getNewJobPostingTemplate(context.recruiterName, context.job);
          break;
        
        case 'new-application-notification':
          html = getNewApplicationNotificationTemplate(
            context.recruiterName,
            context.job,
            context.candidate,
            context.applicationId
          );
          break;
        
        case 'job-match-notification':
          html = getJobMatchNotificationTemplate(context.candidateName, context.jobs, context.matchScore);
          break;
        
        case 'job-closing-reminder':
          html = getJobClosingReminderTemplate(
            context.recruiterName,
            context.job,
            context.applicationsCount,
            context.daysUntilClose
          );
          break;
        
        case 'system-maintenance':
          html = getSystemMaintenanceTemplate(context.userName, context.maintenanceDetails);
          break;
        
        case 'security-alert':
          html = getSecurityAlertTemplate(context.userName, context.userEmail, context.alertDetails);
          break;
        
        case 'account-deactivation':
          html = getAccountDeactivationTemplate(context.userName, context.reason, context.reactivationSteps);
          break;
        
        case 'data-export':
          html = getDataExportTemplate(
            context.userName,
            context.exportType,
            context.downloadUrl,
            context.expirationDate
          );
          break;
        
        default:
          this.logger.warn(`Unknown email template: ${template}`);
          html = `
             <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
               <h1>HireLoom Notification</h1>
               <p>You have received a notification from HireLoom.</p>
               <p>If you have any questions, please contact our support team.</p>
             </div>
           `;
          break;
      }

      const mailOptions = {
        from: `"HireLoom" <${this.configService.get('MAIL_USER')}>`,
        to,
        subject,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.debug(`Email sent successfully: ${info.messageId} to ${to}`);
      return info;
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
