import mongoose, { Document, Schema } from "mongoose";

export interface typePurchaseOrder extends Document {
  vendor_id: mongoose.Types.ObjectId;
  invoice_no: string;
  contact_name: string;
  contact_number: string;
  purchase_date: Date;
  products: {
    product_id: mongoose.Types.ObjectId;
    quantity: number;
    uom: string;
    final_quantity: string;
    manufacture_date: Date;
    expiry_date: Date;
    lot_no: string;
  }[];
  advance_payment_amount: number;
  status:
    | "transit"
    | "completed"
    | "due"
    | "routing_payment"
    | "advance_payment";
  payment_status: "paid" | "unpaid";
  order_notes: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const purchaseOrderSchema: Schema = new Schema(
  {
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
  },
  { timestamps: true }
);

purchaseOrderSchema.index({ vendor_id: 1 });
purchaseOrderSchema.index({ invoice_no: 1 });
purchaseOrderSchema.index({ purchase_date: 1 });
purchaseOrderSchema.index({ status: 1 });
purchaseOrderSchema.index({ advance_payment_amount: 1 });

const PurchaseOrder = mongoose.model<typePurchaseOrder>(
  "purchase_orders",
  purchaseOrderSchema
);

export default PurchaseOrder;
