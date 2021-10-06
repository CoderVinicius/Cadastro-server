require("dotenv").config();
const express = require("express");

const connectToDb = require("./src/database/db.config");
const userRouter = require("./src/routes/user.routes");
const cors = require("cors");

const app = express();

app.use(express.json());

async function init() {
  try {
    const db = await connectToDb();
    console.log("Conectado ao banco de dados!");

    app.use(
      cors({
        origin: "*",
        methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
      })
    );
    app.use("/", userRouter);

    aapp.listen(Number(process.env.PORT), () =>
      console.log(`Server up and running at port ${process.env.PORT}`)
    );
  } catch (err) {
    console.log("Erro ao conectar ao banco de dados!", err);
    process.exit(1);
  }
}
init();
