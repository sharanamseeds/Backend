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
import Vendor from "../models/verdors.model.js";
import { vendorService } from "../services/vendors.service.js";
const getVendor = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorDoc = yield vendorService.getVendor({
        vendorId: req.params.id,
        query: req.query,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Vendor Fetched Successfully!!",
        payload: { result: vendorDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const getVendorList = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorDoc = yield vendorService.getVendorList({
        query: req.query,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Vendor List Fetched Successfully!!",
        payload: { result: vendorDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const updateVendor = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorDoc = yield vendorService.updateVendor({
        vendorId: req.params.id,
        req: req,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Vendor Updated Successfully!!",
        payload: { result: vendorDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const addVendor = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorDoc = yield vendorService.addVendor({
        req: req,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Vendor Added Successfully!!",
        payload: { result: vendorDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const deleteVendor = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorDoc = yield vendorService.deleteVendor({
        vendorId: req.params.id,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Vendor Deleted Successfully!!",
        payload: { result: vendorDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const downloadExcel = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendors = yield Vendor.find();
        // Create a new Excel workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Vendors");
        worksheet.columns = [
            { header: "_id", key: "_id", width: 30 },
            { header: "Vendor Name", key: "name", width: 30 },
            { header: "Agro Name", key: "agro_name", width: 30 },
            { header: "Email", key: "email", width: 30 },
            { header: "Contact Number", key: "contact_number", width: 20 },
            { header: "GST Number", key: "gst_number", width: 20 },
            { header: "PAN Number", key: "pan_number", width: 20 },
            {
                header: "Pesticide License No",
                key: "pesticide_license_no",
                width: 25,
            },
            { header: "Seed License No", key: "seed_license_no", width: 25 },
            {
                header: "Fertilizer License No",
                key: "fertilizer_license_no",
                width: 25,
            },
            { header: "Address", key: "address", width: 40 },
            { header: "Bank Name", key: "bankName", width: 30 },
            { header: "Account Number", key: "accountNumber", width: 25 },
            { header: "IFSC Code", key: "ifscCode", width: 20 },
            { header: "Branch Name", key: "branchName", width: 30 },
            { header: "Created At", key: "createdAt", width: 30 },
            { header: "Updated At", key: "updatedAt", width: 30 },
        ];
        // Add rows to the worksheet
        vendors.forEach((vendor) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            worksheet.addRow({
                _id: (_a = vendor === null || vendor === void 0 ? void 0 : vendor._id) === null || _a === void 0 ? void 0 : _a.toString(),
                name: vendor.name,
                agro_name: vendor.agro_name,
                email: vendor.email,
                contact_number: vendor.contact_number,
                gst_number: vendor.gst_number,
                pan_number: vendor.pan_number,
                pesticide_license_no: vendor.pesticide_license_no,
                seed_license_no: vendor.seed_license_no,
                fertilizer_license_no: vendor.fertilizer_license_no,
                address: `${((_b = vendor.address) === null || _b === void 0 ? void 0 : _b.address_line) || ""}, ${((_c = vendor.address) === null || _c === void 0 ? void 0 : _c.city) || ""}, ${((_d = vendor.address) === null || _d === void 0 ? void 0 : _d.state) || ""} - ${((_e = vendor.address) === null || _e === void 0 ? void 0 : _e.pincode) || ""}`,
                bankName: (_f = vendor.bank_details) === null || _f === void 0 ? void 0 : _f.bankName,
                accountNumber: (_g = vendor.bank_details) === null || _g === void 0 ? void 0 : _g.accountNumber,
                ifscCode: (_h = vendor.bank_details) === null || _h === void 0 ? void 0 : _h.ifscCode,
                branchName: (_j = vendor.bank_details) === null || _j === void 0 ? void 0 : _j.branchName,
                createdAt: ((_k = vendor.createdAt) === null || _k === void 0 ? void 0 : _k.toISOString()) || "",
                updatedAt: ((_l = vendor.updatedAt) === null || _l === void 0 ? void 0 : _l.toISOString()) || "",
            });
        });
        // Set the response headers and content type for the Excel file
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=vendors.xlsx");
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
export const vendorController = {
    getVendor,
    addVendor,
    getVendorList,
    updateVendor,
    deleteVendor,
    downloadExcel,
};
//# sourceMappingURL=vendors.controller.js.map