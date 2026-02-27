import mongoose, { Schema, Document } from 'mongoose';

export interface IStudentDoc extends Document {
  name: string;
  roll: string;
  registrationNo: string;
  session: string;
  email: string;
  password: string;
  profilePhoto: string;
  phone: string;
  bloodGroup: string;
  address: string;
}

const StudentSchema = new Schema<IStudentDoc>(
  {
    name: { type: String, required: true, trim: true },
    roll: { type: String, required: true, unique: true, trim: true },
    registrationNo: { type: String, required: true, unique: true, trim: true },
    session: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    profilePhoto: { type: String, default: '/images/default-avatar.png' },
    phone: { type: String, default: '' },
    bloodGroup: { type: String, default: '' },
    address: { type: String, default: '' },
  },
  { timestamps: true }
);

StudentSchema.index({ session: 1, roll: 1 });

export default mongoose.models.Student || mongoose.model<IStudentDoc>('Student', StudentSchema);
