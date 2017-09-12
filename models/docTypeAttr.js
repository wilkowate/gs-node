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
exports.get = function(tableType, done) {
	var connection = db.getConnection();
	connection.on('connect', function(err) {
		  if (err) {
		    console.log(err);
		  } else {
			  loadDocTypes(tableType, done,connection);
		  }
	});
}

/**
 * 
 * @param done
 * @param connection
 */
function loadDocTypes(tableType, done,connection) {

	var resultData = new Map();
	var docTypes = [];
	
	var query = "SELECT tc.TableName, tc.ColumnName, tc.Type, tc.DocTypeID FROM tableColumns tc  ";
	if(tableType === "Document"){
		query += " WHERE tc.TableName LIKE '%GlobalDocFields_GS%'";

    	query += " UNION ";
    	query += " SELECT tc.TableName, tc.ColumnName, tc.Type, tc.DocTypeID FROM tableColumns tc  ";
    	query += " left JOIN DocumentType dt ON dt.DocTypeID = tc.DocTypeID   ";
    	query += " WHERE dt.ACTIVE = 1  AND tc.TableName LIKE '%Document%'  ";
    	query += " ORDER BY tc.DocTypeID  ";
    	
	} else {
		query += " WHERE tc.TableName NOT LIKE '%Document%'";
		query += " ORDER BY TableName  ";
	}
	
	query += "  ";
	//+iDisplayStart+" ROWS FETCH NEXT "+iDisplayLength+" ROWS ONLY";
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
		    done(null,res1);
		    console.log(rowCount + ' rows');
	    }
		connection.close();
	});
	  
	request.on('row', function(columns) {
		var doc = new DocTypeAttr(0);
		columns.forEach(function(column) {
			//console.log('column: '+column.metadata.colName);
			if (column.value === null) {
			} else if(column.metadata.colName == 'TableName'){
				doc.tableName = column.value;
			} else if(column.metadata.colName == 'ColumnName'){
				doc.columnName = column.value;
			} else if(column.metadata.colName == 'Type'){
				doc.type = column.value;
			} else if(column.metadata.colName == 'DocTypeID'){
				doc.docTypeId = column.value;
			} else {
				// console.log('n: '+column.metadata.colName);
			//	doc.name = column.value;
				
			}
		});
		
		console.log('doc: '+doc.docTypeId+" "+doc.columnName);
		//resultData.push(doc);
		
		if(resultData.get(doc.docTypeId) == undefined){
			resultData.set(doc.docTypeId,[]);
		}
		(resultData.get(doc.docTypeId)).push(doc);
	});
	  
	request.on('done', function (rowCount, more, rows) { 
		console.log('DONE');
	});

	connection.execSql(request);
}