import mongoose from "mongoose";
const wishSchema = new mongoose.Schema({
    user_id: { type: mongoose.Types.ObjectId, ref: "users", required: true },
    product_id: {
        type: mongoose.Types.ObjectId,
        ref: "products",
        required: true,
    },
    priority: { type: Number },
    notes: { type: String },
}, { timestamps: true });
wishSchema.index({ user_id: 1 });
wishSchema.index({ product_id: 1 });
wishSchema.index({ user_id: 1, product_id: 1 });
const Wish = mongoose.model("wishes", wishSchema);
export default Wish;
//# sourceMappingURL=wish.%20model.js.map