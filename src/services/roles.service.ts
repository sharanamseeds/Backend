import mongoose, { Document } from "mongoose";
import Role, { typeRole } from "../models/roles.model.js";
import User, { typeUser } from "../models/users.model.js";
import { escapeRegex, makeIdentifier } from "../helpers/common.helpers..js";

const getRoleList = async ({
  query,
}: {
  query?: any;
}): Promise<{
  data: (Document<unknown, {}, typeRole> | null)[];
  meta: {
    docsFound: number;
    docsInResponse: number;
    limit: number;
    total_pages: number;
    currentPage: number;
  };
}> => {
  try {
    let {
      limit,
      page,
      pagination = true,
      sortBy = "createdAt",
      sortOrder = "asc",
      role_name,
      is_active,
      search,
    } = query;

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

    let filterQuery: any = {};

    if (role_name) {
      filterQuery.role_name = role_name;
    }
    if (is_active) {
      filterQuery.is_active = is_active;
    }
    // Apply search logic
    if (search) {
      filterQuery.$or = [
        { role_name: { $regex: escapeRegex(search), $options: "i" } },
      ];
    }

    const totalDocs = await Role.countDocuments(filterQuery);

    if (!pagination) {
      const roleDoc = await Role.find(filterQuery).sort({
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

    const roleDoc = await Role.find(filterQuery)
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
  } catch (error) {
    throw error;
  }
};

const getRole = async ({
  roleId,
  query,
}: {
  roleId: string;
  query?: any;
}): Promise<Document<unknown, {}, typeRole> | null> => {
  try {
    const roleDoc = await Role.findById(roleId);
    return roleDoc;
  } catch (error) {
    throw error;
  }
};
const addRole = async ({
  requestUser,
  req,
}: {
  requestUser: typeUser | null;
  req?: any;
}): Promise<Document<unknown, {}, typeRole> | null> => {
  try {
    const role = new Role({
      added_by: requestUser._id,
      updated_by: requestUser._id,
      role_name: req.body?.role_name,
      is_active: req.body?.is_active || true,
      identifier: makeIdentifier(req.body.role_name),
    });

    const roleDoc = await role.save();
    return roleDoc;
  } catch (error) {
    throw error;
  }
};

const updateRole = async ({
  roleId,
  requestUser,
  req,
}: {
  roleId: string;
  requestUser: typeUser | null;
  req?: any;
}): Promise<Document<unknown, {}, typeRole> | null> => {
  try {
    let roleDoc = await Role.findById(roleId);
    if (req.body?.role_name || req.body?.is_active) {
      roleDoc.updated_by = requestUser._id;
      if (req.body.role_name) {
        roleDoc.role_name = req.body.role_name;
        roleDoc.identifier = makeIdentifier(req.body.role_name);
      }
      if ("is_active" in req.body) {
        roleDoc.is_active = req.body.is_active;
      }
      const updatedRole = await roleDoc.save();

      return updatedRole;
    }
    return roleDoc;
  } catch (error) {
    throw error;
  }
};

const deleteRole = async ({ roleId }: { roleId: string }): Promise<void> => {
  try {
    const roleDoc = await Role.findById(roleId);
    if (!roleDoc) {
      throw new Error("Role Not Found");
    }
    if (roleDoc.identifier === "super_admin") {
      throw new Error("Super Admin Role Can Not Be Deleted");
    }

    await User.updateMany(
      { role_id: roleId },
      { $set: { is_verified: false, role_id: null } }
    );
    await Role.findByIdAndDelete(roleId);
  } catch (error) {
    throw error;
  }
};

export const roleService = {
  getRole,
  addRole,
  getRoleList,
  updateRole,
  deleteRole,
};
