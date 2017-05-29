var express = require('express')
  , router = express.Router()
  , Category = require('./../models/category')

  router.get('/search',  function(req, res) {
	  
	  
	 var id =req.query.id;
	 //consoleLog("id"+id);
	// var iDisplayLength =req.query.iDisplayLength;
	  
	 Category.get(id, function (err, category) {
		  
		  res.send(category);
	    //res.render('comments/comment', {comment: document})
	  })
	})

module.exports = router