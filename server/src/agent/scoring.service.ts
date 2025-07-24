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

@Injectable()
export class ScoringService {
  private readonly logger = new Logger(ScoringService.name);
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
   * Faster candidate scoring with reduced AI calls
   */
  async scoreCandidateFast(
    jobRequirements: JobRequirements,
    candidateProfile: CandidateProfile,
  ): Promise<ScoringResult> {
    // Use fallback scoring for speed, with occasional AI calls for high-potential matches
    const quickScore = this.calculateQuickScore(jobRequirements, candidateProfile);
    
    // Only use AI for potentially high-scoring matches (>60)
    if (quickScore > 60 && Math.random() < 0.3) { // 30% chance for AI scoring on good matches
      try {
        return await this.scoreCandidate(jobRequirements, candidateProfile);
      } catch (error) {
        console.log('🔄 AI scoring failed, using quick score');
        return this.generateQuickScoringResult(jobRequirements, candidateProfile, quickScore);
      }
    }
    
    return this.generateQuickScoringResult(jobRequirements, candidateProfile, quickScore);
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

  private calculateQuickScore(
    jobRequirements: JobRequirements,
    candidateProfile: CandidateProfile,
  ): number {
    let score = 40; // Base score

    // Experience scoring (30 points max)
    const experienceRatio = candidateProfile.experience / Math.max(jobRequirements.experience, 1);
    if (experienceRatio >= 1) score += 30;
    else if (experienceRatio >= 0.7) score += 20;
    else if (experienceRatio >= 0.5) score += 10;

    // Skills matching (30 points max)
    const matchingSkills = candidateProfile.skills.filter(skill =>
      jobRequirements.tags.some(tag =>
        tag.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(tag.toLowerCase())
      )
    );
    const skillsRatio = matchingSkills.length / Math.max(jobRequirements.tags.length, 1);
    score += skillsRatio * 30;

    return Math.min(100, Math.round(score));
  }

  private generateQuickScoringResult(
    jobRequirements: JobRequirements,
    candidateProfile: CandidateProfile,
    score: number,
  ): ScoringResult {
    const matchingSkills = candidateProfile.skills.filter(skill =>
      jobRequirements.tags.some(tag =>
        tag.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(tag.toLowerCase())
      )
    );

    return {
      score,
      reasoning: `Quick analysis: ${score}% match based on experience and skills alignment`,
      strengths: matchingSkills.length > 0 
        ? [`Matching skills: ${matchingSkills.slice(0, 3).join(', ')}`]
        : ['Profile available for review'],
      weaknesses: matchingSkills.length === 0 
        ? ['Limited skill overlap detected']
        : ['Detailed analysis pending'],
      recommendations: [
        'Review job details for full assessment',
        score > 70 ? 'Strong candidate - consider applying' : 'Evaluate fit carefully'
      ],
    };
  }
}