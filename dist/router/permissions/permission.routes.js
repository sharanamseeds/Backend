import express from "express";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import CHECKPERMISSION from "../../middleware/checkpermission.middleware.js";
import { validateSchema } from "../../validations/index.js";
import { permissionController } from "../../controllers/permissions.controller.js";
import { permissionMiddleware } from "../../validations/permission.middleware.js";
const router = express.Router();
router.get("/", authenticateToken, CHECKPERMISSION([{ module: "permissions", permission: "can_read" }]), //getPermissionList
validateSchema(permissionMiddleware.getPermissionList, "query"), permissionController.getPermissionList);
router.get("/:id", authenticateToken, CHECKPERMISSION([{ module: "permissions", permission: "can_read" }]), permissionController.getPermission);
router.post("/", authenticateToken, CHECKPERMISSION([{ module: "permissions", permission: "can_add" }]), validateSchema(permissionMiddleware.addPermission, "body"), permissionController.addPermission);
router.put("/:id", authenticateToken, CHECKPERMISSION([{ module: "permissions", permission: "can_update" }]), validateSchema(permissionMiddleware.updatePermission, "body"), permissionController.updatePermission);
router.delete("/:id", authenticateToken, CHECKPERMISSION([{ module: "permissions", permission: "can_delete" }]), permissionController.deletePermission);
const permissionsRoutes = router;
export default permissionsRoutes;
//# sourceMappingURL=permission.routes.js.map