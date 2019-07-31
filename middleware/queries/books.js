"use strict";

const database = require("../../database");

const getBooks = (req, res, next) => {
  let sql = "SELECT * FROM books WHERE user_id = ?";
  let id = req.params.user_id;
  database.query(sql, id, (error, results, fields) => {
    if (error) {
      const error = new Error(error);
      next(error);
    }
    res.locals.books = results;
    next();
  });
};

const addBook = (req, res, next) => {
  let requiredFields = [
    "title",
    "authors",
    "thumbnail",
    "is_favorite",
    "user_id"
  ];
  requiredFields.forEach(field => {
    if (!(field in req.body)) {
      const error = new Error(`"${field}" field missing in request body`);
      next(error);
    }
  });
  let { title, authors, thumbnail, ddc, is_favorite, user_id } = req.body;
  let sql =
    "INSERT INTO books(title, authors, thumbnail, ddc, is_favorite, user_id, date_added) VALUES (?, ?, ?, ?, ?, ?, NOW())";
  let values = [title, authors, thumbnail, ddc, is_favorite, user_id];
  database.query(sql, values, (error, results, fields) => {
    if (error) {
      const error = new Error(error);
      next(error);
    }
    console.log(results);
    next();
  });
};

const updateIsReadField = (req, res, next) => {
  if (!("is_read" in req.body)) {
    const error = new Error("Only update to 'is_read' field is accepted");
    next(error);
  }
  let id = req.params.id;
  let { is_read } = req.body;
  let sql = "UPDATE books SET is_read = ? WHERE id = ?";
  let values = [is_read, id];
  database.query(sql, values, (error, results, fields) => {
    if (error) {
      console.error(error);
      const err = new Error(error);
      next(err);
    }
    console.log(results);
    next();
  });
};

const updateIsFavoriteField = (req, res, next) => {
  if (!("is_favorite" in req.body)) {
    const error = new Error("Only update to 'is_favorite' field is accepted");
    next(error);
  }
  let id = req.params.id;
  let { is_favorite } = req.body;
  let sql = "UPDATE books SET is_favorite = ? WHERE id = ?";
  let values = [is_favorite, id];
  database.query(sql, values, (error, results, fields) => {
    if (error) {
      const erorr = new Error(error);
      next(error);
    }
    console.log(results);
    next();
  });
};

const deleteBook = (req, res, next) => {
  let sql = "DELETE FROM books WHERE id = ?";
  let id = req.params.id;
  database.query(sql, id, (error, results, fields) => {
    if (error) {
      const error = new Error(error);
      next(error);
    }
    console.log("Book has been removed from user's library");
    next();
  });
};

module.exports = {
  getBooks,
  addBook,
  updateIsReadField,
  updateIsFavoriteField,
  deleteBook
};
