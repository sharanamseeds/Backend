import Joi from "joi";

const productSchema = Joi.object({
  product_id: Joi.string().required(),
  quantity: Joi.number().required(),
  lot_no: Joi.string().required(),
  manufacture_date: Joi.date().required(),
  expiry_date: Joi.date().required(),
});

const addPurchaseOrderSchema = Joi.object({
  vendor_id: Joi.string().required(),
  contact_name: Joi.string().required(),
  contact_number: Joi.string().required(),
  products: Joi.array().items(productSchema).required(),
  advance_payment_amount: Joi.number().default(0),
  status: Joi.string()
    .valid("transit", "completed", "due", "routing_payment", "advance_payment")
    .required(),
  payment_status: Joi.string().valid("paid", "unpaid").required(),
  order_notes: Joi.string().allow(""),
});

const updatePurchaseOrderSchema = Joi.object({
  contact_name: Joi.string(),
  contact_number: Joi.string(),
  products: Joi.array().items(productSchema),
  status: Joi.string().valid(
    "transit",
    "completed",
    "due",
    "routing_payment",
    "advance_payment"
  ),
  payment_status: Joi.string().valid("paid", "unpaid"),
  order_notes: Joi.string().allow(""),
});

export const purchaseOrderMiddlewareSchemas = {
  addPurchaseOrderSchema,
  updatePurchaseOrderSchema,
};
