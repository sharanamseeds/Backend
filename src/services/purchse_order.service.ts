import mongoose from "mongoose";
import { escapeRegex } from "../helpers/common.helpers..js";
import PurchaseOrder, {
  typePurchaseOrder,
} from "../models/purchase_orders.model.js";
import { convertFiles, createDocument } from "../helpers/files.management.js";
import { masterConfig } from "../config/master.config.js";
import { productService } from "./products.service.js";
import Vendor from "../models/verdors.model.js";
import { Response } from "express";
import { generatePurchaseOrderCodeHtml } from "../helpers/mail.helpers.js";
import User from "../models/users.model.js";
import Product from "../models/products.model.js";

const getPurchaseOrder = async ({
  purchaseOrderId,
  query,
}: {
  purchaseOrderId: string;
  query: any;
}) => {
  const purchaseOrder = await PurchaseOrder.findById(purchaseOrderId);

  if (!purchaseOrder) {
    throw new Error("Purchase Order not found");
  }

  return purchaseOrder;
};

const getPurchaseOrderList = async ({
  query,
}: {
  query?: any;
}): Promise<{
  data: typePurchaseOrder[];
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
      invoice_no,
      status,
      payment_status,
      is_creditable,
      search,
    } = query;

    // Convert limit and page to numbers
    if (typeof limit === "string") {
      limit = Number(limit);
    }
    if (!limit || isNaN(limit)) {
      limit = 50; // Default limit
    }

    if (typeof page === "string") {
      page = Number(page);
    }
    if (!page || isNaN(page)) {
      page = 1; // Default page
    }

    if (typeof pagination === "string") {
      pagination = pagination === "true";
    }

    let filterQuery: any = {};

    // Apply filters based on query params
    if (invoice_no) {
      filterQuery.invoice_no = invoice_no;
    }
    if (status) {
      filterQuery.status = status;
    }
    if (payment_status) {
      filterQuery.payment_status = payment_status;
    }

    if (is_creditable) {
      filterQuery.is_creditable = is_creditable;
    }

    // Apply search logic for multiple fields
    if (search) {
      filterQuery.$or = [
        { invoice_no: { $regex: escapeRegex(search), $options: "i" } },
        { payment_status: { $regex: escapeRegex(search), $options: "i" } },
        { status: { $regex: escapeRegex(search), $options: "i" } },
      ];
    }

    const totalDocs = await PurchaseOrder.countDocuments(filterQuery);

    if (!pagination) {
      const purchaseOrderDoc = await PurchaseOrder.find(filterQuery).sort({
        [sortBy]: sortOrder === "asc" ? 1 : -1,
        _id: 1,
      }); // Sorting logic
      return {
        data: purchaseOrderDoc,
        meta: {
          docsFound: totalDocs,
          docsInResponse: purchaseOrderDoc.length,
          limit,
          total_pages: 1,
          currentPage: 1,
        },
      };
    }

    const purchaseOrderDoc = await PurchaseOrder.find(filterQuery)
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1, _id: 1 }) // Sorting logic
      .skip((page - 1) * limit)
      .limit(limit);

    const total_pages = Math.ceil(totalDocs / limit);

    const meta = {
      docsFound: totalDocs,
      docsInResponse: purchaseOrderDoc.length,
      limit,
      total_pages,
      currentPage: page,
    };

    return { data: purchaseOrderDoc, meta };
  } catch (error) {
    throw error;
  }
};

const updatePurchaseOrder = async ({
  purchaseOrderId,
  req,
}: {
  purchaseOrderId: string;
  req: any;
}) => {
  const purchaseOrder = await PurchaseOrder.findById(purchaseOrderId);

  if (!purchaseOrder) {
    throw new Error("PurchaseOrder not found");
  }

  let bodyData: any = {};
  if (req?.query?.payload && typeof req.query.payload === "string") {
    bodyData = JSON.parse(req.query.payload);
  }

  const files = convertFiles(req.files);
  const { purchase_invoice } = files;

  if (Array.isArray(purchase_invoice) && purchase_invoice.length > 0) {
    let data: any = {
      document: purchase_invoice[0],
      documentType: masterConfig.fileStystem.fileTypes.IMAGE,
      documentPath:
        masterConfig.fileStystem.folderPaths.PURCHSE_ORDER +
        purchaseOrderId +
        "/" +
        masterConfig.fileStystem.folderPaths.LOGO,
    };

    if (purchaseOrder?.purchase_invoice) {
      data = {
        ...data,
        oldPath: purchaseOrder?.purchase_invoice,
      };
    }

    const savedFile = await createDocument(data);
    if (savedFile) {
      bodyData.purchase_invoice = savedFile.path;
    }
  }

  await PurchaseOrder.findByIdAndUpdate(purchaseOrderId, bodyData);

  const purchaseOrderUpdate = await PurchaseOrder.findById(purchaseOrderId);

  return purchaseOrderUpdate;
};

