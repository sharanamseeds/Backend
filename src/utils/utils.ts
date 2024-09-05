import { flatten } from "flat";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import _ from "lodash"; // Assuming lodash is installed and imported

interface CreateResponseObjectParams {
  req: AuthenticatedRequest;
  result?: number;
  message?: string;
  payload?: Record<string, any>;
  logPayload?: boolean;
}

const createResponseObject = ({
  req,
  result = 0,
  message = "",
  payload = {},
  logPayload = false,
}: CreateResponseObjectParams) => {
  let payload2log: Record<string, any> = {};
  if (logPayload) {
    payload2log = flatten({ ...payload }); // Assuming flatten function is defined
  }

  let messageToLog = `RES [${req.requestId}] [${req.method}] ${req.originalUrl}`;
  messageToLog +=
    (!_.isEmpty(message) ? `\n${message}` : "") +
    (!_.isEmpty(payload) && logPayload
      ? `\npayload: ${JSON.stringify(payload2log, null, 4)}`
      : "");

  // Uncomment the logging logic if logger and flatten functions are defined and imported
  // if (result < 0 && (result !== -50 || result !== -51)) {
  //   logger.error(messageToLog);
  // } else if (!_.isEmpty(messageToLog)) {
  //   logger.info(messageToLog);
  // }

  return { message: message, payload: payload };
};

export { createResponseObject };