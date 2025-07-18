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
import { Role, User } from '@prisma/client';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateJobDto, GetJobsDto, UpdateJobDto } from './dto/job.dto';
import { JobService } from './job.service';

@UseGuards(JwtGuard, RolesGuard)
@Controller('jobs')
export class JobController {
  constructor(private jobService: JobService) {}

  @Get()
  getAllJobs(@Query() query: GetJobsDto) {
    return this.jobService.findAll(query);
  }

  @Roles(Role.RECRUITER)
  @Get('company')
  getCompanyJobs(@GetUser() user: User, @Query() query: GetJobsDto) {
    return this.jobService.findAllByCompany(user, query);
  }

  @Get(':id')
  getJobById(@Param('id') id: string) {
    return this.jobService.findOne(id);
  }

  @Roles(Role.RECRUITER)
  @Post()
  createJob(@GetUser() user: User, @Body() createJobDto: CreateJobDto) {
    return this.jobService.create(user, createJobDto);
  }

  @Roles(Role.RECRUITER)
  @Patch(':id')
  updateJob(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobService.update(id, updateJobDto);
  }

  @Roles(Role.RECRUITER)
  @Delete(':id')
  removeJob(@Param('id') id: string) {
    return this.jobService.remove(id);
  }
}
