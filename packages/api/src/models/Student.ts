import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  firstName: string;
  lastName: string;
  email: string;
  grade: string;
  section: string;
  enrolledAt: Date;
  parentPhone?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    grade: { type: String, required: true },
    section: { type: String, required: true },
    enrolledAt: { type: Date, default: Date.now },
    parentPhone: { type: String },
    avatar: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

StudentSchema.index({ lastName: 1, firstName: 1 });
StudentSchema.index({ grade: 1, section: 1 });

export default mongoose.model<IStudent>('Student', StudentSchema);
