/**
 * http://usejsdoc.org/
 */

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

var db = require('./database.js');

var name = '';
var fileName ='';
var id = 0;

function Document(id){
	this.id = id;
}


var catsTempTable = "null";
var categoriesTempTableName = "null";
var categoryDocsTempTableName = "null";
var commonSearchInputTempTableName = "null";
var globalSearchInputTempTableName = "null";
var docSearchInputTempTableName = "null";
var mapTempTable = "null";
var briefcaseTempTable = "null";
var briefcaseId = -1;
var docEditTempTable = "null";
var includeHiddenDocs = 0;
var uniqueOnly = 0;
var totalRowsCount = 0;
var filesizeUnit = 1;
var includeItemsPresent = false;
var userName = "irena";
var sessionId = 0;
var pageSize = 100;

var pageStart = 0;

var searchParamsArray = [];

//add functionality to those variables:
var pageNumber = 1;
var sortByColumn = "Name";
var documentTypeId = 1;

var callbackDone;

//CONSTS:
const DOC_SEARCH_DIALOG_COMMON_FORM = "DOC_SEARCH_DIALOG_COMMON_FORM";


/**
 * 
 */
exports.get = function(search_params,iDisplayStart,iDisplayLength, done) {
	var connection = db.getConnection();
	
	pageSize = iDisplayLength;
	pageStart = iDisplayStart;
	callbackDone = done;
	searchParamsArray = search_params;
	//pageNumber = (iDisplayLength)/pageSize;
	
	connection.on('connect', function(err) {
		if (err) {
			console.log(err);
		} else {
			loadDocs(iDisplayStart,iDisplayLength,done,connection);
		}
	});
}

/**
 * 
 * @param iDisplayStart
 * @param iDisplayLength
 * @param done
 * @param connection
 */
