import Joi from "joi";

const addMoneySchema = Joi.object({
  user_id: Joi.string().required(),
  amount: Joi.number().required(),
  description: Joi.string().allow(""),
});

const updateMoneySchema = Joi.object({
  amount: Joi.number().required(),
  description: Joi.string().allow(""),
});

export const moneyMiddlewareSchemas = {
  addMoney: addMoneySchema,
  updateMoney: updateMoneySchema,
};
