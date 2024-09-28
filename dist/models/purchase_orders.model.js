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
    purchase_invoice: {
        type: String,
        default: null,
    },
    purchase_date: {
        type: Date,
        default: new Date(),
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
            offer_discount: {
                type: Number,
                default: 0,
            },
            total_amount: {
                type: Number,
                required: true,
            },
            gst_rate: {
                type: Number,
                required: true,
            },
            purchase_price: {
                type: Number,
                required: true,
            },
            gst_amount: {
                type: Number,
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
    order_amount: {
        type: Number,
        required: true,
    },
    discount_amount: {
        type: Number,
        default: 0,
    },
    billing_amount: {
        type: Number,
        required: true,
    },
    tax_amount: {
        type: Number,
        required: true,
    },
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
    is_creditable: {
        type: Boolean,
        default: false,
    },
    credit_duration: {
        type: Number,
        default: 0,
    },
    order_notes: {
        type: String,
        default: "",
    },
}, { timestamps: true });
purchaseOrderSchema.index({ vendor_id: 1 });
const PurchaseOrder = mongoose.model("purchase_orders", purchaseOrderSchema);
export default PurchaseOrder;
//# sourceMappingURL=purchase_orders.model.js.map