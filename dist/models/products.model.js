import mongoose from "mongoose";
import { localizedStringSchema, } from "../schema/localizedLanguage.schema.js";
const productSchema = new mongoose.Schema({
    added_by: { type: mongoose.Types.ObjectId, default: null, ref: "users" },
    updated_by: { type: mongoose.Types.ObjectId, default: null, ref: "users" },
    product_code: { type: String, required: true },
    in_stock: { type: Boolean, default: true },
    is_active: { type: Boolean, default: true },
    is_verified: { type: Boolean, default: false },
    gst_percent: { type: Number, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    manufacture_date: { type: Date, required: true },
    expiry_date: { type: Date, required: true },
    description: { type: [localizedStringSchema], default: [] },
    images: { type: [localizedStringSchema], default: [] },
    brand_id: { type: mongoose.Types.ObjectId, required: true },
    category_id: { type: mongoose.Types.ObjectId, required: true },
    logo: { type: [localizedStringSchema], default: [] },
    product_name: { type: [localizedStringSchema], required: true },
}, { timestamps: true });
// We Can Get State Code From GST Number
// Example
// GST NO : 24AAJFK9370N1ZP
// First Two Latter 24 this is state gst code
//TODO: GST'S cgst sgst igst tcs = 0.1%
// if product buyer and saler from same state then only cgst and sgst applied
// if 18% gst rate then 9% cgst and 9% sgst
// cgst = central good and service tax
// sgst = state good and service tax
// if product buyer and saler from different state then only igst applied
// if 18% gst rate then 18% igst
// For Understanding Only
// central govermment will take all tax and he will be paid tax to related state, we dont have to pay that state. it is central govement will be responsible for the same.
// igst = integrated good and service tax ()
// if payment goes more than 50 Lac then tcs will be applied
// exmple
// bill amount 65lac then 65 -50  = 15 lac then tcs will be applied on 15 lac
productSchema.index({ added_by: 1 });
productSchema.index({ product_code: 1 });
productSchema.index({ product_name: 1 });
productSchema.index({ brand_id: 1 });
productSchema.index({ category_id: 1 });
productSchema.index({ in_stock: 1 });
productSchema.index({ is_verified: 1 });
productSchema.index({ price: 1 });
productSchema.index({ quantity: 1 });
const Product = mongoose.model("products", productSchema);
export default Product;
//# sourceMappingURL=products.model.js.map