import mongoose, { Document } from "mongoose";
import { typeUser } from "../models/users.model.js";
import Bill, { typeBill } from "../models/bill.model.js";
import Order, { typeOrder } from "../models/orders.model.js";
import { convertFiles, createDocument } from "../helpers/files.management.js";
import { masterConfig } from "../config/master.config.js";
import { ledgerService } from "./ledgers.service.js";
import { escapeRegex } from "../helpers/common.helpers..js";

const createInvoiceNo = async () => {
  const prefix = masterConfig.billingConfig.invoicePrefix; // Ensure this is defined in your masterConfig
  const currentMonthYear =
    new Date().toISOString().slice(5, 7) + new Date().getFullYear();

  // Find the last invoice from the Bill collection
  const lastBill = await Bill.findOne().sort({ createdAt: -1 });

  if (lastBill && lastBill.invoice_id) {
    const lastInvoiceNo = lastBill.invoice_id;
    const [lastPrefix, lastSeq, lastMonthYear] = lastInvoiceNo.split("-");

    if (lastMonthYear === currentMonthYear) {
      const newSeq = (parseInt(lastSeq, 10) + 1).toString().padStart(4, "0");
      return `${prefix}-${newSeq}-${currentMonthYear}`;
    }
  }

  return `${prefix}-0001-${currentMonthYear}`;
};

const getBillList = async ({
  query = {},
}: {
  query?: any;
}): Promise<{
  data: (Document<unknown, {}, typeBill> | null)[];
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
      customer_id,
      order_id,
      payment_status,
      invoice_id,
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
    if (customer_id) {
      filterQuery.customer_id = new mongoose.Types.ObjectId(customer_id);
    }
    if (order_id) {
      filterQuery.order_id = new mongoose.Types.ObjectId(order_id);
    }
    if (payment_status) {
      filterQuery.payment_status = payment_status;
    }
    if (invoice_id) {
      filterQuery.invoice_id = invoice_id;
    }

    if (search) {
      filterQuery.$or = [
        { payment_status: { $regex: escapeRegex(search), $options: "i" } },
        { invoice_id: { $regex: escapeRegex(search), $options: "i" } },
      ];
    }

    const totalDocs = await Bill.countDocuments(filterQuery);

    if (!pagination) {
      const billDoc = await Bill.find(filterQuery).sort({
        [sortBy]: sortOrder === "asc" ? 1 : -1,
        _id: 1,
      });
      return {
        data: billDoc,
        meta: {
          docsFound: totalDocs,
          docsInResponse: billDoc.length,
          limit,
          total_pages: 1,
          currentPage: 1,
        },
      };
    }

    const billDoc = await Bill.find(filterQuery)
      .sort({
        [sortBy]: sortOrder === "asc" ? 1 : -1,
        _id: 1,
      })
      .skip((page - 1) * limit)
      .limit(limit);

    const total_pages = Math.ceil(totalDocs / limit);

    const meta = {
      docsFound: totalDocs,
      docsInResponse: billDoc.length,
      limit,
      total_pages,
      currentPage: page,
    };

    return { data: billDoc, meta };
  } catch (error) {
    throw error;
  }
};

const getCustomerBillList = async ({
  query = {},
  requestUser,
}: {
  query?: any;
  requestUser: typeUser | null;
}): Promise<{
  data: (Document<unknown, {}, typeBill> | null)[];
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
      order_id,
      payment_status,
      invoice_id,
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
      customer_id: new mongoose.Types.ObjectId(requestUser._id),
    };

    if (order_id) {
      filterQuery.order_id = new mongoose.Types.ObjectId(order_id);
    }
    if (payment_status) {
      filterQuery.payment_status = payment_status;
    }
    if (invoice_id) {
      filterQuery.invoice_id = invoice_id;
    }
    if (search) {
      filterQuery.$or = [
        { payment_status: { $regex: escapeRegex(search), $options: "i" } },
        { invoice_id: { $regex: escapeRegex(search), $options: "i" } },
      ];
    }
    const totalDocs = await Bill.countDocuments(filterQuery);

    if (!pagination) {
      const billDoc = await Bill.find(filterQuery).sort({
        [sortBy]: sortOrder === "asc" ? 1 : -1,
        _id: 1,
      });
      return {
        data: billDoc,
        meta: {
          docsFound: totalDocs,
          docsInResponse: billDoc.length,
          limit,
          total_pages: 1,
          currentPage: 1,
        },
      };
    }

    const billDoc = await Bill.find(filterQuery)
      .sort({
        [sortBy]: sortOrder === "asc" ? 1 : -1,
        _id: 1,
      })
      .skip((page - 1) * limit)
      .limit(limit);

    const total_pages = Math.ceil(totalDocs / limit);

    const meta = {
      docsFound: totalDocs,
      docsInResponse: billDoc.length,
      limit,
      total_pages,
      currentPage: page,
    };

    return { data: billDoc, meta };
  } catch (error) {
    throw error;
  }
};

