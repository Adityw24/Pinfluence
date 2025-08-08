require('dotenv').config();
var express = require('express');
var router = express.Router();
const userModel= require("./users");
const postModel= require("./post");
const passport = require('passport');
const upload= require('./multer')
const axios = require('axios');

const localstrategy = require("passport-local");
const flash = require('connect-flash');
passport.use(new localstrategy(userModel.authenticate()))

const UNSPLASH_API_KEY ='D_VZBtkDKWSMn_t9QEVgIMFvc1InMnxt5i5ulTfWqUE';

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express'});
});

router.get('/login', function(req, res, next) { 
  console.log(req.flash("error"))
  res.render('login',{error:req.flash('error'), title: 'login'});
  });

router.get('/saved', isLoggedIn, async (req, res) => {
  const user = await userModel.findOne({ username: req.session.passport.user });
  res.render('saved')
});

router.get('/create', function(req, res, next) {
  res.render('create');
});

router.get('/about', function(req, res, next) {
  res.render('about');
});

router.get('/home', function(req, res, next) {
  res.render('home');
});

router.post('/fileupload',isLoggedIn,upload.single("image") ,async function(req, res, next) {
try {
    const user = await userModel.findOne({ username: req.session.passport.user });
    user.dp = req.file.filename;
    await user.save();
    res.redirect("/profile");
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
}})

router.post("/upload", isLoggedIn ,upload.single("file") ,async function(req, res, next){
  if(!req.file) {
    return res.status(404).send("no files were given")
  }

  const user = await userModel.findOne({username: req.session.passport.user})
  const post = await postModel.create({
    image: req.file.filename,
    imageText: req.body.title,
    description: req.body.description,
    user: user._id
  })

  user.posts.push(post._id);
  await user.save()
  req.flash('success', 'Pin Created!');
  res.redirect('/profile')
});

router.get("/profile", isLoggedIn, async function(req, res, next){
  const user= await userModel.findOne({username:req.session.passport.user}).populate('posts')
  res.render('profile', {user})
})

router.post("/register", function(req, res){
const { username, fullName, email } = req.body;
const userData = new userModel({ username, fullName, email });

userModel.register(userData, req.body.password, function(err,user){
if (err) {
      req.flash("error", err.message);
    }
  passport.authenticate("local")(req,res, function(){
    res.redirect("/home")
  })
})
})

router.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) return next(err);
    if (!user) {
      req.flash("error", info.message || "Invalid username or password");
      return res.redirect("/login");
    }
    req.logIn(user, function (err) {
      if (err) return next(err);
      return res.redirect("/home");
    });
  })(req, res, next);
});


router.get("/logout", function(req,res){  
req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
}) 

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()) return next();
  res.redirect("/login");
}

router.get("/home", async (req, res) => {
  try {
    const response = await axios.get('https://api.unsplash.com/photos/random', {
      params: { count: 20 },
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    });

    const images = response.data;
    res.render("index", { images });
  } catch (err) {
    console.error("Error fetching images:", err.message);
    res.render("index", { images: [] });
  }
});

module.exports = router;
