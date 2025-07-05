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
import { CompanyService } from './company.service';
import {
  CreateCompanyDto,
  GetCompaniesDto,
  UpdateCompanyDto,
} from './dto/company.dto';
@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.RECRUITER)
@Controller('company')
//TODO: here have some routes for only for super admin, do it letter.
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @Get()
  getAllCompanies(@Query() query: GetCompaniesDto) {
    return this.companyService.findAll(query);
  }

  @Get(':id')
  getCompanyById(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @Post()
  createCompany(@GetUser('id') userId: string, @Body() body: CreateCompanyDto) {
    return this.companyService.create(userId, body);
  }

  @Patch(':id')
  updateCompany(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @Body() body: UpdateCompanyDto,
  ) {
    return this.companyService.update(id, userId, body);
  }

  @Delete(':id')
  removeCompany(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.companyService.remove(id, userId);
  }
}
