import mongoose, { Schema, Document } from 'mongoose';

export interface ICoach extends Document {
  firstName: string;
  lastName: string;
  email: string;
  specialty: string;
  bio?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CoachSchema = new Schema<ICoach>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    specialty: { type: String, required: true },
    bio: { type: String },
    avatar: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<ICoach>('Coach', CoachSchema);
