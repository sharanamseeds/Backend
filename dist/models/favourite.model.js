import mongoose from "mongoose";
const favouriteSchema = new mongoose.Schema({
    user_id: { type: mongoose.Types.ObjectId, ref: "users", required: true },
    product_id: {
        type: mongoose.Types.ObjectId,
        ref: "products",
        required: true,
    },
}, { timestamps: true });
favouriteSchema.index({ user_id: 1 });
favouriteSchema.index({ product_id: 1 });
favouriteSchema.index({ user_id: 1, product_id: 1 });
const Favourite = mongoose.model("favourites", favouriteSchema);
export default Favourite;
//# sourceMappingURL=favourite.model.js.map