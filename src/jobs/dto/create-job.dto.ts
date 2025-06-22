import { IsString, IsObject, IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { JobTypes } from '../schema/job.schema';
import { IsCronExpression } from 'src/validator/is-cron-expression.validator';

export class CreateJobDto {
  @ApiProperty({ description: 'Job name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Job type (email, notification, data-processing.)',
    enum: JobTypes ,
    enumName: 'JobTypes' 
   })
   @IsEnum(JobTypes, { message: `type must be one of: ${Object.values(JobTypes).join(', ')}` })
  type: JobTypes;

  @ApiProperty({ description: 'Cron schedule expression' })
  @IsString()
  @IsCronExpression({ message: 'schedule must be a valid cron expression like "*/5 * * * *"' })
  schedule: string;

  @ApiProperty({ description: 'Job parameter object' })
  @IsObject()
  @IsOptional()
  parameters?: Record<string, any>;

  @ApiProperty({ description: 'Whether the job is active' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}