const getBill = async ({
  billId,
  query,
}: {
  billId: string;
  query?: any;
}): Promise<Document<unknown, {}, typeBill> | null> => {
  try {
    const billDoc = await Bill.findById(billId);

    return billDoc;
  } catch (error) {
    throw error;
  }
};

const addBill = async ({
  requestUser,
  order_id,
}: {
  requestUser: typeUser | null;
  order_id: string;
}): Promise<Document<unknown, {}, typeBill> | null> => {
  try {
    const orderDoc = await Order.findById(order_id);

    if (!orderDoc) {
      throw new Error("Invalid Order Id");
    }
    if (
      orderDoc.is_creditable === false &&
      orderDoc.status !== "delivered" &&
      orderDoc.status !== "return_fulfilled"
    ) {
      throw new Error("Order is not fulfilled");
    }
    const generatedInvoiveNo = await createInvoiceNo();

    const bill = new Bill({
      order_id: orderDoc._id,
      customer_id: orderDoc.user_id,
      order_amount: orderDoc.order_amount,
      bill_amount: orderDoc.billing_amount,
      tax_amount: orderDoc.tax_amount,
      discount_amount: orderDoc.discount_amount,
      invoice_id: generatedInvoiveNo,
      added_by: requestUser._id,
      updated_by: requestUser._id,
    });

    let billDoc = await bill.save();

    billDoc = await billDoc.save();
    return billDoc;
  } catch (error) {
    throw error;
  }
};

const updateBill = async ({
  billId,
  requestUser,
  files,
  status,
  payment_method,
}: {
  billId: string;
  requestUser: typeUser | null;
  files?: any;
  status: string;
  payment_method: string;
}): Promise<Document<unknown, {}, typeBill> | null> => {
  try {
    let billDoc = await Bill.findById(billId);

    if (!billDoc) {
      throw new Error("Bill Not Found");
    }

    if (status === "paid") {
      const reqfiles = convertFiles(files);
      const { payment_details } = reqfiles;
      if (!payment_details) {
        throw new Error("payment details not found");
      }
      if (Array.isArray(payment_details) && payment_details.length > 0) {
        const savedFile = await createDocument({
          document: payment_details[0],
          documentType: masterConfig.fileStystem.fileTypes.IMAGE,
          documentPath:
            masterConfig.fileStystem.folderPaths.BILLS +
            billDoc._id +
            "/" +
            masterConfig.fileStystem.folderPaths.LOGO,
        });
        if (savedFile) {
          billDoc.payment_details = savedFile.path;
        }
      }
      billDoc.payment_method = payment_method;
      billDoc.payment_status = status;
      await billDoc.save();

      await ledgerService.addLedger({
        requestUser: requestUser,
        bill_id: billDoc?._id?.toString(),
        description: "",
      });
    }
    return billDoc;
  } catch (error) {
    throw error;
  }
};

const deleteBill = async ({ billId }: { billId: string }): Promise<void> => {
  try {
    throw new Error("Bill Can Not Be Deleted");
    await Bill.findByIdAndDelete(billId);
  } catch (error) {
    throw error;
  }
};

export const billService = {
  getBill,
  addBill,
  getBillList,
  updateBill,
  deleteBill,
  getCustomerBillList,
};
