var cheerio = require("cheerio");
var request = require("request");
var express = require ("express");
var logger = require("morgan");
var bodyParser = require ("body-parser");
var mongoose = require ("mongoose");
var request = require("request");
var exphbs  = require('express-handlebars');
var index = require("./routes/index")
var db = require("./models");

var PORT = 3000;

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use("/", index);

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/basketball", {

});

app.get("/", function(req, res) {

  res.send("index");

});

app.get("/scrape", function(req, res) {

// Make a request call to grab the HTML body from the site of your choice
request("https://basketball.realgm.com/", function(error, response, html) {

  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  var $ = cheerio.load(html);

  // An empty array to save the data that we'll scrape
  var results = {};

    $(".secondary-story").each(function(i, element) {

    results.link = "https://basketball.realgm.com/" + $(this).children().attr("href");
    results.summary = $(this).find(".article-content").text();
    results.title = $(this).find(".article-title").text();
    var entry = new db.Article(results);
    entry.save(function(err, doc) {
      if (err) {
        console.log(err);
      }

      else {
        console.log(doc);
      }
    })
  });

  // Log the results once you've looped through each of the elements found with cheerio
  console.log(results);
});

res.send("scrape-complete");

});

  // Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article
    .find({})
    .then(function(dbArticles) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticles);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article
    .findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note
    .create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
