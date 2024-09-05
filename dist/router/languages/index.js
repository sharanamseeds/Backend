import express from "express";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import CHECKPERMISSION from "../../middleware/checkpermission.middleware.js";
import { languageController } from "../../controllers/languages.controller.js";
import { languageMiddleware } from "../../validations/languages.middleware.js";
import { validateSchema } from "../../validations/index.js";
const router = express.Router();
router.get("/", authenticateToken, CHECKPERMISSION([{ module: "language", permission: "can_read" }]), languageController.getLanguageList);
router.get("/:id", authenticateToken, CHECKPERMISSION([{ module: "language", permission: "can_read" }]), languageController.getLanguage);
router.post("/", authenticateToken, CHECKPERMISSION([{ module: "language", permission: "can_add" }]), validateSchema(languageMiddleware.addLanguage, "body"), languageController.addLanguage);
router.put("/:id", authenticateToken, CHECKPERMISSION([{ module: "language", permission: "can_update" }]), validateSchema(languageMiddleware.updateLanguage, "body"), languageController.updateLanguage);
router.delete("/:id", authenticateToken, CHECKPERMISSION([{ module: "language", permission: "can_delete" }]), languageController.deleteLanguage);
const languagesRoutes = router;
export default languagesRoutes;
//# sourceMappingURL=index.js.map