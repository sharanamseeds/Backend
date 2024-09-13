import http from "http";
import https from "https";
import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import expressApp from "./express.connection.js";

const fileName = fileURLToPath(import.meta.url);
const dirName = dirname(fileName);

export let httpServer: any = null;

export const initializeServer = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const app = expressApp;
      const server =
        process.env.ENV === "production"
          ? https.createServer(
              {
                key: fs.readFileSync(join(dirName, "../../id_rsa_priv.pem")), //id_rsa_pub.pem id_rsa_priv.pem
                cert: fs.readFileSync(join(dirName, "../../id_rsa_pub.pem")),
              },
              app
            )
          : http.createServer(app);

      const port =
        process.env.PORT === "production"
          ? process.env.PROD_PORT
          : process.env.DEV_PORT || 8080;

      server.listen(port, () => {
        global.logger.info(`Server is running on port: ${port} successfully ✔`);
        httpServer = server;
        resolve();
      });
    } catch (e) {
      reject(e);
    }
  });
};
