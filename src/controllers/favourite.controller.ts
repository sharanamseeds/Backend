import {
  catchAsync,
  createResponseObject,
} from "../helpers/request.helpers.js";
import httpStatus from "http-status";
import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import ExcelJS from "exceljs";
import Favourite from "../models/favourite.model.js";
import { favouriteService } from "../services/favourite.service.js";

const getFavourite = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const favouriteDoc = await favouriteService.getFavourite({
      favouriteId: req.params.id,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Favourite Fetched Successfully!!",
      payload: { result: favouriteDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const getFavouriteList = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const favouriteDoc = await favouriteService.getFavouriteList({
      query: req.query,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Favourite List Fetched Successfully!!",
      payload: { result: favouriteDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);
const getUserFavouriteList = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const favouriteDoc = await favouriteService.getUserFavouriteList({
      query: req.query,
      requestUser: req.user,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Favourite List Fetched Successfully!!",
      payload: { result: favouriteDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const updateFavourite = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const favouriteDoc = await favouriteService.updateFavourite({
      favouriteId: req.params.id,
      requestUser: req.user,
      req: req,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Favourite Updated Successfully!!",
      payload: { result: favouriteDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const addFavourite = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const favouriteDoc = await favouriteService.addFavourite({
      requestUser: req.user,
      req: req,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Favourite Added Successfully!!",
      payload: { result: favouriteDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const deleteFavourite = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const favouriteDoc = await favouriteService.deleteFavourite({
      favouriteId: req.params.id,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Favourite Deleted Successfully!!",
      payload: { result: favouriteDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const downloadExcel = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Fetch favourites from the database
      const favourites = await Favourite.find();
      // .populate("user_id")
      // .populate("product_id");

      // Create a new Excel workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Favourites");

      // Define the columns for the worksheet based on the typeFavourite fields
      worksheet.columns = [
        { header: "Favourite ID", key: "_id", width: 20 },
        { header: "User ID", key: "user_id", width: 20 },
        { header: "Product ID", key: "product_id", width: 20 },
        { header: "Created At", key: "createdAt", width: 25 },
        { header: "Updated At", key: "updatedAt", width: 25 },
      ];

      // Add rows to the worksheet
      favourites.forEach((favourite) => {
        worksheet.addRow({
          _id: favourite._id.toString(),
          user_id: favourite.user_id ? favourite.user_id.toString() : "N/A",
          product_id: favourite.product_id
            ? favourite.product_id.toString()
            : "N/A",
          createdAt: favourite.createdAt?.toISOString(),
          updatedAt: favourite.updatedAt?.toISOString(),
        });
      });

      // Set the response headers and content type for the Excel file
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=favourites.xlsx"
      );

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
export const favouriteController = {
  getFavourite,
  addFavourite,
  getFavouriteList,
  updateFavourite,
  deleteFavourite,
  downloadExcel,
  getUserFavouriteList,
};
