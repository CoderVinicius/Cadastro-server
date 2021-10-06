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

    app.listen(process.env.PORT || 4000, function () {
      console.log(
        "Express server listening on port %d in %s mode",
        this.address().port,
        app.settings.env
      );
    });
  } catch (err) {
    console.log("Erro ao conectar ao banco de dados!", err);
    process.exit(1);
  }
}
init();
