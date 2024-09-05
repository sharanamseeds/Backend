import express from "express";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import { userController } from "../../controllers/users.controller.js";
import { userMiddleware } from "../../validations/users.middleware.js";
import { validateSchema } from "../../validations/index.js";
import CHECKPERMISSION from "../../middleware/checkpermission.middleware.js";
const router = express.Router();
/* Get all users */
router.get("/", authenticateToken, CHECKPERMISSION([{ module: "user", permission: "can_read" }]), userController.getUserList);
/* Get a specific user by ID */
router.get("/:id", authenticateToken, CHECKPERMISSION([{ module: "user", permission: "can_read" }]), userController.getUser);
/* Create a new user */
router.post("/", authenticateToken, CHECKPERMISSION([{ module: "user", permission: "can_add" }]), validateSchema(userMiddleware.addUser, "body"), userController.addUser);
/* Update an existing user */
router.put("/:id", authenticateToken, CHECKPERMISSION([{ module: "user", permission: "can_update" }]), validateSchema(userMiddleware.updateUser, "body"), userController.updateUser);
/* Delete a user */
router.delete("/:id", authenticateToken, CHECKPERMISSION([{ module: "user", permission: "can_delete" }]), userController.deleteUser);
const usersRoutes = router;
export default usersRoutes;
//# sourceMappingURL=index.js.map