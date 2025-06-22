// src/jobs/jobs.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { Job, JobSchema } from './schema/job.schema';
import { SchedulerModule } from './scheduler/scheduler.module';
import { JobExecutor } from './job-executor.service.ts';
import { SchedulerService } from './scheduler/scheduler.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }]),
    forwardRef(() => SchedulerModule),
  ],
  controllers: [JobsController],
  providers: [JobsService, JobExecutor],
  exports: [JobsService, JobExecutor], // Export JobExecutor as well
})
export class JobsModule { }