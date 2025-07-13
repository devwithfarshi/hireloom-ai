import {
  Controller,
  FileTypeValidator,
  Get,
  InternalServerErrorException,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CandidateResumeService } from './candidate-resume.service';
@UseGuards(JwtGuard)
@Controller('candidate-resume')
export class CandidateResumeController {
  constructor(
    private readonly candidateResumeService: CandidateResumeService,
  ) {}
  @Post('upload')
  @UseInterceptors(FileInterceptor('resume'))
  async uploadResume(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({ fileType: 'pdf' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    const uploadedResponse = await this.candidateResumeService.uploadResume({
      user,
      file,
    });

    if (uploadedResponse) {
      return {
        message: 'Resume uploaded successfully',
      };
    } else {
      throw new InternalServerErrorException('Failed to upload resume');
    }
  }
  @Get('by-candidate-id')
  async getResumeByCandidateId(@GetUser() user: User) {
    const resume = await this.candidateResumeService.getResumeByCandidateId(
      user.id,
    );
    return resume;
  }

  @Get('by-candidate-id/:candidateId')
  async getResumeByCandidateIdParam(@Param('candidateId') candidateId: string) {
    const resume = await this.candidateResumeService.getResumeByCandidateId(
      candidateId,
    );
    return resume;
  }
}
