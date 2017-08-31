/**
 * http://usejsdoc.org/
 */

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var db = require('./database.js');

var tableName = '';
var columnName = '';
var type = '';
var docTypeId = 0;

function DocTypeAttr(docTypeId){
	this.docTypeId = docTypeId;
}

/**
 * 
 */
exports.get = function(id, done) {
	
	console.log(' getgetege');
	
	var connection = db.getConnection();
	connection.on('connect', function(err) {
		  if (err) {
		    console.log(err);
		  } else {
			  loadDocTypes(done,connection);
		  }
	});
}

/**
 * 
 * @param done
 * @param connection
 */
function loadDocTypes(done,connection) {
	
	console.log(' loadDocTypes');
	
	var resultData = new Map();
	var docTypes = [];
	
	var query = "SELECT TableName,ColumnName, Type FROM tableColumns WHERE Active = 1 ";
	query += " AND TableName LIKE '%Document%'";
	//query += " ORDER BY Name OFFSET "+iDisplayStart+" ROWS FETCH NEXT "+iDisplayLength+" ROWS ONLY";
	console.log(query + ' query');

	
	request = new Request(query, function(err, rowCount) {
		if (err) {
			console.log(err);
		} else {
			
			var datares = [];
			
			resultData.forEach((value, key) => {
				var obj = new Object();
			//	console.log("key:"+key+" "+JSON.stringify(value));
				obj.key = key;
				obj.value = JSON.stringify(value);
				datares.push(obj);
			})
			
			var res1 = {"data":datares};
		   // console.log("aJSON:"+res1);
		    done(null,res1);
		    console.log(rowCount + ' rows');
	    }
		connection.close();
	});
	  
	request.on('row', function(columns) {
		var doc = new DocTypeAttr(1);
		columns.forEach(function(column) {
			
			if (column.value === null) {
			} else if(column.metadata.colName == 'TableName'){
				doc.tableName = column.value;
			} else if(column.metadata.colName == 'ColumnName'){
				doc.columnName = column.value;
			} else if(column.metadata.colName == 'Type'){
				doc.type = column.value;
			} else if(column.metadata.colName == DOC_TYPE_ID){
				doc.docTypeId = column.value;
			} else {
				// console.log('n: '+column.metadata.colName);
			//	doc.name = column.value;
				
			}
		});
		
		//resultData.push(doc);
		
		if(resultData.get(doc.tableName) == undefined){
			
			
			resultData.set(doc.tableName,[]);
		}
		(resultData.get(doc.tableName)).push(doc);
	});
	  
	request.on('done', function (rowCount, more, rows) { 
		console.log('DONE');
	});

	connection.execSql(request);
}