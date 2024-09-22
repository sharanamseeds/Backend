import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { userController } from "../controllers/users.controller.js";
import CHECKPERMISSION from "../middleware/checkpermission.middleware.js";
import { validateViaJoi } from "../validations/joi.validation.js";
import { userMiddlewareSchemas } from "../validations/users.validation.js";

const router = express.Router();

router.get("/user/:id", authenticateToken, userController.getUser);

router.put(
  "/user/:id",
  authenticateToken,
  async (req, res, next) => {
    let validationData = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      validationData = JSON.parse(req.query.payload);
    }
    validateViaJoi(
      userMiddlewareSchemas.updateUserSchema,
      validationData,
      req,
      res,
      next
    );
  },
  userController.updateUser
);

router.get(
  "/get_account_details",
  authenticateToken,
  userController.getAccountDetails
);

router.get(
  "/download-excel",
  authenticateToken,
  CHECKPERMISSION([{ module: "user", permission: "can_download" }]),
  userController.downloadExcel
);

/* Get all users */
router.get(
  "/",
  authenticateToken,
  CHECKPERMISSION([{ module: "user", permission: "can_read" }]),
  userController.getUserList
);

/* Get a specific user by ID */
router.get(
  "/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "user", permission: "can_read" }]),
  userController.getUser
);

/* Create a new user */
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
      userMiddlewareSchemas.addUserSchema,
      validationData,
      req,
      res,
      next
    );
  },
  userController.addUser
);

/* Update an existing user */
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
      userMiddlewareSchemas.updateUserSchema,
      validationData,
      req,
      res,
      next
    );
  },
  userController.updateUser
);

/* Delete a user */
router.delete(
  "/:id",
  authenticateToken,
  CHECKPERMISSION([{ module: "user", permission: "can_delete" }]),
  userController.deleteUser
);

const usersRoutes = router;
export default usersRoutes;
