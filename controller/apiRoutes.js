var express = require("express");
var router = express.Router();
var cheerio = require("cheerio");
var request = require("request");
var db = require("../model");
router.get("/allNews", function(req, res) {
    request("https://www.theonion.com/c/news-in-brief", function(err, response, html) {
        var $ = cheerio.load(html);
        var result = [];
        $("h1.entry-title").each(function(i, element) {
            var title = $(element).children("a").text();
            var link = $(element).children("a").attr("href");
            var imglink = $(element).parent().parent().children("figure").children("a").children("div.img-wrapper").children("picture").children("source").attr("data-srcset")
            console.log(imglink)
            var summary = $(element).parent().children("div.entry-summary").children("p").text()
            result.push({
                title: title,
                link: link,
                imglink: imglink,
                summary: summary
            })
        })

        db.news.create(result).then(function(dbnews) {
            res.json(dbnews);
        }).catch(function(err) {
            res.json(err);
        })


    })



})

router.get("/savedNews", function(req, res) {
    db.news.find({ saved: true }).then(function(dbnews) {
        res.json(dbnews);
    }).catch(function(err) {
        res.json(err)
    })
})

router.post("/save/:id", function(req, res) {
    db.news.findOneAndUpdate({ _id: req.params.id }, { $set: { saved: true } }, { new: true }).then(function(dbnews) {
        res.json(dbnews)
    }).catch(function(err) {
        res.json(err);
    })


})

router.post("/notes/:id", function(req, res) {
    db.notes.create(req.body).then(function(dbnotes) {
        return db.news.findOneAndUpdate({ _id: req.params.id }, { $set: { notes: dbnotes._id } }, { new: true })
    }).then(function(db) {
        res.json(db)
    }).catch(function(err) {
        res.json(err);
    })
})
router.get("/notes/:id",
    function(req, res) {
        db.news.findOne({ _id: req.params.id }).populate("notes")
            .then(function(dbnews) {
                console.log(dbnews)
                res.json(dbnews);
            }).catch(function(err) {
                res.json(err);
            })
    })
module.exports = router;