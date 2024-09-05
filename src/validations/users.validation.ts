import Joi from "joi";

const addUserSchema = Joi.object({
  password: Joi.string(),
  name: Joi.string(),
  agro_name: Joi.string().required(),
  contact_number: Joi.string().required(),
  gst_number: Joi.string().length(15),
  email: Joi.string().email().required(),
  billing_address: Joi.object({
    address_line: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    pincode: Joi.string(),
    coordinates: Joi.array().items(Joi.number()).length(2),
  }),
  billing_equals_shipping: Joi.boolean(),
  shipping_address: Joi.object({
    address_line: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    pincode: Joi.string(),
    coordinates: Joi.array().items(Joi.number()).length(2),
  }),
});

const updateUserSchema = Joi.object({
  role_id: Joi.string(),
  gst_number: Joi.string().length(15),
  is_verified: Joi.boolean(),
  is_blocked: Joi.boolean(),
  is_email_verified: Joi.boolean(),
  password: Joi.string(),
  name: Joi.string(),
  agro_name: Joi.string(),
  contact_number: Joi.string(),
  email: Joi.string(),
  billing_address: Joi.object({
    address_line: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    pincode: Joi.string(),
    coordinates: Joi.array().items(Joi.number()).length(2),
  }),
  billing_equals_shipping: Joi.boolean(),
  shipping_address: Joi.object({
    address_line: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    pincode: Joi.string(),
    coordinates: Joi.array().items(Joi.number()).length(2),
  }),
});

export const userMiddlewareSchemas = {
  addUserSchema,
  updateUserSchema,
};
