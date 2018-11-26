const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const config = require('./config/database');
const passport = require('passport');


mongoose.connect(config.database);
let db = mongoose.connection;

db.once('open', function(){
  console.log('Connected to mongodb');
});

db.on('error', function(err){
  console.log(err);
});

const app = express();

app.get('/', function(req,res){
  Article.find({}, function(err,articles){
    if(err){
      console.log(err);
    }
    else {
      res.render('index', {
        title: 'Articles',
        articles: articles
    });
}
  });
});

let Article = require('./models/article')

app.set('views', path.join(__dirname,'views'));
app.set('view engine','pug');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'public')));

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

require('./config/passport')(passport)

app.use(passport.initialize());
app.use(passport.session());

app.get('*',function(req,res,next){
  res.locals.user = req.user || null;
  next();
});

let articles = require('./routes/articles');
app.use('/articles,',articles)

let users = require('./routes/users');
app.use('/users,',users)

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.listen(3000, function(){
  console.log("Server started on port 3000")
});
