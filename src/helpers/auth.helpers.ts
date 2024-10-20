import crypto from "crypto";
import jwt from "jsonwebtoken";
import { masterConfig } from "../config/master.config.js";

export const comparePassword = (password: string, hash: any, salt: any) => {
  const newHash: string = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return newHash === hash;
};

export const createPassword = (length: number = 12): string => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let password = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    const randomIndex = Math.floor(Math.random() * n);
    password += charset[randomIndex];
  }
  return password;
};

export const generatePassword = (password: string) => {
  const salt = crypto.randomBytes(32).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return {
    hash,
    salt,
  };
};

export const generateAccessToken = (userId: any): string => {
  const accessToken = jwt.sign(
    { userId },
    masterConfig.authConfig.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    }
  );
  return accessToken;
};

export const generateRefreshToken = (userId: any): string => {
  const refreshToken = jwt.sign(
    { userId },
    masterConfig.authConfig.REFRESH_TOKEN_SECRET
  );
  return refreshToken;
};

export const verifyToken = (token: string, secret: string): any => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    throw error;
  }
};

export function generateVerificationCode(length: number = 6): string {
  const characters = "0123456789";
  // "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let code = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
}

export function compareVerificationCode(
  code: string,
  storedCode: string
): boolean {
  return code === storedCode;
}
