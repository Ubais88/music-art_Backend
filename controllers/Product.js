const Product = require("../models/Product");
const User = require("../models/User");

exports.getAllproducts = async (req, res) => {
  try {
    // fields to include  documents
    const fieldsToInclude = {
      brand: 1,
      model: 1,
      shortDescription: 1,
      price: 1,
      color: 1,
      headphoneType: 1,
      images: 1,
    };

    // Fetch products with only specified fields
    const products = await Product.find({}).select(fieldsToInclude);

    return res.status(200).json({
      success: true,
      products,
      message: `All Products are Fetched successfully`,
    });
  } catch (error) {
    console.error("Error fetching Products:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Error fetching Products",
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const productdetails = await Product.findById(productId);

    if (!productdetails) {
      return res.status(400).json({
        success: false,
        message: "product is missing or productId is wrong",
      });
    }

    res.status(200).json({
      success: true,
      productdetails,
      message: "product fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "something went wrong during fetching product",
    });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
     
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const productIndex = user.cart.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex !== -1) {
      if (user.cart[productIndex].quantity < 8) {
        user.cart[productIndex].quantity += 1;
      }
    } else {
      user.cart.push({ productId: productId, quantity: 1 });
    }

    await user.save();

    res.status(200).json({
      success: true,
      user,
      message: "Product added to cart successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
