const router = require("express").Router();
const bcrypt = require("bcryptjs");

const userModel = require("../models/User.model");
const generateToken = require("../database/jwt");
const isAuthenticated = require("../middlewares/isAuthenticated");

const attachCurrentUser = require("../middlewares/attachCurrentUser.js");

const salt_rounds = 10;
router.post("/signup", async (req, res) => {
  console.log(req.body);

  try {
    const { password } = req.body;

    if (
      !password ||
      !password.match(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
      )
    ) {
      return res.status(400).json({
        msg: "Password is required and must have at least 8 characters, uppercase and lowercase letters, numbers and special characters.",
      });
    }

    const salt = await bcrypt.genSalt(salt_rounds);

    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await userModel.create({
      ...req.body,
      passwordHash: hashedPassword,
    });

    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, document, pis, password } = req.body;

    const user = await userModel.findOne({
      $or: [{ email }, { document }, { pis }],
    });

    console.log(user, "resposta");

    if (!user) {
      return res.status(400).json({ msg: "O usuario nao foi encontrado;" });
    }

    if (await bcrypt.compare(password, user.passwordHash)) {
      const token = generateToken(user);

      return res.status(200).json({
        user: {
          name: user.name,
          email: user.email,
          _id: user._id,
          document: user.document,
          pis: user.pis,
        },
        token,
      });
    } else {
      return res.status(401).json({ msg: "Wrong password or email" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

router.get(
  "/profile",
  isAuthenticated,
  attachCurrentUser,
  async (req, res, next) => {
    try {
      console.log(req.user);

      return res.status(200).json(req.currentUser);
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  "/editUser/:id",
  isAuthenticated,
  attachCurrentUser,
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const updatedUser = await userModel.findOneAndUpdate(
        { _id: id },
        { $set: { ...req.body } },
        { new: true }
      );

      return res.status(200).json(updatedUser);
    } catch (err) {
      return res.status(400).json(err);
    }
  }
);

router.delete(
  "/deleteUser/:id",
  isAuthenticated,
  attachCurrentUser,
  async (req, res, next) => {
    try {
      const { id } = req.params;

      await userModel.findOneAndDelete({ _id: id });

      return res.status(200).json("Usuário deletado!");
    } catch (err) {
      return res.status(400).json(err);
    }
  }
);

module.exports = router;
