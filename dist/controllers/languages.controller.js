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
import { languageService } from "../services/languages.service.js";
const getLanguage = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const languageDoc = yield languageService.getLanguage({
        languageId: req.params.id,
        query: req.query,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Language Fetched Successfully!!",
        payload: { result: languageDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const getLanguageList = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const languageDoc = yield languageService.getLanguageList({
        query: req.query,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Language List Fetched Successfully!!",
        payload: { result: languageDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const updateLanguage = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const languageDoc = yield languageService.updateLanguage({
        languageId: req.params.id,
        requestUser: req.user,
        req: req
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Language Updated Successfully!!",
        payload: { result: languageDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const addLanguage = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const languageDoc = yield languageService.addLanguage({
        requestUser: req.user,
        req: req
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Language Added Successfully!!",
        payload: { result: languageDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const deleteLanguage = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const languageDoc = yield languageService.deleteLanguage({
        languageId: req.params.id,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Language Deleted Successfully!!",
        payload: { result: languageDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
export const languageController = {
    getLanguage,
    addLanguage,
    getLanguageList,
    updateLanguage,
    deleteLanguage,
};
//# sourceMappingURL=languages.controller.js.map