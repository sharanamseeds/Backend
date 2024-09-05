var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import cors from "cors";
import routes from "../router/routes.js";
import upload from "../middleware/upload.middleware.js";
import path from "path";
import { errorHandler, errorConverter } from "../middleware/error.js";
import { masterConfig } from "../config/master.config.js";
const app = express();
// const corsOptions = {
//   origin: ["http://localhost:3000", "http://15.206.141.175", "*"], // Allow connections from any origin
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// };
const corsOptions = {
    origin: function (origin, callback) {
        callback(null, origin);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed request headers
};
/* middlwares starts here */
app.use(express.json());
app.use(cors(corsOptions));
app.use(upload.any());
/* middlwares ends here */
/* serve static files */
app.use("/api/uploads", express.static(path.join(process.cwd(), masterConfig.fileStystem.folderPaths.BASE_FOLDER)));
app.use("/api/default_images", express.static(path.join(process.cwd(), masterConfig.fileStystem.folderPaths.DEFAULT_FOLDER)));
app.get("/api/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("Welcome To Server");
}));
app.use("/api/", routes);
// convert error to ApiError, if needed
app.use(errorConverter);
// handle error
app.use(errorHandler);
const expressApp = app;
export default expressApp;
//# sourceMappingURL=express.connection.js.map