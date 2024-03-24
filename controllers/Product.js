const Order = require("../models/Order");
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

exports.placeOrder = async (req, res) => {
  try {
    const { name, address, paymentMethod, orderFromCart, productId } = req.body;
    const userId = req.user.id;

    if (!name || !address || !paymentMethod) {
      return res.status(400).json({
        status: false,
        message: "Empty Field",
      });
    }

    const user = await User.findById(userId).populate("cart.product");

    if (orderFromCart && (!user.cart || user.cart.length === 0)) {
      return res.status(400).json({
        status: false,
        message: "Cart is empty. Add products to cart before placing an order.",
      });
    }

    let products;
    let totalAmount = 0;

    if (!orderFromCart) {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
      products = [{ productId: product._id, quantity: 1 }];
      totalAmount += product.price;
    } else {
      products = user.cart.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
      }));
      user.cart.forEach((item) => {
        totalAmount += item.product.price * item.quantity;
      });
    }

    const order = new Order({
      userId,
      name,
      address,
      paymentMethod,
      products,
      totalAmount: totalAmount.toFixed(2),
      grandTotal: totalAmount.toFixed(2) + 45,
    });
    await order.save();

    if (orderFromCart) {
      await User.findByIdAndUpdate(userId, { cart: [] });
    }

    res.status(200).json({
      status: true,
      order,
      message: "Order Successful",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


exports.getAllUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ userId }).populate('products.productId');

    res.status(200).json({
      success: true,
      orders,
      message: "User's orders fetched successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
