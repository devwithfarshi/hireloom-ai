import { Injectable, Logger, MessageEvent } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Subject } from 'rxjs';
import { ScoringService, JobRequirements, CandidateProfile, ScoringResult } from './scoring.service';

export interface JobWithCompany {
  id: string;
  title: string;
  description: string;
  employmentType: string;
  experience: number;
  tags: string[];
  location: string;
  company?: {
    id: string;
    name: string;
    industry: string;
    location: string;
    domain: string;
  };
  [key: string]: any;
}

export interface ScoredJob extends JobWithCompany {
  relevanceScore: number;
  matchAnalysis: {
    score: number;
    reasoning: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  queryRelevance: number;
}

@Injectable()
export class JobSearchService {
  private readonly logger = new Logger(JobSearchService.name);

  constructor(
    private configService: ConfigService,
    private scoringService: ScoringService,
  ) {}

  async aiSearchJobs(
    searchDto: { query: string; profile: CandidateProfile },
    prismaService: any,
  ): Promise<{
    jobs: ScoredJob[];
  }> {
    console.log('🔍 AI Search Jobs - Starting search process');
    console.log('📝 Search Query:', searchDto.query);
    console.log('👤 Candidate Profile:', {
      experience: searchDto.profile.experience,
      skills: searchDto.profile.skills,
      hasResumeContent: !!searchDto.profile.resumeContent
    });

    try {
      console.log('📊 Step 1: Fetching active jobs from database');
      const allJobs = await prismaService.job.findMany({
        where: {
          active: true,
        },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              industry: true,
              location: true,
              domain: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      console.log('✅ Jobs fetched from database:', allJobs.length);

      console.log('🎯 Step 2: Scoring jobs against candidate profile');
      const scoredJobs = await this.scoreJobsForCandidate(
        allJobs,
        searchDto.profile,
        searchDto.query,
      );
      console.log('✅ Jobs scored, total:', scoredJobs.length);

      console.log('🔍 Step 3: Filtering and sorting by relevance');
      const relevantJobs = scoredJobs
        .filter((job) => job.relevanceScore > 30) // Only show jobs with >30% relevance
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 20); // Limit to top 20 results
      
      console.log('✅ Relevant jobs filtered:', relevantJobs.length);
      console.log('📈 Top 5 job scores:', relevantJobs.slice(0, 5).map(job => ({
        title: job.title,
        relevanceScore: job.relevanceScore,
        matchScore: job.matchAnalysis.score
      })));

      console.log('🎉 AI Search completed successfully');
      return {
        jobs: relevantJobs,
      };
    } catch (error) {
      console.error('❌ AI Search failed:', error.message);
      console.log('🔄 Falling back to basic search');
      this.logger.error('Failed to perform AI job search', {
        error: error.message,
        query: searchDto.query,
        profile: JSON.stringify(searchDto.profile).substring(0, 500),
      });

      // Fallback to basic search
      return this.performBasicJobSearch(searchDto.query, prismaService);
    }
  }

  /**
   * Streaming AI Job Search with batch processing
   */
  async aiSearchJobsStream(
    searchDto: { query: string; profile: CandidateProfile },
    prismaService: any,
    subject: Subject<MessageEvent>,
  ): Promise<void> {
    console.log('🚀 Starting streaming AI job search');
    console.log('📝 Search Query:', searchDto.query);
    console.log('👤 Candidate Profile:', {
      experience: searchDto.profile.experience,
      skills: searchDto.profile.skills,
      hasResumeContent: !!searchDto.profile.resumeContent
    });

    try {
      // Step 1: Fetch jobs
      subject.next({
        data: JSON.stringify({
          type: 'status',
          message: 'Fetching jobs from database...',
          progress: 15,
        }),
      } as MessageEvent);

      const allJobs = await prismaService.job.findMany({
        where: { active: true },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              industry: true,
              location: true,
              domain: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      console.log('✅ Jobs fetched:', allJobs.length);
      
      subject.next({
        data: JSON.stringify({
          type: 'status',
          message: `Found ${allJobs.length} jobs. Starting analysis...`,
          progress: 25,
        }),
      } as MessageEvent);

      // Step 2: Process jobs in batches
      await this.processJobsInBatches(
        allJobs,
        searchDto.profile,
        searchDto.query,
        subject,
      );

    } catch (error) {
      console.error('❌ Streaming AI search failed:', error.message);
      subject.next({
        data: JSON.stringify({
          type: 'error',
          message: 'AI search failed. Falling back to basic search.',
          error: error.message,
        }),
      } as MessageEvent);

      // Fallback to basic search
      await this.performBasicJobSearchStream(searchDto.query, prismaService, subject);
    }
  }

  private async processJobsInBatches(
    jobs: JobWithCompany[],
    profile: CandidateProfile,
    searchQuery: string,
    subject: Subject<MessageEvent>,
  ): Promise<void> {
    const BATCH_SIZE = 5; // Process 5 jobs at a time
    const totalJobs = jobs.length;
    const batches: JobWithCompany[][] = [];
    
    // Split jobs into batches
    for (let i = 0; i < jobs.length; i += BATCH_SIZE) {
      batches.push(jobs.slice(i, i + BATCH_SIZE));
    }

    console.log(`📦 Processing ${totalJobs} jobs in ${batches.length} batches of ${BATCH_SIZE}`);
    
    const allScoredJobs: ScoredJob[] = [];
    let processedJobs = 0;

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      const batchNumber = batchIndex + 1;
      
      console.log(`🔄 Processing batch ${batchNumber}/${batches.length}`);
      
      subject.next({
        data: JSON.stringify({
          type: 'status',
          message: `Processing batch ${batchNumber}/${batches.length} (${batch.length} jobs)...`,
          progress: 25 + (batchIndex / batches.length) * 60,
        }),
      } as MessageEvent);

      // Process batch in parallel
      const batchPromises = batch.map(async (job) => {
        try {
          const jobRequirements: JobRequirements = {
            title: job.title,
            description: job.description,
            employmentType: job.employmentType,
            experience: job.experience,
            tags: job.tags || [],
          };

          // Use faster scoring with reduced AI calls
          const scoringResult = await this.scoringService.scoreCandidateFast(
            jobRequirements,
            profile,
          );

          const queryRelevance = this.calculateQueryRelevance(job, searchQuery);
          const relevanceScore = Math.round(
            scoringResult.score * 0.7 + queryRelevance * 0.3,
          );

          return {
            ...job,
            relevanceScore,
            matchAnalysis: {
              score: scoringResult.score,
              reasoning: scoringResult.reasoning,
              strengths: scoringResult.strengths,
              weaknesses: scoringResult.weaknesses,
              recommendations: scoringResult.recommendations,
            },
            queryRelevance,
          } as ScoredJob;
        } catch (error) {
          console.error(`❌ Failed to score job ${job.title}:`, error.message);
          // Return basic scoring for failed jobs
          return {
            ...job,
            relevanceScore: 30,
            matchAnalysis: {
              score: 30,
              reasoning: 'Basic scoring due to processing error',
              strengths: ['Job available'],
              weaknesses: ['Unable to perform detailed analysis'],
              recommendations: ['Manual review recommended'],
            },
            queryRelevance: 30,
          } as ScoredJob;
        }
      });

      // Wait for batch to complete
      const batchResults = await Promise.all(batchPromises);
      allScoredJobs.push(...batchResults);
      processedJobs += batch.length;

      // Send batch results
      const relevantBatchJobs = batchResults
        .filter(job => job.relevanceScore > 30)
        .sort((a, b) => b.relevanceScore - a.relevanceScore);

      if (relevantBatchJobs.length > 0) {
        subject.next({
          data: JSON.stringify({
            type: 'batch_results',
            data: relevantBatchJobs,
            progress: 25 + ((batchIndex + 1) / batches.length) * 60,
          }),
        } as MessageEvent);
      }

      // Small delay between batches to prevent overwhelming
      if (batchIndex < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Send final results
    const finalResults = allScoredJobs
      .filter(job => job.relevanceScore > 30)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 20);

    console.log('✅ Streaming search completed');
    console.log(`📊 Final results: ${finalResults.length} relevant jobs`);

    subject.next({
      data: JSON.stringify({
        type: 'final_results',
        data: {
          jobs: finalResults,
        },
        progress: 100,
      }),
    } as MessageEvent);
  }

  private async performBasicJobSearchStream(
    query: string,
    prismaService: any,
    subject: Subject<MessageEvent>,
  ): Promise<void> {
    try {
      const jobs = await prismaService.job.findMany({
        where: {
          active: true,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { tags: { has: query } },
          ],
        },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              industry: true,
              location: true,
              domain: true,
            },
          },
        },
        take: 20,
        orderBy: { createdAt: 'desc' },
      });

      const basicResults = jobs.map(job => ({
        ...job,
        relevanceScore: 50,
        matchAnalysis: {
          score: 50,
          reasoning: 'Basic keyword matching applied',
          strengths: ['Keyword match found'],
          weaknesses: ['AI analysis unavailable'],
          recommendations: ['Manual review recommended'],
        },
        queryRelevance: 50,
      }));

      subject.next({
        data: JSON.stringify({
          type: 'final_results',
          data: {
            jobs: basicResults,
          },
          progress: 100,
        }),
      } as MessageEvent);
    } catch (error) {
      subject.next({
        data: JSON.stringify({
          type: 'error',
          message: 'Search failed completely',
          error: error.message,
        }),
      } as MessageEvent);
    }
  }

