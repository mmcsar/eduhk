import mongoose, { Schema, Document, Types } from 'mongoose';

export type SessionStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type SessionType = 'one_on_one' | 'group' | 'workshop';

export interface ICoachingSession extends Document {
  coach: Types.ObjectId;
  students: Types.ObjectId[];
  title: string;
  description?: string;
  type: SessionType;
  status: SessionStatus;
  subject: string;
  scheduledAt: Date;
  duration: number; // in minutes
  location?: string;
  notes?: string;
  objectives: string[];
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CoachingSessionSchema = new Schema<ICoachingSession>(
  {
    coach: { type: Schema.Types.ObjectId, ref: 'Coach', required: true },
    students: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    title: { type: String, required: true, trim: true },
    description: { type: String },
    type: {
      type: String,
      enum: ['one_on_one', 'group', 'workshop'],
      default: 'one_on_one',
    },
    status: {
      type: String,
      enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    subject: { type: String, required: true },
    scheduledAt: { type: Date, required: true },
    duration: { type: Number, required: true, min: 15, max: 240 },
    location: { type: String },
    notes: { type: String },
    objectives: [{ type: String }],
    completedAt: { type: Date },
  },
  { timestamps: true }
);

CoachingSessionSchema.index({ coach: 1, scheduledAt: -1 });
CoachingSessionSchema.index({ status: 1 });
CoachingSessionSchema.index({ students: 1 });

export default mongoose.model<ICoachingSession>('CoachingSession', CoachingSessionSchema);
