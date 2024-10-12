var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as PinoLogger from "pino";
import pinoms from "pino-multi-stream";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import { initializeServer } from "./connections/http.connection.js";
import dotenv from "dotenv";
import { initializeDatabase } from "./connections/database.connection.js";
import { createDefaultDatabase } from "./helpers/common.helpers..js";
import cluster from "cluster";
import os from "os";
dotenv.config();
const fileName = fileURLToPath(import.meta.url);
const dirName = dirname(fileName);
/**
 * Register logger for development environment...
 */
const streams = [
    { stream: process.stdout },
    {
        stream: fs.createWriteStream(join(dirName, "../logs/info.log"), {
            flags: "a",
        }),
    },
];
const logger = PinoLogger.pino({
    level: process.env.PINO_LOG_LEVEL || "info",
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
        },
    },
}, pinoms.multistream(streams));
global.logger = logger;
const numCPUs = os.cpus().length;
// Function to initialize the database
function initializeApp() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield initializeDatabase();
            logger.info("Database connection ✔");
            yield createDefaultDatabase();
            logger.info("Default database created ✔");
        }
        catch (error) {
            logger.error("Error during database initialization:", error);
            process.exit(1); // Exit if database initialization fails
        }
    });
}
if (cluster.isPrimary) {
    logger.info(`Primary ${process.pid} is running`);
    // Initialize the database in the primary process before forking workers
    initializeApp().then(() => {
        // Fork workers for each CPU core
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }
        // Handle worker exit
        cluster.on("exit", (worker, code, signal) => {
            logger.info(`Worker ${worker.process.pid} died, starting a new one`);
            cluster.fork(); // Restart a new worker if one dies
        });
    });
}
else {
    // Workers can share any TCP connection
    initializeServer()
        .then(() => {
        logger.info(`Worker ${process.pid} is running`);
    })
        .catch((e) => {
        logger.error("Error initializing server in worker:", e);
        process.exit(1); // Exit if server initialization fails
    });
}
// Global error handlers
process
    .on("unhandledRejection", (reason, promise) => {
    logger.error("Unhandled Rejection at:", promise, "reason:", reason);
})
    .on("uncaughtException", (err) => {
    logger.error("Uncaught Exception thrown:", err);
    process.exit(1); // Exit on uncaught exceptions
});
//# sourceMappingURL=index.js.map