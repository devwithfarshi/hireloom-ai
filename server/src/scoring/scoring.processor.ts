import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { PrismaService } from 'src/prisma/prisma.service';
import { CandidateResumeService } from './../candidate-resume/candidate-resume.service';
import { AgentService, JobRequirements, CandidateProfile } from 'src/agent/agent.service';
import { ScoringStatus } from '@prisma/client';
export interface ScoringPayload {
  jobId: string;
  applications: {
    id: string;
    candidateUserId: string;
  }[];
}

export interface TaskScoringPayload {
  jobId: string;
  applicationId: string;
  candidateUserId: string;
}
@Processor('scoring')
export class ScoringProcessor extends WorkerHost {
  private readonly logger = new Logger(ScoringProcessor.name);
  constructor(
    @InjectQueue('task-scoring')
    private readonly taskScoringQueue: Queue,
  ) {
    super();
  }
  async process(job: Job<ScoringPayload, any, string>): Promise<void> {
    try {
      this.logger.debug(
        `Processing scoring job ${job.id} for job ${job.data.jobId}`,
      );
      const { jobId, applications } = job.data;

      const taskPromises = applications.map((app) =>
        this.taskScoringQueue.add('task-scoring', {
          jobId,
          applicationId: app.id,
          candidateUserId: app.candidateUserId,
        }),
      );

      await Promise.all(taskPromises);
      this.logger.debug(
        `Successfully queued ${applications.length} scoring tasks for job ${jobId}`,
      );
    } catch (error) {
      this.logger.error(
        `Scoring orchestration failed for job ${job.id}`,
        error.stack,
      );
      throw error;
    }
  }
}

@Processor('task-scoring')
export class TaskScoringProcessor extends WorkerHost {
  private readonly logger = new Logger(TaskScoringProcessor.name);
  constructor(
    private prisma: PrismaService,
    private candidateResumeService: CandidateResumeService,
    private agentService: AgentService,
  ) {
    super();
  }
  async process(
    job: Job<TaskScoringPayload, any, string>,
    token?: string | undefined,
  ): Promise<void> {
    try {
      this.logger.debug(
        `Processing task scoring job ${job.id} for application ${job.data.applicationId}`,
      );
      const { jobId, applicationId, candidateUserId } = job.data;

      // Fetch job and candidate information
      const [jobInfo, candidateInfo] = await Promise.all([
        this.prisma.job.findUnique({
          where: { id: jobId },
          select: {
            title: true,
            description: true,
            employmentType: true,
            experience: true,
            tags: true,
          },
        }),
        this.prisma.candidateProfile.findUnique({
          where: { candidateUserId },
          select: {
            experience: true,
            skills: true,
          },
        }),
      ]);

      if (!jobInfo) {
        throw new Error(`Job with ID ${jobId} not found`);
      }

      if (!candidateInfo) {
        throw new Error(
          `Candidate profile for user ${candidateUserId} not found`,
        );
      }

      // Get candidate resume content
      let resumeContent = '';
      try {
        const { url: candidateResumeUrl } =
          await this.candidateResumeService.getResumeByCandidateId(
            candidateUserId,
          );
        
        // Note: In a real implementation, you would fetch and parse the resume content from S3
        // For now, we'll work with the available profile data
        resumeContent = `Resume available at: ${candidateResumeUrl}`;
      } catch (error) {
        this.logger.warn(`Could not fetch resume for candidate ${candidateUserId}`, error.message);
      }

      // Prepare data for AI scoring
      const jobRequirements: JobRequirements = {
        title: jobInfo.title,
        description: jobInfo.description,
        employmentType: jobInfo.employmentType,
        experience: jobInfo.experience,
        tags: jobInfo.tags,
      };

      const candidateProfile: CandidateProfile = {
        experience: candidateInfo.experience,
        skills: candidateInfo.skills,
        resumeContent,
      };

      // Score candidate using Gemini AI
      const scoringResult = await this.agentService.scoreCandidate(
        jobRequirements,
        candidateProfile,
      );

      // Update application score with transaction safety
      await this.prisma.$transaction(async (tx) => {
        await tx.application.update({
          where: { id: applicationId },
          data: {
            score: scoringResult.score,
            status: 'REVIEWED',
            notes: JSON.stringify({
              reasoning: scoringResult.reasoning,
              strengths: scoringResult.strengths,
              weaknesses: scoringResult.weaknesses,
              recommendations: scoringResult.recommendations,
              scoredAt: new Date().toISOString(),
            }),
          },
        });

        // Check if all applications for this job have been scored
        const totalApplications = await tx.application.count({
          where: { jobId },
        });

        const scoredApplications = await tx.application.count({
          where: {
            jobId,
            score: { not: null },
          },
        });

        // If all applications are scored, update job status to COMPLETE
        if (totalApplications === scoredApplications) {
          await tx.job.update({
            where: { id: jobId },
            data: {
              scoringStatus: ScoringStatus.COMPLETE,
            },
          });
          this.logger.debug(`All applications scored for job ${jobId}. Job scoring status updated to COMPLETE.`);
        }
      });

      this.logger.debug('Application scored successfully with Gemini AI', {
        applicationId,
        score: scoringResult.score,
        jobId,
        candidateUserId,
        reasoning: scoringResult.reasoning.substring(0, 100) + '...',
      });
    } catch (error) {
      this.logger.error(`Task scoring failed for job ${job.id}`, {
        applicationId: job.data.applicationId,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}
