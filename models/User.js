const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    mobile: {
      type: Number,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return value.length >= 5;
        },
        message: "Password must be at least 5 characters long",
      },
    },
    cart: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
