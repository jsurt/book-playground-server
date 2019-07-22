"use strict";
const express = require("express");
const mysqlx = require('@mysql/xdevapi');

const config = require("../../server");

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Request sent to book root").status(200);
});

router.post("/", (req, res) => {
    mysqlx.getSession(config)
        .then(session => {
            return session.getSchema("huey_client").getTable("books")
                .insert(["title", "authors", "thumbnail", "ddc", "date_added"])
                .values(["Semiotics of Theatre and Drama", "Keir Elam", "http://books.google.com/books/content?id=mAOCAgAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api", Date.now()])
                .execute();
        })
        .catch(err => {
            console.error(err);
            res.sendStatus(500);
        })
});

module.exports = router;