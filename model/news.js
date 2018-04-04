var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var newsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    imglink: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    saved: {
        type: Boolean,
        default: false
    },
    notes: [{
        type: Schema.Types.ObjectId,
        ref: "notes"
    }]
})

var news = mongoose.model("news", newsSchema);
module.exports = news;