import mongoose from "mongoose";
import { escapeRegex } from "../helpers/common.helpers..js";
import PurchaseOrder, {
  typePurchaseOrder,
} from "../models/purchase_orders.model.js";
// import { convertFiles, createDocument } from "../helpers/files.management.js";
import { masterConfig } from "../config/master.config.js";
import { productService } from "./products.service.js";
import Vendor from "../models/verdors.model.js";
import { Response } from "express";
import { generatePurchaseOrderCodeHtml } from "../helpers/mail.helpers.js";
import User from "../models/users.model.js";
import Product from "../models/products.model.js";

const createInvoiceNo = async () => {
  const prefix = masterConfig.billingConfig.poInvoicePrefix;
  const currentMonthYear =
    new Date().toISOString().slice(5, 7) + new Date().getFullYear();

  // Find the last invoice from the Bill collection
  const lastBill = await PurchaseOrder.findOne().sort({ createdAt: -1 });

  if (lastBill && lastBill.invoice_no) {
    const lastInvoiceNo = lastBill.invoice_no;
    const [lastPrefix, lastSeq, lastMonthYear] = lastInvoiceNo.split("-");

    if (lastMonthYear === currentMonthYear) {
      const newSeq = (parseInt(lastSeq, 10) + 1).toString().padStart(4, "0");
      return `${prefix}-${newSeq}-${currentMonthYear}`;
    }
  }

  return `${prefix}-0001-${currentMonthYear}`;
};

function calculateStandardQty(
  base_unit: string,
  quantity: number,
  size: number
): string {
  let std_qty = "";
  switch (base_unit) {
    case "GM":
      std_qty = ((quantity * size) / 1000).toFixed(2) + " KG";
      break;
    case "ML":
      std_qty = ((quantity * size) / 1000).toFixed(2) + " LTR";
      break;
    case "KG":
      std_qty = (quantity * size).toFixed(2) + " KG";
      break;
    case "LTR":
      std_qty = (quantity * size).toFixed(2) + " LTR";
    case "EACH":
      std_qty = (quantity * size).toFixed(2) + "EACH";
      break;
    default:
      std_qty = (quantity * size).toString();
  }
  return std_qty;
}

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

  const vendor = await Vendor.findById(purchaseOrder?.vendor_id);

  if (!vendor) {
    throw new Error("Vendor not found");
  }

  let bodyData: any = {};
  if (req?.query?.payload && typeof req.query.payload === "string") {
    bodyData = JSON.parse(req.query.payload);
  }

  let updateData: any = {};

  if (purchaseOrder.status === "completed") {
    if ("contact_name" in bodyData) {
      updateData.contact_name = bodyData.contact_name;
    }
    if ("contact_number" in bodyData) {
      updateData.contact_number = bodyData.contact_number;
    }
    if ("payment_status" in bodyData) {
      updateData.payment_status = bodyData.payment_status;
    }
    if ("order_notes" in bodyData) {
      updateData.order_notes = bodyData.order_notes;
    }
  } else {
    if ("contact_name" in bodyData) {
      updateData.contact_name = bodyData.contact_name;
    }
    if ("contact_number" in bodyData) {
      updateData.contact_number = bodyData.contact_number;
    }
    if ("payment_status" in bodyData) {
      updateData.payment_status = bodyData.payment_status;
    }
    if ("order_notes" in bodyData) {
      updateData.order_notes = bodyData.order_notes;
    }
    if ("products" in bodyData) {
      let modifiedProducts: {
        product_id: mongoose.Types.ObjectId;
        quantity: number;
        manufacture_date: Date;
        expiry_date: Date;
        lot_no: string;
        uom: "GM" | "ML" | "KG" | "LTR" | "EACH";
        final_quantity: string;
      }[] = [];
      await Promise.all(
        bodyData.products.map(async (orderProduct) => {
          const productDoc = await Product.findById(orderProduct.product_id);
          const data = {
            product_id: new mongoose.Types.ObjectId(orderProduct.product_id),
            quantity: Number(orderProduct.quantity),
            manufacture_date: new Date(orderProduct.manufacture_date),
            expiry_date: new Date(orderProduct.expiry_date),
            lot_no: orderProduct.lot_no,
            uom: productDoc.base_unit,
            final_quantity: calculateStandardQty(
              productDoc.base_unit,
              Number(orderProduct.quantity),
              Number(productDoc.size)
            ),
          };
          modifiedProducts.push(data);
        })
      );

      updateData.products = modifiedProducts;
    }
    if ("status" in bodyData) {
      updateData.status = bodyData.status;
      if (bodyData.status === "completed") {
        const editProducts = updateData?.products
          ? updateData.products
          : purchaseOrder.products;

        await Promise.all(
          editProducts.map(async (orderProduct) => {
            await productService.addProductQuantityPO({
              productId: orderProduct.product_id?.toString(),
              quantity: orderProduct.quantity,
              requestUser: req.user,
              lot_no: orderProduct.lot_no,
              vendor_name: vendor.name,
              grn_date: purchaseOrder.purchase_date,
              expiry_date: orderProduct.expiry_date,
              manufacture_date: orderProduct.manufacture_date,
            });
          })
        );
      }
    }
  }

  await PurchaseOrder.findByIdAndUpdate(purchaseOrderId, updateData);

  const purchaseOrderUpdate = await PurchaseOrder.findById(purchaseOrderId);

  return purchaseOrderUpdate;

  // const { purchase_invoice } = files;

  // if (Array.isArray(purchase_invoice) && purchase_invoice.length > 0) {
  //   let data: any = {
  //     document: purchase_invoice[0],
  //     documentType: masterConfig.fileStystem.fileTypes.IMAGE,
  //     documentPath:
  //       masterConfig.fileStystem.folderPaths.PURCHSE_ORDER +
  //       purchaseOrderId +
  //       "/" +
  //       masterConfig.fileStystem.folderPaths.LOGO,
  //   };

  //   if (purchaseOrder?.purchase_invoice) {
  //     data = {
  //       ...data,
  //       oldPath: purchaseOrder?.purchase_invoice,
  //     };
  //   }

  //   const savedFile = await createDocument(data);
  //   if (savedFile) {
  //     bodyData.purchase_invoice = savedFile.path;
  //   }
  // }
};