function loadDocs(iDisplayStart,iDisplayLength,done,connection) {
	console.log("--- "+(new Date()).getHours()+":"+(new Date()).getMinutes()+' loadDocs');
	var data1 = [];
	var query = "SELECT  Name FROM Document ";
	query += " ORDER BY Name OFFSET "+iDisplayStart+" ROWS FETCH NEXT "+iDisplayLength+" ROWS ONLY";
	var draw = iDisplayStart/iDisplayLength + 1;

	request = new Request(query, function(err, rowCount) {
		if (err) {
			console.log(err);
		} else {
			var res1 = {
				"draw": draw,
				"iTotalRecords": "200",
		    	"iTotalDisplayRecords": "200",
		    	"aaData":data1
		    };
		    
			console.log(JSON.stringify(data1));
			//done(null,res1);
			createDocTypeTempTable(connection);
			console.log(rowCount + ' rows');
		}
		//connection.close();
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

/**
 * 
 */
function createDocTypeTempTable( connection){
	
	console.log("1--- "+(new Date()).getHours()+":"+(new Date()).getMinutes()+' insertDocTypeTempTable');
	
	var tempTableName = "witemptestdoctypes";
	
	//var sqlCreateTempTable = " if not exists (select * from sysobjects where name='"+tempTableName+"' ) CREATE TABLE [" + tempTableName;
	//sqlCreateTempTable += "] ( "+ " SearchField nvarchar(max),";
	//sqlCreateTempTable += " SearchFieldType nvarchar(10),";
	//sqlCreateTempTable += " SearchValue nvarchar(max),";
	//sqlCreateTempTable += " SearchFieldOrder tinyint )";
	
	
	var sqlCreateTempTable = " if not exists (select * from sysobjects where name='"+tempTableName+"' ) CREATE TABLE [" + tempTableName;
	sqlCreateTempTable += "] ( SearchDocTypeID int,	";
	sqlCreateTempTable += " SearchField nvarchar(max),";
	sqlCreateTempTable += " SearchFieldType nvarchar(10),";
	sqlCreateTempTable += " SearchValue nvarchar(max),";
	sqlCreateTempTable += " SearchFieldOrder tinyint)";
	
	request = new Request(sqlCreateTempTable, function(err, rowCount) {
		if (err) {
			console.log(err);
		} else {
			var res1 = {
				"draw": "1"
		    };
			console.log(' okokokokokok');
			populateDocTypeTempTable(tempTableName, connection);
			
		}
		//connection.close();
	});
	
	request.on('done', function (rowCount, more, rows) { 
		console.log('DONE');
	});

	connection.execSql(request);
	
}

/**
 * 
 */
function createDocCommonTempTable( connection){
	console.log("--- "+(new Date()).getHours()+":"+(new Date()).getMinutes()+' createDocCommonTempTable');
	
	 commonSearchInputTempTableName = "witemptestdocCommon";
	
	var sqlCreateTempTable = " if not exists (select * from sysobjects where name='"+commonSearchInputTempTableName;
	sqlCreateTempTable += "' ) CREATE TABLE [" + commonSearchInputTempTableName;
	sqlCreateTempTable += "] ( "+ " SearchField nvarchar(max),";
	sqlCreateTempTable += " SearchFieldType nvarchar(10),";
	sqlCreateTempTable += " SearchValue nvarchar(max),";
	sqlCreateTempTable += " SearchFieldOrder tinyint )";
	
	request = new Request(sqlCreateTempTable, function(err, rowCount) {
		if (err) {
			console.log(err);
		} else {
			populateDocCommonTempTable( connection);
		}
	});
	connection.execSql(request);
}

/**
 * 
 */
function populateDocTypeTempTable( tempTableName, connection){
	
	console.log("2--- "+(new Date()).getHours()+":"+(new Date()).getMinutes()+' testarray'+docEditTempTable);
	
	var q = "INSERT INTO " + tempTableName
	+ " (SearchDocTypeID ,SearchField,SearchFieldType,SearchValue,SearchFieldOrder) VALUES (2,'v','b','kkb',1)";
	q += "; INSERT INTO " + tempTableName
	+ " (SearchDocTypeID ,SearchField,SearchFieldType,SearchValue,SearchFieldOrder) VALUES (21,'v','b','kkb',1)";
	q += "; INSERT INTO " + tempTableName
	+ " (SearchDocTypeID ,SearchField,SearchFieldType,SearchValue,SearchFieldOrder) VALUES (22,'v','b','kkb',1);";
	console.log("query: " + q);
	
	if(typeof searchParamsArray !== "undefined"){
	var docTypesArray = searchParamsArray[0].DOC_SEARCH_DIALOG_COMMON_FORM;
	//$.each(docTypesArray, function(i, obj) {
		
	//});
	console.log('docTypesArray'+docTypesArray);
	}
	request = new Request(q, function(err, rowCount) {
		if (err) {
			console.log(err);
		} else {
			var res1 = {
				"draw": "1"
		    };
		    
			createDocCommonTempTable(connection);
			console.log(rowCount + ' rows');
		}
		//connection.close();
	});
	
	
	
	connection.execSql(request);
	
}

/**
 * 
 */
function populateDocCommonTempTable( connection){
	
	console.log("--- "+(new Date()).getHours()+":"+(new Date()).getMinutes()+' populateDocCommonTempTable');
	
	var q = "INSERT INTO " + commonSearchInputTempTableName
	+ " (SearchField,SearchFieldType,SearchValue,SearchFieldOrder) VALUES ('SearchFor','Text','postponement',0)";
	
	q += "INSERT INTO " + commonSearchInputTempTableName
	+ " (SearchField,SearchFieldType,SearchValue,SearchFieldOrder) VALUES ('Include',NULL,'Name',0)";
	
	console.log("query: " + q);
	
	if(typeof searchParamsArray !== "undefined"){
	var docTypesArray = searchParamsArray[0].DOC_SEARCH_DIALOG_COMMON_FORM;
	//$.each(docTypesArray, function(i, obj) {
		
	//});
	console.log('docTypesArray'+docTypesArray);
	}
	request = new Request(q, function(err, rowCount) {
		if (err) {
			console.log(err);
		} else {
			var res1 = {
				"draw": "1"
		    };
		    
			executeMainSearchSP(connection);
			console.log(rowCount + ' rows');
		}
		//connection.close();
	});
	
	
	
	connection.execSql(request);
	
}


/**
 * 
 */
function executeMainSearchSP( connection){
	
	var data1 = [];
	var draw = pageStart/pageSize + 1;
	
	console.log("3--- "+(new Date()).getHours()+":"+(new Date()).getMinutes()+' executeMainSearchSP  ');
	
	var countParam = 1;
	if(pageNumber >= 2)
		countParam = 1;
	
	var query = " exec V5_SearchForDocuments 280,"+commonSearchInputTempTableName+", "+globalSearchInputTempTableName+", "+docSearchInputTempTableName;
	query += ", "+countParam+", "+includeHiddenDocs+", 0, "+userName+",";
	query += categoriesTempTableName+","+categoryDocsTempTableName+", null,"+briefcaseId+", "+briefcaseTempTable+", "+mapTempTable+","+uniqueOnly+",";
	query += pageNumber+","+pageSize+","+sortByColumn+","+documentTypeId+",@number";
	
	console.log(' query:'+query);
	
	request = new Request(query, function(err, rowCount) {
		if (err) {
			console.log(err);
		} else {
			var res1 = {
					"draw": draw,
					"iTotalRecords": "200",
			    	"iTotalDisplayRecords": "200",
			    	"aaData":data1
			    };
			callbackDone(null,res1);
			console.log(rowCount + ' rows finel');
		}
		//connection.close();
	});
	
	request.addOutputParameter('number', TYPES.Int);
	
	request.on('returnValue', function(parameterName, value, metadata) {
	    console.log(parameterName + ' = ' + value);      // number = 42
	                                                     // string = qaz
	  });
	
	request.on('row', function(columns) {
		var doc = new Document(1);
		columns.forEach(function(column) {
			if (column.value === null) {
				
				//console.log('n: '+column.metadata.colName);
			} else if (column.metadata.colName === "Doc_Name") {
				//console.log('row '+column.value);
				doc.name = column.value;
				
			}
		});
		data1.push(doc);
	});
	
	connection.execSql(request);
	
}
