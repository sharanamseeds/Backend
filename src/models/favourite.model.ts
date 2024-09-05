import mongoose from "mongoose";

export interface typeFavourite extends Document {
  _id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  product_id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const favouriteSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Types.ObjectId, ref: "users", required: true },
    product_id: {
      type: mongoose.Types.ObjectId,
      ref: "products",
      required: true,
    },
  },
  { timestamps: true }
);

favouriteSchema.index({ user_id: 1 });
favouriteSchema.index({ product_id: 1 });
favouriteSchema.index({ user_id: 1, product_id: 1 });

const Favourite = mongoose.model<typeFavourite>("favourites", favouriteSchema);
export default Favourite;
