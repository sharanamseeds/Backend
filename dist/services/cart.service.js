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
import { escapeRegex } from "../helpers/common.helpers..js";
const projectLocalizedCartProducts = (lang_code) => {
    return [
        {
            $lookup: {
                from: "products",
                localField: "product_id",
                foreignField: "_id",
                pipeline: [
                    {
                        $lookup: {
                            from: "offers",
                            let: {
                                productId: "$_id",
                                categoryId: "$category_id",
                                isActive: true, // Pass the isActive variable
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                // Ensure offer.is_active is true
                                                { $eq: ["$is_active", true] },
                                                // Conditionally include the isActive condition
                                                {
                                                    $or: [
                                                        {
                                                            $cond: [
                                                                { $ne: [null, "$$isActive"] },
                                                                { $eq: ["$is_active", "$$isActive"] },
                                                                true,
                                                            ],
                                                        },
                                                        // Check if productId is in products
                                                        {
                                                            $cond: [
                                                                { $ne: [null, "$$productId"] },
                                                                { $in: ["$$productId", "$products"] },
                                                                true,
                                                            ],
                                                        },
                                                        // Check if categoryId is in categories
                                                        {
                                                            $cond: [
                                                                { $ne: [null, "$$categoryId"] },
                                                                { $in: ["$$categoryId", "$categories"] },
                                                                true,
                                                            ],
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                    },
                                },
                                {
                                    $project: {
                                        added_by: 1,
                                        updated_by: 1,
                                        offer_code: 1,
                                        identifier: 1,
                                        is_active: 1,
                                        product_specified: 1,
                                        products: 1,
                                        category_specified: 1,
                                        categories: 1,
                                        offer_type: 1,
                                        percentage_discount: 1,
                                        fixed_amount_discount: 1,
                                        tiers: 1,
                                        buy_quantity: 1,
                                        get_quantity: 1,
                                        bundle_items: 1,
                                        referral_code: 1,
                                        referral_amount: 1,
                                        coupon_code: 1,
                                        coupon_details: 1,
                                        createdAt: 1,
                                        updatedAt: 1,
                                        image: {
                                            $map: {
                                                input: {
                                                    $filter: {
                                                        input: "$image",
                                                        as: "item",
                                                        cond: {
                                                            $eq: ["$$item.lang_code", lang_code],
                                                        },
                                                    },
                                                },
                                                as: "item",
                                                in: "$$item.value",
                                            },
                                        },
                                        description: {
                                            $arrayElemAt: [
                                                {
                                                    $map: {
                                                        input: {
                                                            $filter: {
                                                                input: "$description",
                                                                as: "item",
                                                                cond: {
                                                                    $eq: ["$$item.lang_code", lang_code],
                                                                },
                                                            },
                                                        },
                                                        as: "item",
                                                        in: "$$item.value",
                                                    },
                                                },
                                                0,
                                            ],
                                        },
                                        offer_name: {
                                            $arrayElemAt: [
                                                {
                                                    $map: {
                                                        input: {
                                                            $filter: {
                                                                input: "$offer_name",
                                                                as: "item",
                                                                cond: {
                                                                    $eq: ["$$item.lang_code", lang_code],
                                                                },
                                                            },
                                                        },
                                                        as: "item",
                                                        in: "$$item.value",
                                                    },
                                                },
                                                0,
                                            ],
                                        },
                                    },
                                },
                            ],
                            as: "offers",
                        },
                    },
                    {
                        $project: {
                            added_by: 1,
                            updated_by: 1,
                            product_code: 1,
                            offers: 1,
                            brand_id: 1,
                            category_id: 1,
                            in_stock: 1,
                            gst_percent: 1,
                            price_with_gst: 1,
                            size: 1,
                            price: 1,
                            quantity: 1,
                            is_active: 1,
                            is_verified: 1,
                            manufacture_date: 1,
                            expiry_date: 1,
                            is_featured: 1,
                            base_unit: 1,
                            lot_no: 1,
                            vendor_name: 1,
                            grn_date: 1,
                            std_qty: 1,
                            logo: {
                                $arrayElemAt: [
                                    {
                                        $map: {
                                            input: {
                                                $filter: {
                                                    input: "$logo",
                                                    as: "item",
                                                    cond: {
                                                        $eq: ["$$item.lang_code", lang_code],
                                                    },
                                                },
                                            },
                                            as: "item",
                                            in: "$$item.value",
                                        },
                                    },
                                    0,
                                ],
                            },
                            description: {
                                $arrayElemAt: [
                                    {
                                        $map: {
                                            input: {
                                                $filter: {
                                                    input: "$description",
                                                    as: "item",
                                                    cond: {
                                                        $eq: ["$$item.lang_code", lang_code],
                                                    },
                                                },
                                            },
                                            as: "item",
                                            in: "$$item.value",
                                        },
                                    },
                                    0,
                                ],
                            },
                            product_name: {
                                $arrayElemAt: [
                                    {
                                        $map: {
                                            input: {
                                                $filter: {
                                                    input: "$product_name",
                                                    as: "item",
                                                    cond: {
                                                        $eq: ["$$item.lang_code", lang_code],
                                                    },
                                                },
                                            },
                                            as: "item",
                                            in: "$$item.value",
                                        },
                                    },
                                    0,
                                ],
                            },
                            images: {
                                $map: {
                                    input: {
                                        $filter: {
                                            input: "$images",
                                            as: "item",
                                            cond: {
                                                $eq: ["$$item.lang_code", lang_code],
                                            },
                                        },
                                    },
                                    as: "item",
                                    in: "$$item.value",
                                },
                            },
                        },
                    },
                ],
                as: "product",
            },
        },
        {
            $unwind: {
                path: "$product",
                preserveNullAndEmptyArrays: true,
            },
        },
    ];
};
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
            filterQuery.$or = [{ notes: new RegExp(escapeRegex(search), "i") }];
        }
        const totalDocs = yield Cart.countDocuments(filterQuery);
        if (!pagination) {
            const cartDoc = yield Cart.aggregate([
                { $match: filterQuery },
                ...projectLocalizedCartProducts(lang_code),
            ]).sort({
                [sortBy]: sortOrder === "asc" ? 1 : -1,
                _id: 1,
            });
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
        const cartDoc = yield Cart.aggregate([
            { $match: filterQuery },
            ...projectLocalizedCartProducts(lang_code),
        ])
            .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1, _id: 1 })
            .skip((page - 1) * limit)
            .limit(limit);
        // .populate("products");
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
            filterQuery.$or = [{ notes: new RegExp(escapeRegex(search), "i") }];
        }
        const totalDocs = yield Cart.countDocuments(filterQuery);
        if (!pagination) {
            const cartDoc = yield Cart.aggregate([
                { $match: filterQuery },
                ...projectLocalizedCartProducts(lang_code),
            ]).sort({
                [sortBy]: sortOrder === "asc" ? 1 : -1,
                _id: 1,
            });
            // .populate("products");
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
        const cartDoc = yield Cart.aggregate([
            { $match: filterQuery },
            ...projectLocalizedCartProducts(lang_code),
        ])
            .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1, _id: 1 })
            .skip((page - 1) * limit)
            .limit(limit);
        // .populate("products");
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
const getCart = ({ cartId, query, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lang_code = query.lang_code;
        const docs = yield Cart.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(cartId) } },
            ...projectLocalizedCartProducts(lang_code),
        ]);
        return docs[0];
    }
    catch (error) {
        throw error;
    }
});
const addCart = ({ requestUser, req, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let bodyData = {};
        if (((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.payload) && typeof req.query.payload === "string") {
            bodyData = JSON.parse(req.query.payload);
        }
        let cartData = Object.assign({ user_id: requestUser._id }, bodyData);
        if (bodyData === null || bodyData === void 0 ? void 0 : bodyData.product_id) {
            cartData.product_id = bodyData.product_id;
        }
        if (bodyData === null || bodyData === void 0 ? void 0 : bodyData.selectedOffer) {
            cartData.selectedOffer = bodyData.selectedOffer;
        }
        else {
            cartData.selectedOffer = null;
        }
        let isAdded = yield Cart.findOne(cartData);
        if (isAdded) {
            if (bodyData.quantity) {
                let newQuantity = bodyData.quantity;
                if (typeof newQuantity === "string") {
                    newQuantity = parseInt(newQuantity, 10);
                }
                isAdded.quantity += newQuantity;
            }
            else {
                isAdded.quantity += 1;
            }
            return yield isAdded.save();
        }
        else {
            cartData = Object.assign({ user_id: requestUser._id }, bodyData);
            const cart = new Cart(cartData);
            return yield cart.save();
        }
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