import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import CHECKPERMISSION from "../middleware/checkpermission.middleware.js";
import { brandController } from "../controllers/brands.controller.js";
import { validateViaJoi } from "../validations/joi.validation.js";
import { brandMiddlewareSchemas } from "../validations/brand.validation.js";
const router = express.Router();

router.get(
  "/download-excel",
  authenticateToken,
  CHECKPERMISSION([{ module: "brand", permission: "can_download" }]),
  brandController.downloadExcel
);

router.get(
  "/",
  authenticateToken,
  CHECKPERMISSION([{ module: "brand", permission: "can_read" }]),
  brandController.getBrandList
);

router.get(
  "/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "brand", permission: "can_read" }]),
  brandController.getBrand
);

router.get("/user/", authenticateToken, brandController.getBrandList);

router.get("/user/:id", authenticateToken, brandController.getBrand);

router.post(
  "/",
  authenticateToken,
  CHECKPERMISSION([{ module: "brand", permission: "can_add" }]),
  async (req, res, next) => {
    let validationData = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(
      brandMiddlewareSchemas.addBrand,
      validationData,
      req,
      res,
      next
    );
  },
  brandController.addBrand
);

router.put(
  "/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "brand", permission: "can_update" }]),
  async (req, res, next) => {
    let validationData = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(
      brandMiddlewareSchemas.updateBrand,
      validationData,
      req,
      res,
      next
    );
  },
  brandController.updateBrand
);

router.delete(
  "/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "brand", permission: "can_delete" }]),
  brandController.deleteBrand
);

const brandsRoutes = router;
export default brandsRoutes;
