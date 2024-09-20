import fs from "fs";
import path from "path";
import { promisify } from "util";
import File, { IFile } from "../models/files.models.js";
import { masterConfig, rootDir } from "../config/master.config.js";

const unlinkAsync = promisify(fs.unlink);
const mkdirAsync = promisify(fs.mkdir);
const writeFileAsync = promisify(fs.writeFile);
const rmdirAsync = promisify(fs.rmdir);
const readdirAsync = promisify(fs.readdir);
const statAsync = promisify(fs.stat);

interface typeValidationErrors {
  [key: string]: string; // Key is the field path, value is the error message
}

export class ApiError extends Error {
  statusCode: number;
  errorDescription: { validation_errors: typeValidationErrors };
  custom_errors: string;
  errorType: string;
  isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    errorDescription: { validation_errors: typeValidationErrors },
    errorType: string = "",
    isOperational: boolean = true,
    stack: string = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.errorDescription = errorDescription;
    this.custom_errors = message;
    this.errorType = errorType;
    this.isOperational = isOperational;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export const validateDocument = ({
  document,
  documentType,
}: {
  document: Express.Multer.File;
  documentType: string;
}) => {
  if (!new RegExp(documentType).test(document.mimetype)) {
    throw new ApiError(400, "Invalid document type", {
      validation_errors: {
        message: "The provided document type does not match the required type",
      },
    });
  }
};

const deleteFileByPath = async (filePath) => {
  try {
    const fileName = path.basename(filePath, path.extname(filePath));
    await unlinkAsync(filePath);
    await File.findByIdAndDelete(fileName);
  } catch (error) {
    throw error;
  }
};

const deleteFolderContents = async (folderPath) => {
  try {
    const items = await readdirAsync(folderPath);
    for (const item of items) {
      const itemPath = path.join(folderPath, item);
      const itemStats = await statAsync(itemPath);

      if (itemStats.isDirectory()) {
        await deleteFolderContents(itemPath);
        await rmdirAsync(itemPath);
      } else {
        await deleteFileByPath(itemPath);
      }
    }
  } catch (error) {
    throw error;
  }
};

export const deleteDocument = async ({
  documentPath = "",
}: {
  documentPath?: string;
}) => {
  try {
    if (documentPath) {
      const stats = await statAsync(documentPath);

      if (stats.isDirectory()) {
        await deleteFolderContents(documentPath);
        await rmdirAsync(documentPath);
      } else {
        await deleteFileByPath(documentPath);
      }
    }
  } catch (error) {
    // throw error;
  }
};

export const createDocument = async ({
  document,
  documentType,
  documentPath,
  oldPath,
}: {
  document: Express.Multer.File;
  documentType: string;
  documentPath: string;
  oldPath?: string | null;
}) => {
  try {
    if (oldPath) {
      await deleteDocument({ documentPath: oldPath });
    }

    validateDocument({ document, documentType });

    // Construct the full path to the upload directory
    const basePath = path.join(
      rootDir,
      masterConfig.fileStystem.folderPaths.BASE_FOLDER
    );
    const fullPath = path.join(basePath, documentPath);

    await mkdirAsync(fullPath, { recursive: true });

    const newFile = new File({
      filename: document.originalname,
      originalname: document.originalname,
      path: fullPath,
      mimetype: document.mimetype,
      size: document.size,
    });
    await newFile.save();

    // Save the file to the specified path
    const fileExtension = path.extname(document.originalname);
    const fileSavePath = path.join(fullPath, `${newFile._id}${fileExtension}`);
    await writeFileAsync(fileSavePath, document.buffer);

    // Update the file path in the database
    const srcPath =
      masterConfig.fileStystem.folderPaths.BASE_FOLDER +
      documentPath +
      `${newFile._id}${fileExtension}`;

    newFile.path = srcPath;
    await newFile.save();

    return { documentId: newFile._id, path: srcPath };
  } catch (error) {
    throw error;
  }
};

interface FilesObject {
  [key: string]: Express.Multer.File[];
}

export const convertFiles = (files?: Express.Multer.File[]): FilesObject => {
  if (!files) {
    return {};
  }
  return files.reduce<FilesObject>((acc, file) => {
    const fieldName = file.fieldname.split("[")[0];
    if (!acc[fieldName]) {
      acc[fieldName] = [];
    }
    acc[fieldName].push(file);
    return acc;
  }, {});
};
