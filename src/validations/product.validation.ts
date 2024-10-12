import Joi from "joi";

const addProductSchema = Joi.object({
  product_name: Joi.string().required(),
  product_code: Joi.string().required(),
  manufacture_date: Joi.date(),
  expiry_date: Joi.date(),
  description: Joi.string().allow(""),
  brand_id: Joi.string().required(),
  category_id: Joi.string().required(),
  gst_percent: Joi.number().required(),
  price: Joi.number().required(),
  size: Joi.number().required(),
  quantity: Joi.number().required(),
  is_verified: Joi.boolean(),
  is_active: Joi.boolean(),

  is_featured: Joi.boolean(),
  base_unit: Joi.string().valid("GM", "ML", "KG", "LTR", "EACH").required(),
  grn_date: Joi.date().optional(),
  lot_no: Joi.string(),
  vendor_name: Joi.string(),
});

const updateProductSchema = Joi.object({
  product_name: Joi.string().allow(""),
  description: Joi.string().allow(""),
  manufacture_date: Joi.date(),
  expiry_date: Joi.date(),
  brand_id: Joi.string().allow(""),
  category_id: Joi.string().allow(""),
  gst_percent: Joi.number().allow(""),
  size: Joi.number().allow(""),
  price: Joi.number().allow(""),
  quantity: Joi.number().allow(""),
  is_verified: Joi.boolean(),
  is_active: Joi.boolean(),
  is_featured: Joi.boolean(),
  base_unit: Joi.string().valid("GM", "ML", "KG", "LTR", "EACH"),
  grn_date: Joi.date().optional(),
  lot_no: Joi.string(),
  vendor_name: Joi.string(),
});

const deleteProductImageSchema = Joi.object({
  src: Joi.string().required(),
});

const addQuantitySchema = Joi.object({
  quantity: Joi.number().positive().required(),
});

export const productMiddlewareSchemas = {
  addProduct: addProductSchema,
  updateProduct: updateProductSchema,
  deleteProductImage: deleteProductImageSchema,
  addQuantity: addQuantitySchema,
};
