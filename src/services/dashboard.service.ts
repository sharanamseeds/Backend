import User from "../models/users.model.js";
import Order from "../models/orders.model.js";
import Product from "../models/products.model.js";
import Bill from "../models/bill.model.js";
import Brand from "../models/brands.model.js";
import Category from "../models/categories.model.js";
import Offer from "../models/offers.models.js";
import Languages from "../models/languages.model.js";
import Ledger from "../models/ledger.model.js";
import PurchaseOrder from "../models/purchase_orders.model.js";
import { masterConfig } from "../config/master.config.js";
import mongoose from "mongoose";

const getDashboard = async ({
  query,
}: {
  query?: any;
}): Promise<{
  data: any;
}> => {
  try {
    let { start_date, end_date } = query;

    let filterQuery: any = {};

    if (start_date || end_date) {
      if (start_date && end_date) {
        filterQuery.createdAt = {
          $gte: new Date(start_date),
          $lte: new Date(end_date),
        };
      } else {
        if (end_date) {
          filterQuery.createdAt = {
            $lte: new Date(end_date),
          };
        } else {
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
      accounts: {
        paid: {
          purchaseAmount: 0,
          sellAmount: 0,
        },
        outstandings: {
          purchaseAmount: 0,
          sellAmount: 0,
        },
        on_hand: 0,
        ledger: {
          totalCredit: 0,
          totalDebit: 0,
          finalBalance: 0,
        },
      },
    };

    newData.users.total = await User.countDocuments(filterQuery);
    newData.users.appUsers = await User.countDocuments({
      ...filterQuery,
      is_app_user: true,
    });
    newData.users.blockedUsers = await User.countDocuments({
      ...filterQuery,
      is_blocked: true,
    });
    newData.users.verifiedUsers = await User.countDocuments({
      ...filterQuery,
      is_verified: true,
    });
    newData.users.unverifiedUsers = await User.countDocuments({
      ...filterQuery,
      is_verified: false,
    });
    newData.users.activeUsers = await User.countDocuments({
      ...filterQuery,
      is_blocked: false,
    });
    newData.users.adminUsers = await User.countDocuments({
      ...filterQuery,
      is_app_user: false,
    });

    newData.languages = await Languages.countDocuments(filterQuery);
    newData.brands = await Brand.countDocuments(filterQuery);
    newData.categories = await Category.countDocuments(filterQuery);
    newData.ledgers = await Ledger.countDocuments(filterQuery);

    newData.products.total = await Product.countDocuments(filterQuery);
    newData.products.inStockProducts = await Product.countDocuments({
      ...filterQuery,
      in_stock: true,
    });
    newData.products.outOfStockProducts = await Product.countDocuments({
      ...filterQuery,
      in_stock: false,
    });
    newData.products.verifiedProducts = await Product.countDocuments({
      ...filterQuery,
      is_verified: true,
    });
    newData.products.featuredProducts = await Product.countDocuments({
      ...filterQuery,
      is_featured: true,
    });

    newData.offers.total = await Offer.countDocuments(filterQuery);
    newData.offers.activeOffers = await Offer.countDocuments({
      ...filterQuery,
      is_active: true,
    });
    newData.offers.productSpecifiedOffers = await Offer.countDocuments({
      ...filterQuery,
      product_specified: true,
    });
    newData.offers.categorySpecifiedOffers = await Offer.countDocuments({
      ...filterQuery,
      category_specified: true,
    });

    newData.bills.total = await Bill.countDocuments(filterQuery);
    newData.bills.paidBills = await Bill.countDocuments({
      ...filterQuery,
      payment_status: "paid",
    });
    newData.bills.unPaidBills = await Bill.countDocuments({
      ...filterQuery,
      payment_status: "unpaid",
    });

    newData.orders.total = await Order.countDocuments(filterQuery);
    const averageOrdersPerDay = await Order.aggregate([
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
      averageOrdersPerDay[0]?.averageOrdersPerDay || 0;
    const averageOrderAmount = await Order.aggregate([
      { $match: filterQuery },
      {
        $group: {
          _id: null,
          avgAmount: { $avg: "$order_amount" },
        },
      },
    ]);
    newData.orders.averageOrderAmount =
      averageOrderAmount[0]?.avgAmount?.toFixed(2) || 0;

    newData.orders.confirmedOrderCount = await Order.countDocuments({
      ...filterQuery,
      status: "confirm",
    });
    newData.orders.rejectedOrderCount = await Order.countDocuments({
      ...filterQuery,
      status: "rejected",
    });
    newData.orders.pendingOrderCount = await Order.countDocuments({
      ...filterQuery,
      status: "pending",
    });
    newData.orders.deliveredOrderCount = await Order.countDocuments({
      ...filterQuery,
      status: "delivered",
    });
    newData.orders.cancelledOrderCount = await Order.countDocuments({
      ...filterQuery,
      status: "cancelled",
    });
    newData.orders.returnRequestedOrderCount = await Order.countDocuments({
      ...filterQuery,
      status: "return_requested",
    });
    newData.orders.returnAcceptedOrderCount = await Order.countDocuments({
      ...filterQuery,
      status: "return_accepeted",
    });
    newData.orders.returnRejectedOrderCount = await Order.countDocuments({
      ...filterQuery,
      status: "return_rejected",
    });
    newData.orders.returnFulfilledOrderCount = await Order.countDocuments({
      ...filterQuery,
      status: "return_fulfilled",
    });

    const billResult = await Bill.aggregate([
      {
        $match: { ...filterQuery },
      },
      {
        $group: {
          _id: "$payment_status",
          totalAmount: { $sum: "$bill_amount" },
        },
      },
    ]);

    const billTotals = billResult.reduce(
      (acc, curr) => {
        if (curr._id === "paid") {
          acc.paid = curr.totalAmount;
        } else if (curr._id === "unpaid") {
          acc.unpaid = curr.totalAmount;
        }
        return acc;
      },
      { paid: 0, unpaid: 0 }
    );

    const poResult = await PurchaseOrder.aggregate([
      {
        $match: { ...filterQuery },
      },
      {
        $group: {
          _id: "$payment_status",
          totalBillingAmount: { $sum: "$advance_payment_amount" },
        },
      },
    ]);

    const poTotals = poResult.reduce(
      (acc, curr) => {
        if (curr._id === "paid") {
          acc.paid = curr.totalBillingAmount;
        } else if (curr._id === "unpaid") {
          acc.unpaid = curr.totalBillingAmount;
        }
        return acc;
      },
      { paid: 0, unpaid: 0 }
    );

    const adminDoc = await User.findOne({
      email: masterConfig.superAdminConfig.email,
      is_app_user: false,
    });
    const ledgerStatic = await Ledger.aggregate([
      {
        $match: { user_id: adminDoc._id },
      },
      {
        $group: {
          _id: null,
          totalCredit: {
            $sum: {
              $cond: [{ $eq: ["$type", "credit"] }, "$payment_amount", 0],
            },
          },
          totalDebit: {
            $sum: {
              $cond: [{ $eq: ["$type", "debit"] }, "$payment_amount", 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalCredit: 1,
          totalDebit: 1,
          finalBalance: { $subtract: ["$totalCredit", "$totalDebit"] },
        },
      },
    ]);

    if (ledgerStatic.length > 0) {
      const ledgerData = ledgerStatic[0];

      if ("totalCredit" in ledgerData) {
        newData.accounts.ledger.totalCredit = ledgerData.totalCredit;
      }
      if ("totalDebit" in ledgerData) {
        newData.accounts.ledger.totalDebit = ledgerData.totalDebit;
      }
      if ("finalBalance" in ledgerData) {
        newData.accounts.ledger.finalBalance = ledgerData.finalBalance;
      }
    }

    newData.accounts.paid.sellAmount = billTotals.paid;
    newData.accounts.outstandings.sellAmount = billTotals.unpaid;
    newData.accounts.paid.purchaseAmount = poTotals.paid;
    newData.accounts.outstandings.purchaseAmount = poTotals.unpaid;
    newData.accounts.on_hand =
      billTotals.paid - poTotals.paid - poTotals.unpaid;

    return { data: newData };
  } catch (error) {
    throw error;
  }
};

export const dashboardService = {
  getDashboard,
};
