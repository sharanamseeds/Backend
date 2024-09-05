import mongoose, { Document } from "mongoose";

export interface typeLedger extends Document {
  bill_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  bill_amount: number;
  payment_amount: number;
  type: "credit" | "debit";
  description: string;
  invoice_id: string;
  createdAt: Date;
  updatedAt: Date;
}

const ledgerSchema = new mongoose.Schema(
  {
    bill_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bills",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    bill_amount: { type: Number, required: true },
    payment_amount: { type: Number, required: true },
    type: { type: String, enum: ["credit", "debit"], required: true },
    description: { type: String },
    invoice_id: { type: String },
  },
  { timestamps: true }
);

ledgerSchema.index({ added_by: 1 });
ledgerSchema.index({ bill_id: 1 });
ledgerSchema.index({ user_id: 1 });
ledgerSchema.index({ type: 1 });

const Ledger = mongoose.model("ledgers", ledgerSchema);

export default Ledger;
