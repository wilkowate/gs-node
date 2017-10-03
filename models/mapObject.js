/**
 * http://usejsdoc.org/
 */

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var db = require('./database.js');

var name = '';
var layerName ='';
var object = 0;

function MapObject(object){
	this.object = object;
}

var mapObjectSearchDialogTable = "null";
var searchObject  = "null";
var selectedMapObjsTempTableName = "null";
var selectedDocsTempTableName = "null";


var userName = "irena";
var sessionId = 0;
var pageSize = 100;
var pageStart = 0;
var searchParamsArray = [];
var totalRowsCount = 0;

//add functionality to those variables:
var pageNumber = 1;
var sortByColumn = "Name";
var documentTypeId = 1;
var callbackDone;
var sEcho1;

/**
 * 
 */
exports.get = function(search_params,iDisplayStart,iDisplayLength,sEcho, done) {
	var connection = db.getConnection();
	
	sortByColumn = "Name";
	documentTypeId = 1;
	
	pageSize = iDisplayLength;
	pageStart = iDisplayStart;
	
	if(iDisplayStart == 0){
		pageNumber = 1;
	} else {
		pageNumber = iDisplayStart/iDisplayLength +1;
	}
	
	sEcho1 = sEcho;
	callbackDone = done;
	searchParamsArray = search_params;
	
	connection.on('connect', function(err) {
		  if (err) {
		    console.log(err);
		  } else {
			  loadMapObjects(iDisplayStart,iDisplayLength,done,connection);
		  }
	});
}

/**
 * this is inner function to fill temp table with data
 * 
 * @param connection
 */
function createFillMapObjectsTempTable(connection, selectedMapObjsTempTableName, values){
	console.log("createFillMapObjectsTempTable");
	
	var query = "SELECT  Object, Layer FROM [wells_eom_shp] ";
	/* Begin transaction */
	connection.beginTransaction(function(err) {
		
		console.log("beginTransaction");
		
		if (err) { throw err; }
	  
		var sqlCreateTempTable = "IF EXISTS( DROP TABLE [" + selectedMapObjsTempTableName;
		sqlCreateTempTable += "] )";
			
		sqlCreateTempTable = "CREATE TABLE [" + selectedMapObjsTempTableName;
		sqlCreateTempTable += "] (";
		sqlCreateTempTable += " LayerID int, [Object] nvarchar(250))";
		
		connection.query(sqlCreateTempTable, function(err, result) {
			if (err) { 
				console.log("err");
				connection.rollback(function() {
					throw err;
				});
			}
	 
			var log = result.insertId;
	 
			connection.query('INSERT INTO ' + selectedMapObjsTempTableName +' SET Object=?', 'dd', function(err, result) {
				if (err) { 
					connection.rollback(function() {
						throw err;
					});
				}  
				connection.commit(function(err) {
					if (err) { 
						connection.rollback(function() {
							throw err;
						});
					}
					console.log('Transaction Complete.');
					connection.end();
				});
			});
		});
	});

}

/**
 * 
 * @param done
 * @param connection
 */
function loadMapObjects(iDisplayStart,iDisplayLength,done,connection) {
	
	console.log(iDisplayStart + ' iDisplayStart');
	
	iDisplayStart = 1;
	iDisplayLength = 50;
	
	var data1 = [];
	
	values = ['21','22','333'];
	createFillMapObjectsTempTable(connection, "olatestmaptemtable", values);
	
	var query = "SELECT  Object, Layer FROM [wells_eom_shp] ";
	
	query += " ORDER BY Object OFFSET "+iDisplayStart+" ROWS FETCH NEXT "+iDisplayLength+" ROWS ONLY";
	
	//var mainQuery = " exec V5_SearchForMapObjects  "+sessionId+","+mapObjectSearchDialogTable+", "+searchObject+", "+selectedMapObjsTempTableName;
	//mainQuery += " , "+selectedDocsTempTableName+" , 0, null, 0";
	//mainQuery+=" , "+docsMore0+" , "+sortByColumn+",";
	//mainQuery += pageNumber+","+pageSize+", "+countParam+", "+layerId+", "+userName+" ,?";
	
	
	var draw = iDisplayStart/iDisplayLength + 1;
	

	
	 console.log(query + ' query111');
	
	  request = new Request(query, function(err, rowCount) {
	    if (err) {
	      console.log(err);
	    } else {
	    	
		    var res1 ={
		    		"draw": draw,
		    		"iTotalRecords": "200",
		    		"iTotalDisplayRecords": "200",
		    		"aaData":data1
		    	  };
		    
		    console.log(JSON.stringify(data1));
		    done(null,res1);
	      console.log(rowCount + ' rows');
	    }
	    connection.close();
	  });

	  request.on('row', function(columns) {
		  var doc = new MapObject(1);
	    columns.forEach(function(column) {
	      if (column.value === null) {

	      } else if(column.metadata.colName == 'Layer'){
	    	  doc.layerName = column.value;
	      } else if(column.metadata.colName == 'Object'){
	    	  doc.object = column.value;
	      }
	    });
	    data1.push(doc);

	  });
	  
	  request.on('done', function (rowCount, more, rows) { 
		  console.log('DONE');
	  });

	connection.execSql(request);
}

/**
 * 
 * @param connection
 */
function executeMainSearchMapObjSP( connection){
	
	var totalNrRecords = 0;
	var data1 = [];
	var draw = pageStart/pageSize + 1;
	console.log("---executeMainSearchMapObjSP: "+(new Date()).getHours()+":"+(new Date()).getMinutes()+'   ');
	
	var countParam = 1;
	if(pageNumber >= 2)
		countParam = 1;
	

	var mainQuery = " exec V5_SearchForMapObjects  "+sessionId+","+mapObjectSearchDialogTable+", "+searchObject+", "+selectedMapObjsTempTableName;
	mainQuery += " , "+selectedDocsTempTableName+" , 0, null, 0";
	mainQuery += " , "+docsMore0+" , "+sortByColumn+",";
	mainQuery += pageNumber+","+pageSize+", "+countParam+", "+layerId+", "+userName+" ,?";
		
	console.log(' query:'+mainQuery);
	
	request = new Request(mainQuery, function(err, rowCount) {
		if (err) {
			console.log(err);
		} else {
			
			nrOfRecords = 0;
			if(data1.length > 0){
				nrOfRecords = data1.length;
			}
			var res1 = {
					"draw": draw,
					"iTotalRecords": nrOfRecords,
			    	"iTotalDisplayRecords": totalNrRecords,
			    	"sEcho": sEcho1,
			    	"aaData":data1
			    };
			callbackDone(null,res1);
			console.log(rowCount + ' rows finel');
		}
		//connection.close();
	});
	
	request.addOutputParameter('number', TYPES.Int);
	
	request.on('returnValue', function(parameterName, value, metadata) {
		totalNrRecords = value;
	    console.log(parameterName + ' = ' + value);      // number = 42
	                                                     // string = qaz
	  });
	
	request.on('row', function(columns) {
		var doc = new Document(1);
		columns.forEach(function(column) {
			 if (column.metadata.colName === "Doc_Name") {
				//console.log('row '+column.value);
				doc.name = column.value.substring(0, 50);;
			}	else if (column.metadata.colName === "Doc_ID") {
					//console.log('row '+column.value);
				doc.id = column.value;
			}	else if (column.metadata.colName === "Hist_FileName") {
				//console.log('row '+column.value);
				doc.Hist_FileName = column.value;
			} else {
				doc[column.metadata.colName] = column.value;
			}
			
			
		});
		data1.push(doc);
	});
	
	connection.execSql(request);
	
}
