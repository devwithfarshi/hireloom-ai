import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [ConfigModule, PrismaModule, AuthModule, EmailModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
