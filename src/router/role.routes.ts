import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import CHECKPERMISSION from "../middleware/checkpermission.middleware.js";
import { roleController } from "../controllers/roles.controller.js";
import { roleMiddlewareSchemas } from "../validations/role.validation.js";
import { validateViaJoi } from "../validations/joi.validation.js";

const router = express.Router();

router.get(
  "/",
  authenticateToken,
  CHECKPERMISSION([{ module: "role", permission: "can_read" }]),
  roleController.getRoleList
);

router.get(
  "/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "role", permission: "can_read" }]),
  roleController.getRole
);

router.post(
  "/",
  authenticateToken,
  CHECKPERMISSION([{ module: "role", permission: "can_add" }]),
  async (req, res, next) =>
    validateViaJoi(roleMiddlewareSchemas.addRole, req.body, req, res, next),
  roleController.addRole
);

router.put(
  "/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "role", permission: "can_update" }]),
  async (req, res, next) =>
    validateViaJoi(roleMiddlewareSchemas.updateRole, req.body, req, res, next),
  roleController.updateRole
);

router.delete(
  "/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "role", permission: "can_delete" }]),
  roleController.deleteRole
);

const rolesRoutes = router;
export default rolesRoutes;
