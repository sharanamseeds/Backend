import Joi from "joi";

const deleteAppBannerImage = Joi.object({
  src: Joi.string().required(),
});

export const appBannerMiddlewareSchemas = {
  deleteAppBannerImage,
};
