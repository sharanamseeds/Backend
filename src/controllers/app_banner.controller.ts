import {
  catchAsync,
  createResponseObject,
} from "../helpers/request.helpers.js";
import httpStatus from "http-status";
import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { appBannerService } from "../services/app_banner.service.js";

const getAppBanner = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const bannerDoc = await appBannerService.getAppBanner({
      req: req,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Banner Fetched Successfully!!",
      payload: { result: bannerDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);
const updateAppBanner = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const bannerDoc = await appBannerService.updateAppBanner({
      bannerId: req.params.id,
      req: req,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Banner Updated Successfully!!",
      payload: { result: bannerDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);
const deleteAppBannerImage = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    let bodyData: any = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      bodyData = JSON.parse(req.query.payload);
    }

    const bannerDoc = await appBannerService.deleteAppBannerImage({
      bannerId: req.params.id,
      src: bodyData.src,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Banner Image Deleted Successfully!!",
      payload: { result: bannerDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

export const appBannerController = {
  updateAppBanner,
  deleteAppBannerImage,
  getAppBanner,
};
