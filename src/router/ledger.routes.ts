import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import CHECKPERMISSION from "../middleware/checkpermission.middleware.js";
import { ledgerController } from "../controllers/ledgers.controllers.js";
const router = express.Router();

router.get(
  "/download-excel",
  authenticateToken,
  CHECKPERMISSION([{ module: "ledger", permission: "can_download" }]),
  ledgerController.downloadExcel
);

router.get(
  "/",
  authenticateToken,
  CHECKPERMISSION([{ module: "ledger", permission: "can_read" }]),
  ledgerController.getLedgerList
);

router.get(
  "/user/",
  authenticateToken,
  CHECKPERMISSION([{ module: "ledger", permission: "can_read" }]),
  ledgerController.getCustomerLedgerList
);

router.get(
  "/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "ledger", permission: "can_read" }]),
  ledgerController.getLedger
);

// router.post(
//   "/",
//   authenticateToken,
//   CHECKPERMISSION([{ module: "ledger", permission: "can_add" }]),
//   validateSchema(ledgerMiddleware.addLedger, "body"),
//   ledgerController.addLedger
// );

// router.put(
//   "/:id",
//   authenticateToken,
//   CHECKPERMISSION([{ module: "ledger", permission: "can_update" }]),
//   validateSchema(ledgerMiddleware.updateLedger, "body"),
//   ledgerController.updateLedger
// );

// router.delete(
//   "/:id",
//   authenticateToken,
//   CHECKPERMISSION([{ module: "ledger", permission: "can_delete" }]),
//   ledgerController.deleteLedger
// );

const ledgersRoutes = router;
export default ledgersRoutes;
