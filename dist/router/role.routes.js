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
import { roleController } from "../controllers/roles.controller.js";
import { roleMiddlewareSchemas } from "../validations/role.validation.js";
import { validateViaJoi } from "../validations/joi.validation.js";
const router = express.Router();
router.get("/", authenticateToken, CHECKPERMISSION([{ module: "role", permission: "can_read" }]), roleController.getRoleList);
router.get("/:id", authenticateToken, CHECKPERMISSION([{ module: "role", permission: "can_read" }]), roleController.getRole);
router.post("/", authenticateToken, CHECKPERMISSION([{ module: "role", permission: "can_add" }]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return validateViaJoi(roleMiddlewareSchemas.addRole, req.body, req, res, next); }), roleController.addRole);
router.put("/:id", authenticateToken, CHECKPERMISSION([{ module: "role", permission: "can_update" }]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return validateViaJoi(roleMiddlewareSchemas.updateRole, req.body, req, res, next); }), roleController.updateRole);
router.delete("/:id", authenticateToken, CHECKPERMISSION([{ module: "role", permission: "can_delete" }]), roleController.deleteRole);
const rolesRoutes = router;
export default rolesRoutes;
//# sourceMappingURL=role.routes.js.map