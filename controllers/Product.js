const Product = require("../models/Product");

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
