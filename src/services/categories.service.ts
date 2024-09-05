import mongoose, { Document } from "mongoose";
import { typeUser } from "../models/users.model.js";
import Category, { typeCategory } from "../models/categories.model.js";
import {
  convertFiles,
  createDocument,
  deleteDocument,
} from "../helpers/files.management.js";
import {
  transformFormData,
  updateField,
} from "../helpers/language.management.helper.js";
import { typeLocalizedString } from "../schema/localizedLanguage.schema.js";
import { masterConfig } from "../config/master.config.js";
import { makeIdentifier } from "../helpers/common.helpers..js";

const projectLocalizedCategory = (lang_code: string) => {
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

const getCategoryList = async ({
  query,
}: {
  query?: any;
}): Promise<{
  data: (Document<unknown, {}, typeCategory> | null)[];
  meta: {
    docsFound: number;
    docsInResponse: number;
    limit: number;
    total_pages: number;
    currentPage: number;
  };
}> => {
  try {
    const lang_code = query.lang_code as string;

    let {
      limit,
      page,
      pagination = true,
      sortBy = "createdAt",
      sortOrder = "asc",
      category_name,
      description,
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

    if (category_name) {
      filterQuery.category_name = {
        $elemMatch: { lang_code, value: new RegExp(category_name, "i") },
      };
    }
    if (description) {
      filterQuery.description = {
        $elemMatch: { lang_code, value: new RegExp(description, "i") },
      };
    }
    if (search) {
      filterQuery.$or = [
        {
          category_name: {
            $elemMatch: { lang_code, value: new RegExp(search, "i") },
          },
        },
        {
          description: {
            $elemMatch: { lang_code, value: new RegExp(search, "i") },
          },
        },
      ];
    }

    const totalDocs = await Category.countDocuments(filterQuery);

    if (!pagination) {
      const categoryDoc = await Category.aggregate([
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

    const categoryDoc = await Category.aggregate([
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
  } catch (error) {
    throw error;
  }
};

const getCategory = async ({
  categoryId,
  query,
}: {
  categoryId: string;
  query?: any;
}): Promise<Document<unknown, {}, typeCategory> | null> => {
  try {
    const lang_code = query.lang_code as string;

    const aggregationPipeline = projectLocalizedCategory(lang_code);

    const categoryDoc = await Category.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(categoryId) } },
      ...aggregationPipeline,
    ]);

    return categoryDoc[0];
  } catch (error) {
    throw error;
  }
};
const addCategory = async ({
  requestUser,
  req,
}: {
  requestUser: typeUser | null;
  req?: any;
}): Promise<Document<unknown, {}, typeCategory> | null> => {
  try {
    const lang_code = req.query.lang_code as string;

    const docId = new mongoose.Types.ObjectId();

    let bodyData: any = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
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
      const savedFile = await createDocument({
        document: logo[0],
        documentType: masterConfig.fileStystem.fileTypes.IMAGE,
        documentPath:
          masterConfig.fileStystem.folderPaths.CATEGORY +
          docData._id +
          "/" +
          masterConfig.fileStystem.folderPaths.LOGO,
      });
      if (savedFile) {
        const localizedLogoPath: typeLocalizedString = {
          lang_code: req.query.lang_code,
          value: savedFile.path,
        };
        if (!docData.logo) {
          docData.logo = [localizedLogoPath];
        } else {
          docData.logo.push(localizedLogoPath);
        }
      }
    }
    const category = new Category({
      ...docData,
    });

    let categoryDoc = await category.save();

    return categoryDoc;
  } catch (error) {
    throw error;
  }
};

const updateCategory = async ({
  categoryId,
  requestUser,
  req,
}: {
  categoryId: string;
  requestUser: typeUser | null;
  req?: any;
}): Promise<Document<unknown, {}, typeCategory> | null> => {
  try {
    const lang_code = req.query.lang_code as string;

    const categoryDoc = await Category.findById(categoryId);

    categoryDoc.updated_by = requestUser._id;

    let bodyData: any = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
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
      const existingLogo = categoryDoc.logo?.find(
        (item) => item.lang_code === lang_code
      );
      const savedFile = await createDocument({
        document: logo[0],
        documentType: masterConfig.fileStystem.fileTypes.IMAGE,
        documentPath:
          masterConfig.fileStystem.folderPaths.CATEGORY +
          categoryDoc._id +
          "/" +
          masterConfig.fileStystem.folderPaths.LOGO,
        oldPath: existingLogo ? existingLogo.value : null,
      });
      if (savedFile) {
        const localizedLogoPath: typeLocalizedString = {
          lang_code: req.query.lang_code,
          value: savedFile.path,
        };
        if (existingLogo) {
          existingLogo.value = savedFile.path;
        } else {
          if (!categoryDoc.logo) {
            categoryDoc.logo = [localizedLogoPath];
          } else {
            categoryDoc.logo.push(localizedLogoPath);
          }
        }
      }
    }

    const updatedcategory = await categoryDoc.save();

    return updatedcategory;
  } catch (error) {
    throw error;
  }
};

const deleteCategory = async ({
  categoryId,
}: {
  categoryId: string;
}): Promise<void> => {
  try {
    await Category.findByIdAndDelete(categoryId);
    const documentPath =
      masterConfig.fileStystem.folderPaths.BASE_FOLDER +
      masterConfig.fileStystem.folderPaths.CATEGORY +
      categoryId;

    await deleteDocument({
      documentPath: documentPath,
    });
  } catch (error) {
    throw error;
  }
};

export const categoryService = {
  getCategory,
  addCategory,
  getCategoryList,
  updateCategory,
  deleteCategory,
};
