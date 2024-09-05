import mongoose from "mongoose";
import { localizedStringSchema, } from "../schema/localizedLanguage.schema.js";
const brandsSchema = new mongoose.Schema({
    added_by: { type: mongoose.Types.ObjectId, default: null, ref: "users" },
    updated_by: { type: mongoose.Types.ObjectId, default: null, ref: "users" },
    brand_name: { type: [localizedStringSchema], required: true },
    identifier: { type: String, default: null },
    tag_line: { type: [localizedStringSchema], default: [] },
    logo: { type: [localizedStringSchema], default: null },
}, { timestamps: true });
brandsSchema.index({ identifier: 1 }, { unique: true });
brandsSchema.index({ added_by: 1 });
const Brand = mongoose.model("brands", brandsSchema);
export default Brand;
//# sourceMappingURL=brands.model.js.map