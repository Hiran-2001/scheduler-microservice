// src/jobs/jobs.service.ts
import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';
import { CreateJobDto } from './dto/create-job.dto';
import { Job, JobDocument } from './schema/job.schema';
import { CronExpressionParser } from 'cron-parser'
import { SchedulerService } from './scheduler/scheduler.service';

interface FindAllOptions {
    page: number;
    limit: number;
    status?: string;
    type?: string;
}

@Injectable()
export class JobsService {
    constructor(
        @InjectModel(Job.name) private jobModel: Model<JobDocument>,
        @Inject(forwardRef(() => SchedulerService)) private schedulerService: SchedulerService,) { }

    async create(createJobDto: CreateJobDto): Promise<Job> {
        try {
            const { schedule, ...rest } = createJobDto;
            const interval = CronExpressionParser.parse(schedule);
            const nextRunAt = interval.next().toDate();

            const job = new this.jobModel({
                ...rest,
                schedule,
                nextRunAt,
                status: 'pending',
            });

            const savedJob = await job.save();
            if (savedJob.isActive) {
                await this.schedulerService.scheduleJob(savedJob)
            }
            return savedJob;
        } catch (error) {
            if (error instanceof SyntaxError) {
                throw new BadRequestException('Invalid cron schedule expression');
            }
            throw new Error('Failed to create job', error);
        }
    }

    async findAll(options: FindAllOptions): Promise<{ data: Job[]; total: number; page: number; limit: number; totalPages: number }> {
        const { page, limit, status, type } = options;
        const skip = (page - 1) * limit;

        const filter: any = {};
        if (status) filter.status = status;
        if (type) filter.type = type;

        const [data, total] = await Promise.all([
            this.jobModel.find(filter).skip(skip).limit(limit).exec(),
            this.jobModel.countDocuments(filter).exec(),
        ]);

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findOne(id: string): Promise<JobDocument> {
        const job = await this.jobModel.findById(id).exec();
        if (!job) throw new NotFoundException(`Job with ID ${id} not found`);
        return job;
    }

    async updateJobStatus(id: any, status: string, error?: string): Promise<any> {
        try {
            const job = await this.findOne(id);
            const updateData: any = { status };
            if (status === 'completed') {
                updateData.lastRunAt = new Date();
                updateData.$inc = { runCount: 1 };
                const interval = CronExpressionParser.parse(job.schedule);
                updateData.nextRunAt = interval.next().toDate();
            } else if (status === 'failed') {
                updateData.lastError = error;
                updateData.$inc = { failureCount: 1 };
            }

            const updatedJob = await this.jobModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
            return updatedJob;
        } catch (error) {
            throw new Error(`Failed to update job status for ${id}`, error);
        }
    }

    async cancelJob(id: string): Promise<void> {
        try {
            const job = await this.findOne(id);
            job.isActive = false;
            await job.save();
            await this.updateJobStatus(id, 'cancelled', undefined);
        } catch (error) {
            throw new Error(`Failed to cancel job ${id}`, error);
        }
    }

}