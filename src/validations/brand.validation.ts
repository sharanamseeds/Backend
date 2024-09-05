import Joi from "joi";

const addBrandSchema = Joi.object({
  brand_name: Joi.string().required(),
  tag_line: Joi.string(),
});

const updateBrandSchema = Joi.object({
  brand_name: Joi.string().allow(""), // Allow empty strings for optional updates
  tag_line: Joi.string().allow(""), // Allow empty strings for optional updates
});

export const brandMiddlewareSchemas = {
  addBrand: addBrandSchema,
  updateBrand: updateBrandSchema,
};
