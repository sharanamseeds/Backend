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
import Cart from "../models/cart.model.js";
import { cartService } from "../services/cart.service.js";
const getCart = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cartDoc = yield cartService.getCart({
        cartId: req.params.id,
        query: req.query,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Cart Fetched Successfully!!",
        payload: { result: cartDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const getCartList = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cartDoc = yield cartService.getCartList({
        query: req.query,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Cart List Fetched Successfully!!",
        payload: { result: cartDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const getUserCartList = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cartDoc = yield cartService.getUserCartList({
        query: req.query,
        requestUser: req.user,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Cart List Fetched Successfully!!",
        payload: { result: cartDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const updateCart = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cartDoc = yield cartService.updateCart({
        cartId: req.params.id,
        requestUser: req.user,
        req: req,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Cart Updated Successfully!!",
        payload: { result: cartDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const addCart = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cartDoc = yield cartService.addCart({
        requestUser: req.user,
        req: req,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Cart Added Successfully!!",
        payload: { result: cartDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const deleteCart = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cartDoc = yield cartService.deleteCart({
        cartId: req.params.id,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Cart Deleted Successfully!!",
        payload: { result: cartDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const downloadExcel = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch carts from the database
        const carts = yield Cart.find()
            .populate("user_id")
            .populate("product_id");
        // Create a new Excel workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Carts");
        // Define the columns for the worksheet based on the typeCart fields
        worksheet.columns = [
            { header: "Cart ID", key: "_id", width: 20 },
            { header: "User ID", key: "user_id", width: 20 },
            { header: "Product ID", key: "product_id", width: 20 },
            { header: "Quantity", key: "quantity", width: 15 },
            { header: "Status", key: "status", width: 20 },
            { header: "Notes", key: "notes", width: 30 },
            { header: "Created At", key: "createdAt", width: 25 },
            { header: "Updated At", key: "updatedAt", width: 25 },
        ];
        // Add rows to the worksheet
        carts.forEach((cart) => {
            var _a, _b;
            worksheet.addRow({
                _id: cart._id.toString(),
                user_id: cart.user_id ? cart.user_id.toString() : "N/A",
                product_id: cart.product_id ? cart.product_id.toString() : "N/A",
                quantity: cart.quantity || "N/A",
                status: cart.status || "N/A",
                notes: cart.notes || "N/A",
                createdAt: (_a = cart.createdAt) === null || _a === void 0 ? void 0 : _a.toISOString(),
                updatedAt: (_b = cart.updatedAt) === null || _b === void 0 ? void 0 : _b.toISOString(),
            });
        });
        // Set the response headers and content type for the Excel file
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=carts.xlsx");
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
export const cartController = {
    getCart,
    addCart,
    getCartList,
    updateCart,
    deleteCart,
    downloadExcel,
    getUserCartList,
};
//# sourceMappingURL=cart.controller.js.map