import Joi from "joi";
const addOrderSchema = Joi.object({
    user_id: Joi.string().allow(""),
    products: Joi.array()
        .items(Joi.object({
        product_id: Joi.string().required(),
        offer_id: Joi.string().optional(),
        quantity: Joi.number().required(),
    }))
        .min(1)
        .required(),
});
const calulateOrderSchema = Joi.object({
    user_id: Joi.string().allow(""),
    products: Joi.array()
        .items(Joi.object({
        product_id: Joi.string().required(),
        offer_id: Joi.string().optional().allow(null),
        quantity: Joi.number().required(),
    }))
        .min(1)
        .required(),
});
const updateOrderSchema = Joi.object({
    status: Joi.string()
        .valid("confirm", "rejected", "pending", "delivered", "cancelled", "return_requested", "return_accepeted", "return_rejected", "return_fulfilled")
        .required(),
    is_creditable: Joi.boolean().allow(null),
    credit_duration: Joi.number()
        .min(1)
        .max(90)
        .positive()
        .when("is_creditable", {
        is: true,
        then: Joi.required(),
        otherwise: Joi.forbidden(), // If is_creditable is not true, credit_duration is not allowed
    }),
    order_notes: Joi.string().allow(""),
    payment_method: Joi.string()
        .valid("cash", "online")
        .when("status", {
        is: ["delivered", "return_fulfilled"],
        then: Joi.optional(),
        otherwise: Joi.forbidden(),
    }),
    reason: Joi.string().when("status", {
        is: ["return_rejected", "rejected"],
        then: Joi.required(),
        otherwise: Joi.forbidden(),
    }),
});
const returnOrderSchema = Joi.object({
    reason: Joi.string().required(),
});
export const orderMiddlewareSchemas = {
    addOrder: addOrderSchema,
    calulateOrder: calulateOrderSchema,
    updateOrder: updateOrderSchema,
    returnOrder: returnOrderSchema,
};
//# sourceMappingURL=order.validation.js.map