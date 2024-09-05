import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import CHECKPERMISSION from "../middleware/checkpermission.middleware.js";
import { permissionController } from "../controllers/permissions.controller.js";
import { permissionMiddlewareSchema } from "../validations/permission.validation.js";
import { validateViaJoi } from "../validations/joi.validation.js";
const router = express.Router();

router.get(
  "/",
  authenticateToken,
  CHECKPERMISSION([{ module: "permissions", permission: "can_read" }]), //getPermissionList
  async (req, res, next) =>
    validateViaJoi(
      permissionMiddlewareSchema.getPermissionList,
      req.query,
      req,
      res,
      next
    ),
  permissionController.getPermissionList
);

router.get(
  "/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "permissions", permission: "can_read" }]),
  permissionController.getPermission
);

router.post(
  "/",
  authenticateToken,
  CHECKPERMISSION([{ module: "permissions", permission: "can_add" }]),
  async (req, res, next) =>
    validateViaJoi(
      permissionMiddlewareSchema.addPermission,
      req.body,
      req,
      res,
      next
    ),
  permissionController.addPermission
);

router.put(
  "/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "permissions", permission: "can_update" }]),
  async (req, res, next) =>
    validateViaJoi(
      permissionMiddlewareSchema.updatePermission,
      req.body,
      req,
      res,
      next
    ),
  permissionController.updatePermission
);

router.delete(
  "/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "permissions", permission: "can_delete" }]),
  permissionController.deletePermission
);

const permissionsRoutes = router;
export default permissionsRoutes;
