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
import Money from "../models/money.model.js";
import { escapeRegex } from "../helpers/common.helpers..js";
const getMoneyList = ({ query = {}, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { limit, page, pagination = true, sortBy = "createdAt", sortOrder = "asc", user_id, search, } = query;
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
        if (search) {
            filterQuery.$or = [
                { description: { $regex: escapeRegex(search), $options: "i" } },
                { amount: { $regex: escapeRegex(search), $options: "i" } },
            ];
        }
        const totalDocs = yield Money.countDocuments(filterQuery);
        if (!pagination) {
            const moneyDoc = yield Money.find(filterQuery).sort({
                [sortBy]: sortOrder === "asc" ? 1 : -1,
                _id: 1,
            });
            return {
                data: moneyDoc,
                meta: {
                    docsFound: totalDocs,
                    docsInResponse: moneyDoc.length,
                    limit,
                    total_pages: 1,
                    currentPage: 1,
                },
            };
        }
        const moneyDoc = yield Money.find(filterQuery)
            .sort({
            [sortBy]: sortOrder === "asc" ? 1 : -1,
            _id: 1,
        })
            .skip((page - 1) * limit)
            .limit(limit);
        const total_pages = Math.ceil(totalDocs / limit);
        const meta = {
            docsFound: totalDocs,
            docsInResponse: moneyDoc.length,
            limit,
            total_pages,
            currentPage: page,
        };
        return { data: moneyDoc, meta };
    }
    catch (error) {
        throw error;
    }
});
const getCustomerMoneyList = ({ query = {}, requestUser, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { limit, page, pagination = true, sortBy = "createdAt", sortOrder = "asc", search, } = query;
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
        if (search) {
            filterQuery.$or = [
                { description: { $regex: escapeRegex(search), $options: "i" } },
                { amount: { $regex: escapeRegex(search), $options: "i" } },
            ];
        }
        const totalDocs = yield Money.countDocuments(filterQuery);
        if (!pagination) {
            const moneyDoc = yield Money.find(filterQuery).sort({
                [sortBy]: sortOrder === "asc" ? 1 : -1,
                _id: 1,
            });
            return {
                data: moneyDoc,
                meta: {
                    docsFound: totalDocs,
                    docsInResponse: moneyDoc.length,
                    limit,
                    total_pages: 1,
                    currentPage: 1,
                },
            };
        }
        const moneyDoc = yield Money.find(filterQuery)
            .sort({
            [sortBy]: sortOrder === "asc" ? 1 : -1,
            _id: 1,
        })
            .skip((page - 1) * limit)
            .limit(limit);
        const total_pages = Math.ceil(totalDocs / limit);
        const meta = {
            docsFound: totalDocs,
            docsInResponse: moneyDoc.length,
            limit,
            total_pages,
            currentPage: page,
        };
        return { data: moneyDoc, meta };
    }
    catch (error) {
        throw error;
    }
});
const getMoney = ({ moneyId, query, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const moneyDoc = yield Money.findById(moneyId);
        return moneyDoc;
    }
    catch (error) {
        throw error;
    }
});
const addMoney = ({ requestUser, amount, description, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const money = new Money({
            user_id: requestUser._id,
            amount,
            description,
        });
        let moneyDoc = yield money.save();
        return moneyDoc;
    }
    catch (error) {
        throw error;
    }
});
const updateMoney = ({ moneyId, amount, description, requestUser, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let moneyDoc = yield Money.findById(moneyId);
        if (!moneyDoc) {
            throw new Error("Money record not found");
        }
        moneyDoc.amount = amount;
        moneyDoc.description = description;
        moneyDoc.updatedAt = new Date();
        yield moneyDoc.save();
        return moneyDoc;
    }
    catch (error) {
        throw error;
    }
});
const deleteMoney = ({ moneyId }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Money.findByIdAndDelete(moneyId);
    }
    catch (error) {
        throw error;
    }
});
export const moneyService = {
    getMoney,
    addMoney,
    getMoneyList,
    updateMoney,
    deleteMoney,
    getCustomerMoneyList,
};
//# sourceMappingURL=money.service.js.map