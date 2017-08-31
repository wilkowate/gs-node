var express = require('express')
  , router = express.Router()
  , DocTypeAttr = require('./../models/docTypeAttr')

  router.get('/loadDocTypes',  function(req, res) {
	  var id =1;
	  //console.log('loadDocTypesloadDocTypesloadDocTypes');
	  DocTypeAttr.get(id, function (err, layers) {
		  res.send(layers);
	  })
	})

module.exports = router