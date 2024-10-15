import * as PinoLogger from "pino";
import pinoms from "pino-multi-stream";
import { initializeServer } from "./connections/http.connection.js";
import dotenv from "dotenv";
import { initializeDatabase } from "./connections/database.connection.js";
import { createDefaultDatabase } from "./helpers/common.helpers..js";

dotenv.config();

const streams = [
  { stream: process.stdout }, // Log to console only
];

const logger = PinoLogger.pino(
  {
    level: process.env.PINO_LOG_LEVEL || "info",
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true, // Colorize the output for better readability
        levelFirst: true, // Print log level first
        messageFormat: "{msg}", // Only log the message, no other metadata
        translateTime: true, // Show human-readable time
      },
    },
  },
  pinoms.multistream(streams)
);

global.logger = logger;

async function initializeApp() {
  try {
    await initializeDatabase();
    logger.info("Database connection ✔");
    await createDefaultDatabase();
    logger.info("Default database created ✔");
  } catch (error) {
    logger.error("Error during database initialization:", error);
  }
}

initializeApp()
  .then(() => {
    initializeServer()
      .then(() => {
        logger.info(`Server Started`);
      })
      .catch((e) => {
        logger.error("Error initializing server in worker:", e);
      });
  })
  .catch((e) => {
    logger.error("Error initializing server in worker:", e);
  });

process
  .on("unhandledRejection", (response, p) => {
    console.log(response);
    console.log(p);
  })
  .on("uncaughtException", (err) => {
    logger.error(err);
  });

// const numCPUs = os.cpus().length;
// if (cluster.isPrimary) {

//   // Fork workers for each CPU core
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   // Handle worker exit
//   cluster.on("exit", (worker, code, signal) => {
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
