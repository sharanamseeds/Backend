import Joi from "joi";

const addCartSchema = Joi.object({
  user_id: Joi.string().required(), // ObjectId is usually a string representation
  product_id: Joi.string().required(),
  quantity: Joi.number().min(1).default(1),
  status: Joi.string()
    .valid("active", "ordered", "abandoned", "completed")
    .default("active"),
  notes: Joi.string().allow(""), // Optional field
});

const updateCartSchema = Joi.object({
  user_id: Joi.string(),
  product_id: Joi.string(),
  quantity: Joi.number().min(1),
  status: Joi.string().valid("active", "ordered", "abandoned", "completed"),
  notes: Joi.string().allow(""),
});

export const cartMiddlewareSchemas = {
  addCart: addCartSchema,
  updateCart: updateCartSchema,
};
