import * as yup from "yup";
const addUser = yup.object().shape({
    password: yup.string(),
    name: yup.string().required(),
    contact_number: yup.string().required(),
    gst_number: yup.string().length(15),
    email: yup.string().email("Invalid email format").required(),
    billing_address: yup.object().shape({
        address_line: yup.string(),
        city: yup.string(),
        state: yup.string(),
        pincode: yup.string(),
        coordinates: yup.array().of(yup.number()).length(2),
    }),
    billing_equals_shipping: yup.boolean(),
    shipping_address: yup.object().shape({
        address_line: yup.string(),
        city: yup.string(),
        state: yup.string(),
        pincode: yup.string(),
        coordinates: yup.array().of(yup.number()).length(2),
    }),
});
const updateUser = yup.object().shape({
    role_id: yup.string(),
    gst_number: yup.string().length(15),
    is_verified: yup.boolean(),
    is_blocked: yup.boolean(),
    is_email_verified: yup.boolean(),
    password: yup.string(),
    name: yup.string(),
    contact_number: yup.string(),
    email: yup.string(),
    billing_address: yup.object().shape({
        address_line: yup.string(),
        city: yup.string(),
        state: yup.string(),
        pincode: yup.string(),
        coordinates: yup.array().of(yup.number()).length(2),
    }),
    billing_equals_shipping: yup.boolean(),
    shipping_address: yup.object().shape({
        address_line: yup.string(),
        city: yup.string(),
        state: yup.string(),
        pincode: yup.string(),
        coordinates: yup.array().of(yup.number()).length(2),
    }),
});
export const userMiddleware = {
    addUser,
    updateUser,
};
//# sourceMappingURL=users.middleware.js.map