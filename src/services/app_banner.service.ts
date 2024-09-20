import mongoose, { Document } from "mongoose";
import {
  convertFiles,
  createDocument,
  deleteDocument,
} from "../helpers/files.management.js";
import { masterConfig } from "../config/master.config.js";
import { typeLocalizedString } from "../schema/localizedLanguage.schema.js";
import AppBanner, { typeAppBanner } from "../models/app_banner.model.js";

const projectLocalizedBanner = (lang_code: string) => {
  return [
    {
      $project: {
        _id: 1,
        images: {
          $map: {
            input: {
              $filter: {
                input: "$images",
                as: "item",
                cond: {
                  $eq: ["$$item.lang_code", lang_code],
                },
              },
            },
            as: "item",
            in: "$$item.value",
          },
        },
      },
    },
  ];
};

const getAppBanner = async ({
  req,
}: {
  req?: any;
}): Promise<Document<unknown, {}, typeAppBanner> | null> => {
  try {
    const lang_code = req.query.lang_code as string;

    let appBannerDoc = await AppBanner.aggregate([
      { $match: {} }, // Adjust your match conditions as needed
      ...projectLocalizedBanner(lang_code), // Apply your projection logic here
    ]);

    if (!appBannerDoc || appBannerDoc.length === 0) {
      const appBannerId = new mongoose.Types.ObjectId();

      let basicData = {
        _id: appBannerId,
        images: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const appBanner = new AppBanner({
        ...basicData,
      });

      let appBannerDocCreated = await appBanner.save();

      return appBannerDocCreated;
    } else {
      return appBannerDoc[0]; // Aggregate returns an array, so get the first element
    }
  } catch (error) {
    throw error;
  }
};

const addAppBanner = async ({
  req,
}: {
  req?: any;
}): Promise<Document<unknown, {}, typeAppBanner> | null> => {
  try {
    let bodyData: any = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      bodyData = JSON.parse(req.query.payload);
    }

    const appBannerId = new mongoose.Types.ObjectId();

    let basicData = {
      _id: appBannerId,
      images: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const files = req.files || {};
    const { images } = files;

    if (Array.isArray(images) && images.length > 0) {
      const savedFilesPromises = images.map(async (image) => {
        const savedFile = await createDocument({
          document: image,
          documentType: masterConfig.fileStystem.fileTypes.IMAGE,
          documentPath:
            masterConfig.fileStystem.folderPaths.APP_BANNERS +
            basicData._id +
            "/" +
            masterConfig.fileStystem.folderPaths.IMAGES,
        });
        if (savedFile) {
          const localizedImagePath: typeLocalizedString = {
            lang_code: req.query.lang_code,
            value: savedFile.path,
          };
          basicData.images.push(localizedImagePath);
        }
      });

      await Promise.all(savedFilesPromises);
    }

    const appBanner = new AppBanner({
      ...basicData,
    });

    let appBannerDoc = await appBanner.save();

    return appBannerDoc;
  } catch (error) {
    throw error;
  }
};

const updateAppBanner = async ({
  bannerId,
  req,
}: {
  bannerId: string;
  req?: any;
}): Promise<Document<unknown, {}, typeAppBanner> | null> => {
  try {
    let appBannerDoc = await AppBanner.findById(bannerId);
    if (!appBannerDoc) {
      throw new Error("App Banner not found");
    }

    const files = convertFiles(req.files);
    const { images } = files;

    if (Array.isArray(images) && images.length > 0) {
      const savedFilesPromises = images.map(async (image) => {
        const savedFile = await createDocument({
          document: image,
          documentType: masterConfig.fileStystem.fileTypes.IMAGE,
          documentPath:
            masterConfig.fileStystem.folderPaths.APP_BANNERS +
            appBannerDoc._id +
            "/" +
            masterConfig.fileStystem.folderPaths.IMAGES,
        });
        if (savedFile) {
          const localizedImagePath: typeLocalizedString = {
            lang_code: req.query.lang_code,
            value: savedFile.path,
          };
          appBannerDoc.images.push(localizedImagePath);
        }
      });

      await Promise.all(savedFilesPromises);
    }

    appBannerDoc.updatedAt = new Date();
    let updatedBanner = await appBannerDoc.save();

    return updatedBanner;
  } catch (error) {
    throw error;
  }
};

const deleteAppBannerImage = async ({
  bannerId,
  src,
}: {
  bannerId: string;
  src: string;
}): Promise<Document<unknown, {}, typeAppBanner> | null> => {
  try {
    let appBannerDoc = await AppBanner.findById(bannerId);

    if (!appBannerDoc) {
      throw new Error("App Banner not found");
    }

    const imageIndex = appBannerDoc.images.findIndex(
      (item) => item.value === src
    );

    if (imageIndex >= 0) {
      // Remove image
      appBannerDoc.images.splice(imageIndex, 1);
      await deleteDocument({
        documentPath: src,
      });
    } else {
      throw new Error("Image not found");
    }

    appBannerDoc.updatedAt = new Date();
    appBannerDoc = await appBannerDoc.save();

    return appBannerDoc;
  } catch (error) {
    throw error;
  }
};

export const appBannerService = {
  addAppBanner,
  updateAppBanner,
  deleteAppBannerImage,
  getAppBanner,
};
