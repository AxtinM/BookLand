const router = require("express").Router();
const Book = require("../models/book.model");
const fs = require("fs");
const multer = require("multer");
const { isAuth, isAdmin } = require("../middleware/auth");
const { redirect } = require("express/lib/response");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/home/micky/Documents/BookShop/public/uploads/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + ".jpg");
  },
});

const upload = multer({ storage: storage });

router.post(
  "/add",
  isAuth,
  isAdmin,
  upload.single("image"),
  async (req, res) => {
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      description: req.body.description,
      image: {
        data: fs.readFileSync(
          "/home/micky/Documents/BookShop/public/uploads/images/" +
            req.file.filename
        ),
        contentType: "image/png",
      },
      pages: req.body.pages,
      year: req.body.year,
      language: req.body.language,
    });
    try {
      await book.save();
      res.redirect("/admin/add");
    } catch (err) {
      res.send({ message: err });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.render("index", { items: books });
  } catch (err) {
    res.json({ message: err });
  }
});

router.get("/:id", isAuth, isAdmin, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.render("bookdetails", { item: book });
  } catch (err) {
    res.json({ message: err });
  }
});

router.get("/panier/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.render("panier", { item: book });
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/edit/:id", isAuth, isAdmin, async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.params.id);
    const book = await Book.findOneAndUpdate(
      { id: req.params.id },
      {
        title: req.body.title,
        price: req.body.price,
        author: req.body.author,
        description: req.body.description,
        pages: req.body.pages,
        rating: req.body.rating,
        year: req.body.year,
        language: req.body.language,
      }
    );
    res.redirect("/admin");
  } catch (err) {
    res.json({ message: err });
    console.log(err);
  }
});

router.get("/delete/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    res.redirect("/panier");
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
