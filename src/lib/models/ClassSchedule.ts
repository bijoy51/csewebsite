import mongoose, { Schema, Document } from 'mongoose';

export interface IClassScheduleDoc extends Document {
  courseCode: string;
  session: string;
  date: Date;
  time: string;
  room: string;
}

const ClassScheduleSchema = new Schema<IClassScheduleDoc>(
  {
    courseCode: { type: String, required: true, uppercase: true },
    session: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    room: { type: String, default: '' },
  },
  { timestamps: true }
);

ClassScheduleSchema.index({ session: 1, date: 1 });
ClassScheduleSchema.index({ courseCode: 1, session: 1 });

export default mongoose.models.ClassSchedule ||
  mongoose.model<IClassScheduleDoc>('ClassSchedule', ClassScheduleSchema);
