import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import CHECKPERMISSION from "../middleware/checkpermission.middleware.js";
import { validateViaJoi } from "../validations/joi.validation.js";
import { vendorMiddlewareSchemas } from "../validations/vendor.validation.js";
import { vendorController } from "../controllers/vendors.controller.js";

const router = express.Router();

// Get a specific vendor by ID
router.get(
  "/vendor/:id",
  CHECKPERMISSION([{ module: "vendors", permission: "can_download" }]),
  authenticateToken,
  vendorController.getVendor
);

// Update a vendor by ID
router.put(
  "/vendor/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "vendors", permission: "can_download" }]),
  async (req, res, next) => {
    let validationData = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(
      vendorMiddlewareSchemas.updateVendorSchema,
      validationData,
      req,
      res,
      next
    );
  },
  vendorController.updateVendor
);

// Download vendor list as Excel
router.get(
  "/download-excel",
  authenticateToken,
  CHECKPERMISSION([{ module: "vendors", permission: "can_download" }]),
  vendorController.downloadExcel
);

// Get all vendors
router.get(
  "/",
  authenticateToken,
  CHECKPERMISSION([{ module: "vendors", permission: "can_read" }]),
  vendorController.getVendorList
);

// Get a specific vendor by ID
router.get(
  "/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "vendors", permission: "can_read" }]),
  vendorController.getVendor
);

// Create a new vendor
router.post(
  "/",
  authenticateToken,
  CHECKPERMISSION([{ module: "vendors", permission: "can_add" }]),
  async (req, res, next) => {
    let validationData = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(
      vendorMiddlewareSchemas.addVendorSchema, // Assuming addVendorSchema exists
      validationData,
      req,
      res,
      next
    );
  },
  vendorController.addVendor
);

// Update an existing vendor
router.put(
  "/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "vendors", permission: "can_update" }]),
  async (req, res, next) => {
    let validationData = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(
      vendorMiddlewareSchemas.updateVendorSchema, // Assuming updateVendorSchema exists
      validationData,
      req,
      res,
      next
    );
  },
  vendorController.updateVendor
);

// Delete a vendor
router.delete(
  "/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "vendors", permission: "can_delete" }]),
  vendorController.deleteVendor
);

const vendorsRoutes = router;
export default vendorsRoutes;
