import mongoose, { Document } from "mongoose";
import Order, { typeOrder } from "../models/orders.model.js";
import User, { typeUser } from "../models/users.model.js";
import Offer, { typeOffer } from "../models/offers.models.js";
import { productService } from "./products.service.js";
import Product from "../models/products.model.js";
import { billService } from "./bills.service.js";
import { convertFiles } from "../helpers/files.management.js";
import { typeLocalizedString } from "../schema/localizedLanguage.schema.js";
import { masterConfig } from "../config/master.config.js";
import { escapeRegex } from "../helpers/common.helpers..js";

const calculateDaysDifference = (startDate: Date, endDate: Date) => {
  // Convert the input dates to milliseconds
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  // Calculate the difference in milliseconds
  const differenceInTime = end - start;

  // Convert milliseconds to days
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

  return differenceInDays;
};

const calculateOrderAmount = (
  products: {
    product_id: mongoose.Types.ObjectId;
    offer_id?: mongoose.Types.ObjectId;
    quantity: number;
    offer_discount: number;
    total_amount: number;
    gst_rate: number;
    purchase_price: number;
    gst_amount: number;
    manufacture_date: Date;
    expiry_date: Date;
  }[]
): {
  order_amount: number;
  discount_amount: number;
  billing_amount: number;
  tax_amount: number;
} => {
  let order_amount = 0;
  let discount_amount = 0;
  let tax_amount = 0;

  products.forEach((item) => {
    // Add the total product amount (excluding GST) to the order amount
    order_amount += item.purchase_price * item.quantity;
    // Add the calculated discount to the total discount amount
    discount_amount += item.offer_discount;
    // Add the GST amount to the tax amount
    tax_amount += item.gst_amount;
  });

  const billing_amount = order_amount + tax_amount - discount_amount;

  return {
    order_amount: Number(order_amount.toFixed(2)),
    discount_amount: Number(discount_amount.toFixed(2)),
    billing_amount: Number(billing_amount.toFixed(2)),
    tax_amount: Number(tax_amount.toFixed(2)),
  };
};

const calculatePercentageDiscount = (
  amountBeforeGST: number,
  percentage: number
) => {
  return amountBeforeGST * (percentage / 100);
};

const calculateFixedAmountDiscount = (_: number, offerAmount: number) => {
  return offerAmount;
};

const calculateReferralDiscount = (_: number, offerAmount: number) => {
  return offerAmount;
};

const calculateCouponDiscount = (
  amountBeforeGST: number,
  coupon_details: {
    coupon_type: "percentage" | "amount";
    value: number;
  }
) => {
  if (coupon_details.coupon_type === "percentage") {
    return calculatePercentageDiscount(amountBeforeGST, coupon_details.value);
  } else {
    return calculateFixedAmountDiscount(amountBeforeGST, coupon_details.value);
  }
};

const calculateTieredDiscount = (
  amountBeforeGST: number,
  tiers: {
    min_order_value: number;
    discount: number;
  }[]
) => {
  const applicableTier = tiers
    .filter((tier) => amountBeforeGST >= tier.min_order_value)
    .sort((a, b) => b.min_order_value - a.min_order_value)[0];

  if (!applicableTier) {
    throw new Error("Tiers Is Not Applicable");
  }
  return amountBeforeGST * (applicableTier.discount / 100);
};

const calculateBundleDiscount = (
  amountBeforeGST: number,
  bundleItems: {
    product_id: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
  }[],
  product: {
    product_id: mongoose.Types.ObjectId;
    offer_id?: mongoose.Types.ObjectId;
    quantity: number;
  }
) => {
  let discountAmount = 0;

  bundleItems.forEach((bundleItem) => {
    if (
      product.product_id.equals(bundleItem.product_id) &&
      product.quantity >= bundleItem.quantity
    ) {
      const bundleTotal = bundleItem.quantity * bundleItem.price;
      discountAmount += bundleTotal - bundleItem.price * bundleItem.quantity;
    }
  });

  return discountAmount;
};

