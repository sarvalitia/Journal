//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _=require("lodash");
const mongoose=require("mongoose");

const homeStartingContent = "My journal";
const aboutContent = "Hey there, I am Sarvesh.  An engneering student.  I have created this website because i wanted to make an account of the incidents that happen in my life, that i think are memorable or worth telling.  From outside it may seem like any other boring life of a engneering student in India, but i think each and everyone has got their own beautiful, imperfect and unique story to tell.  I want to talk about the things that happen around me and bother me personalley.  So mostly this webpage is for y'all to know about my day-to-day life.  Its time to tell my own story, So stay tuned. "  ;
const contactContent="Ping me in.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/BlogDB" ,{ useNewUrlParser: true  ,useUnifiedTopology: true , useFindAndModify: false});

const journalSchema=new mongoose.Schema({
  title:String,
  content:String
});
const Journal=mongoose.model("journal",journalSchema);


app.get("/",function(req,res){
  Journal.find({},function(err,journals){

  res.render("home",{homeStartingContent:homeStartingContent,aboutContent:aboutContent,contactContent:contactContent,posts:journals});


  });
});

app.get("/journals",function(req,res){

});


app.get("/compose",function(req,res){
  res.render("compose");
});

app.post("/compose",function(req,res){
  const post=new Journal({
    title:req.body.postTitle,
    content:req.body.postContent
  });
post.save(function(err){
  if(err){
    console.log(err);
  }
  else{
    res.redirect("/")
  }
});
});

app.get("/post/:id",function(req,res){
  const id=req.params.id;
  Journal.findOne({_id:id},function(err,result){
    if(!result){
      console.log("not found");
    }
    else{

  res.render("post",{requestedtitle:result.title,requestedcontent:result.content});
}
  });
});



app.listen(3000, function() {
  console.log("Server started ");
});
