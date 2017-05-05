/**
 * http://usejsdoc.org/
 */

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var db = require('./database.js');

var name = '';
var fileName ='';
var id = 0;

function Document(id){
	this.id = id;
}

/**
 * 
 */
exports.get = function(id, done) {
	var connection = db.getConnection();
	connection.on('connect', function(err) {
		  if (err) {
		    console.log(err);
		  } else {
			  loadDocs(done,connection);
		  }
	});
}

/**
 * 
 * @param done
 * @param connection
 */
function loadDocs(done,connection) {
	
	var data1 = [];
	
	var query = "SELECT Name FROM Document ";
	

	
	 console.log(query + ' query111');
	
	  request = new Request(query, function(err, rowCount) {
	    if (err) {
	      console.log(err);
	    } else {
		    var res1 ={"docs":data1};
		    done(null,res1);
	      console.log(rowCount + ' rows');
	    }
	    connection.close();
	  });

	  request.on('row', function(columns) {
		  var doc = new Document(1);
	    columns.forEach(function(column) {
	      if (column.value === null) {

	      } else {
	       // console.log('n: '+column.metadata.colName);
	    	  doc.name = column.value;
	        data1.push(doc);
	      }
	    });
	    

	  });
	  
	  request.on('done', function (rowCount, more, rows) { 
		  console.log('DONE');
	  });

	connection.execSql(request);
}