const calculateBuyXGetYDiscount = (
  _: number,
  buy_quantity: number,
  get_quantity: number,
  product: {
    product_id: mongoose.Types.ObjectId;
    offer_id?: mongoose.Types.ObjectId;
    quantity: number;
  },
  product_price: number
) => {
  let discountAmount = 0;

  if (product.quantity >= buy_quantity) {
    const setsOfOffer = Math.floor(
      product.quantity / (buy_quantity + get_quantity)
    );
    discountAmount += setsOfOffer * product_price * get_quantity;
  }

  return discountAmount;
};

const calculateDiscount = async (
  product: {
    product_id: mongoose.Types.ObjectId;
    offer_id?: mongoose.Types.ObjectId;
    quantity: number;
  },
  amountBeforeGST: number,
  product_price: number
): Promise<number> => {
  let discount: number = 0;

  if (!product.offer_id) {
    return discount;
  }

  const offerDoc = await Offer.findById(product.offer_id);

  if (!offerDoc) {
    // throw new Error("Offer Not Found");
    return discount;
  }
  if (!offerDoc.is_active) {
    // throw new Error("This Offer Is Inactive");
    return discount;
  }

  switch (offerDoc.offer_type) {
    case "percentage":
      if (!offerDoc.percentage_discount) {
        // throw new Error("Discount Percent Is not Defined");
        return discount;
      }
      discount = calculatePercentageDiscount(
        amountBeforeGST,
        offerDoc.percentage_discount
      );
      return discount;

    case "fixed_amount":
      if (!offerDoc.fixed_amount_discount) {
        // throw new Error("Fixed Amount Discount Is not Defined");
        return discount;
      }
      discount = calculateFixedAmountDiscount(
        amountBeforeGST,
        offerDoc.fixed_amount_discount
      );
      return discount;

    case "referral":
      if (!offerDoc.referral_amount) {
        // throw new Error("Referral Amount Is not Defined");
        return discount;
      }
      discount = calculateReferralDiscount(
        amountBeforeGST,
        offerDoc.referral_amount
      );
      return discount;

    case "coupon":
      if (!offerDoc.coupon_details) {
        // throw new Error("Coupon Details Are not Defined");
        return discount;
      }
      discount = calculateCouponDiscount(
        amountBeforeGST,
        offerDoc.coupon_details
      );
      return discount;

    case "tiered":
      if (!offerDoc.tiers) {
        // throw new Error("Tiers Are not Defined");
        return discount;
      }
      discount = calculateTieredDiscount(amountBeforeGST, offerDoc.tiers);
      return discount;

    case "buy_x_get_y":
      if (
        offerDoc.buy_quantity === undefined ||
        offerDoc.get_quantity === undefined
      ) {
        // throw new Error("Buy Quantity or Get Quantity Is not Defined");
        return discount;
      }
      discount = calculateBuyXGetYDiscount(
        amountBeforeGST,
        offerDoc.buy_quantity,
        offerDoc.get_quantity,
        product,
        product_price
      );
      return discount;

    case "bundle":
      if (!offerDoc.bundle_items) {
        // throw new Error("Bundle Items Are not Defined");
        return discount;
      }
      discount = calculateBundleDiscount(
        amountBeforeGST,
        offerDoc.bundle_items,
        product
      );
      return discount;

    default:
      // throw new Error(`Unknown offer type: ${offerDoc.offer_type}`);
      return discount;
  }
};

