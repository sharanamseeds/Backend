import * as yup from "yup";
const addProduct = yup.object().shape({
    product_name: yup.string().required(),
    product_code: yup.string().required(),
    description: yup.string(),
    brand_id: yup.string().required(),
    category_id: yup.string().required(),
    gst_percent: yup.number().required(),
    price: yup.number().required(),
    quantity: yup.number().required(),
});
const updateProduct = yup.object().shape({
    product_name: yup.string(),
    description: yup.string(),
    brand_id: yup.string(),
    category_id: yup.string(),
    gst_percent: yup.number(),
    price: yup.number(),
    quantity: yup.number(),
    is_verified: yup.boolean(),
    is_active: yup.boolean(),
});
const deleteProductImage = yup.object().shape({
    src: yup.string(),
});
const addQuantity = yup.object().shape({
    quantity: yup.number().positive().required(),
});
export const productMiddleware = {
    addProduct,
    updateProduct,
    deleteProductImage,
    addQuantity,
};
//# sourceMappingURL=products.middleware.js.map