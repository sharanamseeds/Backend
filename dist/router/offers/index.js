import express from "express";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import { offerController } from "../../controllers/offers.controller.js";
import { offerMiddleware } from "../../validations/offers.middleware.js";
import { validateSchema } from "../../validations/index.js";
import CHECKPERMISSION from "../../middleware/checkpermission.middleware.js";
const router = express.Router();
router.get("/", authenticateToken, CHECKPERMISSION([{ module: "offer", permission: "can_read" }]), offerController.getOfferList);
router.get("/user/", authenticateToken, CHECKPERMISSION([{ module: "offer", permission: "can_read" }]), offerController.getCustomerOfferList);
router.get("/:id", authenticateToken, CHECKPERMISSION([{ module: "offer", permission: "can_read" }]), offerController.getOffer);
router.post("/", authenticateToken, CHECKPERMISSION([{ module: "offer", permission: "can_add" }]), validateSchema(offerMiddleware.addOffer, "body"), offerController.addOffer);
router.put("/:id", authenticateToken, CHECKPERMISSION([{ module: "offer", permission: "can_update" }]), validateSchema(offerMiddleware.updateOffer, "body"), offerController.updateOffer);
router.delete("/:id", authenticateToken, CHECKPERMISSION([{ module: "offer", permission: "can_delete" }]), offerController.deleteOffer);
const offersRoutes = router;
export default offersRoutes;
//# sourceMappingURL=index.js.map