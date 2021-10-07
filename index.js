require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./src/database/db.config")();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

const userRouter = require("./src/routes/user.routes");
app.use("/", userRouter);

app.listen(process.env.PORT || 4000, function () {
  console.log("listening on *:4000");
});
