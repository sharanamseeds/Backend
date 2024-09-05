import Joi from "joi";
const addPermissionSchema = Joi.object({
    role: Joi.string().required(),
    module: Joi.string().required(),
    can_read: Joi.boolean().default(false),
    can_select: Joi.boolean().default(false),
    can_add: Joi.boolean().default(false),
    can_update: Joi.boolean().default(false),
    can_delete: Joi.boolean().default(false),
    can_upload: Joi.boolean().default(false),
    can_download: Joi.boolean().default(false),
});
const updatePermissionSchema = Joi.object({
    can_read: Joi.boolean().allow(""),
    can_select: Joi.boolean().allow(""),
    can_add: Joi.boolean().allow(""),
    can_update: Joi.boolean().allow(""),
    can_delete: Joi.boolean().allow(""),
    can_upload: Joi.boolean().allow(""),
    can_download: Joi.boolean().allow(""),
});
const getPermissionListSchema = Joi.object({
    role: Joi.string().required(),
    lang_code: Joi.string().allow(""),
});
export const permissionMiddlewareSchema = {
    addPermission: addPermissionSchema,
    updatePermission: updatePermissionSchema,
    getPermissionList: getPermissionListSchema,
};
//# sourceMappingURL=permission.validation.js.map