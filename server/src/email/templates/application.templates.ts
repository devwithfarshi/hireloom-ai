import { getBaseTemplate } from './base.template';

interface JobDetails {
  title: string;
  company: string;
  location: string;
  employmentType: string;
}

interface ApplicationDetails {
  id: string;
  status: string;
  score?: number;
  notes?: string;
  job: JobDetails;
}

const getStatusBadgeClass = (status: string) => {
  const statusMap: Record<string, string> = {
    PENDING: 'status-pending',
    REVIEWED: 'status-reviewed',
    SHORTLISTED: 'status-shortlisted',
    REJECTED: 'status-rejected',
    HIRED: 'status-hired'
  };
  return statusMap[status] || 'status-pending';
};

const getStatusMessage = (status: string) => {
  const messages: Record<string, string> = {
    PENDING: 'Your application is being reviewed',
    REVIEWED: 'Your application has been reviewed',
    SHORTLISTED: 'Congratulations! You\'ve been shortlisted',
    REJECTED: 'Application status update',
    HIRED: 'Congratulations! You\'ve been hired'
  };
  return messages[status] || 'Application status update';
};

export const getApplicationStatusUpdateTemplate = (
  candidateName: string,
  application: ApplicationDetails
) => {
  const { status, job, score, notes } = application;
  const statusClass = getStatusBadgeClass(status);
  const statusMessage = getStatusMessage(status);
  
  const content = `
    <div class="header">
      <h1>Application Update</h1>
      <p>${statusMessage}</p>
    </div>
    <div class="content">
      <h2>Hello ${candidateName}!</h2>
      <p>We have an update regarding your application for the following position:</p>
      
      <div class="job-card">
        <div class="job-title">${job.title}</div>
        <div class="job-company">${job.company}</div>
        <div class="job-location">${job.location} • ${job.employmentType.replace('_', ' ')}</div>
      </div>
      
      <div style="text-align: center; margin: 24px 0;">
        <span class="status-badge ${statusClass}">${status.replace('_', ' ')}</span>
      </div>
      
      ${status === 'SHORTLISTED' ? `
        <div style="background-color: #dcfce7; border-left: 4px solid #16a34a; padding: 16px; margin: 24px 0; border-radius: 6px;">
          <p style="margin: 0; color: #166534;"><strong>Great news!</strong> You've been shortlisted for this position. The hiring team will be in touch soon with next steps.</p>
        </div>
      ` : ''}
      
      ${status === 'HIRED' ? `
        <div style="background-color: #dcfce7; border-left: 4px solid #16a34a; padding: 16px; margin: 24px 0; border-radius: 6px;">
          <p style="margin: 0; color: #166534;"><strong>Congratulations!</strong> We're excited to offer you this position. HR will contact you soon with details about your offer and next steps.</p>
        </div>
      ` : ''}
      
      ${status === 'REJECTED' ? `
        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 6px;">
          <p style="margin: 0; color: #92400e;">While we won't be moving forward with your application for this particular role, we encourage you to apply for other positions that match your skills and experience.</p>
        </div>
      ` : ''}
      
      ${score ? `
        <div style="background-color: #f8f9fa; padding: 16px; border-radius: 6px; margin: 16px 0;">
          <p style="margin: 0;"><strong>Application Score:</strong> ${score}/100</p>
        </div>
      ` : ''}
      
      ${notes ? `
        <div style="background-color: #f8f9fa; padding: 16px; border-radius: 6px; margin: 16px 0;">
          <p style="margin: 0 0 8px 0;"><strong>Additional Notes:</strong></p>
          <p style="margin: 0;">${notes}</p>
        </div>
      ` : ''}
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="${process.env.CLIENT_URL}/applications" class="button">View All Applications</a>
      </div>
      
      <p>Thank you for your interest in working with us. We appreciate the time you took to apply.</p>
      
      <p>Best regards,<br>The ${job.company} Team</p>
    </div>
  `;
  
  return getBaseTemplate(content, `Application Update - ${job.title}`);
};

