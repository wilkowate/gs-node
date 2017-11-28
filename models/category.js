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

var key = 0;
var title = '';
var expanded = false;
var folder = false;
var children = [];
var loaded = false;
var data = {loaded : false};

function Category(id){
	this.id = id;
	this.data = {loaded : false};
	this.title = "dummy";
	this.children = [];
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
	
	resultCategories = new Map();
	
	var catIds = [];
	
	var query = "SELECT * FROM Category where parent = "+id;
	
	request = new Request(query, function(err, rowCount) {
	    if (err) {
	      console.log(err);
	    } else {
	    	
		    //var res1 ={
		    //		"categories":resultData
		    //	  };
		    
		    console.log(JSON.stringify(resultData));
		    loadChildren( connection, done, resultCategories,catIds);
		    
		   // done(null,resultData);
	      //console.log(rowCount + ' rows');
	    }
	   // connection.close();
	});
	  
	request.on('row', function(columns) {
		var categoryNode = new Category(1);
	    columns.forEach(function(column) {
	    	if (column.value === null) {

	      } else if(column.metadata.colName == 'Label'){
	    	  categoryNode.title = column.value;
	      } else if(column.metadata.colName == 'Category'){
	    	  categoryNode.id = column.value;
	    	  categoryNode.key = column.value;
	      } else if(column.metadata.colName == 'Parent'){
	    	  categoryNode.parent = column.value;
	      } else if(column.metadata.colName == 'DocsCounter'){
	    	  categoryNode.docsCounter = column.value;
	      } else if(column.metadata.colName == 'ChildDocsCounter'){
	    	  categoryNode.childDocsCounter = column.value;
	      }
	    });
	    categoryNode.children = [];
	   // categoryNode.data1 = false;
	    categoryNode.data.loaded = true;
	    categoryNode.folder = true;
	    categoryNode.icon = "images/icons/layer-layer-on.png";
		  categoryNode.lazy = true;
	    console.log('-------- load'+categoryNode.id);
	    catIds.push(categoryNode.id);
	    resultData.push(categoryNode);
	    resultCategories.set(categoryNode.id, categoryNode);
	});
	  
	request.on('done', function (rowCount, more, rows) { 
		console.log('DONE');
	});

	connection.execSql(request);
}

/**
 * 
 * @param id
 * @param connection
 * @param resultCategories
 */
function loadChildren( connection,done ,resultCategories, catIds ){
	
	if(catIds.length == 0){
		var res = [];
		
		resultCategories.forEach(function (value, key, map) { 
			res.push(value);
		});
		
		//console.log("the end"+JSON.stringify([...resultCategories]));//JSON.stringify(resultCategories));
		done(null,JSON.stringify(res));
		return;
		
	}
	
	var id = catIds[0];
	catIds.shift();
	var categoryParent = resultCategories.get(id);
	console.log(catIds+'   DONloadChildrenloadChildrenloadChildrenloadChildrenE    '+id);
	
	var query = "SELECT * FROM Category where parent = "+id;
	
	  request = new Request(query, function(err, rowCount) {
	    if (err) {
	      console.log(err);
	    } else {
  
		    console.log("rrrrID "+id);
		    loadChildren( connection,done, resultCategories, catIds);
	    }
	   // connection.close();
	  });
	  
	  request.on('row', function(columns) {
		  var categoryNode = new Category(1);
		  columns.forEach(function(column) {
	      if (column.value === null) {

	      } else if(column.metadata.colName == 'Label'){
	    	  categoryNode.title = column.value;
	      } else if(column.metadata.colName == 'Category'){
	    	  categoryNode.id = column.value;
	    	  categoryNode.key = column.value;
	      } else if(column.metadata.colName == 'Parent'){
	    	  categoryNode.parent = column.value;
	      } else if(column.metadata.colName == 'DocsCounter'){
	    	  categoryNode.docsCounter = column.value;
	      } else if(column.metadata.colName == 'ChildDocsCounter'){
	    	  categoryNode.childDocsCounter = column.value;
	      } else if(column.metadata.colName == 'EndNode'){
	    	  if(column.value == 1){
	    		  categoryNode.folder = false;
	    		  categoryNode.lazy = false;
	    	  } else {
	    		  categoryNode.folder = true;
	    		  categoryNode.lazy = true;
	    		  categoryNode.children = null;
	    		  
	    		  
	    		 // var cat = new Category(1);
	    		  //categoryNode.children.push(cat);
	    	  }
	      }
	      
	      
	    });
	    
	    console.log('-------- children '+categoryNode.id);
	    categoryNode.data.loaded = false;
	    categoryParent.children.push(categoryNode);
	    

	  });
	  
	  connection.execSql(request);

}