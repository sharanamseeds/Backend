export const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => next(err));
    };
};
export const createResponseObject = ({ req, message = "", payload = {}, code, logPayload, }) => {
    const locale = req.headers.locale ? req.headers.locale.toString() : "en";
    return { code, message, logPayload, payload };
};
//# sourceMappingURL=request.helpers.js.map