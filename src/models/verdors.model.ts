import mongoose, { Schema, Document } from "mongoose";

export interface typeVendor extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  agro_name: string;
  contact_number: string;
  pesticide_license_no: string;
  seed_license_no: string;
  fertilizer_license_no: string;
  gst_number: string;
  pan_number: string;
  email: string;
  address: {
    address_line?: string;
    city?: string;
    state?: string;
    pincode?: string;
    type?: string;
    coordinates?: number[];
  };
  bank_details: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branchName: string;
  };

  createdAt?: Date;
  updatedAt?: Date;
}

const vendorsSchema: Schema = new Schema(
  {
    name: { type: String },
    agro_name: { type: String, required: true },
    contact_number: { type: String },
    pesticide_license_no: { type: String },
    seed_license_no: { type: String },
    fertilizer_license_no: { type: String },
    gst_number: { type: String, default: null },
    pan_number: { type: String, default: null },
    email: { type: String, required: true, unique: true },
    address: {
      address_line: { type: String, default: null },
      city: { type: String, default: null },
      state: { type: String, default: null },
      pincode: { type: String, default: null },
      type: { type: String, default: "Point" },
      coordinates: { type: [Number], index: "2dsphere" },
    },
    bank_details: {
      bankName: { type: String },
      accountNumber: { type: String },
      ifscCode: { type: String },
      branchName: { type: String },
    },
  },
  { timestamps: true }
);

vendorsSchema.index({ email: 1 }, { unique: true });
vendorsSchema.index({ contact_number: 1 }, { unique: true });
vendorsSchema.index({ gst_number: 1 });
vendorsSchema.index({ name: 1 });

const Vendor = mongoose.model<typeVendor>("vendors", vendorsSchema);

export default Vendor;
