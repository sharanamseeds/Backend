import mongoose from "mongoose";
const wishListSchema = new mongoose.Schema({
    user_id: { type: mongoose.Types.ObjectId, ref: "users", required: true },
    products: [
        {
            product: {
                type: mongoose.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            priority: { type: Number },
            notes: { type: String },
        },
    ],
}, { timestamps: true });
wishListSchema.index({ user_id: 1 });
const Wish = mongoose.model("wishLists", wishListSchema);
export default Wish;
//# sourceMappingURL=whish.%20model.js.map