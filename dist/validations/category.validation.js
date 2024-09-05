import Joi from "joi";
const addCategorySchema = Joi.object({
    category_name: Joi.string().required(),
    description: Joi.string().allow(""), // Allow empty strings for optional description
});
const updateCategorySchema = Joi.object({
    category_name: Joi.string().allow(""),
    description: Joi.string().allow(""), // Allow empty strings for optional updates
});
export const categoryMiddlewareScheas = {
    addCategory: addCategorySchema,
    updateCategory: updateCategorySchema,
};
//# sourceMappingURL=category.validation.js.map