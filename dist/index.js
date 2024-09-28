import * as PinoLogger from "pino";
import pinoms from "pino-multi-stream";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import { initializeServer } from "./connections/http.connection.js";
import dotenv from "dotenv";
import { initializeDatabase } from "./connections/database.connection.js";
import { createDefaultDatabase } from "./helpers/common.helpers..js";
dotenv.config();
const fileName = fileURLToPath(import.meta.url);
const dirName = dirname(fileName);
/**
 * register logger for development env...
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
initializeDatabase()
    .then(() => {
    logger.info(`Database connection ✔`);
    initializeServer()
        .then(() => {
        createDefaultDatabase()
            .then(() => {
            logger.info(`Basic Data Created ✔`);
        })
            .catch((e) => {
            logger.error(e);
        });
    })
        .catch((e) => {
        logger.error(e);
    });
})
    .catch((e) => {
    logger.error(e);
});
process
    .on("unhandledRejection", (response, p) => {
    console.log(response);
    console.log(p);
})
    .on("uncaughtException", (err) => {
    logger.error(err);
});
// Test
//# sourceMappingURL=index.js.map