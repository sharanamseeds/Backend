import mongoose from "mongoose";
const languageSchema = new mongoose.Schema({
    added_by: { type: mongoose.Types.ObjectId, default: null, ref: "users" },
    updated_by: { type: mongoose.Types.ObjectId, default: null, ref: "users" },
    lang_name: { type: String, required: true },
    lang_code: { type: String, required: true },
    identifier: { type: String, required: true, unique: true },
}, { timestamps: true });
languageSchema.index({ identifier: 1 }, { unique: true });
languageSchema.index({ added_by: 1 });
languageSchema.index({ lang_code: 1 });
languageSchema.index({ lang_name: 1 });
const Languages = mongoose.model("Languages", languageSchema);
export default Languages;
//# sourceMappingURL=languages.model.js.map