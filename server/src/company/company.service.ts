import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { paginatePrisma, PaginatedResult } from 'src/helpers';
import {
  CreateCompanyDto,
  GetCompaniesDto,
  UpdateCompanyDto,
} from './dto/company.dto';
import { Company } from '@prisma/client';
@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}
  async findAll(query: GetCompaniesDto): Promise<PaginatedResult<Company>> {
    const { limit, page, industry, search } = query;

    const whereConditions = {
      ...(search && {
        name: { contains: search, mode: 'insensitive' as const },
      }),
      ...(industry && { industry }),
    };

    const include = {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    };
    const data = await paginatePrisma<Company>(
      this.prisma.company,
      { page, limit },
      {
        where: whereConditions,
        include,
        orderBy: { createdAt: 'desc' },
      },
    );
    return data;
  }
  async create(userId: string, data: CreateCompanyDto) {
    const companyExistForUser = await this.prisma.company.findUnique({
      where: {
        userId,
      },
    });
    if (companyExistForUser) {
      throw new BadRequestException('Company already exists for user');
    }
    return await this.prisma.company.create({
      data: {
        name: data.name,
        industry: data.industry,
        location: data.location,
        userId,
      },
    });
  }

  async findOne(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
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
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return company;
  }

  async update(id: string, userId: string, data: UpdateCompanyDto) {
    const company = await this.prisma.company.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!company) {
      throw new NotFoundException(
        `Company with ID ${id} not found or you don't have permission to update it`,
      );
    }

    return await this.prisma.company.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, userId: string) {
    const company = await this.prisma.company.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!company) {
      throw new NotFoundException(
        `Company with ID ${id} not found or you don't have permission to delete it`,
      );
    }

    return await this.prisma.company.delete({
      where: { id },
    });
  }
}
