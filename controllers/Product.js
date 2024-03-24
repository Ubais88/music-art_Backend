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


exports.order = async (req, res) => {
  try {
    const { name, address, orderFromCart, productId } = req.body;
    const userId = req.user.id;

    if (!name || !address) {
      return res.status(400).json({ status: "FAILED", message: "Empty Field" });
    }

    let products;
    if (!orderFromCart) {
      products = [{ productId, quantity: 1 }]; // Assuming quantity is always 1 for direct orders
    } else {
      const user = await User.findById(userId).populate("cart.product");
      products = user.cart.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
      }));
    }

    const order = new Order({
      userId,
      name,
      address,
      products,
    });

    await order.save();

    if (orderFromCart) {
      // Clear user's cart if the order is from cart
      const user = await User.findByIdAndUpdate(userId, { cart: [] });
    }

    res.status(200).json({ status: "SUCCESS", message: "Order Successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
