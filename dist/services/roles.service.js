var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Role from "../models/roles.model.js";
import User from "../models/users.model.js";
import { makeIdentifier } from "../helpers/common.helpers..js";
const getRoleList = ({ query, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { limit, page, pagination = true, sortBy = "createdAt", sortOrder = "asc", role_name, is_active, search, } = query;
        if (typeof limit === "string") {
            limit = Number(limit);
        }
        if (!limit || isNaN(limit)) {
            limit = 50;
        }
        if (typeof page === "string") {
            page = Number(page);
        }
        if (!page || isNaN(page)) {
            page = 1;
        }
        if (typeof pagination === "string") {
            pagination = pagination === "true";
        }
        let filterQuery = {};
        if (role_name) {
            filterQuery.role_name = role_name;
        }
        if (is_active) {
            filterQuery.is_active = is_active;
        }
        // Apply search logic
        if (search) {
            filterQuery.$or = [{ role_name: { $regex: search, $options: "i" } }];
        }
        const totalDocs = yield Role.countDocuments(filterQuery);
        if (!pagination) {
            const roleDoc = yield Role.find(filterQuery).sort({
                [sortBy]: sortOrder === "asc" ? 1 : -1,
            }); // Sorting logic
            return {
                data: roleDoc,
                meta: {
                    docsFound: totalDocs,
                    docsInResponse: roleDoc.length,
                    limit,
                    total_pages: 1,
                    currentPage: 1,
                },
            };
        }
        const roleDoc = yield Role.find(filterQuery)
            .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 }) // Sorting logic
            .skip((page - 1) * limit)
            .limit(limit);
        const total_pages = Math.ceil(totalDocs / limit);
        const meta = {
            docsFound: totalDocs,
            docsInResponse: roleDoc.length,
            limit,
            total_pages,
            currentPage: page,
        };
        return { data: roleDoc, meta };
    }
    catch (error) {
        throw error;
    }
});
const getRole = ({ roleId, query, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roleDoc = yield Role.findById(roleId);
        return roleDoc;
    }
    catch (error) {
        throw error;
    }
});
const addRole = ({ requestUser, req, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const role = new Role({
            added_by: requestUser._id,
            updated_by: requestUser._id,
            role_name: (_a = req.body) === null || _a === void 0 ? void 0 : _a.role_name,
            is_active: ((_b = req.body) === null || _b === void 0 ? void 0 : _b.is_active) || true,
            identifier: makeIdentifier(req.body.role_name),
        });
        const roleDoc = yield role.save();
        return roleDoc;
    }
    catch (error) {
        throw error;
    }
});
const updateRole = ({ roleId, requestUser, req, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        let roleDoc = yield Role.findById(roleId);
        if (((_c = req.body) === null || _c === void 0 ? void 0 : _c.role_name) || ((_d = req.body) === null || _d === void 0 ? void 0 : _d.is_active)) {
            roleDoc.updated_by = requestUser._id;
            if (req.body.role_name) {
                roleDoc.role_name = req.body.role_name;
                roleDoc.identifier = makeIdentifier(req.body.role_name);
            }
            if ("is_active" in req.body) {
                roleDoc.is_active = req.body.is_active;
            }
            const updatedRole = yield roleDoc.save();
            return updatedRole;
        }
        return roleDoc;
    }
    catch (error) {
        throw error;
    }
});
const deleteRole = ({ roleId }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roleDoc = yield Role.findById(roleId);
        if (!roleDoc) {
            throw new Error("Role Not Found");
        }
        if (roleDoc.identifier === "super_admin") {
            throw new Error("Super Admin Role Can Not Be Deleted");
        }
        yield User.updateMany({ role_id: roleId }, { $set: { is_verified: false, role_id: null } });
        yield Role.findByIdAndDelete(roleId);
    }
    catch (error) {
        throw error;
    }
});
export const roleService = {
    getRole,
    addRole,
    getRoleList,
    updateRole,
    deleteRole,
};
//# sourceMappingURL=roles.service.js.map