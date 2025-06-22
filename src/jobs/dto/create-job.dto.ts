import { IsString, IsObject, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateJobDto {
  @ApiProperty({ description: 'Job name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Job type (email, notification, etc.)' })
  @IsString()
  type: string;

  @ApiProperty({ description: 'Cron schedule expression' })
  @IsString()
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