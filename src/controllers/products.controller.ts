import {
  catchAsync,
  createResponseObject,
} from "../helpers/request.helpers.js";
import httpStatus from "http-status";
import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { productService } from "../services/products.service.js";
import ExcelJS from "exceljs";
import Product from "../models/products.model.js";

const getProduct = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const productDoc = await productService.getProduct({
      productId: req.params.id,
      query: req.query,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Product Fetched Successfully!!",
      payload: { result: productDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const getProductList = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const productDoc = await productService.getProductList({
      query: req.query,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Product List Fetched Successfully!!",
      payload: { result: productDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const getCustomerProductList = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const productDoc = await productService.getCustomerProductList({
      query: req.query,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Product List Fetched Successfully!!",
      payload: { result: productDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const updateProduct = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const productDoc = await productService.updateProduct({
      productId: req.params.id,
      requestUser: req.user,
      req: req,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Product Updated Successfully!!",
      payload: { result: productDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const addProduct = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const productDoc = await productService.addProduct({
      requestUser: req.user,
      req: req,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Product Added Successfully!!",
      payload: { result: productDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const addProductQuantity = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const productDoc = await productService.addProductQuantity({
      requestUser: req.user,
      productId: req.params.id,
      quantity: req.body.quantity,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Product Quantity Added Successfully!!",
      payload: { result: productDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const removeProductQuantity = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const productDoc = await productService.removeProductQuantity({
      requestUser: req.user,
      productId: req.params.id,
      quantity: req.body.quantity,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Product Quantity Removed Successfully!!",
      payload: { result: productDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const deleteProduct = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const productDoc = await productService.deleteProduct({
      productId: req.params.id,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Product Deleted Successfully!!",
      payload: { result: productDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const deleteProductImage = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const productDoc = await productService.deleteProductImage({
      src: req.body.src,
      productId: req.params.id,
      requestUser: req.user,
      req: req,
    });

    const data4responseObject = {
      req: req,
      code: httpStatus.OK,
      message: "Product Image Deleted Successfully!!",
      payload: { result: productDoc },
      logPayload: false,
    };

    res.status(httpStatus.OK).send(createResponseObject(data4responseObject));
  }
);

const downloadExcel = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Fetch products from the database
      const products = await Product.find();

      // Create a new Excel workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Products");

      // Define the columns for the worksheet based on the typeProduct fields
      worksheet.columns = [
        { header: "Product Code", key: "product_code", width: 20 },
        { header: "Product Name", key: "product_name", width: 30 },
        { header: "Description", key: "description", width: 30 },
        { header: "Brand ID", key: "brand_id", width: 20 },
        { header: "Category ID", key: "category_id", width: 20 },
        { header: "In Stock", key: "in_stock", width: 10 },
        { header: "Is Active", key: "is_active", width: 10 },
        { header: "Is Verified", key: "is_verified", width: 10 },
        { header: "GST Percent", key: "gst_percent", width: 10 },
        { header: "Price", key: "price", width: 15 },
        { header: "Quantity", key: "quantity", width: 15 },
        { header: "Added By", key: "added_by", width: 30 },
        { header: "Updated By", key: "updated_by", width: 30 },
        { header: "Created At", key: "createdAt", width: 25 },
        { header: "Updated At", key: "updatedAt", width: 25 },
      ];

      // Add rows to the worksheet
      products.forEach((product) => {
        worksheet.addRow({
          product_code: product.product_code,
          product_name: product.product_name.map((name) => name.value).join(", "),
          description: product.description.map((desc) => desc.value).join(", "),
          brand_id: product.brand_id.toString(),
          category_id: product.category_id.toString(),
          in_stock: product.in_stock,
          is_active: product.is_active,
          is_verified: product.is_verified,
          gst_percent: product.gst_percent,
          price: product.price,
          quantity: product.quantity,
          added_by: product.added_by?.toString() || '',
          updated_by: product.updated_by?.toString() || '',
          createdAt: product.createdAt?.toISOString(),
          updatedAt: product.updatedAt?.toISOString(),
        });
      });

      // Set the response headers and content type for the Excel file
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", "attachment; filename=products.xlsx");

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

export const productController = {
  getProduct,
  addProduct,
  getProductList,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  addProductQuantity,
  removeProductQuantity,
  getCustomerProductList,
  downloadExcel,
};
