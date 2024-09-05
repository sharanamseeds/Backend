import httpStatus from "http-status";
import { ApiError } from "../helpers/files.management.js";
import PERMISSION from "../models/permission.model.js";
import mongoose from "mongoose";

/**
 * Available permissions
 * can_add
 * can_read
 * can_read
 * can_select
 * can_update
 */

const CheckPermission = (modulePermissions) => (req, _, next) => {
  let user = req.user;

  function checkPermissions(element) {
    return new Promise((resolve, reject) => {
      const modulePermission = element;

      const aggregate = [
        {
          $match: {
            role: new mongoose.Types.ObjectId(user?.role_id), // Use mongoose.Types.ObjectId to cast to ObjectId
          },
        },
        {
          $lookup: {
            from: "modules",
            localField: "module",
            foreignField: "_id",
            as: "module",
          },
        },
        {
          $unwind: {
            path: "$module",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            "module.code": modulePermission.module.toString(), // Ensure module code is a string
            [modulePermission.permission]: true,
          },
        },
      ];

      PERMISSION.aggregate(aggregate)
        .then((permissionDoc) => {
          if (permissionDoc.length > 0) {
            resolve(true); // Permission granted
          } else {
            resolve(false); // Permission denied
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async function checkNestedConditions(conditions, operator) {
    if (operator === "and") {
      for (const condition of conditions) {
        const permissionGranted = await checkPermissions(condition);
        if (!permissionGranted) {
          return false;
        }
      }
      return true;
    } else if (operator === "or") {
      for (const condition of conditions) {
        const permissionGranted = await checkPermissions(condition);
        if (permissionGranted) {
          return true;
        }
      }
      return false;
    } else {
      throw new Error("Invalid operator");
    }
  }

  async function checkNext() {
    for (const permissionSet of modulePermissions) {
      let { operator = "or", conditions = [] } = permissionSet;
      if (conditions?.length <= 0) {
        conditions = [{ ...permissionSet }];
      }

      const permissionGranted = await checkNestedConditions(
        conditions,
        operator
      );

      if (permissionGranted) {
        return next();
      }
    }

    next(
      new ApiError(httpStatus.FORBIDDEN, "permission_denied", {
        validation_errors: null,
      })
    );
  }

  checkNext().catch((error) => {
    next(
      new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "internal_server_error", {
        validation_errors: null,
      })
    );
  });
};

export default CheckPermission;

/**
 *
 * Permission check with multiple modules with conditions
 *
 * checkPermission([
 *   {
 *     operator: "and", // or "or"
 *     conditions: [
 *       { module: systemModules.COMPANY, permission: "can_select" },
 *       { module: systemModules.PUBLIC_COMPANY_MODULE, permission: "can_select" },
 *       {
 *         operator: "or",
 *         conditions: [
 *           { module: systemModules.MODULE_A, permission: "read" },
 *           { module: systemModules.MODULE_B, permission: "write" },
 *         ],
 *       },
 *     ],
 *   },
 *    This is work like a "or" operator if any one is true then is works
 *   {
 *     operator: "or", // or "or"
 *     conditions: [
 *       { module: systemModules.COMPANY, permission: "can_select" },
 *       {
 *         operator: "or",
 *         conditions: [
 *           { module: systemModules.MODULE_A, permission: "read" },
 *           { module: systemModules.MODULE_B, permission: "write" },
 *         ],
 *       },
 *     ],
 *   },
 * ]);
 */

/**
 * old check
 *   module.exports = (modulePermissions) => (req, _, next) => {
 *   let user = req.user;
 *   let permissionGranted = false;
 *
 *   function checkPermissions(element) {
 *     return new Promise((resolve, reject) => {
 *       const modulePermission = element;
 *
 *       global.models.GLOBAL.PERMISSION.aggregate([
 *         {
 *           $match: {
 *             role: new ObjectId(user.role),
 *           },
 *         },
 *         {
 *           $lookup: {
 *             from: global.collections.MODULE,
 *             localField: "module",
 *             foreignField: "_id",
 *             as: "module",
 *           },
 *         },
 *         {
 *           $unwind: {
 *             path: "$module",
 *             preserveNullAndEmptyArrays: true,
 *           },
 *         },
 *         {
 *           $match: {
 *             "module.code": modulePermission.module,
 *             [modulePermission.permission]: true,
 *           },
 *         },
 *       ])
 *         .then((permissionDoc) => {
 *           if (permissionDoc.length > 0) {
 *             permissionGranted = true;
 *             resolve();
 *           } else {
 *             resolve();
 *           }
 *         })
 *         .catch((error) => {
 *           reject(error);
 *         });
 *     });
 *   }
 *
 *   function checkNext() {
 *     if (permissionGranted) {
 *       next();
 *     } else {
 *       next(new ApiError(httpStatus.FORBIDDEN, "permission_denied"));
 *     }
 *   }
 *
 *   const promises = modulePermissions.map(checkPermissions);
 *
 *   Promise.all(promises)
 *     .then(checkNext)
 *     .catch(() => {
 *       next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "internal_server_error"));
 *     });
 * };
 */
