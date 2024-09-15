import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { validateViaJoi } from "../validations/joi.validation.js";
import { favouriteMiddlewareSchemas } from "../validations/favourite.validation.js";
import { favouriteController } from "../controllers/favourite.controller.js";
const router = express.Router();

router.get(
  "/download-excel",
  authenticateToken,
  favouriteController.downloadExcel
);

router.get(
  "/user/",
  authenticateToken,
  favouriteController.getUserFavouriteList
);

router.get("/", authenticateToken, favouriteController.getFavouriteList);

router.get("/:id", authenticateToken, favouriteController.getFavourite);

router.post(
  "/",
  authenticateToken,
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