  private async scoreJobsForCandidate(
    jobs: JobWithCompany[],
    profile: CandidateProfile,
    searchQuery: string,
  ): Promise<ScoredJob[]> {
    console.log('🎯 Starting job scoring process');
    console.log('📊 Total jobs to score:', jobs.length);
    console.log('🔍 Search query for relevance:', searchQuery);
    
    const scoredJobs: ScoredJob[] = [];
    let processedCount = 0;
    let failedCount = 0;

    for (const job of jobs) {
      try {
        processedCount++;
        if (processedCount % 10 === 0) {
          console.log(`⏳ Progress: ${processedCount}/${jobs.length} jobs processed`);
        }
        
        console.log(`🔍 Processing job: ${job.title}`);
        
        // Create job requirements object for scoring
        const jobRequirements: JobRequirements = {
          title: job.title,
          description: job.description,
          employmentType: job.employmentType,
          experience: job.experience,
          tags: job.tags || [],
        };

        // Score the job against candidate profile
        console.log(`🤖 Scoring candidate against job requirements`);
        const scoringResult = await this.scoringService.scoreCandidate(
          jobRequirements,
          profile,
        );
        console.log(`🎯 AI match score: ${scoringResult.score}`);

        // Calculate search query relevance
        console.log(`📈 Calculating query relevance`);
        const queryRelevance = this.calculateQueryRelevance(
          job,
          searchQuery,
        );
        console.log(`📊 Query relevance score: ${queryRelevance}`);

        // Combine scoring result with query relevance
        const relevanceScore = Math.round(
          scoringResult.score * 0.7 + queryRelevance * 0.3,
        );
        console.log(`🏆 Final relevance score: ${relevanceScore}`);

        scoredJobs.push({
          ...job,
          relevanceScore,
          matchAnalysis: {
            score: scoringResult.score,
            reasoning: scoringResult.reasoning,
            strengths: scoringResult.strengths,
            weaknesses: scoringResult.weaknesses,
            recommendations: scoringResult.recommendations,
          },
          queryRelevance,
        });
      } catch (error) {
        failedCount++;
        console.error(`❌ Failed to score job ${job.title}:`, error.message);
        this.logger.error(`Failed to score job ${job.id}`, error.message);
        
        console.log(`🔄 Using fallback scoring for: ${job.title}`);
        // Include job with basic scoring
        scoredJobs.push({
          ...job,
          relevanceScore: 50,
          matchAnalysis: {
            score: 50,
            reasoning: 'Basic matching applied due to scoring error',
            strengths: ['Job available'],
            weaknesses: ['Unable to perform detailed analysis'],
            recommendations: ['Review job details manually'],
          },
          queryRelevance: 50,
        });
      }
    }

    console.log('✅ Job scoring completed');
    console.log(`📊 Results: ${scoredJobs.length} jobs scored, ${failedCount} failures`);
    console.log(`📈 Score distribution:`, {
      high: scoredJobs.filter(j => j.relevanceScore >= 70).length,
      medium: scoredJobs.filter(j => j.relevanceScore >= 40 && j.relevanceScore < 70).length,
      low: scoredJobs.filter(j => j.relevanceScore < 40).length
    });
    
    return scoredJobs;
  }

