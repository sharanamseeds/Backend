import mongoose, { Document } from "mongoose";
import Favourite, { typeFavourite } from "../models/favourite.model.js";
import { typeUser } from "../models/users.model.js";
import { escapeRegex } from "../helpers/common.helpers..js";

const getFavouriteList = async ({
  query,
}: {
  query?: any;
}): Promise<{
  data: (Document<unknown, {}, typeFavourite> | null)[];
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
      filterQuery.$or = [{ notes: new RegExp(escapeRegex(search), "i") }];
    }

    const totalDocs = await Favourite.countDocuments(filterQuery);

    if (!pagination) {
      const favouriteDoc = await Favourite.find(filterQuery).sort({
        [sortBy]: sortOrder === "asc" ? 1 : -1,
        _id: 1,
      });
      return {
        data: favouriteDoc,
        meta: {
          docsFound: totalDocs,
          docsInResponse: favouriteDoc.length,
          limit,
          total_pages: 1,
          currentPage: 1,
        },
      };
    }

    const favouriteDoc = await Favourite.find(filterQuery)
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1, _id: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total_pages = Math.ceil(totalDocs / limit);

    const meta = {
      docsFound: totalDocs,
      docsInResponse: favouriteDoc.length,
      limit,
      total_pages,
      currentPage: page,
    };

    return { data: favouriteDoc, meta };
  } catch (error) {
    throw error;
  }
};

const getUserFavouriteList = async ({
  query,
  requestUser,
}: {
  query?: any;
  requestUser: typeUser | null;
}): Promise<{
  data: (Document<unknown, {}, typeFavourite> | null)[];
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
      filterQuery.$or = [{ notes: new RegExp(escapeRegex(search), "i") }];
    }

    const totalDocs = await Favourite.countDocuments(filterQuery);

    if (!pagination) {
      const favouriteDoc = await Favourite.find(filterQuery).sort({
        [sortBy]: sortOrder === "asc" ? 1 : -1,
        _id: 1,
      });
      return {
        data: favouriteDoc,
        meta: {
          docsFound: totalDocs,
          docsInResponse: favouriteDoc.length,
          limit,
          total_pages: 1,
          currentPage: 1,
        },
      };
    }

    const favouriteDoc = await Favourite.find(filterQuery)
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1, _id: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total_pages = Math.ceil(totalDocs / limit);

    const meta = {
      docsFound: totalDocs,
      docsInResponse: favouriteDoc.length,
      limit,
      total_pages,
      currentPage: page,
    };

    return { data: favouriteDoc, meta };
  } catch (error) {
    throw error;
  }
};

const getFavourite = async ({
  favouriteId,
}: {
  favouriteId: string;
}): Promise<Document<unknown, {}, typeFavourite> | null> => {
  try {
    return await Favourite.findById(favouriteId);
  } catch (error) {
    throw error;
  }
};

const addFavourite = async ({
  requestUser,
  req,
}: {
  requestUser: typeUser | null;
  req?: any;
}): Promise<Document<unknown, {}, typeFavourite> | null> => {
  try {
    const favouriteId = new mongoose.Types.ObjectId();
    let bodyData: any = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      bodyData = JSON.parse(req.query.payload);
    }

    const favouriteData = {
      _id: favouriteId,
      user_id: requestUser._id,
      ...bodyData,
    };

    const favourite = new Favourite(favouriteData);
    return await favourite.save();
  } catch (error) {
    throw error;
  }
};

const updateFavourite = async ({
  favouriteId,
  requestUser,
  req,
}: {
  favouriteId: string;
  requestUser: typeUser | null;
  req?: any;
}): Promise<Document<unknown, {}, typeFavourite> | null> => {
  try {
    const favouriteDoc = await Favourite.findById(favouriteId);
    if (!favouriteDoc) {
      throw new Error("Favourite not found");
    }

    let bodyData: any = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      bodyData = JSON.parse(req.query.payload);
    }

    Object.assign(favouriteDoc, bodyData);

    return await favouriteDoc.save();
  } catch (error) {
    throw error;
  }
};

const deleteFavourite = async ({
  favouriteId,
}: {
  favouriteId: string;
}): Promise<void> => {
  try {
    await Favourite.findByIdAndDelete(favouriteId);
  } catch (error) {
    throw error;
  }
};

export const favouriteService = {
  getFavourite,
  addFavourite,
  getFavouriteList,
  updateFavourite,
  deleteFavourite,
  getUserFavouriteList,
};
