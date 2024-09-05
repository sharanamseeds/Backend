import express from "express";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import { productController } from "../../controllers/products.controller.js";
import CHECKPERMISSION from "../../middleware/checkpermission.middleware.js";
import { productMiddleware } from "../../validations/products.middleware.js";
import { validateSchema } from "../../validations/index.js";
const router = express.Router();
router.get("/", authenticateToken, CHECKPERMISSION([{ module: "product", permission: "can_read" }]), productController.getProductList);
router.get("/user/", authenticateToken, CHECKPERMISSION([{ module: "product", permission: "can_read" }]), productController.getCustomerProductList);
router.get("/:id", authenticateToken, CHECKPERMISSION([{ module: "product", permission: "can_read" }]), productController.getProduct);
router.post("/", authenticateToken, CHECKPERMISSION([{ module: "product", permission: "can_add" }]), validateSchema(productMiddleware.addProduct, "body"), productController.addProduct);
router.put("/add_quantity/:id", authenticateToken, CHECKPERMISSION([{ module: "product", permission: "can_update" }]), validateSchema(productMiddleware.addQuantity, "body"), productController.addProductQuantity);
router.put("/remove_quantity/:id", authenticateToken, CHECKPERMISSION([{ module: "product", permission: "can_update" }]), validateSchema(productMiddleware.addQuantity, "body"), productController.removeProductQuantity);
router.put("/:id", authenticateToken, CHECKPERMISSION([{ module: "product", permission: "can_update" }]), validateSchema(productMiddleware.updateProduct, "body"), productController.updateProduct);
// router.delete(
//   "/:id",
//   authenticateToken,
//   CHECKPERMISSION([{ module: "product", permission: "can_delete" }]),
//   productController.deleteProduct
// );
const productsRoutes = router;
export default productsRoutes;
//# sourceMappingURL=product.routes.js.map