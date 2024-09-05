import mongoose from "mongoose";
export const localizedStringSchema = new mongoose.Schema({
    lang_code: { type: String, required: true },
    value: { type: String, required: true },
}, { _id: false });
//# sourceMappingURL=localizedLanguage.schema.js.map