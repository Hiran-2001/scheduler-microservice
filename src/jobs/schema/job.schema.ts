import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export enum JobTypes {
  EMAIL = 'email',
  NOTIFICATION = 'notification',
  DATA_PROCESSING = 'data-processing',
}

export type JobDocument = Job & Document;

@Schema({ timestamps: true })
export class Job {

    @Prop({ required: true })
    name: string;

    @Prop()
    description: string;

    @Prop({ required: true })
    type: JobTypes;

    @Prop({ required: true })
    schedule: string;

    @Prop({ default: true })
    isActive: boolean;

    @Prop()
    lastRunAt: Date;

    @Prop()
    nextRunAt: Date;

    @Prop({ default: 0 })
    runCount: number;

    @Prop({ default: 0 })
    failureCount: number;

    @Prop()
    lastError: string;

    @Prop({ enum: ['pending', 'running', 'completed', 'failed'], default: 'pending' })
    status: string;

    @Prop({ type: Object })
    parameters: Record<string, any>;

    createdAt: Date;
    updatedAt: Date;
}

export const JobSchema = SchemaFactory.createForClass(Job);

JobSchema.index({ nextRun: 1, isActive: 1 })
JobSchema.index({ type: 1 });
JobSchema.index({ status: 1 });