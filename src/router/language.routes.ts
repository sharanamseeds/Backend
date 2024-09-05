import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import CHECKPERMISSION from "../middleware/checkpermission.middleware.js";
import { languageController } from "../controllers/languages.controller.js";
import { validateViaJoi } from "../validations/joi.validation.js";
import { languageMiddlewareSchemas } from "../validations/language.validation.js";

const router = express.Router();

router.get(
  "/",
  authenticateToken,
  CHECKPERMISSION([{ module: "language", permission: "can_read" }]),
  languageController.getLanguageList
);

router.get(
  "/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "language", permission: "can_read" }]),
  languageController.getLanguage
);

router.post(
  "/",
  authenticateToken,
  CHECKPERMISSION([{ module: "language", permission: "can_add" }]),
  async (req, res, next) =>
    validateViaJoi(
      languageMiddlewareSchemas.addLanguage,
      req.body,
      req,
      res,
      next
    ),
  languageController.addLanguage
);

router.put(
  "/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "language", permission: "can_update" }]),
  async (req, res, next) =>
    validateViaJoi(
      languageMiddlewareSchemas.updateLanguage,
      req.body,
      req,
      res,
      next
    ),
  languageController.updateLanguage
);

router.delete(
  "/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "language", permission: "can_delete" }]),
  languageController.deleteLanguage
);

const languagesRoutes = router;
export default languagesRoutes;
