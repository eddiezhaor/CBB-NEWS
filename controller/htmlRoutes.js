var express = require("express");
var router = express.Router();
var request = require("request");
var cheerio = require("cheerio");
var db = require("../model");
router.get("/", function(req, res) {
    db.news.find({}).then(function(data) {
        var hsobj = { news: data }
        res.render("index", hsobj)
    }).catch(function(err) {
        res.json(err)
    })


})
module.exports = router;