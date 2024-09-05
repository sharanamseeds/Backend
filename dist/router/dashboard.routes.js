import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import CHECKPERMISSION from "../middleware/checkpermission.middleware.js";
import { dashboardController } from "../controllers/dashboard.controller.js";
const router = express.Router();
router.get("/", authenticateToken, CHECKPERMISSION([{ module: "dashboard", permission: "can_read" }]), dashboardController.getDashboard);
const dashboardRoutes = router;
export default dashboardRoutes;
//# sourceMappingURL=dashboard.routes.js.map