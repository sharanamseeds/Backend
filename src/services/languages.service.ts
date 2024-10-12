import mongoose, { Document } from "mongoose";
import Language, { typeLanguage } from "../models/languages.model.js";
import { typeUser } from "../models/users.model.js";
import { escapeRegex, makeIdentifier } from "../helpers/common.helpers..js";

const getLanguageList = async ({
  query,
}: {
  query?: any;
}): Promise<{
  data: (Document<unknown, {}, typeLanguage> | null)[];
  meta: {
    docsFound: number;
    docsInResponse: number;
    limit: number;
    total_pages: number;
    currentPage: number;
  };
}> => {
  try {
    let {
      limit,
      page,
      pagination = true,
      sortBy = "lang_name",
      sortOrder = "asc",
      lang_name,
      search,
    } = query;

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

    let filterQuery: any = {};

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

    const totalDocs = await Language.countDocuments(filterQuery);

    if (!pagination) {
      const languageDoc = await Language.find(filterQuery).sort({
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

    const languageDoc = await Language.find(filterQuery)
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
  } catch (error) {
    throw error;
  }
};

const getLanguage = async ({
  languageId,
  query,
}: {
  languageId: string;
  query?: any;
}): Promise<Document<unknown, {}, typeLanguage> | null> => {
  try {
    const languageDoc = await Language.findById(languageId);
    return languageDoc;
  } catch (error) {
    throw error;
  }
};
const addLanguage = async ({
  requestUser,
  req,
}: {
  requestUser: typeUser | null;
  req?: any;
}): Promise<Document<unknown, {}, typeLanguage> | null> => {
  try {
    const languageData = {
      added_by: requestUser._id,
      updated_by: requestUser._id,
      lang_code: req.body.lang_code,
      identifier: makeIdentifier(req.body.lang_name),
      lang_name: req.body.lang_name,
    };

    const language = new Language({
      ...languageData,
    });

    const languageDoc = await language.save();
    return languageDoc;
  } catch (error) {
    throw error;
  }
};

const updateLanguage = async ({
  languageId,
  requestUser,
  req,
}: {
  languageId: string;
  requestUser: typeUser | null;
  req?: any;
}): Promise<Document<unknown, {}, typeLanguage> | null> => {
  try {
    let languageDoc = await Language.findByIdAndUpdate(languageId);

    if (req.body.lang_name) {
      languageDoc.lang_name = req.body.lang_name;
      languageDoc.identifier = makeIdentifier(req.body.lang_name);
    }
    languageDoc.updated_by = requestUser._id;

    languageDoc = await languageDoc.save();

    return languageDoc;
  } catch (error) {
    throw error;
  }
};

const deleteLanguage = async ({
  languageId,
}: {
  languageId: string;
}): Promise<void> => {
  try {
    const languageDoc = await Language.findById(languageId);
    if (languageDoc && languageDoc.lang_code !== "en") {
      await Language.findByIdAndDelete(languageId);
    }
    if (!languageDoc) {
      throw new Error("Language Not Found");
    }
    if (languageDoc && languageDoc.lang_code === "en") {
      throw new Error("Primary Language Can Not Be Deleted");
    }
  } catch (error) {
    throw error;
  }
};

export const languageService = {
  getLanguage,
  addLanguage,
  getLanguageList,
  updateLanguage,
  deleteLanguage,
};
