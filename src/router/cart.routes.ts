import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { validateViaJoi } from "../validations/joi.validation.js";
import { cartMiddlewareSchemas } from "../validations/cart.validation.js";
import { cartController } from "../controllers/cart.controller.js";
const router = express.Router();

router.get(
  "/download-excel",
  authenticateToken,
  // CHECKPERMISSION([{ module: "cart", permission: "can_download" }]),
  cartController.downloadExcel
);

router.get(
  "/user/",
  authenticateToken,
  // CHECKPERMISSION([{ module: "cart", permission: "can_read" }]),
  cartController.getUserCartList
);

router.get(
  "/",
  authenticateToken,
  // CHECKPERMISSION([{ module: "cart", permission: "can_read" }]),
  cartController.getCartList
);

router.get(
  "/:id",
  authenticateToken,
  // CHECKPERMISSION([{ module: "cart", permission: "can_read" }]),
  cartController.getCart
);

router.post(
  "/",
  authenticateToken,
  // CHECKPERMISSION([{ module: "cart", permission: "can_add" }]),
  async (req, res, next) => {
    let validationData = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(
      cartMiddlewareSchemas.addCart,
      validationData,
      req,
      res,
      next
    );
  },
  cartController.addCart
);

router.put(
  "/:id",
  authenticateToken,
  // CHECKPERMISSION([{ module: "cart", permission: "can_update" }]),
  async (req, res, next) => {
    let validationData = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(
      cartMiddlewareSchemas.updateCart,
      validationData,
      req,
      res,
      next
    );
  },
  cartController.updateCart
);

router.delete(
  "/:id",
  authenticateToken,
  // CHECKPERMISSION([{ module: "cart", permission: "can_delete" }]),
  cartController.deleteCart
);

const cartsRoutes = router;
export default cartsRoutes;
