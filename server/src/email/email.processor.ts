import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bullmq';
import * as nodemailer from 'nodemailer';
import { EmailPayload } from './email.service';

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
      // In a real application, you would use a template engine like handlebars
      // to render the email template with the context data
      let html = '';

      if (template === 'verification') {
        html = `
          <h1>Verify your email</h1>
          <p>Please click the link below to verify your email:</p>
          <a href="${context.verificationUrl}">Verify Email</a>
        `;
      } else if (template === 'reset-password') {
        html = `
          <h1>Reset your password</h1>
          <p>Please click the link below to reset your password:</p>
          <a href="${context.resetUrl}">Reset Password</a>
        `;
      } else {
        html = `<p>Default email template</p>`;
      }

      const mailOptions = {
        from: this.configService.get('MAIL_USER'),
        to,
        subject,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.debug(`Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
      throw error;
    }
  }
}
