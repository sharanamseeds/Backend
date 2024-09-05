import mongoose from "mongoose";

export interface typeRole extends Document {
  _id: mongoose.Types.ObjectId;
  role_name: string;
  added_by: mongoose.Types.ObjectId | null;
  updated_by: mongoose.Types.ObjectId | null;
  identifier: string;
  is_active: boolean;
}

const roleSchema = new mongoose.Schema(
  {
    role_name: { type: String, required: true, unique: true },
    added_by: { type: mongoose.Types.ObjectId, default: null },
    updated_by: { type: mongoose.Types.ObjectId, default: null },
    identifier: { type: String, required: true },
    is_active: { type: Boolean, default: false },
  },
  { timestamps: true }
);

roleSchema.index({ identifier: 1 }, { unique: true });

const Role = mongoose.model<typeRole>("roles", roleSchema);
export default Role;