const addPurchaseOrder = async ({ req }: { req: any }) => {
  let bodyData: any = {};

  if (req?.query?.payload && typeof req.query.payload === "string") {
    bodyData = JSON.parse(req.query.payload);
  }

  let modifiedProducts: {
    product_id: mongoose.Types.ObjectId;
    quantity: number;
    manufacture_date: Date;
    expiry_date: Date;
    lot_no: string;
    uom: "GM" | "ML" | "KG" | "LTR" | "EACH";
    final_quantity: string;
  }[] = [];
  await Promise.all(
    bodyData.products.map(async (orderProduct) => {
      const productDoc = await Product.findById(orderProduct.product_id);
      const data = {
        product_id: new mongoose.Types.ObjectId(orderProduct.product_id),
        quantity: Number(orderProduct.quantity),
        manufacture_date: new Date(orderProduct.manufacture_date),
        expiry_date: new Date(orderProduct.expiry_date),
        lot_no: orderProduct.lot_no,
        uom: productDoc.base_unit,
        final_quantity: calculateStandardQty(
          productDoc.base_unit,
          Number(orderProduct.quantity),
          Number(productDoc.size)
        ),
      };
      modifiedProducts.push(data);
    })
  );

  delete bodyData.products;

  const invoice_no = await createInvoiceNo();
  const newPurchaseOrder = new PurchaseOrder({
    ...bodyData,
    invoice_no: invoice_no,
    products: modifiedProducts,
  });

  await newPurchaseOrder.save();

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
      manufacture_date: string;
      expiry_date: string;
      lot_no: string;
      uom: string;
      final_quantity: string;
      product_name: string;
      product_code: string;
    }[] = [];
    await Promise.all(
      purchaseOrder.products.map(async (orderProduct) => {
        const productDoc = await Product.findById(orderProduct.product_id);
        const data = {
          product_id: orderProduct.product_id,
          quantity: orderProduct.quantity,
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

          uom: orderProduct.uom,
          final_quantity: orderProduct.final_quantity,
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
