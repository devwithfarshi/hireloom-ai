import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async getMe(user: User) {
    const companyID = await this.prisma.company.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
      },
    });
    if (companyID) {
      return {
        ...user,
        companyID: companyID.id,
      };
    }
    const candidateProfileID = await this.prisma.candidateProfile.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
      },
    });
    if (candidateProfileID) {
      return {
        ...user,
        candidateProfileID: candidateProfileID.id,
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
