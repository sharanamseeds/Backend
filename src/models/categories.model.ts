import mongoose, { Document } from "mongoose";
import {
  localizedStringSchema,
  typeLocalizedString,
} from "../schema/localizedLanguage.schema.js";

export interface typeCategory extends Document {
  added_by: mongoose.Types.ObjectId | null;
  updated_by: mongoose.Types.ObjectId | null;
  category_name: typeLocalizedString[];
  identifier: string;
  description: typeLocalizedString[];
  logo: typeLocalizedString[];
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new mongoose.Schema(
  {
    added_by: { type: mongoose.Types.ObjectId, default: null, ref: "users" },
    updated_by: { type: mongoose.Types.ObjectId, default: null, ref: "users" },
    category_name: { type: [localizedStringSchema], required: true },
    identifier: { type: String, default: "" },
    description: { type: [localizedStringSchema], default: [] },
    logo: { type: [localizedStringSchema], default: null },
  },
  { timestamps: true }
);

categorySchema.index({ identifier: 1 }, { unique: true });
categorySchema.index({ added_by: 1 });

const Category = mongoose.model<typeCategory>("categories", categorySchema);

export default Category;
