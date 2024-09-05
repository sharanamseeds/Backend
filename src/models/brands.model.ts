import mongoose, { Document } from "mongoose";
import {
  localizedStringSchema,
  typeLocalizedString,
} from "../schema/localizedLanguage.schema.js";

export interface typeBrand extends Document {
  added_by: mongoose.Types.ObjectId | null;
  updated_by: mongoose.Types.ObjectId | null;
  brand_name: typeLocalizedString[];
  identifier: string;
  tag_line: typeLocalizedString[];
  logo: typeLocalizedString[];
  createdAt: Date;
  updatedAt: Date;
}

const brandsSchema = new mongoose.Schema(
  {
    added_by: { type: mongoose.Types.ObjectId, default: null, ref: "users" },
    updated_by: { type: mongoose.Types.ObjectId, default: null, ref: "users" },
    brand_name: { type: [localizedStringSchema], required: true },
    identifier: { type: String, default: null },
    tag_line: { type: [localizedStringSchema], default: [] },
    logo: { type: [localizedStringSchema], default: null },
  },
  { timestamps: true }
);

brandsSchema.index({ identifier: 1 }, { unique: true });
brandsSchema.index({ added_by: 1 });

const Brand = mongoose.model<typeBrand>("brands", brandsSchema);

export default Brand;
