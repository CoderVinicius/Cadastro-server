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
  
    app.listen(4000, () => console.log("Servidor rodando na porta 4000!"));
  } catch (err) {
    console.log("Erro ao conectar ao banco de dados!", err);
    process.exit(1);
  }
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    app.use(cors());
    app.use("/", userRouter);
  });

  
}
init();