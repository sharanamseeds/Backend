import {
  catchAsync,
  createResponseObject,
} from "../helpers/request.helpers.js";
import httpStatus from "http-status";
import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { moneyService } from "../services/money.service.js";
import ExcelJS from "exceljs";
import Money from "../models/money.model.js";

const getMoney = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const moneyDoc = await moneyService.getMoney({
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
  }
);

const getMoneyList = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const moneyDoc = await moneyService.getMoneyList({
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
  }
);

const addMoney = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    let bodyData: any = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      bodyData = JSON.parse(req.query.payload);
    }

    const moneyDoc = await moneyService.addMoney({
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
  }
);

const updateMoney = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    let bodyData: any = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      bodyData = JSON.parse(req.query.payload);
    }

    const moneyDoc = await moneyService.updateMoney({
      moneyId: req.params.id,
      requestUser: req.user,
      ...bodyData,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Money  Updated Successfully!!",
      payload: { result: moneyDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const deleteMoney = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const moneyDoc = await moneyService.deleteMoney({
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
  }
);

const downloadMoneyExcel = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Fetch money s from the database
      const moneys = await Money.find();

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
        worksheet.addRow({
          _id: money._id.toString(),
          user_id: money.user_id ? money.user_id.toString() : "N/A",
          amount: money.amount || "N/A",
          description: money.description || "N/A",
          createdAt: money.createdAt?.toISOString(),
          updatedAt: money.updatedAt?.toISOString(),
        });
      });

      // Set the response headers and content type for the Excel file
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", "attachment; filename=money_s.xlsx");

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

export const moneyController = {
  getMoney,
  addMoney,
  getMoneyList,
  updateMoney,
  deleteMoney,
  downloadMoneyExcel,
};
