import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
    user_id: { type: mongoose.Types.ObjectId, ref: "users", required: true },
    added_by: { type: mongoose.Types.ObjectId, default: null, ref: "users" },
    updated_by: { type: mongoose.Types.ObjectId, default: null, ref: "users" },
    bill_id: { type: mongoose.Types.ObjectId, default: null, ref: "bills" },
    order_type: {
        type: String,
        required: true,
        enum: ["buy", "sell"],
        default: "sell",
    },
    buy_order_id: {
        type: mongoose.Types.ObjectId,
        default: null,
        ref: "orders",
    },
    sell_order_id: {
        type: mongoose.Types.ObjectId,
        default: null,
        ref: "orders",
    },
    products: [
        {
            product_id: {
                type: mongoose.Types.ObjectId,
                ref: "products",
                required: true,
            },
            offer_id: {
                type: mongoose.Types.ObjectId,
                default: null,
                ref: "offers",
            },
            quantity: { type: Number, required: true },
            total_amount: { type: Number, required: true },
            offer_discount: { type: Number, default: 0 },
            gst_rate: { type: Number, default: 0 },
            purchase_price: { type: Number, required: true },
            gst_amount: { type: Number, required: true },
            manufacture_date: { type: Date, required: true },
            expiry_date: { type: Date, required: true },
        },
    ],
    order_amount: { type: Number, required: true },
    discount_amount: { type: Number, default: 0 },
    billing_amount: { type: Number, required: true },
    tax_amount: { type: Number, required: true },
    status: {
        type: String,
        required: true,
        enum: [
            "confirm",
            "pending",
            "rejected",
            "delivered",
            "cancelled",
            "return_requested",
            "return_accepeted",
            "return_rejected",
            "return_fulfilled",
        ],
        default: "pending",
    },
    is_creditable: { type: Boolean, default: false },
    is_retuned: { type: Boolean, default: false },
    credit_duration: { type: Number },
    order_notes: {
        type: String,
    },
    reason: {
        type: String,
    },
}, { timestamps: true });
orderSchema.index({ user_id: 1 });
orderSchema.index({ order_type: 1 });
orderSchema.index({ buy_order_id: 1 });
orderSchema.index({ sell_order_id: 1 });
orderSchema.index({ is_retuned: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ is_creditable: 1 });
orderSchema.index({ credit_duration: 1 });
const Order = mongoose.model("orders", orderSchema);
export default Order;
//# sourceMappingURL=orders.model.js.map