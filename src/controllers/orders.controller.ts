import {
  catchAsync,
  createResponseObject,
} from "../helpers/request.helpers.js";
import httpStatus from "http-status";
import { orderService } from "../services/orders.service.js";
import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import ExcelJS from "exceljs";
import Order from "../models/orders.model.js";

const getOrder = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const orderDoc = await orderService.getOrder({
      orderId: req.params.id,
      query: req.query,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Order Fetched Successfully!!",
      payload: { result: orderDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const getOrderList = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const orderDoc = await orderService.getOrderList({
      query: req.query,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Order List Fetched Successfully!!",
      payload: { result: orderDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const getCustomerOrderList = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const orderDoc = await orderService.getCustomerOrderList({
      query: req.query,
      requestUser: req.user,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Order List Fetched Successfully!!",
      payload: { result: orderDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const updateOrder = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const orderDoc = await orderService.updateOrder({
      orderId: req.params.id,
      requestUser: req.user,
      req: req,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Order Updated Successfully!!",
      payload: { result: orderDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const addOrder = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const orderDoc = await orderService.addOrder({
      requestUser: req.user,
      req: req,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Order Added Successfully!!",
      payload: { result: orderDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const calculateBill = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const orderDoc = await orderService.calculateBill({
      requestUser: req.user,
      req: req,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Order Price Fetched Successfully!!",
      payload: { result: orderDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const returnOrder = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const orderDoc = await orderService.returnOrder({
      buy_order_id: req.params.id,
      requestUser: req.user,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Order Added Successfully!!",
      payload: { result: orderDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const deleteOrder = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const orderDoc = await orderService.deleteOrder({
      orderId: req.params.id,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Order Deleted Successfully!!",
      payload: { result: orderDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const downloadExcel = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Fetch orders from the database
      const orders = await Order.find();
      // .populate("user_id").populate("products.product_id").populate("products.offer_id");

      // Create a new Excel workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Orders");

      // Define the columns for the worksheet based on the typeOrder fields
      worksheet.columns = [
        { header: "User ID", key: "user_id", width: 30 },
        { header: "Order Type", key: "order_type", width: 10 },
        { header: "Product IDs", key: "product_ids", width: 40 },
        { header: "Offer IDs", key: "offer_ids", width: 40 },
        { header: "Quantities", key: "quantities", width: 20 },
        { header: "Total Amounts", key: "total_amounts", width: 20 },
        { header: "Offer Discounts", key: "offer_discounts", width: 20 },
        { header: "GST Rates", key: "gst_rates", width: 10 },
        { header: "Purchase Prices", key: "purchase_prices", width: 20 },
        { header: "Order Amount", key: "order_amount", width: 20 },
        { header: "Discount Amount", key: "discount_amount", width: 20 },
        { header: "Billing Amount", key: "billing_amount", width: 20 },
        { header: "Status", key: "status", width: 20 },
        { header: "Is Creditable", key: "is_creditable", width: 15 },
        { header: "Credit Duration", key: "credit_duration", width: 15 },
        { header: "Order Notes", key: "order_notes", width: 30 },
        { header: "Is Returned", key: "is_retuned", width: 30 },
        { header: "Reason", key: "reason", width: 30 },
        { header: "Created At", key: "createdAt", width: 25 },
        { header: "Updated At", key: "updatedAt", width: 25 },
      ];

      // Add rows to the worksheet
      orders.forEach((order) => {
        const productIds = order.products
          .map((p) => p.product_id.toString())
          .join(", ");
        const offerIds = order.products
          .map((p) => p.offer_id?.toString() || "N/A")
          .join(", ");
        const quantities = order.products.map((p) => p.quantity).join(", ");
        const totalAmounts = order.products
          .map((p) => p.total_amount)
          .join(", ");
        const offerDiscounts = order.products
          .map((p) => p.offer_discount)
          .join(", ");
        const gstRates = order.products.map((p) => p.gst_rate).join(", ");
        const purchasePrices = order.products
          .map((p) => p.purchase_price)
          .join(", ");

        worksheet.addRow({
          user_id: order.user_id.toString(),
          order_type: order.order_type,
          product_ids: productIds,
          offer_ids: offerIds,
          quantities: quantities,
          total_amounts: totalAmounts,
          offer_discounts: offerDiscounts,
          gst_rates: gstRates,
          purchase_prices: purchasePrices,
          order_amount: order.order_amount,
          discount_amount: order.discount_amount,
          billing_amount: order.billing_amount,
          status: order.status,
          is_creditable: order.is_creditable,
          credit_duration: order.credit_duration,
          order_notes: order.order_notes,
          is_retuned: order.is_retuned,
          reason: order.reason,
          createdAt: order.createdAt?.toISOString(),
          updatedAt: order.updatedAt?.toISOString(),
        });
      });

      // Set the response headers and content type for the Excel file
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", "attachment; filename=orders.xlsx");

      // Write the Excel file to the response
      await workbook.xlsx.write(res);

      // End the response
      res.end();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const orderController = {
  getOrder,
  addOrder,
  getOrderList,
  updateOrder,
  deleteOrder,
  getCustomerOrderList,
  returnOrder,
  calculateBill,
  downloadExcel,
};
