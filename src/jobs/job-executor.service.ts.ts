import { Injectable, Logger } from '@nestjs/common';
import { Job, JobDocument } from './schema/job.schema';

@Injectable()
export class JobExecutor {
  private readonly logger = new Logger(JobExecutor.name);

  async execute(job: JobDocument): Promise<void> {
    try {
      if (!job.parameters || typeof job.parameters !== 'object') {
        throw new Error('Invalid job Parameters');
      }

      switch (job.type) {
        case 'email':
          await this.executeEmailJob(job);
          break;
        case 'notification':
          await this.executeNotificationJob(job);
          break;
        case 'data-processing':
          await this.executeDataProcessingJob(job);
          break;
        default:
          throw new Error(`Unsupported job type: ${job.type}`);
      }
    } catch (error) {
      this.logger.error(`Job execution failed for ${job.name}: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async executeEmailJob(job: Job): Promise<void> {
    this.logger.log(`Executing email job ${job.name} with parameters: ${JSON.stringify(job.parameters)}`);
  }

  private async executeNotificationJob(job: Job): Promise<void> {
    this.logger.log(`Executing notification job ${job.name} with parameters: ${JSON.stringify(job.parameters)}`);
  }

  private async executeDataProcessingJob(job: Job): Promise<void> {
    this.logger.log(`Executing data processing job ${job.name} with parameters: ${JSON.stringify(job.parameters)}`);
  }
}