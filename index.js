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

app.listen(Number(process.env.PORT), () =>
  console.log(`Server up and running at port ${process.env.PORT}`)
);
