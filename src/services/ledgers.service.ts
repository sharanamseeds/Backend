import mongoose, { Document } from "mongoose";
import User, { typeUser } from "../models/users.model.js";
import Ledger, { typeLedger } from "../models/ledger.model.js";
import Bill from "../models/bill.model.js";
import Order from "../models/orders.model.js";
import Product from "../models/products.model.js";
import { masterConfig } from "../config/master.config.js";
import { escapeRegex } from "../helpers/common.helpers..js";

const getLedgerList = async ({
  query,
}: {
  query?: any;
}): Promise<{
  data: (Document<unknown, {}, typeLedger> | null)[];
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
      bill_id,
      bill_amount,
      invoice_id,
      type,
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
    if (bill_id) {
      filterQuery.bill_id = new mongoose.Types.ObjectId(bill_id);
    }
    if (bill_amount) {
      filterQuery.bill_amount = bill_amount;
    }
    if (invoice_id) {
      filterQuery.invoice_id = invoice_id;
    }
    if (type) {
      filterQuery.type = type;
    }
    if (search) {
      filterQuery.$or = [
        { type: { $regex: escapeRegex(search), $options: "i" } },
        { invoice_id: { $regex: escapeRegex(search), $options: "i" } },
      ];
    }
    const totalDocs = await Ledger.countDocuments(filterQuery);

    if (!pagination) {
      const ledgerDoc = await Ledger.find(filterQuery).sort({
        [sortBy]: sortOrder === "asc" ? 1 : -1,
      });
      return {
        data: ledgerDoc,
        meta: {
          docsFound: totalDocs,
          docsInResponse: ledgerDoc.length,
          limit,
          total_pages: 1,
          currentPage: 1,
        },
      };
    }

    const ledgerDoc = await Ledger.find(filterQuery)
      .sort({
        [sortBy]: sortOrder === "asc" ? 1 : -1,
      })
      .skip((page - 1) * limit)
      .limit(limit);

    const total_pages = Math.ceil(totalDocs / limit);

    const meta = {
      docsFound: totalDocs,
      docsInResponse: ledgerDoc.length,
      limit,
      total_pages,
      currentPage: page,
    };

    return { data: ledgerDoc, meta };
  } catch (error) {
    throw error;
  }
};

const getCustomerLedgerList = async ({
  query,
  requestUser,
}: {
  query?: any;
  requestUser: typeUser | null;
}): Promise<{
  data: (Document<unknown, {}, typeLedger> | null)[];
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
      bill_id,
      bill_amount,
      invoice_id,
      type,
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

    if (bill_id) {
      filterQuery.bill_id = new mongoose.Types.ObjectId(bill_id);
    }
    if (bill_amount) {
      filterQuery.bill_amount = bill_amount;
    }
    if (invoice_id) {
      filterQuery.invoice_id = invoice_id;
    }
    if (type) {
      filterQuery.type = type;
    }
    if (search) {
      filterQuery.$or = [
        { type: { $regex: escapeRegex(search), $options: "i" } },
        { invoice_id: { $regex: escapeRegex(search), $options: "i" } },
      ];
    }

    const totalDocs = await Ledger.countDocuments(filterQuery);

    if (!pagination) {
      const ledgerDoc = await Ledger.find(filterQuery).sort({
        [sortBy]: sortOrder === "asc" ? 1 : -1,
      });
      return {
        data: ledgerDoc,
        meta: {
          docsFound: totalDocs,
          docsInResponse: ledgerDoc.length,
          limit,
          total_pages: 1,
          currentPage: 1,
        },
      };
    }

    const ledgerDoc = await Ledger.find(filterQuery)
      .sort({
        [sortBy]: sortOrder === "asc" ? 1 : -1,
      })
      .skip((page - 1) * limit)
      .limit(limit);

    const total_pages = Math.ceil(totalDocs / limit);

    const meta = {
      docsFound: totalDocs,
      docsInResponse: ledgerDoc.length,
      limit,
      total_pages,
      currentPage: page,
    };

    return { data: ledgerDoc, meta };
  } catch (error) {
    throw error;
  }
};

const getLedger = async ({
  ledgerId,
  query,
}: {
  ledgerId: string;
  query?: any;
}): Promise<Document<unknown, {}, typeLedger> | null> => {
  try {
    const ledgerDoc = await Ledger.findById(ledgerId);

    return ledgerDoc;
  } catch (error) {
    throw error;
  }
};

const addLedger = async ({
  requestUser,
  bill_id,
  description,
}: {
  requestUser: typeUser | null;
  bill_id: string;
  description?: string;
}): Promise<Document<unknown, {}, typeLedger> | null> => {
  try {
    const billDoc = await Bill.findById(bill_id);
    if (!billDoc) {
      throw new Error("Bill Not Found");
    }
    if (billDoc.payment_status !== "paid") {
      throw new Error("Bill is not Paid");
    }

    const orderDoc = await Order.findById(billDoc.order_id);
    const sellerDoc = await User.findOne({
      email: masterConfig.superAdminConfig.email,
    });

    const sellerLedger = new Ledger({
      bill_id: billDoc._id,
      user_id: sellerDoc?._id,
      bill_amount: billDoc.bill_amount,
      payment_amount: billDoc.bill_amount,
      type: orderDoc.order_type === "buy" ? "credit" : "debit",
      description: description ? description : "",
      invoice_id: billDoc.invoice_id,
    });

    const buyerLedger = new Ledger({
      bill_id: billDoc._id,
      user_id: orderDoc.user_id,
      bill_amount: billDoc.bill_amount,
      payment_amount: billDoc.bill_amount,
      type: orderDoc.order_type === "buy" ? "debit" : "credit",
      description: description ? description : "",
      invoice_id: billDoc.invoice_id,
    });

    const buyerLedgerDoc = await buyerLedger.save();
    const sellerLedgerDoc = await sellerLedger.save();
    return buyerLedgerDoc;
  } catch (error) {
    throw error;
  }
};

const updateLedger = async ({
  ledgerId,
  requestUser,
  description,
}: {
  ledgerId: string;
  requestUser: typeUser | null;
  description?: string;
}): Promise<Document<unknown, {}, typeLedger> | null> => {
  try {
    let ledgerDoc = await Ledger.findById(ledgerId);
    if (description) {
      ledgerDoc.description = description;
      await ledgerDoc.save();
    }

    return ledgerDoc;
  } catch (error) {
    throw error;
  }
};

const deleteLedger = async ({
  ledgerId,
}: {
  ledgerId: string;
}): Promise<void> => {
  try {
    throw new Error("Ledger Can Not Be Deleted");
    await Ledger.findByIdAndDelete(ledgerId);
  } catch (error) {
    throw error;
  }
};

export const ledgerService = {
  getLedger,
  addLedger,
  getLedgerList,
  updateLedger,
  deleteLedger,
  getCustomerLedgerList,
};
