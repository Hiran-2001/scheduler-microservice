import { Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Job } from './schema/job.schema';
import { CreateJobDto } from './dto/create-job.dto';
import { JobResponseDto } from './dto/job-response.dto';

@Controller('jobs')
export class JobsController {
    constructor(
        private readonly jobService: JobsService
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new job' })
    @ApiResponse({ status: 201, description: 'Job created successfully', type: Job })
    @ApiResponse({ status: 400, description: 'Invalid input' })
    async create(@Body() createJobDto: CreateJobDto): Promise<Job> {
        return this.jobService.create(createJobDto)
    }

    @Get()
    @ApiOperation({ summary: 'Get all jobs' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'status', required: false, type: String })
    @ApiQuery({ name: 'type', required: false, type: String })
    @ApiResponse({ type: [JobResponseDto] })
    @ApiResponse({ status: 200, description: 'Returns all jobs', type: [Job] })
    async findAll(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Query('status') status?: string,
        @Query('type') type?: string,
    ): Promise<any> {
        return this.jobService.findAll({
            page: Number(page),
            limit: Number(limit),
            status,
            type,
        }
        );
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get job by ID' })
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ type: JobResponseDto })
    async findOne(@Param('id') id: string) {
        return this.jobService.findOne(id);
    }

}
