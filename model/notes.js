var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var noteSchema = new Schema({
    body: String
})

var notes = mongoose.model("notes", noteSchema);
module.exports = notes;