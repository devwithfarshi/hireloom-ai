import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { BullConfigModule } from 'src/bull/bull.module';
import { EmailProcessor } from './email.processor';
import { EmailService } from './email.service';

@Module({
  imports: [
    BullConfigModule,
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  providers: [EmailService, EmailProcessor],
  exports: [EmailService],
})
export class EmailModule {}
