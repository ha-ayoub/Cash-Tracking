const express = require("express");
const app = express();
const connectDB = require("./config/db");
const userRoutes = require("./routes/user.route");
const transactionRoutes = require("./routes/transaction.route");
const categoryRoutes = require("./routes/category.route");
const cardRoutes = require("./routes/card.route");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/category", categoryRoutes);

connectDB();

app.listen(process.env.PORT, () => {
  console.log("Server is listening");
});
