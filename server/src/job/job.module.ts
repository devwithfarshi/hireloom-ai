import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AgentModule } from 'src/agent/agent.module';
import { CandidateResumeModule } from 'src/candidate-resume/candidate-resume.module';

@Module({
  imports: [PrismaModule, AgentModule, CandidateResumeModule],
  controllers: [JobController],
  providers: [JobService],
  exports: [JobService],
})
export class JobModule {}