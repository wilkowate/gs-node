var express = require('express')
  , router = express.Router()
  , Document = require('./../models/document')


//router.post('/', auth, function(req, res) {
//  user = req.user.id
//  text = req.body.text
//
//  Comment.create(user, text, function (err, comment) {
//    res.redirect('/')
//  })
//})
  
  router.get('/search',  function(req, res) {
	  
	  
	 var iDisplayStart =req.query.iDisplayStart;
	 var iDisplayLength =req.query.iDisplayLength;
	 
	 console.log('p: '+JSON.stringify(req.query.search_params));
	  
	  Document.get(req.query.search_params, iDisplayStart,iDisplayLength, function (err, document) {
		  
		  res.send(document);
	    //res.render('comments/comment', {comment: document})
	  })
	})

//router.get('/:id', function(req, res) {
//	Document.get(req.params.id, function (err, document) {
//	 // res.send(res1);
//    res.render('comments/comment', {comment: document})
//  })
//})

module.exports = router