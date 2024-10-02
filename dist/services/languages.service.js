var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Language from "../models/languages.model.js";
import { escapeRegex, makeIdentifier } from "../helpers/common.helpers..js";
const getLanguageList = ({ query, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { limit, page, pagination = true, sortBy = "createdAt", sortOrder = "asc", lang_name, search, } = query;
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
        if (lang_name) {
            filterQuery.lang_name = lang_name;
        }
        // Apply search logic
        if (search) {
            filterQuery.$or = [
                { lang_name: { $regex: escapeRegex(search), $options: "i" } },
                { lang_code: { $regex: escapeRegex(search), $options: "i" } },
            ];
        }
        const totalDocs = yield Language.countDocuments(filterQuery);
        if (!pagination) {
            const languageDoc = yield Language.find(filterQuery).sort({
                [sortBy]: sortOrder === "asc" ? 1 : -1,
                _id: 1,
            }); // Sorting logic
            return {
                data: languageDoc,
                meta: {
                    docsFound: totalDocs,
                    docsInResponse: languageDoc.length,
                    limit,
                    total_pages: 1,
                    currentPage: 1,
                },
            };
        }
        const languageDoc = yield Language.find(filterQuery)
            .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1, _id: 1 }) // Sorting logic
            .skip((page - 1) * limit)
            .limit(limit);
        const total_pages = Math.ceil(totalDocs / limit);
        const meta = {
            docsFound: totalDocs,
            docsInResponse: languageDoc.length,
            limit,
            total_pages,
            currentPage: page,
        };
        return { data: languageDoc, meta };
    }
    catch (error) {
        throw error;
    }
});
const getLanguage = ({ languageId, query, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const languageDoc = yield Language.findById(languageId);
        return languageDoc;
    }
    catch (error) {
        throw error;
    }
});
const addLanguage = ({ requestUser, req, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const languageData = {
            added_by: requestUser._id,
            updated_by: requestUser._id,
            lang_code: req.body.lang_code,
            identifier: makeIdentifier(req.body.lang_name),
            lang_name: req.body.lang_name,
        };
        const language = new Language(Object.assign({}, languageData));
        const languageDoc = yield language.save();
        return languageDoc;
    }
    catch (error) {
        throw error;
    }
});
const updateLanguage = ({ languageId, requestUser, req, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let languageDoc = yield Language.findByIdAndUpdate(languageId);
        if (req.body.lang_name) {
            languageDoc.lang_name = req.body.lang_name;
            languageDoc.identifier = makeIdentifier(req.body.lang_name);
        }
        languageDoc.updated_by = requestUser._id;
        languageDoc = yield languageDoc.save();
        return languageDoc;
    }
    catch (error) {
        throw error;
    }
});
const deleteLanguage = ({ languageId, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const languageDoc = yield Language.findById(languageId);
        if (languageDoc && languageDoc.lang_code !== "en") {
            yield Language.findByIdAndDelete(languageId);
        }
        if (!languageDoc) {
            throw new Error("Language Not Found");
        }
        if (languageDoc && languageDoc.lang_code === "en") {
            throw new Error("Primary Language Can Not Be Deleted");
        }
    }
    catch (error) {
        throw error;
    }
});
export const languageService = {
    getLanguage,
    addLanguage,
    getLanguageList,
    updateLanguage,
    deleteLanguage,
};
//# sourceMappingURL=languages.service.js.map