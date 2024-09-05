import express from "express";
import { authController } from "../controllers/auth.controller.js";
import { authMiddlewareSchemas } from "../validations/auth.validation.js";
import { validateViaJoi } from "../validations/joi.validation.js";

const router = express.Router();

router.post(
  "/login",
  async (req, res, next) =>
    validateViaJoi(
      authMiddlewareSchemas.userLoginSchema,
      req.body,
      req,
      res,
      next
    ),
  authController.login
);

router.post(
  "/register",
  async (req, res, next) =>
    validateViaJoi(
      authMiddlewareSchemas.registerSchema,
      req.body,
      req,
      res,
      next
    ),
  authController.register
);

router.post(
  "/change_password",
  async (req, res, next) =>
    validateViaJoi(
      authMiddlewareSchemas.changePasswordSchema,
      req.body,
      req,
      res,
      next
    ),
  authController.changePassword
);

router.post(
  "/refresh_token",
  async (req, res, next) =>
    validateViaJoi(
      authMiddlewareSchemas.refreshUserTokenSchema,
      req.body,
      req,
      res,
      next
    ),
  authController.refreshUserToken
);

router.post(
  "/send_verification_code",
  async (req, res, next) =>
    validateViaJoi(
      authMiddlewareSchemas.sendVerificationCodeSchema,
      req.body,
      req,
      res,
      next
    ),
  authController.sendVerificationCode
);

router.post(
  "/resend_verification_code",
  async (req, res, next) =>
    validateViaJoi(
      authMiddlewareSchemas.sendVerificationCodeSchema,
      req.body,
      req,
      res,
      next
    ),
  authController.reSendVerificationCode
);

router.post(
  "/verify_verification_code",
  async (req, res, next) =>
    validateViaJoi(
      authMiddlewareSchemas.verifyVerificationCodeSchema,
      req.body,
      req,
      res,
      next
    ),
  authController.verifyVerificationCode
);

export default router;
