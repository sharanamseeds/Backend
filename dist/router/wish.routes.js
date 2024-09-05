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
import { validateViaJoi } from "../validations/joi.validation.js";
import { wishMiddlewareSchemas } from "../validations/wish.validation.js";
import { wishController } from "../controllers/wish.controller.js";
const router = express.Router();
router.get("/download-excel", authenticateToken, wishController.downloadExcel);
router.get("/user/", authenticateToken, 
// CHECKPERMISSION([{ module: "cart", permission: "can_read" }]),
wishController.getUserWishList);
router.get("/", authenticateToken, wishController.getWishList);
router.get("/:id", authenticateToken, wishController.getWish);
router.post("/", authenticateToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let validationData = {};
    if (((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.payload) && typeof req.query.payload === "string") {
        validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(wishMiddlewareSchemas.addWish, validationData, req, res, next);
}), wishController.addWish);
router.put("/:id", authenticateToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    let validationData = {};
    if (((_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.payload) && typeof req.query.payload === "string") {
        validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(wishMiddlewareSchemas.updateWish, validationData, req, res, next);
}), wishController.updateWish);
router.delete("/:id", authenticateToken, wishController.deleteWish);
const wishsRoutes = router;
export default wishsRoutes;
//# sourceMappingURL=wish.routes.js.map