const calculateReturnDiscount = async (
  product: {
    product_id: mongoose.Types.ObjectId;
    offer_id?: mongoose.Types.ObjectId;
    quantity: number;
  },
  amountBeforeGST: number,
  product_price: number
): Promise<number> => {
  let discount: number = 0;

  if (!product.offer_id) {
    return discount;
  }

  const offerDoc = await Offer.findById(product.offer_id);

  if (!offerDoc) {
    throw new Error("Offer Not Found");
  }

  switch (offerDoc.offer_type) {
    case "percentage":
      if (!offerDoc.percentage_discount) {
        throw new Error("Discount Percent Is not Defined");
      }
      discount = calculatePercentageDiscount(
        amountBeforeGST,
        offerDoc.percentage_discount
      );
      return discount;

    case "fixed_amount":
      if (!offerDoc.fixed_amount_discount) {
        throw new Error("Fixed Amount Discount Is not Defined");
      }
      discount = calculateFixedAmountDiscount(
        amountBeforeGST,
        offerDoc.fixed_amount_discount
      );
      return discount;

    case "referral":
      if (!offerDoc.referral_amount) {
        throw new Error("Referral Amount Is not Defined");
      }
      discount = calculateReferralDiscount(
        amountBeforeGST,
        offerDoc.referral_amount
      );
      return discount;

    case "coupon":
      if (!offerDoc.coupon_details) {
        throw new Error("Coupon Details Are not Defined");
      }
      discount = calculateCouponDiscount(
        amountBeforeGST,
        offerDoc.coupon_details
      );
      return discount;

    case "tiered":
      if (!offerDoc.tiers) {
        throw new Error("Tiers Are not Defined");
      }
      discount = calculateTieredDiscount(amountBeforeGST, offerDoc.tiers);
      return discount;

    case "buy_x_get_y":
      if (
        offerDoc.buy_quantity === undefined ||
        offerDoc.get_quantity === undefined
      ) {
        throw new Error("Buy Quantity or Get Quantity Is not Defined");
      }
      discount = calculateBuyXGetYDiscount(
        amountBeforeGST,
        offerDoc.buy_quantity,
        offerDoc.get_quantity,
        product,
        product_price
      );
      return discount;

    case "bundle":
      if (!offerDoc.bundle_items) {
        throw new Error("Bundle Items Are not Defined");
      }
      discount = calculateBundleDiscount(
        amountBeforeGST,
        offerDoc.bundle_items,
        product
      );
      return discount;

    default:
      throw new Error(`Unknown offer type: ${offerDoc.offer_type}`);
  }
};

const modifiedProducts = async (
  products: {
    product_id: mongoose.Types.ObjectId;
    offer_id?: mongoose.Types.ObjectId;
    quantity: number;
  }[]
): Promise<
  {
    product_id: mongoose.Types.ObjectId;
    offer_id?: mongoose.Types.ObjectId;
    quantity: number;
    offer_discount: number;
    total_amount: number;
    gst_rate: number;
    purchase_price: number;
    gst_amount: number;
    manufacture_date: Date;
    expiry_date: Date;
  }[]
> => {
  const calculatedProducts = await Promise.all(
    products.map(async (product) => {
      const productDoc = await Product.findById(product.product_id);
      if (!productDoc || !productDoc.is_active || !productDoc.is_verified) {
        throw new Error("Product Not Found");
      }

      const total_amount = productDoc.price * product.quantity;

      let discount = 0;

      if (product?.offer_id) {
        discount = await calculateDiscount(
          product,
          total_amount,
          productDoc.price
        );
      }

      let final_amount = total_amount - discount;

      const gst_amount =
        productDoc.gst_percent > 0
          ? (final_amount * productDoc.gst_percent) / 100
          : 0; // GST should be calculated after applying discount

      return {
        ...product,
        offer_discount: Number(discount.toFixed(2)),
        total_amount: Number(final_amount.toFixed(2)),
        gst_rate: Number(productDoc.gst_percent.toFixed(2)),
        purchase_price: Number(productDoc.price.toFixed(2)),
        gst_amount: Number(gst_amount.toFixed(2)),
        manufacture_date: productDoc?.manufacture_date,
        expiry_date: productDoc?.expiry_date,
      };
    })
  );

  return calculatedProducts;
};

