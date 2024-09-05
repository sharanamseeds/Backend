import Joi from "joi";

const addRoleSchema = Joi.object({
  role_name: Joi.string().required(),
  is_active: Joi.boolean().default(true),
});

const updateRoleSchema = Joi.object({
  role_name: Joi.string().allow(""),
  is_active: Joi.boolean().allow(""),
});

export const roleMiddlewareSchemas = {
  addRole: addRoleSchema,
  updateRole: updateRoleSchema,
};
