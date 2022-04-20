const router = require("express").Router();
const User = require("../models/user.model");
const Book = require("../models/book.model");
const { isAuth, isAdmin } = require("../middleware/auth");
const { redirect } = require("express/lib/response");
const { default: mongoose } = require("mongoose");

router.get("/", isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("panier");
    let sum = 0;
    for (const book of user.panier) {
      sum += book.price;
    }
    console.log(sum);
    res.render("cart.ejs", {
      books: user.panier,
      totalPrice: sum,
      totalElements: user.panier.length,
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/checkout", isAuth, async (req, res) => {
  try {
    res.render("checkoutform");
  } catch (err) {
    console.log(err);
  }
});

router.get("/clear", isAuth, async (req, res) => {
  try {
    const user = req.user;
    user.panier = [];
    user.save();
    console.log("clear");
    res.redirect("/panier");
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.render("panier", { item: book });
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/add", isAuth, async (req, res) => {
  try {
    // console.log("first");
    const user = req.user;
    const id = req.body.id;
    const book = await Book.findById(id);
    const isIn = false;
    for (elem of user.panier) {
      if (elem.equals(id)) {
        isIn = true;
        break;
      }
    }
    if (!isIn) {
      user.panier.push(book);
      user.save();
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/delete/:id", isAuth, isAdmin, async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    res.redirect("/panier");
  } catch (err) {
    res.json({ message: err });
  }
});

// router.get("")

module.exports = router;
