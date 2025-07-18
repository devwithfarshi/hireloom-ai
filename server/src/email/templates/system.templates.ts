import { getBaseTemplate } from './base.template';

interface SystemMaintenanceDetails {
  startTime: string;
  endTime: string;
  description: string;
  affectedServices: string[];
}

interface SecurityAlertDetails {
  alertType: 'login' | 'password_change' | 'suspicious_activity' | 'data_breach';
  timestamp: string;
  location?: string;
  ipAddress?: string;
  userAgent?: string;
}

export const getSystemMaintenanceTemplate = (
  userName: string,
  maintenanceDetails: SystemMaintenanceDetails
) => {
  const { startTime, endTime, description, affectedServices } = maintenanceDetails;
  
  const content = `
    <div class="header">
      <h1>Scheduled Maintenance</h1>
      <p>Important system update notification</p>
    </div>
    <div class="content">
      <h2>Hello ${userName}!</h2>
      <p>We wanted to inform you about scheduled maintenance that will affect our ATS Platform services.</p>
      
      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 6px;">
        <h3 style="margin: 0 0 12px 0; color: #92400e;">Maintenance Schedule</h3>
        <p style="margin: 4px 0; color: #92400e;"><strong>Start Time:</strong> ${startTime}</p>
        <p style="margin: 4px 0; color: #92400e;"><strong>End Time:</strong> ${endTime}</p>
        <p style="margin: 4px 0; color: #92400e;"><strong>Duration:</strong> Approximately ${Math.ceil((new Date(endTime).getTime() - new Date(startTime).getTime()) / (1000 * 60 * 60))} hours</p>
      </div>
      
      <h3>What's being updated:</h3>
      <p>${description}</p>
      
      <h3>Affected Services:</h3>
      <ul style="margin: 16px 0; padding-left: 20px;">
        ${affectedServices.map(service => `<li>${service}</li>`).join('')}
      </ul>
      
      <h3>What to expect:</h3>
      <ul style="margin: 16px 0; padding-left: 20px;">
        <li>The platform may be temporarily unavailable during maintenance</li>
        <li>Any ongoing processes will be safely paused and resumed</li>
        <li>Email notifications may be delayed</li>
        <li>Data integrity will be maintained throughout the process</li>
      </ul>
      
      <div style="background-color: #dcfce7; border-left: 4px solid #16a34a; padding: 16px; margin: 24px 0; border-radius: 6px;">
        <p style="margin: 0; color: #166534;"><strong>Good News:</strong> After the maintenance, you'll enjoy improved performance, new features, and enhanced security.</p>
      </div>
      
      <h3>What you should do:</h3>
      <ul style="margin: 16px 0; padding-left: 20px;">
        <li>Save any work in progress before the maintenance window</li>
        <li>Plan any urgent activities outside the maintenance period</li>
        <li>Check our status page for real-time updates</li>
      </ul>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="${process.env.CLIENT_URL}/status" class="button">Check System Status</a>
      </div>
      
      <p>We apologize for any inconvenience and appreciate your patience as we work to improve our platform.</p>
      
      <p>Best regards,<br>The ATS Platform Team</p>
    </div>
  `;
  
  return getBaseTemplate(content, 'Scheduled Maintenance Notification');
};

