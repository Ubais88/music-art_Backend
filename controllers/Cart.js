const Product = require("../models/Product");
const User = require("../models/User");

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
      (item) => item.product.toString() === productId
    );

    if (productIndex !== -1) {
      if (user.cart[productIndex].quantity < 8) {
        user.cart[productIndex].quantity += 1;
      } else {
        return res.status(400).json({
          success: false,
          message: "maximum allowed quantity reached",
        });
      }
    } else {
      user.cart.push({ product: productId, quantity: 1 });
    }

    await user.save();

    res.status(200).json({
      success: true,
      cart: user.cart,
      message: "Product added to cart successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "something went wrong during fetching product",
    });
  }
};

exports.updateCartItemQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity <= 0 || quantity > 8) {
      return res.status(404).json({
        success: false,
        message:
          "Invalid productId or quantity. Quantity should be between 1 and 8.",
      });
    }

    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find the index of the product in the user's cart
    const productIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex !== -1) {
      user.cart[productIndex].quantity = quantity;
      await user.save();

      return res.status(200).json({
        success: true,
        user,
        message: "Quantity updated successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "something went wrong during fetching product",
    });
  }
};

exports.getUserCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate('cart.product');
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Calculate the total amount
    let totalAmount = 0;
    user.cart.forEach((item) => {
      totalAmount += item.product.price * item.quantity;
    });

    res.status(200).json({
      success: true,
      cart: user.cart,
      totalAmount,
      withConveniencefee:totalAmount+45,
      message: "Cart product fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
