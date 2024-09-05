import * as yup from "yup";
const addRole = yup.object().shape({
    role_name: yup.string().required("Role name is required"),
    is_active: yup.boolean().default(true),
});
const updateRole = yup.object().shape({
    role_name: yup.string(),
    is_active: yup.boolean().default(true),
});
export const roleMiddleware = {
    addRole,
    updateRole,
};
//# sourceMappingURL=roles.middleware.js.map