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
import { userController } from "../controllers/users.controller.js";
import CHECKPERMISSION from "../middleware/checkpermission.middleware.js";
import { validateViaJoi } from "../validations/joi.validation.js";
import { userMiddlewareSchemas } from "../validations/users.validation.js";
const router = express.Router();
router.get("/user/:id", authenticateToken, userController.getUser);
router.put("/user/:id", authenticateToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let validationData = {};
    if (((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.payload) && typeof req.query.payload === "string") {
        validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(userMiddlewareSchemas.updateUserSchema, validationData, req, res, next);
}), userController.updateUser);
router.get("/get_account_details", authenticateToken, userController.getAccountDetails);
router.get("/app/get_account_details", authenticateToken, userController.getAppAccountDetails);
router.get("/app/get_account_details/download/excel", authenticateToken, userController.AppcalculateUserFinancialsDownloadExcel);
router.get("/app/get_account_details/download/pdf", authenticateToken, userController.AppcalculateUserFinancialsDownloadPDF);
router.get("/download-excel", authenticateToken, CHECKPERMISSION([{ module: "user", permission: "can_download" }]), userController.downloadExcel);
/* Get all users */
router.get("/", authenticateToken, CHECKPERMISSION([{ module: "user", permission: "can_read" }]), userController.getUserList);
/* Get a specific user by ID */
router.get("/:id", authenticateToken, CHECKPERMISSION([{ module: "user", permission: "can_read" }]), userController.getUser);
/* Create a new user */
router.post("/", authenticateToken, CHECKPERMISSION([{ module: "user", permission: "can_add" }]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    let validationData = {};
    if (((_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.payload) && typeof req.query.payload === "string") {
        validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(userMiddlewareSchemas.addUserSchema, validationData, req, res, next);
}), userController.addUser);
/* Update an existing user */
router.put("/:id", authenticateToken, CHECKPERMISSION([{ module: "user", permission: "can_update" }]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    let validationData = {};
    if (((_c = req === null || req === void 0 ? void 0 : req.query) === null || _c === void 0 ? void 0 : _c.payload) && typeof req.query.payload === "string") {
        validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(userMiddlewareSchemas.updateUserSchema, validationData, req, res, next);
}), userController.updateUser);
/* Delete a user */
router.delete("/:id", authenticateToken, CHECKPERMISSION([{ module: "user", permission: "can_delete" }]), userController.deleteUser);
const usersRoutes = router;
export default usersRoutes;
//# sourceMappingURL=user.routes.js.map