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
// import { convertFiles, createDocument } from "../helpers/files.management.js";
import { masterConfig } from "../config/master.config.js";
import { productService } from "./products.service.js";
import Vendor from "../models/verdors.model.js";
import { generatePurchaseOrderCodeHtml } from "../helpers/mail.helpers.js";
import User from "../models/users.model.js";
import Product from "../models/products.model.js";
const createInvoiceNo = () => __awaiter(void 0, void 0, void 0, function* () {
    const prefix = masterConfig.billingConfig.poInvoicePrefix;
    const currentMonthYear = new Date().toISOString().slice(5, 7) + new Date().getFullYear();
    // Find the last invoice from the Bill collection
    const lastBill = yield PurchaseOrder.findOne().sort({ createdAt: -1 });
    if (lastBill && lastBill.invoice_no) {
        const lastInvoiceNo = lastBill.invoice_no;
        const [lastPrefix, lastSeq, lastMonthYear] = lastInvoiceNo.split("-");
        if (lastMonthYear === currentMonthYear) {
            const newSeq = (parseInt(lastSeq, 10) + 1).toString().padStart(4, "0");
            return `${prefix}-${newSeq}-${currentMonthYear}`;
        }
    }
    return `${prefix}-0001-${currentMonthYear}`;
});
function calculateStandardQty(base_unit, quantity, size) {
    let std_qty = "";
    switch (base_unit) {
        case "GM":
            std_qty = ((quantity * size) / 1000).toFixed(2) + " KG";
            break;
        case "ML":
            std_qty = ((quantity * size) / 1000).toFixed(2) + " LTR";
            break;
        case "KG":
            std_qty = (quantity * size).toFixed(2) + " KG";
            break;
        case "LTR":
            std_qty = (quantity * size).toFixed(2) + " LTR";
        case "EACH":
            std_qty = (quantity * size).toFixed(2) + "EACH";
            break;
        default:
            std_qty = (quantity * size).toString();
    }
    return std_qty;
}
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
    const vendor = yield Vendor.findById(purchaseOrder === null || purchaseOrder === void 0 ? void 0 : purchaseOrder.vendor_id);
    if (!vendor) {
        throw new Error("Vendor not found");
    }
    let bodyData = {};
    if (((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.payload) && typeof req.query.payload === "string") {
        bodyData = JSON.parse(req.query.payload);
    }
    let updateData = {};
    if (purchaseOrder.status === "completed") {
        if ("contact_name" in bodyData) {
            updateData.contact_name = bodyData.contact_name;
        }
        if ("contact_number" in bodyData) {
            updateData.contact_number = bodyData.contact_number;
        }
        if ("payment_status" in bodyData) {
            updateData.payment_status = bodyData.payment_status;
        }
        if ("order_notes" in bodyData) {
            updateData.order_notes = bodyData.order_notes;
        }
    }
    else {
        if ("contact_name" in bodyData) {
            updateData.contact_name = bodyData.contact_name;
        }
        if ("contact_number" in bodyData) {
            updateData.contact_number = bodyData.contact_number;
        }
        if ("payment_status" in bodyData) {
            updateData.payment_status = bodyData.payment_status;
        }
        if ("order_notes" in bodyData) {
            updateData.order_notes = bodyData.order_notes;
        }
        if ("products" in bodyData) {
            let modifiedProducts = [];
            yield Promise.all(bodyData.products.map((orderProduct) => __awaiter(void 0, void 0, void 0, function* () {
                const productDoc = yield Product.findById(orderProduct.product_id);
                const data = {
                    product_id: new mongoose.Types.ObjectId(orderProduct.product_id),
                    quantity: Number(orderProduct.quantity),
                    manufacture_date: new Date(orderProduct.manufacture_date),
                    expiry_date: new Date(orderProduct.expiry_date),
                    lot_no: orderProduct.lot_no,
                    uom: productDoc.base_unit,
                    final_quantity: calculateStandardQty(productDoc.base_unit, Number(orderProduct.quantity), Number(productDoc.size)),
                };
                modifiedProducts.push(data);
            })));
            updateData.products = modifiedProducts;
        }
        if ("status" in bodyData) {
            updateData.status = bodyData.status;
            if (bodyData.status === "completed") {
                const editProducts = (updateData === null || updateData === void 0 ? void 0 : updateData.products)
                    ? updateData.products
                    : purchaseOrder.products;
                yield Promise.all(editProducts.map((orderProduct) => __awaiter(void 0, void 0, void 0, function* () {
                    var _b;
                    yield productService.addProductQuantityPO({
                        productId: (_b = orderProduct.product_id) === null || _b === void 0 ? void 0 : _b.toString(),
                        quantity: orderProduct.quantity,
                        requestUser: req.user,
                        lot_no: orderProduct.lot_no,
                        vendor_name: vendor.name,
                        grn_date: purchaseOrder.purchase_date,
                        expiry_date: orderProduct.expiry_date,
                        manufacture_date: orderProduct.manufacture_date,
                    });
                })));
            }
        }
    }
    yield PurchaseOrder.findByIdAndUpdate(purchaseOrderId, updateData);
    const purchaseOrderUpdate = yield PurchaseOrder.findById(purchaseOrderId);
    return purchaseOrderUpdate;
    // const { purchase_invoice } = files;
    // if (Array.isArray(purchase_invoice) && purchase_invoice.length > 0) {
    //   let data: any = {
    //     document: purchase_invoice[0],
    //     documentType: masterConfig.fileStystem.fileTypes.IMAGE,
    //     documentPath:
    //       masterConfig.fileStystem.folderPaths.PURCHSE_ORDER +
    //       purchaseOrderId +
    //       "/" +
    //       masterConfig.fileStystem.folderPaths.LOGO,
    //   };
    //   if (purchaseOrder?.purchase_invoice) {
    //     data = {
    //       ...data,
    //       oldPath: purchaseOrder?.purchase_invoice,
    //     };
    //   }
    //   const savedFile = await createDocument(data);
    //   if (savedFile) {
    //     bodyData.purchase_invoice = savedFile.path;
    //   }
    // }
});
const addPurchaseOrder = ({ req }) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    let bodyData = {};
    if (((_c = req === null || req === void 0 ? void 0 : req.query) === null || _c === void 0 ? void 0 : _c.payload) && typeof req.query.payload === "string") {
        bodyData = JSON.parse(req.query.payload);
    }
    let modifiedProducts = [];
    yield Promise.all(bodyData.products.map((orderProduct) => __awaiter(void 0, void 0, void 0, function* () {
        const productDoc = yield Product.findById(orderProduct.product_id);
        const data = {
            product_id: new mongoose.Types.ObjectId(orderProduct.product_id),
            quantity: Number(orderProduct.quantity),
            manufacture_date: new Date(orderProduct.manufacture_date),
            expiry_date: new Date(orderProduct.expiry_date),
            lot_no: orderProduct.lot_no,
            uom: productDoc.base_unit,
            final_quantity: calculateStandardQty(productDoc.base_unit, Number(orderProduct.quantity), Number(productDoc.size)),
        };
        modifiedProducts.push(data);
    })));
    delete bodyData.products;
    const invoice_no = yield createInvoiceNo();
    const newPurchaseOrder = new PurchaseOrder(Object.assign(Object.assign({}, bodyData), { invoice_no: invoice_no, products: modifiedProducts }));
    yield newPurchaseOrder.save();
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
                manufacture_date: formatDate(new Date(orderProduct.manufacture_date)),
                expiry_date: formatDate(new Date(orderProduct.expiry_date)),
                lot_no: orderProduct.lot_no,
                product_name: ((_d = productDoc.product_name.find((item) => item.lang_code ===
                    masterConfig.defaultDataConfig.languageConfig.lang_code)) === null || _d === void 0 ? void 0 : _d.value) || productDoc.product_name[0].value,
                product_code: productDoc.product_code,
                uom: orderProduct.uom,
                final_quantity: orderProduct.final_quantity,
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