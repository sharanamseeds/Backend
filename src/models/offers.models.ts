import mongoose, { Document } from "mongoose";
import {
  localizedStringSchema,
  typeLocalizedString,
} from "../schema/localizedLanguage.schema.js";
import Cart from "./cart.model.js";

export interface typeOffer extends Document {
  added_by?: mongoose.Types.ObjectId | null;
  updated_by?: mongoose.Types.ObjectId | null;

  description: typeLocalizedString[];
  image: typeLocalizedString[];
  offer_name: typeLocalizedString[];

  offer_code: string;
  identifier: string;

  product_specified: boolean;
  products: mongoose.Types.ObjectId[];
  category_specified: boolean;
  categories: mongoose.Types.ObjectId[];
  offer_type:
    | "percentage"
    | "fixed_amount"
    | "tiered"
    | "buy_x_get_y"
    | "bundle"
    | "referral"
    | "coupon";
  is_active: boolean;

  percentage_discount?: number;
  fixed_amount_discount?: number;
  tiers?: { min_order_value: number; discount: number }[];
  buy_quantity?: number;
  get_quantity?: number;

  // free_shipping_threshold?: number;
  bundle_items?: {
    product_id: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
  }[];

  referral_code?: string;
  referral_amount?: number;
  coupon_code?: string;
  coupon_details?: { coupon_type: "percentage" | "amount"; value: number };

  createdAt?: Date;
  updatedAt?: Date;
}

const offerSchema = new mongoose.Schema(
  {
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

    percentage_discount: { type: Number }, // For percentage discount
    fixed_amount_discount: { type: Number }, // For fixed amount discount
    tiers: [
      {
        min_order_value: { type: Number },
        discount: { type: Number },
      },
    ], // For tiered discounts
    buy_quantity: { type: Number }, // For buy x get y
    get_quantity: { type: Number }, // For buy x get y

    // free_shipping_threshold: { type: Number }, // For free shipping
    bundle_items: [
      {
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
        quantity: { type: Number },
        price: { type: Number },
      },
    ], // For bundle offers

    referral_code: { type: String },
    referral_amount: { type: Number }, // For referral discounts
    coupon_code: { type: String }, // For coupon codes
    coupon_details: {
      coupon_type: {
        type: String,
        enum: ["percentage", "amount"],
      },
      value: { type: Number },
    },
  },
  { timestamps: true }
);

offerSchema.index({ identifier: 1 }, { unique: true });
offerSchema.index({ is_active: 1 });
offerSchema.index({ offer_code: 1 });
offerSchema.index({ offer_name: 1 });
offerSchema.index({ product_specified: 1 });
offerSchema.index({ category_specified: 1 });
offerSchema.index({ offer_type: 1 });

offerSchema.post("findOneAndUpdate", async function (doc, next) {
  if (doc && doc.is_active === false) {
    await Cart.updateMany(
      { selectedOffer: doc._id },
      { $set: { selectedOffer: null } }
    );
  }
  next();
});

const Offer = mongoose.model<typeOffer>("offers", offerSchema);

export default Offer;
