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
import Permissions from "../models/permission.model.js";
import Role from "../models/roles.model.js";
const getPermissionList = ({ query, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const permissionDoc = yield Permissions.find({
            role: new mongoose.Types.ObjectId(query.role),
        });
        return permissionDoc;
    }
    catch (error) {
        throw error;
    }
});
const getPermission = ({ permissionId, query, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const permissionDoc = yield Permissions.findById(permissionId);
        return permissionDoc[0];
    }
    catch (error) {
        throw error;
    }
});
const addPermission = ({ requestUser, req, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const permissionData = {};
        Object.assign(permissionData, req.body, {
            added_by: requestUser._id.toString(),
            updated_by: requestUser._id.toString(),
        });
        const permission = new Permissions(Object.assign({}, permissionData));
        let permissionDoc = yield permission.save();
        permissionDoc = yield permissionDoc.save();
        return permissionDoc;
    }
    catch (error) {
        throw error;
    }
});
const updatePermission = ({ permissionId, requestUser, req, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let permissionDoc = yield Permissions.findById(permissionId);
        if (!permissionDoc) {
            throw new Error("Permission Not Found");
        }
        const roleDoc = yield Role.findById(permissionDoc.role);
        if (roleDoc.identifier === "super_admin") {
            throw new Error("Super Admin Permission Can Not Be Updated");
        }
        Object.assign(permissionDoc, Object.assign(Object.assign({}, req.body), { updated_by: requestUser._id.toString() }));
        const updatedPermission = yield permissionDoc.save();
        return updatedPermission;
    }
    catch (error) {
        throw error;
    }
});
const deletePermission = ({ permissionId, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        throw new Error("Permission Can Not Be Deleted");
        yield Permissions.findByIdAndDelete(permissionId);
    }
    catch (error) {
        throw error;
    }
});
export const permissionService = {
    getPermission,
    addPermission,
    getPermissionList,
    updatePermission,
    deletePermission,
};
//# sourceMappingURL=permissions.service.js.map