import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { validateViaJoi } from "../validations/joi.validation.js";
import { favouriteMiddlewareSchemas } from "../validations/favourite.validation.js";
import { favouriteController } from "../controllers/favourite.controller.js";
const router = express.Router();

router.get(
  "/download-excel",
  authenticateToken,
  //CHECKPERMISSION([{ module: "favourite", permission: "can_download" }]),
  favouriteController.downloadExcel
);

router.get(
  "/user/",
  authenticateToken,
  //CHECKPERMISSION([{ module: "favourite", permission: "can_read" }]),
  favouriteController.getUserFavouriteList
);

router.get(
  "/",
  authenticateToken,
  //CHECKPERMISSION([{ module: "favourite", permission: "can_read" }]),
  favouriteController.getFavouriteList
);

router.get(
  "/:id",
  authenticateToken,
  //CHECKPERMISSION([{ module: "favourite", permission: "can_read" }]),
  favouriteController.getFavourite
);

router.post(
  "/",
  authenticateToken,
  //CHECKPERMISSION([{ module: "favourite", permission: "can_add" }]),
  async (req, res, next) => {
    let validationData = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(
      favouriteMiddlewareSchemas.addFavourite,
      validationData,
      req,
      res,
      next
    );
  },
  favouriteController.addFavourite
);

router.put(
  "/:id",
  authenticateToken,
  //CHECKPERMISSION([{ module: "favourite", permission: "can_update" }]),
  async (req, res, next) => {
    let validationData = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(
      favouriteMiddlewareSchemas.updateFavourite,
      validationData,
      req,
      res,
      next
    );
  },
  favouriteController.updateFavourite
);

router.delete(
  "/:id",
  authenticateToken,
  //CHECKPERMISSION([{ module: "favourite", permission: "can_delete" }]),
  favouriteController.deleteFavourite
);

const favouritesRoutes = router;
export default favouritesRoutes;
