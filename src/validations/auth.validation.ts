import Joi from "joi";

const userLoginSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
});

const registerSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  confirm_password: Joi.string().required(),
  gst_number: Joi.string().required(),
});

const changePasswordSchema = Joi.object({
  new_password: Joi.string().required(),
  confirm_password: Joi.string()
    .required()
    .valid(Joi.ref("new_password"))
    .messages({ "any.only": "Passwords must match" }),
  email: Joi.string().email().required(),
});

const refreshUserTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const sendVerificationCodeSchema = Joi.object({
  email: Joi.string().email().required(),
});

const verifyVerificationCodeSchema = Joi.object({
  email: Joi.string().email().required(),
  verification_code: Joi.string().required(),
});

export const authMiddlewareSchemas = {
  userLoginSchema,
  registerSchema,
  changePasswordSchema,
  refreshUserTokenSchema,
  sendVerificationCodeSchema,
  verifyVerificationCodeSchema,
};
