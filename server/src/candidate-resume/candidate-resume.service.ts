import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';
import * as pdfParse from 'pdf-parse';

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

  async getResumeContent(candidateUserId: string): Promise<string> {
    const resume = await this.prisma.candidateResume.findFirst({
      where: {
        candidateUserId,
      },
    });
    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    try {
      // Get the file buffer from S3
      const fileBuffer = await this.s3Service.getFile(resume.s3Key);
      
      // Parse PDF content if it's a PDF file
      if (resume.fileType === 'application/pdf') {
        const pdfData = await pdfParse(fileBuffer);
        
        // Ensure we have meaningful text content
        if (!pdfData.text || pdfData.text.trim().length === 0) {
          throw new Error('PDF contains no readable text content');
        }
        
        return pdfData.text.trim();
      }
      
      // For other file types (like .txt, .docx), attempt to read as text
      const textContent = fileBuffer.toString('utf-8');
      if (!textContent || textContent.trim().length === 0) {
        throw new Error('File contains no readable text content');
      }
      
      return textContent.trim();
    } catch (error) {
      throw new Error(`Failed to parse resume content: ${error.message}`);
    }
  }
}
