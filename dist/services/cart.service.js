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
import Cart from "../models/cart.model.js";
const getCartList = ({ query, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lang_code = query.lang_code;
        let { limit, page, pagination = true, sortBy = "createdAt", sortOrder = "asc", user_id, product_id, status, search, } = query;
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
        if (status) {
            filterQuery.status = status;
        }
        if (search) {
            filterQuery.$or = [{ notes: new RegExp(search, "i") }];
        }
        const totalDocs = yield Cart.countDocuments(filterQuery);
        if (!pagination) {
            const cartDoc = yield Cart.find(filterQuery)
                .sort({
                [sortBy]: sortOrder === "asc" ? 1 : -1,
            })
                .populate("products");
            return {
                data: cartDoc,
                meta: {
                    docsFound: totalDocs,
                    docsInResponse: cartDoc.length,
                    limit,
                    total_pages: 1,
                    currentPage: 1,
                },
            };
        }
        const cartDoc = yield Cart.find(filterQuery)
            .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate("products");
        const total_pages = Math.ceil(totalDocs / limit);
        const meta = {
            docsFound: totalDocs,
            docsInResponse: cartDoc.length,
            limit,
            total_pages,
            currentPage: page,
        };
        return { data: cartDoc, meta };
    }
    catch (error) {
        throw error;
    }
});
const getUserCartList = ({ query, requestUser, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lang_code = query.lang_code;
        let { limit, page, pagination = true, sortBy = "createdAt", sortOrder = "asc", product_id, status, search, } = query;
        limit = Number(limit);
        page = Number(page);
        pagination = pagination === "true";
        let filterQuery = {
            user_id: requestUser._id,
        };
        if (product_id) {
            filterQuery.product_id = new mongoose.Types.ObjectId(product_id);
        }
        if (status) {
            filterQuery.status = status;
        }
        if (search) {
            filterQuery.$or = [{ notes: new RegExp(search, "i") }];
        }
        const totalDocs = yield Cart.countDocuments(filterQuery);
        if (!pagination) {
            const cartDoc = yield Cart.find(filterQuery)
                .sort({
                [sortBy]: sortOrder === "asc" ? 1 : -1,
            })
                .populate("products");
            return {
                data: cartDoc,
                meta: {
                    docsFound: totalDocs,
                    docsInResponse: cartDoc.length,
                    limit,
                    total_pages: 1,
                    currentPage: 1,
                },
            };
        }
        const cartDoc = yield Cart.find(filterQuery)
            .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate("products");
        const total_pages = Math.ceil(totalDocs / limit);
        const meta = {
            docsFound: totalDocs,
            docsInResponse: cartDoc.length,
            limit,
            total_pages,
            currentPage: page,
        };
        return { data: cartDoc, meta };
    }
    catch (error) {
        throw error;
    }
});
const getCart = ({ cartId, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield Cart.findById(cartId).populate("products");
    }
    catch (error) {
        throw error;
    }
});
const addCart = ({ requestUser, req, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const cartId = new mongoose.Types.ObjectId();
        let bodyData = {};
        if (((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.payload) && typeof req.query.payload === "string") {
            bodyData = JSON.parse(req.query.payload);
        }
        const cartData = Object.assign({ _id: cartId, user_id: requestUser._id }, bodyData);
        const cart = new Cart(cartData);
        return yield cart.save();
    }
    catch (error) {
        throw error;
    }
});
const updateCart = ({ cartId, requestUser, req, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const cartDoc = yield Cart.findById(cartId);
        if (!cartDoc) {
            throw new Error("Cart not found");
        }
        let bodyData = {};
        if (((_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.payload) && typeof req.query.payload === "string") {
            bodyData = JSON.parse(req.query.payload);
        }
        Object.assign(cartDoc, bodyData);
        return yield cartDoc.save();
    }
    catch (error) {
        throw error;
    }
});
const deleteCart = ({ cartId }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Cart.findByIdAndDelete(cartId);
    }
    catch (error) {
        throw error;
    }
});
export const cartService = {
    getCart,
    addCart,
    getCartList,
    updateCart,
    deleteCart,
    getUserCartList,
};
//# sourceMappingURL=cart.service.js.map