var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    is_app_user: { type: Boolean, default: false },
    contact_number: { type: String },
    gst_number: { type: String, default: null },
    email: { type: String, required: true },
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
usersSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        // If email or is_app_user fields are modified, perform the check
        if (user.isModified("email") || user.isModified("is_app_user")) {
            // Check if a user with the same email exists
            const existingUser = yield User.findOne({ email: user.email });
            // If a user exists and has the same `is_app_user` value, throw an error
            if (existingUser && existingUser.is_app_user === user.is_app_user) {
                return next(new Error("User with the same email and app status already exists"));
            }
        }
        next();
    });
});
usersSchema.pre("findOneAndUpdate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const update = this.getUpdate();
        // Check if the update is a standard update and contains email or is_app_user
        if (update &&
            typeof update === "object" &&
            ("$set" in update || "email" in update)) {
            const email = update.email || (update.$set && update.$set.email);
            const is_app_user = update.is_app_user || (update.$set && update.$set.is_app_user);
            if (email || is_app_user !== undefined) {
                // Check if a user with the same email exists
                const existingUser = yield User.findOne({ email });
                if (existingUser && existingUser.is_app_user === is_app_user) {
                    return next(new Error("User with the same email and app status already exists"));
                }
            }
        }
        next();
    });
});
usersSchema.index({ email: 1 });
usersSchema.index({ contact_number: 1 });
usersSchema.index({ gst_number: 1 });
usersSchema.index({ role_id: 1 });
usersSchema.index({ is_verified: 1 });
usersSchema.index({ is_email_verified: 1 });
usersSchema.index({ name: 1 });
usersSchema.index({ is_blocked: 1 });
const User = mongoose.model("users", usersSchema);
export default User;
//# sourceMappingURL=users.model.js.map