  private calculateQueryRelevance(job: JobWithCompany, searchQuery: string): number {
    console.log(`🔍 Calculating query relevance for: ${job.title}`);
    console.log(`📝 Search query: "${searchQuery}"`);
    
    if (!searchQuery || searchQuery.trim() === '') {
      console.log('⚠️ No search query provided, using default relevance: 50');
      return 50;
    }

    const query = searchQuery.toLowerCase();
    const title = job.title.toLowerCase();
    const description = job.description.toLowerCase();
    const tags = (job.tags || []).join(' ').toLowerCase();
    const company = job.company?.name?.toLowerCase() || '';
    const location = job.location.toLowerCase();

    console.log('🔍 Checking keyword matches...');
    
    let relevanceScore = 0;

    // Title match (highest weight)
    if (title.includes(query)) {
      relevanceScore += 40;
      console.log('✅ Full title match: +40');
    } else if (query.split(' ').some((word) => title.includes(word))) {
      relevanceScore += 25;
      console.log('✅ Partial title match: +25');
    }

    // Tags/skills match
    if (tags.includes(query)) {
      relevanceScore += 30;
      console.log('✅ Full tags match: +30');
    } else if (query.split(' ').some((word) => tags.includes(word))) {
      relevanceScore += 20;
      console.log('✅ Partial tags match: +20');
    }

    // Description match
    if (description.includes(query)) {
      relevanceScore += 20;
      console.log('✅ Full description match: +20');
    } else if (query.split(' ').some((word) => description.includes(word))) {
      relevanceScore += 10;
      console.log('✅ Partial description match: +10');
    }

    // Company match
    if (company.includes(query)) {
      relevanceScore += 15;
      console.log('✅ Company match: +15');
    }

    // Location match
    if (location.includes(query)) {
      relevanceScore += 10;
      console.log('✅ Location match: +10');
    }

    const finalScore = Math.min(100, relevanceScore);
    console.log(`🎯 Final query relevance score: ${finalScore}`);
    return finalScore;
  }

