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
import { companyController } from "../controllers/company.controller.js";
import { validateViaJoi } from "../validations/joi.validation.js";
import { companyMiddlewareSchemas } from "../validations/company.validation.js";
const router = express.Router();
router.get("/", authenticateToken, CHECKPERMISSION([{ module: "company", permission: "can_read" }]), companyController.getCompanyList);
router.get("/:id", authenticateToken, CHECKPERMISSION([{ module: "company", permission: "can_read" }]), companyController.getCompany);
router.post("/", authenticateToken, CHECKPERMISSION([{ module: "company", permission: "can_add" }]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return validateViaJoi(companyMiddlewareSchemas.addCompany, req.body, req, res, next);
}), companyController.addCompany);
router.put("/:id", authenticateToken, CHECKPERMISSION([{ module: "company", permission: "can_update" }]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return validateViaJoi(companyMiddlewareSchemas.updateCompany, req.body, req, res, next);
}), companyController.updateCompany);
router.delete("/:id", authenticateToken, CHECKPERMISSION([{ module: "company", permission: "can_delete" }]), companyController.deleteCompany);
const companyRoutes = router;
export default companyRoutes;
//# sourceMappingURL=company.routes.js.map