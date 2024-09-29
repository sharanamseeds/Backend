import mongoose, { Document } from "mongoose";

export interface typeCart extends Document {
  _id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  product_id: mongoose.Types.ObjectId;
  selectedOffer: mongoose.Types.ObjectId | null;
  quantity: number;
  status: "active" | "ordered" | "abandoned" | "completed";
  //   session_id?: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const cartSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Types.ObjectId, ref: "users", required: true },
    product_id: {
      type: mongoose.Types.ObjectId,
      ref: "products",
      required: true,
    },
    selectedOffer: {
      type: mongoose.Types.ObjectId,
      ref: "offers",
      default: null,
    },
    quantity: { type: Number, required: true, default: 1 },
    status: {
      type: String,
      enum: ["active", "ordered", "abandoned", "completed"],
      default: "active",
    },
    // session_id: {
    //   type: mongoose.Types.ObjectId,
    //   ref: "sessions",
    //   default: null,
    // },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

// Indexes
cartSchema.index({ user_id: 1 });
cartSchema.index({ product_id: 1 });
cartSchema.index({ user_id: 1, product_id: 1 });

const Cart = mongoose.model<typeCart>("carts", cartSchema);
export default Cart;
