import Joi from "joi";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { NextFunction, Response, Request } from "express";
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

export const validateViaJoi = async (
  schema: Joi.ObjectSchema<any>,
  data: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
      let modifiedErrors = {};
      error.details.forEach((err: Joi.ValidationErrorItem) => {
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
  } catch (err) {
    console.error(err); // Log unexpected errors
    next(err); // Pass error to error handling middleware
  }
};
