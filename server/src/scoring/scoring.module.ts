import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { BullConfigModule } from 'src/bull/bull.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CandidateResumeModule } from 'src/candidate-resume/candidate-resume.module';
import { ScoringProcessor, TaskScoringProcessor } from './scoring.processor';
import { ScoringService } from './scoring.service';

@Module({
  imports: [
    BullConfigModule,
    PrismaModule,
    CandidateResumeModule,
    BullModule.registerQueue({
      name: 'scoring',
      defaultJobOptions: {
        removeOnComplete: 10,
        removeOnFail: 5,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    }),
    BullModule.registerQueue({
      name: 'task-scoring',
      defaultJobOptions: {
        removeOnComplete: 50,
        removeOnFail: 10,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    }),
  ],
  providers: [ScoringProcessor, TaskScoringProcessor, ScoringService],
  exports: [ScoringService],
})
export class ScoringModule {}
