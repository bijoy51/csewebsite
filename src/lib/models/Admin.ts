import mongoose, { Schema, Document } from 'mongoose';

export interface IAdminDoc extends Document {
  password: string;
}

const AdminSchema = new Schema<IAdminDoc>(
  {
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Admin || mongoose.model<IAdminDoc>('Admin', AdminSchema);
