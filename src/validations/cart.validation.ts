import Joi from "joi";

const addCartSchema = Joi.object({
  product_id: Joi.string().required(),
  selectedOffer: Joi.string(),
  quantity: Joi.number().min(1).default(1),
  status: Joi.string()
    .valid("active", "ordered", "abandoned", "completed")
    .default("active"),
  notes: Joi.string().allow(""), // Optional field
});

const updateCartSchema = Joi.object({
  product_id: Joi.string(),
  quantity: Joi.number().min(1),
  selectedOffer: Joi.string(),
  status: Joi.string().valid("active", "ordered", "abandoned", "completed"),
  notes: Joi.string().allow(""),
});

export const cartMiddlewareSchemas = {
  addCart: addCartSchema,
  updateCart: updateCartSchema,
};
