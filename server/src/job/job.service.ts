import { Injectable, NotFoundException } from '@nestjs/common';
import { Job, User } from '@prisma/client';
import { PaginatedResult, paginatePrisma } from 'src/helpers/paginate-prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateJobDto, GetJobsDto, UpdateJobDto } from './dto/job.dto';

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: GetJobsDto): Promise<PaginatedResult<Job>> {
    const { limit, page, search, location, employmentType, active } = query;

    const whereConditions = {
      ...(search && {
        title: { contains: search, mode: 'insensitive' as const },
      }),
      ...(location && { location }),
      ...(employmentType && { employmentType }),
      ...(active !== undefined && { active }),
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
    const { limit, page, search, location, employmentType, active } = query;
    const company = await this.prisma.company.findUnique({
      where: {
        userId: user.id,
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
        userId: user.id,
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
}
