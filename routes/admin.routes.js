const User = require("../models/user.model");
const Book = require("../models/book.model");
const bookRoutes = require("./book.routes");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const {
  loginValidator,
  registerValidator,
  userValidation,
} = require("../middleware/validation/user");
const { isAuth, isAdmin } = require("../middleware/auth");
const { find } = require("../models/user.model");

router.use("/books", bookRoutes);

router.get("/", isAuth, isAdmin, async (req, res) => {
  const items = await Book.find();
  res.render("admin", { items: items });
});

router.get("/add", isAuth, isAdmin, (req, res) => {
  res.render("ajout");
});
router.post("/login", loginValidator, userValidation, async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.error);
    if (!req.error) {
      const user = await User.findOne({ email });
      if (user.isAdmin == false) throw new Error("You are not an admin");
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

      res.redirect("/admin");
    } else {
      console.log(req.error);
      res.status(404);
    }
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
});
router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", registerValidator, userValidation, (req, res) => {
  // console.log(req.body);
  try {
    if (!req.error) {
      const { name, email, password } = req.body;
      const user = new User({
        name,
        email,
        password,
        isAdmin: true,
      });
      user.save();
      res.redirect("/admin/login");
    } else {
      console.log(req.error);
      res.status(404);
    }
  } catch (err) {
    console.log(err);
    res.send({ success: false, message: "Unauthorized access" });
  }
});

router.get("/book/edit/:id", isAuth, isAdmin, async (req, res) => {
  const id = req.params.id;
  const item = await Book.findById(id);
  console.log(item);
  res.render("edit", { item: item });
});

// router.post("/book/edit/:id", isAuth, isAdmin, async (req, res) => {
//   const id = req.params.id;
//   const item = await Book.findById(id);
//   const { title, author, description, price, year, languages } = req.body;

//   await Book.findByIdAndUpdate(id, {
//     title,
//     author,
//     description,
//     price,
//     year,
//     languages,
//   });
//   res.redirect("/admin");
// });

router.get("/book/delete/:id", isAuth, isAdmin, async (req, res) => {
  console.log("first");
  const id = req.params.id;
  await Book.findByIdAndDelete(id);
  res.redirect("/admin");
});

module.exports = router;
