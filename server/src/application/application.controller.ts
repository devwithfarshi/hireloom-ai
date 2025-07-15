import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApplicationService } from './application.service';
import {
  CreateApplicationDto,
  GetApplicationsDto,
  UpdateApplicationDto,
} from './dto/application.dto';

@Controller('applications')
@UseGuards(JwtGuard, RolesGuard)
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  @Roles(Role.CANDIDATE)
  create(
    @GetUser('id') userId: string,
    @Body() createApplicationDto: CreateApplicationDto,
  ) {
    return this.applicationService.create(userId, createApplicationDto);
  }

  @Get('my-applications')
  @Roles(Role.CANDIDATE)
  findMyApplications(
    @GetUser('id') userId: string,
    @Query() query: GetApplicationsDto,
  ) {
    return this.applicationService.findByCandidate(userId, query);
  }

  @Get('job/:jobId')
  @Roles(Role.RECRUITER)
  findByJob(@Param('jobId') jobId: string, @Query() query: GetApplicationsDto) {
    return this.applicationService.findByJob(jobId, query);
  }

  @Get()
  @Roles(Role.RECRUITER, Role.SUPER_ADMIN)
  findAll(@Query() query: GetApplicationsDto) {
    return this.applicationService.findAll(query);
  }

  @Get(':id')
  @Roles(Role.RECRUITER, Role.CANDIDATE, Role.SUPER_ADMIN)
  findOne(@Param('id') id: string) {
    return this.applicationService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.RECRUITER, Role.SUPER_ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ) {
    return this.applicationService.update(id, updateApplicationDto);
  }

  @Delete(':id')
  @Roles(Role.RECRUITER, Role.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.applicationService.remove(id);
  }
  @Patch('/:jobId/start-scoring')
  @Roles(Role.RECRUITER, Role.SUPER_ADMIN)
  startScoring(@Param('jobId') jobId: string) {
    return this.applicationService.startScoring(jobId);
  }
}
