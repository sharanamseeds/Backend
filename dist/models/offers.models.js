import mongoose from "mongoose";
import { localizedStringSchema, } from "../schema/localizedLanguage.schema.js";
const offerSchema = new mongoose.Schema({
    added_by: { type: mongoose.Types.ObjectId, default: null, ref: "users" },
    updated_by: { type: mongoose.Types.ObjectId, default: null, ref: "users" },
    description: { type: [localizedStringSchema] },
    image: { type: [localizedStringSchema] },
    offer_name: { type: [localizedStringSchema], required: true },
    offer_code: { type: String, required: true },
    identifier: { type: String },
    product_specified: { type: Boolean, default: false },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "products" }],
    category_specified: { type: Boolean, default: false },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "categories" }],
    offer_type: {
        type: String,
        required: true,
        enum: [
            "percentage",
            "fixed_amount",
            "tiered",
            "buy_x_get_y",
            "bundle",
            "referral",
            "coupon", // 'company_points', 'free_shipping', 'loyalty' //  discount based on customer loyalty level
        ],
    },
    is_active: { type: Boolean, default: true },
    percentage_discount: { type: Number },
    fixed_amount_discount: { type: Number },
    tiers: [
        {
            min_order_value: { type: Number },
            discount: { type: Number },
        },
    ],
    buy_quantity: { type: Number },
    get_quantity: { type: Number },
    // free_shipping_threshold: { type: Number }, // For free shipping
    bundle_items: [
        {
            product_id: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
            quantity: { type: Number },
            price: { type: Number },
        },
    ],
    referral_code: { type: String },
    referral_amount: { type: Number },
    coupon_code: { type: String },
    coupon_details: {
        coupon_type: {
            type: String,
            enum: ["percentage", "amount"],
        },
        value: { type: Number },
    },
}, { timestamps: true });
offerSchema.index({ identifier: 1 }, { unique: true });
offerSchema.index({ is_active: 1 });
offerSchema.index({ offer_code: 1 });
offerSchema.index({ offer_name: 1 });
offerSchema.index({ product_specified: 1 });
offerSchema.index({ category_specified: 1 });
offerSchema.index({ offer_type: 1 });
const Offer = mongoose.model("offers", offerSchema);
export default Offer;
//# sourceMappingURL=offers.models.js.map