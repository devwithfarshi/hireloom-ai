import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
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
