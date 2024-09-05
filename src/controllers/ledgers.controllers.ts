import {
  catchAsync,
  createResponseObject,
} from "../helpers/request.helpers.js";
import httpStatus from "http-status";
import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { ledgerService } from "../services/ledgers.service.js";
import ExcelJS from "exceljs";
import Ledger from "../models/ledger.model.js";

const getLedger = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const ledgerDoc = await ledgerService.getLedger({
      ledgerId: req.params.id,
      query: req.query,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Ledger Fetched Successfully!!",
      payload: { result: ledgerDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const getLedgerList = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const ledgerDoc = await ledgerService.getLedgerList({
      query: req.query,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Ledger List Fetched Successfully!!",
      payload: { result: ledgerDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const getCustomerLedgerList = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const ledgerDoc = await ledgerService.getCustomerLedgerList({
      query: req.query,
      requestUser: req.user,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Ledger List Fetched Successfully!!",
      payload: { result: ledgerDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const updateLedger = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const ledgerDoc = await ledgerService.updateLedger({
      ledgerId: req.params.id,
      requestUser: req.user,
      description: req.body.description,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Ledger Updated Successfully!!",
      payload: { result: ledgerDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const addLedger = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const ledgerDoc = await ledgerService.addLedger({
      requestUser: req.user,
      bill_id: req.body.bill_id,
      description: req.body.description,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Ledger Added Successfully!!",
      payload: { result: ledgerDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const deleteLedger = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const ledgerDoc = await ledgerService.deleteLedger({
      ledgerId: req.params.id,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Ledger Deleted Successfully!!",
      payload: { result: ledgerDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const downloadExcel = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Fetch ledgers from the database
      const ledgers = await Ledger.find();
      // .populate("bill_id")
      // .populate("user_id");

      // Create a new Excel workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Ledgers");

      // Define the columns for the worksheet based on the typeLedger fields
      worksheet.columns = [
        { header: "Ledger ID", key: "_id", width: 20 },
        { header: "Bill ID", key: "bill_id", width: 20 },
        { header: "User ID", key: "user_id", width: 20 },
        { header: "Bill Amount", key: "bill_amount", width: 15 },
        { header: "Payment Amount", key: "payment_amount", width: 15 },
        { header: "Type", key: "type", width: 10 },
        { header: "Description", key: "description", width: 30 },
        { header: "Invoice ID", key: "invoice_id", width: 20 },
        { header: "Created At", key: "createdAt", width: 25 },
        { header: "Updated At", key: "updatedAt", width: 25 },
      ];

      // Add rows to the worksheet
      ledgers.forEach((ledger) => {
        worksheet.addRow({
          _id: ledger._id.toString(),
          bill_id: ledger.bill_id ? ledger.bill_id.toString() : "N/A",
          user_id: ledger.user_id ? ledger.user_id.toString() : "N/A",
          bill_amount: ledger.bill_amount,
          payment_amount: ledger.payment_amount,
          type: ledger.type,
          description: ledger.description || "N/A",
          invoice_id: ledger.invoice_id || "N/A",
          createdAt: ledger.createdAt?.toISOString(),
          updatedAt: ledger.updatedAt?.toISOString(),
        });
      });

      // Set the response headers and content type for the Excel file
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", "attachment; filename=ledgers.xlsx");

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

export const ledgerController = {
  getLedger,
  addLedger,
  getLedgerList,
  updateLedger,
  deleteLedger,
  getCustomerLedgerList,
  downloadExcel,
};
