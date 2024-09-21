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
import Ledger from "../models/ledger.model.js";
const getDashboard = ({ query, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let { start_date, end_date } = query;
        let filterQuery = {};
        if (start_date || end_date) {
            if (start_date && end_date) {
                filterQuery.createdAt = {
                    $gte: new Date(start_date),
                    $lte: new Date(end_date),
                };
            }
            else {
                if (end_date) {
                    filterQuery.createdAt = {
                        $lte: new Date(end_date),
                    };
                }
                else {
                    filterQuery.createdAt = {
                        $gte: new Date(start_date),
                    };
                }
            }
        }
        let newData = {
            languages: 0,
            brands: 0,
            categories: 0,
            ledgers: 0,
            users: {
                total: 0,
                appUsers: 0,
                adminUsers: 0,
                blockedUsers: 0,
                activeUsers: 0,
                verifiedUsers: 0,
                unverifiedUsers: 0,
            },
            products: {
                total: 0,
                inStockProducts: 0,
                outOfStockProducts: 0,
                verifiedProducts: 0,
                featuredProducts: 0,
            },
            offers: {
                total: 0,
                activeOffers: 0,
                productSpecifiedOffers: 0,
                categorySpecifiedOffers: 0,
            },
            bills: {
                total: 0,
                paidBills: 0,
                unPaidBills: 0,
            },
            orders: {
                total: 0,
                averageOrderCount: 0,
                averageOrderAmount: 0,
                confirmedOrderCount: 0,
                rejectedOrderCount: 0,
                pendingOrderCount: 0,
                deliveredOrderCount: 0,
                cancelledOrderCount: 0,
                returnRequestedOrderCount: 0,
                returnAcceptedOrderCount: 0,
                returnRejectedOrderCount: 0,
                returnFulfilledOrderCount: 0,
            },
        };
        newData.users.total = yield User.countDocuments(filterQuery);
        newData.users.appUsers = yield User.countDocuments(Object.assign(Object.assign({}, filterQuery), { is_app_user: true }));
        newData.users.blockedUsers = yield User.countDocuments(Object.assign(Object.assign({}, filterQuery), { is_blocked: true }));
        newData.users.verifiedUsers = yield User.countDocuments(Object.assign(Object.assign({}, filterQuery), { is_verified: true }));
        newData.users.unverifiedUsers = yield User.countDocuments(Object.assign(Object.assign({}, filterQuery), { is_verified: false }));
        newData.users.activeUsers = yield User.countDocuments(Object.assign(Object.assign({}, filterQuery), { is_blocked: false }));
        newData.users.adminUsers = yield User.countDocuments(Object.assign(Object.assign({}, filterQuery), { is_app_user: false }));
        newData.languages = yield Languages.countDocuments(filterQuery);
        newData.brands = yield Brand.countDocuments(filterQuery);
        newData.categories = yield Category.countDocuments(filterQuery);
        newData.ledgers = yield Ledger.countDocuments(filterQuery);
        newData.products.total = yield Product.countDocuments(filterQuery);
        newData.products.inStockProducts = yield Product.countDocuments(Object.assign(Object.assign({}, filterQuery), { in_stock: true }));
        newData.products.outOfStockProducts = yield Product.countDocuments(Object.assign(Object.assign({}, filterQuery), { in_stock: false }));
        newData.products.verifiedProducts = yield Product.countDocuments(Object.assign(Object.assign({}, filterQuery), { is_verified: true }));
        newData.products.featuredProducts = yield Product.countDocuments(Object.assign(Object.assign({}, filterQuery), { is_featured: true }));
        newData.offers.total = yield Offer.countDocuments(filterQuery);
        newData.offers.activeOffers = yield Offer.countDocuments(Object.assign(Object.assign({}, filterQuery), { is_active: true }));
        newData.offers.productSpecifiedOffers = yield Offer.countDocuments(Object.assign(Object.assign({}, filterQuery), { product_specified: true }));
        newData.offers.categorySpecifiedOffers = yield Offer.countDocuments(Object.assign(Object.assign({}, filterQuery), { category_specified: true }));
        newData.bills.total = yield Bill.countDocuments(filterQuery);
        newData.bills.paidBills = yield Bill.countDocuments(Object.assign(Object.assign({}, filterQuery), { payment_status: "paid" }));
        newData.bills.unPaidBills = yield Bill.countDocuments(Object.assign(Object.assign({}, filterQuery), { payment_status: "unpaid" }));
        newData.orders.total = yield Order.countDocuments(filterQuery);
        const averageOrdersPerDay = yield Order.aggregate([
            { $match: filterQuery },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 },
                },
            },
            { $group: { _id: null, averageOrdersPerDay: { $avg: "$count" } } },
        ]);
        newData.orders.averageOrderCount =
            ((_a = averageOrdersPerDay[0]) === null || _a === void 0 ? void 0 : _a.averageOrdersPerDay) || 0;
        const averageOrderAmount = yield Order.aggregate([
            { $match: filterQuery },
            {
                $group: {
                    _id: null,
                    avgAmount: { $avg: "$order_amount" },
                },
            },
        ]);
        newData.orders.averageOrderAmount = ((_b = averageOrderAmount[0]) === null || _b === void 0 ? void 0 : _b.avgAmount) || 0;
        newData.orders.confirmedOrderCount = yield Order.countDocuments(Object.assign(Object.assign({}, filterQuery), { status: "confirm" }));
        newData.orders.rejectedOrderCount = yield Order.countDocuments(Object.assign(Object.assign({}, filterQuery), { status: "rejected" }));
        newData.orders.pendingOrderCount = yield Order.countDocuments(Object.assign(Object.assign({}, filterQuery), { status: "pending" }));
        newData.orders.deliveredOrderCount = yield Order.countDocuments(Object.assign(Object.assign({}, filterQuery), { status: "delivered" }));
        newData.orders.cancelledOrderCount = yield Order.countDocuments(Object.assign(Object.assign({}, filterQuery), { status: "cancelled" }));
        newData.orders.returnRequestedOrderCount = yield Order.countDocuments(Object.assign(Object.assign({}, filterQuery), { status: "return_requested" }));
        newData.orders.returnAcceptedOrderCount = yield Order.countDocuments(Object.assign(Object.assign({}, filterQuery), { status: "return_accepeted" }));
        newData.orders.returnRejectedOrderCount = yield Order.countDocuments(Object.assign(Object.assign({}, filterQuery), { status: "return_rejected" }));
        newData.orders.returnFulfilledOrderCount = yield Order.countDocuments(Object.assign(Object.assign({}, filterQuery), { status: "return_fulfilled" }));
        return { data: newData };
    }
    catch (error) {
        throw error;
    }
});
export const dashboardService = {
    getDashboard,
};
//# sourceMappingURL=dashboard.service.js.map