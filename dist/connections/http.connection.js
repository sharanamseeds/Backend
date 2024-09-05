var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import http from "http";
import { dirname } from "path";
import { fileURLToPath } from "url";
import expressApp from "./express.connection.js";
const fileName = fileURLToPath(import.meta.url);
const dirName = dirname(fileName);
export let httpServer = null;
export const initializeServer = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        try {
            const app = expressApp;
            const server = 
            // process.env.ENV === "production"
            //   ? https.createServer(
            //       {
            //         key: fs.readFileSync(join(dirName, "../ssl/key.pem")),
            //         cert: fs.readFileSync(join(dirName, "../ssl/cert.pem")),
            //       },
            //       app
            //     )
            //   :
            http.createServer(app);
            const port = process.env.PORT === "production"
                ? process.env.PROD_PORT
                : process.env.DEV_PORT || 8080;
            server.listen(port, () => {
                global.logger.info(`Server is running on port: ${port} successfully ✔`);
                httpServer = server;
                resolve();
            });
        }
        catch (e) {
            reject(e);
        }
    });
});
//# sourceMappingURL=http.connection.js.map