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
// const cluster = require('node:cluster');
// const numCPUs = require('node:os').availableParallelism();
// const process = require('node:process');
// if (cluster.isPrimary) {
//   console.log(Primary ${process.pid} is running);
//   // Fork workers for each CPU core
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }
//   // Handle worker exit
//   cluster.on('exit', (worker, code, signal) => {
//     console.log(Worker ${worker.process.pid} died, starting a new one);
//     cluster.fork(); // Restart a new worker if one dies
//   });
// } else {
//   // Each worker runs the Express app
//   require('./app'); // Import the express app from a separate file
// }
// { $sort: { [options.sortBy]: options.sortOrder, _id: 1 } },
//# sourceMappingURL=index.js.map