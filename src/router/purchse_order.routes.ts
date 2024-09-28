import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import CHECKPERMISSION from "../middleware/checkpermission.middleware.js";
import { validateViaJoi } from "../validations/joi.validation.js";
import { purchaseOrderMiddlewareSchemas } from "../validations/purchase_orders.validation.js";
import { purchaseOrderController } from "../controllers/purchse_order.cotroller.js";

const router = express.Router();

/* Download purchase orders as Excel */
router.get(
  "/download-excel",
  authenticateToken,
  CHECKPERMISSION([{ module: "purchase order", permission: "can_download" }]),
  purchaseOrderController.downloadExcel
);

router.get(
  "/download_pdf/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "purchase order", permission: "can_download" }]),
  purchaseOrderController.downloadPdf
);

/* Get a specific purchase order by ID */
router.get(
  "/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "purchase order", permission: "can_read" }]),
  purchaseOrderController.getPurchaseOrder
);

/* Get all purchase orders */
router.get(
  "/",
  authenticateToken,
  CHECKPERMISSION([{ module: "purchase order", permission: "can_read" }]),
  purchaseOrderController.getPurchaseOrderList
);

/* Create a new purchase order */
router.post(
  "/",
  authenticateToken,
  CHECKPERMISSION([{ module: "purchase order", permission: "can_add" }]),
  async (req, res, next) => {
    let validationData = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(
      purchaseOrderMiddlewareSchemas.addPurchaseOrderSchema,
      validationData,
      req,
      res,
      next
    );
  },
  purchaseOrderController.addPurchaseOrder
);

/* Update an existing purchase order */
router.put(
  "/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "purchase order", permission: "can_update" }]),
  async (req, res, next) => {
    let validationData = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(
      purchaseOrderMiddlewareSchemas.updatePurchaseOrderSchema,
      validationData,
      req,
      res,
      next
    );
  },
  purchaseOrderController.updatePurchaseOrder
);

/* Delete a purchase order */
router.delete(
  "/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "purchase order", permission: "can_delete" }]),
  purchaseOrderController.deletePurchaseOrder
);

const purchaseOrderRoutes = router;
export default purchaseOrderRoutes;
