const mongoose = require("mongoose");

function connectToDB() {
  return mongoose.connect("mongodb://localhost:27017/register", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
}

module.exports = connectToDB;
