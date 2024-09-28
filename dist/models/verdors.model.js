import mongoose, { Schema } from "mongoose";
const vendorsSchema = new Schema({
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
}, { timestamps: true });
vendorsSchema.index({ email: 1 }, { unique: true });
vendorsSchema.index({ contact_number: 1 }, { unique: true });
vendorsSchema.index({ gst_number: 1 });
vendorsSchema.index({ name: 1 });
const Vendor = mongoose.model("vendors", vendorsSchema);
export default Vendor;
//# sourceMappingURL=verdors.model.js.map