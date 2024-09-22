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
import { orderController } from "../controllers/orders.controller.js";
import CHECKPERMISSION from "../middleware/checkpermission.middleware.js";
import { orderMiddlewareSchemas } from "../validations/order.validation.js";
import { validateViaJoi } from "../validations/joi.validation.js";
const router = express.Router();
router.get("/user/", authenticateToken, orderController.getCustomerOrderList);
router.get("/user/:id", authenticateToken, orderController.getOrder);
router.post("/return/user/:id", authenticateToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let validationData = {};
    if (((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.payload) && typeof req.query.payload === "string") {
        validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(orderMiddlewareSchemas.returnOrder, validationData, req, res, next);
}), orderController.returnOrder);
router.post("/user/", authenticateToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    let validationData = {};
    if (((_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.payload) && typeof req.query.payload === "string") {
        validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(orderMiddlewareSchemas.addOrder, validationData, req, res, next);
}), orderController.addOrder);
router.put("/user/:id", authenticateToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    let validationData = {};
    if (((_c = req === null || req === void 0 ? void 0 : req.query) === null || _c === void 0 ? void 0 : _c.payload) && typeof req.query.payload === "string") {
        validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(orderMiddlewareSchemas.updateOrder, validationData, req, res, next);
}), orderController.updateOrder);
router.post("/calculate_bill", authenticateToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    let validationData = {};
    if (((_d = req === null || req === void 0 ? void 0 : req.query) === null || _d === void 0 ? void 0 : _d.payload) && typeof req.query.payload === "string") {
        validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(orderMiddlewareSchemas.addOrder, validationData, req, res, next);
}), orderController.calculateBill);
router.get("/download-excel", authenticateToken, CHECKPERMISSION([{ module: "order", permission: "can_download" }]), orderController.downloadExcel);
router.post("/return/:id", authenticateToken, CHECKPERMISSION([{ module: "order", permission: "can_update" }]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    let validationData = {};
    if (((_e = req === null || req === void 0 ? void 0 : req.query) === null || _e === void 0 ? void 0 : _e.payload) && typeof req.query.payload === "string") {
        validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(orderMiddlewareSchemas.returnOrder, validationData, req, res, next);
}), orderController.returnOrder);
router.get("/", authenticateToken, CHECKPERMISSION([{ module: "order", permission: "can_read" }]), orderController.getOrderList);
router.get("/:id", authenticateToken, CHECKPERMISSION([{ module: "order", permission: "can_read" }]), orderController.getOrder);
router.post("/", authenticateToken, CHECKPERMISSION([{ module: "order", permission: "can_add" }]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    let validationData = {};
    if (((_f = req === null || req === void 0 ? void 0 : req.query) === null || _f === void 0 ? void 0 : _f.payload) && typeof req.query.payload === "string") {
        validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(orderMiddlewareSchemas.addOrder, validationData, req, res, next);
}), orderController.addOrder);
router.put("/:id", authenticateToken, CHECKPERMISSION([{ module: "order", permission: "can_update" }]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    let validationData = {};
    if (((_g = req === null || req === void 0 ? void 0 : req.query) === null || _g === void 0 ? void 0 : _g.payload) && typeof req.query.payload === "string") {
        validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(orderMiddlewareSchemas.updateOrder, validationData, req, res, next);
}), orderController.updateOrder);
// router.delete(
//   "/:id",
//   authenticateToken,
//   CHECKPERMISSION([{ module: "order", permission: "can_delete" }]),
//   orderController.deleteOrder
// );
const ordersRoutes = router;
export default ordersRoutes;
//# sourceMappingURL=order.routes.js.map