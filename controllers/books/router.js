"use strict";

const database = require("../../database");
const express = require("express");
const mysql = require("mysql");

const router = express.Router();

router.get("/", (req, res) => {
  database.query("SELECT * FROM books", (error, results, fields) => {
    if (error) throw error;
    res.send(results).status(200);
  });
});

router.post("/", (req, res) => {
  //   const data = JSON.stringify(req.body);
  let { title, authors, thumbnail, ddc, favorite } = req.body;
  let date = new Date();
  let sql =
    "INSERT INTO books(title, authors, thumbnail, ddc, favorite, date_added) VALUES (?, ?, ?, ?, ?, NOW())";
  let values = [title, authors, thumbnail, ddc, favorite];
  database.query(sql, values, (error, results, fields) => {
    if (error) throw error;
    res.send(results).status(201);
  });
});

router.delete("/:id", (req, res) => {
    let sql = "DELETE FROM books WHERE id = ?";
    let id = req.params.id;
    database.query(sql, id, (error, results, fields) => {
        if (error) throw error;
        res.send(results).status(201);
    });
});

module.exports = router;