const checkProductsInStock = async (
  products: {
    product_id: mongoose.Types.ObjectId;
    offer_id?: mongoose.Types.ObjectId;
    quantity: number;
    offer_discount: number;
    total_amount: number;
    gst_rate: number;
    purchase_price: number;
    gst_amount: number;
    manufacture_date: Date;
    expiry_date: Date;
  }[]
) => {
  try {
    await Promise.all(
      products.map(async (product) => {
        const productDoc = await Product.findById(product.product_id);
        if (!productDoc) {
          throw new Error(
            `Product Not Found, Product Id: ${product.product_id}`
          );
        }
        if (!productDoc.is_active) {
          throw new Error(
            `Product Not Active, Product Code: ${productDoc.product_code}`
          );
        }
        if (!productDoc.in_stock) {
          throw new Error(
            `Product is Not In Stock, Product Code: ${productDoc.product_code}`
          );
        }
        if (productDoc.quantity < product.quantity) {
          throw new Error(
            `Product Has Not Enough Quantity, Product Code: ${productDoc.product_code}`
          );
        }
      })
    );

    return true;
  } catch (error) {
    throw error;
  }
};

const getOrderList = async ({
  query,
}: {
  query?: any;
}): Promise<{
  data: (Document<unknown, {}, typeOrder> | null)[];
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
      buy_order_id,
      status,
      user_id,
      offer_id,
      product_id,
      bill_id,
      total_order_amount,
      billing_amount,
      order_type,
      is_creditable,
      credit_duration,
      search,
    } = query;

    let filterQuery: any = {};

    if (product_id) {
      filterQuery.products = {
        $elemMatch: { product_id: new mongoose.Types.ObjectId(product_id) },
      };
    }
    if (credit_duration) {
      filterQuery.credit_duration = credit_duration;
    }
    if (is_creditable) {
      filterQuery.is_creditable = is_creditable;
    }
    if (order_type) {
      filterQuery.order_type = order_type;
    }
    if (buy_order_id) {
      filterQuery.buy_order_id = new mongoose.Types.ObjectId(buy_order_id);
    }
    if (status) {
      filterQuery.status = status;
    }
    if (user_id) {
      filterQuery.user_id = user_id;
    }
    if (offer_id) {
      filterQuery.offer_id = offer_id;
    }
    if (bill_id) {
      filterQuery.bill_id = bill_id;
    }
    if (total_order_amount) {
      filterQuery.total_order_amount = total_order_amount;
    }
    if (billing_amount) {
      filterQuery.billing_amount = billing_amount;
    }

    if (search) {
      filterQuery.$or = [
        { status: { $regex: escapeRegex(search), $options: "i" } },
      ];
    }

    const totalDocs = await Order.countDocuments(filterQuery);

    if (!pagination) {
      const orderDoc = await Order.find(filterQuery).sort({
        [sortBy]: sortOrder === "asc" ? 1 : -1,
        _id: 1,
      });
      return {
        data: orderDoc,
        meta: {
          docsFound: totalDocs,
          docsInResponse: orderDoc.length,
          limit,
          total_pages: 1,
          currentPage: 1,
        },
      };
    }

    const orderDoc = await Order.find(filterQuery)
      .sort({
        [sortBy]: sortOrder === "asc" ? 1 : -1,
        _id: 1,
      })
      .skip((page - 1) * limit)
      .limit(limit);

    const total_pages = Math.ceil(totalDocs / limit);

    const meta = {
      docsFound: totalDocs,
      docsInResponse: orderDoc.length,
      limit,
      total_pages,
      currentPage: page,
    };

    return { data: orderDoc, meta };
  } catch (error) {
    throw error;
  }
};

