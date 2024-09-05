import mongoose, { Document, Schema } from "mongoose";

export interface IFile extends Document {
  filename: string;
  originalname: string;
  path: string;
  mimetype: string;
  size: number;
  uploadDate: Date;
}

const FileSchema: Schema = new Schema({
  filename: { type: String, required: true },
  originalname: { type: String, required: true },
  path: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  uploadDate: { type: Date, default: Date.now },
},
{ timestamps: true });

export default mongoose.model<IFile>("File", FileSchema);