export const getSecurityAlertTemplate = (
  userName: string,
  userEmail: string,
  alertDetails: SecurityAlertDetails
) => {
  const { alertType, timestamp, location, ipAddress, userAgent } = alertDetails;
  
  const alertMessages = {
    login: 'New login detected',
    password_change: 'Password changed successfully',
    suspicious_activity: 'Suspicious activity detected',
    data_breach: 'Security incident notification'
  };
  
  const alertColors = {
    login: { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' },
    password_change: { bg: '#dcfce7', border: '#16a34a', text: '#166534' },
    suspicious_activity: { bg: '#fee2e2', border: '#ef4444', text: '#991b1b' },
    data_breach: { bg: '#fee2e2', border: '#ef4444', text: '#991b1b' }
  };
  
  const colors = alertColors[alertType];
  
  const content = `
    <div class="header">
      <h1>Security Alert</h1>
      <p>${alertMessages[alertType]}</p>
    </div>
    <div class="content">
      <h2>Hello ${userName}!</h2>
      <p>We're writing to inform you about security-related activity on your ATS Platform account (${userEmail}).</p>
      
      <div style="background-color: ${colors.bg}; border-left: 4px solid ${colors.border}; padding: 16px; margin: 24px 0; border-radius: 6px;">
        <h3 style="margin: 0 0 12px 0; color: ${colors.text};">Security Event Details</h3>
        <p style="margin: 4px 0; color: ${colors.text};"><strong>Event:</strong> ${alertMessages[alertType]}</p>
        <p style="margin: 4px 0; color: ${colors.text};"><strong>Time:</strong> ${timestamp}</p>
        ${location ? `<p style="margin: 4px 0; color: ${colors.text};"><strong>Location:</strong> ${location}</p>` : ''}
        ${ipAddress ? `<p style="margin: 4px 0; color: ${colors.text};"><strong>IP Address:</strong> ${ipAddress}</p>` : ''}
        ${userAgent ? `<p style="margin: 4px 0; color: ${colors.text};"><strong>Device:</strong> ${userAgent}</p>` : ''}
      </div>
      
      ${alertType === 'login' ? `
        <h3>Was this you?</h3>
        <p>If you recognize this activity, no further action is needed. If you don't recognize this login:</p>
        <ul style="margin: 16px 0; padding-left: 20px;">
          <li>Change your password immediately</li>
          <li>Review your account activity</li>
          <li>Enable two-factor authentication if not already active</li>
          <li>Contact our support team if you need assistance</li>
        </ul>
      ` : ''}
      
      ${alertType === 'password_change' ? `
        <h3>Password Changed Successfully</h3>
        <p>Your password has been successfully updated. If you didn't make this change:</p>
        <ul style="margin: 16px 0; padding-left: 20px;">
          <li>Contact our support team immediately</li>
          <li>Review your account for any unauthorized changes</li>
          <li>Consider enabling additional security measures</li>
        </ul>
      ` : ''}
      
      ${alertType === 'suspicious_activity' ? `
        <h3>Suspicious Activity Detected</h3>
        <p>Our security systems have detected unusual activity on your account. For your protection:</p>
        <ul style="margin: 16px 0; padding-left: 20px;">
          <li>We've temporarily limited some account functions</li>
          <li>Please verify your identity by logging in</li>
          <li>Review your recent account activity</li>
          <li>Change your password as a precaution</li>
        </ul>
      ` : ''}
      
      ${alertType === 'data_breach' ? `
        <h3>Important Security Notice</h3>
        <p>We're writing to inform you of a security incident that may have affected your account. Here's what happened and what we're doing:</p>
        <ul style="margin: 16px 0; padding-left: 20px;">
          <li>We detected and stopped unauthorized access attempts</li>
          <li>No sensitive data appears to have been compromised</li>
          <li>We've implemented additional security measures</li>
          <li>We recommend changing your password as a precaution</li>
        </ul>
      ` : ''}
      
      <div style="text-align: center; margin: 32px 0;">
        ${alertType === 'login' || alertType === 'suspicious_activity' ? `
          <a href="${process.env.CLIENT_URL}/security" class="button">Review Account Security</a>
          <a href="${process.env.CLIENT_URL}/change-password" class="button button-secondary">Change Password</a>
        ` : ''}
        ${alertType === 'password_change' ? `
          <a href="${process.env.CLIENT_URL}/security" class="button">Review Security Settings</a>
        ` : ''}
        ${alertType === 'data_breach' ? `
          <a href="${process.env.CLIENT_URL}/change-password" class="button">Change Password</a>
          <a href="${process.env.CLIENT_URL}/security" class="button button-secondary">Security Settings</a>
        ` : ''}
      </div>
      
      <div style="background-color: #f8f9fa; padding: 16px; border-radius: 6px; margin: 24px 0;">
        <p style="margin: 0;"><strong>Security Tips:</strong></p>
        <ul style="margin: 8px 0; padding-left: 20px;">
          <li>Use a strong, unique password for your ATS account</li>
          <li>Enable two-factor authentication for added security</li>
          <li>Never share your login credentials</li>
          <li>Log out from shared or public computers</li>
          <li>Keep your contact information up to date</li>
        </ul>
      </div>
      
      <p>If you have any questions or concerns about this security alert, please don't hesitate to contact our support team.</p>
      
      <p>Best regards,<br>The ATS Platform Security Team</p>
    </div>
  `;
  
  return getBaseTemplate(content, `Security Alert - ${alertMessages[alertType]}`);
};

export const getAccountDeactivationTemplate = (
  userName: string,
  reason: string,
  reactivationSteps?: string[]
) => {
  const content = `
    <div class="header">
      <h1>Account Deactivated</h1>
      <p>Your ATS Platform account has been deactivated</p>
    </div>
    <div class="content">
      <h2>Hello ${userName}!</h2>
      <p>We're writing to inform you that your ATS Platform account has been deactivated.</p>
      
      <div style="background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 16px; margin: 24px 0; border-radius: 6px;">
        <h3 style="margin: 0 0 12px 0; color: #991b1b;">Reason for Deactivation</h3>
        <p style="margin: 0; color: #991b1b;">${reason}</p>
      </div>
      
      <h3>What this means:</h3>
      <ul style="margin: 16px 0; padding-left: 20px;">
        <li>You can no longer access your ATS Platform account</li>
        <li>Your job postings (if any) have been removed</li>
        <li>Your applications are no longer visible to recruiters</li>
        <li>You will not receive further notifications</li>
      </ul>
      
      ${reactivationSteps && reactivationSteps.length > 0 ? `
        <h3>How to reactivate your account:</h3>
        <ol style="margin: 16px 0; padding-left: 20px;">
          ${reactivationSteps.map(step => `<li>${step}</li>`).join('')}
        </ol>
        
        <div style="text-align: center; margin: 32px 0;">
          <a href="mailto:support@atsplatform.com?subject=Account Reactivation Request" class="button">Contact Support</a>
        </div>
      ` : `
        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 6px;">
          <p style="margin: 0; color: #92400e;">If you believe this deactivation was made in error, please contact our support team for assistance.</p>
        </div>
      `}
      
      <h3>Data Retention:</h3>
      <p>Your account data will be retained for 30 days in case you wish to reactivate your account. After this period, your data will be permanently deleted in accordance with our privacy policy.</p>
      
      <div style="background-color: #f8f9fa; padding: 16px; border-radius: 6px; margin: 24px 0;">
        <p style="margin: 0;"><strong>Need Help?</strong> If you have questions about this deactivation or need assistance, please contact our support team at support@atsplatform.com</p>
      </div>
      
      <p>Thank you for using ATS Platform.</p>
      
      <p>Best regards,<br>The ATS Platform Team</p>
    </div>
  `;
  
  return getBaseTemplate(content, 'Account Deactivated - ATS Platform');
};

export const getDataExportTemplate = (
  userName: string,
  exportType: string,
  downloadUrl: string,
  expirationDate: string
) => {
  const content = `
    <div class="header">
      <h1>Data Export Ready</h1>
      <p>Your requested data export is available for download</p>
    </div>
    <div class="content">
      <h2>Hello ${userName}!</h2>
      <p>Your requested data export has been processed and is now ready for download.</p>
      
      <div style="background-color: #dcfce7; border-left: 4px solid #16a34a; padding: 16px; margin: 24px 0; border-radius: 6px;">
        <h3 style="margin: 0 0 12px 0; color: #166534;">Export Details</h3>
        <p style="margin: 4px 0; color: #166534;"><strong>Export Type:</strong> ${exportType}</p>
        <p style="margin: 4px 0; color: #166534;"><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
        <p style="margin: 4px 0; color: #166534;"><strong>Expires:</strong> ${expirationDate}</p>
        <p style="margin: 4px 0; color: #166534;"><strong>Format:</strong> ZIP file containing JSON and CSV files</p>
      </div>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="${downloadUrl}" class="button">Download Your Data</a>
      </div>
      
      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 6px;">
        <p style="margin: 0; color: #92400e;"><strong>Important:</strong> This download link will expire on ${expirationDate} for security reasons. Please download your data before this date.</p>
      </div>
      
      <h3>What's included in your export:</h3>
      <ul style="margin: 16px 0; padding-left: 20px;">
        <li>Profile information and account details</li>
        <li>Application history and status updates</li>
        <li>Job posting history (for recruiters)</li>
        <li>Communication logs and notifications</li>
        <li>Resume and document metadata</li>
      </ul>
      
      <h3>Data Security:</h3>
      <ul style="margin: 16px 0; padding-left: 20px;">
        <li>The download link is unique and secure</li>
        <li>Data is encrypted during transfer</li>
        <li>The file will be automatically deleted after expiration</li>
        <li>Only you have access to this download link</li>
      </ul>
      
      <div style="background-color: #f8f9fa; padding: 16px; border-radius: 6px; margin: 24px 0;">
        <p style="margin: 0;"><strong>Need Help?</strong> If you have trouble downloading your data or have questions about the export format, please contact our support team.</p>
      </div>
      
      <p>Thank you for using ATS Platform.</p>
      
      <p>Best regards,<br>The ATS Platform Team</p>
    </div>
  `;
  
  return getBaseTemplate(content, 'Data Export Ready - ATS Platform');
};