const getCustomerOrderList = async ({
  query,
  requestUser,
}: {
  query?: any;
  requestUser: typeUser | null;
}): Promise<{
  data: (Document<unknown, {}, typeOrder> | null)[];
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
      buy_order_id,
      status,
      offer_id,
      product_id,
      bill_id,
      total_order_amount,
      billing_amount,
      order_type,
      is_creditable,
      credit_duration,
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

    if (product_id) {
      filterQuery.products = {
        $elemMatch: { product_id: new mongoose.Types.ObjectId(product_id) },
      };
    }
    if (credit_duration) {
      filterQuery.credit_duration = credit_duration;
    }
    if (is_creditable) {
      filterQuery.is_creditable = is_creditable;
    }
    if (order_type) {
      filterQuery.order_type = order_type;
    }
    if (buy_order_id) {
      filterQuery.buy_order_id = new mongoose.Types.ObjectId(buy_order_id);
    }
    if (status) {
      filterQuery.status = status;
    }
    if (offer_id) {
      filterQuery.offer_id = offer_id;
    }
    if (bill_id) {
      filterQuery.bill_id = bill_id;
    }
    if (total_order_amount) {
      filterQuery.total_order_amount = total_order_amount;
    }
    if (billing_amount) {
      filterQuery.billing_amount = billing_amount;
    }
    if (search) {
      filterQuery.$or = [
        { status: { $regex: escapeRegex(search), $options: "i" } },
      ];
    }

    const totalDocs = await Order.countDocuments(filterQuery);

    if (!pagination) {
      const orderDoc = await Order.find(filterQuery)
        .populate({
          path: "products.product_id", // Populating the product details
          select: "images", // Optional: Select specific fields from the Product model
        })
        .sort({
          [sortBy]: sortOrder === "asc" ? 1 : -1,
          _id: 1,
        });
      return {
        data: orderDoc,
        meta: {
          docsFound: totalDocs,
          docsInResponse: orderDoc.length,
          limit,
          total_pages: 1,
          currentPage: 1,
        },
      };
    }

    const orderDoc = await Order.find(filterQuery)
      .populate({
        path: "products.product_id", // Populating the product details
        select: "images", // Optional: Select specific fields from the Product model
      })
      .sort({
        [sortBy]: sortOrder === "asc" ? 1 : -1,
        _id: 1,
      })
      .skip((page - 1) * limit)
      .limit(limit);

    const total_pages = Math.ceil(totalDocs / limit);

    const meta = {
      docsFound: totalDocs,
      docsInResponse: orderDoc.length,
      limit,
      total_pages,
      currentPage: page,
    };

    return { data: orderDoc, meta };
  } catch (error) {
    throw error;
  }
};

// const getOrder = async ({
//   orderId,
//   query,
// }: {
//   orderId: string;
//   query?: any;
// }): Promise<Document<unknown, {}, typeOrder> | null> => {
//   try {
//     const orderDoc = await Order.findById(orderId);
//     return orderDoc;
//   } catch (error) {
//     throw error;
//   }
// };

const getOrder = async ({
  orderId,
  query,
}: {
  orderId: string;
  query: any;
}) => {
  try {
    const lang_code =
      query.lang_code ||
      masterConfig.defaultDataConfig.languageConfig.lang_code;

    // Fetch the order and populate product details
    let orderDoc = await Order.findById(orderId);

    if (!orderDoc) return null;

    const productPromises = orderDoc.products.map(async (product) => {
      const productDoc = await Product.findById(product.product_id);
      const productObject = productDoc.toObject();
      const localizedProductName = productObject.product_name
        .filter((image: typeLocalizedString) => image.lang_code === lang_code)
        .map((image: typeLocalizedString) => image.value);
      const localizedImages = productObject.images
        .filter((image: typeLocalizedString) => image.lang_code === lang_code)
        .map((image: typeLocalizedString) => image.value);
      const localizedLogo = productObject.logo
        .filter((logo: typeLocalizedString) => logo.lang_code === lang_code)
        .map((logo: typeLocalizedString) => logo.value);
      const data = {
        product_id: product.product_id,
        offer_id: product.offer_id,
        quantity: product.quantity,
        offer_discount: product.offer_discount,
        total_amount: product.total_amount,
        gst_rate: product.gst_rate,
        purchase_price: product.purchase_price,
        gst_amount: product.gst_amount,
        manufacture_date: product.manufacture_date,
        expiry_date: product.expiry_date,
        product_code: productObject?.product_code,
        product_name: localizedProductName?.[0],
        images: localizedImages,
        logo: localizedLogo,
      };
      return data;
    });

    // Wait for all promises to resolve
    const newProducts = await Promise.all(productPromises);

    const modifiedOrder = {
      _id: orderDoc?._id,
      createdAt: orderDoc?.createdAt,
      user_id: orderDoc.user_id,
      added_by: orderDoc.added_by,
      updated_by: orderDoc.updated_by,
      bill_id: orderDoc.bill_id,
      order_type: orderDoc.order_type,
      buy_order_id: orderDoc.buy_order_id,
      products: newProducts,
      order_amount: orderDoc.order_amount,
      discount_amount: orderDoc.discount_amount,
      billing_amount: orderDoc.billing_amount,
      tax_amount: orderDoc.tax_amount,
      status: orderDoc.status,
      is_creditable: orderDoc.is_creditable,
      credit_duration: orderDoc.credit_duration,
      order_notes: orderDoc.order_notes,
      reason: orderDoc.reason,
    };

    // Return the order with localized products
    return modifiedOrder;
  } catch (error) {
    throw error;
  }
};

