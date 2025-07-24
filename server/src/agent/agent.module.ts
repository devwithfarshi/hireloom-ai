import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AgentService } from './agent.service';
import { ScoringService } from './scoring.service';
import { JobSearchService } from './job-search.service';

@Module({
  imports: [ConfigModule],
  providers: [AgentService, ScoringService, JobSearchService],
  exports: [AgentService],
})
export class AgentModule {}
