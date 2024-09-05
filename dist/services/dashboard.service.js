var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from "../models/users.model.js";
import Order from "../models/orders.model.js";
import Product from "../models/products.model.js";
import Bill from "../models/bill.model.js";
import Brand from "../models/brands.model.js";
import Category from "../models/categories.model.js";
import Offer from "../models/offers.models.js";
import Languages from "../models/languages.model.js";
const getDashboard = ({ query, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        let { start_date, end_date } = query;
        let filterQuery = {};
        if (start_date && end_date) {
            filterQuery.createdAt = {
                $gte: new Date(start_date),
                $lte: new Date(end_date),
            };
        }
        // Total Users
        const totalUsers = yield User.countDocuments(filterQuery);
        // Role Wise Users
        const roleWiseUsers = yield User.aggregate([
            { $match: filterQuery },
            { $group: { _id: "$role_id", count: { $sum: 1 } } },
            {
                $lookup: {
                    from: "roles",
                    localField: "_id",
                    foreignField: "_id",
                    as: "role",
                },
            },
            { $unwind: "$role" },
            { $project: { roleName: "$role.name", count: 1 } },
        ]);
        // Active, Blocked, Verified And Deactive Ratio
        const statusMetrics = yield User.aggregate([
            { $match: filterQuery },
            {
                $group: {
                    _id: null,
                    activeCount: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ["$is_verified", true] },
                                        { $eq: ["$is_blocked", false] },
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },
                    blockedCount: {
                        $sum: { $cond: [{ $eq: ["$is_blocked", true] }, 1, 0] },
                    },
                    verifiedCount: {
                        $sum: { $cond: [{ $eq: ["$is_verified", true] }, 1, 0] },
                    },
                    deactiveCount: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ["$is_verified", false] },
                                        { $eq: ["$is_blocked", false] },
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },
                },
            },
            {
                $project: {
                    activeRatio: { $divide: ["$activeCount", totalUsers] },
                    blockedRatio: { $divide: ["$blockedCount", totalUsers] },
                    verifiedRatio: { $divide: ["$verifiedCount", totalUsers] },
                    deactiveRatio: { $divide: ["$deactiveCount", totalUsers] },
                },
            },
        ]);
        const userData = {
            totalUsers,
            roleWiseUsers,
            statusMetrics: statusMetrics[0], // Assuming only one group due to null _id
        };
        // Order Metrics
        const totalOrders = yield Order.countDocuments(filterQuery);
        const totalLanguages = yield Languages.countDocuments({});
        // Pending, Confirmed Orders
        const orderStatusMetrics = yield Order.aggregate([
            { $match: filterQuery },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);
        const pendingOrders = ((_a = orderStatusMetrics.find((item) => item._id === "pending")) === null || _a === void 0 ? void 0 : _a.count) || 0;
        const confirmedOrders = ((_b = orderStatusMetrics.find((item) => item._id === "confirm")) === null || _b === void 0 ? void 0 : _b.count) || 0;
        // Return Ratio, Delivered, Canceled Ratio
        const returnMetrics = yield Order.aggregate([
            { $match: filterQuery },
            {
                $group: {
                    _id: null,
                    returnCount: {
                        $sum: {
                            $cond: [
                                {
                                    $or: [
                                        { $eq: ["$status", "return_requested"] },
                                        { $eq: ["$status", "return_accepeted"] },
                                        { $eq: ["$status", "return_fulfilled"] },
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },
                    deliveredCount: {
                        $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] },
                    },
                    canceledCount: {
                        $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
                    },
                },
            },
            {
                $project: {
                    returnRatio: { $divide: ["$returnCount", totalOrders] },
                    deliveredRatio: { $divide: ["$deliveredCount", totalOrders] },
                    canceledRatio: { $divide: ["$canceledCount", totalOrders] },
                },
            },
        ]);
        // Average Order Amount
        const averageOrderAmount = yield Order.aggregate([
            { $match: filterQuery },
            {
                $group: {
                    _id: null,
                    avgAmount: { $avg: "$order_amount" },
                },
            },
        ]);
        // Find the earliest order date
        const firstOrder = yield Order.findOne().sort({ createdAt: 1 });
        const earliestDate = (firstOrder === null || firstOrder === void 0 ? void 0 : firstOrder.createdAt) || new Date(); // Default to now if no orders found
        // Calculate the date difference in days
        const dateDifference = Math.ceil((new Date(end_date || Date.now()).getTime() -
            new Date(start_date || earliestDate).getTime()) /
            (1000 * 60 * 60 * 24));
        const avgOrdersPerDay = totalOrders / (dateDifference || 1);
        const orderData = {
            totalOrders,
            pendingOrders,
            confirmedOrders,
            returnMetrics: returnMetrics[0],
            averageOrderAmount: ((_c = averageOrderAmount[0]) === null || _c === void 0 ? void 0 : _c.avgAmount) || 0,
            avgOrdersPerDay,
        };
        // Total Products
        const totalProducts = yield Product.countDocuments(filterQuery);
        // In-Stock and Out-of-Stock Ratio
        const stockMetrics = yield Product.aggregate([
            { $match: filterQuery },
            {
                $group: {
                    _id: null,
                    inStockCount: {
                        $sum: { $cond: [{ $eq: ["$in_stock", true] }, 1, 0] },
                    },
                    outStockCount: {
                        $sum: { $cond: [{ $eq: ["$in_stock", false] }, 1, 0] },
                    },
                },
            },
            {
                $project: {
                    inStockRatio: { $divide: ["$inStockCount", totalProducts] },
                    outStockRatio: { $divide: ["$outStockCount", totalProducts] },
                },
            },
        ]);
        // Most Sold and Least Sold Products
        const productSalesMetrics = yield Product.aggregate([
            { $match: filterQuery },
            {
                $lookup: {
                    from: "orders",
                    localField: "_id",
                    foreignField: "products.product_id",
                    as: "orderDetails",
                },
            },
            {
                $addFields: {
                    totalSales: { $sum: "$orderDetails.products.quantity" },
                },
            },
            {
                $sort: { totalSales: -1 },
            },
            {
                $group: {
                    _id: null,
                    mostSold: { $first: "$$ROOT" },
                    leastSold: { $last: "$$ROOT" },
                },
            },
            {
                $project: {
                    mostSoldProduct: {
                        product_name: "$mostSold.product_name",
                        totalSales: "$mostSold.totalSales",
                    },
                    leastSoldProduct: {
                        product_name: "$leastSold.product_name",
                        totalSales: "$leastSold.totalSales",
                    },
                },
            },
        ]);
        const productData = {
            totalProducts,
            stockMetrics: stockMetrics[0],
            productSalesMetrics: productSalesMetrics[0], // Assuming only one group due to null _id
        };
        // Total Bills
        const totalBills = yield Bill.countDocuments(filterQuery);
        // Cash Bill and Online Bill Ratio
        const paymentMethodMetrics = yield Bill.aggregate([
            { $match: filterQuery },
            {
                $group: {
                    _id: "$payment_method",
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    method: "$_id",
                    ratio: { $divide: ["$count", totalBills] },
                    _id: 0,
                },
            },
        ]);
        // Unpaid, Fully Paid, Partially Paid
        const paymentStatusMetrics = yield Bill.aggregate([
            { $match: filterQuery },
            {
                $group: {
                    _id: "$payment_status",
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    status: "$_id",
                    ratio: { $divide: ["$count", totalBills] },
                    _id: 0,
                },
            },
        ]);
        const billData = {
            totalBills,
            paymentMethodMetrics,
            paymentStatusMetrics,
        };
        // Total Brands
        const totalBrands = yield Brand.countDocuments();
        // Total Categories
        const totalCategories = yield Category.countDocuments();
        // Total Offers
        const totalOffers = yield Offer.countDocuments();
        // Active Offers
        const activeOffers = yield Offer.countDocuments({ is_active: true });
        // Inactive Offers
        const inactiveOffers = yield Offer.countDocuments({ is_active: false });
        const offerData = { totalOffers, activeOffers, inactiveOffers };
        const data = {
            totalLanguages,
            brands: totalBrands,
            category: totalCategories,
            bill: billData,
            offer: offerData,
            user: userData,
            order: orderData,
            product: productData,
        };
        return { data };
    }
    catch (error) {
        throw error;
    }
});
export const dashboardService = {
    getDashboard,
};
//# sourceMappingURL=dashboard.service.js.map