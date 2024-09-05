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
router.get("/download-excel", authenticateToken, CHECKPERMISSION([{ module: "product", permission: "can_download" }]), productController.downloadExcel);
router.get("/", authenticateToken, CHECKPERMISSION([{ module: "product", permission: "can_read" }]), productController.getProductList);
router.get("/user/", authenticateToken, CHECKPERMISSION([{ module: "product", permission: "can_read" }]), productController.getCustomerProductList);
router.get("/:id", authenticateToken, CHECKPERMISSION([{ module: "product", permission: "can_read" }]), productController.getProduct);
router.post("/", authenticateToken, CHECKPERMISSION([{ module: "product", permission: "can_add" }]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let validationData = {};
    if (((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.payload) && typeof req.query.payload === "string") {
        validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(productMiddlewareSchemas.addProduct, validationData, req, res, next);
}), productController.addProduct);
router.put("/add_quantity/:id", authenticateToken, CHECKPERMISSION([{ module: "product", permission: "can_update" }]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return validateViaJoi(productMiddlewareSchemas.addQuantity, req.body, req, res, next);
}), productController.addProductQuantity);
router.put("/remove_quantity/:id", authenticateToken, CHECKPERMISSION([{ module: "product", permission: "can_update" }]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return validateViaJoi(productMiddlewareSchemas.addQuantity, req.body, req, res, next);
}), productController.removeProductQuantity);
router.put("/:id", authenticateToken, CHECKPERMISSION([{ module: "product", permission: "can_update" }]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    let validationData = {};
    if (((_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.payload) && typeof req.query.payload === "string") {
        validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(productMiddlewareSchemas.updateProduct, validationData, req, res, next);
}), productController.updateProduct);
// router.delete(
//   "/:id",
//   authenticateToken,
//   CHECKPERMISSION([{ module: "product", permission: "can_delete" }]),
//   productController.deleteProduct
// );
const productsRoutes = router;
export default productsRoutes;
//# sourceMappingURL=product.routes.js.map