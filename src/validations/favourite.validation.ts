import Joi from "joi";

const addFavouriteSchema = Joi.object({
  user_id: Joi.string().required(),
  product_id: Joi.string().required(),
});

const updateFavouriteSchema = Joi.object({
  user_id: Joi.string(),
  product_id: Joi.string(),
});

export const favouriteMiddlewareSchemas = {
  addFavourite: addFavouriteSchema,
  updateFavourite: updateFavouriteSchema,
};