const addOrder = async ({
  requestUser,
  req,
}: {
  requestUser: typeUser | null;
  req?: any;
}): Promise<Document<unknown, {}, typeOrder> | null> => {
  try {
    let bodyData: any = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      bodyData = JSON.parse(req.query.payload);
    }

    const userDoc = await User.findById(
      bodyData?.user_id ? bodyData.user_id : requestUser._id
    );
    if (!userDoc) {
      throw new Error("User Not Found");
    }
    // TODO: Uncomment in Main
    // if (!userDoc.is_email_verified) {
    //   throw new Error("Verify Your Email Account Before Place Order");
    // }
    if (userDoc.is_blocked) {
      throw new Error("Unable To Place Order");
    }

    const modifiedOrderItems = await modifiedProducts(bodyData.products);

    // total order amount grand total of all products
    const totalOrderAmount = calculateOrderAmount(modifiedOrderItems);

    const order = new Order({
      order_type: "buy",
      status: "pending",
      user_id: userDoc._id,
      added_by: bodyData?.user_id ? bodyData.user_id : requestUser._id,
      updated_by: requestUser._id,
      products: modifiedOrderItems,
      tax_amount: totalOrderAmount.tax_amount,
      order_amount: totalOrderAmount.order_amount,
      discount_amount: totalOrderAmount.discount_amount,
      billing_amount: totalOrderAmount.billing_amount,
    });

    const orderDoc = await order.save();
    return orderDoc;
  } catch (error) {
    throw error;
  }
};

const calculateBill = async ({
  requestUser,
  req,
}: {
  requestUser: typeUser | null;
  req?: any;
}): Promise<{
  products: {
    product_id: mongoose.Types.ObjectId;
    offer_id?: mongoose.Types.ObjectId;
    quantity: number;
    offer_discount: number;
    total_amount: number;
    gst_rate: number;
    purchase_price: number;
    gst_amount: number;
    manufacture_date: Date;
    expiry_date: Date;
  }[];
  tax_amount: number;
  order_amount: number;
  discount_amount: number;
  billing_amount: number;
}> => {
  try {
    let bodyData: any = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      bodyData = JSON.parse(req.query.payload);
    }

    const modifiedOrderItems = await modifiedProducts(bodyData.products);

    const totalOrderAmount = calculateOrderAmount(modifiedOrderItems);

    const data = {
      products: modifiedOrderItems,
      tax_amount: totalOrderAmount.tax_amount,
      order_amount: totalOrderAmount.order_amount,
      discount_amount: totalOrderAmount.discount_amount,
      billing_amount: totalOrderAmount.billing_amount,
    };

    return data;
  } catch (error) {
    throw error;
  }
};

