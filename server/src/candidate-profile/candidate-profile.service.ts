import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCandidateProfileDto, UpdateCandidateProfileDto } from './dto/candidate-profile.dto';

@Injectable()
export class CandidateProfileService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: CreateCandidateProfileDto) {
    // Check if profile already exists for user
    const profileExists = await this.prisma.candidateProfile.findUnique({
      where: {
        userId,
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

    return await this.prisma.candidateProfile.create({
      data: {
        location: data.location,
        openToRemote: data.openToRemote || false,
        resumeUrl: data.resumeUrl,
        skills: data.skills,
        experience: data.experience,
        userId,
      },
    });
  }

  async findByUserId(userId: string) {
    const profile = await this.prisma.candidateProfile.findUnique({
      where: { userId },
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

  async update(userId: string, data: UpdateCandidateProfileDto) {
    // Check if profile exists
    const profile = await this.prisma.candidateProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException(`Profile for user ID ${userId} not found`);
    }

    return await this.prisma.candidateProfile.update({
      where: { userId },
      data,
    });
  }
}