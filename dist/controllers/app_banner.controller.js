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
import { appBannerService } from "../services/app_banner.service.js";
const getAppBanner = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bannerDoc = yield appBannerService.getAppBanner({
        req: req,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Banner Fetched Successfully!!",
        payload: { result: bannerDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const updateAppBanner = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bannerDoc = yield appBannerService.updateAppBanner({
        bannerId: req.params.id,
        req: req,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Banner Updated Successfully!!",
        payload: { result: bannerDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const deleteAppBannerImage = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let bodyData = {};
    if (((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.payload) && typeof req.query.payload === "string") {
        bodyData = JSON.parse(req.query.payload);
    }
    const bannerDoc = yield appBannerService.deleteAppBannerImage({
        bannerId: req.params.id,
        src: bodyData.src,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Banner Fetched Successfully!!",
        payload: { result: bannerDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
export const appBannerController = {
    updateAppBanner,
    deleteAppBannerImage,
    getAppBanner,
};
//# sourceMappingURL=app_banner.controller.js.map