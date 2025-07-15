import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { S3Module } from 'src/s3/s3.module';
import { CandidateResumeController } from './candidate-resume.controller';
import { CandidateResumeService } from './candidate-resume.service';

@Module({
  imports: [
    S3Module,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 3,
        },
      ],
    }),
  ],
  controllers: [CandidateResumeController],
  providers: [
    CandidateResumeService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [CandidateResumeService],
})
export class CandidateResumeModule {}
