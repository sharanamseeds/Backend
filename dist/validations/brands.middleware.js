import * as yup from "yup";
const addBrand = yup.object().shape({
    brand_name: yup.string().required(),
    tag_line: yup.string().required(),
});
const updateBrand = yup.object().shape({
    brand_name: yup.string(),
    tag_line: yup.string(),
});
export const brandMiddleware = {
    addBrand,
    updateBrand,
};
//# sourceMappingURL=brands.middleware.js.map