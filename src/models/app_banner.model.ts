import mongoose, { Document, Schema } from "mongoose";
import {
  localizedStringSchema,
  typeLocalizedString,
} from "../schema/localizedLanguage.schema.js";

export interface typeAppBanner extends Document {
  _id: mongoose.Types.ObjectId;
  images: typeLocalizedString[];
  banners: typeLocalizedString[];
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const appBannerSchema = new mongoose.Schema(
  {
    images: { type: [localizedStringSchema], default: [] },
    banners: { type: [localizedStringSchema], default: [] },
    is_active: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes
appBannerSchema.index({ createdAt: 1 });

// Model
const AppBanner = mongoose.model<typeAppBanner>("app_banners", appBannerSchema);

export default AppBanner;
