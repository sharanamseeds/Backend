import {
  catchAsync,
  createResponseObject,
} from "../helpers/request.helpers.js";
import httpStatus from "http-status";
import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { permissionService } from "../services/permissions.service.js";

const getPermission = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const permissionDoc = await permissionService.getPermission({
      permissionId: req.params.id,
      query: req.query,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Permission Fetched Successfully!!",
      payload: { result: permissionDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const getPermissionList = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const permissionDoc = await permissionService.getPermissionList({
      query: req.query,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Permission List Fetched Successfully!!",
      payload: { result: permissionDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const updatePermission = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const permissionDoc = await permissionService.updatePermission({
      permissionId: req.params.id,
      requestUser: req.user,
      req: req,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Permission Updated Successfully!!",
      payload: { result: permissionDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);
const addPermission = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const permissionDoc = await permissionService.addPermission({
      requestUser: req.user,
      req: req,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Permission Added Successfully!!",
      payload: { result: permissionDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const deletePermission = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const permissionDoc = await permissionService.deletePermission({
      permissionId: req.params.id,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Permission Deleted Successfully!!",
      payload: { result: permissionDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

export const permissionController = {
  getPermission,
  addPermission,
  getPermissionList,
  updatePermission,
  deletePermission,
};
