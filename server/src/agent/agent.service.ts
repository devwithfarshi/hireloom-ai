import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';
import { JsonOutputParser } from '@langchain/core/output_parsers';

export interface JobRequirements {
  title: string;
  description: string;
  employmentType: string;
  experience: number;
  tags: string[];
}

export interface CandidateProfile {
  experience: number;
  skills: string[];
  resumeContent?: string;
}

export interface ScoringResult {
  score: number;
  reasoning: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

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
export class AgentService {
  private readonly logger = new Logger(AgentService.name);
  private readonly model: ChatGoogleGenerativeAI;
  private readonly jsonParser = new JsonOutputParser();

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    this.model = new ChatGoogleGenerativeAI({
      model: 'gemini-2.5-pro',
      apiKey,
      temperature: 0.1,
    });
  }

  /**
   * Scores a candidate against job requirements using LangChain with Gemini AI
   */
  async scoreCandidate(
    jobRequirements: JobRequirements,
    candidateProfile: CandidateProfile,
  ): Promise<ScoringResult> {
    try {
      const promptTemplate = this.createScoringPromptTemplate();

      const chain = promptTemplate.pipe(this.model).pipe(this.jsonParser);

      const result = await chain.invoke({
        jobTitle: jobRequirements.title,
        employmentType: jobRequirements.employmentType,
        requiredExperience: jobRequirements.experience,
        requiredSkills: jobRequirements.tags.join(', '),
        jobDescription: jobRequirements.description,
        candidateExperience: candidateProfile.experience,
        candidateSkills: candidateProfile.skills.join(', '),
        resumeContent:
          candidateProfile.resumeContent || 'No resume content provided',
      });

      return this.validateScoringResult(result);
    } catch (error) {
      this.logger.error('Failed to score candidate with LangChain', {
        error: error.message,
        jobTitle: jobRequirements.title,
      });

      // Fallback scoring in case of AI failure
      return this.generateFallbackScore(jobRequirements, candidateProfile);
    }
  }

  /**
   * Extracts text content from resume using LangChain with Gemini AI
   */
  async extractResumeContent(resumeText: string): Promise<string> {
    try {
      const promptTemplate = PromptTemplate.fromTemplate(`
Extract and summarize the key information from this resume in a structured format:

Resume Content:
{resumeText}

Please provide:
1. Professional summary
2. Key skills and technologies
3. Work experience highlights
4. Education background
5. Notable achievements

Format the response in clear, concise bullet points.`);

      const chain = promptTemplate.pipe(this.model);
      const result = await chain.invoke({ resumeText });

      return result.content as string;
    } catch (error) {
      this.logger.error('Failed to extract resume content', error.message);
      return resumeText; // Return original text as fallback
    }
  }

  private createScoringPromptTemplate(): PromptTemplate {
    return PromptTemplate.fromTemplate(`
You are an expert ATS (Applicant Tracking System) that evaluates candidates for job positions. 
Analyze the candidate against the job requirements and provide a comprehensive scoring.

JOB REQUIREMENTS:
- Title: {jobTitle}
- Employment Type: {employmentType}
- Required Experience: {requiredExperience} years
- Required Skills/Tags: {requiredSkills}
- Job Description: {jobDescription}

CANDIDATE PROFILE:
- Experience: {candidateExperience} years
- Skills: {candidateSkills}
- Resume Content: {resumeContent}

Please provide your analysis in the following JSON format:
{{
  "score": <number between 0-100>,
  "reasoning": "<detailed explanation of the score>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "recommendations": ["<recommendation 1>", "<recommendation 2>", "<recommendation 3>"]
}}

Scoring Criteria:
- Skills match (30%): How well candidate's skills align with job requirements
- Experience level (25%): Years of experience vs. required experience
- Relevant background (20%): Industry and role relevance
- Education and certifications (15%): Academic qualifications
- Overall fit (10%): Cultural and role-specific fit

Provide only the JSON response, no additional text.`);
  }

