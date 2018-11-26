const express = require('express');
const router = express.Router();

let Article = require('../models/article');

let User = require('../models/user');

router.get('/:id',function(req,res){
  Article.findById(req.params.id, function(err,article){
    User.findById(article.author, function(err,user){
      res.render('article', {
        article:article,
        author:user.name
    });
    console.log(article);
    res.render('article', {
      article:article
    });
  });
});

router.get('/add', function(req, res){
  res.render('add_articles', {
    title: 'Add Articles'
  });
});



router.get('/edit/:id', ensureAuthenticated, function(req,res){
  if(article.author != req.user._id)
  {
    req.flash('danger',' Not Authorized');
    res.redirect('/');
  }
  Article.findById(req.params.id, function(err,article){
    res.render('edit_article', {
      title:'Edit Article',
      article:article
    });
  });
});

router.post('/add',ensureAuthenticated, function(req,res){
  req.checkBody('title','Title is required').notEmpty();
  //req.checkBody('author','Author is required').notEmpty();
  req.checkBody('body','Body is required').notEmpty();

  let errors = req.validationErrors();

  if(errors){
    res.render('add_articles',{
      title:'Add Article',
      errors:errors
    });
  }
  else {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.user._id;
    article.boody = req.body.boody;

    article.save(function(err){
      if(err){
        console.log(err);
      }
      else{
        res.redirect('/');
      }
    });
  }
});

router.post('/edit/:id', function(req,res){

  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.boody = req.body.boody;

  let query = {_id:req.params.id}

  Article.update(query, article, function(err){
    if(err){
      console.log(err);
    }
    else{
      res.redirect('/');
    }
  })

});

router.delete('/:id',function(req,res){
  if(!req.user._id){
    res.status(500).send();
  }
  let query = {_id:req.params.id}

  Article.findById(req.params.id, function(err,article){
    if(article.author != req.user._id){
      res.status(500).send();
    }
    else {
      Article.remove(query,function(err){
        if(err){
          console.log(err);
        }
        res.send('Success');
      });
    }
  })


});

function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  else {
    req.flash('danger','Please login');
    res.redirect('/users/login');
  }
}

 module.exports = router;
