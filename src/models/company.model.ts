import mongoose, { Document } from "mongoose";

export interface typeCompany extends Document {
  added_by: mongoose.Types.ObjectId | null;
  updated_by: mongoose.Types.ObjectId | null;
  owner_id: mongoose.Types.ObjectId;
  brand_name: string;
  legal_name: string;
  slogan: string;
  industry: string[];
  description: string;
  website: string;
  type: string; // B2B or B2C
  logo: {
    primary: string; // Cloud storage reference or direct image data
    secondary: string; // Cloud storage reference or direct image data
    QR_code: string; // Cloud storage reference or direct image data
  };
  contact_information: {
    address_line?: string;
    city?: string;
    state?: string;
    pincode?: string;
    type?: string;
    coordinates?: number[];
  };
  billing_information: {
    gst_number: string;
    business_model: string; //  (e.g., 'manufacturer', 'distributor', 'service provider').
  };
}

const companySchema = new mongoose.Schema(
  {
    added_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    brand_name: { type: String, required: true },
    legal_name: { type: String, required: true },
    slogan: { type: String },
    industry: { type: [String], required: true },
    description: { type: String },
    website: { type: String },
    type: { type: String, enum: ["B2B", "B2C"], required: true },
    logo: {
      primary: { type: String },
      secondary: { type: String },
      QR_code: { type: String },
    },
    contact_information: {
      address_line: { type: String, default: null },
      city: { type: String, default: null },
      state: { type: String, default: null },
      pincode: { type: String, default: null },
      type: { type: String, default: "Point" },
      coordinates: { type: [Number], index: "2dsphere" },
    },
    billing_information: {
      gst_number: { type: String, required: true },
      business_model: { type: String, required: true }, // 'manufacturer', 'distributor', 'service provider'
    },
  },
  { timestamps: true }
);

companySchema.index({ brand_name: 1 });
companySchema.index({ type: 1 });
companySchema.index({ owner_id: 1 });
companySchema.index({ legal_name: 1 });
companySchema.index({ slogan: 1 });
companySchema.index({ industry: 1 });
companySchema.index({ description: 1 });
companySchema.index({ website: 1 });

const Company = mongoose.model<typeCompany>("companies", companySchema);

export default Company;
