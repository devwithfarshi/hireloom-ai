import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { PrismaService } from 'src/prisma/prisma.service';
import { CandidateResumeService } from './../candidate-resume/candidate-resume.service';
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

      // Get candidate resume
      const candidateResumeUrl =
        await this.candidateResumeService.getResumeByCandidateId(
          candidateUserId,
        );

      // TODO: Replace with actual AI scoring logic
      const score = Math.random() * 100;

      // Update application score with transaction safety
      await this.prisma.$transaction(async (tx) => {
        await tx.application.update({
          where: { id: applicationId },
          data: {
            score: Math.round(score),
            status: 'REVIEWED',
          },
        });
      });

      this.logger.debug('Application scored successfully', {
        applicationId,
        score: Math.round(score),
        jobId,
        candidateUserId,
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
