//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", { useNewUrlParser: true });
const articleSchema = {
    title: String,
    content: String
    };
const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
  .get(function(req,res){
      Article.find().then(function(articles){
        res.send(articles)// Success   
      }).catch(function(error){
        res.send(error)      // Failure
      });
  })
  .post(function(req, res){
      const newArticle = new Article({
        title: req.body.title,
        content: req. body.content
        });
        newArticle.save().then(function(res){
          res.send("new articles successfully added")
        }).catch(function(err){
          res.send(err)
        });
    
  })
  .delete(function(req, res) {
      Article.deleteMany().then(function(res){
        res.send("Successfully deleted all articles")
      }).catch(function(err){
        res.send(err)
      });
  });

app. route("/articles/:articleTitle")
.get(function(req,res){
    Article.findOne({title:req.params.articleTitle}).then(function(foundArticle){
        res.send(foundArticle);
    }).catch(function(err){
      res.send("article didn't found");
    });
})
.put((req, res) => {
  Article.findOneAndUpdate(
    { title: req.params.articleTitle },
    { title: req.body.title, content: req.body.content },
    { overwrite: true }    
  ).then(function(result){
    res.send("Successfully updated article");
  }).catch(function(err){
    res.send("Error");
  })
})
.patch(function(req, res){
  Article.updateOne(
    {title: req.params.articleTitle},
    req.body   
  ).then(function(result){
    res.send("Successfully updated article");
  }).catch(function(err){
    res.send("Error");
  })
})
.delete (function(req, res) {
  Article.deleteOne (
    {title: req.params.articleTitle}  
  ).then(function(result){
    res.send("Successfully deleted article");
  }).catch(function(err){
    res.send("Error");
  })
});
app.listen(3000, function() {
  console.log("Server started on port 3000");
});