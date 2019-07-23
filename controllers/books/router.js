"use strict";

const database = require("../../database");
const express = require("express");
const mysql = require("mysql");

const router = express.Router();

router.get("/", (req, res) => {
  database.query("SELECT * FROM books", (error, results, fields) => {
    if (error) {
      return res.status(400).send("Internal server error");
    }
    res.send(results).status(200);
  });
});

router.post("/", (req, res) => {
  let requiredFields = ["title", "authors", "thumbnail", "is_favorite"];
  requiredFields.forEach(field => {
    if (!(field in req.body)) {
      throw "Required field is missing";
    }
  });
  try {
    let { title, authors, thumbnail, ddc, is_favorite } = req.body;
    let sql =
      "INSERT INTO books(title, authors, thumbnail, ddc, is_favorite, date_added) VALUES (?, ?, ?, ?, ?, NOW())";
    let values = [title, authors, thumbnail, ddc, is_favorite];
    database.query(sql, values, (error, results, fields) => {
      if (error) {
        return res.status(500).send("Server error");
      }
      res.status(201).send(results);
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.put("/:id", (req, res) => {
  let updateableField = "is_favorite";
  console.log(req.body);
  if (!(updateableField in req.body)) {
    throw "'is_favorite' not found in request body";
  }
  try {
    let id = req.params.id;
    let { is_favorite } = req.body;
    let sql = "UPDATE books SET is_favorite = ? WHERE id = ?";
    let values = [is_favorite, id];
    database.query(sql, values, (error, results, fields) => {
      if (error) {
        return res.status(500).send("Internal server error");
      }
      res.status(200).send("Item successfully update");
    });
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.delete("/:id", (req, res) => {
  let sql = "DELETE FROM books WHERE id = ?";
  let id = req.params.id;
  database.query(sql, id, (error, results, fields) => {
    if (error) throw error;
    res.send(results).status(200);
  });
});

module.exports = router;
