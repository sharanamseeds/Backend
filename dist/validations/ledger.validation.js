import Joi from "joi";
const addLedgerSchema = Joi.object({
    bill_id: Joi.string().required(),
    description: Joi.string().allow(""),
});
const updateLedgerSchema = Joi.object({
    description: Joi.string().allow(""),
});
export const ledgerMiddlewareSchema = {
    addLedger: addLedgerSchema,
    updateLedger: updateLedgerSchema,
};
//# sourceMappingURL=ledger.validation.js.map