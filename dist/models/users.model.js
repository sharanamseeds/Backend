import mongoose, { Schema } from "mongoose";
const usersSchema = new Schema({
    added_by: { type: mongoose.Types.ObjectId, default: null, ref: "users" },
    updated_by: { type: mongoose.Types.ObjectId, default: null, ref: "users" },
    role_id: { type: mongoose.Types.ObjectId, default: null, ref: "roles" },
    hash: { type: String, required: true },
    salt: { type: String, required: true },
    is_verified: { type: Boolean, default: false },
    is_blocked: { type: Boolean, default: false },
    name: { type: String },
    agro_name: { type: String, required: true },
    is_email_verified: { type: Boolean, default: false },
    contact_number: { type: String },
    gst_number: { type: String, default: null, unique: true },
    email: { type: String, required: true, unique: true },
    billing_address: {
        address_line: { type: String, default: null },
        city: { type: String, default: null },
        state: { type: String, default: null },
        pincode: { type: String, default: null },
        type: { type: String, default: "Point" },
        coordinates: { type: [Number], index: "2dsphere" },
    },
    billing_equals_shipping: { type: Boolean, default: false },
    shipping_address: {
        address_line: { type: String, default: null },
        city: { type: String, default: null },
        state: { type: String, default: null },
        pincode: { type: String, default: null },
        type: { type: String, default: "Point" },
        coordinates: { type: [Number], index: "2dsphere" },
    },
    profile: { type: String, default: null },
    gst_certificate: { type: String, default: null },
    aadhar_card: { type: String, default: null },
    bank_details: { type: String, default: null },
    other_document: { type: String, default: null },
}, { timestamps: true });
usersSchema.index({ email: 1 }, { unique: true });
usersSchema.index({ contact_number: 1 }, { unique: true });
usersSchema.index({ gst_number: 1 }, { unique: true });
usersSchema.index({ role_id: 1 });
usersSchema.index({ is_verified: 1 });
usersSchema.index({ is_email_verified: 1 });
usersSchema.index({ name: 1 });
usersSchema.index({ is_blocked: 1 });
const User = mongoose.model("users", usersSchema);
export default User;
//# sourceMappingURL=users.model.js.map