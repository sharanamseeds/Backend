import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { validateViaJoi } from "../validations/joi.validation.js";
import { wishMiddlewareSchemas } from "../validations/wish.validation.js";
import { wishController } from "../controllers/wish.controller.js";
const router = express.Router();

router.get("/download-excel", authenticateToken, wishController.downloadExcel);

router.get(
  "/user/",
  authenticateToken,
  // CHECKPERMISSION([{ module: "cart", permission: "can_read" }]),
  wishController.getUserWishList
);

router.get("/", authenticateToken, wishController.getWishList);

router.get("/:id", authenticateToken, wishController.getWish);

router.post(
  "/",
  authenticateToken,
  async (req, res, next) => {
    let validationData = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(
      wishMiddlewareSchemas.addWish,
      validationData,
      req,
      res,
      next
    );
  },
  wishController.addWish
);

router.put(
  "/:id",
  authenticateToken,
  async (req, res, next) => {
    let validationData = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(
      wishMiddlewareSchemas.updateWish,
      validationData,
      req,
      res,
      next
    );
  },
  wishController.updateWish
);

router.delete("/:id", authenticateToken, wishController.deleteWish);

const wishsRoutes = router;
export default wishsRoutes;
