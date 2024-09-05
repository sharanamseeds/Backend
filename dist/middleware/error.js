import mongoose from "mongoose";
import httpStatus from "http-status";
import { ApiError } from "../helpers/files.management.js";
import { createResponseObject } from "../utils/utils.js";
const errorConverter = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || error instanceof mongoose.Error
            ? httpStatus.BAD_REQUEST
            : httpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || httpStatus[statusCode];
        error = new ApiError(statusCode, message, { validation_errors: null }, "", false, err.stack);
    }
    next(error);
};
const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;
    if (process.env.ENV === "production" && !err.isOperational) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
    }
    res.locals.errorMessage = err.message;
    if (process.env.ENV === "development") {
        global.logger.error(err);
    }
    const data4responseObject = {
        req: req,
        message: message,
        payload: {},
        logPayload: false,
    };
    // Send JSON response
    res.status(statusCode).json(createResponseObject(data4responseObject));
};
export { errorConverter, errorHandler };
//# sourceMappingURL=error.js.map