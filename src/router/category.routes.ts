import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import CHECKPERMISSION from "../middleware/checkpermission.middleware.js";
import { categoryController } from "../controllers/categories.controller.js";
import { validateViaJoi } from "../validations/joi.validation.js";
import { categoryMiddlewareScheas } from "../validations/category.validation.js";

const router = express.Router();

router.get(
  "/download-excel",
  authenticateToken,
  CHECKPERMISSION([{ module: "category", permission: "can_download" }]),
  categoryController.downloadExcel
);

router.get(
  "/",
  authenticateToken,
  CHECKPERMISSION([{ module: "category", permission: "can_read" }]),
  categoryController.getCategoryList
);

router.get(
  "/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "category", permission: "can_read" }]),
  categoryController.getCategory
);

router.post(
  "/",
  authenticateToken,
  CHECKPERMISSION([{ module: "category", permission: "can_add" }]),
  async (req, res, next) => {
    let validationData = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(
      categoryMiddlewareScheas.addCategory,
      validationData,
      req,
      res,
      next
    );
  },
  categoryController.addCategory
);

router.put(
  "/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "category", permission: "can_update" }]),
  async (req, res, next) => {
    let validationData = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(
      categoryMiddlewareScheas.updateCategory,
      validationData,
      req,
      res,
      next
    );
  },
  categoryController.updateCategory
);

router.delete(
  "/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "category", permission: "can_delete" }]),
  categoryController.deleteCategory
);

const categoriesRoutes = router;
export default categoriesRoutes;
