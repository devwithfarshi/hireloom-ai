import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateCandidateProfileDto,
  UpdateCandidateProfileDto,
} from './dto/candidate-profile.dto';

@Injectable()
export class CandidateProfileService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: CreateCandidateProfileDto) {
    const profileExists = await this.prisma.candidateProfile.findUnique({
      where: {
        candidateUserId: userId,
      },
    });

    if (profileExists) {
      throw new BadRequestException('Profile already exists for user');
    }

    // Check if user is a candidate
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== 'CANDIDATE') {
      throw new BadRequestException('Only candidates can create a profile');
    }

    // Prepare the data for Prisma, ensuring socialLinks is properly formatted as JSON
    // Extract socialLinks from the data object
    const { socialLinks, ...restData } = data;

    // Create the prisma data object with the correct type for socialLinks
    const prismaData = {
      ...restData,
      openToRemote: restData.openToRemote || false,
      candidateUserId: userId,
      // Convert socialLinks to plain objects if they exist
      ...(socialLinks && {
        socialLinks: socialLinks.map((link) => ({ ...link })),
      }),
    };

    return await this.prisma.candidateProfile.create({
      data: prismaData,
    });
  }

  async findByUserId(userId: string) {
    const profile = await this.prisma.candidateProfile.findUnique({
      where: { candidateUserId: userId },
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

    if (!profile) {
      throw new NotFoundException(`Profile for user ID ${userId} not found`);
    }

    return profile;
  }

  async update(id: string, userId: string, data: UpdateCandidateProfileDto) {
    const profile = await this.prisma.candidateProfile.findFirst({
      where: {
        id,
        candidateUserId: userId,
      },
    });

    if (!profile) {
      throw new NotFoundException(
        `Profile with ID ${id} not found or you don't have permission to update it`,
      );
    }

    const { socialLinks, ...restData } = data;

    const prismaData = {
      ...restData,
      ...(socialLinks && {
        socialLinks: socialLinks.map((link) => ({ ...link })),
      }),
    };

    return await this.prisma.candidateProfile.update({
      where: { id },
      data: prismaData,
    });
  }
}
