import mongoose, { Schema, Document } from 'mongoose';

export interface ITutorialDoc extends Document {
  courseCode: string;
  session: string;
  tutorialNumber: number;
  topic: string;
  date: Date;
}

const TutorialSchema = new Schema<ITutorialDoc>(
  {
    courseCode: { type: String, required: true, uppercase: true },
    session: { type: String, required: true },
    tutorialNumber: { type: Number, required: true },
    topic: { type: String, required: true, trim: true },
    date: { type: Date },
  },
  { timestamps: true }
);

TutorialSchema.index({ courseCode: 1, session: 1, tutorialNumber: 1 }, { unique: true });

export default mongoose.models.Tutorial || mongoose.model<ITutorialDoc>('Tutorial', TutorialSchema);
