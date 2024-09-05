import mongoose from "mongoose";
import { masterConfig } from "../config/master.config.js";

export const initializeDatabase = async (): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      await mongoose.connect(masterConfig.mongodbConfig.url);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
