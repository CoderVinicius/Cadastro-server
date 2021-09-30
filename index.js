const mongoose = require('mongoose');
require("dotenv").config();
const express = require("express");

const connectToDb = require("./src/database/db.config");
const userRouter = require("./src/routes/user.routes")
const cors = require("cors");


const app = express();


app.use(express.json());

async function init() {
  try {
    const db = await connectToDb();

    console.log("Conectado ao banco de dados!");
    app.use(cors({ origin: process.env.REACT_APP_URL }));
    app.use("/", userRouter);


app.use("/", userRouter);

    app.listen(3000, () => console.log("Servidor rodando na porta 3000!"));
  } catch (err) {
    console.log("Erro ao conectar ao banco de dados!", err);
    process.exit(1);
  }
}
init();