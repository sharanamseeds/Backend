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
import { billService } from "../services/bills.service.js";
import ExcelJS from "exceljs";
import Bill from "../models/bill.model.js";
import User from "../models/users.model.js";
import { masterConfig } from "../config/master.config.js";
import { generateBillCodeHtml } from "../helpers/mail.helpers.js";
import Product from "../models/products.model.js";
import Order from "../models/orders.model.js";
const formatShowDate = (date) => {
    if (!date)
        return "";
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
};
const modifiedBillProducts = (products) => __awaiter(void 0, void 0, void 0, function* () {
    const calculatedProducts = yield Promise.all(products.map((product) => __awaiter(void 0, void 0, void 0, function* () {
        const productDoc = yield Product.findById(product.product_id);
        if (!productDoc || !productDoc.is_active || !productDoc.is_verified) {
            throw new Error("Product Not Found");
        }
        return {
            product_name: productDoc.product_name.find((item) => item.lang_code ===
                masterConfig.defaultDataConfig.languageConfig.lang_code).value,
            product_code: productDoc.product_code,
            quantity: product.quantity,
            rate: product.purchase_price,
            taxableValue: product.quantity * product.purchase_price,
            gstRate: product.gst_rate,
            gstAmount: product.gst_amount,
            discount: product.offer_discount,
            manufacture_date: formatShowDate(product.manufacture_date),
            expiry_date: formatShowDate(product.expiry_date),
        };
    })));
    return calculatedProducts;
});
const getBill = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const billDoc = yield billService.getBill({
        billId: req.params.id,
        query: req.query,
    });
    const billDocOther = yield Bill.findById(req.params.id);
    if (!billDocOther) {
        throw new Error("Order Not Found!!!");
    }
    const sellerDoc = yield User.findOne({
        email: masterConfig.superAdminConfig.email,
    });
    if (!sellerDoc) {
        throw new Error("Seller Not Found!!!");
    }
    const buyerDoc = yield User.findById(billDocOther === null || billDocOther === void 0 ? void 0 : billDocOther.customer_id);
    if (!buyerDoc) {
        throw new Error("Buyer Not Found!!!");
    }
    const orderDoc = yield Order.findById(billDocOther.order_id);
    if (!orderDoc) {
        throw new Error("Order Not Found!!!");
    }
    const convertItems = yield modifiedBillProducts(orderDoc.products);
    const bill = {
        invoice_id: billDocOther.invoice_id,
        sellerName: sellerDoc.agro_name,
        sellerAddress: ((_a = sellerDoc === null || sellerDoc === void 0 ? void 0 : sellerDoc.billing_address) === null || _a === void 0 ? void 0 : _a.address_line) ||
            ((_b = sellerDoc === null || sellerDoc === void 0 ? void 0 : sellerDoc.shipping_address) === null || _b === void 0 ? void 0 : _b.address_line),
        sellerEmail: sellerDoc.email,
        sellerPhone: sellerDoc.contact_number,
        sellerGST: ((_c = sellerDoc._id) === null || _c === void 0 ? void 0 : _c.toString()) === ((_d = sellerDoc.gst_number) === null || _d === void 0 ? void 0 : _d.toString())
            ? "-"
            : sellerDoc.gst_number,
        buyerName: buyerDoc.agro_name,
        buyerAddress: ((_e = buyerDoc === null || buyerDoc === void 0 ? void 0 : buyerDoc.billing_address) === null || _e === void 0 ? void 0 : _e.address_line) ||
            ((_f = buyerDoc === null || buyerDoc === void 0 ? void 0 : buyerDoc.shipping_address) === null || _f === void 0 ? void 0 : _f.address_line),
        buyerEmail: buyerDoc.email,
        buyerPhone: buyerDoc.contact_number,
        buyerGST: ((_g = buyerDoc._id) === null || _g === void 0 ? void 0 : _g.toString()) === ((_h = buyerDoc.gst_number) === null || _h === void 0 ? void 0 : _h.toString())
            ? "-"
            : buyerDoc.gst_number,
        items: convertItems,
        order_amount: billDocOther.order_amount,
        discount_amount: billDocOther.discount_amount,
        tax_amount: billDocOther.tax_amount,
        billing_amount: orderDoc.billing_amount,
        sellerBankDetails: {
            bankName: masterConfig.super_admin_bank_details.bankName,
            accountNumber: masterConfig.super_admin_bank_details.accountNumber,
            ifscCode: masterConfig.super_admin_bank_details.ifscCode,
            branchName: masterConfig.super_admin_bank_details.branchName,
        },
    };
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Bill Fetched Successfully!!",
        payload: { result: billDoc, bill },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const getBillList = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const billDoc = yield billService.getBillList({
        query: req.query,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Bill List Fetched Successfully!!",
        payload: { result: billDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const getCustomerBillList = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const billDoc = yield billService.getCustomerBillList({
        query: req.query,
        requestUser: req.user,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Bill List Fetched Successfully!!",
        payload: { result: billDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const updateBill = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _j;
    let bodyData = {};
    if (((_j = req === null || req === void 0 ? void 0 : req.query) === null || _j === void 0 ? void 0 : _j.payload) && typeof req.query.payload === "string") {
        bodyData = JSON.parse(req.query.payload);
    }
    const billDoc = yield billService.updateBill({
        billId: req.params.id,
        requestUser: req.user,
        files: req.files,
        status: bodyData.payment_status,
        payment_method: bodyData.payment_method,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Bill Updated Successfully!!",
        payload: { result: billDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const addBill = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _k;
    let bodyData = {};
    if (((_k = req === null || req === void 0 ? void 0 : req.query) === null || _k === void 0 ? void 0 : _k.payload) && typeof req.query.payload === "string") {
        bodyData = JSON.parse(req.query.payload);
    }
    const billDoc = yield billService.addBill({
        requestUser: req.user,
        order_id: bodyData.order_id,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Bill Added Successfully!!",
        payload: { result: billDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const deleteBill = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const billDoc = yield billService.deleteBill({
        billId: req.params.id,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Bill Deleted Successfully!!",
        payload: { result: billDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const downloadExcel = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch bills from the database
        const bills = yield Bill.find();
        // .populate("order_id")
        // .populate("customer_id");
        // Create a new Excel workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Bills");
        // Define the columns for the worksheet based on the typeBill fields
        worksheet.columns = [
            { header: "Bill ID", key: "_id", width: 20 },
            { header: "Order ID", key: "order_id", width: 20 },
            { header: "Customer ID", key: "customer_id", width: 20 },
            { header: "Order Amount", key: "order_amount", width: 20 },
            { header: "Bill Amount", key: "bill_amount", width: 20 },
            { header: "Tax Amount", key: "tax_amount", width: 20 },
            { header: "Discount Amount", key: "discount_amount", width: 20 },
            { header: "Payment Status", key: "payment_status", width: 15 },
            { header: "Payment Method", key: "payment_method", width: 20 },
            { header: "Payment Details", key: "payment_details", width: 30 },
            { header: "Invoice ID", key: "invoice_id", width: 20 },
            { header: "Created At", key: "createdAt", width: 25 },
            { header: "Updated At", key: "updatedAt", width: 25 },
        ];
        // Add rows to the worksheet
        bills.forEach((bill) => {
            var _a, _b;
            worksheet.addRow({
                _id: bill._id.toString(),
                order_id: bill.order_id ? bill.order_id.toString() : "N/A",
                customer_id: bill.customer_id ? bill.customer_id.toString() : "N/A",
                order_amount: bill.order_amount || "N/A",
                bill_amount: bill.bill_amount || "N/A",
                tax_amount: bill.tax_amount || "N/A",
                discount_amount: bill.discount_amount || "N/A",
                payment_status: bill.payment_status,
                payment_method: bill.payment_method || "N/A",
                payment_details: bill.payment_details || "N/A",
                invoice_id: bill.invoice_id || "N/A",
                createdAt: (_a = bill.createdAt) === null || _a === void 0 ? void 0 : _a.toISOString(),
                updatedAt: (_b = bill.updatedAt) === null || _b === void 0 ? void 0 : _b.toISOString(),
            });
        });
        // Set the response headers and content type for the Excel file
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=bills.xlsx");
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
const downloadBill = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _l, _m, _o, _p, _q, _r, _s, _t;
    try {
        // Fetch bill from the database
        const billDoc = yield Bill.findById(req.params.id);
        if (!billDoc) {
            throw new Error("Order Not Found!!!");
        }
        const sellerDoc = yield User.findOne({
            email: masterConfig.superAdminConfig.email,
        });
        if (!sellerDoc) {
            throw new Error("Seller Not Found!!!");
        }
        const buyerDoc = yield User.findById(billDoc === null || billDoc === void 0 ? void 0 : billDoc.customer_id);
        if (!buyerDoc) {
            throw new Error("Buyer Not Found!!!");
        }
        const orderDoc = yield Order.findById(billDoc.order_id);
        if (!orderDoc) {
            throw new Error("Order Not Found!!!");
        }
        const convertItems = yield modifiedBillProducts(orderDoc.products);
        const bill = {
            invoice_id: billDoc.invoice_id,
            sellerName: sellerDoc.agro_name,
            sellerAddress: ((_l = sellerDoc === null || sellerDoc === void 0 ? void 0 : sellerDoc.billing_address) === null || _l === void 0 ? void 0 : _l.address_line) ||
                ((_m = sellerDoc === null || sellerDoc === void 0 ? void 0 : sellerDoc.shipping_address) === null || _m === void 0 ? void 0 : _m.address_line),
            sellerEmail: sellerDoc.email,
            sellerPhone: sellerDoc.contact_number,
            sellerGST: ((_o = sellerDoc._id) === null || _o === void 0 ? void 0 : _o.toString()) === ((_p = sellerDoc.gst_number) === null || _p === void 0 ? void 0 : _p.toString())
                ? "-"
                : sellerDoc.gst_number,
            buyerName: buyerDoc.agro_name,
            buyerAddress: ((_q = buyerDoc === null || buyerDoc === void 0 ? void 0 : buyerDoc.billing_address) === null || _q === void 0 ? void 0 : _q.address_line) ||
                ((_r = buyerDoc === null || buyerDoc === void 0 ? void 0 : buyerDoc.shipping_address) === null || _r === void 0 ? void 0 : _r.address_line),
            buyerEmail: buyerDoc.email,
            buyerPhone: buyerDoc.contact_number,
            buyerGST: ((_s = buyerDoc._id) === null || _s === void 0 ? void 0 : _s.toString()) === ((_t = buyerDoc.gst_number) === null || _t === void 0 ? void 0 : _t.toString())
                ? "-"
                : buyerDoc.gst_number,
            items: convertItems,
            order_amount: billDoc.order_amount,
            discount_amount: billDoc.discount_amount,
            tax_amount: billDoc.tax_amount,
            billing_amount: orderDoc.billing_amount,
            sellerBankDetails: {
                bankName: masterConfig.super_admin_bank_details.bankName,
                accountNumber: masterConfig.super_admin_bank_details.accountNumber,
                ifscCode: masterConfig.super_admin_bank_details.ifscCode,
                branchName: masterConfig.super_admin_bank_details.branchName,
            },
        };
        const htmlForAttachment = generateBillCodeHtml(bill, false, orderDoc.order_type === "sell");
        res.setHeader("Content-Type", "application/html");
        res.setHeader("Content-Disposition", "attachment; filename=bill.html");
        res.send(htmlForAttachment);
        // download start
        // res.setHeader("Content-Type", "application/pdf");
        // res.setHeader("Content-Disposition", "attachment; filename=bill.pdf");
        // // download end
        // const path = await convertPdf(htmlForAttachment);
        // res.sendFile(path);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}));
export const billController = {
    getBill,
    addBill,
    getBillList,
    updateBill,
    deleteBill,
    getCustomerBillList,
    downloadExcel,
    downloadBill,
};
//# sourceMappingURL=bills.controllers.js.map