import Joi from "joi";
const addBillSchema = Joi.object({
    order_id: Joi.string().required(),
    customer_id: Joi.string().required(),
    delivery_partner_id: Joi.string().required(),
    order_amount: Joi.number().required(),
    invoice_id: Joi.string().required(),
    bill_amount: Joi.number().required(),
    tax_amount: Joi.number().required(),
    discount_amount: Joi.number().required(),
    delivery_charge: Joi.number().required(),
    payment_status: Joi.string().valid("paid", "unpaid").required(),
    payment_method: Joi.string().allow(""),
    payment_details: Joi.string().allow(""), // Optional, allowing empty strings
});
const updateBillSchema = Joi.object({
    payment_status: Joi.string().valid("paid", "unpaid").required(),
    payment_method: Joi.string().when("payment_status", {
        is: "paid",
        then: Joi.required(),
        otherwise: Joi.allow(""),
    }),
});
export const billMiddlewareSchemas = {
    addBill: addBillSchema,
    updateBill: updateBillSchema,
};
//# sourceMappingURL=bill.validation.js.map