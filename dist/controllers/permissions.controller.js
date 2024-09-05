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
import { permissionService } from "../services/permissions.service.js";
const getPermission = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissionDoc = yield permissionService.getPermission({
        permissionId: req.params.id,
        query: req.query,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Permission Fetched Successfully!!",
        payload: { result: permissionDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const getPermissionList = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissionDoc = yield permissionService.getPermissionList({
        query: req.query,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Permission List Fetched Successfully!!",
        payload: { result: permissionDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const updatePermission = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissionDoc = yield permissionService.updatePermission({
        permissionId: req.params.id,
        requestUser: req.user,
        req: req,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Permission Updated Successfully!!",
        payload: { result: permissionDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const addPermission = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissionDoc = yield permissionService.addPermission({
        requestUser: req.user,
        req: req,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Permission Added Successfully!!",
        payload: { result: permissionDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const deletePermission = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissionDoc = yield permissionService.deletePermission({
        permissionId: req.params.id,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Permission Deleted Successfully!!",
        payload: { result: permissionDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
export const permissionController = {
    getPermission,
    addPermission,
    getPermissionList,
    updatePermission,
    deletePermission,
};
//# sourceMappingURL=permissions.controller.js.map