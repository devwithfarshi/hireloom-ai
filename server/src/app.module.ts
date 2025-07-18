import { Module } from '@nestjs/common';
import { ApplicationModule } from './application/application.module';
import { AuthModule } from './auth/auth.module';
import { CandidateProfileModule } from './candidate-profile/candidate-profile.module';
import { CandidateResumeModule } from './candidate-resume/candidate-resume.module';
import { CompanyModule } from './company/company.module';
import { ConfigModule } from './config/config.module';
import { EmailModule } from './email/email.module';
import { JobModule } from './job/job.module';
import { PrismaModule } from './prisma/prisma.module';
import { S3Module } from './s3/s3.module';
import { ScoringModule } from './scoring/scoring.module';
import { UserModule } from './user/user.module';
import { AgentModule } from './agent/agent.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    AuthModule,
    EmailModule,
    UserModule,
    CompanyModule,
    CandidateProfileModule,
    JobModule,
    ApplicationModule,
    S3Module,
    CandidateResumeModule,
    ScoringModule,
    AgentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
