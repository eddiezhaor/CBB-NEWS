var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var PORT = process.env.PORT || 3000;
var mongoose = require("mongoose")
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
var exphbs = require("express-handlebars");
var htmlRoutes = require("./controller/htmlRoutes");
var apiRoutes = require("./controller/apiRoutes");
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {

});
app.engine("handlebars", exphbs({
    defaultLayout: "main"
}))
app.set("view engine", "handlebars");
app.use("/", htmlRoutes);
app.use("/api", apiRoutes)
var mgdb = mongoose.connection;
mgdb.on("error", function(err) {
    console.log(err)
})
mgdb.once("open", function() {
    console.log("good")
})
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});