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
import { authenticateToken } from "../middleware/auth.middleware.js";
import CHECKPERMISSION from "../middleware/checkpermission.middleware.js";
import { appBannerController } from "../controllers/app_banner.controller.js";
import { validateViaJoi } from "../validations/joi.validation.js";
import { appBannerMiddlewareSchemas } from "../validations/app_banner.validation.js";
const router = express.Router();
// updateAppBanner,
// deleteAppBannerImage,
// getAppBanner,
router.get("/", authenticateToken, CHECKPERMISSION([{ module: "app banner", permission: "can_read" }]), appBannerController.getAppBanner);
router.get("/user/", authenticateToken, appBannerController.getAppBanner);
router.put("/:id", authenticateToken, CHECKPERMISSION([{ module: "app banner", permission: "can_update" }]), appBannerController.updateAppBanner);
router.put("/delete_image/:id", authenticateToken, CHECKPERMISSION([{ module: "app banner", permission: "can_delete" }]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let validationData = {};
    if (((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.payload) && typeof req.query.payload === "string") {
        validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(appBannerMiddlewareSchemas.deleteAppBannerImage, validationData, req, res, next);
}), appBannerController.deleteAppBannerImage);
router.put("/delete_bottom_image/:id", authenticateToken, CHECKPERMISSION([{ module: "app banner", permission: "can_delete" }]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    let validationData = {};
    if (((_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.payload) && typeof req.query.payload === "string") {
        validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(appBannerMiddlewareSchemas.deleteAppBannerImage, validationData, req, res, next);
}), appBannerController.deleteAppBannerBottomImage);
const appBannerRoutes = router;
export default appBannerRoutes;
//# sourceMappingURL=app_banner.routes.js.map