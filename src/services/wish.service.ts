import mongoose, { Document } from "mongoose";
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
import Wish, { typeWish } from "../models/wish. model.js";

const getWishList = async ({
  query,
}: {
  query?: any;
}): Promise<{
  data: (Document<unknown, {}, typeWish> | null)[];
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
      user_id,
      product_id,
      search,
    } = query;

    limit = Number(limit);
    page = Number(page);
    pagination = pagination === "true";

    let filterQuery: any = {};

    if (user_id) {
      filterQuery.user_id = new mongoose.Types.ObjectId(user_id);
    }
    if (product_id) {
      filterQuery.product_id = new mongoose.Types.ObjectId(product_id);
    }
    if (search) {
      filterQuery.$or = [{ notes: new RegExp(search, "i") }];
    }

    const totalDocs = await Wish.countDocuments(filterQuery);

    if (!pagination) {
      const wishDoc = await Wish.find(filterQuery).sort({
        [sortBy]: sortOrder === "asc" ? 1 : -1,
      });
      return {
        data: wishDoc,
        meta: {
          docsFound: totalDocs,
          docsInResponse: wishDoc.length,
          limit,
          total_pages: 1,
          currentPage: 1,
        },
      };
    }

    const wishDoc = await Wish.find(filterQuery)
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total_pages = Math.ceil(totalDocs / limit);

    const meta = {
      docsFound: totalDocs,
      docsInResponse: wishDoc.length,
      limit,
      total_pages,
      currentPage: page,
    };

    return { data: wishDoc, meta };
  } catch (error) {
    throw error;
  }
};

const getUserWishList = async ({
  query,
  requestUser,
}: {
  query?: any;
  requestUser: typeUser | null;
}): Promise<{
  data: (Document<unknown, {}, typeWish> | null)[];
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
      user_id,
      product_id,
      search,
    } = query;

    limit = Number(limit);
    page = Number(page);
    pagination = pagination === "true";

    let filterQuery: any = {
      user_id: requestUser._id,
    };

    if (product_id) {
      filterQuery.product_id = new mongoose.Types.ObjectId(product_id);
    }
    if (search) {
      filterQuery.$or = [{ notes: new RegExp(search, "i") }];
    }

    const totalDocs = await Wish.countDocuments(filterQuery);

    if (!pagination) {
      const wishDoc = await Wish.find(filterQuery).sort({
        [sortBy]: sortOrder === "asc" ? 1 : -1,
      });
      return {
        data: wishDoc,
        meta: {
          docsFound: totalDocs,
          docsInResponse: wishDoc.length,
          limit,
          total_pages: 1,
          currentPage: 1,
        },
      };
    }

    const wishDoc = await Wish.find(filterQuery)
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total_pages = Math.ceil(totalDocs / limit);

    const meta = {
      docsFound: totalDocs,
      docsInResponse: wishDoc.length,
      limit,
      total_pages,
      currentPage: page,
    };

    return { data: wishDoc, meta };
  } catch (error) {
    throw error;
  }
};

const getWish = async ({
  wishId,
}: {
  wishId: string;
}): Promise<Document<unknown, {}, typeWish> | null> => {
  try {
    return await Wish.findById(wishId);
  } catch (error) {
    throw error;
  }
};

const addWish = async ({
  requestUser,
  req,
}: {
  requestUser: typeUser | null;
  req?: any;
}): Promise<Document<unknown, {}, typeWish> | null> => {
  try {
    const wishId = new mongoose.Types.ObjectId();
    let bodyData: any = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      bodyData = JSON.parse(req.query.payload);
    }

    const wishData = {
      _id: wishId,
      user_id: requestUser._id,
      ...bodyData,
    };

    const wish = new Wish(wishData);
    return await wish.save();
  } catch (error) {
    throw error;
  }
};

const updateWish = async ({
  wishId,
  requestUser,
  req,
}: {
  wishId: string;
  requestUser: typeUser | null;
  req?: any;
}): Promise<Document<unknown, {}, typeWish> | null> => {
  try {
    const wishDoc = await Wish.findById(wishId);
    if (!wishDoc) {
      throw new Error("Wish not found");
    }

    let bodyData: any = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      bodyData = JSON.parse(req.query.payload);
    }

    Object.assign(wishDoc, bodyData);

    return await wishDoc.save();
  } catch (error) {
    throw error;
  }
};

const deleteWish = async ({ wishId }: { wishId: string }): Promise<void> => {
  try {
    await Wish.findByIdAndDelete(wishId);
  } catch (error) {
    throw error;
  }
};

export const wishService = {
  getWish,
  addWish,
  getWishList,
  updateWish,
  deleteWish,
  getUserWishList,
};
