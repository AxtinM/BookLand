const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const bookSchema = new Schema({
  title: {
    required: true,
    maxlength: 30,
    type: String,
  },
  price: {
    required: true,
    type: Number,
  },
  author: {
    type: String,
  },
  description: {
    type: String,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  pages: {
    type: Number,
  },
  rating: {
    type: Number,
  },
  year: {
    type: String,
  },
  language: {
    type: String,
  },
});

const Book = model("Book", bookSchema);
module.exports = Book;
