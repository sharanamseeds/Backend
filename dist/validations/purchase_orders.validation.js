import Joi from "joi";
const productSchema = Joi.object({
    product_id: Joi.string().required(),
    quantity: Joi.number().required(),
    offer_discount: Joi.number().default(0),
    total_amount: Joi.number().required(),
    gst_rate: Joi.number().required(),
    purchase_price: Joi.number().required(),
    gst_amount: Joi.number().required(),
    lot_no: Joi.string().required(),
    manufacture_date: Joi.date().required(),
    expiry_date: Joi.date().required(),
});
const addPurchaseOrderSchema = Joi.object({
    vendor_id: Joi.string().required(),
    invoice_no: Joi.string().required(),
    // purchase_invoice: Joi.string().allow(null), // file
    purchase_date: Joi.date(),
    products: Joi.array().items(productSchema).required(),
    order_amount: Joi.number().required(),
    discount_amount: Joi.number().default(0),
    billing_amount: Joi.number().required(),
    tax_amount: Joi.number().required(),
    advance_payment_amount: Joi.number().default(0),
    status: Joi.string()
        .valid("transit", "completed", "due", "routing_payment", "advance_payment")
        .required(),
    payment_status: Joi.string().valid("paid", "unpaid").required(),
    is_creditable: Joi.boolean().default(false),
    credit_duration: Joi.number().default(0),
    order_notes: Joi.string().allow(""),
});
const updatePurchaseOrderSchema = Joi.object({
    invoice_no: Joi.string(),
    // purchase_invoice: Joi.string().allow(null),
    purchase_date: Joi.date(),
    status: Joi.string().valid("transit", "completed", "due", "routing_payment", "advance_payment"),
    payment_status: Joi.string().valid("paid", "unpaid"),
    order_notes: Joi.string().allow(""),
});
export const purchaseOrderMiddlewareSchemas = {
    addPurchaseOrderSchema,
    updatePurchaseOrderSchema,
};
//# sourceMappingURL=purchase_orders.validation.js.map