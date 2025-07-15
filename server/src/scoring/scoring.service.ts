import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ScoringPayload } from './scoring.processor';

@Injectable()
export class ScoringService {
  private readonly logger = new Logger(ScoringService.name);

  constructor(
    @InjectQueue('scoring')
    private readonly scoringQueue: Queue,
  ) {}

  /**
   * Initiates the scoring process for a job and its applications
   * @param jobId - The job ID to score applications for
   * @param applications - Array of applications to score
   */
  async startScoring(
    jobId: string,
    applications: { id: string; candidateUserId: string }[],
  ): Promise<void> {
    try {
      const payload: ScoringPayload = {
        jobId,
        applications,
      };

      await this.scoringQueue.add('scoring', payload, {
        priority: 1,
        delay: 0,
      });

      this.logger.log(
        `Scoring initiated for job ${jobId} with ${applications.length} applications`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to start scoring for job ${jobId}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Gets the current status of scoring queues
   */
  async getQueueStatus() {
    try {
      const [waiting, active, completed, failed] = await Promise.all([
        this.scoringQueue.getWaiting(),
        this.scoringQueue.getActive(),
        this.scoringQueue.getCompleted(),
        this.scoringQueue.getFailed(),
      ]);

      return {
        scoring: {
          waiting: waiting.length,
          active: active.length,
          completed: completed.length,
          failed: failed.length,
        },
      };
    } catch (error) {
      this.logger.error('Failed to get queue status', error.stack);
      throw error;
    }
  }
}
