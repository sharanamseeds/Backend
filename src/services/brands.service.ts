import mongoose, { Document } from "mongoose";
import Brand, { typeBrand } from "../models/brands.model.js";
import { typeUser } from "../models/users.model.js";
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
import { escapeRegex, makeIdentifier } from "../helpers/common.helpers..js";

const projectLocalizedBrand = (lang_code: string) => {
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
        brand_name: {
          $arrayElemAt: [
            {
              $map: {
                input: {
                  $filter: {
                    input: "$brand_name",
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
        tag_line: {
          $arrayElemAt: [
            {
              $map: {
                input: {
                  $filter: {
                    input: "$tag_line",
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

const getBrandList = async ({
  query,
}: {
  query?: any;
}): Promise<{
  data: (Document<unknown, {}, typeBrand> | null)[];
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
      brand_name,
      tag_line,
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

    if (brand_name) {
      filterQuery.brand_name = {
        $elemMatch: {
          lang_code,
          value: new RegExp(escapeRegex(brand_name), "i"),
        },
      };
    }
    if (tag_line) {
      filterQuery.tag_line = {
        $elemMatch: {
          lang_code,
          value: new RegExp(escapeRegex(tag_line), "i"),
        },
      };
    }
    if (search) {
      filterQuery.$or = [
        {
          brand_name: {
            $elemMatch: {
              lang_code,
              value: new RegExp(escapeRegex(search), "i"),
            },
          },
        },
        {
          tag_line: {
            $elemMatch: {
              lang_code,
              value: new RegExp(escapeRegex(search), "i"),
            },
          },
        },
      ];
    }

    const totalDocs = await Brand.countDocuments(filterQuery);

    if (!pagination) {
      const brandDoc = await Brand.aggregate([
        { $match: filterQuery },
        ...projectLocalizedBrand(lang_code),
      ]).sort({
        [sortBy]: sortOrder === "asc" ? 1 : -1,
        _id: 1,
      });
      return {
        data: brandDoc,
        meta: {
          docsFound: totalDocs,
          docsInResponse: brandDoc.length,
          limit,
          total_pages: 1,
          currentPage: 1,
        },
      };
    }

    const brandDoc = await Brand.aggregate([
      { $match: filterQuery },
      ...projectLocalizedBrand(lang_code),
    ])
      .sort({
        [sortBy]: sortOrder === "asc" ? 1 : -1,
        _id: 1,
      })
      .skip((page - 1) * limit)
      .limit(limit);

    const total_pages = Math.ceil(totalDocs / limit);

    const meta = {
      docsFound: totalDocs,
      docsInResponse: brandDoc.length,
      limit,
      total_pages,
      currentPage: page,
    };

    return { data: brandDoc, meta };
  } catch (error) {
    throw error;
  }
};

const getBrand = async ({
  brandId,
  query,
}: {
  brandId: string;
  query?: any;
}): Promise<Document<unknown, {}, typeBrand> | null> => {
  try {
    const lang_code = query.lang_code as string;

    const aggregationPipeline = projectLocalizedBrand(lang_code);

    const brandDoc = await Brand.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(brandId) } },
      ...aggregationPipeline,
    ]);

    return brandDoc[0];
  } catch (error) {
    throw error;
  }
};
const addBrand = async ({
  requestUser,
  req,
}: {
  requestUser: typeUser | null;
  req?: any;
}): Promise<Document<unknown, {}, typeBrand> | null> => {
  try {
    const lang_code = req.query.lang_code as string;

    const brandId = new mongoose.Types.ObjectId();

    let bodyData: any = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      bodyData = JSON.parse(req.query.payload);
    }

    let brandData = {
      _id: brandId,
      identifier: makeIdentifier(bodyData.brand_name),
      added_by: requestUser._id,
      updated_by: requestUser._id,
      logo: [],
    };

    const formatedBodyData = transformFormData(bodyData);
    if (formatedBodyData.brand_name) {
      updateField(brandData, formatedBodyData, "brand_name", lang_code);
      delete formatedBodyData.brand_name;
    }
    if (formatedBodyData.tag_line) {
      updateField(brandData, formatedBodyData, "tag_line", lang_code);
      delete formatedBodyData.tag_line;
    }

    const files = convertFiles(req.files);

    const { logo } = files;

    if (Array.isArray(logo) && logo.length > 0) {
      const savedFile = await createDocument({
        document: logo[0],
        documentType: masterConfig.fileStystem.fileTypes.IMAGE,
        documentPath:
          masterConfig.fileStystem.folderPaths.BRANDS +
          brandId +
          "/" +
          masterConfig.fileStystem.folderPaths.LOGO,
      });
      if (savedFile) {
        const localizedLogoPath: typeLocalizedString = {
          lang_code: req.query.lang_code,
          value: savedFile.path,
        };
        if (!brandData.logo) {
          brandData.logo = [localizedLogoPath];
        } else {
          brandData.logo.push(localizedLogoPath);
        }
      }
    }
    const brand = new Brand({
      ...brandData,
    });

    let brandDoc = await brand.save();

    return brandDoc;
  } catch (error) {
    throw error;
  }
};

const updateBrand = async ({
  brandId,
  requestUser,
  req,
}: {
  brandId: string;
  requestUser: typeUser | null;
  req?: any;
}): Promise<Document<unknown, {}, typeBrand> | null> => {
  try {
    const lang_code = req.query.lang_code as string;
    let brandDoc = await Brand.findById(brandId);

    let bodyData: any = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      bodyData = JSON.parse(req.query.payload);
    }

    brandDoc.updated_by = requestUser._id;

    const formatedBodyData = transformFormData(bodyData);
    if (formatedBodyData.brand_name) {
      brandDoc.identifier = makeIdentifier(bodyData.brand_name);
      updateField(brandDoc, formatedBodyData, "brand_name", lang_code);
      delete formatedBodyData.brand_name;
    }
    if (formatedBodyData.tag_line) {
      updateField(brandDoc, formatedBodyData, "tag_line", lang_code);
      delete formatedBodyData.tag_line;
    }

    const files = convertFiles(req.files);

    const { logo } = files;

    if (Array.isArray(logo) && logo.length > 0) {
      const existingLogo = brandDoc.logo?.find(
        (item) => item.lang_code === lang_code
      );

      const savedFile = await createDocument({
        document: logo[0],
        documentType: masterConfig.fileStystem.fileTypes.IMAGE,
        documentPath:
          masterConfig.fileStystem.folderPaths.BRANDS +
          brandDoc._id +
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
          if (!brandDoc.logo) {
            brandDoc.logo = [localizedLogoPath];
          } else {
            brandDoc.logo.push(localizedLogoPath);
          }
        }
      }
    }
    const updatedBrand = await brandDoc.save();

    return updatedBrand;
  } catch (error) {
    throw error;
  }
};

const deleteBrand = async ({ brandId }: { brandId: string }): Promise<void> => {
  try {
    await Brand.findByIdAndDelete(brandId);
    const documentPath =
      masterConfig.fileStystem.folderPaths.BASE_FOLDER +
      masterConfig.fileStystem.folderPaths.BRANDS +
      brandId;

    await deleteDocument({
      documentPath: documentPath,
    });
  } catch (error) {
    throw error;
  }
};

export const brandService = {
  getBrand,
  addBrand,
  getBrandList,
  updateBrand,
  deleteBrand,
};
