import Joi from "joi";

const addLanguageSchema = Joi.object({
  lang_code: Joi.string().required(),
  lang_name: Joi.string().required(),
});

const updateLanguageSchema = Joi.object({
  lang_name: Joi.string().allow(""),
});

export const languageMiddlewareSchemas = {
  addLanguage: addLanguageSchema,
  updateLanguage: updateLanguageSchema,
};
