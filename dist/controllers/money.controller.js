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
import { moneyService } from "../services/money.service.js";
import ExcelJS from "exceljs";
import Money from "../models/money.model.js";
const getMoney = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const moneyDoc = yield moneyService.getMoney({
        moneyId: req.params.id,
        query: req.query,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Money  Fetched Successfully!!",
        payload: { result: moneyDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const getMoneyList = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const moneyDoc = yield moneyService.getMoneyList({
        query: req.query,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Money List Fetched Successfully!!",
        payload: { result: moneyDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const addMoney = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let bodyData = {};
    if (((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.payload) && typeof req.query.payload === "string") {
        bodyData = JSON.parse(req.query.payload);
    }
    const moneyDoc = yield moneyService.addMoney({
        user_id: bodyData.user_id,
        amount: bodyData.amount,
        description: bodyData.description,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Money  Added Successfully!!",
        payload: { result: moneyDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const updateMoney = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    let bodyData = {};
    if (((_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.payload) && typeof req.query.payload === "string") {
        bodyData = JSON.parse(req.query.payload);
    }
    const moneyDoc = yield moneyService.updateMoney(Object.assign({ moneyId: req.params.id, requestUser: req.user }, bodyData));
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Money  Updated Successfully!!",
        payload: { result: moneyDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const deleteMoney = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const moneyDoc = yield moneyService.deleteMoney({
        moneyId: req.params.id,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Money  Deleted Successfully!!",
        payload: { result: moneyDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const downloadMoneyExcel = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch money s from the database
        const moneys = yield Money.find();
        // Create a new Excel workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Money s");
        // Define the columns for the worksheet based on the Money fields
        worksheet.columns = [
            { header: " ID", key: "_id", width: 20 },
            { header: "User ID", key: "user_id", width: 20 },
            { header: "Amount", key: "amount", width: 20 },
            { header: "Description", key: "description", width: 30 },
            { header: "Created At", key: "createdAt", width: 25 },
            { header: "Updated At", key: "updatedAt", width: 25 },
        ];
        // Add rows to the worksheet
        moneys.forEach((money) => {
            var _a, _b;
            worksheet.addRow({
                _id: money._id.toString(),
                user_id: money.user_id ? money.user_id.toString() : "N/A",
                amount: money.amount || "N/A",
                description: money.description || "N/A",
                createdAt: (_a = money.createdAt) === null || _a === void 0 ? void 0 : _a.toISOString(),
                updatedAt: (_b = money.updatedAt) === null || _b === void 0 ? void 0 : _b.toISOString(),
            });
        });
        // Set the response headers and content type for the Excel file
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=money_s.xlsx");
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
export const moneyController = {
    getMoney,
    addMoney,
    getMoneyList,
    updateMoney,
    deleteMoney,
    downloadMoneyExcel,
};
//# sourceMappingURL=money.controller.js.map