const updateOrder = async ({
  orderId,
  requestUser,
  req,
}: {
  orderId: string;
  requestUser: typeUser | null;
  req?: any;
}): Promise<Document<unknown, {}, typeOrder> | null> => {
  try {
    let orderDoc = await Order.findById(orderId);
    if (!orderDoc) {
      throw new Error("Order Not Found");
    }
    let bodyData: any = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      bodyData = JSON.parse(req.query.payload);
    }

    const {
      is_creditable,
      credit_duration,
      order_notes,
      payment_method,
      reason,
      status,
    } = bodyData;

    if (order_notes) {
      orderDoc.order_notes = order_notes;
    }

    if (status === "cancelled") {
      if (orderDoc.status === "cancelled") {
        return orderDoc;
      }

      if (orderDoc.added_by !== requestUser._id) {
        throw new Error("Only User Can Cancle Order");
      }

      if (
        orderDoc.status === "delivered" ||
        orderDoc.status === "rejected" ||
        orderDoc.status === "return_rejected" ||
        orderDoc.status === "return_fulfilled"
      ) {
        throw new Error("Order Can Not Be Cancelled");
      }

      if (
        orderDoc.status === "confirm" ||
        orderDoc.status === "return_accepeted"
      ) {
        try {
          if (orderDoc.order_type === "buy") {
            await Promise.all(
              orderDoc.products.map(async (orderProduct) => {
                await productService.addProductQuantity({
                  requestUser: req.user,
                  productId: orderProduct.product_id.toString(),
                  quantity: orderProduct.quantity,
                });
              })
            );
          } else {
            await Promise.all(
              orderDoc.products.map(async (orderProduct) => {
                await productService.removeProductQuantity({
                  requestUser: req.user,
                  productId: orderProduct.product_id.toString(),
                  quantity: orderProduct.quantity,
                });
              })
            );
          }
        } catch (error) {
          throw error;
        }
      }

      orderDoc.status = status;
      orderDoc.updated_by = requestUser._id;
      orderDoc = await orderDoc.save();
      return orderDoc;
    }

    if (status === "rejected" || status === "return_rejected") {
      if (
        status === "return_rejected" &&
        orderDoc.status !== "return_requested"
      ) {
        throw new Error("only return reqested order can be rejected");
      }
      if (status === "rejected" && orderDoc.status !== "pending") {
        throw new Error("only pending order can be rejected");
      }

      if (orderDoc.added_by === requestUser._id) {
        throw new Error("Only Admin Can Reject Order");
      }
      if (!reason) {
        throw new Error("Reason Is Required");
      }
      orderDoc.status = status;
      orderDoc.reason = reason;
      orderDoc.updated_by = requestUser._id;
      orderDoc = await orderDoc.save();
      return orderDoc;
    }

    if (status === "confirm" || status === "return_accepeted") {
      if (status === "confirm" && orderDoc.status !== "pending") {
        throw new Error("only pending order can be confirmed");
      }

      if (
        status === "return_accepeted" &&
        orderDoc.status !== "return_requested"
      ) {
        throw new Error("only retun requested order can be return accepeted");
      }

      if (orderDoc.added_by === requestUser._id) {
        throw new Error("Only Admin Can Confirm Order");
      }
      // check every items is in stock
      if (orderDoc.order_type === "buy") {
        try {
          await checkProductsInStock(orderDoc.products);
        } catch (error) {
          throw error;
        }
      }
      // Remove/Add Stock Orderd Quantity
      try {
        if (orderDoc.order_type === "buy") {
          await Promise.all(
            orderDoc.products.map(async (orderProduct) => {
              await productService.removeProductQuantity({
                requestUser: req.user,
                productId: orderProduct.product_id.toString(),
                quantity: orderProduct.quantity,
              });
            })
          );
        } else {
          await Promise.all(
            orderDoc.products.map(async (orderProduct) => {
              await productService.addProductQuantity({
                requestUser: req.user,
                productId: orderProduct.product_id.toString(),
                quantity: orderProduct.quantity,
              });
            })
          );
        }
      } catch (error) {
        throw error;
      }

      if (is_creditable === true && !credit_duration) {
        throw new Error("Credit Duration is Required");
      }

      orderDoc.status = status;
      orderDoc.is_creditable = is_creditable;
      orderDoc.credit_duration = credit_duration || 0;
      orderDoc.updated_by = requestUser._id;
      orderDoc = await orderDoc.save();
      return orderDoc;
    }

    if (status === "delivered" || status === "return_fulfilled") {
      if (status === "delivered" && orderDoc.status !== "confirm") {
        throw new Error("only confirm order can be delivered");
      }
      if (
        status === "return_fulfilled" &&
        orderDoc.status !== "return_accepeted"
      ) {
        throw new Error("only return accepeted order can be return fulfilled");
      }

      if (orderDoc.added_by === requestUser._id) {
        throw new Error(`Only Admin Can Update Status : ${status} Order`);
      }

      if (orderDoc.is_creditable) {
        const billDoc = await billService.addBill({
          requestUser,
          order_id: orderId,
        });

        orderDoc.status = status;
        orderDoc.updated_by = requestUser._id;
        orderDoc.bill_id = new mongoose.Types.ObjectId(
          billDoc?._id?.toString()
        );
        orderDoc = await orderDoc.save();

        return orderDoc;
      } else {
        const files = convertFiles(req.files);
        const { payment_details } = files;

        if (!payment_details || !payment_method) {
          if (!payment_details) {
            throw new Error("Payment Details Is Required");
          }
          throw new Error("Payment Method Is Required");
        }
        orderDoc.status = status;
        orderDoc.updated_by = requestUser._id;
        orderDoc = await orderDoc.save();

        const billDoc = await billService.addBill({
          requestUser,
          order_id: orderId,
        });

        const paidBill = await billService.updateBill({
          billId: billDoc._id.toString(),
          requestUser,
          files: req.files,
          status: "paid",
          payment_method,
        });

        orderDoc.status = status;
        orderDoc.updated_by = requestUser._id;
        orderDoc.bill_id = new mongoose.Types.ObjectId(
          paidBill?._id?.toString()
        );
        orderDoc = await orderDoc.save();

        return orderDoc;
      }
    }

    return orderDoc;
  } catch (error) {
    throw error;
  }
};

