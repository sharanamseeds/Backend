import express from "express";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import { orderController } from "../../controllers/orders.controller.js";
import { orderMiddleware } from "../../validations/orders.middleware.js";
import { validateSchema } from "../../validations/index.js";
import CHECKPERMISSION from "../../middleware/checkpermission.middleware.js";
const router = express.Router();
router.get("/", authenticateToken, CHECKPERMISSION([{ module: "order", permission: "can_read" }]), orderController.getOrderList);
router.get("/user/", authenticateToken, CHECKPERMISSION([{ module: "order", permission: "can_read" }]), orderController.getCustomerOrderList);
router.get("/:id", authenticateToken, CHECKPERMISSION([{ module: "order", permission: "can_read" }]), orderController.getOrder);
router.post("/", authenticateToken, CHECKPERMISSION([{ module: "order", permission: "can_add" }]), validateSchema(orderMiddleware.addOrder, "body"), orderController.addOrder);
router.put("/:id", authenticateToken, CHECKPERMISSION([{ module: "order", permission: "can_update" }]), validateSchema(orderMiddleware.updateOrder, "body"), orderController.updateOrder);
// router.delete(
//   "/:id",
//   authenticateToken,
//   CHECKPERMISSION([{ module: "order", permission: "can_delete" }]),
//   orderController.deleteOrder
// );
const ordersRoutes = router;
export default ordersRoutes;
//# sourceMappingURL=index.js.map