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
import { validateViaJoi } from "../validations/joi.validation.js";
import { purchaseOrderMiddlewareSchemas } from "../validations/purchase_orders.validation.js";
import { purchaseOrderController } from "../controllers/purchse_order.cotroller.js";
const router = express.Router();
/* Download purchase orders as Excel */
router.get("/download-excel", authenticateToken, CHECKPERMISSION([{ module: "purchase order", permission: "can_download" }]), purchaseOrderController.downloadExcel);
router.get("/download_pdf/:id", authenticateToken, CHECKPERMISSION([{ module: "purchase order", permission: "can_download" }]), purchaseOrderController.downloadPdf);
/* Get a specific purchase order by ID */
router.get("/:id", authenticateToken, CHECKPERMISSION([{ module: "purchase order", permission: "can_read" }]), purchaseOrderController.getPurchaseOrder);
/* Get all purchase orders */
router.get("/", authenticateToken, CHECKPERMISSION([{ module: "purchase order", permission: "can_read" }]), purchaseOrderController.getPurchaseOrderList);
/* Create a new purchase order */
router.post("/", authenticateToken, CHECKPERMISSION([{ module: "purchase order", permission: "can_add" }]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let validationData = {};
    if (((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.payload) && typeof req.query.payload === "string") {
        validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(purchaseOrderMiddlewareSchemas.addPurchaseOrderSchema, validationData, req, res, next);
}), purchaseOrderController.addPurchaseOrder);
/* Update an existing purchase order */
router.put("/:id", authenticateToken, CHECKPERMISSION([{ module: "purchase order", permission: "can_update" }]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    let validationData = {};
    if (((_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.payload) && typeof req.query.payload === "string") {
        validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(purchaseOrderMiddlewareSchemas.updatePurchaseOrderSchema, validationData, req, res, next);
}), purchaseOrderController.updatePurchaseOrder);
/* Delete a purchase order */
router.delete("/:id", authenticateToken, CHECKPERMISSION([{ module: "purchase order", permission: "can_delete" }]), purchaseOrderController.deletePurchaseOrder);
const purchaseOrderRoutes = router;
export default purchaseOrderRoutes;
//# sourceMappingURL=purchse_order.routes.js.map