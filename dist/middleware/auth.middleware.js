var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { verifyToken } from "../helpers/auth.helpers.js";
import Role from "../models/roles.model.js";
import User from "../models/users.model.js"; // Adjust the path as per your project structure
import jwt from "jsonwebtoken";
import Languages from "../models/languages.model.js";
import { masterConfig } from "../config/master.config.js";
export const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.query.lang_code) {
        const englishLanguageDoc = yield Languages.findOne({
            identifier: "english",
        });
        req.query.lang_code = req.query.lang_code || englishLanguageDoc.lang_code;
    }
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token)
        return res.status(401).json({ message: "Token is required" });
    let decoded;
    try {
        decoded = verifyToken(token, masterConfig.authConfig.ACCESS_TOKEN_SECRET);
    }
    catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(403).json({ message: "Token has expired" });
        }
        else if (err instanceof jwt.JsonWebTokenError) {
            return res.status(403).json({ message: "Token is invalid" });
        }
        else {
            return res.status(403).json({ message: "Token verification failed" });
        }
    }
    try {
        req.user = yield User.findById(decoded.userId);
        if (!req.user)
            return res.status(404).json({ message: "User not found" });
        next();
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});
export const checkPermission = (entity, action) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { user } = req;
        if (!user)
            return res.status(401).json({ message: "User is not authenticated" });
        const usersRoles = yield Role.findById(user.role_id);
        const permissions = [];
        if (permissions[entity] && permissions[entity][action]) {
            next();
        }
        else {
            res.status(403).json({ message: "Forbidden: Insufficient permissions" });
        }
    });
};
//# sourceMappingURL=auth.middleware.js.map