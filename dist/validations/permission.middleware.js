import * as yup from "yup";
const addPermission = yup.object().shape({
    role: yup.string().required(),
    module: yup.string().required(),
    can_read: yup.boolean().default(false),
    can_select: yup.boolean().default(false),
    can_add: yup.boolean().default(false),
    can_update: yup.boolean().default(false),
    can_delete: yup.boolean().default(false),
    can_upload: yup.boolean().default(false),
    can_download: yup.boolean().default(false),
});
const updatePermission = yup.object().shape({
    can_read: yup.boolean().default(false),
    can_select: yup.boolean().default(false),
    can_add: yup.boolean().default(false),
    can_update: yup.boolean().default(false),
    can_delete: yup.boolean().default(false),
    can_upload: yup.boolean().default(false),
    can_download: yup.boolean().default(false),
});
const getPermissionList = yup.object().shape({
    role: yup.string().required(),
    lang_code: yup.string(),
});
export const permissionMiddleware = {
    addPermission,
    updatePermission,
    getPermissionList,
};
//# sourceMappingURL=permission.middleware.js.map