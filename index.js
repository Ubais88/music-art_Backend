const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

app.use(express.json());

const database = require("./config/database");
const userRoutes = require("./routes/User");
const productRoutes = require("./routes/Product");

const PORT = process.env.PORT || 4000;
database.dbconnect();

// routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/product", productRoutes);

app.listen(PORT, () => {
  console.log("App listening on port", PORT);
});
app.get("/", (req, res) => {
  res.send(`<h1>Music Art Is Working Fine</h1>`);
});
