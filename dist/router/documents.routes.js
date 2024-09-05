var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { productController } from "../controllers/products.controller.js";
import CHECKPERMISSION from "../middleware/checkpermission.middleware.js";
import { validateViaJoi } from "../validations/joi.validation.js";
import { productMiddlewareSchemas } from "../validations/product.validation.js";
const router = express.Router();
router.put("/products/:id", authenticateToken, CHECKPERMISSION([{ module: "product", permission: "can_delete" }]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return validateViaJoi(productMiddlewareSchemas.deleteProductImage, req.body, req, res, next);
}), productController.deleteProductImage);
const documentRoutes = router;
export default documentRoutes;
//# sourceMappingURL=documents.routes.js.map