import {
  catchAsync,
  createResponseObject,
} from "../helpers/request.helpers.js";
import httpStatus from "http-status";
import { offerService } from "../services/offers.service.js";
import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import ExcelJS from "exceljs";
import Offer from "../models/offers.models.js";

const getOffer = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const offerDoc = await offerService.getOffer({
      offerId: req.params.id,
      query: req.query,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Offer Fetched Successfully!!",
      payload: { result: offerDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const getOfferList = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const offerDoc = await offerService.getOfferList({
      query: req.query,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Offer List Fetched Successfully!!",
      payload: { result: offerDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const getCustomerOfferList = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const offerDoc = await offerService.getCustomerOfferList({
      query: req.query,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Offer List Fetched Successfully!!",
      payload: { result: offerDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const updateOffer = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const offerDoc = await offerService.updateOffer({
      offerId: req.params.id,
      requestUser: req.user,
      req: req,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Offer Updated Successfully!!",
      payload: { result: offerDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const addOffer = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const offerDoc = await offerService.addOffer({
      requestUser: req.user,
      req: req,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Offer Added Successfully!!",
      payload: { result: offerDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const deleteOffer = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const offerDoc = await offerService.deleteOffer({
      offerId: req.params.id,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Offer Deleted Successfully!!",
      payload: { result: offerDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const downloadExcel = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Fetch offers from the database
      const offers = await Offer.find();
      // .populate("products")
      // .populate("categories");

      // Create a new Excel workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Offers");

      // Define the columns for the worksheet based on the typeOffer fields
      worksheet.columns = [
        { header: "Offer Code", key: "offer_code", width: 20 },
        { header: "Offer Name", key: "offer_name", width: 30 },
        { header: "Offer Type", key: "offer_type", width: 15 },
        { header: "Is Active", key: "is_active", width: 10 },
        { header: "Product Specified", key: "product_specified", width: 20 },
        { header: "Products", key: "products", width: 40 },
        { header: "Category Specified", key: "category_specified", width: 20 },
        { header: "Categories", key: "categories", width: 40 },
        {
          header: "Percentage Discount",
          key: "percentage_discount",
          width: 20,
        },
        {
          header: "Fixed Amount Discount",
          key: "fixed_amount_discount",
          width: 20,
        },
        { header: "Tiers", key: "tiers", width: 30 },
        { header: "Buy Quantity", key: "buy_quantity", width: 15 },
        { header: "Get Quantity", key: "get_quantity", width: 15 },
        { header: "Bundle Items", key: "bundle_items", width: 40 },
        { header: "Referral Code", key: "referral_code", width: 20 },
        { header: "Referral Amount", key: "referral_amount", width: 20 },
        { header: "Coupon Code", key: "coupon_code", width: 20 },
        { header: "Coupon Details", key: "coupon_details", width: 30 },
        { header: "Created At", key: "createdAt", width: 25 },
        { header: "Updated At", key: "updatedAt", width: 25 },
      ];

      // Add rows to the worksheet
      offers.forEach((offer) => {
        const productNames = offer.products
          .map((product) => product.toString()) // Adjust as necessary to get the product name or code
          .join(", ");
        const categoryNames = offer.categories
          .map((category) => category.toString()) // Adjust as necessary to get the category name
          .join(", ");
        const tierDetails =
          offer.tiers
            ?.map(
              (tier) =>
                `Min Order: ${tier.min_order_value}, Discount: ${tier.discount}`
            )
            .join("; ") || "N/A";
        const bundleItems =
          offer.bundle_items
            ?.map(
              (item) =>
                `Product ID: ${item.product_id.toString()}, Quantity: ${
                  item.quantity
                }, Price: ${item.price}`
            )
            .join("; ") || "N/A";
        const couponDetails = offer.coupon_details
          ? `${offer.coupon_details.coupon_type}: ${offer.coupon_details.value}`
          : "N/A";

        worksheet.addRow({
          offer_code: offer.offer_code,
          offer_name: offer.offer_name.map((name) => name.value).join(", "), // Assuming offer_name is localized
          offer_type: offer.offer_type,
          is_active: offer.is_active,
          product_specified: offer.product_specified,
          products: productNames,
          category_specified: offer.category_specified,
          categories: categoryNames,
          percentage_discount: offer.percentage_discount || "N/A",
          fixed_amount_discount: offer.fixed_amount_discount || "N/A",
          tiers: tierDetails,
          buy_quantity: offer.buy_quantity || "N/A",
          get_quantity: offer.get_quantity || "N/A",
          bundle_items: bundleItems,
          referral_code: offer.referral_code || "N/A",
          referral_amount: offer.referral_amount || "N/A",
          coupon_code: offer.coupon_code || "N/A",
          coupon_details: couponDetails,
          createdAt: offer.createdAt?.toISOString(),
          updatedAt: offer.updatedAt?.toISOString(),
        });
      });

      // Set the response headers and content type for the Excel file
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", "attachment; filename=offers.xlsx");

      // Write the Excel file to the response
      await workbook.xlsx.write(res);

      // End the response
      res.end();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const offerController = {
  getOffer,
  addOffer,
  getOfferList,
  updateOffer,
  deleteOffer,
  getCustomerOfferList,
  downloadExcel,
};
