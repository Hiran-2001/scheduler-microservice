// src/scheduler/scheduler.service.ts
import { forwardRef, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { JobDocument } from '../schema/job.schema';
import { JobsService } from '../jobs.service';
import { JobExecutor } from '../job-executor.service.ts';

@Injectable()
export class SchedulerService implements OnModuleInit {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    @Inject(forwardRef(()=> JobsService))
    private jobsService: JobsService,
    private jobExecutor: JobExecutor,
  ) { }

  async onModuleInit() {
    try {
      const activeJobs = await this.jobsService.findAll({ page: 1, limit: 1000 }).then(res => res.data.filter(job => job.isActive));      
      await Promise.all(activeJobs.map(job => this.scheduleJob(job)));
      this.logger.log(`Rescheduled ${activeJobs.length} active jobs on startup`);
    } catch (error) {
      this.logger.error('Failed to reschedule jobs on startup', error.stack);
      throw new Error('Initialization failed', error);
    }
  }

  async scheduleJob(job: any): Promise<void> { 
    try {
      if (!job.isActive || job.status === 'cancelled') {
        throw new Error(`Job ${job.name} is not active or cancelled`);
      }

      const cronJob = new CronJob(
        job.schedule,
        async () => await this.executeJob(job._id.toString()),
        null,
        true,
      );
      cronJob.start();
      this.logger.log(`Started CronJob for ${job.name} with schedule ${job.schedule}`);

      this.logger.log(`Scheduled job: ${job.name} (${job._id})`);
    } catch (error) {
      this.logger.error(`Failed to schedule job ${job.name}`, error.stack);
    }
  }

  async unscheduleJob(jobId: string): Promise<void> {
    try {

      const job = await this.jobsService.findOne(jobId) as JobDocument;
      if (!job.isActive) {
        throw new Error(`Job ${jobId} is already inactive`);
      }

      await this.jobsService.updateJobStatus(jobId, 'cancelled');
      job.isActive = false;
      await job.save();
      this.logger.log(`Unscheduled job: ${jobId}`);
    } catch (error) {
      throw new Error(`Failed to unschedule job ${jobId}`, error);
    } 
  }

  private async executeJob(jobId: string): Promise<void> {
    try {
      const job = await this.jobsService.findOne(jobId);
      if (!job.isActive) return;

      this.logger.log(`Executing job: ${job.name} (${jobId})`);

      await this.jobsService.updateJobStatus(jobId, 'running');

      await this.jobExecutor.execute(job);

      await this.jobsService.updateJobStatus(jobId, 'completed');

      this.logger.log(`Job completed: ${job.name} (${jobId})`);

    } catch (error) {
      await this.jobsService.updateJobStatus(jobId, 'failed', error.message);
      this.logger.error(`Job failed: ${jobId}`, error.stack);
      throw error;
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async cleanupStaleJobs(): Promise<void> {
    const logger = this.logger;
    try {
      const staleJobs = await this.jobsService['jobModel'].find({
        status: 'running',
        updatedAt: { $lt: new Date(Date.now() - 3600000) },
      });

      for (const job of staleJobs) {
        await this.jobsService.updateJobStatus(job._id, 'failed', 'Job timed out');
      }

      logger.log(`Cleaned up ${staleJobs.length} stale jobs`);
    } catch (error) {
      logger.error('Failed to cleanup stale jobs', error.stack);
    }
  }
}