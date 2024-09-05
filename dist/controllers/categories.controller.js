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
import { categoryService } from "../services/categories.service.js";
import ExcelJS from "exceljs";
import Category from "../models/categories.model.js";
const getCategory = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryDoc = yield categoryService.getCategory({
        categoryId: req.params.id,
        query: req.query,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Category Fetched Successfully!!",
        payload: { result: categoryDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const getCategoryList = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryDoc = yield categoryService.getCategoryList({
        query: req.query,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Category List Fetched Successfully!!",
        payload: { result: categoryDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const updateCategory = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryDoc = yield categoryService.updateCategory({
        categoryId: req.params.id,
        requestUser: req.user,
        req: req,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Category Updated Successfully!!",
        payload: { result: categoryDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const addCategory = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryDoc = yield categoryService.addCategory({
        requestUser: req.user,
        req: req,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Category Added Successfully!!",
        payload: { result: categoryDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const deleteCategory = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryDoc = yield categoryService.deleteCategory({
        categoryId: req.params.id,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Category Deleted Successfully!!",
        payload: { result: categoryDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const downloadExcel = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch categories from the database
        const categories = yield Category.find();
        // .populate("added_by")
        // .populate("updated_by");
        // Create a new Excel workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Categories");
        // Define the columns for the worksheet based on the typeCategory fields
        worksheet.columns = [
            { header: "Category ID", key: "_id", width: 20 },
            { header: "Category Name", key: "category_name", width: 30 },
            { header: "Identifier", key: "identifier", width: 20 },
            { header: "Description", key: "description", width: 30 },
            { header: "Logo", key: "logo", width: 30 },
            { header: "Added By", key: "added_by", width: 20 },
            { header: "Updated By", key: "updated_by", width: 20 },
            { header: "Created At", key: "createdAt", width: 25 },
            { header: "Updated At", key: "updatedAt", width: 25 },
        ];
        // Add rows to the worksheet
        categories.forEach((category) => {
            var _a, _b;
            worksheet.addRow({
                _id: category._id.toString(),
                category_name: category.category_name
                    .map((name) => name.value) // Adjust as necessary to get the localized value
                    .join(", "),
                identifier: category.identifier,
                description: category.description
                    .map((desc) => desc.value) // Adjust as necessary to get the localized value
                    .join(", "),
                logo: category.logo
                    .map((logo) => logo.value) // Adjust as necessary to get the localized value
                    .join(", "),
                added_by: category.added_by ? category.added_by.toString() : "N/A",
                updated_by: category.updated_by
                    ? category.updated_by.toString()
                    : "N/A",
                createdAt: (_a = category.createdAt) === null || _a === void 0 ? void 0 : _a.toISOString(),
                updatedAt: (_b = category.updatedAt) === null || _b === void 0 ? void 0 : _b.toISOString(),
            });
        });
        // Set the response headers and content type for the Excel file
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=categories.xlsx");
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
export const categoryController = {
    getCategory,
    addCategory,
    getCategoryList,
    updateCategory,
    deleteCategory,
    downloadExcel,
};
//# sourceMappingURL=categories.controller.js.map