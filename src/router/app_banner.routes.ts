import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import CHECKPERMISSION from "../middleware/checkpermission.middleware.js";
import { appBannerController } from "../controllers/app_banner.controller.js";
import { validateViaJoi } from "../validations/joi.validation.js";
import { appBannerMiddlewareSchemas } from "../validations/app_banner.validation.js";

const router = express.Router();

// updateAppBanner,
// deleteAppBannerImage,
// getAppBanner,

router.get(
  "/",
  authenticateToken,
  CHECKPERMISSION([{ module: "app banner", permission: "can_read" }]),
  appBannerController.getAppBanner
);
router.get("/user/", authenticateToken, appBannerController.getAppBanner);

router.put(
  "/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "app banner", permission: "can_update" }]),
  appBannerController.updateAppBanner
);

router.put(
  "/delete_image/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "app banner", permission: "can_delete" }]),
  async (req, res, next) => {
    let validationData = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(
      appBannerMiddlewareSchemas.deleteAppBannerImage,
      validationData,
      req,
      res,
      next
    );
  },
  appBannerController.deleteAppBannerImage
);

const appBannerRoutes = router;
export default appBannerRoutes;
