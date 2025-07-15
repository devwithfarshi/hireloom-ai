import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class CandidateResumeService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly prisma: PrismaService,
  ) {}
  async uploadResume(data: { file: Express.Multer.File; user: User }) {
    const fileName = `${
      [data.user?.firstName, data.user?.lastName]
        .filter((n): n is string => !!n)
        .map((n) => n.toLowerCase().trim())
        .join('-') || 'resume'
    }.${data.file.originalname.split('.').pop()}`;
    const key = `resume/${data.user.id}/${fileName}`;
    await this.s3Service.upload({
      file: data.file.buffer,
      Key: key,
    });
    const existResume = await this.prisma.candidateResume.findFirst({
      where: {
        candidateUserId: data.user.id,
        s3Key: key,
        fileType: data.file.mimetype,
      },
    });
    if (existResume) {
      return true;
    }

    const resume = await this.prisma.candidateResume.create({
      data: {
        candidateUserId: data.user.id,
        s3Key: key,
        originalName: fileName,
        fileType: data.file.mimetype,
      },
    });
    if (!resume) {
      throw new NotFoundException('Resume not found');
    }
    return true;
  }
  async getResumeByCandidateId(candidateUserId: string) {
    const resume = await this.prisma.candidateResume.findFirst({
      where: {
        candidateUserId,
      },
    });
    if (!resume) {
      throw new NotFoundException('Resume not found');
    }
    const url = await this.s3Service.getSignedUrl(resume.s3Key);
    return {
      url,
    };
  }
}
