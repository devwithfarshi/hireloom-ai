import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

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
}