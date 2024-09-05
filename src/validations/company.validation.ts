import Joi from "joi";

const addCompanySchema = Joi.object({
  brand_name: Joi.string().required(),
  legal_name: Joi.string().required(),
  slogan: Joi.string().allow(""),
  industry: Joi.string().required(),
  description: Joi.string().required(),
  website: Joi.string().uri({ scheme: ["http", "https"] }), // More strict URL validation
  type: Joi.string().valid("B2B", "B2C").required(),
  contact_information: Joi.object({
    address_line: Joi.string().allow(""),
    city: Joi.string().allow(""),
    state: Joi.string().allow(""),
    pincode: Joi.string().allow(""),
    type: Joi.string().valid("Point").default("Point"),
    coordinates: Joi.array().items(Joi.number()).length(2),
  }),
  billing_information: Joi.object({
    gst_number: Joi.string().length(15).required(),
    business_model: Joi.string().required(),
  }),
});

const updateCompanySchema = Joi.object({
  brand_name: Joi.string().allow(""),
  legal_name: Joi.string().allow(""),
  slogan: Joi.string().allow(""),
  industry: Joi.string().allow(""),
  description: Joi.string().allow(""),
  website: Joi.string().uri({ scheme: ["http", "https"] }), // More strict URL validation
  type: Joi.string().valid("B2B", "B2C"),
  contact_information: Joi.object({
    address_line: Joi.string().allow(""),
    city: Joi.string().allow(""),
    state: Joi.string().allow(""),
    pincode: Joi.string().allow(""),
    type: Joi.string().valid("Point").default("Point"),
    coordinates: Joi.array().items(Joi.number()).length(2),
  }),
  billing_information: Joi.object({
    gst_number: Joi.string().length(15),
    business_model: Joi.string().allow(""),
  }),
});

export const companyMiddlewareSchemas = {
  addCompany: addCompanySchema,
  updateCompany: updateCompanySchema,
};
