import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { moduleController } from "../controllers/modules.controller.js";
const router = express.Router();
router.get("/", authenticateToken, moduleController.getModules);
router.get("/access-module", authenticateToken, moduleController.getAccessibleMenus);
const moduleRoutes = router;
export default moduleRoutes;
//# sourceMappingURL=module.routes.js.map