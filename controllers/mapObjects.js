var express = require('express')
  , router = express.Router()
  , MapObject = require('./../models/mapObject')


router.get('/search',  function(req, res) {

	var iDisplayStart =req.query.iDisplayStart;
	var iDisplayLength =req.query.iDisplayLength;
	  
	MapObject.get(req.query.search_params, iDisplayStart,iDisplayLength,req.query.sEcho, function (err, mapObject) {  
		res.send(mapObject);
	})
})

module.exports = router