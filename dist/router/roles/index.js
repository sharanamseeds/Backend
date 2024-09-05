import express from "express";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import CHECKPERMISSION from "../../middleware/checkpermission.middleware.js";
import { roleController } from "../../controllers/roles.controller.js";
import { roleMiddleware } from "../../validations/roles.middleware.js";
import { validateSchema } from "../../validations/index.js";
const router = express.Router();
router.get("/", authenticateToken, CHECKPERMISSION([{ module: "role", permission: "can_read" }]), roleController.getRoleList);
router.get("/:id", authenticateToken, CHECKPERMISSION([{ module: "role", permission: "can_read" }]), roleController.getRole);
router.post("/", authenticateToken, CHECKPERMISSION([{ module: "role", permission: "can_add" }]), validateSchema(roleMiddleware.addRole, "body"), roleController.addRole);
router.put("/:id", authenticateToken, CHECKPERMISSION([{ module: "role", permission: "can_update" }]), validateSchema(roleMiddleware.updateRole, "body"), roleController.updateRole);
router.delete("/:id", authenticateToken, CHECKPERMISSION([{ module: "role", permission: "can_delete" }]), roleController.deleteRole);
const rolesRoutes = router;
export default rolesRoutes;
//# sourceMappingURL=index.js.map