import express, { Request, Response } from "express";
import cors from "cors";
import routes from "../router/routes.js";
import upload from "../middleware/upload.middleware.js";
import path from "path";
import { errorHandler, errorConverter } from "../middleware/error.js";
import { masterConfig, rootDir } from "../config/master.config.js";

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
  credentials: true, // Allow credentials to be sent with the request
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed request headers
};

/* middlwares starts here */
app.use(express.json());
app.use(cors(corsOptions));
app.use(upload.any());
/* middlwares ends here */

/* serve static files */
app.use(
  "/api/uploads",
  express.static(
    path.join(rootDir, masterConfig.fileStystem.folderPaths.BASE_FOLDER)
  )
);
app.use(
  "/api/default_images",
  express.static(
    path.join(rootDir, masterConfig.fileStystem.folderPaths.DEFAULT_FOLDER)
  )
);

app.get("/api/", async (req: Request, res: Response) => {
  res.send("Welcome To Server");
});

app.use("/api/", routes);

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

const expressApp = app;

export default expressApp;
