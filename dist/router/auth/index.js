import express from "express";
import { authController } from "../../controllers/auth.controller.js";
import { authMiddleware } from "../../validations/auth.middleware.js";
import { validateSchema } from "../../validations/index.js";
const router = express.Router();
router.post("/login", validateSchema(authMiddleware.userLogin, "body"), authController.login);
router.post("/register", validateSchema(authMiddleware.register, "body"), authController.register);
router.post("/change_password", validateSchema(authMiddleware.changePassword, "body"), authController.changePassword);
router.post("/refresh_token", validateSchema(authMiddleware.refreshUserToken, "body"), authController.refreshUserToken);
router.post("/send_verification_code", validateSchema(authMiddleware.sendVerificationCode, "body"), authController.sendVerificationCode);
router.post("/resend_verification_code", validateSchema(authMiddleware.sendVerificationCode, "body"), authController.reSendVerificationCode);
router.post("/verify_verification_code", validateSchema(authMiddleware.verifyVerificationCode, "body"), authController.verifyVerificationCode);
export default router;
//# sourceMappingURL=index.js.map