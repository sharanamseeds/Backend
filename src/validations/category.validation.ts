import Joi from "joi";

const addCategorySchema = Joi.object({
  category_name: Joi.string().required(),
  description: Joi.string().allow(""), // Allow empty strings for optional description
});

const updateCategorySchema = Joi.object({
  category_name: Joi.string().allow(""), // Allow empty strings for optional updates
  description: Joi.string().allow(""), // Allow empty strings for optional updates
});

export const categoryMiddlewareScheas = {
  addCategory: addCategorySchema,
  updateCategory: updateCategorySchema,
};
