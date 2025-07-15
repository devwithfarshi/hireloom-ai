import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ScoringModule } from 'src/scoring/scoring.module';

@Module({
  imports: [PrismaModule, ScoringModule],
  controllers: [ApplicationController],
  providers: [ApplicationService],
  exports: [ApplicationService],
})
export class ApplicationModule {}
