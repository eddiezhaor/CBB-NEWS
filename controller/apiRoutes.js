var express = require("express");
var router = express.Router();
var cheerio = require("cheerio");
var request = require("request");
var db = require("../model");
router.get("/allNews", function(req, res) {
    var randomNumber = Math.floor(Math.random() * 1000000000);
    request("https://www.theonion.com/c/news-in-brief?startTime=1522" + randomNumber, function(err, response, html) {
        var $ = cheerio.load(html);
        var result = [];
        var count = 0;
        $("h1.entry-title").each(function(i, element) {
            var title = $(element).children("a").text();
            var link = $(element).children("a").attr("href");
            var imglink = $(element).parent().parent().children("figure").children("a").children("div.img-wrapper").children("picture").children("source").attr("data-srcset")
            console.log(imglink)
            var summary = $(element).parent().children("div.entry-summary").children("p").text()
            var myresult = {
                title: title,
                link: link,
                imglink: imglink,
                summary: summary
            }
            count++;
            db.news.findOneAndUpdate({ title: title }, myresult, { upsert: true, new: true, setDefaultsOnInsert: true }).then(function(dbnews) {
                    res.json(count);
                }).catch(function(err) {
                    res.json(err);
                })
                // result.push({
                //     title: title,
                //     link: link,
                //     imglink: imglink,
                //     summary: summary
                // })
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
router.post("/remove/:id", function(req, res) {
    db.news.findOneAndUpdate({ _id: req.params.id }, { $set: { saved: false } }, { new: true }).then(function(dbnews) {
        res.json(dbnews)
    }).catch(function(err) {
        res.json(err);
    })
})
router.post("/notes/:id", function(req, res) {
    db.notes.create(req.body).then(function(dbnotes) {
        return db.news.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbnotes._id } }, { new: true })
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
router.get("/myNotes/:id", function(req, res) {
    db.notes.findOne({ _id: req.params.id }).then(function(data) {
        res.json(data)
    }).catch(function(err) {
        res.json(err)
    })
})
router.post("/myNotes/:id", function(req, res) {
    db.notes.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true }).then(function(data) {
        res.json(data)
    }).catch(function(err) {
        res.json(err)
    })
})
router.post("/removeNotes/:id", function(req, res) {
    db.notes.remove({ _id: req.params.id }).then(function(dbnotes) {
            res.json(dbnotes);
        })
        .catch(function(err) {
            res.json(err);
        })
})
module.exports = router;