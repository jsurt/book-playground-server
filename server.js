"use strict";

require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const fetch = require("node-fetch");
const https = require("https");
const morgan = require("morgan");
const mysql = require("mysql");
const parseString = require("xml2js").parseString;

app.use(cors());
app.use(morgan("combined"));

const { router: googleBooksRouter } = require("./google-books");

app.use("/google-books", googleBooksRouter);

// API keys
const { BARCODE_API_KEY, GOOGLE_API_KEY, ISBNdb_API_KEY } = process.env;       

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

//OCLC book numbers
const oclc_num_1 = "57358293"; // Some Harry Potter book
const oclc_num_2 = ""; //

const OCLC_ENDPOINT_OCLC_NUMBER = `http://classify.oclc.org/classify2/Classify?oclc=${oclc_num_1}&summary=true`;
// const OCLC_ENDPOINT_ISBN = `http://classify.oclc.org/classify2/Classify?isbn=${isbn_db_7}&summary=true`;
const OCLC_ENDPOINT_TITLE = `http://classify.oclc.org/classify2/Classify?author=Weinberger%2C%20David&title=${title}&summary=true`;

const oclcRequest = (req, res, next) => {
  console.log("Request to OCLC made");
  const OCLC_ENDPOINT_ISBN = `http://classify.oclc.org/classify2/Classify?isbn=${
    req.params.isbn
  }&summary=true`;
  fetch(OCLC_ENDPOINT_ISBN)
    .then(response => response.text())
    .then(xml => {
      console.log(xml, "XML");
      // parseString(xml, (err, result) => {
      //   if (err) {
      //     console.error(err);
      //     res.status(500);
      //     next();
      //   }
      // console.dir(result, "Parsed XML");
      res.locals.myData = xml;
      next();
    })
    .catch(err => console.log(err));
};

const OCLCRequestByTitle = (req, res, next) => {
  console.log("Request to OCLC made");
  const OCLC_ENDPOINT_ISBN = `http://classify.oclc.org/classify2/Classify?author=Weinberger%2C%20David&title=${
    req.params.title
  }&summary=true`;
  fetch(OCLC_ENDPOINT_ISBN)
    .then(response => response.text())
    .then(xml => {
      res.locals.body = xml;
      next();
    })
    .catch(err => console.log(err));
};

// app.use("/decode_barcode", decodeBarcode);
app.use("/search_isbn", searchISBN);
app.use("/isbn_db/:isbn", quickISBNdbReq);
app.use("/oclc/:isbn", oclcRequest);

app.get("/", (req, res) => {
  console.log("Request made to root");
  res.status(200).send("Root");
});

app.get("/decode_barcode", (req, res) => {
  console.log('Request made to "decode_barcode"');
  res.status(200).send(res.locals.body);
});

app.get("/search_isbn", (req, res) => {
  console.log('Request made to "search_isbn"');
  res.status(200).send(res.locals.body);
});

app.get("/isbn_db/:isbn", (req, res) => {
  res.status(200).send(res.locals.body);
});

app.get("/oclc/:isbn", (req, res) => {
  console.log("Request made to OCLC");
  res.send(res.locals.myData);
});

app.get("/title/:title", (req, res) => {
  console.log(res.locals.body);
  res.send(res.locals.body);
});

app.listen(8080, () => {
  console.log("App is listening on port 8080 \nCORS enbabled");
});
