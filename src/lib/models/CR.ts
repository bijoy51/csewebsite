import mongoose, { Schema, Document } from 'mongoose';

export interface ICRDoc extends Document {
  session: string;
  name: string;
  roll: string;
  password: string;
}

const CRSchema = new Schema<ICRDoc>(
  {
    session: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    roll: { type: String, required: true, trim: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

CRSchema.index({ session: 1, roll: 1 }, { unique: true });

export default mongoose.models.CR || mongoose.model<ICRDoc>('CR', CRSchema);
