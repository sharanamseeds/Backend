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
import { offerController } from "../controllers/offers.controller.js";
import CHECKPERMISSION from "../middleware/checkpermission.middleware.js";
import { offerMiddlewareSchemas } from "../validations/offer.validation.js";
import { validateViaJoi } from "../validations/joi.validation.js";
const router = express.Router();
router.get("/download-excel", authenticateToken, CHECKPERMISSION([{ module: "offer", permission: "can_download" }]), offerController.downloadExcel);
router.get("/", authenticateToken, CHECKPERMISSION([{ module: "offer", permission: "can_read" }]), offerController.getOfferList);
router.get("/user/", authenticateToken, CHECKPERMISSION([{ module: "offer", permission: "can_read" }]), offerController.getCustomerOfferList);
router.get("/:id", authenticateToken, CHECKPERMISSION([{ module: "offer", permission: "can_read" }]), offerController.getOffer);
router.post("/", authenticateToken, CHECKPERMISSION([{ module: "offer", permission: "can_add" }]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let validationData = {};
    if (((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.payload) && typeof req.query.payload === "string") {
        validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(offerMiddlewareSchemas.addOffer, validationData, req, res, next);
}), offerController.addOffer);
router.put("/:id", authenticateToken, CHECKPERMISSION([{ module: "offer", permission: "can_update" }]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    let validationData = {};
    if (((_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.payload) && typeof req.query.payload === "string") {
        validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(offerMiddlewareSchemas.updateOffer, validationData, req, res, next);
}), offerController.updateOffer);
router.delete("/:id", authenticateToken, CHECKPERMISSION([{ module: "offer", permission: "can_delete" }]), offerController.deleteOffer);
const offersRoutes = router;
export default offersRoutes;
//# sourceMappingURL=offer.routes.js.map