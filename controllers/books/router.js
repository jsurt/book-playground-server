"use strict";

const database = require("../../database");
const express = require("express");

const router = express.Router();

const {
  getBooks,
  addBook,
  updateIsReadField,
  updateIsFavoriteField,
  deleteBook
} = require("../../middleware/queries/books");

router.get("/:user_id", getBooks, (req, res) => {
  res.status(200).send("User's books have been retrieved");
});

router.post("/", addBook, (req, res) => {
  res.status(201).send("Book added to user's library");
});

router.put("/is_read/:id", updateIsReadField, (req, res) => {
  res.status(204).send('"is_read" field has been updated');
});

router.put("/is_favorite/:id", updateIsFavoriteField, (req, res) => {
  res.status(204).send('"is_favorite" field has been updated');
});

router.delete("/:id", deleteBook, (req, res) => {
  res.status(204).send("Book has been removed from user's library");
});

module.exports = router;
