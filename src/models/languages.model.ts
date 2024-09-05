import mongoose from "mongoose";

export interface typeLanguage extends Document {
  added_by: mongoose.Types.ObjectId | null;
  updated_by: mongoose.Types.ObjectId | null;
  lang_code: string;
  identifier: string;
  lang_name: string;
}

const languageSchema = new mongoose.Schema(
  {
    added_by: { type: mongoose.Types.ObjectId, default: null, ref: "users" },
    updated_by: { type: mongoose.Types.ObjectId, default: null, ref: "users" },
    lang_name: { type: String, required: true },
    lang_code: { type: String, required: true },
    identifier: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

languageSchema.index({ identifier: 1 }, { unique: true });
languageSchema.index({ added_by: 1 });
languageSchema.index({ lang_code: 1 });
languageSchema.index({ lang_name: 1 });

const Languages = mongoose.model<typeLanguage>("Languages", languageSchema);

export default Languages;
