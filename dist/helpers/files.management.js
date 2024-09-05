var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from "fs";
import path from "path";
import { promisify } from "util";
import File from "../models/files.models.js";
import { masterConfig } from "../config/master.config.js";
const unlinkAsync = promisify(fs.unlink);
const mkdirAsync = promisify(fs.mkdir);
const writeFileAsync = promisify(fs.writeFile);
const rmdirAsync = promisify(fs.rmdir);
const readdirAsync = promisify(fs.readdir);
const statAsync = promisify(fs.stat);
export class ApiError extends Error {
    constructor(statusCode, message, errorDescription, errorType = "", isOperational = true, stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.errorDescription = errorDescription;
        this.custom_errors = message;
        this.errorType = errorType;
        this.isOperational = isOperational;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
export const validateDocument = ({ document, documentType, }) => {
    if (!new RegExp(documentType).test(document.mimetype)) {
        throw new ApiError(400, "Invalid document type", {
            validation_errors: {
                message: "The provided document type does not match the required type",
            },
        });
    }
};
const deleteFileByPath = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileName = path.basename(filePath, path.extname(filePath));
        yield unlinkAsync(filePath);
        yield File.findByIdAndDelete(fileName);
    }
    catch (error) {
        throw error;
    }
});
const deleteFolderContents = (folderPath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield readdirAsync(folderPath);
        for (const item of items) {
            const itemPath = path.join(folderPath, item);
            const itemStats = yield statAsync(itemPath);
            if (itemStats.isDirectory()) {
                yield deleteFolderContents(itemPath);
                yield rmdirAsync(itemPath);
            }
            else {
                yield deleteFileByPath(itemPath);
            }
        }
    }
    catch (error) {
        throw error;
    }
});
export const deleteDocument = ({ documentPath = "", }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (documentPath) {
            const stats = yield statAsync(documentPath);
            if (stats.isDirectory()) {
                yield deleteFolderContents(documentPath);
                yield rmdirAsync(documentPath);
            }
            else {
                yield deleteFileByPath(documentPath);
            }
        }
    }
    catch (error) {
        // throw error;
    }
});
export const createDocument = ({ document, documentType, documentPath, oldPath, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (oldPath) {
            yield deleteDocument({ documentPath: oldPath });
        }
        validateDocument({ document, documentType });
        // Construct the full path to the upload directory
        const basePath = path.join(process.cwd(), masterConfig.fileStystem.folderPaths.BASE_FOLDER);
        const fullPath = path.join(basePath, documentPath);
        yield mkdirAsync(fullPath, { recursive: true });
        const newFile = new File({
            filename: document.originalname,
            originalname: document.originalname,
            path: fullPath,
            mimetype: document.mimetype,
            size: document.size,
        });
        yield newFile.save();
        // Save the file to the specified path
        const fileExtension = path.extname(document.originalname);
        const fileSavePath = path.join(fullPath, `${newFile._id}${fileExtension}`);
        yield writeFileAsync(fileSavePath, document.buffer);
        // Update the file path in the database
        const srcPath = masterConfig.fileStystem.folderPaths.BASE_FOLDER +
            documentPath +
            `${newFile._id}${fileExtension}`;
        newFile.path = srcPath;
        yield newFile.save();
        return { documentId: newFile._id, path: srcPath };
    }
    catch (error) {
        throw error;
    }
});
export const convertFiles = (files) => {
    if (!files) {
        return {};
    }
    return files.reduce((acc, file) => {
        const fieldName = file.fieldname.split("[")[0];
        if (!acc[fieldName]) {
            acc[fieldName] = [];
        }
        acc[fieldName].push(file);
        return acc;
    }, {});
};
//# sourceMappingURL=files.management.js.map