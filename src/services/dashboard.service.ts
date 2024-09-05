import User from "../models/users.model.js";
import Order from "../models/orders.model.js";
import Product from "../models/products.model.js";
import Bill from "../models/bill.model.js";
import Brand from "../models/brands.model.js";
import Category from "../models/categories.model.js";
import Offer from "../models/offers.models.js";
import Languages from "../models/languages.model.js";

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

    if (start_date && end_date) {
      filterQuery.createdAt = {
        $gte: new Date(start_date),
        $lte: new Date(end_date),
      };
    }
    // Total Users
    const totalUsers = await User.countDocuments(filterQuery);

    // Role Wise Users
    const roleWiseUsers = await User.aggregate([
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
    const statusMetrics = await User.aggregate([
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
    const totalOrders = await Order.countDocuments(filterQuery);
    const totalLanguages = await Languages.countDocuments({});
    // Pending, Confirmed Orders
    const orderStatusMetrics = await Order.aggregate([
      { $match: filterQuery },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const pendingOrders =
      orderStatusMetrics.find((item) => item._id === "pending")?.count || 0;
    const confirmedOrders =
      orderStatusMetrics.find((item) => item._id === "confirm")?.count || 0;

    // Return Ratio, Delivered, Canceled Ratio
    const returnMetrics = await Order.aggregate([
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
    const averageOrderAmount = await Order.aggregate([
      { $match: filterQuery },
      {
        $group: {
          _id: null,
          avgAmount: { $avg: "$order_amount" },
        },
      },
    ]);

    // Find the earliest order date
    const firstOrder = await Order.findOne().sort({ createdAt: 1 });

    const earliestDate = firstOrder?.createdAt || new Date(); // Default to now if no orders found

    // Calculate the date difference in days
    const dateDifference = Math.ceil(
      (new Date(end_date || Date.now()).getTime() -
        new Date(start_date || earliestDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const avgOrdersPerDay = totalOrders / (dateDifference || 1);

    const orderData = {
      totalOrders,
      pendingOrders,
      confirmedOrders,
      returnMetrics: returnMetrics[0], // Assuming only one group due to null _id
      averageOrderAmount: averageOrderAmount[0]?.avgAmount || 0,
      avgOrdersPerDay,
    };

    // Total Products
    const totalProducts = await Product.countDocuments(filterQuery);

    // In-Stock and Out-of-Stock Ratio
    const stockMetrics = await Product.aggregate([
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
    const productSalesMetrics = await Product.aggregate([
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
      stockMetrics: stockMetrics[0], // Assuming only one group due to null _id
      productSalesMetrics: productSalesMetrics[0], // Assuming only one group due to null _id
    };

    // Total Bills
    const totalBills = await Bill.countDocuments(filterQuery);

    // Cash Bill and Online Bill Ratio
    const paymentMethodMetrics = await Bill.aggregate([
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
    const paymentStatusMetrics = await Bill.aggregate([
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
    const totalBrands = await Brand.countDocuments();

    // Total Categories
    const totalCategories = await Category.countDocuments();

    // Total Offers
    const totalOffers = await Offer.countDocuments();

    // Active Offers
    const activeOffers = await Offer.countDocuments({ is_active: true });

    // Inactive Offers
    const inactiveOffers = await Offer.countDocuments({ is_active: false });

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
  } catch (error) {
    throw error;
  }
};

export const dashboardService = {
  getDashboard,
};
