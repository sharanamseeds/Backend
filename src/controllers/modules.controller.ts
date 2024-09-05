import {
    catchAsync,
    createResponseObject,
  } from "../helpers/request.helpers.js";
  import httpStatus from "http-status";
  import { moduleService } from "../services/module.service.js";
  import { Response } from "express";
  import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
  
  const getAccessibleMenus = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const roleDoc = await moduleService.getAccessibleMenus({
        user: req.user
    });
  
    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Menu Fetched Successfully!!",
      payload: { result: roleDoc },
      logPayload: false,
    };
  
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  });
  
  const getModules = catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
      const roleDoc = await moduleService.getModules({
        user: req.user,
      });
  
      const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Menu List Fetched Successfully!!",
        payload: { result: roleDoc },
        logPayload: false,
      };
  
      res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
    }
  );
  
  export const moduleController = {
    getAccessibleMenus,
    getModules
  };
  