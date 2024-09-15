var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import { authController } from "../controllers/auth.controller.js";
import { authMiddlewareSchemas } from "../validations/auth.validation.js";
import { validateViaJoi } from "../validations/joi.validation.js";
const router = express.Router();
router.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return validateViaJoi(authMiddlewareSchemas.userLoginSchema, req.body, req, res, next);
}), authController.login);
router.post("/register", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return validateViaJoi(authMiddlewareSchemas.registerSchema, req.body, req, res, next);
}), authController.register);
router.post("/user/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return validateViaJoi(authMiddlewareSchemas.userLoginSchema, req.body, req, res, next);
}), authController.loginApp);
router.post("/user/register", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return validateViaJoi(authMiddlewareSchemas.registerSchema, req.body, req, res, next);
}), authController.registerApp);
router.post("/change_password", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return validateViaJoi(authMiddlewareSchemas.changePasswordSchema, req.body, req, res, next);
}), authController.changePassword);
router.post("/refresh_token", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return validateViaJoi(authMiddlewareSchemas.refreshUserTokenSchema, req.body, req, res, next);
}), authController.refreshUserToken);
router.post("/send_verification_code", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return validateViaJoi(authMiddlewareSchemas.sendVerificationCodeSchema, req.body, req, res, next);
}), authController.sendVerificationCode);
router.post("/resend_verification_code", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return validateViaJoi(authMiddlewareSchemas.sendVerificationCodeSchema, req.body, req, res, next);
}), authController.reSendVerificationCode);
router.post("/verify_verification_code", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return validateViaJoi(authMiddlewareSchemas.verifyVerificationCodeSchema, req.body, req, res, next);
}), authController.verifyVerificationCode);
export default router;
//# sourceMappingURL=auth.routes.js.map