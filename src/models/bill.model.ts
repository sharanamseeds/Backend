import mongoose, { Document } from "mongoose";

export interface typeBill extends Document {
  order_id: mongoose.Types.ObjectId;
  customer_id: mongoose.Types.ObjectId;
  order_amount: number;
  bill_amount: number;
  tax_amount: number;
  discount_amount: number;
  payment_status: "paid" | "unpaid";
  payment_method: string;
  payment_details: string;
  invoice_id: string;
  createdAt: Date;
  updatedAt: Date;
}

const billSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orders",
      required: true,
    },
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    order_amount: { type: Number, required: true },
    invoice_id: { type: String },
    bill_amount: { type: Number },
    tax_amount: { type: Number },
    discount_amount: { type: Number },
    payment_status: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "unpaid",
    },
    payment_method: { type: String },
    payment_details: { type: String },
  },
  { timestamps: true }
);

billSchema.index({ customer_id: 1 });
billSchema.index({ invoice_id: 1 });
billSchema.index({ order_id: 1 });
billSchema.index({ payment_status: 1 });

const Bill = mongoose.model("bills", billSchema);

export default Bill;
