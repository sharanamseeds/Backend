import mongoose from "mongoose";
// Define the schema
const otpSchema = new mongoose.Schema({
    code_for: { type: String, required: true, unique: true },
    code: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }, // Reintroduce createdAt field for TTL or tracking
});
// If you want OTPs to expire, use this TTL index (Uncomment if needed)
// otpSchema.index(
//   { createdAt: 1 },
//   { expireAfterSeconds: masterConfig.authConfig.VerificationCodeExpires }
// );
// Add index for the `code` field if frequent queries are performed by `code`
otpSchema.index({ code: 1 });
// Export the model
const Otps = mongoose.model("otps", otpSchema);
export default Otps;
//# sourceMappingURL=otps.model.js.map