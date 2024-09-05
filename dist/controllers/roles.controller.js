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
import { roleService } from "../services/roles.service.js";
const getRole = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roleDoc = yield roleService.getRole({
        roleId: req.params.id,
        query: req.query,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Role Fetched Successfully!!",
        payload: { result: roleDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const getRoleList = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roleDoc = yield roleService.getRoleList({
        query: req.query,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Role List Fetched Successfully!!",
        payload: { result: roleDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const updateRole = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roleDoc = yield roleService.updateRole({
        roleId: req.params.id,
        requestUser: req.user,
        req: req,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Role Updated Successfully!!",
        payload: { result: roleDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const addRole = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roleDoc = yield roleService.addRole({
        requestUser: req.user,
        req: req,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Role Added Successfully!!",
        payload: { result: roleDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
const deleteRole = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roleDoc = yield roleService.deleteRole({
        roleId: req.params.id,
    });
    const data4responseObject = {
        req: req,
        code: httpStatus.OK,
        message: "Role Deleted Successfully!!",
        payload: { result: roleDoc },
        logPayload: false,
    };
    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
}));
export const roleController = {
    getRole,
    addRole,
    getRoleList,
    updateRole,
    deleteRole,
};
//# sourceMappingURL=roles.controller.js.map