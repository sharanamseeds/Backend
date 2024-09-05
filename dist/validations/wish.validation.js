import Joi from "joi";
const addWishSchema = Joi.object({
    user_id: Joi.string().required(),
    product_id: Joi.string().required(),
    priority: Joi.number().integer().min(0),
    notes: Joi.string().allow(""), // Optional notes
});
const updateWishSchema = Joi.object({
    user_id: Joi.string(),
    product_id: Joi.string(),
    priority: Joi.number().integer().min(0),
    notes: Joi.string().allow(""),
});
export const wishMiddlewareSchemas = {
    addWish: addWishSchema,
    updateWish: updateWishSchema,
};
//# sourceMappingURL=wish.validation.js.map