import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import CHECKPERMISSION from "../middleware/checkpermission.middleware.js";
import { companyController } from "../controllers/company.controller.js";
import { validateViaJoi } from "../validations/joi.validation.js";
import { companyMiddlewareSchemas } from "../validations/company.validation.js";
const router = express.Router();

router.get(
  "/",
  authenticateToken,
  CHECKPERMISSION([{ module: "company", permission: "can_read" }]),
  companyController.getCompanyList
);

router.get(
  "/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "company", permission: "can_read" }]),
  companyController.getCompany
);

router.post(
  "/",
  authenticateToken,
  CHECKPERMISSION([{ module: "company", permission: "can_add" }]),
  async (req, res, next) =>
    validateViaJoi(
      companyMiddlewareSchemas.addCompany,
      req.body,
      req,
      res,
      next
    ),
  companyController.addCompany
);

router.put(
  "/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "company", permission: "can_update" }]),
  async (req, res, next) =>
    validateViaJoi(
      companyMiddlewareSchemas.updateCompany,
      req.body,
      req,
      res,
      next
    ),
  companyController.updateCompany
);

router.delete(
  "/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "company", permission: "can_delete" }]),
  companyController.deleteCompany
);

const companyRoutes = router;
export default companyRoutes;
