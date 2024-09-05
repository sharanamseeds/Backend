import {
  catchAsync,
  createResponseObject,
} from "../helpers/request.helpers.js";
import httpStatus from "http-status";
import { languageService } from "../services/languages.service.js";
import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

const getLanguage = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const languageDoc = await languageService.getLanguage({
      languageId: req.params.id,
      query: req.query,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Language Fetched Successfully!!",
      payload: { result: languageDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const getLanguageList = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const languageDoc = await languageService.getLanguageList({
      query: req.query,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Language List Fetched Successfully!!",
      payload: { result: languageDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const updateLanguage = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const languageDoc = await languageService.updateLanguage({
      languageId: req.params.id,
      requestUser: req.user,
      req: req
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Language Updated Successfully!!",
      payload: { result: languageDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);
const addLanguage = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const languageDoc = await languageService.addLanguage({
      requestUser: req.user,
      req: req
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Language Added Successfully!!",
      payload: { result: languageDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const deleteLanguage = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const languageDoc = await languageService.deleteLanguage({
      languageId: req.params.id,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Language Deleted Successfully!!",
      payload: { result: languageDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

export const languageController = {
  getLanguage,
  addLanguage,
  getLanguageList,
  updateLanguage,
  deleteLanguage,
};
