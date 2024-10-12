import mongoose, { Document } from "mongoose";
import Money, { typeMoney } from "../models/money.model.js";
import { typeUser } from "../models/users.model.js";
import { escapeRegex } from "../helpers/common.helpers..js";

const getMoneyList = async ({
  query = {},
}: {
  query?: any;
}): Promise<{
  data: (Document<unknown, {}, typeMoney> | null)[];
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
      sortBy = "createdAt",
      sortOrder = "asc",
      user_id,
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
    if (user_id) {
      filterQuery.user_id = new mongoose.Types.ObjectId(user_id);
    }

    if (search) {
      filterQuery.$or = [
        { description: { $regex: escapeRegex(search), $options: "i" } },
        { amount: { $regex: escapeRegex(search), $options: "i" } },
      ];
    }

    const totalDocs = await Money.countDocuments(filterQuery);

    if (!pagination) {
      const moneyDoc = await Money.find(filterQuery).sort({
        [sortBy]: sortOrder === "asc" ? 1 : -1,
        _id: 1,
      });
      return {
        data: moneyDoc,
        meta: {
          docsFound: totalDocs,
          docsInResponse: moneyDoc.length,
          limit,
          total_pages: 1,
          currentPage: 1,
        },
      };
    }

    const moneyDoc = await Money.find(filterQuery)
      .sort({
        [sortBy]: sortOrder === "asc" ? 1 : -1,
        _id: 1,
      })
      .skip((page - 1) * limit)
      .limit(limit);

    const total_pages = Math.ceil(totalDocs / limit);

    const meta = {
      docsFound: totalDocs,
      docsInResponse: moneyDoc.length,
      limit,
      total_pages,
      currentPage: page,
    };

    return { data: moneyDoc, meta };
  } catch (error) {
    throw error;
  }
};

const getCustomerMoneyList = async ({
  query = {},
  requestUser,
}: {
  query?: any;
  requestUser: typeUser | null;
}): Promise<{
  data: (Document<unknown, {}, typeMoney> | null)[];
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
      sortBy = "createdAt",
      sortOrder = "asc",
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

    let filterQuery: any = {
      user_id: new mongoose.Types.ObjectId(requestUser._id),
    };

    if (search) {
      filterQuery.$or = [
        { description: { $regex: escapeRegex(search), $options: "i" } },
        { amount: { $regex: escapeRegex(search), $options: "i" } },
      ];
    }

    const totalDocs = await Money.countDocuments(filterQuery);

    if (!pagination) {
      const moneyDoc = await Money.find(filterQuery).sort({
        [sortBy]: sortOrder === "asc" ? 1 : -1,
        _id: 1,
      });
      return {
        data: moneyDoc,
        meta: {
          docsFound: totalDocs,
          docsInResponse: moneyDoc.length,
          limit,
          total_pages: 1,
          currentPage: 1,
        },
      };
    }

    const moneyDoc = await Money.find(filterQuery)
      .sort({
        [sortBy]: sortOrder === "asc" ? 1 : -1,
        _id: 1,
      })
      .skip((page - 1) * limit)
      .limit(limit);

    const total_pages = Math.ceil(totalDocs / limit);

    const meta = {
      docsFound: totalDocs,
      docsInResponse: moneyDoc.length,
      limit,
      total_pages,
      currentPage: page,
    };

    return { data: moneyDoc, meta };
  } catch (error) {
    throw error;
  }
};

const getMoney = async ({
  moneyId,
  query,
}: {
  moneyId: string;
  query?: any;
}): Promise<Document<unknown, {}, typeMoney> | null> => {
  try {
    const moneyDoc = await Money.findById(moneyId);

    return moneyDoc;
  } catch (error) {
    throw error;
  }
};

const addMoney = async ({
  user_id,
  amount,
  description,
}: {
  user_id: string;
  amount: number;
  description: string;
}): Promise<Document<unknown, {}, typeMoney> | null> => {
  try {
    const money = new Money({
      user_id: user_id,
      amount,
      description,
    });

    let moneyDoc = await money.save();
    return moneyDoc;
  } catch (error) {
    throw error;
  }
};

const updateMoney = async ({
  moneyId,
  amount,
  description,
  requestUser,
}: {
  moneyId: string;
  amount: number;
  description: string;
  requestUser: typeUser | null;
}): Promise<Document<unknown, {}, typeMoney> | null> => {
  try {
    let moneyDoc = await Money.findById(moneyId);

    if (!moneyDoc) {
      throw new Error("Money record not found");
    }

    moneyDoc.amount = amount;
    moneyDoc.description = description;
    moneyDoc.updatedAt = new Date();

    await moneyDoc.save();

    return moneyDoc;
  } catch (error) {
    throw error;
  }
};

const deleteMoney = async ({ moneyId }: { moneyId: string }): Promise<void> => {
  try {
    await Money.findByIdAndDelete(moneyId);
  } catch (error) {
    throw error;
  }
};

export const moneyService = {
  getMoney,
  addMoney,
  getMoneyList,
  updateMoney,
  deleteMoney,
  getCustomerMoneyList,
};
