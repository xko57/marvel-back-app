const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

app.use(express.json());
app.use(cors());

require("dotenv").config();

mongoose
  .connect(`${process.env.MONGODB_URI}/${process.env.MONGODB_NAME}`)
  .then(() => {
    console.log("Successful connection to database");
  });

//Routes declaration
const userRoutes = require("./routes/user");
const marvelApiRoutes = require("./routes/marvel-api");

//Routes injection
app.use(userRoutes);
app.use(marvelApiRoutes);

//Default Route
app.get("*", (req, res) => {
  res.json({ message: "Unkonw Route" });
});

app.listen(process.env.PORT, () => {
  console.log("Server has started");
});
