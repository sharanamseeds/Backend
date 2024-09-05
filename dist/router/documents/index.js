import express from "express";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import { productController } from "../../controllers/products.controller.js";
import CHECKPERMISSION from "../../middleware/checkpermission.middleware.js";
import { productMiddleware } from "../../validations/products.middleware.js";
import { validateSchema } from "../../validations/index.js";
const router = express.Router();
router.put("/products/:id", authenticateToken, CHECKPERMISSION([{ module: "products", permission: "can_delete" }]), validateSchema(productMiddleware.deleteProductImage, "body"), productController.deleteProductImage);
const documentRoutes = router;
export default documentRoutes;
//# sourceMappingURL=index.js.map