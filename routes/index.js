const router = require("express").Router();
const authRoutes = require("./auth.routes");
const bookRoutes = require("./book.routes");
const adminRoutes = require("./admin.routes.js");
const panierRoutes = require("./panier.routes");

router.use("/auth", authRoutes);
router.use("/books", bookRoutes);
router.use("/admin", adminRoutes);
router.use("/panier", panierRoutes);

module.exports = router;
