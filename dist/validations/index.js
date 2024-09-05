var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import httpStatus from "http-status";
// Define the ValidationErrors interface
export const validateSchema = (schema, key) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const requiredFiels = Object.keys(schema["fields"]);
    const validationData = req[key];
    let errors = {};
    Object.keys(validationData).forEach((field) => {
        if (!requiredFiels.includes(field)) {
            errors[field] = `${field} is not allowed`;
        }
    });
    if (Object.keys(errors).length > 0) {
        return res.status(httpStatus.BAD_REQUEST).json({
            error: "Validation failed",
            errorObject: errors,
        });
    }
    try {
        yield schema.validate(validationData, {
            strict: true,
        });
        return next();
    }
    catch (err) {
        const key = err.path;
        errors[key] = err.message;
        return res.status(httpStatus.BAD_REQUEST).json({
            error: "Validation failed",
            errorObject: errors,
        });
    }
});
//# sourceMappingURL=index.js.map