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
import { companyService } from "../services/company.service.js";
const getCompany = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const companyDoc = yield companyService.getCompany({
        companyId: req.params.id,
        query: req.query,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Company Fetched Successfully!!",
        payload: { result: companyDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const getCompanyList = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const companyDoc = yield companyService.getCompanyList({
        query: req.query,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Company List Fetched Successfully!!",
        payload: { result: companyDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const updateCompany = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const companyDoc = yield companyService.updateCompany({
        companyId: req.params.id,
        requestUser: req.user,
        req: req,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Company Updated Successfully!!",
        payload: { result: companyDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const addCompany = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const companyDoc = yield companyService.addCompany({
        requestUser: req.user,
        req: req,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Company Added Successfully!!",
        payload: { result: companyDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const deleteCompany = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const companyDoc = yield companyService.deleteCompany({
        companyId: req.params.id,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Company Deleted Successfully!!",
        payload: { result: companyDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
export const companyController = {
    getCompany,
    addCompany,
    getCompanyList,
    updateCompany,
    deleteCompany,
};
//# sourceMappingURL=company.controller.js.map