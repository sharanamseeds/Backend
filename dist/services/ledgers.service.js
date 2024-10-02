var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
import User from "../models/users.model.js";
import Ledger from "../models/ledger.model.js";
import Bill from "../models/bill.model.js";
import Order from "../models/orders.model.js";
import { masterConfig } from "../config/master.config.js";
import { escapeRegex } from "../helpers/common.helpers..js";
const getLedgerList = ({ query, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { limit, page, pagination = true, sortBy = "createdAt", sortOrder = "asc", user_id, bill_id, bill_amount, invoice_id, type, search, } = query;
        if (typeof limit === "string") {
            limit = Number(limit);
        }
        if (!limit || isNaN(limit)) {
            limit = 50;
        }
        if (typeof page === "string") {
            page = Number(page);
        }
        if (!page || isNaN(page)) {
            page = 1;
        }
        if (typeof pagination === "string") {
            pagination = pagination === "true";
        }
        let filterQuery = {};
        if (user_id) {
            filterQuery.user_id = new mongoose.Types.ObjectId(user_id);
        }
        if (bill_id) {
            filterQuery.bill_id = new mongoose.Types.ObjectId(bill_id);
        }
        if (bill_amount) {
            filterQuery.bill_amount = bill_amount;
        }
        if (invoice_id) {
            filterQuery.invoice_id = invoice_id;
        }
        if (type) {
            filterQuery.type = type;
        }
        if (search) {
            filterQuery.$or = [
                { type: { $regex: escapeRegex(search), $options: "i" } },
                { invoice_id: { $regex: escapeRegex(search), $options: "i" } },
            ];
        }
        const totalDocs = yield Ledger.countDocuments(filterQuery);
        if (!pagination) {
            const ledgerDoc = yield Ledger.find(filterQuery).sort({
                [sortBy]: sortOrder === "asc" ? 1 : -1,
                _id: 1,
            });
            return {
                data: ledgerDoc,
                meta: {
                    docsFound: totalDocs,
                    docsInResponse: ledgerDoc.length,
                    limit,
                    total_pages: 1,
                    currentPage: 1,
                },
            };
        }
        const ledgerDoc = yield Ledger.find(filterQuery)
            .sort({
            [sortBy]: sortOrder === "asc" ? 1 : -1,
            _id: 1,
        })
            .skip((page - 1) * limit)
            .limit(limit);
        const total_pages = Math.ceil(totalDocs / limit);
        const meta = {
            docsFound: totalDocs,
            docsInResponse: ledgerDoc.length,
            limit,
            total_pages,
            currentPage: page,
        };
        return { data: ledgerDoc, meta };
    }
    catch (error) {
        throw error;
    }
});
const getCustomerLedgerList = ({ query, requestUser, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { limit, page, pagination = true, sortBy = "createdAt", sortOrder = "asc", bill_id, bill_amount, invoice_id, type, search, } = query;
        if (typeof limit === "string") {
            limit = Number(limit);
        }
        if (!limit || isNaN(limit)) {
            limit = 50;
        }
        if (typeof page === "string") {
            page = Number(page);
        }
        if (!page || isNaN(page)) {
            page = 1;
        }
        if (typeof pagination === "string") {
            pagination = pagination === "true";
        }
        let filterQuery = {
            user_id: new mongoose.Types.ObjectId(requestUser._id),
        };
        if (bill_id) {
            filterQuery.bill_id = new mongoose.Types.ObjectId(bill_id);
        }
        if (bill_amount) {
            filterQuery.bill_amount = bill_amount;
        }
        if (invoice_id) {
            filterQuery.invoice_id = invoice_id;
        }
        if (type) {
            filterQuery.type = type;
        }
        if (search) {
            filterQuery.$or = [
                { type: { $regex: escapeRegex(search), $options: "i" } },
                { invoice_id: { $regex: escapeRegex(search), $options: "i" } },
            ];
        }
        const totalDocs = yield Ledger.countDocuments(filterQuery);
        if (!pagination) {
            const ledgerDoc = yield Ledger.find(filterQuery).sort({
                [sortBy]: sortOrder === "asc" ? 1 : -1,
                _id: 1,
            });
            return {
                data: ledgerDoc,
                meta: {
                    docsFound: totalDocs,
                    docsInResponse: ledgerDoc.length,
                    limit,
                    total_pages: 1,
                    currentPage: 1,
                },
            };
        }
        const ledgerDoc = yield Ledger.find(filterQuery)
            .sort({
            [sortBy]: sortOrder === "asc" ? 1 : -1,
            _id: 1,
        })
            .skip((page - 1) * limit)
            .limit(limit);
        const total_pages = Math.ceil(totalDocs / limit);
        const meta = {
            docsFound: totalDocs,
            docsInResponse: ledgerDoc.length,
            limit,
            total_pages,
            currentPage: page,
        };
        return { data: ledgerDoc, meta };
    }
    catch (error) {
        throw error;
    }
});
const getLedger = ({ ledgerId, query, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ledgerDoc = yield Ledger.findById(ledgerId);
        return ledgerDoc;
    }
    catch (error) {
        throw error;
    }
});
const addLedger = ({ requestUser, bill_id, description, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const billDoc = yield Bill.findById(bill_id);
        if (!billDoc) {
            throw new Error("Bill Not Found");
        }
        if (billDoc.payment_status !== "paid") {
            throw new Error("Bill is not Paid");
        }
        const orderDoc = yield Order.findById(billDoc.order_id);
        const sellerDoc = yield User.findOne({
            email: masterConfig.superAdminConfig.email,
            is_app_user: false,
        });
        const sellerLedger = new Ledger({
            bill_id: billDoc._id,
            user_id: sellerDoc === null || sellerDoc === void 0 ? void 0 : sellerDoc._id,
            bill_amount: billDoc.bill_amount,
            payment_amount: billDoc.bill_amount,
            type: orderDoc.order_type === "buy" ? "credit" : "debit",
            description: description ? description : "",
            invoice_id: billDoc.invoice_id,
        });
        const buyerLedger = new Ledger({
            bill_id: billDoc._id,
            user_id: orderDoc.user_id,
            bill_amount: billDoc.bill_amount,
            payment_amount: billDoc.bill_amount,
            type: orderDoc.order_type === "buy" ? "debit" : "credit",
            description: description ? description : "",
            invoice_id: billDoc.invoice_id,
        });
        const buyerLedgerDoc = yield buyerLedger.save();
        const sellerLedgerDoc = yield sellerLedger.save();
        return buyerLedgerDoc;
    }
    catch (error) {
        throw error;
    }
});
const updateLedger = ({ ledgerId, requestUser, description, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let ledgerDoc = yield Ledger.findById(ledgerId);
        if (description) {
            ledgerDoc.description = description;
            yield ledgerDoc.save();
        }
        return ledgerDoc;
    }
    catch (error) {
        throw error;
    }
});
const deleteLedger = ({ ledgerId, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        throw new Error("Ledger Can Not Be Deleted");
        yield Ledger.findByIdAndDelete(ledgerId);
    }
    catch (error) {
        throw error;
    }
});
export const ledgerService = {
    getLedger,
    addLedger,
    getLedgerList,
    updateLedger,
    deleteLedger,
    getCustomerLedgerList,
};
//# sourceMappingURL=ledgers.service.js.map