import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
export class AgentService {
  private readonly logger = new Logger(AgentService.name);
  private readonly genAI: GoogleGenerativeAI;
  private readonly model;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  /**
   * Scores a candidate against job requirements using Gemini AI
   */
  async scoreCandidate(
    jobRequirements: JobRequirements,
    candidateProfile: CandidateProfile,
  ): Promise<ScoringResult> {
    try {
      const prompt = this.buildScoringPrompt(jobRequirements, candidateProfile);

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseScoringResponse(text);
    } catch (error) {
      this.logger.error('Failed to score candidate with Gemini AI', {
        error: error.message,
        jobTitle: jobRequirements.title,
      });

      // Fallback scoring in case of AI failure
      return this.generateFallbackScore(jobRequirements, candidateProfile);
    }
  }

  /**
   * Extracts text content from resume using Gemini AI
   */
  async extractResumeContent(resumeText: string): Promise<string> {
    try {
      const prompt = `
Extract and summarize the key information from this resume in a structured format:

Resume Content:
${resumeText}

Please provide:
1. Professional summary
2. Key skills and technologies
3. Work experience highlights
4. Education background
5. Notable achievements

Format the response in clear, concise bullet points.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      this.logger.error('Failed to extract resume content', error.message);
      return resumeText; // Return original text as fallback
    }
  }

  private buildScoringPrompt(
    jobRequirements: JobRequirements,
    candidateProfile: CandidateProfile,
  ): string {
    return `
You are an expert ATS (Applicant Tracking System) that evaluates candidates for job positions. 
Analyze the candidate against the job requirements and provide a comprehensive scoring.

JOB REQUIREMENTS:
- Title: ${jobRequirements.title}
- Employment Type: ${jobRequirements.employmentType}
- Required Experience: ${jobRequirements.experience} years
- Required Skills/Tags: ${jobRequirements.tags.join(', ')}
- Job Description: ${jobRequirements.description}

CANDIDATE PROFILE:
- Experience: ${candidateProfile.experience} years
- Skills: ${candidateProfile.skills.join(', ')}
${candidateProfile.resumeContent ? `- Resume Content: ${candidateProfile.resumeContent}` : ''}

Please provide your analysis in the following JSON format:
{
  "score": <number between 0-100>,
  "reasoning": "<detailed explanation of the score>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "recommendations": ["<recommendation 1>", "<recommendation 2>", "<recommendation 3>"]
}

Scoring Criteria:
- Skills match (30%): How well candidate's skills align with job requirements
- Experience level (25%): Years of experience vs. required experience
- Relevant background (20%): Industry and role relevance
- Education and certifications (15%): Academic qualifications
- Overall fit (10%): Cultural and role-specific fit

Provide only the JSON response, no additional text.`;
  }

  private parseScoringResponse(response: string): ScoringResult {
    try {
      // Clean the response to extract JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        score: Math.max(0, Math.min(100, parsed.score || 0)),
        reasoning: parsed.reasoning || 'No reasoning provided',
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
        recommendations: Array.isArray(parsed.recommendations)
          ? parsed.recommendations
          : [],
      };
    } catch (error) {
      this.logger.error('Failed to parse Gemini AI response', {
        error: error.message,
        response: response.substring(0, 500),
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
    // Simple fallback scoring logic
    let score = 50; // Base score

    // Experience scoring
    const experienceRatio =
      candidateProfile.experience / Math.max(jobRequirements.experience, 1);
    if (experienceRatio >= 1) {
      score += 20;
    } else if (experienceRatio >= 0.7) {
      score += 15;
    } else if (experienceRatio >= 0.5) {
      score += 10;
    }

    // Skills matching
    const matchingSkills = candidateProfile.skills.filter((skill) =>
      jobRequirements.tags.some(
        (tag) =>
          tag.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(tag.toLowerCase()),
      ),
    );

    const skillsMatchRatio =
      matchingSkills.length / Math.max(jobRequirements.tags.length, 1);
    score += skillsMatchRatio * 30;

    return {
      score: Math.max(0, Math.min(100, Math.round(score))),
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
}
