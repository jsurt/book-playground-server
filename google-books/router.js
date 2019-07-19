require("dotenv");
const express = require("express");
const https = require("https");

const router = express.Router();

const { GOOGLE_API_KEY } = process.env;

const googleSearchByTitle = (req, res, next) => {
  let initialData = "";
  https
    .get(
      `https://www.googleapis.com/books/v1/volumes?q=intitle:${
        req.params.title
      }&key=${GOOGLE_API_KEY}&printType=books`,
      response => {
        response.on("data", data => {
          initialData += data;
        });
        response.on("end", data => {
          // console.log(data, "data in end");
          res.locals.body = initialData;
          next();
        });
      }
    )
    .end();
};

const refineResponse = (req, res, next) => {
  const response = res.locals.body;
  const json = JSON.parse(response);
  let { title, authors, publishedDate } = json.items[0].volumeInfo;
  const authorsStr =
    authors.length <= 1 ? authors.join("") : authors.join(", ");
  let thumbnails = [];
  json.items.forEach(item => {
    thumbnails.push(item.volumeInfo.imageLinks.smallThumbnail);
  });
  res.locals.bookObj = {
    title,
    authors: authorsStr,
    thumbnails
  };
  next();
};

router.get("/:title", googleSearchByTitle, refineResponse, (req, res) => {
  res.send(res.locals.bookObj);
});

module.exports = { router };
