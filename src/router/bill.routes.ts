import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import CHECKPERMISSION from "../middleware/checkpermission.middleware.js";
import { billController } from "../controllers/bills.controllers.js";
import { validateViaJoi } from "../validations/joi.validation.js";
import { billMiddlewareSchemas } from "../validations/bill.validation.js";
const router = express.Router();

router.get(
  "/download-excel",
  authenticateToken,
  CHECKPERMISSION([{ module: "bill", permission: "can_download" }]),
  billController.downloadExcel
);

router.get(
  "/download-bill/:id",
  // authenticateToken,
  // CHECKPERMISSION([{ module: "bill", permission: "can_download" }]),
  billController.downloadBill
);

router.get(
  "/",
  authenticateToken,
  CHECKPERMISSION([{ module: "bill", permission: "can_read" }]),
  billController.getBillList
);
router.get(
  "/user/",
  authenticateToken,
  CHECKPERMISSION([{ module: "bill", permission: "can_read" }]),
  billController.getCustomerBillList
);

router.get(
  "/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "bill", permission: "can_read" }]),
  billController.getBill
);

// router.post(
//   "/",
//   authenticateToken,
//   CHECKPERMISSION([{ module: "bill", permission: "can_add" }]),
//   validateSchema(billMiddleware.addBill, "body"),
//   billController.addBill
// );

router.put(
  "/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "bill", permission: "can_update" }]),
  async (req, res, next) => {
    let validationData = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(
      billMiddlewareSchemas.updateBill,
      validationData,
      req,
      res,
      next
    );
  },
  billController.updateBill
);

// router.delete(
//   "/:id",
//   authenticateToken,
//   CHECKPERMISSION([{ module: "bill", permission: "can_delete" }]),
//   billController.deleteBill
// );

const billsRoutes = router;
export default billsRoutes;
