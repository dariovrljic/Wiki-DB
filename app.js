const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/wikiDB', { useNewUrlParser: true });

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);


/*REST: GET, POST, DELETE requests targeting all articles*/
app.route("/articles")
    .get(
        function (req, res) {
            Article.find(function (err, foundArticles) {
                if (!err) {
                    res.send(foundArticles);
                }
                else {
                    res.send(err);
                }
            })
        }
    )
    .post(
        function (req, res) {

            const newArticle = new Article({
                title: req.body.title,
                content: req.body.content
            })
            newArticle.save(function (err) {
                if (!err) {
                    res.send("Successfully added a new article.");
                }
                else {
                    res.send(err);
                }
            });
        }
    )
    .delete(
        function (req, res) {
            Article.deleteMany(function (err) {
                if (!err) {
                    res.send("Successfully deleted all articles.")
                }
                else {
                    res.send(err);
                }
            });
        }
    );
/*_____________________________*/
/*REST TARGETING SPECIFIC ARTICLE*/
app.route("/articles/:articleTitle")
    .get(function (req, res) {

        Article.findOne(
            { title: req.params.articleTitle },

            (err, foundArticle) => {
                if (foundArticle) {
                    res.send(foundArticle)
                } else {
                    res.send("No articles matching that title was found!")
                }
            }
        )
    })
    .put(function (req, res) {
        Article.updateOne(
            { title: req.params.articleTitle },
            {$set:{title: req.body.title, content: req.body.content }},
            { multi: true, upsert: true },
            (err) => {
                if (!err) {
                    res.send("Successfully updated!")
                } else {
                    res.send(err)
                }
            }
        )
    })
    .patch(function (req, res) {
        Article.updateOne(
            { title: req.params.articleTitle },
            {$set:req.body},
            (err) => {
                if (!err) {
                    res.send("Successfully updated!")
                } else {
                    res.send(err)
                }
            }
        )
    })
    .delete(function(req, res){
        Article.deleteOne(
            {title:req.params.articleTitle},
            (err) => {
                if (!err) {
                    res.send("Successfully deleted!")
                } else {
                    res.send(err)
                }
            })
    })
/*_________________________*/

app.listen(5000, () => {
    console.log("server started on port 5000");
});