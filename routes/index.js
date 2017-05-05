var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	
	config = require("./../config");
    db = config.database;

	
  res.render('index', { title: db.user });
});

module.exports = router;
