import Joi from "joi";

const addOfferSchema = Joi.object({
  description: Joi.string().allow(""),
  offer_code: Joi.string().required(),
  offer_name: Joi.string().required(),
  product_specified: Joi.boolean().default(false),
  products: Joi.array().when("product_specified", {
    is: true,
    then: Joi.array().items(Joi.string()).min(1).required(),
    otherwise: Joi.array().allow(""),
  }),
  category_specified: Joi.boolean().default(false),
  categories: Joi.array().when("category_specified", {
    is: true,
    then: Joi.array().items(Joi.string()).min(1).required(),
    otherwise: Joi.array().allow(""),
  }),
  offer_type: Joi.string()
    .valid(
      "percentage",
      "fixed_amount",
      "tiered",
      "buy_x_get_y",
      "bundle",
      "referral",
      "coupon"
    )
    .required(),
  percentage_discount: Joi.number().when("offer_type", {
    is: "percentage",
    then: Joi.number().min(0.1).max(99.99).positive().required(),
    otherwise: Joi.allow(""),
  }),
  fixed_amount_discount: Joi.number().when("offer_type", {
    is: "fixed_amount",
    then: Joi.number().positive().required(),
    otherwise: Joi.allow(""),
  }),
  tiers: Joi.array().when("offer_type", {
    is: "tiered",
    then: Joi.array()
      .items(
        Joi.object({
          min_order_value: Joi.number().positive().required(),
          discount: Joi.number().positive().required(),
        })
      )
      .min(1)
      .required(),
    otherwise: Joi.array().allow(""),
  }),
  buy_quantity: Joi.number().when("offer_type", {
    is: "buy_x_get_y",
    then: Joi.number().min(1).positive().required(),
    otherwise: Joi.allow(""),
  }),
  get_quantity: Joi.number().when("offer_type", {
    is: "buy_x_get_y",
    then: Joi.number().min(1).positive().required(),
    otherwise: Joi.allow(""),
  }),
  bundle_items: Joi.array().when("offer_type", {
    is: "bundle",
    then: Joi.array()
      .items(
        Joi.object({
          product_id: Joi.string().required(),
          quantity: Joi.number().min(1).positive().required(),
          price: Joi.number().min(1).positive().required(),
        })
      )
      .min(1)
      .required(),
    otherwise: Joi.array().allow(""),
  }),
  referral_code: Joi.string().when("offer_type", {
    is: "referral",
    then: Joi.string().required(),
    otherwise: Joi.allow(""),
  }),
  referral_amount: Joi.number().when("offer_type", {
    is: "referral",
    then: Joi.number().min(1).positive().required(),
    otherwise: Joi.allow(""),
  }),
  coupon_code: Joi.string().when("offer_type", {
    is: "coupon",
    then: Joi.string().required(),
    otherwise: Joi.allow(""),
  }),
  coupon_details: Joi.object({
    coupon_type: Joi.string().valid("percentage", "amount").required(),
    value: Joi.number().when("coupon_details.coupon_type", {
      is: "percentage",
      then: Joi.number().min(0.1).max(99.99).positive().required(),
      otherwise: Joi.number().min(1).positive().required(),
    }),
  }).when("offer_type", {
    is: "coupon",
    then: Joi.required(),
    otherwise: Joi.allow(""),
  }),
});

const updateOfferSchema = Joi.object({
  is_active: Joi.boolean().allow(""),
  description: Joi.string().allow(""),
  offer_name: Joi.string().allow(""),
});

export const offerMiddlewareSchemas = {
  addOffer: addOfferSchema,
  updateOffer: updateOfferSchema,
};
