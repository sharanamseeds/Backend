import * as yup from "yup";
const addLedger = yup.object().shape({
    bill_id: yup.string().required(),
    description: yup.string(),
});
const updateLedger = yup.object().shape({
    description: yup.string(),
});
export const ledgerMiddleware = {
    addLedger,
    updateLedger,
};
//# sourceMappingURL=ledger.middleware.js.map