import mongoose from "mongoose";
const cartSchema = new mongoose.Schema({
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
}, { timestamps: true });
// Indexes
cartSchema.index({ user_id: 1 });
cartSchema.index({ product_id: 1 });
cartSchema.index({ user_id: 1, product_id: 1 });
const Cart = mongoose.model("carts", cartSchema);
export default Cart;
//# sourceMappingURL=cart.model.js.map