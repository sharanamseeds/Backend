import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../helpers/auth.helpers.js";
import Role from "../models/roles.model.js";
import User, { typeUser as UserModel } from "../models/users.model.js"; // Adjust the path as per your project structure
import jwt from "jsonwebtoken";
import Languages from "../models/languages.model.js";
import { masterConfig } from "../config/master.config.js";

export interface AuthenticatedRequest extends Request {
  requestId: any;
  user?: UserModel;
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.query.lang_code) {
    const englishLanguageDoc = await Languages.findOne({
      identifier: "english",
    });
    req.query.lang_code = req.query.lang_code || englishLanguageDoc.lang_code;
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token is required" });

  let decoded;
  try {
    decoded = verifyToken(token, masterConfig.authConfig.ACCESS_TOKEN_SECRET);
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(403).json({ message: "Token has expired" });
    } else if (err instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ message: "Token is invalid" });
    } else {
      return res.status(403).json({ message: "Token verification failed" });
    }
  }

  try {
    req.user = await User.findById(decoded.userId);
    if (!req.user) return res.status(404).json({ message: "User not found" });
    next();
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkPermission = (entity, action) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const { user } = req;

    if (!user)
      return res.status(401).json({ message: "User is not authenticated" });

    const usersRoles = await Role.findById(user.role_id);
    const permissions = [];

    if (permissions[entity] && permissions[entity][action]) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden: Insufficient permissions" });
    }
  };
};
