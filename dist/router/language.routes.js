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
import { languageController } from "../controllers/languages.controller.js";
import { validateViaJoi } from "../validations/joi.validation.js";
import { languageMiddlewareSchemas } from "../validations/language.validation.js";
const router = express.Router();
router.get("/", authenticateToken, CHECKPERMISSION([{ module: "language", permission: "can_read" }]), languageController.getLanguageList);
router.get("/:id", authenticateToken, CHECKPERMISSION([{ module: "language", permission: "can_read" }]), languageController.getLanguage);
router.post("/", authenticateToken, CHECKPERMISSION([{ module: "language", permission: "can_add" }]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return validateViaJoi(languageMiddlewareSchemas.addLanguage, req.body, req, res, next);
}), languageController.addLanguage);
router.put("/:id", authenticateToken, CHECKPERMISSION([{ module: "language", permission: "can_update" }]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return validateViaJoi(languageMiddlewareSchemas.updateLanguage, req.body, req, res, next);
}), languageController.updateLanguage);
router.delete("/:id", authenticateToken, CHECKPERMISSION([{ module: "language", permission: "can_delete" }]), languageController.deleteLanguage);
const languagesRoutes = router;
export default languagesRoutes;
//# sourceMappingURL=language.routes.js.map