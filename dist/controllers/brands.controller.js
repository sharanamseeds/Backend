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
import { brandService } from "../services/brands.service.js";
import ExcelJS from "exceljs";
import Brand from "../models/brands.model.js";
const getBrand = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const brandDoc = yield brandService.getBrand({
        brandId: req.params.id,
        query: req.query,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Brand Fetched Successfully!!",
        payload: { result: brandDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const getBrandList = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const brandDoc = yield brandService.getBrandList({
        query: req.query,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Brand List Fetched Successfully!!",
        payload: { result: brandDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const updateBrand = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const brandDoc = yield brandService.updateBrand({
        brandId: req.params.id,
        requestUser: req.user,
        req: req,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Brand Updated Successfully!!",
        payload: { result: brandDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const addBrand = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const brandDoc = yield brandService.addBrand({
        requestUser: req.user,
        req: req,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Brand Added Successfully!!",
        payload: { result: brandDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const deleteBrand = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const brandDoc = yield brandService.deleteBrand({
        brandId: req.params.id,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Brand Deleted Successfully!!",
        payload: { result: brandDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const downloadExcel = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch brands from the database
        const brands = yield Brand.find();
        // .populate("added_by")
        // .populate("updated_by");
        // Create a new Excel workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Brands");
        // Define the columns for the worksheet based on the typeBrand fields
        worksheet.columns = [
            { header: "Brand ID", key: "_id", width: 20 },
            { header: "Brand Name", key: "brand_name", width: 30 },
            { header: "Identifier", key: "identifier", width: 20 },
            { header: "Tag Line", key: "tag_line", width: 30 },
            { header: "Logo", key: "logo", width: 30 },
            { header: "Added By", key: "added_by", width: 20 },
            { header: "Updated By", key: "updated_by", width: 20 },
            { header: "Created At", key: "createdAt", width: 25 },
            { header: "Updated At", key: "updatedAt", width: 25 },
        ];
        // Add rows to the worksheet
        brands.forEach((brand) => {
            var _a, _b;
            worksheet.addRow({
                _id: brand._id.toString(),
                brand_name: brand.brand_name
                    .map((name) => name.value) // Adjust as necessary to get the localized value
                    .join(", "),
                identifier: brand.identifier || "N/A",
                tag_line: brand.tag_line
                    .map((tag) => tag.value) // Adjust as necessary to get the localized value
                    .join(", "),
                logo: brand.logo
                    .map((logo) => logo.value) // Adjust as necessary to get the localized value
                    .join(", "),
                added_by: brand.added_by ? brand.added_by.toString() : "N/A",
                updated_by: brand.updated_by ? brand.updated_by.toString() : "N/A",
                createdAt: (_a = brand.createdAt) === null || _a === void 0 ? void 0 : _a.toISOString(),
                updatedAt: (_b = brand.updatedAt) === null || _b === void 0 ? void 0 : _b.toISOString(),
            });
        });
        // Set the response headers and content type for the Excel file
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=brands.xlsx");
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
export const brandController = {
    getBrand,
    addBrand,
    getBrandList,
    updateBrand,
    deleteBrand,
    downloadExcel,
};
//# sourceMappingURL=brands.controller.js.map