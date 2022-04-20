const express = require("express");
const { redirect } = require("express/lib/response");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/user.model");
const {
  loginValidator,
  registerValidator,
  userValidation,
} = require("../middleware/validation/user");

router.post("/login", loginValidator, userValidation, async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.error);
    if (!req.error) {
      const user = await User.findOne({ email });

      if (!(await user.comparePasswords(password))) {
        throw new Error("password and/or email must be correct");
      }

      let oldTokens = user.tokens || [];
      if (oldTokens.length) {
        oldTokens = oldTokens.filter((token) => {
          const timeDiff = Date.now() - parseInt(token.signedAt) / 1000;
          if (timeDiff < 86400) return true;
        });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      await User.findByIdAndUpdate(user._id, {
        tokens: [
          ...oldTokens,
          { token: token, signedAt: Date.now().toString() },
        ],
      });

      if (typeof localStorage === "undefined" || localStorage === null) {
        var LocalStorage = require("node-localstorage").LocalStorage;
        localStorage = new LocalStorage("../scratch");
      }

      localStorage.setItem("token", token);
      console.log(localStorage.getItem("token"));

      res.redirect("/home");
    } else {
      console.log(req.error);
      res.status(404);
    }
  } catch (err) {
    console.log(err);
    res.status(404);
  }
});

// get request (url entrer)
router.get("/", (req, res) => {
  res.render("../views/reg_log");
});

// post request
router.post("/register", registerValidator, userValidation, (req, res) => {
  // console.log(req.body);
  try {
    if (!req.error) {
      const { name, email, password } = req.body;
      const user = new User({
        name,
        email,
        password,
      });
      user.save();
      res.redirect("/auth");
    } else {
      console.log(req.error);
      res.status(404);
    }
  } catch (err) {
    console.log(err);
    res.status(404);
  }
});

module.exports = router;
