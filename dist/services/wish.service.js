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
import Wish from "../models/wish. model.js";
const getWishList = ({ query, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lang_code = query.lang_code;
        let { limit, page, pagination = true, sortBy = "createdAt", sortOrder = "asc", user_id, product_id, search, } = query;
        limit = Number(limit);
        page = Number(page);
        pagination = pagination === "true";
        let filterQuery = {};
        if (user_id) {
            filterQuery.user_id = new mongoose.Types.ObjectId(user_id);
        }
        if (product_id) {
            filterQuery.product_id = new mongoose.Types.ObjectId(product_id);
        }
        if (search) {
            filterQuery.$or = [{ notes: new RegExp(search, "i") }];
        }
        const totalDocs = yield Wish.countDocuments(filterQuery);
        if (!pagination) {
            const wishDoc = yield Wish.find(filterQuery).sort({
                [sortBy]: sortOrder === "asc" ? 1 : -1,
            });
            return {
                data: wishDoc,
                meta: {
                    docsFound: totalDocs,
                    docsInResponse: wishDoc.length,
                    limit,
                    total_pages: 1,
                    currentPage: 1,
                },
            };
        }
        const wishDoc = yield Wish.find(filterQuery)
            .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        const total_pages = Math.ceil(totalDocs / limit);
        const meta = {
            docsFound: totalDocs,
            docsInResponse: wishDoc.length,
            limit,
            total_pages,
            currentPage: page,
        };
        return { data: wishDoc, meta };
    }
    catch (error) {
        throw error;
    }
});
const getUserWishList = ({ query, requestUser, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lang_code = query.lang_code;
        let { limit, page, pagination = true, sortBy = "createdAt", sortOrder = "asc", user_id, product_id, search, } = query;
        limit = Number(limit);
        page = Number(page);
        pagination = pagination === "true";
        let filterQuery = {
            user_id: requestUser._id,
        };
        if (product_id) {
            filterQuery.product_id = new mongoose.Types.ObjectId(product_id);
        }
        if (search) {
            filterQuery.$or = [{ notes: new RegExp(search, "i") }];
        }
        const totalDocs = yield Wish.countDocuments(filterQuery);
        if (!pagination) {
            const wishDoc = yield Wish.find(filterQuery).sort({
                [sortBy]: sortOrder === "asc" ? 1 : -1,
            });
            return {
                data: wishDoc,
                meta: {
                    docsFound: totalDocs,
                    docsInResponse: wishDoc.length,
                    limit,
                    total_pages: 1,
                    currentPage: 1,
                },
            };
        }
        const wishDoc = yield Wish.find(filterQuery)
            .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        const total_pages = Math.ceil(totalDocs / limit);
        const meta = {
            docsFound: totalDocs,
            docsInResponse: wishDoc.length,
            limit,
            total_pages,
            currentPage: page,
        };
        return { data: wishDoc, meta };
    }
    catch (error) {
        throw error;
    }
});
const getWish = ({ wishId, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield Wish.findById(wishId);
    }
    catch (error) {
        throw error;
    }
});
const addWish = ({ requestUser, req, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const wishId = new mongoose.Types.ObjectId();
        let bodyData = {};
        if (((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.payload) && typeof req.query.payload === "string") {
            bodyData = JSON.parse(req.query.payload);
        }
        const wishData = Object.assign({ _id: wishId, user_id: requestUser._id }, bodyData);
        const wish = new Wish(wishData);
        return yield wish.save();
    }
    catch (error) {
        throw error;
    }
});
const updateWish = ({ wishId, requestUser, req, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const wishDoc = yield Wish.findById(wishId);
        if (!wishDoc) {
            throw new Error("Wish not found");
        }
        let bodyData = {};
        if (((_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.payload) && typeof req.query.payload === "string") {
            bodyData = JSON.parse(req.query.payload);
        }
        Object.assign(wishDoc, bodyData);
        return yield wishDoc.save();
    }
    catch (error) {
        throw error;
    }
});
const deleteWish = ({ wishId }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Wish.findByIdAndDelete(wishId);
    }
    catch (error) {
        throw error;
    }
});
export const wishService = {
    getWish,
    addWish,
    getWishList,
    updateWish,
    deleteWish,
    getUserWishList,
};
//# sourceMappingURL=wish.service.js.map