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
import PERMISSION from "../models/permission.model.js";
import httpStatus from "http-status";
import { ApiError } from "../helpers/files.management.js";
import MODULE from "../models/modules.model.js";
const getAccessibleMenus = ({ user }) => __awaiter(void 0, void 0, void 0, function* () {
    const permissionDocs = yield PERMISSION.find({
        role: new mongoose.Types.ObjectId(user.role_id),
        $or: [{ can_read: true }, { can_select: true }],
        deleted: {
            $ne: true,
        },
    }, { module: 1 });
    const accessibleModulesIds = permissionDocs.map((p) => p.module);
    try {
        const accessibleModules = yield MODULE.aggregate([
            {
                $match: {
                    parentId: null,
                    _id: {
                        $in: accessibleModulesIds,
                    },
                },
            },
            {
                $lookup: {
                    from: "permissions",
                    let: {
                        moduleId: "$_id",
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$$moduleId", "$module"],
                                },
                                role: new mongoose.Types.ObjectId(user.role),
                                deleted: {
                                    $ne: true,
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                deleted: 0,
                                module: 0,
                                createdAt: 0,
                                updatedAt: 0,
                                role: 0,
                                __v: 0,
                            },
                        },
                    ],
                    as: "permission",
                },
            },
            {
                $unwind: {
                    path: "$permission",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    name: 1,
                    code: 1,
                    route: 1,
                    permission: 1,
                },
            },
        ]);
        return accessibleModules;
    }
    catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, "while_attempting_to_retrieve_the_roles_an_issue_occurred", { validation_errors: null });
    }
});
const getModules = ({ user }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roleDoc = yield MODULE.find();
        return roleDoc;
    }
    catch (error) {
        throw error;
    }
});
export const moduleService = {
    getAccessibleMenus,
    getModules,
};
//# sourceMappingURL=module.service.js.map