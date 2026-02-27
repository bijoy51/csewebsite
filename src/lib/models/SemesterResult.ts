import mongoose, { Schema, Document } from 'mongoose';

export interface ISemesterResultDoc extends Document {
  studentId: mongoose.Types.ObjectId;
  courseCode: string;
  session: string;
  year: number;
  semester: number;
  grade: string;
  gpa: number;
  credits: number;
}

const SemesterResultSchema = new Schema<ISemesterResultDoc>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    courseCode: { type: String, required: true, uppercase: true },
    session: { type: String, required: true },
    year: { type: Number, required: true },
    semester: { type: Number, required: true },
    grade: { type: String, required: true },
    gpa: { type: Number, required: true, min: 0, max: 4.0 },
    credits: { type: Number, default: 3 },
  },
  { timestamps: true }
);

SemesterResultSchema.index(
  { studentId: 1, courseCode: 1, year: 1, semester: 1 },
  { unique: true }
);
SemesterResultSchema.index({ studentId: 1, year: 1, semester: 1 });

export default mongoose.models.SemesterResult ||
  mongoose.model<ISemesterResultDoc>('SemesterResult', SemesterResultSchema);
