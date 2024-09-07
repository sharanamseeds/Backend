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
import Order from "../models/orders.model.js";
import User from "../models/users.model.js";
import Offer from "../models/offers.models.js";
import { productService } from "./products.service.js";
import Product from "../models/products.model.js";
import { billService } from "./bills.service.js";
import { convertFiles } from "../helpers/files.management.js";
import { masterConfig } from "../config/master.config.js";
const calculateDaysDifference = (startDate, endDate) => {
    // Convert the input dates to milliseconds
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    // Calculate the difference in milliseconds
    const differenceInTime = end - start;
    // Convert milliseconds to days
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays;
};
const calculateOrderAmount = (products) => {
    let order_amount = 0;
    let discount_amount = 0;
    let tax_amount = 0;
    products.forEach((item) => {
        // Add the total product amount (excluding GST) to the order amount
        order_amount += item.purchase_price * item.quantity;
        // Add the calculated discount to the total discount amount
        discount_amount += item.offer_discount;
        // Add the GST amount to the tax amount
        tax_amount += item.gst_amount;
    });
    const billing_amount = order_amount + tax_amount - discount_amount;
    return {
        order_amount: Number(order_amount.toFixed(2)),
        discount_amount: Number(discount_amount.toFixed(2)),
        billing_amount: Number(billing_amount.toFixed(2)),
        tax_amount: Number(tax_amount.toFixed(2)),
    };
};
const calculatePercentageDiscount = (amountBeforeGST, percentage) => {
    return amountBeforeGST * (percentage / 100);
};
const calculateFixedAmountDiscount = (_, offerAmount) => {
    return offerAmount;
};
const calculateReferralDiscount = (_, offerAmount) => {
    return offerAmount;
};
const calculateCouponDiscount = (amountBeforeGST, coupon_details) => {
    if (coupon_details.coupon_type === "percentage") {
        return calculatePercentageDiscount(amountBeforeGST, coupon_details.value);
    }
    else {
        return calculateFixedAmountDiscount(amountBeforeGST, coupon_details.value);
    }
};
const calculateTieredDiscount = (amountBeforeGST, tiers) => {
    const applicableTier = tiers
        .filter((tier) => amountBeforeGST >= tier.min_order_value)
        .sort((a, b) => b.min_order_value - a.min_order_value)[0];
    if (!applicableTier) {
        throw new Error("Tiers Is Not Applicable");
    }
    return amountBeforeGST * (applicableTier.discount / 100);
};
const calculateBundleDiscount = (amountBeforeGST, bundleItems, product) => {
    let discountAmount = 0;
    bundleItems.forEach((bundleItem) => {
        if (product.product_id.equals(bundleItem.product_id) &&
            product.quantity >= bundleItem.quantity) {
            const bundleTotal = bundleItem.quantity * bundleItem.price;
            discountAmount += bundleTotal - bundleItem.price * bundleItem.quantity;
        }
    });
    return discountAmount;
};
const calculateBuyXGetYDiscount = (_, buy_quantity, get_quantity, product, product_price) => {
    let discountAmount = 0;
    if (product.quantity >= buy_quantity) {
        const setsOfOffer = Math.floor(product.quantity / (buy_quantity + get_quantity));
        discountAmount += setsOfOffer * product_price * get_quantity;
    }
    return discountAmount;
};
const calculateDiscount = (product, amountBeforeGST, product_price) => __awaiter(void 0, void 0, void 0, function* () {
    let discount = 0;
    if (!product.offer_id) {
        return discount;
    }
    const offerDoc = yield Offer.findById(product.offer_id);
    if (!offerDoc) {
        throw new Error("Offer Not Found");
    }
    if (!offerDoc.is_active) {
        throw new Error("This Offer Is Inactive");
    }
    switch (offerDoc.offer_type) {
        case "percentage":
            if (!offerDoc.percentage_discount) {
                throw new Error("Discount Percent Is not Defined");
            }
            discount = calculatePercentageDiscount(amountBeforeGST, offerDoc.percentage_discount);
            return discount;
        case "fixed_amount":
            if (!offerDoc.fixed_amount_discount) {
                throw new Error("Fixed Amount Discount Is not Defined");
            }
            discount = calculateFixedAmountDiscount(amountBeforeGST, offerDoc.fixed_amount_discount);
            return discount;
        case "referral":
            if (!offerDoc.referral_amount) {
                throw new Error("Referral Amount Is not Defined");
            }
            discount = calculateReferralDiscount(amountBeforeGST, offerDoc.referral_amount);
            return discount;
        case "coupon":
            if (!offerDoc.coupon_details) {
                throw new Error("Coupon Details Are not Defined");
            }
            discount = calculateCouponDiscount(amountBeforeGST, offerDoc.coupon_details);
            return discount;
        case "tiered":
            if (!offerDoc.tiers) {
                throw new Error("Tiers Are not Defined");
            }
            discount = calculateTieredDiscount(amountBeforeGST, offerDoc.tiers);
            return discount;
        case "buy_x_get_y":
            if (offerDoc.buy_quantity === undefined ||
                offerDoc.get_quantity === undefined) {
                throw new Error("Buy Quantity or Get Quantity Is not Defined");
            }
            discount = calculateBuyXGetYDiscount(amountBeforeGST, offerDoc.buy_quantity, offerDoc.get_quantity, product, product_price);
            return discount;
        case "bundle":
            if (!offerDoc.bundle_items) {
                throw new Error("Bundle Items Are not Defined");
            }
            discount = calculateBundleDiscount(amountBeforeGST, offerDoc.bundle_items, product);
            return discount;
        default:
            throw new Error(`Unknown offer type: ${offerDoc.offer_type}`);
    }
});
const calculateReturnDiscount = (product, amountBeforeGST, product_price) => __awaiter(void 0, void 0, void 0, function* () {
    let discount = 0;
    if (!product.offer_id) {
        return discount;
    }
    const offerDoc = yield Offer.findById(product.offer_id);
    if (!offerDoc) {
        throw new Error("Offer Not Found");
    }
    switch (offerDoc.offer_type) {
        case "percentage":
            if (!offerDoc.percentage_discount) {
                throw new Error("Discount Percent Is not Defined");
            }
            discount = calculatePercentageDiscount(amountBeforeGST, offerDoc.percentage_discount);
            return discount;
        case "fixed_amount":
            if (!offerDoc.fixed_amount_discount) {
                throw new Error("Fixed Amount Discount Is not Defined");
            }
            discount = calculateFixedAmountDiscount(amountBeforeGST, offerDoc.fixed_amount_discount);
            return discount;
        case "referral":
            if (!offerDoc.referral_amount) {
                throw new Error("Referral Amount Is not Defined");
            }
            discount = calculateReferralDiscount(amountBeforeGST, offerDoc.referral_amount);
            return discount;
        case "coupon":
            if (!offerDoc.coupon_details) {
                throw new Error("Coupon Details Are not Defined");
            }
            discount = calculateCouponDiscount(amountBeforeGST, offerDoc.coupon_details);
            return discount;
        case "tiered":
            if (!offerDoc.tiers) {
                throw new Error("Tiers Are not Defined");
            }
            discount = calculateTieredDiscount(amountBeforeGST, offerDoc.tiers);
            return discount;
        case "buy_x_get_y":
            if (offerDoc.buy_quantity === undefined ||
                offerDoc.get_quantity === undefined) {
                throw new Error("Buy Quantity or Get Quantity Is not Defined");
            }
            discount = calculateBuyXGetYDiscount(amountBeforeGST, offerDoc.buy_quantity, offerDoc.get_quantity, product, product_price);
            return discount;
        case "bundle":
            if (!offerDoc.bundle_items) {
                throw new Error("Bundle Items Are not Defined");
            }
            discount = calculateBundleDiscount(amountBeforeGST, offerDoc.bundle_items, product);
            return discount;
        default:
            throw new Error(`Unknown offer type: ${offerDoc.offer_type}`);
    }
});
const modifiedProducts = (products) => __awaiter(void 0, void 0, void 0, function* () {
    const calculatedProducts = yield Promise.all(products.map((product) => __awaiter(void 0, void 0, void 0, function* () {
        const productDoc = yield Product.findById(product.product_id);
        if (!productDoc || !productDoc.is_active || !productDoc.is_verified) {
            throw new Error("Product Not Found");
        }
        const total_amount = productDoc.price * product.quantity;
        let discount = 0;
        if (product.offer_id) {
            discount = yield calculateDiscount(product, total_amount, productDoc.price);
        }
        let final_amount = total_amount - discount;
        const gst_amount = productDoc.gst_percent > 0
            ? (final_amount * productDoc.gst_percent) / 100
            : 0; // GST should be calculated after applying discount
        return Object.assign(Object.assign({}, product), { offer_discount: Number(discount.toFixed(2)), total_amount: Number(final_amount.toFixed(2)), gst_rate: Number(productDoc.gst_percent.toFixed(2)), purchase_price: Number(productDoc.price.toFixed(2)), gst_amount: Number(gst_amount.toFixed(2)), manufacture_date: productDoc === null || productDoc === void 0 ? void 0 : productDoc.manufacture_date, expiry_date: productDoc === null || productDoc === void 0 ? void 0 : productDoc.expiry_date });
    })));
    return calculatedProducts;
});
const checkProductsInStock = (products) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Promise.all(products.map((product) => __awaiter(void 0, void 0, void 0, function* () {
            const productDoc = yield Product.findById(product.product_id);
            if (!productDoc) {
                throw new Error(`Product Not Found, Product Id: ${product.product_id}`);
            }
            if (!productDoc.is_active) {
                throw new Error(`Product Not Active, Product Code: ${productDoc.product_code}`);
            }
            if (!productDoc.in_stock) {
                throw new Error(`Product is Not In Stock, Product Code: ${productDoc.product_code}`);
            }
            if (productDoc.quantity < product.quantity) {
                throw new Error(`Product Has Not Enough Quantity, Product Code: ${productDoc.product_code}`);
            }
        })));
        return true;
    }
    catch (error) {
        throw error;
    }
});
const getOrderList = ({ query, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { limit, page, pagination = true, sortBy = "createdAt", sortOrder = "asc", buy_order_id, status, user_id, offer_id, product_id, bill_id, total_order_amount, billing_amount, order_type, is_creditable, credit_duration, } = query;
        let filterQuery = {};
        if (product_id) {
            filterQuery.products = {
                $elemMatch: { product_id: new mongoose.Types.ObjectId(product_id) },
            };
        }
        if (credit_duration) {
            filterQuery.credit_duration = credit_duration;
        }
        if (is_creditable) {
            filterQuery.is_creditable = is_creditable;
        }
        if (order_type) {
            filterQuery.order_type = order_type;
        }
        if (buy_order_id) {
            filterQuery.buy_order_id = new mongoose.Types.ObjectId(buy_order_id);
        }
        if (status) {
            filterQuery.status = status;
        }
        if (user_id) {
            filterQuery.user_id = user_id;
        }
        if (offer_id) {
            filterQuery.offer_id = offer_id;
        }
        if (bill_id) {
            filterQuery.bill_id = bill_id;
        }
        if (total_order_amount) {
            filterQuery.total_order_amount = total_order_amount;
        }
        if (billing_amount) {
            filterQuery.billing_amount = billing_amount;
        }
        const totalDocs = yield Order.countDocuments(filterQuery);
        if (!pagination) {
            const orderDoc = yield Order.find(filterQuery).sort({
                [sortBy]: sortOrder === "asc" ? 1 : -1,
            });
            return {
                data: orderDoc,
                meta: {
                    docsFound: totalDocs,
                    docsInResponse: orderDoc.length,
                    limit,
                    total_pages: 1,
                    currentPage: 1,
                },
            };
        }
        const orderDoc = yield Order.find(filterQuery)
            .sort({
            [sortBy]: sortOrder === "asc" ? 1 : -1,
        })
            .skip((page - 1) * limit)
            .limit(limit);
        const total_pages = Math.ceil(totalDocs / limit);
        const meta = {
            docsFound: totalDocs,
            docsInResponse: orderDoc.length,
            limit,
            total_pages,
            currentPage: page,
        };
        return { data: orderDoc, meta };
    }
    catch (error) {
        throw error;
    }
});
const getCustomerOrderList = ({ query, requestUser, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { limit, page, pagination = true, sortBy = "createdAt", sortOrder = "asc", buy_order_id, status, offer_id, product_id, bill_id, total_order_amount, billing_amount, order_type, is_creditable, credit_duration, } = query;
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
        if (product_id) {
            filterQuery.products = {
                $elemMatch: { product_id: new mongoose.Types.ObjectId(product_id) },
            };
        }
        if (credit_duration) {
            filterQuery.credit_duration = credit_duration;
        }
        if (is_creditable) {
            filterQuery.is_creditable = is_creditable;
        }
        if (order_type) {
            filterQuery.order_type = order_type;
        }
        if (buy_order_id) {
            filterQuery.buy_order_id = new mongoose.Types.ObjectId(buy_order_id);
        }
        if (status) {
            filterQuery.status = status;
        }
        if (offer_id) {
            filterQuery.offer_id = offer_id;
        }
        if (bill_id) {
            filterQuery.bill_id = bill_id;
        }
        if (total_order_amount) {
            filterQuery.total_order_amount = total_order_amount;
        }
        if (billing_amount) {
            filterQuery.billing_amount = billing_amount;
        }
        const totalDocs = yield Order.countDocuments(filterQuery);
        if (!pagination) {
            const orderDoc = yield Order.find(filterQuery).sort({
                [sortBy]: sortOrder === "asc" ? 1 : -1,
            });
            return {
                data: orderDoc,
                meta: {
                    docsFound: totalDocs,
                    docsInResponse: orderDoc.length,
                    limit,
                    total_pages: 1,
                    currentPage: 1,
                },
            };
        }
        const orderDoc = yield Order.find(filterQuery)
            .sort({
            [sortBy]: sortOrder === "asc" ? 1 : -1,
        })
            .skip((page - 1) * limit)
            .limit(limit);
        const total_pages = Math.ceil(totalDocs / limit);
        const meta = {
            docsFound: totalDocs,
            docsInResponse: orderDoc.length,
            limit,
            total_pages,
            currentPage: page,
        };
        return { data: orderDoc, meta };
    }
    catch (error) {
        throw error;
    }
});
// const getOrder = async ({
//   orderId,
//   query,
// }: {
//   orderId: string;
//   query?: any;
// }): Promise<Document<unknown, {}, typeOrder> | null> => {
//   try {
//     const orderDoc = await Order.findById(orderId);
//     return orderDoc;
//   } catch (error) {
//     throw error;
//   }
// };
const getOrder = ({ orderId, query, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lang_code = query.lang_code ||
            masterConfig.defaultDataConfig.languageConfig.lang_code;
        // Fetch the order and populate product details
        let orderDoc = yield Order.findById(orderId);
        if (!orderDoc)
            return null;
        const productPromises = orderDoc.products.map((product) => __awaiter(void 0, void 0, void 0, function* () {
            const productDoc = yield Product.findById(product.product_id);
            const productObject = productDoc.toObject();
            const localizedImages = productObject.images
                .filter((image) => image.lang_code === lang_code)
                .map((image) => image.value);
            const localizedLogo = productObject.logo
                .filter((logo) => logo.lang_code === lang_code)
                .map((logo) => logo.value);
            const data = {
                product_id: product.product_id,
                offer_id: product.offer_id,
                quantity: product.quantity,
                offer_discount: product.offer_discount,
                total_amount: product.total_amount,
                gst_rate: product.gst_rate,
                purchase_price: product.purchase_price,
                gst_amount: product.gst_amount,
                manufacture_date: product.manufacture_date,
                expiry_date: product.expiry_date,
                images: localizedImages,
                logo: localizedLogo,
            };
            return data;
        }));
        // Wait for all promises to resolve
        const newProducts = yield Promise.all(productPromises);
        const modifiedOrder = {
            user_id: orderDoc.user_id,
            added_by: orderDoc.added_by,
            updated_by: orderDoc.updated_by,
            bill_id: orderDoc.bill_id,
            order_type: orderDoc.order_type,
            buy_order_id: orderDoc.buy_order_id,
            products: newProducts,
            order_amount: orderDoc.order_amount,
            discount_amount: orderDoc.discount_amount,
            billing_amount: orderDoc.billing_amount,
            tax_amount: orderDoc.tax_amount,
            status: orderDoc.status,
            is_creditable: orderDoc.is_creditable,
            credit_duration: orderDoc.credit_duration,
            order_notes: orderDoc.order_notes,
            reason: orderDoc.reason,
        };
        // Return the order with localized products
        return modifiedOrder;
    }
    catch (error) {
        throw error;
    }
});
const addOrder = ({ requestUser, req, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let bodyData = {};
        if (((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.payload) && typeof req.query.payload === "string") {
            bodyData = JSON.parse(req.query.payload);
        }
        const userDoc = yield User.findById((bodyData === null || bodyData === void 0 ? void 0 : bodyData.user_id) ? bodyData.user_id : requestUser._id);
        if (!userDoc) {
            throw new Error("User Not Found");
        }
        // TODO: Uncomment in Main
        // if (!userDoc.is_email_verified) {
        //   throw new Error("Verify Your Email Account Before Place Order");
        // }
        if (userDoc.is_blocked) {
            throw new Error("Unable To Place Order");
        }
        const modifiedOrderItems = yield modifiedProducts(bodyData.products);
        // total order amount grand total of all products
        const totalOrderAmount = calculateOrderAmount(modifiedOrderItems);
        const order = new Order({
            order_type: "buy",
            status: "pending",
            user_id: userDoc._id,
            added_by: requestUser._id,
            updated_by: requestUser._id,
            products: modifiedOrderItems,
            tax_amount: totalOrderAmount.tax_amount,
            order_amount: totalOrderAmount.order_amount,
            discount_amount: totalOrderAmount.discount_amount,
            billing_amount: totalOrderAmount.billing_amount,
        });
        const orderDoc = yield order.save();
        return orderDoc;
    }
    catch (error) {
        throw error;
    }
});
const calculateBill = ({ requestUser, req, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        let bodyData = {};
        if (((_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.payload) && typeof req.query.payload === "string") {
            bodyData = JSON.parse(req.query.payload);
        }
        const modifiedOrderItems = yield modifiedProducts(bodyData.products);
        const totalOrderAmount = calculateOrderAmount(modifiedOrderItems);
        const data = {
            products: modifiedOrderItems,
            tax_amount: totalOrderAmount.tax_amount,
            order_amount: totalOrderAmount.order_amount,
            discount_amount: totalOrderAmount.discount_amount,
            billing_amount: totalOrderAmount.billing_amount,
        };
        return data;
    }
    catch (error) {
        throw error;
    }
});
const updateOrder = ({ orderId, requestUser, req, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e;
    try {
        let orderDoc = yield Order.findById(orderId);
        if (!orderDoc) {
            throw new Error("Order Not Found");
        }
        let bodyData = {};
        if (((_c = req === null || req === void 0 ? void 0 : req.query) === null || _c === void 0 ? void 0 : _c.payload) && typeof req.query.payload === "string") {
            bodyData = JSON.parse(req.query.payload);
        }
        const { is_creditable, credit_duration, order_notes, payment_method, reason, status, } = bodyData;
        if (order_notes) {
            orderDoc.order_notes = order_notes;
        }
        if (status === "cancelled") {
            if (orderDoc.status === "cancelled") {
                return orderDoc;
            }
            if (orderDoc.added_by !== requestUser._id) {
                throw new Error("Only User Can Cancle Order");
            }
            if (orderDoc.status === "delivered" ||
                orderDoc.status === "rejected" ||
                orderDoc.status === "return_rejected" ||
                orderDoc.status === "return_fulfilled") {
                throw new Error("Order Can Not Be Cancelled");
            }
            if (orderDoc.status === "confirm" ||
                orderDoc.status === "return_accepeted") {
                try {
                    if (orderDoc.order_type === "buy") {
                        yield Promise.all(orderDoc.products.map((orderProduct) => __awaiter(void 0, void 0, void 0, function* () {
                            yield productService.addProductQuantity({
                                requestUser: req.user,
                                productId: orderProduct.product_id.toString(),
                                quantity: orderProduct.quantity,
                            });
                        })));
                    }
                    else {
                        yield Promise.all(orderDoc.products.map((orderProduct) => __awaiter(void 0, void 0, void 0, function* () {
                            yield productService.removeProductQuantity({
                                requestUser: req.user,
                                productId: orderProduct.product_id.toString(),
                                quantity: orderProduct.quantity,
                            });
                        })));
                    }
                }
                catch (error) {
                    throw error;
                }
            }
            orderDoc.status = status;
            orderDoc.updated_by = requestUser._id;
            orderDoc = yield orderDoc.save();
            return orderDoc;
        }
        if (status === "rejected" || status === "return_rejected") {
            if (status === "return_rejected" &&
                orderDoc.status !== "return_requested") {
                throw new Error("only return reqested order can be rejected");
            }
            if (status === "rejected" && orderDoc.status !== "pending") {
                throw new Error("only pending order can be rejected");
            }
            if (orderDoc.added_by === requestUser._id) {
                throw new Error("Only Admin Can Reject Order");
            }
            if (!reason) {
                throw new Error("Reason Is Required");
            }
            orderDoc.status = status;
            orderDoc.reason = reason;
            orderDoc.updated_by = requestUser._id;
            orderDoc = yield orderDoc.save();
            return orderDoc;
        }
        if (status === "confirm" || status === "return_accepeted") {
            if (status === "confirm" && orderDoc.status !== "pending") {
                throw new Error("only pending order can be confirmed");
            }
            if (status === "return_accepeted" &&
                orderDoc.status !== "return_requested") {
                throw new Error("only retun requested order can be return accepeted");
            }
            if (orderDoc.added_by === requestUser._id) {
                throw new Error("Only Admin Can Confirm Order");
            }
            // check every items is in stock
            if (orderDoc.order_type === "buy") {
                try {
                    yield checkProductsInStock(orderDoc.products);
                }
                catch (error) {
                    throw error;
                }
            }
            // Remove/Add Stock Orderd Quantity
            try {
                if (orderDoc.order_type === "buy") {
                    yield Promise.all(orderDoc.products.map((orderProduct) => __awaiter(void 0, void 0, void 0, function* () {
                        yield productService.removeProductQuantity({
                            requestUser: req.user,
                            productId: orderProduct.product_id.toString(),
                            quantity: orderProduct.quantity,
                        });
                    })));
                }
                else {
                    yield Promise.all(orderDoc.products.map((orderProduct) => __awaiter(void 0, void 0, void 0, function* () {
                        yield productService.addProductQuantity({
                            requestUser: req.user,
                            productId: orderProduct.product_id.toString(),
                            quantity: orderProduct.quantity,
                        });
                    })));
                }
            }
            catch (error) {
                throw error;
            }
            if (is_creditable === true && !credit_duration) {
                throw new Error("Credit Duration is Required");
            }
            orderDoc.status = status;
            orderDoc.is_creditable = is_creditable;
            orderDoc.credit_duration = credit_duration || 0;
            orderDoc.updated_by = requestUser._id;
            orderDoc = yield orderDoc.save();
            return orderDoc;
        }
        if (status === "delivered" || status === "return_fulfilled") {
            if (status === "delivered" && orderDoc.status !== "confirm") {
                throw new Error("only confirm order can be delivered");
            }
            if (status === "return_fulfilled" &&
                orderDoc.status !== "return_accepeted") {
                throw new Error("only return accepeted order can be return fulfilled");
            }
            if (orderDoc.added_by === requestUser._id) {
                throw new Error(`Only Admin Can Update Status : ${status} Order`);
            }
            if (orderDoc.is_creditable) {
                const billDoc = yield billService.addBill({
                    requestUser,
                    order_id: orderId,
                });
                orderDoc.status = status;
                orderDoc.updated_by = requestUser._id;
                orderDoc.bill_id = new mongoose.Types.ObjectId((_d = billDoc === null || billDoc === void 0 ? void 0 : billDoc._id) === null || _d === void 0 ? void 0 : _d.toString());
                orderDoc = yield orderDoc.save();
                return orderDoc;
            }
            else {
                const files = convertFiles(req.files);
                const { payment_details } = files;
                if (!payment_details || !payment_method) {
                    if (!payment_details) {
                        throw new Error("Payment Details Is Required");
                    }
                    throw new Error("Payment Method Is Required");
                }
                orderDoc.status = status;
                orderDoc.updated_by = requestUser._id;
                orderDoc = yield orderDoc.save();
                const billDoc = yield billService.addBill({
                    requestUser,
                    order_id: orderId,
                });
                const paidBill = yield billService.updateBill({
                    billId: billDoc._id.toString(),
                    requestUser,
                    files: req.files,
                    status: "paid",
                    payment_method,
                });
                orderDoc.status = status;
                orderDoc.updated_by = requestUser._id;
                orderDoc.bill_id = new mongoose.Types.ObjectId((_e = paidBill === null || paidBill === void 0 ? void 0 : paidBill._id) === null || _e === void 0 ? void 0 : _e.toString());
                orderDoc = yield orderDoc.save();
                return orderDoc;
            }
        }
        return orderDoc;
    }
    catch (error) {
        throw error;
    }
});
const returnOrder = ({ buy_order_id, requestUser, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sellOrderDoc = yield Order.findById(buy_order_id);
        if (!sellOrderDoc) {
            throw new Error("Order Not Found");
        }
        if (!sellOrderDoc.is_creditable) {
            throw new Error("This Order is Not Returnable");
        }
        const isReturnedOder = yield Order.find({
            order_type: "sell",
            buy_order_id: new mongoose.Types.ObjectId(buy_order_id),
        });
        if (isReturnedOder) {
            throw new Error("This Order is Already Returned");
        }
        const duration = calculateDaysDifference(sellOrderDoc.createdAt, new Date());
        if (duration > sellOrderDoc.credit_duration) {
            throw new Error(`Order Can Be Delivered in ${sellOrderDoc.credit_duration} Days`);
        }
        const order = new Order({
            order_type: "sell",
            status: "return_requested",
            user_id: sellOrderDoc.user_id,
            added_by: requestUser._id,
            updated_by: requestUser._id,
            products: sellOrderDoc.products,
            tax_amount: sellOrderDoc.tax_amount,
            order_amount: sellOrderDoc.order_amount,
            discount_amount: sellOrderDoc.discount_amount,
            billing_amount: sellOrderDoc.billing_amount,
            buy_order_id: new mongoose.Types.ObjectId(buy_order_id),
        });
        const orderDoc = yield order.save();
        return orderDoc;
    }
    catch (error) {
        throw error;
    }
});
const deleteOrder = ({ orderId }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        throw new Error("Order Can Not Be Deleted");
        yield Order.findByIdAndDelete(orderId);
    }
    catch (error) {
        throw error;
    }
});
export const orderService = {
    getOrder,
    addOrder,
    getOrderList,
    updateOrder,
    deleteOrder,
    returnOrder,
    getCustomerOrderList,
    calculateBill,
};
//# sourceMappingURL=orders.service.js.map