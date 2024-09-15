import {
  catchAsync,
  createResponseObject,
} from "../helpers/request.helpers.js";
import httpStatus from "http-status";
import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { authService } from "../services/auth.service.js";

const login = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const payload = await authService.login({
    email: req.body.email,
    password: req.body.password,
  });

  const data4responseObject = {
    req: req,
    code: httpStatus.OK,
    message: "Login successful",
    payload: payload,
    logPayload: false,
  };

  res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
});

const register = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const payload = await authService.register({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
      confirm_password: req.body.confirm_password,
      gst_number: req.body.gst_number,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "User Created Succesfully",
      payload: payload,
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const loginApp = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const payload = await authService.loginApp({
      email: req.body.email,
      password: req.body.password,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Login successful",
      payload: payload,
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const registerApp = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const payload = await authService.registerApp({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
      confirm_password: req.body.confirm_password,
      gst_number: req.body.gst_number,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "User Created Succesfully",
      payload: payload,
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const changePassword = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const payload = await authService.changePassword({
      email: req.body.email,
      new_password: req.body.new_password,
      confirm_password: req.body.confirm_password,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Password Changed Successfully",
      payload: payload,
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const refreshUserToken = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const payload = await authService.refreshUserToken({
      refreshToken: req.body.refreshToken,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Token Refreshed Successfully",
      payload: payload,
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);
const sendVerificationCode = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const payload = await authService.sendVerificationCode({
      email: req.body.email,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Verification Code Sent Successfully",
      payload: payload,
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);
const reSendVerificationCode = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const payload = await authService.reSendVerificationCode({
      email: req.body.email,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Verification Code Sent Successfully",
      payload: payload,
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);
const verifyVerificationCode = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const payload = await authService.verifyVerificationCode({
      email: req.body.email,
      verification_code: req.body.verification_code,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Code Is Verified Successfully",
      payload: payload,
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

export const authController = {
  login,
  register,
  loginApp,
  registerApp,
  changePassword,
  refreshUserToken,
  sendVerificationCode,
  reSendVerificationCode,
  verifyVerificationCode,
};
