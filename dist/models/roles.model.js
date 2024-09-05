import mongoose from "mongoose";
const roleSchema = new mongoose.Schema({
    role_name: { type: String, required: true, unique: true },
    added_by: { type: mongoose.Types.ObjectId, default: null },
    updated_by: { type: mongoose.Types.ObjectId, default: null },
    identifier: { type: String, required: true },
    is_active: { type: Boolean, default: false },
}, { timestamps: true });
roleSchema.index({ identifier: 1 }, { unique: true });
const Role = mongoose.model("roles", roleSchema);
export default Role;
//# sourceMappingURL=roles.model.js.map