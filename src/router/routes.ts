import express from "express";
import languagesRoutes from "./language.routes.js";
import rolesRoutes from "./role.routes.js";
import authRoutes from "./auth.routes.js";
import brandsRoutes from "./brand.routes.js";
import categoriesRoutes from "./category.routes.js";
import offersRoutes from "./offer.routes.js";
import ordersRoutes from "./order.routes.js";
import productsRoutes from "./product.routes.js";
import usersRoutes from "./user.routes.js";
import moduleRoutes from "./module.routes.js";
import documentRoutes from "./documents.routes.js";
import permissionsRoutes from "./permission.routes.js";
import billsRoutes from "./bill.routes.js";
import ledgersRoutes from "./ledger.routes.js";
import companyRoutes from "./company.routes.js";
import cartsRoutes from "./cart.routes.js";
import favouritesRoutes from "./favourite.routes.js";
import wishsRoutes from "./wish.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import moneyRoutes from "./money.routes.js";
import appBannerRoutes from "./app_banner.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/languages", languagesRoutes);
router.use("/roles", rolesRoutes);
router.use("/brands", brandsRoutes);
router.use("/categories", categoriesRoutes);
router.use("/offers", offersRoutes);
router.use("/orders", ordersRoutes);
router.use("/products", productsRoutes);
router.use("/users", usersRoutes);
router.use("/modules", moduleRoutes);
router.use("/documents", documentRoutes);
router.use("/bills", billsRoutes);
router.use("/ledgers", ledgersRoutes);
router.use("/company", companyRoutes);
router.use("/permissions", permissionsRoutes);
router.use("/cart", cartsRoutes);
router.use("/favourite", favouritesRoutes);
router.use("/wish", wishsRoutes);
router.use("/money", moneyRoutes);
router.use("/banners", appBannerRoutes);

export default router;
