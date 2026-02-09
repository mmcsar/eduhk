import mongoose, { Schema, Document, Types } from 'mongoose';

export type GoalStatus = 'not_started' | 'in_progress' | 'achieved' | 'paused';
export type GoalPriority = 'low' | 'medium' | 'high';

export interface IGoal extends Document {
  student: Types.ObjectId;
  coach: Types.ObjectId;
  title: string;
  description?: string;
  subject: string;
  status: GoalStatus;
  priority: GoalPriority;
  targetDate: Date;
  progress: number; // 0-100
  milestones: {
    title: string;
    completed: boolean;
    completedAt?: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const GoalSchema = new Schema<IGoal>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    coach: { type: Schema.Types.ObjectId, ref: 'Coach', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    subject: { type: String, required: true },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'achieved', 'paused'],
      default: 'not_started',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    targetDate: { type: Date, required: true },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    milestones: [
      {
        title: { type: String, required: true },
        completed: { type: Boolean, default: false },
        completedAt: { type: Date },
      },
    ],
  },
  { timestamps: true }
);

GoalSchema.index({ student: 1, status: 1 });
GoalSchema.index({ coach: 1 });

export default mongoose.model<IGoal>('Goal', GoalSchema);