const addPurchaseOrder = async ({ req }: { req: any }) => {
  let bodyData: any = {};

  const purchseOrderId = new mongoose.Types.ObjectId();

  if (req?.query?.payload && typeof req.query.payload === "string") {
    bodyData = JSON.parse(req.query.payload);
  }

  const vendor = await Vendor.findById(bodyData?.vendor_id);

  if (!vendor) {
    throw new Error("Vendor not found");
  }

  const files = convertFiles(req.files);
  const { purchase_invoice } = files;

  if (Array.isArray(purchase_invoice) && purchase_invoice.length > 0) {
    const savedFile = await createDocument({
      document: purchase_invoice[0],
      documentType: masterConfig.fileStystem.fileTypes.IMAGE,
      documentPath:
        masterConfig.fileStystem.folderPaths.PURCHSE_ORDER +
        purchseOrderId +
        "/" +
        masterConfig.fileStystem.folderPaths.LOGO,
    });
    if (savedFile) {
      bodyData.purchase_invoice = savedFile.path;
    }
  }

  const newPurchaseOrder = new PurchaseOrder(bodyData);

  await newPurchaseOrder.save();

  await Promise.all(
    newPurchaseOrder.products.map(async (orderProduct) => {
      await productService.addProductQuantityPO({
        productId: orderProduct.product_id?.toString(),
        quantity: orderProduct.quantity,
        requestUser: req.user,
        lot_no: orderProduct.lot_no,
        vendor_name: vendor.name,
        grn_date: newPurchaseOrder.purchase_date,
        expiry_date: orderProduct.expiry_date,
        manufacture_date: orderProduct.manufacture_date,
      });
    })
  );

  return newPurchaseOrder;
};

const deletePurchaseOrder = async ({
  purchaseOrderId,
}: {
  purchaseOrderId: string;
}) => {
  throw new Error("PurchaseOrder Can Not Be Deleted");

  const purchaseOrder = await PurchaseOrder.findByIdAndDelete(purchaseOrderId);

  if (!purchaseOrder) {
    throw new Error("PurchaseOrder not found");
  }

  return purchaseOrder;
};

const downloadPdf = async ({
  purchaseOrderId,
  res,
}: {
  purchaseOrderId: string;
  res: Response;
}) => {
  try {
    const purchaseOrder = await PurchaseOrder.findById(purchaseOrderId);

    if (!purchaseOrder) {
      throw new Error("PurchaseOrder not found");
    }

    const vendor = await Vendor.findById(purchaseOrder?.vendor_id);

    if (!vendor) {
      throw new Error("Vendor not found");
    }

    const admin = await User.findOne({
      email: masterConfig.superAdminConfig.email,
      is_app_user: false,
    });

    const formatDate = (date: Date) => {
      if (!date) return "";
      const d = new Date(date);
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const year = d.getFullYear();
      return `${year}-${month}-${day}`;
    };

    let modifiedProducts: {
      product_id: mongoose.Types.ObjectId;
      quantity: number;
      offer_discount: number;
      total_amount: number;
      gst_rate: number;
      purchase_price: number;
      gst_amount: number;
      manufacture_date: string;
      expiry_date: string;
      lot_no: string;
      product_name: string;
      product_code: string;
    }[] = [];
    await Promise.all(
      purchaseOrder.products.map(async (orderProduct) => {
        const productDoc = await Product.findById(orderProduct.product_id);
        const data = {
          product_id: orderProduct.product_id,
          quantity: orderProduct.quantity,
          offer_discount: orderProduct.offer_discount,
          total_amount: orderProduct.total_amount,
          gst_rate: orderProduct.gst_rate,
          purchase_price: orderProduct.purchase_price,
          gst_amount: orderProduct.gst_amount,
          manufacture_date: formatDate(new Date(orderProduct.manufacture_date)),
          expiry_date: formatDate(new Date(orderProduct.expiry_date)),
          lot_no: orderProduct.lot_no,
          product_name:
            productDoc.product_name.find(
              (item) =>
                item.lang_code ===
                masterConfig.defaultDataConfig.languageConfig.lang_code
            )?.value || productDoc.product_name[0].value,
          product_code: productDoc.product_code,
        };
        modifiedProducts.push(data);
      })
    );

    const htmlForAttachment = generatePurchaseOrderCodeHtml(
      purchaseOrder,
      vendor,
      admin,
      modifiedProducts
    );
    res.setHeader("Content-Type", "application/html");
    res.setHeader("Content-Disposition", "attachment; filename=bill.html");
    res.send(htmlForAttachment);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const purchaseOrderService = {
  getPurchaseOrder,
  getPurchaseOrderList,
  updatePurchaseOrder,
  addPurchaseOrder,
  deletePurchaseOrder,
  downloadPdf,
};
