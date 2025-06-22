import { forwardRef, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './scheduler.service';
import { JobsModule } from '../jobs.module';

@Module({
  imports: [
    ScheduleModule.forRoot(), 
    forwardRef(() => JobsModule)
  ],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}