import * as yup from "yup";
const addLanguage = yup.object().shape({
    lang_code: yup.string().required(),
    lang_name: yup.string().required(),
});
const updateLanguage = yup.object().shape({
    lang_name: yup.string(),
});
export const languageMiddleware = {
    addLanguage,
    updateLanguage,
};
//# sourceMappingURL=languages.middleware.js.map