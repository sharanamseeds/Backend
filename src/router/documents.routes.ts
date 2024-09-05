import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { productController } from "../controllers/products.controller.js";
import CHECKPERMISSION from "../middleware/checkpermission.middleware.js";
import { validateViaJoi } from "../validations/joi.validation.js";
import { productMiddlewareSchemas } from "../validations/product.validation.js";

const router = express.Router();

router.put(
  "/products/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "product", permission: "can_delete" }]),
  async (req, res, next) =>
    validateViaJoi(
      productMiddlewareSchemas.deleteProductImage,
      req.body,
      req,
      res,
      next
    ),
  productController.deleteProductImage
);

const documentRoutes = router;
export default documentRoutes;
