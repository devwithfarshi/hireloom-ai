import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CandidateProfileService } from './candidate-profile.service';
import { CreateCandidateProfileDto, UpdateCandidateProfileDto } from './dto/candidate-profile.dto';

@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.CANDIDATE)
@Controller('candidate-profile')
export class CandidateProfileController {
  constructor(private candidateProfileService: CandidateProfileService) {}

  @Post()
  createProfile(
    @GetUser('id') userId: string,
    @Body() body: CreateCandidateProfileDto,
  ) {
    return this.candidateProfileService.create(userId, body);
  }

  @Get()
  getProfile(@GetUser('id') userId: string) {
    return this.candidateProfileService.findByUserId(userId);
  }

  @Put()
  updateProfile(
    @GetUser('id') userId: string,
    @Body() body: UpdateCandidateProfileDto,
  ) {
    return this.candidateProfileService.update(userId, body);
  }
}