require("dotenv");
const express = require("express");
const https = require("https");

const router = express.Router();

const { ISBNdb_API_KEY } = process.env;

//ISBN's
let isbn_db_1 = "1591413281";
let isbn_db_2 = "9780553539714"; // Amulet kids book
let isbn_db_3 = "9780141988511"; // 12 Rules (ISBN 1)
let isbn_db_4 = "9780345816023"; // 12 Rules (ISBN 2)
let isbn_db_5 = "9780618391134"; // LoTR
let isbn_db_6 = "0143038095"; // ISBN from StackOverflow answer
let isbn_db_7 = "9780416720600"; // Semiotics of Theater
let isbn_db_8 = "9780140440584"; // Ovid Metamorphoses
let isbn_db_9 = "9781118531648"; // Jon Duckett Javascript book
let isbn_db_10 = "9780590353427"; // Harry Potter

const ISBNdbReq = (req, res, next) => {
  const options = {
    method: "GET",
    host: "api2.isbndb.com",
    path: `/book/${isbn_db_6}&results=details`,
    headers: {
      "Content-Type": "application/json",
      Authorization: ISBNdb_API_KEY
    }
  };
  https
    .request(options, response => {
      let initialData = "";
      response.on("data", data => {
        console.log(data);
        initialData += data;
      });
      response.on("end", () => {
        res.locals.body = initialData;
        console.log(res.locals.body);
        next();
      });
    })
    .end();
};

const headers = {
  "Content-Type": "application/json",
  Authorization: ISBNdb_API_KEY
};

const ISBNdb_ENDPOINT_BOOKS = `https://api2.isbndb.com/book/${isbn_db_9}&results=details`;
// const ISBNdb_ENDPOINT_SEARCH = `https://api2.isbndb.com/search/books?isbn13=${
//   req.params.isbn
// }&results=details`;

// Quick test fetch
const quickISBNdbReq = (req, res, next) => {
  console.log(req.path);
  let ISBNdb_ENDPOINT_SEARCH = `https://api2.isbndb.com/search/books?isbn13=${
    req.params.isbn
  }`;
  fetch(ISBNdb_ENDPOINT_SEARCH, { headers })
    .then(data => data.json())
    .then(json => {
      console.log(json);
      res.locals.body = json;
      next();
    })
    .catch(err => console.error(err));
};

router.get("/", (req, res) => {
    res.send("ISBNdb request").status(200);
})

module.exports = { router };