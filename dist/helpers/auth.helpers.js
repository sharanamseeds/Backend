import crypto from "crypto";
import jwt from "jsonwebtoken";
import { masterConfig } from "../config/master.config.js";
export const comparePassword = (password, hash, salt) => {
    const newHash = crypto
        .pbkdf2Sync(password, salt, 10000, 64, "sha512")
        .toString("hex");
    return newHash === hash;
};
export const createPassword = (length = 12) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let password = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
        const randomIndex = Math.floor(Math.random() * n);
        password += charset[randomIndex];
    }
    return password;
};
export const generatePassword = (password) => {
    const salt = crypto.randomBytes(32).toString("hex");
    const hash = crypto
        .pbkdf2Sync(password, salt, 10000, 64, "sha512")
        .toString("hex");
    return {
        hash,
        salt,
    };
};
export const generateAccessToken = (userId) => {
    const accessToken = jwt.sign({ userId }, masterConfig.authConfig.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });
    return accessToken;
};
export const generateRefreshToken = (userId) => {
    const refreshToken = jwt.sign({ userId }, masterConfig.authConfig.REFRESH_TOKEN_SECRET);
    return refreshToken;
};
export const verifyToken = (token, secret) => {
    try {
        const decoded = jwt.verify(token, secret);
        return decoded;
    }
    catch (error) {
        throw error;
    }
};
export function generateVerificationCode(length = 6) {
    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let code = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }
    return code;
}
export function compareVerificationCode(code, storedCode) {
    return code === storedCode;
}
//# sourceMappingURL=auth.helpers.js.map