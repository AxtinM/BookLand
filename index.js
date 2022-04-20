require("dotenv").config();
const express = require("express");
const app = express();
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
var flash = require("connect-flash");
const router = require("./routes");
const { isAuth } = require("./middleware/auth");
const Book = require("./models/book.model");
app.use(cors());
// Database connection
require("./models/db");
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("keyboard cat"));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);
app.use(flash());

app.use(express.static(__dirname + "/public"));

// env variables :
const port = process.env.PORT || 3000;

// routing

app.use("/", router);

app.get("/home", isAuth, async (req, res) => {
  // res.locals.message = req.flash();
  try {
    if (typeof localStorage === "undefined" || localStorage === null) {
      var LocalStorage = require("node-localstorage").LocalStorage;
      localStorage = new LocalStorage("../scratch");
    }
    const token = localStorage.getItem("token");
    console.log("token : \n", token);

    const books = await Book.find();
    res.render("index", { items: books });
  } catch (err) {
    res.json({ message: err });
  }
});

app.get("/", async (req, res) => {
  res.redirect("/home");
});

// setting up app to listen on port 3000
app.listen(port, () => {
  console.log("listening on port " + port);
});
