var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { catchAsync, createResponseObject, } from "../helpers/request.helpers.js";
import httpStatus from "http-status";
import ExcelJS from "exceljs";
import PurchaseOrder from "../models/purchase_orders.model.js";
import { purchaseOrderService } from "../services/purchse_order.service.js";
const getPurchaseOrder = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const purchaseOrderDoc = yield purchaseOrderService.getPurchaseOrder({
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
}));
const getPurchaseOrderList = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const purchaseOrderDoc = yield purchaseOrderService.getPurchaseOrderList({
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
}));
const updatePurchaseOrder = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const purchaseOrderDoc = yield purchaseOrderService.updatePurchaseOrder({
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
}));
const addPurchaseOrder = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const purchaseOrderDoc = yield purchaseOrderService.addPurchaseOrder({
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
}));
const deletePurchaseOrder = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const purchaseOrderDoc = yield purchaseOrderService.deletePurchaseOrder({
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
}));
const downloadPdf = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield purchaseOrderService.downloadPdf({
        purchaseOrderId: req.params.id,
        res,
    });
}));
const downloadExcel = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const purchaseOrders = yield PurchaseOrder.find();
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
            var _a, _b, _c, _d, _e;
            const productIds = order.products
                .map((p) => p.product_id.toString())
                .join(", ");
            const quantities = order.products.map((p) => p.quantity).join(", ");
            worksheet.addRow({
                _id: (_a = order === null || order === void 0 ? void 0 : order._id) === null || _a === void 0 ? void 0 : _a.toString(),
                vendor_id: (_b = order.vendor_id) === null || _b === void 0 ? void 0 : _b.toString(),
                productIds,
                quantities,
                invoice_no: order === null || order === void 0 ? void 0 : order.invoice_no,
                contact_name: order === null || order === void 0 ? void 0 : order.contact_name,
                contact_number: order === null || order === void 0 ? void 0 : order.contact_number,
                purchase_date: ((_c = order === null || order === void 0 ? void 0 : order.purchase_date) === null || _c === void 0 ? void 0 : _c.toISOString()) || "",
                status: order === null || order === void 0 ? void 0 : order.status,
                payment_status: order === null || order === void 0 ? void 0 : order.payment_status,
                createdAt: ((_d = order === null || order === void 0 ? void 0 : order.createdAt) === null || _d === void 0 ? void 0 : _d.toISOString()) || "",
                updatedAt: ((_e = order === null || order === void 0 ? void 0 : order.updatedAt) === null || _e === void 0 ? void 0 : _e.toISOString()) || "",
            });
        });
        // Set the response headers and content type for the Excel file
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=purchase_orders.xlsx");
        // Write the Excel file to the response
        yield workbook.xlsx.write(res);
        // End the response
        res.end();
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}));
export const purchaseOrderController = {
    getPurchaseOrder,
    addPurchaseOrder,
    getPurchaseOrderList,
    updatePurchaseOrder,
    deletePurchaseOrder,
    downloadExcel,
    downloadPdf,
};
//# sourceMappingURL=purchse_order.cotroller.js.map