const express = require("express");
const router = express.Router();

// Import the required controllers and middleware functions
const { getAllproducts, getProduct, order } = require("../controllers/Product");
const { authMiddleware } = require("../middlewares/authMiddleware");

// Route for user createQuiz
router.post("/allproducts", getAllproducts);
router.get("/details/:productId", getProduct);
router.put("/order", authMiddleware, order);

// Export the router for use in the main application
module.exports = router;
