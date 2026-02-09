import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IFeedback extends Document {
  session: Types.ObjectId;
  coach: Types.ObjectId;
  student: Types.ObjectId;
  rating: number; // 1-5
  strengths: string[];
  areasForImprovement: string[];
  comment?: string;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    session: { type: Schema.Types.ObjectId, ref: 'CoachingSession', required: true },
    coach: { type: Schema.Types.ObjectId, ref: 'Coach', required: true },
    student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    strengths: [{ type: String }],
    areasForImprovement: [{ type: String }],
    comment: { type: String },
    isPrivate: { type: Boolean, default: false },
  },
  { timestamps: true }
);

FeedbackSchema.index({ session: 1 });
FeedbackSchema.index({ student: 1, createdAt: -1 });

export default mongoose.model<IFeedback>('Feedback', FeedbackSchema);
