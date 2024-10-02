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
import { escapeRegex } from "../helpers/common.helpers..js";
import PurchaseOrder from "../models/purchase_orders.model.js";
import { convertFiles, createDocument } from "../helpers/files.management.js";
import { masterConfig } from "../config/master.config.js";
import { productService } from "./products.service.js";
import Vendor from "../models/verdors.model.js";
import { generatePurchaseOrderCodeHtml } from "../helpers/mail.helpers.js";
import User from "../models/users.model.js";
import Product from "../models/products.model.js";
const getPurchaseOrder = ({ purchaseOrderId, query, }) => __awaiter(void 0, void 0, void 0, function* () {
    const purchaseOrder = yield PurchaseOrder.findById(purchaseOrderId);
    if (!purchaseOrder) {
        throw new Error("Purchase Order not found");
    }
    return purchaseOrder;
});
const getPurchaseOrderList = ({ query, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { limit, page, pagination = true, sortBy = "createdAt", sortOrder = "asc", invoice_no, status, payment_status, is_creditable, search, } = query;
        // Convert limit and page to numbers
        if (typeof limit === "string") {
            limit = Number(limit);
        }
        if (!limit || isNaN(limit)) {
            limit = 50; // Default limit
        }
        if (typeof page === "string") {
            page = Number(page);
        }
        if (!page || isNaN(page)) {
            page = 1; // Default page
        }
        if (typeof pagination === "string") {
            pagination = pagination === "true";
        }
        let filterQuery = {};
        // Apply filters based on query params
        if (invoice_no) {
            filterQuery.invoice_no = invoice_no;
        }
        if (status) {
            filterQuery.status = status;
        }
        if (payment_status) {
            filterQuery.payment_status = payment_status;
        }
        if (is_creditable) {
            filterQuery.is_creditable = is_creditable;
        }
        // Apply search logic for multiple fields
        if (search) {
            filterQuery.$or = [
                { invoice_no: { $regex: escapeRegex(search), $options: "i" } },
                { payment_status: { $regex: escapeRegex(search), $options: "i" } },
                { status: { $regex: escapeRegex(search), $options: "i" } },
            ];
        }
        const totalDocs = yield PurchaseOrder.countDocuments(filterQuery);
        if (!pagination) {
            const purchaseOrderDoc = yield PurchaseOrder.find(filterQuery).sort({
                [sortBy]: sortOrder === "asc" ? 1 : -1,
                _id: 1,
            }); // Sorting logic
            return {
                data: purchaseOrderDoc,
                meta: {
                    docsFound: totalDocs,
                    docsInResponse: purchaseOrderDoc.length,
                    limit,
                    total_pages: 1,
                    currentPage: 1,
                },
            };
        }
        const purchaseOrderDoc = yield PurchaseOrder.find(filterQuery)
            .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1, _id: 1 }) // Sorting logic
            .skip((page - 1) * limit)
            .limit(limit);
        const total_pages = Math.ceil(totalDocs / limit);
        const meta = {
            docsFound: totalDocs,
            docsInResponse: purchaseOrderDoc.length,
            limit,
            total_pages,
            currentPage: page,
        };
        return { data: purchaseOrderDoc, meta };
    }
    catch (error) {
        throw error;
    }
});
const updatePurchaseOrder = ({ purchaseOrderId, req, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const purchaseOrder = yield PurchaseOrder.findById(purchaseOrderId);
    if (!purchaseOrder) {
        throw new Error("PurchaseOrder not found");
    }
    let bodyData = {};
    if (((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.payload) && typeof req.query.payload === "string") {
        bodyData = JSON.parse(req.query.payload);
    }
    const files = convertFiles(req.files);
    const { purchase_invoice } = files;
    if (Array.isArray(purchase_invoice) && purchase_invoice.length > 0) {
        let data = {
            document: purchase_invoice[0],
            documentType: masterConfig.fileStystem.fileTypes.IMAGE,
            documentPath: masterConfig.fileStystem.folderPaths.PURCHSE_ORDER +
                purchaseOrderId +
                "/" +
                masterConfig.fileStystem.folderPaths.LOGO,
        };
        if (purchaseOrder === null || purchaseOrder === void 0 ? void 0 : purchaseOrder.purchase_invoice) {
            data = Object.assign(Object.assign({}, data), { oldPath: purchaseOrder === null || purchaseOrder === void 0 ? void 0 : purchaseOrder.purchase_invoice });
        }
        const savedFile = yield createDocument(data);
        if (savedFile) {
            bodyData.purchase_invoice = savedFile.path;
        }
    }
    yield PurchaseOrder.findByIdAndUpdate(purchaseOrderId, bodyData);
    const purchaseOrderUpdate = yield PurchaseOrder.findById(purchaseOrderId);
    return purchaseOrderUpdate;
});
const addPurchaseOrder = ({ req }) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    let bodyData = {};
    const purchseOrderId = new mongoose.Types.ObjectId();
    if (((_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.payload) && typeof req.query.payload === "string") {
        bodyData = JSON.parse(req.query.payload);
    }
    const vendor = yield Vendor.findById(bodyData === null || bodyData === void 0 ? void 0 : bodyData.vendor_id);
    if (!vendor) {
        throw new Error("Vendor not found");
    }
    const files = convertFiles(req.files);
    const { purchase_invoice } = files;
    if (Array.isArray(purchase_invoice) && purchase_invoice.length > 0) {
        const savedFile = yield createDocument({
            document: purchase_invoice[0],
            documentType: masterConfig.fileStystem.fileTypes.IMAGE,
            documentPath: masterConfig.fileStystem.folderPaths.PURCHSE_ORDER +
                purchseOrderId +
                "/" +
                masterConfig.fileStystem.folderPaths.LOGO,
        });
        if (savedFile) {
            bodyData.purchase_invoice = savedFile.path;
        }
    }
    const newPurchaseOrder = new PurchaseOrder(bodyData);
    yield newPurchaseOrder.save();
    yield Promise.all(newPurchaseOrder.products.map((orderProduct) => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        yield productService.addProductQuantityPO({
            productId: (_c = orderProduct.product_id) === null || _c === void 0 ? void 0 : _c.toString(),
            quantity: orderProduct.quantity,
            requestUser: req.user,
            lot_no: orderProduct.lot_no,
            vendor_name: vendor.name,
            grn_date: newPurchaseOrder.purchase_date,
            expiry_date: orderProduct.expiry_date,
            manufacture_date: orderProduct.manufacture_date,
        });
    })));
    return newPurchaseOrder;
});
const deletePurchaseOrder = ({ purchaseOrderId, }) => __awaiter(void 0, void 0, void 0, function* () {
    throw new Error("PurchaseOrder Can Not Be Deleted");
    const purchaseOrder = yield PurchaseOrder.findByIdAndDelete(purchaseOrderId);
    if (!purchaseOrder) {
        throw new Error("PurchaseOrder not found");
    }
    return purchaseOrder;
});
const downloadPdf = ({ purchaseOrderId, res, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const purchaseOrder = yield PurchaseOrder.findById(purchaseOrderId);
        if (!purchaseOrder) {
            throw new Error("PurchaseOrder not found");
        }
        const vendor = yield Vendor.findById(purchaseOrder === null || purchaseOrder === void 0 ? void 0 : purchaseOrder.vendor_id);
        if (!vendor) {
            throw new Error("Vendor not found");
        }
        const admin = yield User.findOne({
            email: masterConfig.superAdminConfig.email,
            is_app_user: false,
        });
        const formatDate = (date) => {
            if (!date)
                return "";
            const d = new Date(date);
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            const year = d.getFullYear();
            return `${year}-${month}-${day}`;
        };
        let modifiedProducts = [];
        yield Promise.all(purchaseOrder.products.map((orderProduct) => __awaiter(void 0, void 0, void 0, function* () {
            var _d;
            const productDoc = yield Product.findById(orderProduct.product_id);
            const data = {
                product_id: orderProduct.product_id,
                quantity: orderProduct.quantity,
                offer_discount: orderProduct.offer_discount,
                total_amount: orderProduct.total_amount,
                gst_rate: orderProduct.gst_rate,
                purchase_price: orderProduct.purchase_price,
                gst_amount: orderProduct.gst_amount,
                manufacture_date: formatDate(new Date(orderProduct.manufacture_date)),
                expiry_date: formatDate(new Date(orderProduct.expiry_date)),
                lot_no: orderProduct.lot_no,
                product_name: ((_d = productDoc.product_name.find((item) => item.lang_code ===
                    masterConfig.defaultDataConfig.languageConfig.lang_code)) === null || _d === void 0 ? void 0 : _d.value) || productDoc.product_name[0].value,
                product_code: productDoc.product_code,
            };
            modifiedProducts.push(data);
        })));
        const htmlForAttachment = generatePurchaseOrderCodeHtml(purchaseOrder, vendor, admin, modifiedProducts);
        res.setHeader("Content-Type", "application/html");
        res.setHeader("Content-Disposition", "attachment; filename=bill.html");
        res.send(htmlForAttachment);
    }
    catch (error) {
        throw new Error(error.message);
    }
});
export const purchaseOrderService = {
    getPurchaseOrder,
    getPurchaseOrderList,
    updatePurchaseOrder,
    addPurchaseOrder,
    deletePurchaseOrder,
    downloadPdf,
};
//# sourceMappingURL=purchse_order.service.js.map