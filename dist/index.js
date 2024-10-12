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
import { dirname } from "path";
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
 * register logger for development env...
 */
const streams = [
    { stream: process.stdout }, // Log to console only
];
const logger = PinoLogger.pino({
    level: process.env.PINO_LOG_LEVEL || "info",
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
            levelFirst: true,
            messageFormat: "{msg}",
            translateTime: true, // Show human-readable time
        },
    },
}, pinoms.multistream(streams));
global.logger = logger;
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
const numCPUs = os.cpus().length;
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
        // process.exit(1); // Exit if server initialization fails
    });
}
process
    .on("unhandledRejection", (response, p) => {
    console.log(response);
    console.log(p);
})
    .on("uncaughtException", (err) => {
    logger.error(err);
});
//? OLD FILE
// import * as PinoLogger from "pino";
// import pinoms from "pino-multi-stream";
// import { fileURLToPath } from "url";
// import { dirname, join } from "path";
// import fs from "fs";
// import { initializeServer } from "./connections/http.connection.js";
// import dotenv from "dotenv";
// import { initializeDatabase } from "./connections/database.connection.js";
// import { createDefaultDatabase } from "./helpers/common.helpers..js";
// import cluster from "cluster";
// import os from "os";
// dotenv.config();
// const fileName = fileURLToPath(import.meta.url);
// const dirName = dirname(fileName);
// /**
//  * register logger for development env...
//  */
// const streams = [
//   { stream: process.stdout },
//   {
//     stream: fs.createWriteStream(join(dirName, "../logs/info.log"), {
//       flags: "a",
//     }),
//   },
// ];
// const logger = PinoLogger.pino(
//   {
//     level: process.env.PINO_LOG_LEVEL || "info",
//     transport: {
//       target: "pino-pretty",
//       options: {
//         colorize: true,
//       },
//     },
//   },
//   pinoms.multistream(streams)
// );
// global.logger = logger;
// // initializeDatabase()
// //   .then(() => {
// //     logger.info(`Database connection ✔`);
// //     initializeServer()
// //       .then(() => {
// //         createDefaultDatabase()
// //           .then(() => {
// //             logger.info(`Basic Data Created ✔`);
// //           })
// //           .catch((e) => {
// //             logger.error(e);
// //           });
// //       })
// //       .catch((e) => {
// //         logger.error(e);
// //       });
// //   })
// //   .catch((e) => {
// //     logger.error(e);
// //   });
// const numCPUs = os.cpus().length;
// if (cluster.isPrimary) {
//   console.log(`Primary ${process.pid} is running`);
//   // Fork workers for each CPU core
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }
//   // Handle worker exit
//   cluster.on("exit", (worker, code, signal) => {
//     console.log(`Worker ${worker.process.pid} died, starting a new one`);
//     cluster.fork(); // Restart a new worker if one dies
//   });
// } else {
//   initializeDatabase()
//     .then(() => {
//       logger.info(`Database connection ✔`);
//       initializeServer()
//         .then(() => {
//           createDefaultDatabase()
//             .then(() => {
//               logger.info(`Basic Data Created ✔`);
//             })
//             .catch((e) => {
//               logger.error(e);
//             });
//         })
//         .catch((e) => {
//           logger.error(e);
//         });
//     })
//     .catch((e) => {
//       logger.error(e);
//     });
// }
// process
//   .on("unhandledRejection", (response, p) => {
//     console.log(response);
//     console.log(p);
//   })
//   .on("uncaughtException", (err) => {
//     logger.error(err);
//   });
//# sourceMappingURL=index.js.map