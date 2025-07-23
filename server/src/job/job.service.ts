import { Injectable, NotFoundException, MessageEvent } from '@nestjs/common';
import { PaginatedResult, paginatePrisma } from 'src/helpers/paginate-prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { AgentService } from 'src/agent/agent.service';
import { CandidateResumeService } from 'src/candidate-resume/candidate-resume.service';
import { Observable, Subject } from 'rxjs';
import {
  AiJobSearchDto,
  CreateJobDto,
  GetJobsDto,
  UpdateJobDto,
} from './dto/job.dto';
import { Job, User } from '@prisma/client';

@Injectable()
export class JobService {
  constructor(
    private prisma: PrismaService,
    private agentService: AgentService,
    private candidateResumeService: CandidateResumeService,
  ) {}

  async findAll(query: GetJobsDto): Promise<PaginatedResult<Job>> {
    const { limit, page, search, location, employmentType, active, isRemote } =
      query;

    const whereConditions = {
      ...(search && {
        title: { contains: search, mode: 'insensitive' as const },
      }),
      ...(location && { location }),
      ...(employmentType && { employmentType }),
      ...(active !== undefined && { active }),
      ...(isRemote !== undefined && { isRemote }),
    };

    return paginatePrisma(
      this.prisma.job,
      { page, limit },
      {
        where: whereConditions,
        orderBy: { createdAt: 'desc' },
      },
    );
  }

  async findAllByCompany(
    user: User,
    query: GetJobsDto,
  ): Promise<PaginatedResult<Job>> {
    const { limit, page, search, location, employmentType, active, isRemote } =
      query;
    const company = await this.prisma.company.findUnique({
      where: {
        companyUserId: user.id,
      },
      select: {
        id: true,
      },
    });
    if (!company) {
      throw new NotFoundException(`Company not found`);
    }
    const whereConditions = {
      companyId: company.id,
      ...(search && {
        title: { contains: search, mode: 'insensitive' as const },
      }),
      ...(location && { location }),
      ...(employmentType && { employmentType }),
      ...(active !== undefined && { active }),
      ...(isRemote !== undefined && { isRemote }),
    };

    return paginatePrisma(
      this.prisma.job,
      { page, limit },
      {
        where: whereConditions,
        orderBy: { createdAt: 'desc' },
      },
    );
  }

  async create(user: User, createJobDto: CreateJobDto): Promise<Job> {
    const company = await this.prisma.company.findUnique({
      where: {
        companyUserId: user.id,
      },
      select: {
        id: true,
      },
    });
    if (!company) {
      throw new NotFoundException(`Company not found`);
    }

    return this.prisma.job.create({
      data: {
        ...createJobDto,
        companyId: company.id,
      },
    });
  }

  async findOne(id: string): Promise<Job> {
    const job = await this.prisma.job.findUnique({
      where: { id },
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
    });

    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }

    return job;
  }

  async update(id: string, updateJobDto: UpdateJobDto): Promise<Job> {
    // Check if job exists
    await this.findOne(id);

    return this.prisma.job.update({
      where: { id },
      data: updateJobDto,
    });
  }

  async remove(id: string): Promise<Job> {
    // Check if job exists
    await this.findOne(id);

    return this.prisma.job.delete({
      where: { id },
    });
  }
  async aiSearch(userId: string, body: AiJobSearchDto) {
    // Get candidate profile
    const candidateProfile = await this.prisma.candidateProfile.findUnique({
      where: {
        candidateUserId: userId,
      },
      include: {
        CandidateResume: true,
      },
    });

    if (!candidateProfile) {
      throw new NotFoundException('Candidate profile not found');
    }

    // Get actual resume content
    let resumeContent = 'No resume uploaded';
    if (
      candidateProfile.CandidateResume &&
      Object.keys(candidateProfile.CandidateResume).length > 0
    ) {
      try {
        resumeContent =
          await this.candidateResumeService.getResumeContent(userId);
      } catch (error) {
        // Fallback if resume parsing fails
        resumeContent = 'Resume uploaded but could not be parsed';
      }
    }

    // Prepare candidate profile for AI search
    const profileForSearch = {
      experience: candidateProfile.experience,
      skills: candidateProfile.skills,
      resumeContent,
    };

    // Perform AI search using injected AgentService
    return this.agentService.aiSearchJobs(
      {
        query: body.query,
        profile: profileForSearch,
      },
      this.prisma,
    );
  }

  aiSearchStream(userId: string, query: string, token?: string): Observable<MessageEvent> {
    const subject = new Subject<MessageEvent>();
    
    // Start the streaming process asynchronously
    this.performStreamingAiSearch(userId, query, subject, token);
    
    return subject.asObservable();
  }

  private async performStreamingAiSearch(
    userId: string,
    query: string,
    subject: Subject<MessageEvent>,
    token?: string,
  ): Promise<void> {
    try {
      // Validate token if provided (basic validation)
      if (token) {
        // You can add JWT validation here if needed
        // For now, we'll proceed with the search
      }

      // Send initial status
      subject.next({
        data: JSON.stringify({
          type: 'status',
          message: 'Initializing AI search...',
          progress: 0,
        }),
      } as MessageEvent);

      // Get candidate profile
      const candidateProfile = await this.prisma.candidateProfile.findUnique({
        where: { candidateUserId: userId },
        include: { CandidateResume: true },
      });

      if (!candidateProfile) {
        subject.error(new NotFoundException('Candidate profile not found'));
        return;
      }

      // Get resume content
      let resumeContent = 'No resume uploaded';
      if (
        candidateProfile.CandidateResume &&
        Object.keys(candidateProfile.CandidateResume).length > 0
      ) {
        try {
          resumeContent = await this.candidateResumeService.getResumeContent(userId);
        } catch (error) {
          resumeContent = 'Resume uploaded but could not be parsed';
        }
      }

      const profileForSearch = {
        experience: candidateProfile.experience,
        skills: candidateProfile.skills,
        resumeContent,
      };

      subject.next({
        data: JSON.stringify({
          type: 'status',
          message: 'Profile loaded, fetching jobs...',
          progress: 10,
        }),
      } as MessageEvent);

      // Perform streaming AI search
      await this.agentService.aiSearchJobsStream(
        { query, profile: profileForSearch },
        this.prisma,
        subject,
      );

      subject.complete();
    } catch (error) {
      subject.error(error);
    }
  }
}
