import { getBaseTemplate } from './base.template';

interface JobDetails {
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

interface CandidateDetails {
  name: string;
  email: string;
  experience: number;
  skills: string[];
  location: string;
}

export const getNewJobPostingTemplate = (
  recruiterName: string,
  job: JobDetails,
) => {
  const content = `
    <div class="header">
      <h1>Job Posted Successfully</h1>
      <p>Your job posting is now live</p>
    </div>
    <div class="content">
      <h2>Hello ${recruiterName}!</h2>
      <p>Your job posting has been successfully created and is now live on our platform. Candidates can start applying immediately.</p>
      
      <div class="job-card">
        <div class="job-title">${job.title}</div>
        <div class="job-company">${job.company}</div>
        <div class="job-location">${job.location} ${job.isRemote ? '(Remote Available)' : ''} • ${job.employmentType.replace('_', ' ')}</div>
        <div style="margin-top: 8px; font-size: 14px; color: #666;">
          <strong>Experience Required:</strong> ${job.experience} years
        </div>
        ${
          job.tags.length > 0
            ? `
          <div style="margin-top: 12px;">
            ${job.tags.map((tag) => `<span style="display: inline-block; background-color: #f1f1f1; color: #333; padding: 4px 8px; border-radius: 12px; font-size: 12px; margin: 2px 4px 2px 0;">${tag}</span>`).join('')}
          </div>
        `
            : ''
        }
      </div>
      
      <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 16px; margin: 24px 0; border-radius: 6px;">
        <p style="margin: 0; color: #1e40af;"><strong>Job ID:</strong> ${job.id}</p>
      </div>
      
      <h3>What happens next?</h3>
      <ul style="margin: 16px 0; padding-left: 20px;">
        <li>Candidates will start seeing your job posting in search results</li>
        <li>You'll receive email notifications when candidates apply</li>
        <li>You can review applications and manage candidates from your dashboard</li>
        <li>Use our AI-powered scoring system to evaluate candidates</li>
      </ul>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="${process.env.CLIENT_URL}/jobs/${job.id}" class="button">View Job Posting</a>
        <a href="${process.env.CLIENT_URL}/jobs/${job.id}/applicants" class="button button-secondary">Manage Applications</a>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 16px; border-radius: 6px; margin: 24px 0;">
        <p style="margin: 0;"><strong>Pro Tip:</strong> Jobs with detailed descriptions and clear requirements typically receive higher quality applications. You can edit your job posting anytime from your dashboard.</p>
      </div>
      
      <p>Good luck with your hiring process!</p>
      
      <p>Best regards,<br>The ATS Platform Team</p>
    </div>
  `;

  return getBaseTemplate(content, `Job Posted: ${job.title}`);
};

export const getNewApplicationNotificationTemplate = (
  recruiterName: string,
  job: JobDetails,
  candidate: CandidateDetails,
  applicationId: string,
) => {
  const content = `
    <div class="header">
      <h1>New Application Received</h1>
      <p>A candidate has applied to your job posting</p>
    </div>
    <div class="content">
      <h2>Hello ${recruiterName}!</h2>
      <p>You have received a new application for your job posting:</p>
      
      <div class="job-card">
        <div class="job-title">${job.title}</div>
        <div class="job-company">${job.company}</div>
        <div class="job-location">${job.location} • ${job.employmentType.replace('_', ' ')}</div>
      </div>
      
      <h3>Candidate Details:</h3>
      <div style="background-color: #f8f9fa; padding: 16px; border-radius: 6px; margin: 16px 0;">
        <p style="margin: 4px 0;"><strong>Name:</strong> ${candidate.name}</p>
        <p style="margin: 4px 0;"><strong>Email:</strong> ${candidate.email}</p>
        <p style="margin: 4px 0;"><strong>Experience:</strong> ${candidate.experience} years</p>
        <p style="margin: 4px 0;"><strong>Location:</strong> ${candidate.location}</p>
        ${
          candidate.skills.length > 0
            ? `
          <p style="margin: 8px 0 4px 0;"><strong>Skills:</strong></p>
          <div style="margin-top: 8px;">
            ${candidate.skills
              .slice(0, 8)
              .map(
                (skill) =>
                  `<span style="display: inline-block; background-color: #e5e5e5; color: #333; padding: 4px 8px; border-radius: 12px; font-size: 12px; margin: 2px 4px 2px 0;">${skill}</span>`,
              )
              .join('')}
            ${candidate.skills.length > 8 ? `<span style="font-size: 12px; color: #666;">+${candidate.skills.length - 8} more</span>` : ''}
          </div>
        `
            : ''
        }
      </div>
      
      <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 16px; margin: 24px 0; border-radius: 6px;">
        <p style="margin: 0; color: #1e40af;"><strong>Application ID:</strong> ${applicationId}</p>
      </div>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="${process.env.CLIENT_URL}/jobs/${job.id}/applicants" class="button">Review Application</a>
        <a href="${process.env.CLIENT_URL}/jobs/${job.id}" class="button button-secondary">View Job Details</a>
      </div>
      
      <div style="background-color: #dcfce7; border-left: 4px solid #16a34a; padding: 16px; margin: 24px 0; border-radius: 6px;">
        <p style="margin: 0; color: #166534;"><strong>AI Scoring:</strong> Our system will automatically score this application based on job requirements. You can view the score and detailed analysis in your dashboard.</p>
      </div>
      
      <p>Don't forget to review the candidate's resume and provide feedback to maintain a positive candidate experience.</p>
      
      <p>Best regards,<br>The ATS Platform Team</p>
    </div>
  `;

  return getBaseTemplate(content, `New Application - ${job.title}`);
};

export const getJobMatchNotificationTemplate = (
  candidateName: string,
  jobs: JobDetails[],
  matchScore: number,
) => {
  const content = `
    <div class="header">
      <h1>New Job Matches</h1>
      <p>We found ${jobs.length} job${jobs.length > 1 ? 's' : ''} that match your profile</p>
    </div>
    <div class="content">
      <h2>Hello ${candidateName}!</h2>
      <p>Based on your profile and preferences, we've found some exciting job opportunities that might interest you:</p>
      
      <div style="background-color: #dcfce7; border-left: 4px solid #16a34a; padding: 16px; margin: 24px 0; border-radius: 6px;">
        <p style="margin: 0; color: #166534;"><strong>Match Score:</strong> ${matchScore}% compatibility with your profile</p>
      </div>
      
      ${jobs
        .map(
          (job) => `
        <div class="job-card" style="margin: 20px 0;">
          <div class="job-title">${job.title}</div>
          <div class="job-company">${job.company}</div>
          <div class="job-location">${job.location} ${job.isRemote ? '(Remote Available)' : ''} • ${job.employmentType.replace('_', ' ')}</div>
          <div style="margin-top: 8px; font-size: 14px; color: #666;">
            <strong>Experience Required:</strong> ${job.experience} years
          </div>
          <p style="margin: 12px 0 8px 0; font-size: 14px; color: #555; line-height: 1.4;">
            ${job.description.length > 150 ? job.description.substring(0, 150) + '...' : job.description}
          </p>
          ${
            job.tags.length > 0
              ? `
            <div style="margin-top: 12px;">
              ${job.tags
                .slice(0, 5)
                .map(
                  (tag) =>
                    `<span style="display: inline-block; background-color: #f1f1f1; color: #333; padding: 4px 8px; border-radius: 12px; font-size: 12px; margin: 2px 4px 2px 0;">${tag}</span>`,
                )
                .join('')}
              ${job.tags.length > 5 ? `<span style="font-size: 12px; color: #666;">+${job.tags.length - 5} more</span>` : ''}
            </div>
          `
              : ''
          }
          <div style="margin-top: 16px;">
            <a href="${process.env.CLIENT_URL}/jobs/${job.id}" style="display: inline-block; background-color: #1a1a1a; color: #ffffff; padding: 8px 16px; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 600;">View Details</a>
            <a href="${process.env.CLIENT_URL}/jobs/${job.id}/apply" style="display: inline-block; background-color: #f1f1f1; color: #1a1a1a; padding: 8px 16px; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 600; margin-left: 8px;">Quick Apply</a>
          </div>
        </div>
      `,
        )
        .join('')}
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="${process.env.CLIENT_URL}/jobs" class="button">Browse All Jobs</a>
        <a href="${process.env.CLIENT_URL}/profile" class="button button-secondary">Update Profile</a>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 16px; border-radius: 6px; margin: 24px 0;">
        <p style="margin: 0;"><strong>Pro Tip:</strong> Keep your profile updated with your latest skills and experience to receive better job matches. You can also set up job alerts for specific criteria.</p>
      </div>
      
      <p>Don't miss out on these opportunities - some positions fill up quickly!</p>
      
      <p>Best regards,<br>The ATS Platform Team</p>
    </div>
  `;

  return getBaseTemplate(
    content,
    `${jobs.length} New Job Match${jobs.length > 1 ? 'es' : ''} Found`,
  );
};

export const getJobClosingReminderTemplate = (
  recruiterName: string,
  job: JobDetails,
  applicationsCount: number,
  daysUntilClose: number,
) => {
  const content = `
    <div class="header">
      <h1>Job Posting Reminder</h1>
      <p>Your job posting will close in ${daysUntilClose} day${daysUntilClose > 1 ? 's' : ''}</p>
    </div>
    <div class="content">
      <h2>Hello ${recruiterName}!</h2>
      <p>This is a friendly reminder that your job posting will be closing soon:</p>
      
      <div class="job-card">
        <div class="job-title">${job.title}</div>
        <div class="job-company">${job.company}</div>
        <div class="job-location">${job.location} • ${job.employmentType.replace('_', ' ')}</div>
      </div>
      
      <div style="background-color: ${daysUntilClose <= 1 ? '#fee2e2' : '#fef3c7'}; border-left: 4px solid ${daysUntilClose <= 1 ? '#ef4444' : '#f59e0b'}; padding: 16px; margin: 24px 0; border-radius: 6px;">
        <p style="margin: 0; color: ${daysUntilClose <= 1 ? '#991b1b' : '#92400e'};"><strong>Closing in:</strong> ${daysUntilClose} day${daysUntilClose > 1 ? 's' : ''}</p>
      </div>
      
      <h3>Current Statistics:</h3>
      <div style="background-color: #f8f9fa; padding: 16px; border-radius: 6px; margin: 16px 0;">
        <p style="margin: 4px 0;"><strong>Total Applications:</strong> ${applicationsCount}</p>
        <p style="margin: 4px 0;"><strong>Status:</strong> Active</p>
        <p style="margin: 4px 0;"><strong>Posted:</strong> ${new Date().toLocaleDateString()}</p>
      </div>
      
      <h3>Actions you can take:</h3>
      <ul style="margin: 16px 0; padding-left: 20px;">
        <li>Review pending applications before the posting closes</li>
        <li>Extend the posting deadline if you need more candidates</li>
        <li>Start the interview process with qualified candidates</li>
        <li>Update job requirements if needed</li>
      </ul>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="${process.env.CLIENT_URL}/jobs/${job.id}/applicants" class="button">Review Applications</a>
        <a href="${process.env.CLIENT_URL}/jobs/${job.id}/edit" class="button button-secondary">Edit Job Posting</a>
      </div>
      
      ${
        applicationsCount === 0
          ? `
        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 6px;">
          <p style="margin: 0; color: #92400e;"><strong>No applications yet?</strong> Consider reviewing your job description, requirements, or salary range to attract more candidates.</p>
        </div>
      `
          : ''
      }
      
      <p>Thank you for using our platform for your hiring needs!</p>
      
      <p>Best regards,<br>The ATS Platform Team</p>
    </div>
  `;

  return getBaseTemplate(content, `Job Closing Soon - ${job.title}`);
};
