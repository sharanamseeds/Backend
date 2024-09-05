import mongoose, { Document } from "mongoose";

export interface typeMoney extends Document {
  user_id: mongoose.Types.ObjectId;
  amount: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const moneySchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    amount: { type: Number, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

moneySchema.index({ amount: 1 });
moneySchema.index({ user_id: 1 });
moneySchema.index({ createdAt: 1 });

const Money = mongoose.model("moneys", moneySchema);

export default Money;