  private async performBasicJobSearch(
    query: string,
    prismaService: any,
  ): Promise<{
    jobs: ScoredJob[];
  }> {
    console.log('🔄 Performing basic job search (fallback mode)');
    console.log('📝 Search query:', query);
    
    try {
      console.log('🔍 Executing database search with keyword matching');
      const jobs = await prismaService.job.findMany({
        where: {
          active: true,
          OR: [
            {
              title: {
                contains: query,
                mode: 'insensitive' as const,
              },
            },
            {
              description: {
                contains: query,
                mode: 'insensitive' as const,
              },
            },
            {
              tags: {
                hasSome: query.split(' '),
              },
            },
          ],
        },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              industry: true,
              location: true,
              domain: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });
      
      console.log('✅ Basic search completed, found jobs:', jobs.length);

      console.log('🔄 Converting to scored job format');
      const scoredJobs = jobs.map((job) => {
        const relevanceScore = this.calculateQueryRelevance(job, query);
        console.log(`📊 Job "${job.title}" - relevance: ${relevanceScore}`);
        
        return {
          ...job,
          relevanceScore,
          matchAnalysis: {
            score: 50,
            reasoning: 'Basic search results - AI analysis unavailable',
            strengths: ['Matches search query'],
            weaknesses: ['Limited analysis available'],
            recommendations: ['Review job details'],
          },
          queryRelevance: relevanceScore,
        };
      });

      console.log('✅ Basic search fallback completed');
      console.log('📊 Results summary:', {
        totalJobs: scoredJobs.length,
        avgRelevance: scoredJobs.reduce((sum, job) => sum + job.relevanceScore, 0) / scoredJobs.length || 0,
      });

      return {
        jobs: scoredJobs,
      };
    } catch (error) {
      console.error('❌ Basic job search failed:', error.message);
      this.logger.error('Failed to perform basic job search', error.message);
      return {
        jobs: [],
      };
    }
  }
}