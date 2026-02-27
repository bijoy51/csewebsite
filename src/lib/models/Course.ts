import mongoose, { Schema, Document } from 'mongoose';

export interface ICourseDoc extends Document {
  courseCode: string;
  courseTitle: string;
  teacherName: string;
  session: string;
  password: string;
  year: number;
  semester: number;
}

const CourseSchema = new Schema<ICourseDoc>(
  {
    courseCode: { type: String, required: true, uppercase: true, trim: true },
    courseTitle: { type: String, required: true, trim: true },
    teacherName: { type: String, required: true, trim: true },
    session: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    year: { type: Number },
    semester: { type: Number },
  },
  { timestamps: true }
);

CourseSchema.index({ courseCode: 1, session: 1 }, { unique: true });

export default mongoose.models.Course || mongoose.model<ICourseDoc>('Course', CourseSchema);
