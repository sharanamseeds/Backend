import mongoose, { Document } from "mongoose";
import { typeUser } from "../models/users.model.js";
import Product, { typeProduct } from "../models/products.model.js";
import {
  formatLocalizedData,
  transformFormData,
  updateField,
} from "../helpers/language.management.helper.js";
import {
  convertFiles,
  createDocument,
  deleteDocument,
} from "../helpers/files.management.js";
import { typeLocalizedString } from "../schema/localizedLanguage.schema.js";
import { masterConfig } from "../config/master.config.js";
import { offerService } from "./offers.service.js";
import { typeOffer } from "../models/offers.models.js";
import { escapeRegex } from "../helpers/common.helpers..js";

export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
  }
}

const projectLocalizedProducts = (lang_code: string, isActive?: boolean) => {
  return [
    {
      $lookup: {
        from: "offers", // Collection name
        let: {
          productId: "$_id",
          categoryId: "$category_id",
          isActive: isActive, // Pass the isActive variable
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  // Ensure offer.is_active is true
                  { $eq: ["$is_active", true] },
                  // Conditionally include the isActive condition
                  {
                    $or: [
                      {
                        $cond: [
                          { $ne: [null, "$$isActive"] },
                          { $eq: ["$is_active", "$$isActive"] },
                          true,
                        ],
                      },
                      // Check if productId is in products
                      {
                        $cond: [
                          { $ne: [null, "$$productId"] },
                          { $in: ["$$productId", "$products"] },
                          true,
                        ],
                      },
                      // Check if categoryId is in categories
                      {
                        $cond: [
                          { $ne: [null, "$$categoryId"] },
                          { $in: ["$$categoryId", "$categories"] },
                          true,
                        ],
                      },
                    ],
                  },
                ],
              },
            },
          },
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
        ],
        as: "offers",
      },
    },
    {
      $project: {
        added_by: 1,
        size: 1,
        price_with_gst: 1,
        updated_by: 1,
        product_code: 1,
        offers: 1,
        brand_id: 1,
        category_id: 1,
        in_stock: 1,
        gst_percent: 1,
        price: 1,
        quantity: 1,
        is_active: 1,
        is_verified: 1,
        manufacture_date: 1,
        expiry_date: 1,
        is_featured: 1,
        base_unit: 1,
        lot_no: 1,
        vendor_name: 1,
        grn_date: 1,
        std_qty: 1,

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

        product_name: {
          $arrayElemAt: [
            {
              $map: {
                input: {
                  $filter: {
                    input: "$product_name",
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

        images: {
          $map: {
            input: {
              $filter: {
                input: "$images",
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
      },
    },
  ];
};

const getProductList = async ({
  query,
}: {
  query?: any;
}): Promise<{
  data: (Document<unknown, {}, typeProduct> | null)[];
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
      is_featured,
      brand_id,
      category_id,
      in_stock,
      product_name,
      product_code,
      is_active,
      is_verified,
      price,
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

    if (search) {
      filterQuery.$or = [
        {
          product_name: {
            $elemMatch: {
              lang_code,
              value: new RegExp(escapeRegex(search), "i"),
            },
          },
        },
        {
          description: {
            $elemMatch: {
              lang_code,
              value: new RegExp(escapeRegex(search), "i"),
            },
          },
        },
        { product_code: { $regex: escapeRegex(search), $options: "i" } },
      ];
    }

    if (product_name) {
      filterQuery.product_name = {
        $elemMatch: {
          lang_code,
          value: new RegExp(escapeRegex(product_name), "i"),
        },
      };
    }
    if (product_code) {
      filterQuery.product_code = product_code;
    }
    if (price) {
      filterQuery.price = price;
    }
    if (is_active) {
      filterQuery.is_active = is_active == "true" ? true : false;
    }
    if (is_verified) {
      filterQuery.is_verified = is_verified == "true" ? true : false;
    }
    if (brand_id) {
      filterQuery.brand_id = new mongoose.Types.ObjectId(brand_id);
    }
    if (category_id) {
      filterQuery.category_id = new mongoose.Types.ObjectId(category_id);
    }
    if (in_stock !== undefined) {
      filterQuery.in_stock = in_stock == "true" ? true : false;
    }
    if (is_featured) {
      filterQuery.is_featured = is_featured == "true" ? true : false;
    }

    const totalDocs = await Product.countDocuments(filterQuery);

    if (!pagination) {
      const productDoc = await Product.aggregate([
        { $match: filterQuery },
        ...projectLocalizedProducts(lang_code),
      ]).sort({
        [sortBy]: sortOrder === "asc" ? 1 : -1,
        _id: 1,
      });
      return {
        data: productDoc,
        meta: {
          docsFound: totalDocs,
          docsInResponse: productDoc.length,
          limit,
          total_pages: 1,
          currentPage: 1,
        },
      };
    }

    const productDoc = await Product.aggregate([
      { $match: filterQuery },
      ...projectLocalizedProducts(lang_code),
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
      docsInResponse: productDoc.length,
      limit,
      total_pages,
      currentPage: page,
    };

    return { data: productDoc, meta };
  } catch (error) {
    throw error;
  }
};

const getCustomerProductList = async ({
  query,
}: {
  query?: any;
}): Promise<{
  data: (Document<unknown, {}, typeProduct> | null)[];
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
      is_featured,
      brand_id,
      category_id,
      product_name,
      product_code,
      price,
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
      in_stock: true,
      is_active: true,
      is_verified: true,
    };

    if (product_name) {
      filterQuery.product_name = {
        $elemMatch: {
          lang_code,
          value: new RegExp(escapeRegex(product_name), "i"),
        },
      };
    }
    if (product_code) {
      filterQuery.product_code = product_code;
    }
    if (price) {
      filterQuery.price = price;
    }
    if (brand_id) {
      filterQuery.brand_id = new mongoose.Types.ObjectId(brand_id);
    }
    if (category_id) {
      filterQuery.category_id = new mongoose.Types.ObjectId(category_id);
    }
    if (search) {
      filterQuery.$or = [
        {
          product_name: {
            $elemMatch: {
              lang_code,
              value: new RegExp(escapeRegex(search), "i"),
            },
          },
        },
        {
          description: {
            $elemMatch: {
              lang_code,
              value: new RegExp(escapeRegex(search), "i"),
            },
          },
        },
        { product_code: { $regex: escapeRegex(search), $options: "i" } },
      ];
    }
    if (is_featured) {
      filterQuery.is_featured = is_featured == "true" ? true : false;
    }

    const totalDocs = await Product.countDocuments(filterQuery);

    if (!pagination) {
      const productDoc = await Product.aggregate([
        { $match: filterQuery },
        ...projectLocalizedProducts(lang_code, true),
      ]).sort({
        [sortBy]: sortOrder === "asc" ? 1 : -1,
        _id: 1,
      });
      return {
        data: productDoc,
        meta: {
          docsFound: totalDocs,
          docsInResponse: productDoc.length,
          limit,
          total_pages: 1,
          currentPage: 1,
        },
      };
    }

    const productDoc = await Product.aggregate([
      { $match: filterQuery },
      ...projectLocalizedProducts(lang_code, true),
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
      docsInResponse: productDoc.length,
      limit,
      total_pages,
      currentPage: page,
    };

    return { data: productDoc, meta };
  } catch (error) {
    throw error;
  }
};

const getProduct = async ({
  productId,
  query,
}: {
  productId: string;
  query?: any;
}): Promise<{
  product: Document<unknown, {}, typeProduct>;
  offers: mongoose.Document<unknown, {}, typeOffer>[];
}> => {
  try {
    const lang_code = query.lang_code as string;
    const aggregationPipeline = projectLocalizedProducts(lang_code);

    const productDoc = await Product.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(productId) } },
      ...aggregationPipeline,
    ]);

    const offerQuery = {
      lang_code: lang_code,
      product_id: productId,
      pagination: false,
    };

    const offers = await offerService.getCustomerOfferList({
      query: offerQuery,
    });
    const data = { product: productDoc[0], offers: offers?.data };

    return data;
  } catch (error) {
    throw error;
  }
};

const addProduct = async ({
  requestUser,
  req,
}: {
  requestUser: typeUser | null;
  req?: any;
}): Promise<Document<unknown, {}, typeProduct> | null> => {
  try {
    const lang_code = req.query.lang_code as string;

    let bodyData: any = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      bodyData = JSON.parse(req.query.payload);
    }

    const formatedBodyData = transformFormData(bodyData);
    const product_id = new mongoose.Types.ObjectId();

    let price_with_gst = 0;
    if (formatedBodyData?.gst_percent > 0) {
      const gst =
        (formatedBodyData?.price * formatedBodyData?.gst_percent) / 100;
      const new_price = formatedBodyData.price + Number(gst.toFixed(2));
      price_with_gst = new_price;
    } else {
      price_with_gst = formatedBodyData.price;
    }

    let basicData: any = {
      _id: product_id,
      brand_id: formatedBodyData.brand_id,
      category_id: formatedBodyData.category_id,
      added_by: requestUser._id,
      updated_by: requestUser._id,
      product_code: formatedBodyData?.product_code,
      gst_percent: formatedBodyData?.gst_percent,
      price: formatedBodyData?.price,
      quantity: formatedBodyData?.quantity,
      expiry_date: formatedBodyData?.expiry_date,
      manufacture_date: formatedBodyData?.manufacture_date,
      is_featured: false,
      base_unit: formatedBodyData?.base_unit,
      images: [],
      logo: [],
      size: formatedBodyData?.size,
      in_stock: formatedBodyData?.quantity && formatedBodyData.quantity > 0,
      price_with_gst: price_with_gst,
    };

    if ("is_featured" in formatedBodyData) {
      basicData = {
        ...basicData,
        is_featured: formatedBodyData?.is_featured,
      };
      delete formatedBodyData.is_featured;
    }
    if ("grn_date" in formatedBodyData) {
      basicData = {
        ...basicData,
        grn_date: new Date(formatedBodyData?.grn_date),
      };
      delete formatedBodyData.grn_date;
    }
    if ("lot_no" in formatedBodyData) {
      basicData = {
        ...basicData,
        lot_no: formatedBodyData?.lot_no,
      };
      delete formatedBodyData.lot_no;
    }
    if ("vendor_name" in formatedBodyData) {
      basicData = {
        ...basicData,
        vendor_name: formatedBodyData?.vendor_name,
      };
      delete formatedBodyData.vendor_name;
    }

    if (formatedBodyData.product_name) {
      updateField(basicData, formatedBodyData, "product_name", lang_code);
      delete formatedBodyData.product_name;
    }

    if (formatedBodyData.description) {
      updateField(basicData, formatedBodyData, "description", lang_code);
      delete formatedBodyData.description;
    }

    const files = convertFiles(req.files);
    const { logo, images } = files;

    if (Array.isArray(logo) && logo.length > 0) {
      const savedFile = await createDocument({
        document: logo[0],
        documentType: masterConfig.fileStystem.fileTypes.IMAGE,
        documentPath:
          masterConfig.fileStystem.folderPaths.PRODUCTS +
          basicData._id +
          "/" +
          masterConfig.fileStystem.folderPaths.LOGO,
      });
      if (savedFile) {
        const localizedLogoPath: typeLocalizedString = {
          lang_code: req.query.lang_code,
          value: savedFile.path,
        };
        if (!basicData.logo) {
          basicData.logo = [localizedLogoPath];
        } else {
          basicData.logo.push(localizedLogoPath);
        }
      }
    }
    if (Array.isArray(images) && images.length > 0) {
      const savedFilesPromises = images.map(async (image) => {
        const savedFile = await createDocument({
          document: image,
          documentType: masterConfig.fileStystem.fileTypes.IMAGE,
          documentPath:
            masterConfig.fileStystem.folderPaths.PRODUCTS +
            basicData._id +
            "/" +
            masterConfig.fileStystem.folderPaths.IMAGES,
        });
        if (savedFile) {
          const localizedLogoPath: typeLocalizedString = {
            lang_code: req.query.lang_code,
            value: savedFile.path,
          };
          if (!basicData.images) {
            basicData.images = [localizedLogoPath];
          } else {
            basicData.images.push(localizedLogoPath);
          }
        }
      });

      await Promise.all(savedFilesPromises);
    }
    const product = new Product({
      ...basicData,
    });

    let productDoc = await product.save();

    return productDoc;
  } catch (error) {
    throw error;
  }
};

const updateProduct = async ({
  productId,
  requestUser,
  req,
}: {
  productId: string;
  requestUser: typeUser | null;
  req?: any;
}): Promise<Document<unknown, {}, typeProduct> | null> => {
  try {
    const lang_code = req.query.lang_code as string;
    let productDoc = await Product.findById(productId);
    if (!productDoc) {
      throw new NotFoundError("Product not found");
    }

    let bodyData: any = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      bodyData = JSON.parse(req.query.payload);
    }

    if (bodyData?.brand_id) {
      productDoc.brand_id = bodyData.brand_id;
      delete bodyData.brand_id;
    }

    if (bodyData?.is_active) {
      productDoc.is_active = bodyData.is_active;
      delete bodyData.is_active;
    }
    if (bodyData?.is_verified) {
      productDoc.is_verified = bodyData.is_verified;
      delete bodyData.is_verified;
    }
    if (bodyData?.category_id) {
      productDoc.category_id = bodyData.category_id;
      delete bodyData.category_id;
    }

    if (bodyData?.gst_percent) {
      productDoc.gst_percent = bodyData.gst_percent;
      delete bodyData.gst_percent;
    }
    if (bodyData?.manufacture_date) {
      productDoc.manufacture_date = new Date(bodyData.manufacture_date);
      delete bodyData.manufacture_date;
    }
    if (bodyData?.expiry_date) {
      productDoc.expiry_date = new Date(bodyData.expiry_date);
      delete bodyData.expiry_date;
    }
    if (bodyData?.price) {
      productDoc.price = bodyData.price;
      delete bodyData.price;
    }
    if (bodyData?.quantity) {
      productDoc.quantity = bodyData.quantity;
      delete bodyData.quantity;
      productDoc.in_stock = productDoc?.quantity && productDoc.quantity > 0;
    }

    if ("is_featured" in bodyData) {
      productDoc.is_featured = bodyData.is_featured;
      delete bodyData.is_featured;
    }
    if ("grn_date" in bodyData) {
      productDoc.grn_date = bodyData.grn_date;
      delete bodyData.grn_date;
    }
    if ("lot_no" in bodyData) {
      productDoc.lot_no = bodyData.lot_no;
      delete bodyData.lot_no;
    }
    if ("vendor_name" in bodyData) {
      productDoc.vendor_name = bodyData.vendor_name;
      delete bodyData.vendor_name;
    }
    if ("base_unit" in bodyData) {
      productDoc.base_unit = bodyData.base_unit;
      delete bodyData.base_unit;
    }
    if ("size" in bodyData) {
      productDoc.size = bodyData.size;
      delete bodyData.size;
    }

    if (bodyData.product_name) {
      updateField(productDoc, bodyData, "product_name", lang_code);
      delete bodyData.product_name;
    }
    if (bodyData.description) {
      updateField(productDoc, bodyData, "description", lang_code);
      delete bodyData.description;
    }

    productDoc.updated_by = requestUser._id;

    const files = convertFiles(req.files);
    const { logo, images } = files;

    if (Array.isArray(logo) && logo.length > 0) {
      const existingLogo = productDoc.logo?.find(
        (item) => item.lang_code === lang_code
      );

      const savedFile = await createDocument({
        document: logo[0],
        documentType: masterConfig.fileStystem.fileTypes.IMAGE,
        documentPath:
          masterConfig.fileStystem.folderPaths.BRANDS +
          productDoc._id +
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
          if (!productDoc.logo) {
            productDoc.logo = [localizedLogoPath];
          } else {
            productDoc.logo.push(localizedLogoPath);
          }
        }
      }
    }
    if (Array.isArray(images) && images.length > 0) {
      const savedFilesPromises = images.map(async (image) => {
        const savedFile = await createDocument({
          document: image,
          documentType: masterConfig.fileStystem.fileTypes.IMAGE,
          documentPath:
            masterConfig.fileStystem.folderPaths.PRODUCTS +
            productDoc._id +
            "/" +
            masterConfig.fileStystem.folderPaths.IMAGES,
        });
        if (savedFile) {
          const localizedLogoPath: typeLocalizedString = {
            lang_code: req.query.lang_code,
            value: savedFile.path,
          };
          if (!productDoc.images) {
            productDoc.images = [localizedLogoPath];
          } else {
            productDoc.images.push(localizedLogoPath);
          }
        }
      });

      await Promise.all(savedFilesPromises);
    }

    if (productDoc.gst_percent > 0) {
      const gst = (productDoc.price * productDoc.gst_percent) / 100;
      const new_price = productDoc.price + Number(gst.toFixed(2));
      productDoc.price_with_gst = new_price;
    } else {
      productDoc.price_with_gst = productDoc.price;
    }

    let updatedProduct = await Product.findByIdAndUpdate(
      productId,
      productDoc,
      { new: true }
    );

    return productDoc;
  } catch (error) {
    throw error;
  }
};

const deleteProduct = async ({
  productId,
}: {
  productId: string;
}): Promise<void> => {
  try {
    await Product.findByIdAndDelete(productId);
    const documentPath =
      masterConfig.fileStystem.folderPaths.BASE_FOLDER +
      masterConfig.fileStystem.folderPaths.PRODUCTS +
      productId;

    await deleteDocument({
      documentPath: documentPath,
    });
  } catch (error) {
    throw error;
  }
};

const deleteProductImage = async ({
  productId,
  src,
  requestUser,
  req,
}: {
  productId: string;
  src: string;
  requestUser: typeUser | null;
  req?: any;
}): Promise<Document<unknown, {}, typeProduct> | null> => {
  try {
    const lang_code = req.query.lang_code as string;
    let productDoc = await Product.findById(productId);

    if (!productDoc) {
      throw new NotFoundError("Product not found");
    }

    const imageIndex = productDoc.images.findIndex(
      (item) => item.lang_code === lang_code && item.value === src
    );

    if (imageIndex >= 0) {
      // remove image
      productDoc.images.splice(imageIndex, 1);
      await deleteDocument({
        documentPath: src,
      });
    } else {
      throw new NotFoundError("Image not found");
    }

    productDoc.updated_by = new mongoose.Types.ObjectId(
      requestUser._id.toString()
    );
    productDoc = await productDoc.save();

    return productDoc;
  } catch (error) {
    throw error;
  }
};

const removeProductQuantity = async ({
  productId,
  requestUser,
  quantity,
}: {
  productId: string;
  quantity: number;
  requestUser: typeUser | null;
}): Promise<Document<unknown, {}, typeProduct> | null> => {
  try {
    let productDoc = await Product.findById(productId);

    if (!productDoc) {
      throw new NotFoundError("Product not found");
    }
    if (productDoc.quantity < quantity) {
      throw new NotFoundError("Quantuty Should not be more than stock");
    }

    productDoc.quantity = productDoc.quantity - quantity;
    if (productDoc.quantity > 0) {
      productDoc.in_stock = true;
    } else {
      productDoc.in_stock = false;
    }
    productDoc.updated_by = new mongoose.Types.ObjectId(requestUser?._id);
    productDoc = await productDoc.save();

    return productDoc;
  } catch (error) {
    throw error;
  }
};

const addProductQuantity = async ({
  productId,
  requestUser,
  quantity,
}: {
  productId: string;
  quantity: number;
  requestUser: typeUser | null;
}): Promise<Document<unknown, {}, typeProduct> | null> => {
  try {
    let productDoc = await Product.findById(productId);

    if (!productDoc) {
      throw new NotFoundError("Product not found");
    }
    productDoc.quantity = productDoc.quantity + quantity;
    if (productDoc.quantity > 0) {
      productDoc.in_stock = true;
    }
    productDoc.updated_by = new mongoose.Types.ObjectId(requestUser?._id);
    productDoc = await productDoc.save();

    return productDoc;
  } catch (error) {
    throw error;
  }
};

const addProductQuantityPO = async ({
  productId,
  requestUser,
  quantity,
  lot_no,
  vendor_name,
  grn_date,
  expiry_date,
  manufacture_date,
}: {
  productId: string;
  quantity: number;
  requestUser: typeUser | null;
  lot_no: string;
  vendor_name: string;
  grn_date: Date;
  expiry_date: Date;
  manufacture_date: Date;
}): Promise<Document<unknown, {}, typeProduct> | null> => {
  try {
    let productDoc = await Product.findById(productId);

    if (!productDoc) {
      throw new NotFoundError("Product not found");
    }
    productDoc.quantity = productDoc.quantity + quantity;
    if (productDoc.quantity > 0) {
      productDoc.in_stock = true;
    }
    // productDoc.updated_by = new mongoose.Types.ObjectId(requestUser?._id);
    productDoc.lot_no = lot_no;
    productDoc.vendor_name = vendor_name;
    productDoc.grn_date = new Date(grn_date);
    productDoc.expiry_date = new Date(expiry_date);
    productDoc.manufacture_date = new Date(manufacture_date);
    productDoc = await productDoc.save();

    return productDoc;
  } catch (error) {
    throw error;
  }
};

export const productService = {
  getProduct,
  addProduct,
  getProductList,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  addProductQuantity,
  removeProductQuantity,
  getCustomerProductList,
  addProductQuantityPO,
};
