const express = require("express");
const router = express.Router();


// Import the required controllers and middleware functions
const { getAllproducts, getProduct, addToCart } = require("../controllers/Product");


// Route for user createQuiz
router.post("/allproducts", getAllproducts);
router.get("/details/:productId", getProduct);
router.post('/addtocart' , addToCart);


// Export the router for use in the main application
module.exports = router;