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
import { permissionController } from "../controllers/permissions.controller.js";
import { permissionMiddlewareSchema } from "../validations/permission.validation.js";
import { validateViaJoi } from "../validations/joi.validation.js";
const router = express.Router();
router.get("/", authenticateToken, CHECKPERMISSION([{ module: "permissions", permission: "can_read" }]), //getPermissionList
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return validateViaJoi(permissionMiddlewareSchema.getPermissionList, req.query, req, res, next);
}), permissionController.getPermissionList);
router.get("/:id", authenticateToken, CHECKPERMISSION([{ module: "permissions", permission: "can_read" }]), permissionController.getPermission);
router.post("/", authenticateToken, CHECKPERMISSION([{ module: "permissions", permission: "can_add" }]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return validateViaJoi(permissionMiddlewareSchema.addPermission, req.body, req, res, next);
}), permissionController.addPermission);
router.put("/:id", authenticateToken, CHECKPERMISSION([{ module: "permissions", permission: "can_update" }]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return validateViaJoi(permissionMiddlewareSchema.updatePermission, req.body, req, res, next);
}), permissionController.updatePermission);
router.delete("/:id", authenticateToken, CHECKPERMISSION([{ module: "permissions", permission: "can_delete" }]), permissionController.deletePermission);
const permissionsRoutes = router;
export default permissionsRoutes;
//# sourceMappingURL=permission.routes.js.map