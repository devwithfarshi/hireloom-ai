import { Module } from '@nestjs/common';
import { CompanyController } from './company.contoller';
import { CompanyService } from './company.service';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
