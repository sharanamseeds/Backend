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
import { createPassword, generatePassword } from "../helpers/auth.helpers.js";
import { convertFiles, createDocument, deleteDocument, } from "../helpers/files.management.js";
import { escapeRegex, sendUserAccountCreatedMail, sendUserAccountVerifiedMail, } from "../helpers/common.helpers..js";
import { masterConfig } from "../config/master.config.js";
import Money from "../models/money.model.js";
import Ledger from "../models/ledger.model.js";
import ExcelJS from "exceljs";
import { generateLedgerPdfCodeHtml } from "../helpers/mail.helpers.js";
const AppcalculateUserFinancials = ({ userId, query }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userDoc = yield User.findById(userId);
    const { date, category, from, to } = query;
    if (!userDoc) {
        throw new Error("Invalid user ID");
    }
    let ledgerQuery = { user_id: new mongoose.Types.ObjectId(userId) };
    let moneyQuery = { user_id: new mongoose.Types.ObjectId(userId) };
    if (category) {
        switch (category) {
            case "credit_note":
                ledgerQuery = Object.assign(Object.assign({}, ledgerQuery), { type: "credit" });
                break;
            case "debit_note":
                ledgerQuery = Object.assign(Object.assign({}, ledgerQuery), { type: "debit" });
                break;
            default:
                break;
        }
    }
    if (date) {
        let start_date;
        let end_date;
        const currentDate = new Date();
        switch (date) {
            case "all":
                break;
            case "current_year":
                start_date = new Date(currentDate.getFullYear(), 0, 1);
                end_date = currentDate;
                break;
            case "past_year":
                start_date = new Date(currentDate.getFullYear() - 1, 0, 1);
                end_date = new Date(currentDate.getFullYear() - 1, 11, 31);
                break;
            case "last_three_month":
                start_date = new Date(currentDate.setMonth(currentDate.getMonth() - 3));
                end_date = new Date();
                break;
            case "last_one_month":
                start_date = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
                end_date = new Date();
                break;
            case "last_one_year":
                start_date = new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
                end_date = new Date();
                break;
            case "custom":
                if (from)
                    start_date = new Date(from);
                if (to)
                    end_date = new Date(to);
                break;
            default:
                break;
        }
        if (start_date || end_date) {
            const dateRange = Object.assign(Object.assign({}, (start_date ? { $gte: new Date(start_date) } : {})), (end_date ? { $lte: new Date(end_date) } : {}));
            moneyQuery = Object.assign(Object.assign({}, moneyQuery), { createdAt: dateRange });
            ledgerQuery = Object.assign(Object.assign({}, ledgerQuery), { createdAt: dateRange });
        }
    }
    try {
        let totalMoneyAdded = [];
        if (!category || category !== "debit_note") {
            totalMoneyAdded = yield Money.aggregate([
                { $match: moneyQuery },
                { $group: { _id: null, total: { $sum: "$amount" } } },
            ]);
        }
        let ledgerData = [];
        if (!category || category !== "payment") {
            ledgerData = yield Ledger.aggregate([
                { $match: ledgerQuery },
                { $group: { _id: "$type", totalAmount: { $sum: "$payment_amount" } } },
            ]);
        }
        let totalCredit = 0;
        let totalDebit = 0;
        ledgerData.forEach((item) => {
            if (item._id === "credit") {
                totalCredit = item.totalAmount;
            }
            else if (item._id === "debit") {
                totalDebit = item.totalAmount;
            }
        });
        const availableCreditLimit = (((_a = totalMoneyAdded[0]) === null || _a === void 0 ? void 0 : _a.total) || 0) + totalCredit - totalDebit;
        let credits = [];
        if (!category || category !== "debit_note") {
            credits = yield Money.find(moneyQuery);
        }
        let ledgers = [];
        if (!category || category !== "payment") {
            ledgers = yield Ledger.aggregate([
                { $match: ledgerQuery },
                {
                    $lookup: {
                        from: "bills",
                        localField: "bill_id",
                        foreignField: "_id",
                        as: "bill",
                    },
                },
                { $unwind: { path: "$bill", preserveNullAndEmptyArrays: true } },
            ]);
        }
        const data = {};
        const addToGroupedData = (array, type) => {
            array.forEach((item) => {
                const monthYear = new Date(item.createdAt).toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                });
                if (!data[monthYear]) {
                    data[monthYear] = { month: monthYear, ledgers: [], credits: [] };
                }
                if (type === "ledger") {
                    data[monthYear].ledgers.push(item);
                }
                else if (type === "credit") {
                    data[monthYear].credits.push(item);
                }
            });
        };
        addToGroupedData(ledgers, "ledger");
        addToGroupedData(credits, "credit");
        const groupedData = Object.values(data);
        return {
            totalMoneyAdded: ((_b = totalMoneyAdded[0]) === null || _b === void 0 ? void 0 : _b.total) || 0,
            totalCredit,
            totalDebit,
            availableCreditLimit,
            groupedData,
        };
    }
    catch (error) {
        throw new Error(`Error calculating financials: ${error.message}`);
    }
});
const AppcalculateUserFinancialsDownloadExcel = ({ userId, query, res, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const userDoc = yield User.findById(userId);
    const { date, category, from, to } = query;
    if (!userDoc) {
        throw new Error("Invalid user ID");
    }
    let ledgerQuery = { user_id: new mongoose.Types.ObjectId(userId) };
    let moneyQuery = { user_id: new mongoose.Types.ObjectId(userId) };
    if (category) {
        switch (category) {
            case "credit_note":
                ledgerQuery = Object.assign(Object.assign({}, ledgerQuery), { type: "credit" });
                break;
            case "debit_note":
                ledgerQuery = Object.assign(Object.assign({}, ledgerQuery), { type: "debit" });
                break;
            default:
                break;
        }
    }
    if (date) {
        let start_date;
        let end_date;
        const currentDate = new Date();
        switch (date) {
            case "all":
                break;
            case "current_year":
                start_date = new Date(currentDate.getFullYear(), 0, 1);
                end_date = currentDate;
                break;
            case "past_year":
                start_date = new Date(currentDate.getFullYear() - 1, 0, 1);
                end_date = new Date(currentDate.getFullYear() - 1, 11, 31);
                break;
            case "last_three_month":
                start_date = new Date(currentDate.setMonth(currentDate.getMonth() - 3));
                end_date = new Date();
                break;
            case "last_one_month":
                start_date = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
                end_date = new Date();
                break;
            case "last_one_year":
                start_date = new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
                end_date = new Date();
                break;
            case "custom":
                if (from)
                    start_date = new Date(from);
                if (to)
                    end_date = new Date(to);
                break;
            default:
                break;
        }
        if (start_date || end_date) {
            const dateRange = Object.assign(Object.assign({}, (start_date ? { $gte: new Date(start_date) } : {})), (end_date ? { $lte: new Date(end_date) } : {}));
            moneyQuery = Object.assign(Object.assign({}, moneyQuery), { createdAt: dateRange });
            ledgerQuery = Object.assign(Object.assign({}, ledgerQuery), { createdAt: dateRange });
        }
    }
    try {
        let totalMoneyAdded = [];
        if (!category || category !== "debit_note") {
            totalMoneyAdded = yield Money.aggregate([
                { $match: moneyQuery },
                { $group: { _id: null, total: { $sum: "$amount" } } },
            ]);
        }
        let ledgerData = [];
        if (!category || category !== "payment") {
            ledgerData = yield Ledger.aggregate([
                { $match: ledgerQuery },
                { $group: { _id: "$type", totalAmount: { $sum: "$payment_amount" } } },
            ]);
        }
        let totalCredit = 0;
        let totalDebit = 0;
        ledgerData.forEach((item) => {
            if (item._id === "credit") {
                totalCredit = item.totalAmount;
            }
            else if (item._id === "debit") {
                totalDebit = item.totalAmount;
            }
        });
        const availableCreditLimit = (((_c = totalMoneyAdded[0]) === null || _c === void 0 ? void 0 : _c.total) || 0) + totalCredit - totalDebit;
        let credits = [];
        if (!category || category !== "debit_note") {
            credits = yield Money.find(moneyQuery);
        }
        let ledgers = [];
        if (!category || category !== "payment") {
            ledgers = yield Ledger.aggregate([
                { $match: ledgerQuery },
                {
                    $lookup: {
                        from: "bills",
                        localField: "bill_id",
                        foreignField: "_id",
                        as: "bill",
                    },
                },
                { $unwind: { path: "$bill", preserveNullAndEmptyArrays: true } },
            ]);
        }
        const data = {};
        const addToGroupedData = (array, type) => {
            array.forEach((item) => {
                const monthYear = new Date(item.createdAt).toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                });
                if (!data[monthYear]) {
                    data[monthYear] = { month: monthYear, ledgers: [], credits: [] };
                }
                if (type === "ledger") {
                    data[monthYear].ledgers.push(item);
                }
                else if (type === "credit") {
                    data[monthYear].credits.push(item);
                }
            });
        };
        addToGroupedData(ledgers, "ledger");
        addToGroupedData(credits, "credit");
        const groupedData = Object.values(data);
        // Create a new Excel workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("statement");
        // Add headers to the worksheet based on the typeUser fields
        worksheet.columns = [
            { header: "Date", key: "date", width: 30 },
            { header: "Amount", key: "amount", width: 30 },
            { header: "type", key: "type", width: 30 },
            { header: "Invoice No", key: "invoice_no", width: 20 },
        ];
        if (groupedData.length > 0) {
            groupedData.forEach((group) => {
                if ((group === null || group === void 0 ? void 0 : group.ledgers.length) > 0) {
                    group === null || group === void 0 ? void 0 : group.ledgers.forEach((ledger) => {
                        const createdAt = (ledger === null || ledger === void 0 ? void 0 : ledger.createdAt)
                            ? new Date(ledger.createdAt)
                            : new Date();
                        const formattedDate = `${String(createdAt.getDate()).padStart(2, "0")}/${String(createdAt.getMonth() + 1).padStart(2, "0")}/${createdAt.getFullYear()}`;
                        worksheet.addRow({
                            date: formattedDate,
                            amount: ledger.payment_amount,
                            type: ledger.type,
                            invoice_no: ledger.invoice_id,
                        });
                    });
                }
                if ((group === null || group === void 0 ? void 0 : group.credits.length) > 0) {
                    group === null || group === void 0 ? void 0 : group.credits.forEach((credit) => {
                        const createdAt = (credit === null || credit === void 0 ? void 0 : credit.createdAt)
                            ? new Date(credit.createdAt)
                            : new Date();
                        const formattedDate = `${String(createdAt.getDate()).padStart(2, "0")}/${String(createdAt.getMonth() + 1).padStart(2, "0")}/${createdAt.getFullYear()}`;
                        worksheet.addRow({
                            date: formattedDate,
                            amount: credit.amount,
                            type: "Payment",
                            invoice_no: "-",
                        });
                    });
                }
            });
        }
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=statement.xlsx");
        // Write the Excel file to the response
        yield workbook.xlsx.write(res);
        // End the response
        res.end();
    }
    catch (error) {
        throw new Error(`Error calculating financials: ${error.message}`);
    }
});
const AppcalculateUserFinancialsDownloadPDF = ({ userId, query, res, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    const userDoc = yield User.findById(userId);
    const { date, category, from, to } = query;
    if (!userDoc) {
        throw new Error("Invalid user ID");
    }
    let ledgerQuery = { user_id: new mongoose.Types.ObjectId(userId) };
    let moneyQuery = { user_id: new mongoose.Types.ObjectId(userId) };
    if (category) {
        switch (category) {
            case "credit_note":
                ledgerQuery = Object.assign(Object.assign({}, ledgerQuery), { type: "credit" });
                break;
            case "debit_note":
                ledgerQuery = Object.assign(Object.assign({}, ledgerQuery), { type: "debit" });
                break;
            default:
                break;
        }
    }
    if (date) {
        let start_date;
        let end_date;
        const currentDate = new Date();
        switch (date) {
            case "all":
                break;
            case "current_year":
                start_date = new Date(currentDate.getFullYear(), 0, 1);
                end_date = currentDate;
                break;
            case "past_year":
                start_date = new Date(currentDate.getFullYear() - 1, 0, 1);
                end_date = new Date(currentDate.getFullYear() - 1, 11, 31);
                break;
            case "last_three_month":
                start_date = new Date(currentDate.setMonth(currentDate.getMonth() - 3));
                end_date = new Date();
                break;
            case "last_one_month":
                start_date = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
                end_date = new Date();
                break;
            case "last_one_year":
                start_date = new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
                end_date = new Date();
                break;
            case "custom":
                if (from)
                    start_date = new Date(from);
                if (to)
                    end_date = new Date(to);
                break;
            default:
                break;
        }
        if (start_date || end_date) {
            const dateRange = Object.assign(Object.assign({}, (start_date ? { $gte: new Date(start_date) } : {})), (end_date ? { $lte: new Date(end_date) } : {}));
            moneyQuery = Object.assign(Object.assign({}, moneyQuery), { createdAt: dateRange });
            ledgerQuery = Object.assign(Object.assign({}, ledgerQuery), { createdAt: dateRange });
        }
    }
    try {
        let totalMoneyAdded = [];
        if (!category || category !== "debit_note") {
            totalMoneyAdded = yield Money.aggregate([
                { $match: moneyQuery },
                { $group: { _id: null, total: { $sum: "$amount" } } },
            ]);
        }
        let ledgerData = [];
        if (!category || category !== "payment") {
            ledgerData = yield Ledger.aggregate([
                { $match: ledgerQuery },
                { $group: { _id: "$type", totalAmount: { $sum: "$payment_amount" } } },
            ]);
        }
        let totalCredit = 0;
        let totalDebit = 0;
        ledgerData.forEach((item) => {
            if (item._id === "credit") {
                totalCredit = item.totalAmount;
            }
            else if (item._id === "debit") {
                totalDebit = item.totalAmount;
            }
        });
        const availableCreditLimit = (((_d = totalMoneyAdded[0]) === null || _d === void 0 ? void 0 : _d.total) || 0) + totalCredit - totalDebit;
        let credits = [];
        if (!category || category !== "debit_note") {
            credits = yield Money.find(moneyQuery);
        }
        let ledgers = [];
        if (!category || category !== "payment") {
            ledgers = yield Ledger.aggregate([
                { $match: ledgerQuery },
                {
                    $lookup: {
                        from: "bills",
                        localField: "bill_id",
                        foreignField: "_id",
                        as: "bill",
                    },
                },
                { $unwind: { path: "$bill", preserveNullAndEmptyArrays: true } },
            ]);
        }
        const data = {};
        const addToGroupedData = (array, type) => {
            array.forEach((item) => {
                const monthYear = new Date(item.createdAt).toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                });
                if (!data[monthYear]) {
                    data[monthYear] = { month: monthYear, ledgers: [], credits: [] };
                }
                if (type === "ledger") {
                    data[monthYear].ledgers.push(item);
                }
                else if (type === "credit") {
                    data[monthYear].credits.push(item);
                }
            });
        };
        addToGroupedData(ledgers, "ledger");
        addToGroupedData(credits, "credit");
        const groupedData = Object.values(data);
        // if (groupedData.length > 0) {
        //   groupedData.forEach((group: any) => {
        //     if (group?.ledgers.length > 0) {
        //       group?.ledgers.forEach((ledger: any) => {
        //         const createdAt = ledger?.createdAt
        //           ? new Date(ledger.createdAt)
        //           : new Date();
        //         const formattedDate = `${String(createdAt.getDate()).padStart(
        //           2,
        //           "0"
        //         )}/${String(createdAt.getMonth() + 1).padStart(
        //           2,
        //           "0"
        //         )}/${createdAt.getFullYear()}`;
        //         worksheet.addRow({
        //           date: formattedDate,
        //           amount: ledger.payment_amount,
        //           type: ledger.type,
        //           invoice_no: ledger.invoice_id,
        //         });
        //       });
        //     }
        //     if (group?.credits.length > 0) {
        //       group?.credits.forEach((credit: any) => {
        //         const createdAt = credit?.createdAt
        //           ? new Date(credit.createdAt)
        //           : new Date();
        //         const formattedDate = `${String(createdAt.getDate()).padStart(
        //           2,
        //           "0"
        //         )}/${String(createdAt.getMonth() + 1).padStart(
        //           2,
        //           "0"
        //         )}/${createdAt.getFullYear()}`;
        //         worksheet.addRow({
        //           date: formattedDate,
        //           amount: credit.amount,
        //           type: "Payment",
        //           invoice_no: "-",
        //         });
        //       });
        //     }
        //   });
        // }
        const ledgerStaticData = {
            totalMoneyAdded: ((_e = totalMoneyAdded[0]) === null || _e === void 0 ? void 0 : _e.total) || 0,
            totalCredit,
            totalDebit,
            availableCreditLimit,
            groupedData,
        };
        const htmlForAttachment = generateLedgerPdfCodeHtml(userDoc, ledgerStaticData, false);
        res.setHeader("Content-Type", "application/html");
        res.setHeader("Content-Disposition", "attachment; filename=bill.html");
        res.send(htmlForAttachment);
        // return {
        //   totalMoneyAdded: totalMoneyAdded[0]?.total || 0,
        //   totalCredit,
        //   totalDebit,
        //   availableCreditLimit,
        //   groupedData,
        // };
    }
    catch (error) {
        throw new Error(`Error calculating financials: ${error.message}`);
    }
});
const calculateUserFinancials = ({ userId }) => __awaiter(void 0, void 0, void 0, function* () {
    var _f, _g;
    const userDoc = yield User.findById(userId);
    if (!userDoc) {
        throw new Error("Invalid user ID");
    }
    try {
        const totalMoneyAdded = yield Money.aggregate([
            { $match: { user_id: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);
        const ledgerData = yield Ledger.aggregate([
            { $match: { user_id: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: "$type",
                    totalAmount: { $sum: "$payment_amount" },
                },
            },
        ]);
        let totalCredit = 0;
        let totalDebit = 0;
        ledgerData.forEach((item) => {
            if (item._id === "credit") {
                totalCredit = item.totalAmount;
            }
            else if (item._id === "debit") {
                totalDebit = item.totalAmount;
            }
        });
        const finalBalance = (((_f = totalMoneyAdded[0]) === null || _f === void 0 ? void 0 : _f.total) || 0) + totalCredit - totalDebit;
        const credits = yield Money.find({
            user_id: new mongoose.Types.ObjectId(userId),
        });
        const ledgers = yield Ledger.aggregate([
            {
                $match: {
                    user_id: new mongoose.Types.ObjectId(userId),
                },
            },
            {
                $lookup: {
                    from: "bills",
                    localField: "bill_id",
                    foreignField: "_id",
                    as: "bill",
                },
            },
            {
                $unwind: {
                    path: "$bill",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ]);
        return {
            totalMoneyAdded: ((_g = totalMoneyAdded[0]) === null || _g === void 0 ? void 0 : _g.total) || 0,
            totalCredit,
            totalDebit,
            finalBalance,
            ledgers,
            credits,
        };
    }
    catch (error) {
        throw new Error(`Error calculating financials: ${error.message}`);
    }
});
const getUserList = ({ query, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { limit, page, pagination = true, sortBy = "createdAt", sortOrder = "asc", is_app_user, role_id, is_verified, is_blocked, name, is_email_verified, contact_number, gst_number, email, search, } = query;
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
        if (role_id) {
            filterQuery.role_id = new mongoose.Types.ObjectId(role_id);
        }
        if (is_verified !== undefined) {
            filterQuery.is_verified = is_verified;
        }
        if (is_app_user !== undefined) {
            filterQuery.is_app_user = is_app_user;
        }
        if (is_blocked !== undefined) {
            filterQuery.is_blocked = is_blocked;
        }
        if (name) {
            filterQuery.name = name;
        }
        if (email) {
            filterQuery.email = email;
        }
        if (is_email_verified !== undefined) {
            filterQuery.is_email_verified = is_email_verified;
        }
        if (contact_number) {
            filterQuery.contact_number = contact_number;
        }
        if (gst_number) {
            filterQuery.gst_number = gst_number;
        }
        // Apply search logic
        if (search) {
            filterQuery.$or = [
                { name: { $regex: escapeRegex(search), $options: "i" } },
                { email: { $regex: escapeRegex(search), $options: "i" } },
                { contact_number: { $regex: escapeRegex(search), $options: "i" } },
            ];
        }
        const totalDocs = yield User.countDocuments(filterQuery);
        if (!pagination) {
            const userDoc = yield User.find(filterQuery).sort({
                [sortBy]: sortOrder === "asc" ? 1 : -1,
                _id: 1,
            }); // Sorting logic
            return {
                data: userDoc,
                meta: {
                    docsFound: totalDocs,
                    docsInResponse: userDoc.length,
                    limit,
                    total_pages: 1,
                    currentPage: 1,
                },
            };
        }
        const userDoc = yield User.find(filterQuery)
            .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1, _id: 1 }) // Sorting logic
            .skip((page - 1) * limit)
            .limit(limit);
        const total_pages = Math.ceil(totalDocs / limit);
        const meta = {
            docsFound: totalDocs,
            docsInResponse: userDoc.length,
            limit,
            total_pages,
            currentPage: page,
        };
        return { data: userDoc, meta };
    }
    catch (error) {
        throw error;
    }
});
const getUser = ({ userId, query, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userDoc = yield User.findById(userId);
        return userDoc;
    }
    catch (error) {
        throw error;
    }
});
const addUser = ({ requestUser, req, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _h;
    try {
        let bodyData = {};
        if (((_h = req === null || req === void 0 ? void 0 : req.query) === null || _h === void 0 ? void 0 : _h.payload) && typeof req.query.payload === "string") {
            bodyData = JSON.parse(req.query.payload);
        }
        const { password } = bodyData;
        let saltData;
        let hashData;
        if (password) {
            const { hash, salt } = generatePassword(password);
            saltData = salt;
            hashData = hash;
            delete bodyData.password;
        }
        else {
            const generatedPassword = createPassword();
            const { hash, salt } = generatePassword(generatedPassword);
            saltData = salt;
            hashData = hash;
        }
        const userId = new mongoose.Types.ObjectId();
        let userData = {
            _id: new mongoose.Types.ObjectId(userId),
            added_by: new mongoose.Types.ObjectId(requestUser._id),
            updated_by: new mongoose.Types.ObjectId(requestUser._id),
            hash: hashData,
            salt: saltData,
        };
        const files = convertFiles(req.files);
        const { profile, aadhar_card, gst_certificate, other_document, bank_details, } = files;
        if (profile && profile.length > 0) {
            const savedLogoFile = yield createDocument({
                document: profile[0],
                documentType: masterConfig.fileStystem.fileTypes.IMAGE,
                documentPath: masterConfig.fileStystem.folderPaths.USER +
                    userData._id +
                    "/" +
                    masterConfig.fileStystem.folderPaths.IMAGES,
            });
            if (savedLogoFile) {
                userData.profile = savedLogoFile.path;
            }
        }
        if (aadhar_card && aadhar_card.length > 0) {
            const savedAadharCardFile = yield createDocument({
                document: aadhar_card[0],
                documentType: masterConfig.fileStystem.fileTypes.IMAGE,
                documentPath: masterConfig.fileStystem.folderPaths.USER +
                    userData._id +
                    "/" +
                    masterConfig.fileStystem.folderPaths.DOCUMENTS,
            });
            if (savedAadharCardFile) {
                userData.aadhar_card = savedAadharCardFile.path;
            }
        }
        if (gst_certificate && gst_certificate.length > 0) {
            const savedGstCertificateFile = yield createDocument({
                document: gst_certificate[0],
                documentType: masterConfig.fileStystem.fileTypes.IMAGE,
                documentPath: masterConfig.fileStystem.folderPaths.USER +
                    userData._id +
                    "/" +
                    masterConfig.fileStystem.folderPaths.DOCUMENTS,
            });
            if (savedGstCertificateFile) {
                userData.gst_certificate = savedGstCertificateFile.path;
            }
        }
        if (other_document && other_document.length > 0) {
            for (const otherFile of other_document) {
                const savedOtherFile = yield createDocument({
                    document: otherFile,
                    documentType: masterConfig.fileStystem.fileTypes.IMAGE,
                    documentPath: masterConfig.fileStystem.folderPaths.USER +
                        userData._id +
                        "/" +
                        masterConfig.fileStystem.folderPaths.DOCUMENTS,
                });
                if (savedOtherFile) {
                    userData.other_document = savedOtherFile.path;
                }
            }
        }
        if (bank_details && bank_details.length > 0) {
            const savedBankDetailsFile = yield createDocument({
                document: bank_details[0],
                documentType: masterConfig.fileStystem.fileTypes.IMAGE,
                documentPath: masterConfig.fileStystem.folderPaths.USER +
                    userData._id +
                    "/" +
                    masterConfig.fileStystem.folderPaths.DOCUMENTS,
            });
            if (savedBankDetailsFile) {
                userData.bank_details = savedBankDetailsFile.path;
            }
        }
        Object.assign(userData, Object.assign({}, bodyData));
        const user = new User(Object.assign({}, userData));
        const userDoc = yield user.save();
        if (userDoc.is_verified) {
            sendUserAccountVerifiedMail(userDoc.email, userDoc.contact_number);
        }
        else {
            sendUserAccountCreatedMail(userDoc.email, userDoc.contact_number);
        }
        return userDoc;
    }
    catch (error) {
        throw error;
    }
});
const updateUser = ({ userId, requestUser, req, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _j;
    try {
        const userOriginal = yield User.findById(userId);
        let userDoc = yield User.findByIdAndUpdate(userId);
        if (!userOriginal) {
            throw new Error("User Not Found");
        }
        let body = {};
        if (((_j = req === null || req === void 0 ? void 0 : req.query) === null || _j === void 0 ? void 0 : _j.payload) && typeof req.query.payload === "string") {
            body = JSON.parse(req.query.payload);
        }
        if ("role_id" in body ||
            "gst_number" in body ||
            "is_verified" in body ||
            "is_blocked" in body) {
            if (requestUser._id === userDoc._id) {
                throw new Error("Only Admin Can Verified Your Account Status");
            }
            if (body.is_verified &&
                body.is_verified === true &&
                !userDoc.role_id &&
                !body.role_id &&
                !userDoc.is_app_user) {
                throw new Error("Please Assign Role For User");
            }
        }
        const { password } = req.body;
        let saltData;
        let hashData;
        if (password) {
            const { hash, salt } = generatePassword(password);
            saltData = salt;
            hashData = hash;
        }
        else {
            saltData = userDoc.salt;
            hashData = userDoc.hash;
        }
        const userData = Object.assign({ updated_by: requestUser._id, hash: hashData, salt: saltData }, body);
        delete userData.password;
        Object.assign(userDoc, Object.assign({}, userData));
        const files = convertFiles(req.files);
        const { profile, aadhar_card, gst_certificate, other_document, bank_details, } = files;
        if (profile && profile.length > 0) {
            const savedLogoFile = yield createDocument({
                document: profile[0],
                documentType: masterConfig.fileStystem.fileTypes.IMAGE,
                documentPath: masterConfig.fileStystem.folderPaths.USER +
                    userDoc._id +
                    "/" +
                    masterConfig.fileStystem.folderPaths.IMAGES,
                oldPath: userDoc.profile,
            });
            if (savedLogoFile) {
                userDoc.profile = savedLogoFile.path;
            }
        }
        if (aadhar_card && aadhar_card.length > 0) {
            const savedAadharCardFile = yield createDocument({
                document: aadhar_card[0],
                documentType: masterConfig.fileStystem.fileTypes.IMAGE,
                documentPath: masterConfig.fileStystem.folderPaths.USER +
                    userDoc._id +
                    "/" +
                    masterConfig.fileStystem.folderPaths.DOCUMENTS,
                oldPath: userDoc.aadhar_card,
            });
            if (savedAadharCardFile) {
                userDoc.aadhar_card = savedAadharCardFile.path;
            }
        }
        if (gst_certificate && gst_certificate.length > 0) {
            const savedGstCertificateFile = yield createDocument({
                document: gst_certificate[0],
                documentType: masterConfig.fileStystem.fileTypes.IMAGE,
                documentPath: masterConfig.fileStystem.folderPaths.USER +
                    userDoc._id +
                    "/" +
                    masterConfig.fileStystem.folderPaths.DOCUMENTS,
                oldPath: userDoc.gst_certificate,
            });
            if (savedGstCertificateFile) {
                userDoc.gst_certificate = savedGstCertificateFile.path;
            }
        }
        if (other_document && other_document.length > 0) {
            for (const otherFile of other_document) {
                const savedOtherFile = yield createDocument({
                    document: otherFile,
                    documentType: masterConfig.fileStystem.fileTypes.IMAGE,
                    documentPath: masterConfig.fileStystem.folderPaths.USER +
                        userDoc._id +
                        "/" +
                        masterConfig.fileStystem.folderPaths.DOCUMENTS,
                    oldPath: userDoc.other_document,
                });
                if (savedOtherFile) {
                    userDoc.other_document = savedOtherFile.path;
                }
            }
        }
        if (bank_details && bank_details.length > 0) {
            const savedBankDetailsFile = yield createDocument({
                document: bank_details[0],
                documentType: masterConfig.fileStystem.fileTypes.IMAGE,
                documentPath: masterConfig.fileStystem.folderPaths.USER +
                    userDoc._id +
                    "/" +
                    masterConfig.fileStystem.folderPaths.DOCUMENTS,
                oldPath: userDoc.bank_details,
            });
            if (savedBankDetailsFile) {
                userDoc.bank_details = savedBankDetailsFile.path;
            }
        }
        const updatedUser = yield userDoc.save();
        if (userDoc.is_verified !== userOriginal.is_verified) {
            if (userDoc.is_verified) {
                sendUserAccountVerifiedMail(userDoc.email, userDoc.contact_number);
            }
        }
        return updatedUser;
    }
    catch (error) {
        throw error;
    }
});
const deleteUser = ({ userId }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield User.findByIdAndDelete(userId);
        const documentPath = masterConfig.fileStystem.folderPaths.BASE_FOLDER +
            masterConfig.fileStystem.folderPaths.USER +
            userId;
        yield deleteDocument({
            documentPath: documentPath,
        });
    }
    catch (error) {
        throw error;
    }
});
export const userService = {
    getUser,
    addUser,
    getUserList,
    updateUser,
    deleteUser,
    calculateUserFinancials,
    AppcalculateUserFinancials,
    AppcalculateUserFinancialsDownloadExcel,
    AppcalculateUserFinancialsDownloadPDF,
};
//# sourceMappingURL=users.service.js.map