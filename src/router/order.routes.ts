import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { orderController } from "../controllers/orders.controller.js";
import CHECKPERMISSION from "../middleware/checkpermission.middleware.js";
import { orderMiddlewareSchemas } from "../validations/order.validation.js";
import { validateViaJoi } from "../validations/joi.validation.js";

const router = express.Router();

router.get(
  "/download-excel",
  authenticateToken,
  CHECKPERMISSION([{ module: "order", permission: "can_download" }]),
  orderController.downloadExcel
);

router.post(
  "/return/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "order", permission: "can_update" }]),
  async (req, res, next) => {
    let validationData = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(
      orderMiddlewareSchemas.returnOrder,
      validationData,
      req,
      res,
      next
    );
  },
  orderController.returnOrder
);

router.get(
  "/",
  authenticateToken,
  CHECKPERMISSION([{ module: "order", permission: "can_read" }]),
  orderController.getOrderList
);

router.get("/user/", authenticateToken, orderController.getCustomerOrderList);

router.get("/user/:id", authenticateToken, orderController.getOrder);

router.get(
  "/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "order", permission: "can_read" }]),
  orderController.getOrder
);

router.post(
  "/calculate_bill",
  authenticateToken,
  CHECKPERMISSION([{ module: "order", permission: "can_add" }]),
  async (req, res, next) => {
    let validationData = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(
      orderMiddlewareSchemas.addOrder,
      validationData,
      req,
      res,
      next
    );
  },
  orderController.calculateBill
);

router.post(
  "/",
  authenticateToken,
  CHECKPERMISSION([{ module: "order", permission: "can_add" }]),
  async (req, res, next) => {
    let validationData = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(
      orderMiddlewareSchemas.addOrder,
      validationData,
      req,
      res,
      next
    );
  },
  orderController.addOrder
);

router.put(
  "/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "order", permission: "can_update" }]),
  async (req, res, next) => {
    let validationData = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(
      orderMiddlewareSchemas.updateOrder,
      validationData,
      req,
      res,
      next
    );
  },
  orderController.updateOrder
);

// router.delete(
//   "/:id",
//   authenticateToken,
//   CHECKPERMISSION([{ module: "order", permission: "can_delete" }]),
//   orderController.deleteOrder
// );

const ordersRoutes = router;
export default ordersRoutes;
