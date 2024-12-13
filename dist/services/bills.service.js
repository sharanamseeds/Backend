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
import Bill from "../models/bill.model.js";
import Order from "../models/orders.model.js";
import { convertFiles, createDocument } from "../helpers/files.management.js";
import { masterConfig } from "../config/master.config.js";
import { ledgerService } from "./ledgers.service.js";
import { escapeRegex } from "../helpers/common.helpers..js";
const createInvoiceNo = () => __awaiter(void 0, void 0, void 0, function* () {
    const prefix = masterConfig.billingConfig.invoicePrefix; // Ensure this is defined in your masterConfig
    const currentMonthYear = new Date().toISOString().slice(5, 7) + new Date().getFullYear();
    // Find the last invoice from the Bill collection
    const lastBill = yield Bill.findOne().sort({ createdAt: -1 });
    if (lastBill && lastBill.invoice_id) {
        const lastInvoiceNo = lastBill.invoice_id;
        const [lastPrefix, lastSeq, lastMonthYear] = lastInvoiceNo.split("-");
        if (lastMonthYear === currentMonthYear) {
            const newSeq = (parseInt(lastSeq, 10) + 1).toString().padStart(4, "0");
            return `${prefix}-${newSeq}-${currentMonthYear}`;
        }
    }
    return `${prefix}-0001-${currentMonthYear}`;
});
const getBillList = ({ query = {}, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { limit, page, pagination = true, sortBy = "createdAt", sortOrder = "asc", customer_id, order_id, payment_status, invoice_id, search, } = query;
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
        if (customer_id) {
            filterQuery.customer_id = new mongoose.Types.ObjectId(customer_id);
        }
        if (order_id) {
            filterQuery.order_id = new mongoose.Types.ObjectId(order_id);
        }
        if (payment_status) {
            filterQuery.payment_status = payment_status;
        }
        if (invoice_id) {
            filterQuery.invoice_id = invoice_id;
        }
        if (search) {
            filterQuery.$or = [
                { payment_status: { $regex: escapeRegex(search), $options: "i" } },
                { invoice_id: { $regex: escapeRegex(search), $options: "i" } },
            ];
        }
        const totalDocs = yield Bill.countDocuments(filterQuery);
        if (!pagination) {
            const billDoc = yield Bill.find(filterQuery).sort({
                [sortBy]: sortOrder === "asc" ? 1 : -1,
                _id: 1,
            });
            return {
                data: billDoc,
                meta: {
                    docsFound: totalDocs,
                    docsInResponse: billDoc.length,
                    limit,
                    total_pages: 1,
                    currentPage: 1,
                },
            };
        }
        const billDoc = yield Bill.find(filterQuery)
            .sort({
            [sortBy]: sortOrder === "asc" ? 1 : -1,
            _id: 1,
        })
            .skip((page - 1) * limit)
            .limit(limit);
        const total_pages = Math.ceil(totalDocs / limit);
        const meta = {
            docsFound: totalDocs,
            docsInResponse: billDoc.length,
            limit,
            total_pages,
            currentPage: page,
        };
        return { data: billDoc, meta };
    }
    catch (error) {
        throw error;
    }
});
const getCustomerBillList = ({ query = {}, requestUser, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { limit, page, pagination = true, sortBy = "createdAt", sortOrder = "asc", order_id, payment_status, invoice_id, search, } = query;
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
            customer_id: new mongoose.Types.ObjectId(requestUser._id),
        };
        if (order_id) {
            filterQuery.order_id = new mongoose.Types.ObjectId(order_id);
        }
        if (payment_status) {
            filterQuery.payment_status = payment_status;
        }
        if (invoice_id) {
            filterQuery.invoice_id = invoice_id;
        }
        if (search) {
            filterQuery.$or = [
                { payment_status: { $regex: escapeRegex(search), $options: "i" } },
                { invoice_id: { $regex: escapeRegex(search), $options: "i" } },
            ];
        }
        const totalDocs = yield Bill.countDocuments(filterQuery);
        if (!pagination) {
            const billDoc = yield Bill.find(filterQuery).sort({
                [sortBy]: sortOrder === "asc" ? 1 : -1,
                _id: 1,
            });
            return {
                data: billDoc,
                meta: {
                    docsFound: totalDocs,
                    docsInResponse: billDoc.length,
                    limit,
                    total_pages: 1,
                    currentPage: 1,
                },
            };
        }
        const billDoc = yield Bill.find(filterQuery)
            .sort({
            [sortBy]: sortOrder === "asc" ? 1 : -1,
            _id: 1,
        })
            .skip((page - 1) * limit)
            .limit(limit);
        const total_pages = Math.ceil(totalDocs / limit);
        const meta = {
            docsFound: totalDocs,
            docsInResponse: billDoc.length,
            limit,
            total_pages,
            currentPage: page,
        };
        return { data: billDoc, meta };
    }
    catch (error) {
        throw error;
    }
});
const getBill = ({ billId, query, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const billDoc = yield Bill.findById(billId);
        return billDoc;
    }
    catch (error) {
        throw error;
    }
});
const addBill = ({ requestUser, order_id, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const orderDoc = yield Order.findById(order_id);
        if (!orderDoc) {
            throw new Error("Invalid Order Id");
        }
        if (orderDoc.is_creditable === false &&
            orderDoc.status !== "delivered" &&
            orderDoc.status !== "return_fulfilled") {
            throw new Error("Order is not fulfilled");
        }
        const generatedInvoiveNo = yield createInvoiceNo();
        const bill = new Bill({
            order_id: orderDoc._id,
            customer_id: orderDoc.user_id,
            order_amount: orderDoc.order_amount,
            bill_amount: orderDoc.billing_amount,
            tax_amount: orderDoc.tax_amount,
            discount_amount: orderDoc.discount_amount,
            invoice_id: generatedInvoiveNo,
            added_by: requestUser._id,
            updated_by: requestUser._id,
        });
        let billDoc = yield bill.save();
        // create ledgers
        yield ledgerService.addLedger({
            requestUser: requestUser,
            bill_id: (_a = billDoc === null || billDoc === void 0 ? void 0 : billDoc._id) === null || _a === void 0 ? void 0 : _a.toString(),
            description: "",
        });
        billDoc = yield billDoc.save();
        return billDoc;
    }
    catch (error) {
        throw error;
    }
});
const updateBill = ({ billId, requestUser, files, status, payment_method, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let billDoc = yield Bill.findById(billId);
        if (!billDoc) {
            throw new Error("Bill Not Found");
        }
        if (status === "paid") {
            const reqfiles = convertFiles(files);
            const { payment_details } = reqfiles;
            if (!payment_details) {
                throw new Error("payment details not found");
            }
            if (Array.isArray(payment_details) && payment_details.length > 0) {
                const savedFile = yield createDocument({
                    document: payment_details[0],
                    documentType: masterConfig.fileStystem.fileTypes.IMAGE,
                    documentPath: masterConfig.fileStystem.folderPaths.BILLS +
                        billDoc._id +
                        "/" +
                        masterConfig.fileStystem.folderPaths.LOGO,
                });
                if (savedFile) {
                    billDoc.payment_details = savedFile.path;
                }
            }
            billDoc.payment_method = payment_method;
            billDoc.payment_status = status;
            yield billDoc.save();
            // await ledgerService.addLedger({
            //   requestUser: requestUser,
            //   bill_id: billDoc?._id?.toString(),
            //   description: "",
            // });
        }
        return billDoc;
    }
    catch (error) {
        throw error;
    }
});
const deleteBill = ({ billId }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        throw new Error("Bill Can Not Be Deleted");
        yield Bill.findByIdAndDelete(billId);
    }
    catch (error) {
        throw error;
    }
});
export const billService = {
    getBill,
    addBill,
    getBillList,
    updateBill,
    deleteBill,
    getCustomerBillList,
};
//# sourceMappingURL=bills.service.js.map