  private validateScoringResult(result: any): ScoringResult {
    try {
      return {
        score: Math.max(0, Math.min(100, result.score || 0)),
        reasoning: result.reasoning || 'No reasoning provided',
        strengths: Array.isArray(result.strengths) ? result.strengths : [],
        weaknesses: Array.isArray(result.weaknesses) ? result.weaknesses : [],
        recommendations: Array.isArray(result.recommendations)
          ? result.recommendations
          : [],
      };
    } catch (error) {
      this.logger.error('Failed to validate LangChain response', {
        error: error.message,
        result: JSON.stringify(result).substring(0, 500),
      });

      // Return a basic fallback response
      return {
        score: 0,
        reasoning: 'Unable to parse AI response, using fallback scoring',
        strengths: ['Profile reviewed'],
        weaknesses: ['Unable to perform detailed analysis'],
        recommendations: ['Manual review recommended'],
      };
    }
  }

  private generateFallbackScore(
    jobRequirements: JobRequirements,
    candidateProfile: CandidateProfile,
  ): ScoringResult {
    console.log(`🔄 Generating fallback score for job: ${jobRequirements.title}`);
    console.log('👤 Candidate profile:', {
      experience: candidateProfile.experience,
      skillsCount: candidateProfile.skills.length
    });
    
    // Simple fallback scoring logic
    let score = 50; // Base score
    console.log('📊 Starting with base score: 50');

    // Experience scoring
    const experienceRatio =
      candidateProfile.experience / Math.max(jobRequirements.experience, 1);
    console.log(`📈 Experience ratio: ${experienceRatio.toFixed(2)} (${candidateProfile.experience}/${jobRequirements.experience})`);
    
    if (experienceRatio >= 1) {
      score += 20;
      console.log('✅ Experience bonus (100%+): +20');
    } else if (experienceRatio >= 0.7) {
      score += 15;
      console.log('✅ Experience bonus (70%+): +15');
    } else if (experienceRatio >= 0.5) {
      score += 10;
      console.log('✅ Experience bonus (50%+): +10');
    } else {
      console.log('⚠️ No experience bonus applied');
    }

    // Skills matching
    console.log('🔍 Matching skills against job requirements...');
    console.log('🛠️ Candidate skills:', candidateProfile.skills);
    console.log('🎯 Required skills/tags:', jobRequirements.tags);
    
    const matchingSkills = candidateProfile.skills.filter((skill) =>
      jobRequirements.tags.some(
        (tag) =>
          tag.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(tag.toLowerCase()),
      ),
    );
    
    console.log('✅ Matching skills found:', matchingSkills);

    const skillsMatchRatio =
      matchingSkills.length / Math.max(jobRequirements.tags.length, 1);
    const skillsBonus = skillsMatchRatio * 30;
    score += skillsBonus;
    console.log(`📊 Skills match ratio: ${skillsMatchRatio.toFixed(2)}, bonus: +${skillsBonus.toFixed(1)}`);

    const finalScore = Math.max(0, Math.min(100, Math.round(score)));
    console.log(`🎯 Final fallback score: ${finalScore}`);

    return {
      score: finalScore,
      reasoning: 'Fallback scoring used due to AI service unavailability',
      strengths:
        matchingSkills.length > 0
          ? [`Matching skills: ${matchingSkills.join(', ')}`]
          : ['Profile available'],
      weaknesses: ['AI analysis unavailable'],
      recommendations: [
        'Manual review recommended',
        'Verify AI service configuration',
      ],
    };
  }

  /**
   * Ai Job Search
   */
  private enhanceQueryWithProfile(
    query: string,
    profile: CandidateProfile,
  ): string {
    console.log('🔧 Enhancing query with profile data');
    console.log('📝 Original query:', query);
    
    const skillsText = profile.skills?.join(', ') || '';
    const experienceText = profile.experience || '';
    const resumeText = profile.resumeContent || '';
    
    console.log('🛠️ Profile components:', {
      skillsCount: profile.skills?.length || 0,
      hasExperience: !!experienceText,
      resumeLength: resumeText.length
    });

    const enhancedQuery = `
      Search Query: ${query}
      
      Candidate Skills: ${skillsText}
      Experience Level: ${experienceText}
      Resume Content: ${resumeText.substring(0, 1000)}...
      
      Please find jobs that match this candidate's profile and search intent.
    `;
    
    console.log('✅ Query enhancement completed');
    return enhancedQuery;
  }

