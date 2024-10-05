import mongoose, { Schema } from "mongoose";
const purchaseOrderSchema = new Schema({
    vendor_id: {
        type: mongoose.Types.ObjectId,
        ref: "vendors",
        required: true,
    },
    invoice_no: {
        type: String,
        required: true,
    },
    purchase_date: {
        type: Date,
        default: new Date(),
    },
    contact_name: {
        type: String,
        required: true,
    },
    contact_number: {
        type: String,
        required: true,
    },
    products: [
        {
            product_id: {
                type: mongoose.Types.ObjectId,
                ref: "products",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            uom: {
                type: String,
                required: true,
            },
            final_quantity: {
                type: String,
                required: true,
            },
            lot_no: {
                type: String,
                required: true,
            },
            manufacture_date: {
                type: Date,
                required: true,
            },
            expiry_date: {
                type: Date,
                required: true,
            },
        },
    ],
    advance_payment_amount: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: [
            "transit",
            "completed",
            "due",
            "routing_payment",
            "advance_payment",
        ],
        required: true,
    },
    payment_status: {
        type: String,
        enum: ["paid", "unpaid"],
        required: true,
    },
    order_notes: {
        type: String,
        default: "",
    },
}, { timestamps: true });
purchaseOrderSchema.index({ vendor_id: 1 });
purchaseOrderSchema.index({ invoice_no: 1 });
purchaseOrderSchema.index({ purchase_date: 1 });
purchaseOrderSchema.index({ status: 1 });
purchaseOrderSchema.index({ advance_payment_amount: 1 });
const PurchaseOrder = mongoose.model("purchase_orders", purchaseOrderSchema);
export default PurchaseOrder;
//# sourceMappingURL=purchase_orders.model.js.map