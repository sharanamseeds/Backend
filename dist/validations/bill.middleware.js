import * as yup from "yup";
const addBillSchema = yup.object().shape({
    order_id: yup.string().required(),
    customer_id: yup.string().required(),
    delivery_partner_id: yup.string().required(),
    order_amount: yup.number().required(),
    invoice_id: yup.string().required(),
    bill_amount: yup.number().required(),
    tax_amount: yup.number().required(),
    discount_amount: yup.number().required(),
    delivery_charge: yup.number().required(),
    payment_status: yup.string().oneOf(["paid", "unpaid"]).required(),
    payment_method: yup.string(),
    payment_details: yup.string(),
});
const updateBillSchema = yup.object().shape({
    payment_status: yup.string().oneOf(["paid", "unpaid"]).required(),
    payment_method: yup
        .string()
        .when("payment_status", (value, schema) => value[0] == "paid" ? schema.required() : schema.optional()),
});
export const billMiddleware = {
    addBill: addBillSchema,
    updateBill: updateBillSchema,
};
//# sourceMappingURL=bill.middleware.js.map