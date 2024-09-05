import mongoose, { Document } from "mongoose";
import { typeUser } from "../models/users.model.js";
import Offer, { typeOffer } from "../models/offers.models.js";
import {
  convertFiles,
  createDocument,
  deleteDocument,
} from "../helpers/files.management.js";
import { typeLocalizedString } from "../schema/localizedLanguage.schema.js";
import {
  transformFormData,
  updateField,
} from "../helpers/language.management.helper.js";
import { masterConfig } from "../config/master.config.js";
import { makeIdentifier } from "../helpers/common.helpers..js";

const projectLocalizedOffer = (lang_code: string) => {
  return [
    {
      $project: {
        added_by: 1,
        updated_by: 1,
        offer_code: 1,
        identifier: 1,
        is_active: 1,
        product_specified: 1,
        products: 1,
        category_specified: 1,
        categories: 1,
        offer_type: 1,
        percentage_discount: 1,
        fixed_amount_discount: 1,
        tiers: 1,
        buy_quantity: 1,
        get_quantity: 1,
        bundle_items: 1,
        referral_code: 1,
        referral_amount: 1,
        coupon_code: 1,
        coupon_details: 1,
        createdAt: 1,
        updatedAt: 1,

        image: {
          $map: {
            input: {
              $filter: {
                input: "$image",
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
        offer_name: {
          $arrayElemAt: [
            {
              $map: {
                input: {
                  $filter: {
                    input: "$offer_name",
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

const getOfferList = async ({
  query,
}: {
  query?: any;
}): Promise<{
  data: (Document<unknown, {}, typeOffer> | null)[];
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
      product_id,
      category_id,
      offer_code,
      offer_name,
      offer_type,
      is_active,
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
    let orConditions: any[] = [];

    if (is_active) {
      orConditions.push({ is_active: is_active == "true" ? true : false });
    }
    if (product_id) {
      orConditions.push(
        { is_active: true },
        { product_specified: true },
        { products: { $in: [new mongoose.Types.ObjectId(product_id)] } }
      );
    }

    if (category_id) {
      orConditions.push(
        { is_active: true },
        { category_specified: true },
        { categories: { $in: [new mongoose.Types.ObjectId(category_id)] } }
      );
    }

    if (orConditions.length > 0) {
      filterQuery.$or = orConditions;
    }

    if (offer_code) {
      filterQuery.offer_code = new RegExp(offer_code, "i");
    }
    if (offer_type) {
      filterQuery.offer_type = offer_type;
    }

    if (offer_name) {
      filterQuery.offer_name = {
        $elemMatch: { lang_code, value: new RegExp(offer_name, "i") },
      };
    }
    if (search) {
      filterQuery.$or = [
        {
          offer_name: {
            $elemMatch: { lang_code, value: new RegExp(search, "i") },
          },
        },
        { offer_code: { $regex: search, $options: "i" } },
      ];
    }

    const totalDocs = await Offer.countDocuments(filterQuery);

    if (!pagination) {
      const offerDoc = await Offer.aggregate([
        { $match: filterQuery },
        ...projectLocalizedOffer(lang_code),
      ]).sort({
        [sortBy]: sortOrder === "asc" ? 1 : -1,
      });
      return {
        data: offerDoc,
        meta: {
          docsFound: totalDocs,
          docsInResponse: offerDoc.length,
          limit,
          total_pages: 1,
          currentPage: 1,
        },
      };
    }

    const offerDoc = await Offer.aggregate([
      { $match: filterQuery },
      ...projectLocalizedOffer(lang_code),
    ])
      .sort({
        [sortBy]: sortOrder === "asc" ? 1 : -1,
      })
      .skip((page - 1) * limit)
      .limit(limit);

    const total_pages = Math.ceil(totalDocs / limit);

    const meta = {
      docsFound: totalDocs,
      docsInResponse: offerDoc.length,
      limit,
      total_pages,
      currentPage: page,
    };

    return { data: offerDoc, meta };
  } catch (error) {
    throw error;
  }
};

const getCustomerOfferList = async ({
  query,
}: {
  query?: any;
}): Promise<{
  data: (Document<unknown, {}, typeOffer> | null)[];
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
      product_id,
      category_id,
      offer_code,
      offer_name,
      offer_type,
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
    let orConditions: any[] = [{ is_active: true }];

    if (product_id) {
      orConditions.push(
        { is_active: true },
        { product_specified: true },
        { products: { $in: [new mongoose.Types.ObjectId(product_id)] } }
      );
    }

    if (category_id) {
      orConditions.push(
        { is_active: true },
        { category_specified: true },
        { categories: { $in: [new mongoose.Types.ObjectId(category_id)] } }
      );
    }

    filterQuery.$or = orConditions;

    if (offer_code) {
      filterQuery.offer_code = new RegExp(offer_code, "i");
    }
    if (offer_type) {
      filterQuery.offer_type = offer_type;
    }
    if (offer_name) {
      filterQuery.offer_name = {
        $elemMatch: { lang_code, value: new RegExp(offer_name, "i") },
      };
    }
    if (search) {
      filterQuery.$or = [
        {
          offer_name: {
            $elemMatch: { lang_code, value: new RegExp(search, "i") },
          },
        },
        { offer_code: { $regex: search, $options: "i" } },
      ];
    }
    const totalDocs = await Offer.countDocuments(filterQuery);

    if (!pagination) {
      const offerDoc = await Offer.aggregate([
        { $match: filterQuery },
        ...projectLocalizedOffer(lang_code),
      ]).sort({
        [sortBy]: sortOrder === "asc" ? 1 : -1,
      });
      return {
        data: offerDoc,
        meta: {
          docsFound: totalDocs,
          docsInResponse: offerDoc.length,
          limit,
          total_pages: 1,
          currentPage: 1,
        },
      };
    }

    const offerDoc = await Offer.aggregate([
      { $match: filterQuery },
      ...projectLocalizedOffer(lang_code),
    ])
      .sort({
        [sortBy]: sortOrder === "asc" ? 1 : -1,
      })
      .skip((page - 1) * limit)
      .limit(limit);

    const total_pages = Math.ceil(totalDocs / limit);

    const meta = {
      docsFound: totalDocs,
      docsInResponse: offerDoc.length,
      limit,
      total_pages,
      currentPage: page,
    };

    return { data: offerDoc, meta };
  } catch (error) {
    throw error;
  }
};

const getOffer = async ({
  offerId,
  query,
}: {
  offerId: string;
  query?: any;
}): Promise<Document<unknown, {}, typeOffer> | null> => {
  try {
    const lang_code = query.lang_code as string;
    const aggregationPipeline = projectLocalizedOffer(lang_code);
    const offerDoc = await Offer.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(offerId) } },
      ...aggregationPipeline,
    ]);

    return offerDoc[0];
  } catch (error) {
    throw error;
  }
};

const addOffer = async ({
  requestUser,
  req,
}: {
  requestUser: typeUser | null;
  req?: any;
}): Promise<Document<unknown, {}, typeOffer> | null> => {
  try {
    const lang_code = req.query.lang_code as string;
    const docId = new mongoose.Types.ObjectId();

    let bodyData: any = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      bodyData = JSON.parse(req.query.payload);
    }

    const formatedBodyData = transformFormData(bodyData);

    let offerData = {
      _id: docId,
      added_by: requestUser._id,
      updated_by: requestUser._id,
      image: [],
      identifier: makeIdentifier(formatedBodyData.offer_name),
    };

    if (formatedBodyData.offer_name) {
      updateField(offerData, formatedBodyData, "offer_name", lang_code);
      delete formatedBodyData.offer_name;
    }
    if (formatedBodyData.description) {
      updateField(offerData, formatedBodyData, "description", lang_code);
      delete formatedBodyData.description;
    }

    Object.assign(offerData, formatedBodyData);

    const files = convertFiles(req.files);
    const { image } = files;
    if (Array.isArray(image) && image.length > 0) {
      const savedFile = await createDocument({
        document: image[0],
        documentType: masterConfig.fileStystem.fileTypes.IMAGE,
        documentPath:
          masterConfig.fileStystem.folderPaths.OFFERS +
          offerData._id +
          "/" +
          masterConfig.fileStystem.folderPaths.IMAGES,
      });
      if (savedFile) {
        const localizedLogoPath: typeLocalizedString = {
          lang_code: req.query.lang_code,
          value: savedFile.path,
        };
        if (!offerData.image) {
          offerData.image = [localizedLogoPath];
        } else {
          offerData.image.push(localizedLogoPath);
        }
      }
    }

    const offer = new Offer({
      ...offerData,
    });

    let offerDoc = await offer.save();

    return offerDoc;
  } catch (error) {
    throw error;
  }
};

const updateOffer = async ({
  offerId,
  requestUser,
  req,
}: {
  offerId: string;
  requestUser: typeUser | null;
  req?: any;
}): Promise<Document<unknown, {}, typeOffer> | null> => {
  try {
    const lang_code = req.query.lang_code as string;

    let offerDoc = await Offer.findById(offerId);

    let bodyData: any = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      bodyData = JSON.parse(req.query.payload);
    }

    const formatedBodyData = transformFormData(bodyData);

    offerDoc.updated_by = requestUser._id;

    if (formatedBodyData.offer_name) {
      offerDoc.identifier = makeIdentifier(formatedBodyData.offer_name);
      updateField(offerDoc, formatedBodyData, "offer_name", lang_code);
      delete formatedBodyData.offer_name;
    }
    if (formatedBodyData.description) {
      updateField(offerDoc, formatedBodyData, "description", lang_code);
      delete formatedBodyData.description;
    }
    if ("is_active" in formatedBodyData) {
      offerDoc.is_active = formatedBodyData.is_active;
    }

    const files = convertFiles(req.files);
    const { image } = files;

    if (Array.isArray(image) && image.length > 0) {
      const existingImage = offerDoc.image?.find(
        (item) => item.lang_code === lang_code
      );
      const savedFile = await createDocument({
        document: image[0],
        documentType: masterConfig.fileStystem.fileTypes.IMAGE,
        documentPath:
          masterConfig.fileStystem.folderPaths.OFFERS +
          offerDoc._id +
          "/" +
          masterConfig.fileStystem.folderPaths.IMAGES,
        oldPath: existingImage ? existingImage.value : null,
      });
      if (savedFile) {
        const localizedLogoPath: typeLocalizedString = {
          lang_code: lang_code,
          value: savedFile.path,
        };
        offerDoc.image = [localizedLogoPath];
      }
    }

    const updatedOffer = await offerDoc.save();

    return updatedOffer;
  } catch (error) {
    throw error;
  }
};

const deleteOffer = async ({ offerId }: { offerId: string }): Promise<void> => {
  try {
    throw new Error("Offer Can Not Be Deleted");
    await Offer.findByIdAndDelete(offerId);
    const documentPath =
      masterConfig.fileStystem.folderPaths.BASE_FOLDER +
      masterConfig.fileStystem.folderPaths.OFFERS +
      offerId;

    await deleteDocument({
      documentPath: documentPath,
    });
  } catch (error) {
    throw error;
  }
};

export const offerService = {
  getOffer,
  addOffer,
  getOfferList,
  updateOffer,
  deleteOffer,
  getCustomerOfferList,
};
