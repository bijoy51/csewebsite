import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendanceDoc extends Document {
  studentId: mongoose.Types.ObjectId;
  courseCode: string;
  session: string;
  date: Date;
  status: 'present' | 'absent';
  markedBy: 'teacher' | 'cr';
}

const AttendanceSchema = new Schema<IAttendanceDoc>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    courseCode: { type: String, required: true, uppercase: true },
    session: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['present', 'absent'], required: true },
    markedBy: { type: String, enum: ['teacher', 'cr'], required: true },
  },
  { timestamps: true }
);

AttendanceSchema.index({ studentId: 1, courseCode: 1, date: 1 }, { unique: true });
AttendanceSchema.index({ courseCode: 1, session: 1, date: 1 });

export default mongoose.models.Attendance || mongoose.model<IAttendanceDoc>('Attendance', AttendanceSchema);
