import mongoose, { Document } from "mongoose";
import { typeUser } from "../models/users.model.js";
import Permissions, { typePermission } from "../models/permission.model.js";
import Role from "../models/roles.model.js";

const getPermissionList = async ({
  query,
}: {
  query?: any;
}): Promise<(Document<unknown, {}, typePermission> | null)[]> => {
  try {
    const permissionDoc = await Permissions.find({
      role: new mongoose.Types.ObjectId(query.role),
    });
    return permissionDoc;
  } catch (error) {
    throw error;
  }
};

const getPermission = async ({
  permissionId,
  query,
}: {
  permissionId: string;
  query?: any;
}): Promise<Document<unknown, {}, typePermission> | null> => {
  try {
    const permissionDoc = await Permissions.findById(permissionId);

    return permissionDoc[0];
  } catch (error) {
    throw error;
  }
};
const addPermission = async ({
  requestUser,
  req,
}: {
  requestUser: typeUser | null;
  req?: any;
}): Promise<Document<unknown, {}, typePermission> | null> => {
  try {
    const permissionData = {};

    Object.assign(permissionData, req.body, {
      added_by: requestUser._id.toString(),
      updated_by: requestUser._id.toString(),
    });

    const permission = new Permissions({
      ...permissionData,
    });

    let permissionDoc = await permission.save();

    permissionDoc = await permissionDoc.save();
    return permissionDoc;
  } catch (error) {
    throw error;
  }
};

const updatePermission = async ({
  permissionId,
  requestUser,
  req,
}: {
  permissionId: string;
  requestUser: typeUser | null;
  req?: any;
}): Promise<Document<unknown, {}, typePermission> | null> => {
  try {
    let permissionDoc = await Permissions.findById(permissionId);

    if (!permissionDoc) {
      throw new Error("Permission Not Found");
    }

    const roleDoc = await Role.findById(permissionDoc.role);

    if (roleDoc.identifier === "super_admin") {
      throw new Error("Super Admin Permission Can Not Be Updated");
    }

    Object.assign(permissionDoc, {
      ...req.body,
      updated_by: requestUser._id.toString(),
    });

    const updatedPermission = await permissionDoc.save();

    return updatedPermission;
  } catch (error) {
    throw error;
  }
};

const deletePermission = async ({
  permissionId,
}: {
  permissionId: string;
}): Promise<void> => {
  try {
    throw new Error("Permission Can Not Be Deleted");
    await Permissions.findByIdAndDelete(permissionId);
  } catch (error) {
    throw error;
  }
};

export const permissionService = {
  getPermission,
  addPermission,
  getPermissionList,
  updatePermission,
  deletePermission,
};
