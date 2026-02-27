import mongoose, { Schema, Document } from 'mongoose';

export interface ITutorialResultDoc extends Document {
  studentId: mongoose.Types.ObjectId;
  courseCode: string;
  session: string;
  tutorialNumber: number;
  marks: number;
  totalMarks: number;
  attended: boolean;
}

const TutorialResultSchema = new Schema<ITutorialResultDoc>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    courseCode: { type: String, required: true, uppercase: true },
    session: { type: String, required: true },
    tutorialNumber: { type: Number, required: true },
    marks: { type: Number, required: true, min: 0 },
    totalMarks: { type: Number, default: 10 },
    attended: { type: Boolean, default: true },
  },
  { timestamps: true }
);

TutorialResultSchema.index(
  { studentId: 1, courseCode: 1, tutorialNumber: 1 },
  { unique: true }
);

export default mongoose.models.TutorialResult ||
  mongoose.model<ITutorialResultDoc>('TutorialResult', TutorialResultSchema);
