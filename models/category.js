/**
 * http://usejsdoc.org/
 */

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var db = require('./database.js');

var label = '';
var nrDocs = 0;
var id = 0;
var parentId = 0;
var docsCounter = '';
var childDocsCounter = '';

function Category(id){
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
			  loadCats(id,done,connection);
		  }
	});
}

/**
 * 
 * @param done
 * @param connection
 */
function loadCats(id,done,connection) {
	
	console.log(id + ' cat id');
	
	var resultData = [];
	
	var query = "SELECT * FROM Category where parent = "+id;
	
	  request = new Request(query, function(err, rowCount) {
	    if (err) {
	      console.log(err);
	    } else {
	    	
		    var res1 ={
		    		"categories":resultData
		    	  };
		    
		    console.log(JSON.stringify(resultData));
		    
		    done(null,res1);
	      console.log(rowCount + ' rows');
	    }
	    connection.close();
	  });

	  request.on('row', function(columns) {
		  var doc = new Category(1);
	    columns.forEach(function(column) {
	      if (column.value === null) {

	      } else if(column.metadata.colName == 'Label'){
	    	  doc.label = column.value;
	      } else if(column.metadata.colName == 'Category'){
	    	  doc.id = column.value;
	      } else if(column.metadata.colName == 'Parent'){
	    	  doc.parent = column.value;
	      } else if(column.metadata.colName == 'DocsCounter'){
	    	  doc.docsCounter = column.value;
	      } else if(column.metadata.colName == 'ChildDocsCounter'){
	    	  doc.childDocsCounter = column.value;
	      }
	      
	      
	    });
	    resultData.push(doc);

	  });
	  
	  request.on('done', function (rowCount, more, rows) { 
		  console.log('DONE');
	  });

	connection.execSql(request);
}