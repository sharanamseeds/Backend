var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { catchAsync, createResponseObject, } from "../helpers/request.helpers.js";
import httpStatus from "http-status";
import { authService } from "../services/auth.service.js";
const login = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = yield authService.login({
        email: req.body.email,
        password: req.body.password,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Login successful",
        payload: payload,
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const changePassword = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = yield authService.changePassword({
        email: req.body.email,
        new_password: req.body.new_password,
        confirm_password: req.body.confirm_password,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Password Changed Successfully",
        payload: payload,
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const refreshUserToken = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = yield authService.refreshUserToken({
        refreshToken: req.body.refreshToken,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Token Refreshed Successfully",
        payload: payload,
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const sendVerificationCode = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = yield authService.sendVerificationCode({
        email: req.body.email,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Verification Code Sent Successfully",
        payload: payload,
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const reSendVerificationCode = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = yield authService.reSendVerificationCode({
        email: req.body.email,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Verification Code Sent Successfully",
        payload: payload,
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const verifyVerificationCode = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = yield authService.verifyVerificationCode({
        email: req.body.email,
        verification_code: req.body.verification_code,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Code Is Verified Successfully",
        payload: payload,
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const register = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = yield authService.register({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        confirm_password: req.body.confirm_password,
        gst_number: req.body.gst_number,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "User Created Succesfully",
        payload: payload,
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
export const authController = {
    login,
    changePassword,
    refreshUserToken,
    sendVerificationCode,
    reSendVerificationCode,
    verifyVerificationCode,
    register,
};
//# sourceMappingURL=auth.controller.js.map