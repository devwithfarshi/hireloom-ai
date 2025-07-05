import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { UserModule } from './user/user.module';
import { CompanyModule } from './company/company.module';
import { CandidateProfileModule } from './candidate-profile/candidate-profile.module';
import { JobModule } from './job/job.module';
import { ApplicationModule } from './application/application.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
