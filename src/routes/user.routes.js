const router = require("express").Router();

const UserService = require("../services/user.service");
const userModel = require("../models/User.model")

const isAuthenticated = require("../middlewares/isAuthenticated");

const attachCurrentUser = require("../middlewares/attachCurrentUser.js");


router.post("/signup", async (req, res, next) => {
  try {
 

    const userService = new UserService(req.body);

    const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/g;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/gm ;

    if (!userService.isValid(userService.email, emailRegex)) {
      return res.status(400).json({
        error: "O campo email é obrigatório e deve ser um email válido",
      });
    }

    if (!userService.isValid(userService.password, passwordRegex)) {
      return res.status(400).json({
        error:
          "O campo senha é obrigatório e precisa ter no mínimo 8 caracteres incluindo: letras maiúsculas e minúsculas, números, caracteres especiais.",
      });
    }

    if (await userService.userExists(userService.email)) {
      return res.status(400).json({
        error: "Este e-mail já está cadastrado!",
      });
    }

    const insertResult = await userService.createUser();

    return res.status(201).json(insertResult);
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const userService = new UserService(req.body);

    if (!userService.password)
      return res.status(401).json({ error: "Acesso negado." });

    const loginResult = await userService.login();

    if (loginResult) {
      return res.status(200).json(loginResult);
    }
  } catch (err) {
    next(err);
  }
});

router.get("/profile", isAuthenticated, attachCurrentUser, async (req, res, next) => {
  try {
    console.log(req.user);

    return res.status(200).json(req.currentUser);
  } catch (err) {
    next(err);
  }
});


router.put("/editUser/:id", isAuthenticated, attachCurrentUser, async (req, res, next) => {
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

router.delete("/deleteUser/:id", isAuthenticated, attachCurrentUser, async (req, res, next) => {
    try {
      const { id } = req.params;

      await userModel.findOneAndDelete({ _id: id });

      return res.status(200).json('Usuário deletado!');
    } catch (err) {
      return res.status(400).json(err);
    }
  }
);


module.exports = router;