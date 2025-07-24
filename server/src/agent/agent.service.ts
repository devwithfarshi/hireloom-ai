import { Injectable, Logger, MessageEvent } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Subject } from 'rxjs';
import { ScoringService, JobRequirements, CandidateProfile, ScoringResult } from './scoring.service';
import { JobSearchService, JobWithCompany, ScoredJob } from './job-search.service';

// Re-export interfaces for backward compatibility
export { JobRequirements, CandidateProfile, ScoringResult, JobWithCompany, ScoredJob };

@Injectable()
export class AgentService {
  private readonly logger = new Logger(AgentService.name);

  constructor(
    private configService: ConfigService,
    private scoringService: ScoringService,
    private jobSearchService: JobSearchService,
  ) {}

  /**
   * Scores a candidate against job requirements using LangChain with Gemini AI
   */
  async scoreCandidate(
    jobRequirements: JobRequirements,
    candidateProfile: CandidateProfile,
  ): Promise<ScoringResult> {
    return this.scoringService.scoreCandidate(jobRequirements, candidateProfile);
  }

  /**
   * Extracts text content from resume using LangChain with Gemini AI
   */
  async extractResumeContent(resumeText: string): Promise<string> {
    return this.scoringService.extractResumeContent(resumeText);
  }





  async aiSearchJobs(
    searchDto: { query: string; profile: CandidateProfile },
    prismaService: any,
  ): Promise<{
    jobs: ScoredJob[];
  }> {
    return this.jobSearchService.aiSearchJobs(searchDto, prismaService);
  }



  /**
   * Streaming AI Job Search with batch processing
   */
  async aiSearchJobsStream(
    searchDto: { query: string; profile: CandidateProfile },
    prismaService: any,
    subject: Subject<MessageEvent>,
  ): Promise<void> {
    return this.jobSearchService.aiSearchJobsStream(searchDto, prismaService, subject);
  }
}
