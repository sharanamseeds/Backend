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
import { billController } from "../controllers/bills.controllers.js";
import { validateViaJoi } from "../validations/joi.validation.js";
import { billMiddlewareSchemas } from "../validations/bill.validation.js";
const router = express.Router();
router.get("/download-excel", authenticateToken, CHECKPERMISSION([{ module: "bill", permission: "can_download" }]), billController.downloadExcel);
router.get("/download-bill/:id", 
// authenticateToken,
// CHECKPERMISSION([{ module: "bill", permission: "can_download" }]),
billController.downloadBill);
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
router.put("/:id", authenticateToken, CHECKPERMISSION([{ module: "bill", permission: "can_update" }]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let validationData = {};
    if (((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.payload) && typeof req.query.payload === "string") {
        validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(billMiddlewareSchemas.updateBill, validationData, req, res, next);
}), billController.updateBill);
// router.delete(
//   "/:id",
//   authenticateToken,
//   CHECKPERMISSION([{ module: "bill", permission: "can_delete" }]),
//   billController.deleteBill
// );
const billsRoutes = router;
export default billsRoutes;
//# sourceMappingURL=bill.routes.js.map