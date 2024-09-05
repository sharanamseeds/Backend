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
// export const validateViaJoi = (schema: Joi.ObjectSchema<any>, data: any) => {
//   async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//     console.log(req, res, next, "req,res,next");
//     const { error } = schema.validate(data, { abortEarly: false });
//     if (error) {
//       return res.status(httpStatus.BAD_REQUEST).send(error.details);
//     }
//     next();
//   };
// };
export const validateViaJoi = (schema, data, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = schema.validate(data, { abortEarly: false });
        if (error) {
            let modifiedErrors = {};
            error.details.forEach((err) => {
                modifiedErrors[`${err.path}`] = { message: err.message };
                // ({ `err`: err.message })
            }); // Extract error messages
            return res
                .status(httpStatus.BAD_REQUEST)
                .json({ errors: modifiedErrors }); // Send JSON response with errors
        }
        // Access request data if needed:
        // const userId = req.user?.id; // Example: access user ID from request
        next(); // Move to the next middleware or route handler
    }
    catch (err) {
        console.error(err); // Log unexpected errors
        next(err); // Pass error to error handling middleware
    }
});
//# sourceMappingURL=joi.validation.js.map