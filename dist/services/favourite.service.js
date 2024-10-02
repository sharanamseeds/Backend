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
import Favourite from "../models/favourite.model.js";
import { escapeRegex } from "../helpers/common.helpers..js";
const getFavouriteList = ({ query, }) => __awaiter(void 0, void 0, void 0, function* () {
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
            filterQuery.$or = [{ notes: new RegExp(escapeRegex(search), "i") }];
        }
        const totalDocs = yield Favourite.countDocuments(filterQuery);
        if (!pagination) {
            const favouriteDoc = yield Favourite.find(filterQuery).sort({
                [sortBy]: sortOrder === "asc" ? 1 : -1,
                _id: 1,
            });
            return {
                data: favouriteDoc,
                meta: {
                    docsFound: totalDocs,
                    docsInResponse: favouriteDoc.length,
                    limit,
                    total_pages: 1,
                    currentPage: 1,
                },
            };
        }
        const favouriteDoc = yield Favourite.find(filterQuery)
            .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1, _id: 1 })
            .skip((page - 1) * limit)
            .limit(limit);
        const total_pages = Math.ceil(totalDocs / limit);
        const meta = {
            docsFound: totalDocs,
            docsInResponse: favouriteDoc.length,
            limit,
            total_pages,
            currentPage: page,
        };
        return { data: favouriteDoc, meta };
    }
    catch (error) {
        throw error;
    }
});
const getUserFavouriteList = ({ query, requestUser, }) => __awaiter(void 0, void 0, void 0, function* () {
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
            filterQuery.$or = [{ notes: new RegExp(escapeRegex(search), "i") }];
        }
        const totalDocs = yield Favourite.countDocuments(filterQuery);
        if (!pagination) {
            const favouriteDoc = yield Favourite.find(filterQuery).sort({
                [sortBy]: sortOrder === "asc" ? 1 : -1,
                _id: 1,
            });
            return {
                data: favouriteDoc,
                meta: {
                    docsFound: totalDocs,
                    docsInResponse: favouriteDoc.length,
                    limit,
                    total_pages: 1,
                    currentPage: 1,
                },
            };
        }
        const favouriteDoc = yield Favourite.find(filterQuery)
            .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1, _id: 1 })
            .skip((page - 1) * limit)
            .limit(limit);
        const total_pages = Math.ceil(totalDocs / limit);
        const meta = {
            docsFound: totalDocs,
            docsInResponse: favouriteDoc.length,
            limit,
            total_pages,
            currentPage: page,
        };
        return { data: favouriteDoc, meta };
    }
    catch (error) {
        throw error;
    }
});
const getFavourite = ({ favouriteId, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield Favourite.findById(favouriteId);
    }
    catch (error) {
        throw error;
    }
});
const addFavourite = ({ requestUser, req, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const favouriteId = new mongoose.Types.ObjectId();
        let bodyData = {};
        if (((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.payload) && typeof req.query.payload === "string") {
            bodyData = JSON.parse(req.query.payload);
        }
        const favouriteData = Object.assign({ _id: favouriteId, user_id: requestUser._id }, bodyData);
        const favourite = new Favourite(favouriteData);
        return yield favourite.save();
    }
    catch (error) {
        throw error;
    }
});
const updateFavourite = ({ favouriteId, requestUser, req, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const favouriteDoc = yield Favourite.findById(favouriteId);
        if (!favouriteDoc) {
            throw new Error("Favourite not found");
        }
        let bodyData = {};
        if (((_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.payload) && typeof req.query.payload === "string") {
            bodyData = JSON.parse(req.query.payload);
        }
        Object.assign(favouriteDoc, bodyData);
        return yield favouriteDoc.save();
    }
    catch (error) {
        throw error;
    }
});
const deleteFavourite = ({ favouriteId, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Favourite.findByIdAndDelete(favouriteId);
    }
    catch (error) {
        throw error;
    }
});
export const favouriteService = {
    getFavourite,
    addFavourite,
    getFavouriteList,
    updateFavourite,
    deleteFavourite,
    getUserFavouriteList,
};
//# sourceMappingURL=favourite.service.js.map