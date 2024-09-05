import mongoose, { Document } from "mongoose";

export interface typeOrder extends Document {
  user_id: mongoose.Types.ObjectId;
  added_by: mongoose.Types.ObjectId | null;
  updated_by: mongoose.Types.ObjectId | null;
  bill_id: mongoose.Types.ObjectId | null;
  products: {
    product_id: mongoose.Types.ObjectId;
    offer_id: mongoose.Types.ObjectId | null;
    quantity: number;
    offer_discount: number;
    total_amount: number;
    gst_rate: number;
    purchase_price: number;
    gst_amount: number;
    manufacture_date: Date;
    expiry_date: Date;
  }[];
  order_amount: number;
  discount_amount: number;
  billing_amount: number;
  tax_amount: number;
  order_type: "buy" | "sell";
  buy_order_id: mongoose.Types.ObjectId | null;
  status:
    | "confirm"
    | "rejected"
    | "pending"
    | "delivered"
    | "cancelled"
    | "return_requested"
    | "return_accepeted"
    | "return_rejected"
    | "return_fulfilled";
  is_creditable: boolean;
  credit_duration: number;

  order_notes: string;
  reason: string;

  createdAt?: Date;
  updatedAt?: Date;
}

const orderSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Types.ObjectId, ref: "users", required: true },
    added_by: { type: mongoose.Types.ObjectId, default: null, ref: "users" },
    updated_by: { type: mongoose.Types.ObjectId, default: null, ref: "users" },
    bill_id: { type: mongoose.Types.ObjectId, default: null, ref: "bills" },
    order_type: {
      type: String,
      required: true,
      enum: ["buy", "sell"],
      default: "sell",
    },
    buy_order_id: {
      type: mongoose.Types.ObjectId,
      default: null,
      ref: "orders",
    },
    products: [
      {
        product_id: {
          type: mongoose.Types.ObjectId,
          ref: "products",
          required: true,
        },
        offer_id: {
          type: mongoose.Types.ObjectId,
          default: null,
          ref: "offers",
        },
        quantity: { type: Number, required: true },
        total_amount: { type: Number, required: true },
        offer_discount: { type: Number, default: 0 },
        gst_rate: { type: Number, default: 0 },
        purchase_price: { type: Number, required: true },
        gst_amount: { type: Number, required: true },
        manufacture_date: { type: Date, required: true },
        expiry_date: { type: Date, required: true },
      },
    ],
    order_amount: { type: Number, required: true },
    discount_amount: { type: Number, default: 0 },
    billing_amount: { type: Number, required: true },
    tax_amount: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: [
        "confirm",
        "pending",
        "rejected",
        "delivered",
        "cancelled",
        "return_requested",
        "return_accepeted",
        "return_rejected",
        "return_fulfilled",
      ],
      default: "pending",
    },
    is_creditable: { type: Boolean, default: false },
    credit_duration: { type: Number },

    order_notes: {
      type: String,
    },
    reason: {
      type: String,
    },
  },
  { timestamps: true }
);

orderSchema.index({ user_id: 1 });
orderSchema.index({ order_type: 1 });
orderSchema.index({ buy_order_id: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ is_creditable: 1 });
orderSchema.index({ credit_duration: 1 });

const Order = mongoose.model<typeOrder>("orders", orderSchema);
export default Order;
