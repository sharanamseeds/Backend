import * as yup from "yup";
const addCategory = yup.object().shape({
    category_name: yup.string().required(),
    description: yup.string(),
});
const updateCategory = yup.object().shape({
    category_name: yup.string(),
    description: yup.string(),
});
export const categoryMiddleware = {
    addCategory,
    updateCategory,
};
//# sourceMappingURL=categories.middleware.js.map