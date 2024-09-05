import * as yup from "yup";
const userLogin = yup.object().shape({
    password: yup.string().required(),
    email: yup
        .string()
        .email("Invalid email format")
        .required("Email is required"),
});
const register = yup.object().shape({
    password: yup.string().required(),
    email: yup
        .string()
        .email("Invalid email format")
        .required("Email is required"),
    name: yup.string().required(),
    contact_number: yup.string().required(),
});
const changePassword = yup.object().shape({
    new_password: yup.string().required(),
    confirm_password: yup
        .string()
        .required()
        .oneOf([yup.ref("new_password"), null], "Passwords must match"),
    email: yup
        .string()
        .email("Invalid email format")
        .required("Email is required"),
});
const refreshUserToken = yup.object().shape({
    refreshToken: yup.string().required(),
});
const sendVerificationCode = yup.object().shape({
    email: yup
        .string()
        .email("Invalid email format")
        .required("Email is required"),
});
const verifyVerificationCode = yup.object().shape({
    email: yup
        .string()
        .email("Invalid email format")
        .required("Email is required"),
    verification_code: yup.string().required(),
});
export const authMiddleware = {
    userLogin,
    changePassword,
    refreshUserToken,
    sendVerificationCode,
    verifyVerificationCode,
    register,
};
//# sourceMappingURL=auth.middleware.js.map