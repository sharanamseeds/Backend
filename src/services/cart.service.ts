import mongoose, { Document } from "mongoose";
import Cart, { typeCart } from "../models/cart.model.js";
import { typeUser } from "../models/users.model.js";

const getCartList = async ({
  query,
}: {
  query?: any;
}): Promise<{
  data: (Document<unknown, {}, typeCart> | null)[];
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
      status,
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
    if (status) {
      filterQuery.status = status;
    }
    if (search) {
      filterQuery.$or = [{ notes: new RegExp(search, "i") }];
    }

    const totalDocs = await Cart.countDocuments(filterQuery);

    if (!pagination) {
      const cartDoc = await Cart.find(filterQuery)
        .sort({
          [sortBy]: sortOrder === "asc" ? 1 : -1,
        })
        .populate("products");
      return {
        data: cartDoc,
        meta: {
          docsFound: totalDocs,
          docsInResponse: cartDoc.length,
          limit,
          total_pages: 1,
          currentPage: 1,
        },
      };
    }

    const cartDoc = await Cart.find(filterQuery)
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("products");

    const total_pages = Math.ceil(totalDocs / limit);

    const meta = {
      docsFound: totalDocs,
      docsInResponse: cartDoc.length,
      limit,
      total_pages,
      currentPage: page,
    };

    return { data: cartDoc, meta };
  } catch (error) {
    throw error;
  }
};

const getUserCartList = async ({
  query,
  requestUser,
}: {
  query?: any;
  requestUser: typeUser | null;
}): Promise<{
  data: (Document<unknown, {}, typeCart> | null)[];
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
      status,
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
    if (status) {
      filterQuery.status = status;
    }
    if (search) {
      filterQuery.$or = [{ notes: new RegExp(search, "i") }];
    }

    const totalDocs = await Cart.countDocuments(filterQuery);

    if (!pagination) {
      const cartDoc = await Cart.find(filterQuery)
        .sort({
          [sortBy]: sortOrder === "asc" ? 1 : -1,
        })
        .populate("products");
      return {
        data: cartDoc,
        meta: {
          docsFound: totalDocs,
          docsInResponse: cartDoc.length,
          limit,
          total_pages: 1,
          currentPage: 1,
        },
      };
    }

    const cartDoc = await Cart.find(filterQuery)
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("products");

    const total_pages = Math.ceil(totalDocs / limit);

    const meta = {
      docsFound: totalDocs,
      docsInResponse: cartDoc.length,
      limit,
      total_pages,
      currentPage: page,
    };

    return { data: cartDoc, meta };
  } catch (error) {
    throw error;
  }
};

const getCart = async ({
  cartId,
}: {
  cartId: string;
}): Promise<Document<unknown, {}, typeCart> | null> => {
  try {
    return await Cart.findById(cartId).populate("products");
  } catch (error) {
    throw error;
  }
};

const addCart = async ({
  requestUser,
  req,
}: {
  requestUser: typeUser | null;
  req?: any;
}): Promise<Document<unknown, {}, typeCart> | null> => {
  try {
    const cartId = new mongoose.Types.ObjectId();
    let bodyData: any = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      bodyData = JSON.parse(req.query.payload);
    }

    const cartData = {
      _id: cartId,
      user_id: requestUser._id,
      ...bodyData,
    };

    const cart = new Cart(cartData);
    return await cart.save();
  } catch (error) {
    throw error;
  }
};

const updateCart = async ({
  cartId,
  requestUser,
  req,
}: {
  cartId: string;
  requestUser: typeUser | null;
  req?: any;
}): Promise<Document<unknown, {}, typeCart> | null> => {
  try {
    const cartDoc = await Cart.findById(cartId);
    if (!cartDoc) {
      throw new Error("Cart not found");
    }

    let bodyData: any = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      bodyData = JSON.parse(req.query.payload);
    }

    Object.assign(cartDoc, bodyData);

    return await cartDoc.save();
  } catch (error) {
    throw error;
  }
};

const deleteCart = async ({ cartId }: { cartId: string }): Promise<void> => {
  try {
    await Cart.deleteOne({product_id: cartId});
  } catch (error) {
    throw error;
  }
};

export const cartService = {
  getCart,
  addCart,
  getCartList,
  updateCart,
  deleteCart,
  getUserCartList,
};
