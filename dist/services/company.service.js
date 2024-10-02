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
import Company from "../models/company.model.js";
import { convertFiles, createDocument } from "../helpers/files.management.js";
import { masterConfig } from "../config/master.config.js";
const getCompanyList = ({ query, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { limit, page, pagination = true, sortBy = "createdAt", sortOrder = "asc", owner_id, brand_name, legal_name, slogan, industry, description, website, type, } = query;
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
        if (owner_id) {
            filterQuery.owner_id = new mongoose.Types.ObjectId(owner_id);
        }
        if (brand_name) {
            filterQuery.brand_name = brand_name;
        }
        if (legal_name) {
            filterQuery.legal_name = legal_name;
        }
        if (slogan) {
            filterQuery.slogan = slogan;
        }
        if (industry) {
            filterQuery.industry = { $in: [industry] };
        }
        if (description) {
            filterQuery.description = description;
        }
        if (website) {
            filterQuery.website = website;
        }
        if (type) {
            filterQuery.type = type;
        }
        const totalDocs = yield Company.countDocuments(filterQuery);
        if (!pagination) {
            const companyDoc = yield Company.find(filterQuery).sort({
                [sortBy]: sortOrder === "asc" ? 1 : -1,
                _id: 1,
            });
            return {
                data: companyDoc,
                meta: {
                    docsFound: totalDocs,
                    docsInResponse: companyDoc.length,
                    limit,
                    total_pages: 1,
                    currentPage: 1,
                },
            };
        }
        const companyDoc = yield Company.find(filterQuery)
            .sort({
            [sortBy]: sortOrder === "asc" ? 1 : -1,
            _id: 1,
        })
            .skip((page - 1) * limit)
            .limit(limit);
        const total_pages = Math.ceil(totalDocs / limit);
        const meta = {
            docsFound: totalDocs,
            docsInResponse: companyDoc.length,
            limit,
            total_pages,
            currentPage: page,
        };
        return { data: companyDoc, meta };
    }
    catch (error) {
        throw error;
    }
});
const getCompany = ({ companyId, query, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const company = yield Company.findById(companyId);
        return company;
    }
    catch (error) {
        throw error;
    }
});
const addCompany = ({ requestUser, req, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const companyId = new mongoose.Types.ObjectId();
        let bodyData = {};
        if (((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.payload) && typeof req.query.payload === "string") {
            bodyData = JSON.parse(req.query.payload);
        }
        let logoDetails = {
            primary: "",
            secondary: "",
            QR_code: "",
        };
        const files = convertFiles(req.files);
        const { primary_logo, secondary_logo, qr_code } = files;
        if (Array.isArray(primary_logo) && primary_logo.length > 0) {
            const savedFile = yield createDocument({
                document: primary_logo[0],
                documentType: masterConfig.fileStystem.fileTypes.IMAGE,
                documentPath: masterConfig.fileStystem.folderPaths.COMPANY +
                    companyId +
                    "/" +
                    masterConfig.fileStystem.folderPaths.LOGO +
                    "PRIMARY/",
            });
            if (savedFile) {
                logoDetails.primary = savedFile.path;
            }
        }
        if (Array.isArray(secondary_logo) && secondary_logo.length > 0) {
            const savedFile = yield createDocument({
                document: secondary_logo[0],
                documentType: masterConfig.fileStystem.fileTypes.IMAGE,
                documentPath: masterConfig.fileStystem.folderPaths.COMPANY +
                    companyId +
                    "/" +
                    masterConfig.fileStystem.folderPaths.LOGO +
                    "SECONDARY/",
            });
            if (savedFile) {
                logoDetails.secondary = savedFile.path;
            }
        }
        if (Array.isArray(qr_code) && qr_code.length > 0) {
            const savedFile = yield createDocument({
                document: qr_code[0],
                documentType: masterConfig.fileStystem.fileTypes.IMAGE,
                documentPath: masterConfig.fileStystem.folderPaths.COMPANY +
                    companyId +
                    "/" +
                    masterConfig.fileStystem.folderPaths.LOGO +
                    "QR_CODE/",
            });
            if (savedFile) {
                logoDetails.QR_code = savedFile.path;
            }
        }
        const company = new Company(Object.assign(Object.assign(Object.assign({ _id: companyId }, bodyData), logoDetails), { owner_id: bodyData.owner_id || (requestUser === null || requestUser === void 0 ? void 0 : requestUser._id), added_by: (requestUser === null || requestUser === void 0 ? void 0 : requestUser._id) || null, updated_by: (requestUser === null || requestUser === void 0 ? void 0 : requestUser._id) || null }));
        const companyDoc = yield company.save();
        return companyDoc;
    }
    catch (error) {
        throw error;
    }
});
const updateCompany = ({ companyId, requestUser, req, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        let companyDoc = yield Company.findById(companyId);
        if (!companyDoc) {
            throw new Error("Company Not Found");
        }
        let bodyData = {};
        if (((_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.payload) && typeof req.query.payload === "string") {
            bodyData = JSON.parse(req.query.payload);
        }
        companyDoc = Object.assign(Object.assign(Object.assign({}, companyDoc.toObject()), bodyData), { updated_by: (requestUser === null || requestUser === void 0 ? void 0 : requestUser._id) || companyDoc.updated_by });
        const files = convertFiles(req.files);
        const { primary_logo, secondary_logo, qr_code } = files;
        if (Array.isArray(primary_logo) && primary_logo.length > 0) {
            const savedFile = yield createDocument({
                document: primary_logo[0],
                documentType: masterConfig.fileStystem.fileTypes.IMAGE,
                documentPath: masterConfig.fileStystem.folderPaths.COMPANY +
                    companyId +
                    "/" +
                    masterConfig.fileStystem.folderPaths.LOGO +
                    "PRIMARY/",
            });
            if (savedFile) {
                companyDoc.logo.primary = savedFile.path;
            }
        }
        if (Array.isArray(secondary_logo) && secondary_logo.length > 0) {
            const savedFile = yield createDocument({
                document: secondary_logo[0],
                documentType: masterConfig.fileStystem.fileTypes.IMAGE,
                documentPath: masterConfig.fileStystem.folderPaths.COMPANY +
                    companyId +
                    "/" +
                    masterConfig.fileStystem.folderPaths.LOGO +
                    "SECONDARY/",
            });
            if (savedFile) {
                companyDoc.logo.secondary = savedFile.path;
            }
        }
        if (Array.isArray(qr_code) && qr_code.length > 0) {
            const savedFile = yield createDocument({
                document: qr_code[0],
                documentType: masterConfig.fileStystem.fileTypes.IMAGE,
                documentPath: masterConfig.fileStystem.folderPaths.COMPANY +
                    companyId +
                    "/" +
                    masterConfig.fileStystem.folderPaths.LOGO +
                    "SECONDARY/",
            });
            if (savedFile) {
                companyDoc.logo.QR_code = savedFile.path;
            }
        }
        const updatedCompanyDoc = yield Company.findByIdAndUpdate(companyId, companyDoc, { new: true });
        return updatedCompanyDoc;
    }
    catch (error) {
        throw error;
    }
});
const deleteCompany = ({ companyId, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        throw new Error("Company Can Not Be Deleted");
        yield Company.findByIdAndDelete(companyId);
    }
    catch (error) {
        throw error;
    }
});
export const companyService = {
    getCompany,
    addCompany,
    getCompanyList,
    updateCompany,
    deleteCompany,
};
//# sourceMappingURL=company.service.js.map