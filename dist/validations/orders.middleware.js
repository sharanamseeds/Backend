import * as yup from "yup";
const addOrder = yup.object().shape({
    user_id: yup.string(),
    offer_id: yup.string(),
    products: yup
        .array()
        .of(yup.object().shape({
        product_id: yup.string().required("Product is required"),
        amount: yup.number().required("Packing amount is required"),
        quantity: yup.number().required("Quantity is required"),
    }))
        .min(1)
        .required(),
});
const updateOrder = yup.object().shape({
    is_creditable: yup.boolean(),
    credit_duration: yup
        .number()
        .when("is_creditable", (value, schema) => value[0] == true
        ? schema.min(1).max(90).positive().required()
        : schema.optional()),
    order_notes: yup.string(),
    status: yup
        .string()
        .oneOf([
        "confirm",
        "rejected",
        "pending",
        "shipped",
        "delivered",
        "cancelled",
        "return_requested",
        "return_accepeted",
        "return_rejected",
        "return_fulfilled",
    ]),
    payment_method: yup
        .string()
        .oneOf(["cash", "online"])
        .when("status", (value, schema) => value[0] == "delivered" || value[0] == "return_fulfilled"
        ? schema.required()
        : schema.optional()),
    reason: yup
        .string()
        .when("status", (value, schema) => value[0] == "return_rejected" || value[0] == "rejected"
        ? schema.required()
        : schema.optional()),
});
const returnOrder = yup.object().shape({
    reason: yup.string().required(),
    products: yup
        .array()
        .of(yup.object().shape({
        product_id: yup.string().required("Product is required"),
        quantity: yup.number().required("Quantity is required"),
    }))
        .min(1)
        .required(),
});
export const orderMiddleware = {
    addOrder,
    updateOrder,
    returnOrder,
};
//# sourceMappingURL=orders.middleware.js.map