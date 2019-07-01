"use strict";

require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const fetch = require("node-fetch");
const https = require("https");
const parseString = require('xml2js').parseString;

app.use(cors());

// API keys
const { BARCODE_API_KEY, GOOGLE_API_KEY, ISBNdb_API_KEY } = process.env;


/* Test values */
// For Google Books API
let title_1 = "diary of a madman and other stories";
let title_2 = "penguin classics arthurian romances";

// decodeBarcode give this variable its value
let title;

// For Barcode Lookup API
let barcode_1 = "9781591413288";
let barcode_2 = "071121957153";
let barcode_3 = "9781503219700";

/* ARE A BOOK'S BARCODE AND ISBN NUMBER THE SAME? IF SO, SCAN BARCODE AND THEN USE GOOGLE BOOKS API */
// ^^
// ||
// Useless now, I think           

//ISBN's
let isbn_db_1 = "1591413281";
let isbn_db_2 = "9780553539714"; // Amulet kids book
let isbn_db_3 = "9780141988511"; // 12 Rules (ISBN 1)
let isbn_db_4 = "9780345816023"; // 12 Rules (ISBN 2)
let isbn_db_5 = "9780618391134"; // LoTR
let isbn_db_6 = "0143038095";  // ISBN from StackOverflow answer
let isbn_db_7 = "9780416720600";  // Semiotics of Theater
let isbn_db_8 = "9780140440584";  // Ovid Metamorphoses
let isbn_db_9 = "9781118531648";  // Jon Duckett Javascript book
let isbn_db_10 = "9780590353427"; // Harry Potter

// API request endpoints
const BARCODE_ENDPOINT = `https://api.barcodelookup.com/v2/products?barcode=${barcode_1}&category=Media>Books&key=${BARCODE_API_KEY}`;
const GOOGLE_BOOKS_ENDPOINT_1 = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn_db_7}&key=${GOOGLE_API_KEY}&printType=books`;
const GOOGLE_BOOKS_ENDPOINT_2 = `https://www.googleapis.com/books/v1/volumes?q=intitle:${title}&key=${GOOGLE_API_KEY}&printType=books`;

const decodeBarcode = (req, res, next) => {
    let initialData = "";
    https.get(BARCODE_ENDPOINT, response => {
        response.on("data", data => {
            console.log("Receiving data", data);
            initialData += data;
        });
        response.on("end", data => {
            console.log(data, "data in end");
            res.locals.body = initialData;
            console.log(res.locals.body.products);
            next();
        });
    })
    .end();
}

const searchISBN = (req, res, next) => {
    let initialData = "";
    https.get(GOOGLE_BOOKS_ENDPOINT_1, response => {
        response.on("data", data => {
            console.log(data);
            initialData += data;
        });
        response.on("end", data => {
            res.locals.body = initialData;
            next();
        });
    })
    .end();
}


// &dewey_decimal=1

const ISBNdbReq = (req, res, next) => {
    const options = {
        method: "GET",
        host: "api2.isbndb.com",
        path: `/book/${isbn_db_6}&results=details`,
        headers: {
            "Content-Type": 'application/json',
            "Authorization": ISBNdb_API_KEY
        }
    };
    https.request(options, response => {
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
}

const headers = { 
    "Content-Type": 'application/json',
    "Authorization": ISBNdb_API_KEY
};

const ISBNdb_ENDPOINT_BOOKS = `https://api2.isbndb.com/book/${isbn_db_9}&results=details`;
const ISBNdb_ENDPOINT_SEARCH = `https://api2.isbndb.com/search/books?isbn13=${isbn_db_10}&results=details`;

// Quick test fetch
const quickISBNdbReq = (req, res, next) => {
    fetch(ISBNdb_ENDPOINT_SEARCH, { headers })
        .then(data => data.json())
        .then(json => {
            console.log(json);
            res.locals.body = json;
            next();
        })
        .catch(err => console.error(err));
}

//OCLC book numbers
const oclc_num_1 = "57358293"; // Some Harry Potter book
const oclc_num_2 = ""; // 

const OCLC_ENDPOINT_OCLC_NUMBER = `http://classify.oclc.org/classify2/Classify?oclc=${oclc_num_1}&summary=true`;
const OCLC_ENDPOINT_ISBN = `http://classify.oclc.org/classify2/Classify?isbn=${isbn_db_7}&summary=true`;

const oclcRequest = (req, res, next) => {
    console.log("Request to OCLC made");
    fetch(OCLC_ENDPOINT_ISBN)
        .then(response => response.text())
        .then(xml => {
            // console.log(xml, "XML");
            parseString(xml, (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500);
                    next();
                }
                // console.dir(result, "Parsed XML");
                res.locals.body = result;
                next();
            });
        })
        .catch(err => console.log(err));
}

const refinedOCLCRequest = (req, res, next) => {
    console.log("Request to OCLC made");
    fetch(OCLC_ENDPOINT_ISBN)
        .then(response => response.text())
        .then(xml => {
            // console.log(xml, "XML");
            parseString(xml, (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500);
                    next();
                }
                console.dir(result, "Parsed XML");
                res.locals.body = {
                    title: result.classify.work[0].$.title,
                    author: result.classify.authors[0].author[0]._,
                    ddc: result.classify.recommendations[0].ddc[0].mostPopular[0].$.sfa

                }
                next();
            });
        })
        .catch(err => console.log(err));
}

app.use("/decode_barcode", decodeBarcode);
app.use("/search_isbn", searchISBN);
app.use("/isbn_db", quickISBNdbReq);
app.use("/oclc", oclcRequest);
app.use("/oclc_refined", refinedOCLCRequest);

app.get("/", (req, res) => {
    console.log("Request made to root");
    res.status(200).send("Root");
})

app.get("/decode_barcode", (req, res) => {
    console.log("Request made to \"decode_barcode\"");
    res.status(200).send(res.locals.body);
});

app.get("/search_isbn", (req, res) => {
    console.log("Request made to \"search_isbn\"")
    res.status(200).send(res.locals.body);
})

app.get("/isbn_db", (req, res) => {
    res.status(200).send(res.locals.body);
})

app.get("/oclc", (req, res) => {
    console.log("Request made to OCLC");
    res.send(res.locals.body);
})

app.get("/oclc_refined", (req, res) => {
    console.log(res.locals.body);
    res.send(res.locals.body);
})

app.listen(8080, () => {
    console.log("App is listening on port 8000 \nCORS enbabled");
});