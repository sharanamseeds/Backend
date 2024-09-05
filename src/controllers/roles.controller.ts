import {
  catchAsync,
  createResponseObject,
} from "../helpers/request.helpers.js";
import httpStatus from "http-status";
import { roleService } from "../services/roles.service.js";
import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

const getRole = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const roleDoc = await roleService.getRole({
    roleId: req.params.id,
    query: req.query,
  });

  const data4responseObject = {
    req: req,
    code: httpStatus.OK,
    message: "Role Fetched Successfully!!",
    payload: { result: roleDoc },
    logPayload: false,
  };

  res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
});

const getRoleList = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const roleDoc = await roleService.getRoleList({
      query: req.query,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Role List Fetched Successfully!!",
      payload: { result: roleDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const updateRole = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const roleDoc = await roleService.updateRole({
      roleId: req.params.id,
      requestUser: req.user,
      req: req,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Role Updated Successfully!!",
      payload: { result: roleDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);
const addRole = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const roleDoc = await roleService.addRole({
    requestUser: req.user,
    req: req,
  });

  const data4responseObject = {
    req: req,
    code: httpStatus.OK,
    message: "Role Added Successfully!!",
    payload: { result: roleDoc },
    logPayload: false,
  };

  res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
});

const deleteRole = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const roleDoc = await roleService.deleteRole({
      roleId: req.params.id,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Role Deleted Successfully!!",
      payload: { result: roleDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

export const roleController = {
  getRole,
  addRole,
  getRoleList,
  updateRole,
  deleteRole,
};