export const getApplicationConfirmationTemplate = (
  candidateName: string,
  job: JobDetails,
  applicationId: string
) => {
  const content = `
    <div class="header">
      <h1>Application Received</h1>
      <p>Thank you for applying!</p>
    </div>
    <div class="content">
      <h2>Hello ${candidateName}!</h2>
      <p>We've successfully received your application for the following position:</p>
      
      <div class="job-card">
        <div class="job-title">${job.title}</div>
        <div class="job-company">${job.company}</div>
        <div class="job-location">${job.location} • ${job.employmentType.replace('_', ' ')}</div>
      </div>
      
      <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 16px; margin: 24px 0; border-radius: 6px;">
        <p style="margin: 0; color: #1e40af;"><strong>Application ID:</strong> ${applicationId}</p>
      </div>
      
      <h3>What happens next?</h3>
      <ol style="margin: 16px 0; padding-left: 20px;">
        <li>Our team will review your application and resume</li>
        <li>We'll assess your qualifications against our requirements</li>
        <li>You'll receive updates as your application progresses</li>
        <li>If selected, we'll contact you for the next steps</li>
      </ol>
      
      <div style="background-color: #f8f9fa; padding: 16px; border-radius: 6px; margin: 24px 0;">
        <p style="margin: 0;"><strong>Timeline:</strong> We typically review applications within 5-7 business days. You'll receive an email notification once there's an update on your application status.</p>
      </div>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="${process.env.CLIENT_URL}/applications" class="button">Track Application Status</a>
      </div>
      
      <p>Thank you for your interest in joining our team. We look forward to reviewing your application!</p>
      
      <p>Best regards,<br>The ${job.company} Team</p>
    </div>
  `;
  
  return getBaseTemplate(content, `Application Confirmation - ${job.title}`);
};

export const getInterviewInvitationTemplate = (
  candidateName: string,
  job: JobDetails,
  interviewDetails: {
    date: string;
    time: string;
    type: 'phone' | 'video' | 'in-person';
    location?: string;
    meetingLink?: string;
    interviewer: string;
    duration: string;
  }
) => {
  const { date, time, type, location, meetingLink, interviewer, duration } = interviewDetails;
  
  const content = `
    <div class="header">
      <h1>Interview Invitation</h1>
      <p>You've been selected for an interview!</p>
    </div>
    <div class="content">
      <h2>Congratulations ${candidateName}!</h2>
      <p>We're pleased to invite you for an interview for the following position:</p>
      
      <div class="job-card">
        <div class="job-title">${job.title}</div>
        <div class="job-company">${job.company}</div>
        <div class="job-location">${job.location} • ${job.employmentType.replace('_', ' ')}</div>
      </div>
      
      <div style="background-color: #dcfce7; border-left: 4px solid #16a34a; padding: 16px; margin: 24px 0; border-radius: 6px;">
        <h3 style="margin: 0 0 12px 0; color: #166534;">Interview Details</h3>
        <p style="margin: 4px 0; color: #166534;"><strong>Date:</strong> ${date}</p>
        <p style="margin: 4px 0; color: #166534;"><strong>Time:</strong> ${time}</p>
        <p style="margin: 4px 0; color: #166534;"><strong>Duration:</strong> ${duration}</p>
        <p style="margin: 4px 0; color: #166534;"><strong>Type:</strong> ${type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')} Interview</p>
        <p style="margin: 4px 0; color: #166534;"><strong>Interviewer:</strong> ${interviewer}</p>
        ${location ? `<p style="margin: 4px 0; color: #166534;"><strong>Location:</strong> ${location}</p>` : ''}
        ${meetingLink ? `<p style="margin: 4px 0; color: #166534;"><strong>Meeting Link:</strong> <a href="${meetingLink}" style="color: #166534;">${meetingLink}</a></p>` : ''}
      </div>
      
      <h3>What to expect:</h3>
      <ul style="margin: 16px 0; padding-left: 20px;">
        <li>Discussion about your background and experience</li>
        <li>Questions about the role and company</li>
        <li>Opportunity to ask questions about the position</li>
        <li>Overview of next steps in the process</li>
      </ul>
      
      <h3>How to prepare:</h3>
      <ul style="margin: 16px 0; padding-left: 20px;">
        <li>Review the job description and requirements</li>
        <li>Research our company and recent developments</li>
        <li>Prepare examples of your relevant experience</li>
        <li>Think of questions you'd like to ask us</li>
        ${type === 'video' ? '<li>Test your video/audio setup beforehand</li>' : ''}
        ${type === 'in-person' ? '<li>Plan your route and arrive 10 minutes early</li>' : ''}
      </ul>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="mailto:hr@${job.company.toLowerCase().replace(/\s+/g, '')}.com?subject=Interview Confirmation - ${job.title}" class="button">Confirm Interview</a>
        <a href="${process.env.CLIENT_URL}/applications" class="button button-secondary">View Application</a>
      </div>
      
      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 6px;">
        <p style="margin: 0; color: #92400e;"><strong>Important:</strong> Please confirm your attendance by replying to this email at least 24 hours before the interview. If you need to reschedule, please let us know as soon as possible.</p>
      </div>
      
      <p>We're looking forward to meeting you and learning more about your background!</p>
      
      <p>Best regards,<br>The ${job.company} Team</p>
    </div>
  `;
  
  return getBaseTemplate(content, `Interview Invitation - ${job.title}`);
};