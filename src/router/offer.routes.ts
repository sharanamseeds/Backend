import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { offerController } from "../controllers/offers.controller.js";
import CHECKPERMISSION from "../middleware/checkpermission.middleware.js";
import { offerMiddlewareSchemas } from "../validations/offer.validation.js";
import { validateViaJoi } from "../validations/joi.validation.js";

const router = express.Router();

router.get(
  "/download-excel",
  authenticateToken,
  CHECKPERMISSION([{ module: "offer", permission: "can_download" }]),
  offerController.downloadExcel
);

router.get(
  "/",
  authenticateToken,
  CHECKPERMISSION([{ module: "offer", permission: "can_read" }]),
  offerController.getOfferList
);

router.get(
  "/user/",
  authenticateToken,
  CHECKPERMISSION([{ module: "offer", permission: "can_read" }]),
  offerController.getCustomerOfferList
);

router.get(
  "/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "offer", permission: "can_read" }]),
  offerController.getOffer
);

router.post(
  "/",
  authenticateToken,
  CHECKPERMISSION([{ module: "offer", permission: "can_add" }]),
  async (req, res, next) => {
    let validationData = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(
      offerMiddlewareSchemas.addOffer,
      validationData,
      req,
      res,
      next
    );
  },
  offerController.addOffer
);

router.put(
  "/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "offer", permission: "can_update" }]),
  async (req, res, next) => {
    let validationData = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(
      offerMiddlewareSchemas.updateOffer,
      validationData,
      req,
      res,
      next
    );
  },
  offerController.updateOffer
);

router.delete(
  "/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "offer", permission: "can_delete" }]),
  offerController.deleteOffer
);

const offersRoutes = router;
export default offersRoutes;
