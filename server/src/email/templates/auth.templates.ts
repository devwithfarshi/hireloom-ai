import { getBaseTemplate } from './base.template';

export const getVerificationEmailTemplate = (verificationUrl: string, userEmail: string) => {
  const content = `
    <div class="header">
      <h1>Welcome to HireLoom!</h1>
      <p>Please verify your email address to get started</p>
    </div>
    <div class="content">
      <h2>Hi there!</h2>
      <p>Thank you for signing up for HireLoom. To complete your registration and start using our platform, please verify your email address by clicking the button below.</p>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="${verificationUrl}" class="button">Verify Email Address</a>
      </div>
      
      <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
      <p style="word-break: break-all; background-color: #f8f9fa; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 14px; margin: 16px 0;">${verificationUrl}</p>
      
      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 6px;">
        <p style="margin: 0; color: #92400e;"><strong>Important:</strong> This verification link will expire in 24 hours for security reasons.</p>
      </div>
      
      <p>If you didn't create an account with us, please ignore this email.</p>
      
      <p>Best regards,<br>The HireLoom Team</p>
    </div>
  `;
  
  return getBaseTemplate(content, 'Verify Your Email - HireLoom');
};

export const getPasswordResetEmailTemplate = (resetUrl: string, userEmail: string) => {
  const content = `
    <div class="header">
      <h1>Password Reset Request</h1>
      <p>Reset your password securely</p>
    </div>
    <div class="content">
      <h2>Password Reset</h2>
      <p>We received a request to reset the password for your HireLoom account associated with <strong>${userEmail}</strong>.</p>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="${resetUrl}" class="button">Reset Password</a>
      </div>
      
      <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
      <p style="word-break: break-all; background-color: #f8f9fa; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 14px; margin: 16px 0;">${resetUrl}</p>
      
      <div style="background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 16px; margin: 24px 0; border-radius: 6px;">
        <p style="margin: 0; color: #991b1b;"><strong>Security Notice:</strong> This password reset link will expire in 1 hour. If you didn't request this reset, please ignore this email and your password will remain unchanged.</p>
      </div>
      
      <p>For your security, we recommend:</p>
      <ul style="margin: 16px 0; padding-left: 20px;">
        <li>Using a strong, unique password</li>
        <li>Enabling two-factor authentication if available</li>
        <li>Not sharing your login credentials</li>
      </ul>
      
      <p>If you continue to have problems, please contact our support team.</p>
      
      <p>Best regards,<br>The HireLoom Team</p>
    </div>
  `;
  
  return getBaseTemplate(content, 'Password Reset - HireLoom');
};

export const getWelcomeEmailTemplate = (userName: string, userRole: string) => {
  const content = `
    <div class="header">
      <h1>Welcome to HireLoom!</h1>
      <p>Your account has been successfully verified</p>
    </div>
    <div class="content">
      <h2>Hello ${userName}!</h2>
      <p>Congratulations! Your email has been verified and your HireLoom account is now active.</p>
      
      <div style="background-color: #dcfce7; border-left: 4px solid #16a34a; padding: 16px; margin: 24px 0; border-radius: 6px;">
        <p style="margin: 0; color: #166534;"><strong>Account Type:</strong> ${userRole === 'RECRUITER' ? 'Recruiter' : 'Candidate'}</p>
      </div>
      
      ${userRole === 'RECRUITER' ? `
        <h3>As a Recruiter, you can:</h3>
        <ul style="margin: 16px 0; padding-left: 20px;">
          <li>Post and manage job openings</li>
          <li>Review and score candidate applications</li>
          <li>Manage your company profile</li>
          <li>Track application statuses</li>
          <li>Communicate with candidates</li>
        </ul>
      ` : `
        <h3>As a Candidate, you can:</h3>
        <ul style="margin: 16px 0; padding-left: 20px;">
          <li>Browse and apply to job openings</li>
          <li>Upload and manage your resume</li>
          <li>Track your application statuses</li>
          <li>Update your candidate profile</li>
          <li>Receive notifications about your applications</li>
        </ul>
      `}
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="${process.env.CLIENT_URL}/dashboard" class="button">Go to Dashboard</a>
      </div>
      
      <p>If you have any questions or need assistance getting started, don't hesitate to reach out to our support team.</p>
      
      <p>Welcome aboard!<br>The HireLoom Team</p>
    </div>
  `;
  
  return getBaseTemplate(content, 'Welcome to HireLoom!');
};