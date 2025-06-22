import { ApiProperty } from "@nestjs/swagger";

export class JobResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  schedule: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  lastRunAt: Date;

  @ApiProperty()
  nextRunAt: Date;

  @ApiProperty()
  runCount: number;

  @ApiProperty()
  failureCount: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
