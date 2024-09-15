import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { productController } from "../controllers/products.controller.js";
import CHECKPERMISSION from "../middleware/checkpermission.middleware.js";
import { validateViaJoi } from "../validations/joi.validation.js";
import { productMiddlewareSchemas } from "../validations/product.validation.js";

const router = express.Router();

router.get(
  "/download-excel",
  authenticateToken,
  CHECKPERMISSION([{ module: "product", permission: "can_download" }]),
  productController.downloadExcel
);

router.get(
  "/",
  authenticateToken,
  CHECKPERMISSION([{ module: "product", permission: "can_read" }]),
  productController.getProductList
);

router.get(
  "/user/",
  authenticateToken,
  productController.getCustomerProductList
);

router.get("/user/:id", authenticateToken, productController.getProduct);

router.get(
  "/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "product", permission: "can_read" }]),
  productController.getProduct
);

router.post(
  "/",
  authenticateToken,
  CHECKPERMISSION([{ module: "product", permission: "can_add" }]),
  async (req, res, next) => {
    let validationData = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(
      productMiddlewareSchemas.addProduct,
      validationData,
      req,
      res,
      next
    );
  },
  productController.addProduct
);

router.put(
  "/add_quantity/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "product", permission: "can_update" }]),
  async (req, res, next) =>
    validateViaJoi(
      productMiddlewareSchemas.addQuantity,
      req.body,
      req,
      res,
      next
    ),
  productController.addProductQuantity
);

router.put(
  "/remove_quantity/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "product", permission: "can_update" }]),
  async (req, res, next) =>
    validateViaJoi(
      productMiddlewareSchemas.addQuantity,
      req.body,
      req,
      res,
      next
    ),
  productController.removeProductQuantity
);

router.put(
  "/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "product", permission: "can_update" }]),
  async (req, res, next) => {
    let validationData = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(
      productMiddlewareSchemas.updateProduct,
      validationData,
      req,
      res,
      next
    );
  },
  productController.updateProduct
);

// router.delete(
//   "/:id",
//   authenticateToken,
//   CHECKPERMISSION([{ module: "product", permission: "can_delete" }]),
//   productController.deleteProduct
// );

const productsRoutes = router;
export default productsRoutes;
