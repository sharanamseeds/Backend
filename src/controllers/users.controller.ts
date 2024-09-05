import {
  catchAsync,
  createResponseObject,
} from "../helpers/request.helpers.js";
import httpStatus from "http-status";
import { userService } from "../services/users.service.js";
import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import User from "../models/users.model.js";
import ExcelJS from "exceljs";

const getUser = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const userDoc = await userService.getUser({
    userId: req.params.id,
    query: req.query,
  });

  const data4responseObject = {
    req: req,
    code: httpStatus.OK,
    message: "User Fetched Successfully!!",
    payload: { result: userDoc },
    logPayload: false,
  };

  res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
});

const getUserList = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userDoc = await userService.getUserList({
      query: req.query,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "User List Fetched Successfully!!",
      payload: { result: userDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const updateUser = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userDoc = await userService.updateUser({
      userId: req.params.id,
      requestUser: req.user,
      req: req,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "User Updated Successfully!!",
      payload: { result: userDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const addUser = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const userDoc = await userService.addUser({
    requestUser: req.user,
    req: req,
  });

  const data4responseObject = {
    req: req,
    code: httpStatus.OK,
    message: "User Added Successfully!!",
    payload: { result: userDoc },
    logPayload: false,
  };

  res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
});

const deleteUser = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userDoc = await userService.deleteUser({
      userId: req.params.id,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "User Deleted Successfully!!",
      payload: { result: userDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);
const getAccountDetails = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userDoc = await userService.calculateUserFinancials({
      userId: req.query?.user_id || req.user._id,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "User Account Details Fetched!!",
      payload: { result: userDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const downloadExcel = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const users = await User.find();

      // Create a new Excel workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Users");

      // Add headers to the worksheet based on the typeUser fields
      worksheet.columns = [
        { header: "_id", key: "_id", width: 30 },
        { header: "Name", key: "name", width: 30 },
        { header: "Email", key: "email", width: 30 },
        { header: "Contact Number", key: "contact_number", width: 20 },
        { header: "GST Number", key: "gst_number", width: 20 },
        { header: "Is Verified", key: "is_verified", width: 15 },
        { header: "Is Blocked", key: "is_blocked", width: 15 },
        { header: "Is Email Verified", key: "is_email_verified", width: 20 },
        { header: "Added By", key: "added_by", width: 30 },
        { header: "Updated By", key: "updated_by", width: 30 },
        { header: "Role ID", key: "role_id", width: 30 },
        {
          header: "Billing Address Line",
          key: "billing_address_line",
          width: 30,
        },
        { header: "Billing City", key: "billing_city", width: 20 },
        { header: "Billing State", key: "billing_state", width: 20 },
        { header: "Billing Pincode", key: "billing_pincode", width: 15 },
        {
          header: "Billing Coordinates",
          key: "billing_coordinates",
          width: 30,
        },
        {
          header: "Billing Equals Shipping",
          key: "billing_equals_shipping",
          width: 20,
        },
        {
          header: "Shipping Address Line",
          key: "shipping_address_line",
          width: 30,
        },
        { header: "Shipping City", key: "shipping_city", width: 20 },
        { header: "Shipping State", key: "shipping_state", width: 20 },
        { header: "Shipping Pincode", key: "shipping_pincode", width: 15 },
        {
          header: "Shipping Coordinates",
          key: "shipping_coordinates",
          width: 30,
        },
        { header: "Profile", key: "profile", width: 30 },
        { header: "GST Certificate", key: "gst_certificate", width: 30 },
        { header: "Aadhar Card", key: "aadhar_card", width: 30 },
        { header: "Bank Details", key: "bank_details", width: 30 },
        { header: "Other Document", key: "other_document", width: 30 },
        { header: "Created At", key: "createdAt", width: 30 },
        { header: "Updated At", key: "updatedAt", width: 30 },
      ];

      // Add rows to the worksheet
      users.forEach((user) => {
        worksheet.addRow({
          _id: user?._id?.toString(),
          name: user.name,
          email: user.email,
          contact_number: user.contact_number,
          gst_number: user.gst_number,
          is_verified: user.is_verified,
          is_blocked: user.is_blocked,
          is_email_verified: user.is_email_verified,
          added_by: user.added_by?.toString() || "",
          updated_by: user.updated_by?.toString() || "",
          role_id: user.role_id?.toString() || "",
          billing_address_line: user.billing_address.address_line || "",
          billing_city: user.billing_address.city || "",
          billing_state: user.billing_address.state || "",
          billing_pincode: user.billing_address.pincode || "",
          billing_coordinates:
            user.billing_address.coordinates?.join(", ") || "",
          billing_equals_shipping: user.billing_equals_shipping,
          shipping_address_line: user.shipping_address.address_line || "",
          shipping_city: user.shipping_address.city || "",
          shipping_state: user.shipping_address.state || "",
          shipping_pincode: user.shipping_address.pincode || "",
          shipping_coordinates:
            user.shipping_address.coordinates?.join(", ") || "",
          profile: user.profile || "",
          gst_certificate: user.gst_certificate || "",
          aadhar_card: user.aadhar_card || "",
          bank_details: user.bank_details || "",
          other_document: user.other_document || "",
          createdAt: user.createdAt?.toISOString() || "",
          updatedAt: user.updatedAt?.toISOString() || "",
        });
      });

      // Set the response headers and content type for the Excel file
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", "attachment; filename=users.xlsx");

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

export const userController = {
  getUser,
  addUser,
  getUserList,
  updateUser,
  deleteUser,
  downloadExcel,
  getAccountDetails,
};
