import mongoose from "mongoose";
import { localizedStringSchema, } from "../schema/localizedLanguage.schema.js";
const categorySchema = new mongoose.Schema({
    added_by: { type: mongoose.Types.ObjectId, default: null, ref: "users" },
    updated_by: { type: mongoose.Types.ObjectId, default: null, ref: "users" },
    category_name: { type: [localizedStringSchema], required: true },
    identifier: { type: String, default: "" },
    description: { type: [localizedStringSchema], default: [] },
    logo: { type: [localizedStringSchema], default: null },
}, { timestamps: true });
categorySchema.index({ identifier: 1 }, { unique: true });
categorySchema.index({ added_by: 1 });
const Category = mongoose.model("categories", categorySchema);
export default Category;
//# sourceMappingURL=categories.model.js.map