import {
  catchAsync,
  createResponseObject,
} from "../helpers/request.helpers.js";
import httpStatus from "http-status";
import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { dashboardService } from "../services/dashboard.service.js";

const getDashboard = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const dashboardDoc = await dashboardService.getDashboard({
      query: req.query,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Dashboard Fetched Successfully!!",
      payload: { result: dashboardDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

export const dashboardController = {
  getDashboard,
};
