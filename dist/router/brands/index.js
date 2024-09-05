import express from "express";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import CHECKPERMISSION from "../../middleware/checkpermission.middleware.js";
import { brandController } from "../../controllers/brands.controller.js";
import { brandMiddleware } from "../../validations/brands.middleware.js";
import { validateSchema } from "../../validations/index.js";
const router = express.Router();
router.get("/", authenticateToken, CHECKPERMISSION([{ module: "brand", permission: "can_read" }]), brandController.getBrandList);
router.get("/:id", authenticateToken, CHECKPERMISSION([{ module: "brand", permission: "can_read" }]), brandController.getBrand);
router.post("/", authenticateToken, CHECKPERMISSION([{ module: "brand", permission: "can_add" }]), validateSchema(brandMiddleware.addBrand, "body"), brandController.addBrand);
router.put("/:id", authenticateToken, CHECKPERMISSION([{ module: "brand", permission: "can_update" }]), validateSchema(brandMiddleware.updateBrand, "body"), brandController.updateBrand);
router.delete("/:id", authenticateToken, CHECKPERMISSION([{ module: "brand", permission: "can_delete" }]), brandController.deleteBrand);
const brandsRoutes = router;
export default brandsRoutes;
//# sourceMappingURL=index.js.map