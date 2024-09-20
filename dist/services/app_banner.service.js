var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
import { convertFiles, createDocument, deleteDocument, } from "../helpers/files.management.js";
import { masterConfig } from "../config/master.config.js";
import AppBanner from "../models/app_banner.model.js";
const projectLocalizedBanner = (lang_code) => {
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
const getAppBanner = ({ req, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lang_code = req.query.lang_code;
        let appBannerDoc = yield AppBanner.aggregate([
            { $match: {} },
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
            const appBanner = new AppBanner(Object.assign({}, basicData));
            let appBannerDocCreated = yield appBanner.save();
            return appBannerDocCreated;
        }
        else {
            return appBannerDoc[0]; // Aggregate returns an array, so get the first element
        }
    }
    catch (error) {
        throw error;
    }
});
const addAppBanner = ({ req, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let bodyData = {};
        if (((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.payload) && typeof req.query.payload === "string") {
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
            const savedFilesPromises = images.map((image) => __awaiter(void 0, void 0, void 0, function* () {
                const savedFile = yield createDocument({
                    document: image,
                    documentType: masterConfig.fileStystem.fileTypes.IMAGE,
                    documentPath: masterConfig.fileStystem.folderPaths.APP_BANNERS +
                        basicData._id +
                        "/" +
                        masterConfig.fileStystem.folderPaths.IMAGES,
                });
                if (savedFile) {
                    const localizedImagePath = {
                        lang_code: req.query.lang_code,
                        value: savedFile.path,
                    };
                    basicData.images.push(localizedImagePath);
                }
            }));
            yield Promise.all(savedFilesPromises);
        }
        const appBanner = new AppBanner(Object.assign({}, basicData));
        let appBannerDoc = yield appBanner.save();
        return appBannerDoc;
    }
    catch (error) {
        throw error;
    }
});
const updateAppBanner = ({ bannerId, req, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let appBannerDoc = yield AppBanner.findById(bannerId);
        if (!appBannerDoc) {
            throw new Error("App Banner not found");
        }
        const files = convertFiles(req.files);
        const { images } = files;
        if (Array.isArray(images) && images.length > 0) {
            const savedFilesPromises = images.map((image) => __awaiter(void 0, void 0, void 0, function* () {
                const savedFile = yield createDocument({
                    document: image,
                    documentType: masterConfig.fileStystem.fileTypes.IMAGE,
                    documentPath: masterConfig.fileStystem.folderPaths.APP_BANNERS +
                        appBannerDoc._id +
                        "/" +
                        masterConfig.fileStystem.folderPaths.IMAGES,
                });
                if (savedFile) {
                    const localizedImagePath = {
                        lang_code: req.query.lang_code,
                        value: savedFile.path,
                    };
                    appBannerDoc.images.push(localizedImagePath);
                }
            }));
            yield Promise.all(savedFilesPromises);
        }
        appBannerDoc.updatedAt = new Date();
        let updatedBanner = yield appBannerDoc.save();
        return updatedBanner;
    }
    catch (error) {
        throw error;
    }
});
const deleteAppBannerImage = ({ bannerId, src, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let appBannerDoc = yield AppBanner.findById(bannerId);
        if (!appBannerDoc) {
            throw new Error("App Banner not found");
        }
        const imageIndex = appBannerDoc.images.findIndex((item) => item.value === src);
        if (imageIndex >= 0) {
            // Remove image
            appBannerDoc.images.splice(imageIndex, 1);
            yield deleteDocument({
                documentPath: src,
            });
        }
        else {
            throw new Error("Image not found");
        }
        appBannerDoc.updatedAt = new Date();
        appBannerDoc = yield appBannerDoc.save();
        return appBannerDoc;
    }
    catch (error) {
        throw error;
    }
});
export const appBannerService = {
    addAppBanner,
    updateAppBanner,
    deleteAppBannerImage,
    getAppBanner,
};
//# sourceMappingURL=app_banner.service.js.map