const returnOrder = async ({
  buy_order_id,
  requestUser,
}: {
  buy_order_id: string;
  requestUser: typeUser | null;
}): Promise<Document<unknown, {}, typeOrder> | null> => {
  try {
    let sellOrderDoc = await Order.findById(buy_order_id);
    if (!sellOrderDoc) {
      throw new Error("Order Not Found");
    }
    if (!sellOrderDoc.is_creditable) {
      throw new Error("This Order is Not Returnable");
    }
    // const isReturnedOder = await Order.find({
    //   order_type: "sell",
    //   buy_order_id: new mongoose.Types.ObjectId(buy_order_id),
    // });
    if (sellOrderDoc.is_retuned) {
      throw new Error("This Order is Already Returned");
    }

    const sell_order_id = new mongoose.Types.ObjectId();

    sellOrderDoc.is_retuned = true;
    sellOrderDoc.sell_order_id = sell_order_id;
    await sellOrderDoc.save();

    const duration = calculateDaysDifference(
      sellOrderDoc.createdAt,
      new Date()
    );
    if (duration > sellOrderDoc.credit_duration) {
      throw new Error(
        `Order Can Be Delivered in ${sellOrderDoc.credit_duration} Days`
      );
    }

    const order = new Order({
      _id: sell_order_id,
      order_type: "sell",
      status: "return_requested",
      user_id: sellOrderDoc.user_id,
      added_by: requestUser._id,
      updated_by: requestUser._id,
      products: sellOrderDoc.products,
      tax_amount: sellOrderDoc.tax_amount,
      order_amount: sellOrderDoc.order_amount,
      discount_amount: sellOrderDoc.discount_amount,
      billing_amount: sellOrderDoc.billing_amount,
      buy_order_id: new mongoose.Types.ObjectId(buy_order_id),
    });

    const orderDoc = await order.save();
    return orderDoc;
  } catch (error) {
    throw error;
  }
};

const deleteOrder = async ({ orderId }: { orderId: string }): Promise<void> => {
  try {
    throw new Error("Order Can Not Be Deleted");
    await Order.findByIdAndDelete(orderId);
  } catch (error) {
    throw error;
  }
};

export const orderService = {
  getOrder,
  addOrder,
  getOrderList,
  updateOrder,
  deleteOrder,
  returnOrder,
  getCustomerOrderList,
  calculateBill,
};
