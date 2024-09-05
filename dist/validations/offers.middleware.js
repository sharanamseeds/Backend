import * as yup from "yup";
const addOffer = yup.object().shape({
    description: yup.string().default(""),
    offer_code: yup.string().required("Offer code is required"),
    offer_name: yup.string().required("Offer name is required"),
    product_specified: yup.boolean().required(),
    product_id: yup
        .array()
        .when("product_specified", (value, schema) => value[0] == true
        ? schema.of(yup.string()).min(1).required()
        : schema.optional()),
    category_specified: yup.boolean().required(),
    category_id: yup
        .array()
        .when("category_specified", (value, schema) => value[0] == true
        ? schema.of(yup.string()).min(1).required()
        : schema.optional()),
    offer_type: yup
        .string()
        .oneOf([
        "percentage",
        "fixed_amount",
        "tiered",
        "buy_x_get_y",
        "bundle",
        "referral",
        "coupon",
    ])
        .required(),
    percentage_discount: yup
        .number()
        .when("offer_type", (value, schema) => value[0] == "percentage"
        ? schema.min(0.1).max(99.99).positive().required()
        : schema.optional()),
    fixed_amount_discount: yup
        .number()
        .when("offer_type", (value, schema) => value[0] == "fixed_amount"
        ? schema.positive().required()
        : schema.optional()),
    tiers: yup.array().when("offer_type", (value, schema) => value[0] == "tiered"
        ? schema
            .of(yup.object().shape({
            min_order_value: yup.number().positive().required(),
            discount: yup.number().positive().required(),
        }))
            .min(1)
            .required()
        : schema.optional()),
    buy_quantity: yup
        .number()
        .when("offer_type", (value, schema) => value[0] == "buy_x_get_y"
        ? schema.min(1).positive().required()
        : schema.optional()),
    get_quantity: yup
        .number()
        .when("offer_type", (value, schema) => value[0] == "buy_x_get_y"
        ? schema.min(1).positive().required()
        : schema.optional()),
    bundle_items: yup.array().when("offer_type", (value, schema) => value[0] == "bundle"
        ? schema
            .of(yup.object().shape({
            product_id: yup.string().required(),
            quantity: yup.number().min(1).positive().required(),
            price: yup.number().min(1).positive().required(),
        }))
            .min(1)
            .required()
        : schema.optional()),
    referral_code: yup
        .string()
        .when("offer_type", (value, schema) => value[0] == "referral" ? schema.required() : schema.optional()),
    referral_amount: yup
        .number()
        .when("offer_type", (value, schema) => value[0] == "referral"
        ? schema.min(1).positive().required()
        : schema.optional()),
    coupon_code: yup
        .string()
        .when("offer_type", (value, schema) => value[0] == "coupon" ? schema.required() : schema.optional()),
    coupon_details: yup
        .object()
        .shape({
        coupon_type: yup.string().oneOf(["percentage", "amount"]).required(),
        value: yup
            .number()
            .when("coupon_details.coupon_type", (value, schema) => value[0] == "percentage"
            ? schema.min(0.1).max(99.99).positive().required()
            : schema.min(1).positive().required()),
    })
        .when("offer_type", (value, schema) => value[0] == "coupon" ? schema.required() : schema.optional()),
});
const updateOffer = yup.object().shape({
    is_active: yup.boolean(),
    description: yup.string(),
    offer_name: yup.string(),
});
export const offerMiddleware = {
    addOffer,
    updateOffer,
};
//# sourceMappingURL=offers.middleware.js.map