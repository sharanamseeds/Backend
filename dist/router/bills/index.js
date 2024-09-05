import express from "express";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import CHECKPERMISSION from "../../middleware/checkpermission.middleware.js";
import { billController } from "../../controllers/bills.controllers.js";
import { validateSchema } from "../../validations/index.js";
import { billMiddleware } from "../../validations/bill.middleware.js";
const router = express.Router();
router.get("/", authenticateToken, CHECKPERMISSION([{ module: "bill", permission: "can_read" }]), billController.getBillList);
router.get("/user/", authenticateToken, CHECKPERMISSION([{ module: "bill", permission: "can_read" }]), billController.getCustomerBillList);
router.get("/:id", authenticateToken, CHECKPERMISSION([{ module: "bill", permission: "can_read" }]), billController.getBill);
// router.post(
//   "/",
//   authenticateToken,
//   CHECKPERMISSION([{ module: "bill", permission: "can_add" }]),
//   validateSchema(billMiddleware.addBill, "body"),
//   billController.addBill
// );
router.put("/:id", authenticateToken, CHECKPERMISSION([{ module: "bill", permission: "can_update" }]), validateSchema(billMiddleware.updateBill, "body"), billController.updateBill);
// router.delete(
//   "/:id",
//   authenticateToken,
//   CHECKPERMISSION([{ module: "bill", permission: "can_delete" }]),
//   billController.deleteBill
// );
const billsRoutes = router;
export default billsRoutes;
//# sourceMappingURL=index.js.map