import express from "express";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import CHECKPERMISSION from "../../middleware/checkpermission.middleware.js";
import { validateSchema } from "../../validations/index.js";
import { companyMiddleware } from "../../validations/company.middleware.js";
import { companyController } from "../../controllers/company.controller.js";
const router = express.Router();
router.get("/", authenticateToken, CHECKPERMISSION([{ module: "company", permission: "can_read" }]), companyController.getCompanyList);
router.get("/:id", authenticateToken, CHECKPERMISSION([{ module: "company", permission: "can_read" }]), companyController.getCompany);
router.post("/", authenticateToken, CHECKPERMISSION([{ module: "company", permission: "can_add" }]), validateSchema(companyMiddleware.addCompany, "body"), companyController.addCompany);
router.put("/:id", authenticateToken, CHECKPERMISSION([{ module: "company", permission: "can_update" }]), validateSchema(companyMiddleware.updateCompany, "body"), companyController.updateCompany);
router.delete("/:id", authenticateToken, CHECKPERMISSION([{ module: "company", permission: "can_delete" }]), companyController.deleteCompany);
const companyRoutes = router;
export default companyRoutes;
//# sourceMappingURL=index.js.map