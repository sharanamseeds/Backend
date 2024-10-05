import {
  catchAsync,
  createResponseObject,
} from "../helpers/request.helpers.js";
import httpStatus from "http-status";
import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import ExcelJS from "exceljs";
import PurchaseOrder from "../models/purchase_orders.model.js";
import { purchaseOrderService } from "../services/purchse_order.service.js";

const getPurchaseOrder = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const purchaseOrderDoc = await purchaseOrderService.getPurchaseOrder({
      purchaseOrderId: req.params.id,
      query: req.query,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Purchase Order Fetched Successfully!!",
      payload: { result: purchaseOrderDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const getPurchaseOrderList = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const purchaseOrderDoc = await purchaseOrderService.getPurchaseOrderList({
      query: req.query,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Purchase Order List Fetched Successfully!!",
      payload: { result: purchaseOrderDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const updatePurchaseOrder = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const purchaseOrderDoc = await purchaseOrderService.updatePurchaseOrder({
      purchaseOrderId: req.params.id,
      req: req,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Purchase Order Updated Successfully!!",
      payload: { result: purchaseOrderDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const addPurchaseOrder = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const purchaseOrderDoc = await purchaseOrderService.addPurchaseOrder({
      req: req,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Purchase Order Added Successfully!!",
      payload: { result: purchaseOrderDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const deletePurchaseOrder = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const purchaseOrderDoc = await purchaseOrderService.deletePurchaseOrder({
      purchaseOrderId: req.params.id,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Purchase Order Deleted Successfully!!",
      payload: { result: purchaseOrderDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const downloadPdf = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    await purchaseOrderService.downloadPdf({
      purchaseOrderId: req.params.id,
      res,
    });
  }
);

const downloadExcel = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const purchaseOrders = await PurchaseOrder.find();

      // Create a new Excel workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Purchase Orders");
      worksheet.columns = [
        { header: "_id", key: "_id", width: 30 },
        { header: "Vendor ID", key: "vendor_id", width: 30 },
        { header: "Invoice No", key: "invoice_no", width: 30 },
        { header: "Purchase Date", key: "purchase_date", width: 30 },
        { header: "Contact Name", key: "contact_name", width: 30 },
        { header: "Contact Number", key: "contact_number", width: 30 },

        { header: "Product Ids", key: "productIds", width: 30 },
        { header: "Quantities", key: "quantities", width: 30 },

        { header: "Total Amount", key: "total_amount", width: 30 },
        { header: "Billing Amount", key: "billing_amount", width: 30 },
        { header: "Status", key: "status", width: 20 },
        { header: "Payment Status", key: "payment_status", width: 20 },
        { header: "Created At", key: "createdAt", width: 30 },
        { header: "Updated At", key: "updatedAt", width: 30 },
      ];

      // Add rows to the worksheet
      purchaseOrders.forEach((order) => {
        const productIds = order.products
          .map((p) => p.product_id.toString())
          .join(", ");
        const quantities = order.products.map((p) => p.quantity).join(", ");

        worksheet.addRow({
          _id: order?._id?.toString(),
          vendor_id: order.vendor_id?.toString(),
          productIds,
          quantities,
          invoice_no: order?.invoice_no,
          contact_name: order?.contact_name,
          contact_number: order?.contact_number,
          purchase_date: order?.purchase_date?.toISOString() || "",
          status: order?.status,
          payment_status: order?.payment_status,
          createdAt: order?.createdAt?.toISOString() || "",
          updatedAt: order?.updatedAt?.toISOString() || "",
        });
      });

      // Set the response headers and content type for the Excel file
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=purchase_orders.xlsx"
      );

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

export const purchaseOrderController = {
  getPurchaseOrder,
  addPurchaseOrder,
  getPurchaseOrderList,
  updatePurchaseOrder,
  deletePurchaseOrder,
  downloadExcel,
  downloadPdf,
};
