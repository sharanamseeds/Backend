import { Request, Response, NextFunction } from "express";
import path from "path";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

interface ResponseObject {
  code: number;
  message: string;
  logPayload: boolean;
  payload: Record<string, any>;
}

interface CreateResponseObjectParams {
  req: AuthenticatedRequest;
  message?: string;
  payload?: Record<string, any>;
  code: number;
  logPayload: boolean;
}

export const catchAsync = (
  fn: (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => Promise<any>
) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: any) => next(err));
  };
};

export const createResponseObject = ({
  req,
  message = "",
  payload = {},
  code,
  logPayload,
}: CreateResponseObjectParams): ResponseObject => {
  const locale = req.headers.locale ? req.headers.locale.toString() : "en";

  return { code, message, logPayload, payload };
};
