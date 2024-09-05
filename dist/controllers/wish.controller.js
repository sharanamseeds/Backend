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
import Wish from "../models/wish. model.js";
import { wishService } from "../services/wish.service.js";
const getWish = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const wishDoc = yield wishService.getWish({
        wishId: req.params.id,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Wish Fetched Successfully!!",
        payload: { result: wishDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const getWishList = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const wishDoc = yield wishService.getWishList({
        query: req.query,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Wish List Fetched Successfully!!",
        payload: { result: wishDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const getUserWishList = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const wishDoc = yield wishService.getUserWishList({
        query: req.query,
        requestUser: req.user,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Wish List Fetched Successfully!!",
        payload: { result: wishDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const updateWish = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const wishDoc = yield wishService.updateWish({
        wishId: req.params.id,
        requestUser: req.user,
        req: req,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Wish Updated Successfully!!",
        payload: { result: wishDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const addWish = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const wishDoc = yield wishService.addWish({
        requestUser: req.user,
        req: req,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Wish Added Successfully!!",
        payload: { result: wishDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const deleteWish = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const wishDoc = yield wishService.deleteWish({
        wishId: req.params.id,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Wish Deleted Successfully!!",
        payload: { result: wishDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const downloadExcel = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch wishes from the database
        const wishes = yield Wish.find();
        // .populate("user_id")
        // .populate("product_id");
        // Create a new Excel workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Wishes");
        // Define the columns for the worksheet based on the typeWish fields
        worksheet.columns = [
            { header: "Wish ID", key: "_id", width: 20 },
            { header: "User ID", key: "user_id", width: 20 },
            { header: "Product ID", key: "product_id", width: 20 },
            { header: "Priority", key: "priority", width: 15 },
            { header: "Notes", key: "notes", width: 30 },
            { header: "Created At", key: "createdAt", width: 25 },
            { header: "Updated At", key: "updatedAt", width: 25 },
        ];
        // Add rows to the worksheet
        wishes.forEach((wish) => {
            var _a, _b;
            worksheet.addRow({
                _id: wish._id.toString(),
                user_id: wish.user_id ? wish.user_id.toString() : "N/A",
                product_id: wish.product_id ? wish.product_id.toString() : "N/A",
                priority: wish.priority || "N/A",
                notes: wish.notes || "N/A",
                createdAt: (_a = wish.createdAt) === null || _a === void 0 ? void 0 : _a.toISOString(),
                updatedAt: (_b = wish.updatedAt) === null || _b === void 0 ? void 0 : _b.toISOString(),
            });
        });
        // Set the response headers and content type for the Excel file
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=wishes.xlsx");
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
export const wishController = {
    getWish,
    addWish,
    getWishList,
    updateWish,
    deleteWish,
    downloadExcel,
    getUserWishList,
};
//# sourceMappingURL=wish.controller.js.map