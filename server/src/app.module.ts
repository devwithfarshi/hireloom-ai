import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { UserModule } from './user/user.module';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    AuthModule,
    EmailModule,
    UserModule,
    CompanyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
