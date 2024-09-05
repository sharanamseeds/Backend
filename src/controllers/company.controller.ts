import {
  catchAsync,
  createResponseObject,
} from "../helpers/request.helpers.js";
import httpStatus from "http-status";
import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { companyService } from "../services/company.service.js";

const getCompany = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const companyDoc = await companyService.getCompany({
      companyId: req.params.id,
      query: req.query,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Company Fetched Successfully!!",
      payload: { result: companyDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const getCompanyList = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const companyDoc = await companyService.getCompanyList({
      query: req.query,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Company List Fetched Successfully!!",
      payload: { result: companyDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const updateCompany = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const companyDoc = await companyService.updateCompany({
      companyId: req.params.id,
      requestUser: req.user,
      req: req,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Company Updated Successfully!!",
      payload: { result: companyDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);
const addCompany = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const companyDoc = await companyService.addCompany({
      requestUser: req.user,
      req: req,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Company Added Successfully!!",
      payload: { result: companyDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const deleteCompany = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const companyDoc = await companyService.deleteCompany({
      companyId: req.params.id,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Company Deleted Successfully!!",
      payload: { result: companyDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

export const companyController = {
  getCompany,
  addCompany,
  getCompanyList,
  updateCompany,
  deleteCompany,
};
