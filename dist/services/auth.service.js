var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
import { masterConfig } from "../config/master.config.js";
import { comparePassword, compareVerificationCode, generateAccessToken, generatePassword, generateRefreshToken, generateVerificationCode, verifyToken, } from "../helpers/auth.helpers.js";
import { sendUserAccountCreatedMail, sendUserAccountVerifiedMail, sendUserOTPMail, } from "../helpers/common.helpers..js";
import Otps from "../models/otps.model.js";
import User from "../models/users.model.js";
import { NotFoundError } from "./products.service.js";
import jwt from "jsonwebtoken";
import Permissions from "../models/permission.model.js";
const login = ({ email, password, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate email and password presence
        if (!email || !password) {
            throw new NotFoundError("Email and password are required");
        }
        // Find user by email
        const user = yield User.findOne({ email, is_app_user: false });
        if (!user) {
            throw new NotFoundError("User not found");
        }
        // Verify password
        const isValid = comparePassword(password, user.hash, user.salt);
        if (!isValid) {
            throw new NotFoundError("Invalid credentials");
        }
        // Password is valid, generate tokens
        const token = generateAccessToken(user._id);
        const refresh_token = generateRefreshToken(user._id);
        // Removed sensitive information
        let userData = user;
        delete userData.hash;
        delete userData.salt;
        delete userData.added_by;
        delete userData.updated_by;
        delete userData.__v;
        let accessModules = [];
        if (user === null || user === void 0 ? void 0 : user.role_id) {
            const aggregate = [
                {
                    $match: {
                        role: new mongoose.Types.ObjectId(user === null || user === void 0 ? void 0 : user.role_id),
                    },
                },
                {
                    $lookup: {
                        from: "modules",
                        localField: "module",
                        foreignField: "_id",
                        as: "module",
                    },
                },
                {
                    $unwind: {
                        path: "$module",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        module_name: "$module.name",
                        can_add: 1,
                        can_delete: 1,
                        can_download: 1,
                        can_read: 1,
                        can_select: 1,
                        can_update: 1,
                        can_upload: 1,
                    },
                },
            ];
            accessModules = yield Permissions.aggregate(aggregate);
        }
        // Respond with tokens and user data
        const payloadDoc = {
            token,
            refresh_token,
            user: userData,
            accessModules,
        };
        return payloadDoc;
    }
    catch (error) {
        throw error;
    }
});
const register = ({ email, name, password, confirm_password, gst_number, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find user by email
        const user = yield User.findOne({ email });
        if (user) {
            throw new NotFoundError("User Alredy Existed!!");
        }
        if (confirm_password !== password) {
            throw new NotFoundError("Confirm Password Must be Match With Password");
        }
        const userId = new mongoose.Types.ObjectId();
        const { hash, salt } = generatePassword(password);
        const userData = {
            _id: new mongoose.Types.ObjectId(userId),
            added_by: new mongoose.Types.ObjectId(userId),
            updated_by: new mongoose.Types.ObjectId(userId),
            gst_number: gst_number,
            name: name,
            email: email,
            hash,
            salt,
        };
        const userDoc = new User(Object.assign({}, userData));
        yield userDoc.save();
        if (userDoc.is_verified) {
            sendUserAccountVerifiedMail(userDoc.email, userDoc.contact_number);
        }
        else {
            sendUserAccountCreatedMail(userDoc.email, userDoc.contact_number);
        }
        return userDoc;
    }
    catch (error) {
        throw error;
    }
});
const loginApp = ({ email, password, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate email and password presence
        if (!email || !password) {
            throw new NotFoundError("Email and password are required");
        }
        // Find user by email
        const user = yield User.findOne({ email, is_app_user: true });
        if (!user) {
            throw new NotFoundError("User not found");
        }
        // Verify password
        const isValid = comparePassword(password, user.hash, user.salt);
        if (!isValid) {
            throw new NotFoundError("Invalid credentials");
        }
        // Password is valid, generate tokens
        const token = generateAccessToken(user._id);
        const refresh_token = generateRefreshToken(user._id);
        // Removed sensitive information
        let userData = user;
        delete userData.hash;
        delete userData.salt;
        delete userData.added_by;
        delete userData.updated_by;
        delete userData.__v;
        let accessModules = [];
        // Respond with tokens and user data
        const payloadDoc = {
            token,
            refresh_token,
            user: userData,
            accessModules,
        };
        return payloadDoc;
    }
    catch (error) {
        throw error;
    }
});
const registerApp = ({ email, name, password, confirm_password, gst_number, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find user by email
        const user = yield User.findOne({ email });
        if (user) {
            throw new NotFoundError("User Alredy Existed!!");
        }
        if (confirm_password !== password) {
            throw new NotFoundError("Confirm Password Must be Match With Password");
        }
        const userId = new mongoose.Types.ObjectId();
        const { hash, salt } = generatePassword(password);
        const userData = {
            _id: new mongoose.Types.ObjectId(userId),
            added_by: new mongoose.Types.ObjectId(userId),
            updated_by: new mongoose.Types.ObjectId(userId),
            is_app_user: true,
            gst_number: gst_number,
            name: name,
            email: email,
            hash,
            salt,
        };
        const userDoc = new User(Object.assign({}, userData));
        yield userDoc.save();
        if (userDoc.is_verified) {
            sendUserAccountVerifiedMail(userDoc.email, userDoc.contact_number);
        }
        else {
            sendUserAccountCreatedMail(userDoc.email, userDoc.contact_number);
        }
        return userDoc;
    }
    catch (error) {
        throw error;
    }
});
const changePassword = ({ email, new_password, confirm_password, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find user by email
        const user = yield User.findOne({ email });
        if (!user) {
            throw new NotFoundError("User not found");
        }
        if (confirm_password !== new_password) {
            throw new NotFoundError("Confirm Password Must be Match With New Password");
        }
        // Hash new password
        const { hash, salt } = generatePassword(new_password);
        // Update user's password
        user.hash = hash;
        user.salt = salt;
        yield user.save();
        // Respond with success message
        const payloadDoc = {
            status: true,
            message: "Password changed successfully",
        };
        return payloadDoc;
    }
    catch (error) {
        throw error;
    }
});
const refreshUserToken = ({ refreshToken }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let decoded;
        try {
            decoded = verifyToken(refreshToken, masterConfig.authConfig.REFRESH_TOKEN_SECRET);
        }
        catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                throw new NotFoundError("Refresh token has expired");
            }
            else if (err instanceof jwt.JsonWebTokenError) {
                throw new NotFoundError("Refresh token is invalid");
            }
            else {
                throw new NotFoundError("Token verification failed");
            }
        }
        // Find user by decoded user ID
        const user = yield User.findById(decoded.userId);
        if (!user) {
            throw new NotFoundError("User not found");
        }
        // Optionally, check if the refresh token is stored in the user's record
        // if (user.refreshToken !== refreshToken) {
        //   return res.status(403).json({ message: 'Refresh token mismatch' });
        // }
        // Generate new tokens
        const newAccessToken = generateAccessToken(user);
        // Respond with new tokens
        const payloadDoc = {
            accessToken: newAccessToken,
        };
        return payloadDoc;
    }
    catch (error) {
        throw error;
    }
});
const sendVerificationCode = ({ email }) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    //   // Find user by email
    //   const user = await User.findOne({ email });
    //   if (!user) {
    //     throw new NotFoundError("User not found");
    //   }
    //   await Otps.deleteMany({ code_for: email });
    //   const verificationCode = generateVerificationCode();
    //   let otpDoc = new Otps({ code: verificationCode, code_for: email });
    //   const savedOtp = await otpDoc.save();
    //   if (savedOtp) {
    //     // send code via email
    //     await sendUserOTPMail(email, verificationCode);
    //   }
    //   // Respond with success message
    //   const payloadDoc = {
    //     status: savedOtp ? true : false,
    //     message: "Verification Code Sent Successfully",
    //   };
    //   return payloadDoc;
    // } catch (error) {
    //   throw error;
    // }
    const session = yield mongoose.startSession();
    session.startTransaction();
    try {
        // Find user by email
        const user = yield User.findOne({ email });
        if (!user) {
            throw new NotFoundError("User not found");
        }
        // Delete old OTPs for the email
        yield Otps.deleteMany({ code_for: email }).session(session);
        // Generate a new verification code
        const verificationCode = generateVerificationCode();
        // Create a new OTP document
        const otpDoc = new Otps({ code: verificationCode, code_for: email });
        const savedOtp = yield otpDoc.save({ session });
        // If OTP is saved successfully, send email
        if (savedOtp) {
            yield sendUserOTPMail(email, verificationCode);
        }
        // Commit the transaction
        yield session.commitTransaction();
        // Respond with success message
        return {
            status: !!savedOtp,
            message: `Sent Verification Code Successfully`,
        };
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
const reSendVerificationCode = ({ email }) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    //   // Find user by email
    //   const user = await User.findOne({ email });
    //   if (!user) {
    //     throw new NotFoundError("User not found");
    //   }
    //   await Otps.deleteMany({ code_for: email });
    //   const verificationCode = generateVerificationCode();
    //   let otpDoc = new Otps({ code: verificationCode, code_for: email });
    //   const savedOtp = await otpDoc.save();
    //   if (savedOtp) {
    //     // send code via email
    //     await sendUserOTPMail(email, verificationCode);
    //   }
    //   // Respond with success message
    //   const payloadDoc = {
    //     status: savedOtp ? true : false,
    //     message: "Verification Code Sent Successfully",
    //   };
    //   return payloadDoc;
    // } catch (error) {
    //   throw error;
    // }
    const session = yield mongoose.startSession();
    session.startTransaction();
    try {
        // Find user by email
        const user = yield User.findOne({ email });
        if (!user) {
            throw new NotFoundError("User not found");
        }
        // Delete old OTPs for the email
        yield Otps.deleteMany({ code_for: email }).session(session);
        // Generate a new verification code
        const verificationCode = generateVerificationCode();
        // Create a new OTP document
        const otpDoc = new Otps({ code: verificationCode, code_for: email });
        const savedOtp = yield otpDoc.save({ session });
        // If OTP is saved successfully, send email
        if (savedOtp) {
            yield sendUserOTPMail(email, verificationCode);
        }
        // Commit the transaction
        yield session.commitTransaction();
        // Respond with success message
        return {
            status: !!savedOtp,
            message: `Resent Verification Code Successfully`,
        };
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
const verifyVerificationCode = ({ email, verification_code, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find user by email
        const user = yield User.findOne({ email });
        if (!user) {
            throw new NotFoundError("User not found");
        }
        const otpDoc = yield Otps.findOne({ code_for: email });
        if (otpDoc) {
            const isValid = compareVerificationCode(otpDoc.code, verification_code);
            if (isValid) {
                yield User.findOneAndUpdate({ email }, { is_email_verified: true }, { upsert: true });
                yield Otps.deleteMany({ code_for: email });
                // Respond with success message
                const payloadDoc = {
                    verified: true,
                    message: "Email Verified",
                };
                return payloadDoc;
            }
            else {
                throw new NotFoundError("Invalid Code");
            }
        }
        else {
            throw new NotFoundError("Code has Been Expired");
        }
    }
    catch (error) {
        throw error;
    }
});
export const authService = {
    login,
    register,
    loginApp,
    registerApp,
    changePassword,
    refreshUserToken,
    sendVerificationCode,
    reSendVerificationCode,
    verifyVerificationCode,
};
//# sourceMappingURL=auth.service.js.map