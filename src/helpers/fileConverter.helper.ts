// import htmlPdf, { CreateOptions } from "html-pdf";
// import { masterConfig } from "../config/master.config.js";
// import path from "path";

// const options: CreateOptions = {
//   format: "A4",
//   border: {
//     top: "10mm",
//     right: "10mm",
//     bottom: "10mm",
//     left: "10mm",
//   },
// };

// export const convertPdf = async (html: string): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     const basePath = path.join(
//       rootDir,
//       masterConfig.fileStystem.folderPaths.BASE_FOLDER
//     );
//     const tempPath =
//       basePath + masterConfig.fileStystem.folderPaths.TEMP + "temp.pdf";

//     htmlPdf.create(html, options).toFile(tempPath, (err, res) => {
//       if (err) return console.error(err);
//       resolve(res.filename);
//     });
//   });
// };
