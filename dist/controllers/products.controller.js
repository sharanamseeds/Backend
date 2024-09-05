var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { catchAsync, createResponseObject, } from "../helpers/request.helpers.js";
import httpStatus from "http-status";
import { productService } from "../services/products.service.js";
import ExcelJS from "exceljs";
import Product from "../models/products.model.js";
const getProduct = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productDoc = yield productService.getProduct({
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
}));
const getProductList = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productDoc = yield productService.getProductList({
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
}));
const getCustomerProductList = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productDoc = yield productService.getCustomerProductList({
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
}));
const updateProduct = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productDoc = yield productService.updateProduct({
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
}));
const addProduct = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productDoc = yield productService.addProduct({
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
}));
const addProductQuantity = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productDoc = yield productService.addProductQuantity({
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
}));
const removeProductQuantity = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productDoc = yield productService.removeProductQuantity({
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
}));
const deleteProduct = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productDoc = yield productService.deleteProduct({
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
}));
const deleteProductImage = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productDoc = yield productService.deleteProductImage({
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
}));
const downloadExcel = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch products from the database
        const products = yield Product.find();
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
            var _a, _b, _c, _d;
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
                added_by: ((_a = product.added_by) === null || _a === void 0 ? void 0 : _a.toString()) || '',
                updated_by: ((_b = product.updated_by) === null || _b === void 0 ? void 0 : _b.toString()) || '',
                createdAt: (_c = product.createdAt) === null || _c === void 0 ? void 0 : _c.toISOString(),
                updatedAt: (_d = product.updatedAt) === null || _d === void 0 ? void 0 : _d.toISOString(),
            });
        });
        // Set the response headers and content type for the Excel file
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=products.xlsx");
        // Write the Excel file to the response
        yield workbook.xlsx.write(res);
        // End the response
        res.end();
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}));
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
//# sourceMappingURL=products.controller.js.map