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
import { vendorMiddlewareSchemas } from "../validations/vendor.validation.js";
import { vendorController } from "../controllers/vendors.controller.js";
const router = express.Router();
// Get a specific vendor by ID
router.get("/vendor/:id", CHECKPERMISSION([{ module: "vendors", permission: "can_download" }]), authenticateToken, vendorController.getVendor);
// Update a vendor by ID
router.put("/vendor/:id", authenticateToken, CHECKPERMISSION([{ module: "vendors", permission: "can_download" }]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let validationData = {};
    if (((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.payload) && typeof req.query.payload === "string") {
        validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(vendorMiddlewareSchemas.updateVendorSchema, validationData, req, res, next);
}), vendorController.updateVendor);
// Download vendor list as Excel
router.get("/download-excel", authenticateToken, CHECKPERMISSION([{ module: "vendors", permission: "can_download" }]), vendorController.downloadExcel);
// Get all vendors
router.get("/", authenticateToken, CHECKPERMISSION([{ module: "vendors", permission: "can_read" }]), vendorController.getVendorList);
// Get a specific vendor by ID
router.get("/:id", authenticateToken, CHECKPERMISSION([{ module: "vendors", permission: "can_read" }]), vendorController.getVendor);
// Create a new vendor
router.post("/", authenticateToken, CHECKPERMISSION([{ module: "vendors", permission: "can_add" }]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    let validationData = {};
    if (((_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.payload) && typeof req.query.payload === "string") {
        validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(vendorMiddlewareSchemas.addVendorSchema, // Assuming addVendorSchema exists
    validationData, req, res, next);
}), vendorController.addVendor);
// Update an existing vendor
router.put("/:id", authenticateToken, CHECKPERMISSION([{ module: "vendors", permission: "can_update" }]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    let validationData = {};
    if (((_c = req === null || req === void 0 ? void 0 : req.query) === null || _c === void 0 ? void 0 : _c.payload) && typeof req.query.payload === "string") {
        validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(vendorMiddlewareSchemas.updateVendorSchema, // Assuming updateVendorSchema exists
    validationData, req, res, next);
}), vendorController.updateVendor);
// Delete a vendor
router.delete("/:id", authenticateToken, CHECKPERMISSION([{ module: "vendors", permission: "can_delete" }]), vendorController.deleteVendor);
const vendorsRoutes = router;
export default vendorsRoutes;
//# sourceMappingURL=vendor.routes.js.map