import mongoose, { Document } from "mongoose";
import PERMISSION from "../models/permission.model.js";
import httpStatus from "http-status";
import { ApiError } from "../helpers/files.management.js";
import MODULE from "../models/modules.model.js";

const getAccessibleMenus = async ({ user }: { user?: any }) => {
  const permissionDocs = await PERMISSION.find(
    {
      role: new mongoose.Types.ObjectId(user.role_id),
      $or: [{ can_read: true }, { can_select: true }],
      deleted: {
        $ne: true,
      },
    },
    { module: 1 }
  );

  const accessibleModulesIds = permissionDocs.map((p) => p.module);

  try {
    const accessibleModules = await MODULE.aggregate([
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
  } catch (error) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "while_attempting_to_retrieve_the_roles_an_issue_occurred",
      { validation_errors: null }
    );
  }
};

const getModules = async ({ user }: { user: any }) => {
  try {
    const roleDoc = await MODULE.find();
    return roleDoc;
  } catch (error) {
    throw error;
  }
};

export const moduleService = {
  getAccessibleMenus,
  getModules,
};
