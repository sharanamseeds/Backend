import mongoose from "mongoose";

export interface typeWish extends Document {
  _id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  product_id: mongoose.Types.ObjectId;
  priority: number;
  notes: String;
  createdAt: Date;
  updatedAt: Date;
}

const wishSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Types.ObjectId, ref: "users", required: true },
    product_id: {
      type: mongoose.Types.ObjectId,
      ref: "products",
      required: true,
    },
    priority: { type: Number },
    notes: { type: String },
  },
  { timestamps: true }
);

wishSchema.index({ user_id: 1 });
wishSchema.index({ product_id: 1 });
wishSchema.index({ user_id: 1, product_id: 1 });

const Wish = mongoose.model<typeWish>("wishes", wishSchema);
export default Wish;
