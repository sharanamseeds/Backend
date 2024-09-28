import {
  catchAsync,
  createResponseObject,
} from "../helpers/request.helpers.js";
import httpStatus from "http-status";
import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import ExcelJS from "exceljs";
import Vendor from "../models/verdors.model.js";
import { vendorService } from "../services/vendors.service.js";

const getVendor = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const vendorDoc = await vendorService.getVendor({
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
  }
);

const getVendorList = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const vendorDoc = await vendorService.getVendorList({
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
  }
);

const updateVendor = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const vendorDoc = await vendorService.updateVendor({
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
  }
);

const addVendor = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const vendorDoc = await vendorService.addVendor({
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
  }
);

const deleteVendor = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const vendorDoc = await vendorService.deleteVendor({
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
  }
);

const downloadExcel = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const vendors = await Vendor.find();

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
        worksheet.addRow({
          _id: vendor?._id?.toString(),
          name: vendor.name,
          agro_name: vendor.agro_name,
          email: vendor.email,
          contact_number: vendor.contact_number,
          gst_number: vendor.gst_number,
          pan_number: vendor.pan_number,
          pesticide_license_no: vendor.pesticide_license_no,
          seed_license_no: vendor.seed_license_no,
          fertilizer_license_no: vendor.fertilizer_license_no,
          address: `${vendor.address?.address_line || ""}, ${
            vendor.address?.city || ""
          }, ${vendor.address?.state || ""} - ${vendor.address?.pincode || ""}`,
          bankName: vendor.bank_details?.bankName,
          accountNumber: vendor.bank_details?.accountNumber,
          ifscCode: vendor.bank_details?.ifscCode,
          branchName: vendor.bank_details?.branchName,
          createdAt: vendor.createdAt?.toISOString() || "",
          updatedAt: vendor.updatedAt?.toISOString() || "",
        });
      });
      // Set the response headers and content type for the Excel file
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", "attachment; filename=vendors.xlsx");

      // Write the Excel file to the response
      await workbook.xlsx.write(res);

      // End the response
      res.end();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const vendorController = {
  getVendor,
  addVendor,
  getVendorList,
  updateVendor,
  deleteVendor,
  downloadExcel,
};
