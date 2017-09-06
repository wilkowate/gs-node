var express = require('express')
  , router = express.Router()
  , DocTypeAttr = require('./../models/docTypeAttr')

  router.get('/loadDocTypes',  function(req, res) {
	  var id =1;
	  //console.log('loadDocTypesloadDocTypesloadDocTypes');
	  DocTypeAttr.get("Document", function (err, layers) {
		  res.send(layers);
	  })
	})
	
	router.get('/loadMapTypes',  function(req, res) {
	  var id =1;
	  DocTypeAttr.get("Map", function (err, layers) {
		  res.send(layers);
	  })
	})

module.exports = router