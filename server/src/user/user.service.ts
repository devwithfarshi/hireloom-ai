import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async getMe(user: User) {
    const companyID = await this.prisma.company.findUnique({
      where: {
        companyUserId: user.id,
      },
      select: {
        id: true,
        name: true,
        industry: true,
        location: true,
        companySize: true,
        createdAt: true,
      },
    });
    if (companyID) {
      return {
        ...user,
        company: companyID,
      };
    }
    const candidateProfileID = await this.prisma.candidateProfile.findUnique({
      where: {
        candidateUserId: user.id,
      },
      select: {
        id: true,
        skills: true,
        openToRemote: true,
        location: true,
        experience: true,
        socialLinks: true,
      },
    });
    if (candidateProfileID) {
      return {
        ...user,
        candidateProfile: candidateProfileID,
      };
    }
    return user;
  }
  async updateUser(userId: string, updatedBody: Partial<User>) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...updatedBody,
      },
    });
  }
}
