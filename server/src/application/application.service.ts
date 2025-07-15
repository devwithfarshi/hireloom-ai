import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Application, ApplicationStatus, Job, Role } from '@prisma/client';
import { PaginatedResult, paginatePrisma } from 'src/helpers/paginate-prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateApplicationDto,
  GetApplicationsDto,
  UpdateApplicationDto,
} from './dto/application.dto';

@Injectable()
export class ApplicationService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    data: CreateApplicationDto,
  ): Promise<Application> {
    // Check if user is a candidate
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { candidateProfile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== Role.CANDIDATE) {
      throw new BadRequestException('Only candidates can apply for jobs');
    }

    if (!user.candidateProfile) {
      throw new BadRequestException('Candidate profile not found');
    }

    // Check if job exists and is active
    const job = await this.prisma.job.findUnique({
      where: { id: data.jobId },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (!job.active) {
      throw new BadRequestException('Cannot apply to inactive job');
    }

    // Check if user has already applied to this job
    const existingApplication = await this.prisma.application.findFirst({
      where: {
        candidateUserId: userId,
        jobId: data.jobId,
      },
    });

    if (existingApplication) {
      throw new BadRequestException('You have already applied to this job');
    }

    // Create application
    return this.prisma.application.create({
      data: {
        candidateUserId: userId,
        jobId: data.jobId,
        status: ApplicationStatus.PENDING,
      },
    });
  }

  async findAll(
    query: GetApplicationsDto,
  ): Promise<PaginatedResult<Application>> {
    const { status, page = 1, limit = 10 } = query;

    const whereConditions = {
      ...(status && { status }),
    };

    return paginatePrisma(
      this.prisma.application,
      { page, limit },
      {
        where: whereConditions,
        orderBy: { createdAt: 'desc' as const },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              company: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          candidate: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              candidateProfile: {
                select: {
                  id: true,
                  experience: true,
                  skills: true,
                },
              },
            },
          },
        },
      },
    );
  }

  async findByCandidate(
    candidateId: string,
    query: GetApplicationsDto,
  ): Promise<PaginatedResult<Application>> {
    const { status, page = 1, limit = 9 } = query;

    const whereConditions = {
      candidateId,
      ...(status && { status }),
    };

    return paginatePrisma(
      this.prisma.application,
      { page, limit },
      {
        where: whereConditions,
        orderBy: { createdAt: 'desc' as const },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              location: true,
              employmentType: true,
              company: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    );
  }

  async findByJob(
    jobId: string,
    query: GetApplicationsDto,
  ): Promise<PaginatedResult<Application>> {
    const { status, page = 1, limit = 10 } = query;

    const whereConditions = {
      jobId,
      ...(status && { status }),
    };

    return paginatePrisma(
      this.prisma.application,
      { page, limit },
      {
        where: whereConditions,
        orderBy: { createdAt: 'desc' as const },
        include: {
          candidate: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              candidateProfile: {
                select: {
                  id: true,
                  experience: true,
                  skills: true,
                },
              },
            },
          },
        },
      },
    );
  }

  async findOne(id: string): Promise<Application> {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            description: true,
            location: true,
            employmentType: true,
            company: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        candidate: {
          select: {
            id: true,
            experience: true,
            skills: true,
          },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }

    return application;
  }

  async update(id: string, data: UpdateApplicationDto): Promise<Application> {
    await this.findOne(id);

    return this.prisma.application.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.prisma.application.delete({
      where: { id },
    });
  }

  async startScoring(jobId: string): Promise<Job> {
    const job = await this.prisma.job.update({
      where: {
        id: jobId,
      },
      data: {
        isScoring: true,
        active: false,
      },
      include: {
        applications: {
          select: {
            id: true,
            candidateUserId: true,
          },
        },
      },
    });
    if (!job) {
      throw new BadRequestException('Job not found');
    }

    return job;
  }
}
