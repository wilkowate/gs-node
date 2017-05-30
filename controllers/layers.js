var express = require('express')
  , router = express.Router()
  , Layer = require('./../models/layer')

  router.get('/loadActiveLayers',  function(req, res) {
	  
	  
	 var id =req.query.id;
	  
	 Layer.loadActiveLayers(id, function (err, layers) {
		  
		  res.send(layers);
	    //res.render('comments/comment', {comment: document})
	  })
	})

module.exports = router