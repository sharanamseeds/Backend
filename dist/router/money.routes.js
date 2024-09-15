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
import CHECKPERMISSION from "../middleware/checkpermission.middleware.js";
import { validateViaJoi } from "../validations/joi.validation.js";
import { moneyMiddlewareSchemas } from "../validations/money.validation.js";
import { moneyController } from "../controllers/money.controller.js";
const router = express.Router();
router.get("/", authenticateToken, CHECKPERMISSION([{ module: "user", permission: "can_read" }]), moneyController.getMoneyList);
router.get("/:id", authenticateToken, CHECKPERMISSION([{ module: "user", permission: "can_read" }]), moneyController.getMoney);
router.get("/user/", authenticateToken, moneyController.getMoneyList);
router.get("/user/:id", authenticateToken, moneyController.getMoney);
router.post("/", authenticateToken, CHECKPERMISSION([{ module: "user", permission: "can_add" }]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let validationData = {};
    if (((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.payload) && typeof req.query.payload === "string") {
        validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(moneyMiddlewareSchemas.addMoney, validationData, req, res, next);
}), moneyController.addMoney);
router.put("/:id", authenticateToken, CHECKPERMISSION([{ module: "user", permission: "can_update" }]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    let validationData = {};
    if (((_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.payload) && typeof req.query.payload === "string") {
        validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(moneyMiddlewareSchemas.updateMoney, validationData, req, res, next);
}), moneyController.updateMoney);
router.delete("/:id", authenticateToken, CHECKPERMISSION([{ module: "user", permission: "can_delete" }]), moneyController.deleteMoney);
const moneyRoutes = router;
export default moneyRoutes;
//# sourceMappingURL=money.routes.js.map