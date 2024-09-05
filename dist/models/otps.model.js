import mongoose from "mongoose";
import { masterConfig } from "../config/master.config.js";
const otpSchema = new mongoose.Schema({
    code_for: { type: String, required: true, unique: true },
    code: { type: String, required: true },
    createdAt: { type: Date, default: new Date() },
});
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: masterConfig.authConfig.VerificationCodeExpires });
otpSchema.index({ code: 1 });
otpSchema.index({ code_for: 1 }, { unique: true });
const Otps = mongoose.model("otps", otpSchema);
export default Otps;
//# sourceMappingURL=otps.model.js.map