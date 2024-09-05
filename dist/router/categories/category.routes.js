import express from "express";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import CHECKPERMISSION from "../../middleware/checkpermission.middleware.js";
import { categoryController } from "../../controllers/categories.controller.js";
import { validateSchema } from "../../validations/index.js";
import { categoryMiddleware } from "../../validations/categories.middleware.js";
const router = express.Router();
router.get("/", authenticateToken, CHECKPERMISSION([{ module: "category", permission: "can_read" }]), categoryController.getCategoryList);
router.get("/:id", authenticateToken, CHECKPERMISSION([{ module: "category", permission: "can_read" }]), categoryController.getCategory);
router.post("/", authenticateToken, CHECKPERMISSION([{ module: "category", permission: "can_add" }]), validateSchema(categoryMiddleware.addCategory, "body"), categoryController.addCategory);
router.put("/:id", authenticateToken, CHECKPERMISSION([{ module: "category", permission: "can_update" }]), validateSchema(categoryMiddleware.updateCategory, "body"), categoryController.updateCategory);
router.delete("/:id", authenticateToken, CHECKPERMISSION([{ module: "category", permission: "can_delete" }]), categoryController.deleteCategory);
const categoriesRoutes = router;
export default categoriesRoutes;
//# sourceMappingURL=category.routes.js.map