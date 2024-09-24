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
import Category from "../models/categories.model.js";
import { convertFiles, createDocument, deleteDocument, } from "../helpers/files.management.js";
import { transformFormData, updateField, } from "../helpers/language.management.helper.js";
import { masterConfig } from "../config/master.config.js";
import { escapeRegex, makeIdentifier } from "../helpers/common.helpers..js";
const projectLocalizedCategory = (lang_code) => {
    return [
        {
            $project: {
                added_by: 1,
                updated_by: 1,
                identifier: 1,
                logo: {
                    $arrayElemAt: [
                        {
                            $map: {
                                input: {
                                    $filter: {
                                        input: "$logo",
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
                        0,
                    ],
                },
                description: {
                    $arrayElemAt: [
                        {
                            $map: {
                                input: {
                                    $filter: {
                                        input: "$description",
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
                        0,
                    ],
                },
                category_name: {
                    $arrayElemAt: [
                        {
                            $map: {
                                input: {
                                    $filter: {
                                        input: "$category_name",
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
                        0,
                    ],
                },
            },
        },
    ];
};
const getCategoryList = ({ query, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lang_code = query.lang_code;
        let { limit, page, pagination = true, sortBy = "createdAt", sortOrder = "asc", category_name, description, search, } = query;
        if (typeof limit === "string") {
            limit = Number(limit);
        }
        if (!limit || isNaN(limit)) {
            limit = 50;
        }
        if (typeof page === "string") {
            page = Number(page);
        }
        if (!page || isNaN(page)) {
            page = 1;
        }
        if (typeof pagination === "string") {
            pagination = pagination === "true";
        }
        let filterQuery = {};
        if (category_name) {
            filterQuery.category_name = {
                $elemMatch: {
                    lang_code,
                    value: new RegExp(escapeRegex(category_name), "i"),
                },
            };
        }
        if (description) {
            filterQuery.description = {
                $elemMatch: {
                    lang_code,
                    value: new RegExp(escapeRegex(description), "i"),
                },
            };
        }
        if (search) {
            filterQuery.$or = [
                {
                    category_name: {
                        $elemMatch: {
                            lang_code,
                            value: new RegExp(escapeRegex(search), "i"),
                        },
                    },
                },
                {
                    description: {
                        $elemMatch: {
                            lang_code,
                            value: new RegExp(escapeRegex(search), "i"),
                        },
                    },
                },
            ];
        }
        const totalDocs = yield Category.countDocuments(filterQuery);
        if (!pagination) {
            const categoryDoc = yield Category.aggregate([
                { $match: filterQuery },
                ...projectLocalizedCategory(lang_code),
            ]).sort({
                [sortBy]: sortOrder === "asc" ? 1 : -1,
            });
            return {
                data: categoryDoc,
                meta: {
                    docsFound: totalDocs,
                    docsInResponse: categoryDoc.length,
                    limit,
                    total_pages: 1,
                    currentPage: 1,
                },
            };
        }
        const categoryDoc = yield Category.aggregate([
            { $match: filterQuery },
            ...projectLocalizedCategory(lang_code),
        ])
            .sort({
            [sortBy]: sortOrder === "asc" ? 1 : -1,
        })
            .skip((page - 1) * limit)
            .limit(limit);
        const total_pages = Math.ceil(totalDocs / limit);
        const meta = {
            docsFound: totalDocs,
            docsInResponse: categoryDoc.length,
            limit,
            total_pages,
            currentPage: page,
        };
        return { data: categoryDoc, meta };
    }
    catch (error) {
        throw error;
    }
});
const getCategory = ({ categoryId, query, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lang_code = query.lang_code;
        const aggregationPipeline = projectLocalizedCategory(lang_code);
        const categoryDoc = yield Category.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(categoryId) } },
            ...aggregationPipeline,
        ]);
        return categoryDoc[0];
    }
    catch (error) {
        throw error;
    }
});
const addCategory = ({ requestUser, req, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const lang_code = req.query.lang_code;
        const docId = new mongoose.Types.ObjectId();
        let bodyData = {};
        if (((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.payload) && typeof req.query.payload === "string") {
            bodyData = JSON.parse(req.query.payload);
        }
        const docData = {
            _id: docId,
            added_by: requestUser._id,
            updated_by: requestUser._id,
            identifier: makeIdentifier(bodyData.category_name),
            logo: [],
        };
        const formatedBodyData = transformFormData(bodyData);
        if (formatedBodyData.category_name) {
            updateField(docData, formatedBodyData, "category_name", lang_code);
            delete formatedBodyData.category_name;
        }
        if (formatedBodyData.description) {
            updateField(docData, formatedBodyData, "description", lang_code);
            delete formatedBodyData.description;
        }
        const files = convertFiles(req.files);
        const { logo } = files;
        if (Array.isArray(logo) && logo.length > 0) {
            const savedFile = yield createDocument({
                document: logo[0],
                documentType: masterConfig.fileStystem.fileTypes.IMAGE,
                documentPath: masterConfig.fileStystem.folderPaths.CATEGORY +
                    docData._id +
                    "/" +
                    masterConfig.fileStystem.folderPaths.LOGO,
            });
            if (savedFile) {
                const localizedLogoPath = {
                    lang_code: req.query.lang_code,
                    value: savedFile.path,
                };
                if (!docData.logo) {
                    docData.logo = [localizedLogoPath];
                }
                else {
                    docData.logo.push(localizedLogoPath);
                }
            }
        }
        const category = new Category(Object.assign({}, docData));
        let categoryDoc = yield category.save();
        return categoryDoc;
    }
    catch (error) {
        throw error;
    }
});
const updateCategory = ({ categoryId, requestUser, req, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    try {
        const lang_code = req.query.lang_code;
        const categoryDoc = yield Category.findById(categoryId);
        categoryDoc.updated_by = requestUser._id;
        let bodyData = {};
        if (((_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.payload) && typeof req.query.payload === "string") {
            bodyData = JSON.parse(req.query.payload);
        }
        const formatedBodyData = transformFormData(bodyData);
        if (formatedBodyData.category_name) {
            categoryDoc.identifier = makeIdentifier(formatedBodyData.category_name);
            updateField(categoryDoc, formatedBodyData, "category_name", lang_code);
            delete formatedBodyData.category_name;
        }
        if (formatedBodyData.description) {
            updateField(categoryDoc, formatedBodyData, "description", lang_code);
            delete formatedBodyData.description;
        }
        const files = convertFiles(req.files);
        const { logo } = files;
        if (Array.isArray(logo) && logo.length > 0) {
            const existingLogo = (_c = categoryDoc.logo) === null || _c === void 0 ? void 0 : _c.find((item) => item.lang_code === lang_code);
            const savedFile = yield createDocument({
                document: logo[0],
                documentType: masterConfig.fileStystem.fileTypes.IMAGE,
                documentPath: masterConfig.fileStystem.folderPaths.CATEGORY +
                    categoryDoc._id +
                    "/" +
                    masterConfig.fileStystem.folderPaths.LOGO,
                oldPath: existingLogo ? existingLogo.value : null,
            });
            if (savedFile) {
                const localizedLogoPath = {
                    lang_code: req.query.lang_code,
                    value: savedFile.path,
                };
                if (existingLogo) {
                    existingLogo.value = savedFile.path;
                }
                else {
                    if (!categoryDoc.logo) {
                        categoryDoc.logo = [localizedLogoPath];
                    }
                    else {
                        categoryDoc.logo.push(localizedLogoPath);
                    }
                }
            }
        }
        const updatedcategory = yield categoryDoc.save();
        return updatedcategory;
    }
    catch (error) {
        throw error;
    }
});
const deleteCategory = ({ categoryId, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Category.findByIdAndDelete(categoryId);
        const documentPath = masterConfig.fileStystem.folderPaths.BASE_FOLDER +
            masterConfig.fileStystem.folderPaths.CATEGORY +
            categoryId;
        yield deleteDocument({
            documentPath: documentPath,
        });
    }
    catch (error) {
        throw error;
    }
});
export const categoryService = {
    getCategory,
    addCategory,
    getCategoryList,
    updateCategory,
    deleteCategory,
};
//# sourceMappingURL=categories.service.js.map