  async aiSearchJobs(
    searchDto: { query: string; profile: CandidateProfile },
    prismaService: any,
  ): Promise<{
    jobs: ScoredJob[];
    aiAnalysis: string;
    searchStrategy: string;
  }> {
    console.log('🔍 AI Search Jobs - Starting search process');
    console.log('📝 Search Query:', searchDto.query);
    console.log('👤 Candidate Profile:', {
      experience: searchDto.profile.experience,
      skills: searchDto.profile.skills,
      hasResumeContent: !!searchDto.profile.resumeContent
    });

    try {
      console.log('🔧 Step 1: Enhancing query with profile context');
      const enhancedQuery = this.enhanceQueryWithProfile(
        searchDto.query,
        searchDto.profile,
      );
      console.log('✅ Enhanced query created, length:', enhancedQuery.length);

      console.log('🤖 Step 2: Generating AI analysis');
      const aiAnalysis = await this.generateSearchAnalysis(
        enhancedQuery,
        searchDto.profile,
      );
      console.log('✅ AI analysis generated, length:', aiAnalysis.length);

      console.log('📊 Step 3: Fetching active jobs from database');
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

      console.log('🎯 Step 4: Scoring jobs against candidate profile');
      const scoredJobs = await this.scoreJobsForCandidate(
        allJobs,
        searchDto.profile,
        searchDto.query,
      );
      console.log('✅ Jobs scored, total:', scoredJobs.length);

      console.log('🔍 Step 5: Filtering and sorting by relevance');
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
        aiAnalysis,
        searchStrategy: 'AI-powered job matching based on profile analysis',
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

  private async generateSearchAnalysis(
    enhancedQuery: string,
    profile: CandidateProfile,
  ): Promise<string> {
    console.log('🤖 Generating AI search analysis');
    console.log('📊 Enhanced query length:', enhancedQuery.length);
    
    try {
      console.log('🔄 Creating prompt template');
      const promptTemplate = PromptTemplate.fromTemplate(`
Analyze this job search request and provide insights:

{enhancedQuery}

Provide a brief analysis covering:
1. Key search intent
2. Recommended job types based on profile
3. Skills alignment opportunities
4. Career growth suggestions

Keep the response concise and actionable.`);

      console.log('🔄 Sending request to AI model');
      const chain = promptTemplate.pipe(this.model);
      const result = await chain.invoke({ enhancedQuery });
      
      const analysis = result.content as string;
      console.log('✅ AI analysis generated successfully, length:', analysis.length);
      console.log('📝 Analysis preview:', analysis.substring(0, 100) + '...');
      return analysis;
    } catch (error) {
      console.error('❌ Failed to generate AI analysis:', error.message);
      this.logger.error('Failed to generate search analysis', error.message);
      const fallbackAnalysis = 'AI analysis temporarily unavailable. Showing relevant job matches based on your profile.';
      console.log('🔄 Using fallback analysis');
      return fallbackAnalysis;
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
        const scoringResult = await this.scoreCandidate(
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
    aiAnalysis: string;
    searchStrategy: string;
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
        avgRelevance: scoredJobs.reduce((sum, job) => sum + job.relevanceScore, 0) / scoredJobs.length || 0
      });

      return {
        jobs: scoredJobs,
        aiAnalysis:
          'Basic search performed. AI analysis temporarily unavailable.',
        searchStrategy: 'Keyword-based search fallback',
      };
    } catch (error) {
      console.error('❌ Basic job search failed:', error.message);
      this.logger.error('Failed to perform basic job search', error.message);
      return {
        jobs: [],
        aiAnalysis: 'Search temporarily unavailable. Please try again later.',
        searchStrategy: 'Error fallback',
      };
    }
  }
}
