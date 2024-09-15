import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import CHECKPERMISSION from "../middleware/checkpermission.middleware.js";
import { validateViaJoi } from "../validations/joi.validation.js";
import { moneyMiddlewareSchemas } from "../validations/money.validation.js";
import { moneyController } from "../controllers/money.controller.js";

const router = express.Router();

router.get(
  "/",
  authenticateToken,
  CHECKPERMISSION([{ module: "user", permission: "can_read" }]),
  moneyController.getMoneyList
);

router.get(
  "/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "user", permission: "can_read" }]),
  moneyController.getMoney
);

router.get("/user/", authenticateToken, moneyController.getMoneyList);

router.get("/user/:id", authenticateToken, moneyController.getMoney);

router.post(
  "/",
  authenticateToken,
  CHECKPERMISSION([{ module: "user", permission: "can_add" }]),
  async (req, res, next) => {
    let validationData = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(
      moneyMiddlewareSchemas.addMoney,
      validationData,
      req,
      res,
      next
    );
  },
  moneyController.addMoney
);

router.put(
  "/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "user", permission: "can_update" }]),
  async (req, res, next) => {
    let validationData = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(
      moneyMiddlewareSchemas.updateMoney,
      validationData,
      req,
      res,
      next
    );
  },
  moneyController.updateMoney
);

router.delete(
  "/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "user", permission: "can_delete" }]),
  moneyController.deleteMoney
);

const moneyRoutes = router;
export default moneyRoutes;
