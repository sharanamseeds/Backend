import mongoose, { Document } from "mongoose";
import {
  localizedStringSchema,
  typeLocalizedString,
} from "../schema/localizedLanguage.schema.js";

function calculateStandardQty(
  base_unit: string,
  quantity: number,
  size: number
): string {
  let std_qty = "";
  switch (base_unit) {
    case "GM":
      std_qty = ((quantity * size) / 1000).toFixed(2) + " KG";
      break;
    case "ML":
      std_qty = ((quantity * size) / 1000).toFixed(2) + " LTR";
      break;
    case "KG":
      std_qty = (quantity * size).toFixed(2) + " KG";
      break;
    case "LTR":
      std_qty = (quantity * size).toFixed(2) + " LTR";
    case "EACH":
      std_qty = (quantity * size).toFixed(2) + "EACH";
      break;
    default:
      std_qty = (quantity * size).toString();
  }
  return std_qty;
}

const productSchema = new mongoose.Schema(
  {
    added_by: { type: mongoose.Types.ObjectId, default: null, ref: "users" },
    updated_by: { type: mongoose.Types.ObjectId, default: null, ref: "users" },
    product_code: { type: String, required: true },
    in_stock: { type: Boolean, default: true },
    is_active: { type: Boolean, default: true },
    is_verified: { type: Boolean, default: false },
    gst_percent: { type: Number, required: true },
    price: { type: Number, required: true },
    size: { type: Number, required: true },
    quantity: { type: Number, required: true },
    manufacture_date: { type: Date, required: true, default: new Date() },
    expiry_date: { type: Date, required: true, default: new Date() },
    description: { type: [localizedStringSchema], default: [] },
    images: { type: [localizedStringSchema], default: [] },
    brand_id: { type: mongoose.Types.ObjectId, required: true },
    category_id: { type: mongoose.Types.ObjectId, required: true },
    logo: { type: [localizedStringSchema], default: [] },
    product_name: { type: [localizedStringSchema], required: true },

    is_featured: { type: Boolean, default: false },
    base_unit: {
      type: String,
      enum: ["GM", "ML", "KG", "LTR", "EACH"],
      required: true,
    },
    lot_no: {
      type: String,
    },
    vendor_name: {
      type: String,
    },
    grn_date: { type: Date },
    std_qty: {
      type: String,
    },
    price_with_gst: { type: Number },
  },
  { timestamps: true }
);

export interface typeProduct extends Document {
  added_by: mongoose.Types.ObjectId;
  updated_by: mongoose.Types.ObjectId;
  logo: typeLocalizedString[];
  product_name: typeLocalizedString[];
  product_code: string;
  description: typeLocalizedString[];
  images: typeLocalizedString[];
  brand_id: mongoose.Types.ObjectId;
  category_id: mongoose.Types.ObjectId;
  in_stock: boolean;
  is_active: boolean;
  is_verified: boolean;
  gst_percent: number;
  price: number;
  size: number;
  price_with_gst: number;
  quantity: number;
  manufacture_date: Date;
  expiry_date: Date;

  is_featured: boolean;
  base_unit: "GM" | "ML" | "KG" | "LTR" | "EACH";
  lot_no: string;
  vendor_name: string;
  grn_date: Date;
  std_qty: string;

  createdAt: Date;
  updatedAt: Date;
}

productSchema.pre("save", function (next) {
  if (
    this.isModified("quantity") ||
    this.isModified("base_unit") ||
    this.isModified("size")
  ) {
    this.std_qty = calculateStandardQty(
      this.base_unit,
      this.quantity,
      this.size
    );
    // if (this.gst_percent > 0) {
    //   const gst = (this.price * this.gst_percent) / 100;
    //   this.price_with_gst = this.price + Number(gst?.toFixed(2));
    // } else {
    //   this.price_with_gst = this.price;
    // }
  }
  next();
});

productSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as mongoose.UpdateQuery<any>;
  if (update.$set) {
    const { quantity, base_unit, size } = update.$set;
    // Check if quantity or base_unit is being updated
    if (quantity || base_unit || size) {
      const updatedQuantity = quantity ?? this.get("quantity");
      const updatedBaseUnit = base_unit ?? this.get("base_unit");
      const updatedSize = size ?? this.get("size");
      // Update std_qty based on the new or existing values
      update.$set.std_qty = calculateStandardQty(
        updatedBaseUnit,
        updatedQuantity,
        updatedSize
      );
    }
  }

  next();
});

productSchema.index({ added_by: 1 });
productSchema.index({ product_code: 1 });
productSchema.index({ product_name: 1 });
productSchema.index({ brand_id: 1 });
productSchema.index({ category_id: 1 });
productSchema.index({ in_stock: 1 });
productSchema.index({ is_verified: 1 });
productSchema.index({ price: 1 });
productSchema.index({ quantity: 1 });
productSchema.index({ is_featured: 1 });

const Product = mongoose.model<typeProduct>("products", productSchema);

export default Product;

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
