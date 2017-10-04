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
var sEcho1;
//CONSTS:
//const DOC_SEARCH_DIALOG_COMMON_FORM = "DOC_SEARCH_DIALOG_COMMON_FORM";

/**
 * 
 */
exports.get = function(search_params,iDisplayStart,iDisplayLength,sEcho, done) {
	var connection = db.getConnection();
	
	 catsTempTable = "null";
	 categoriesTempTableName = "null";
	 categoryDocsTempTableName = "null";
	 commonSearchInputTempTableName = "null";
	 globalSearchInputTempTableName = "null";
	 docSearchInputTempTableName = "null";
	 mapTempTable = "null";
	 briefcaseTempTable = "null";
	 briefcaseId = -1;
	 docEditTempTable = "null";
	 includeHiddenDocs = 0;
	 uniqueOnly = 0;
	 totalRowsCount = 0;
	 filesizeUnit = 1;
	 includeItemsPresent = false;
	 userName = "irena";
	 sessionId = 0;

	//add functionality to those variables:
	 
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
	console.log("!!!loadDocs --- "+(new Date()).getHours()+":"+(new Date()).getMinutes()+' :'+commonSearchInputTempTableName);


	if(typeof searchParamsArray !== "undefined"){
		documentTypeId = searchParamsArray[0].DOC_SP_DOC_TYPE;
		createDocCommonTempTable(connection);
	} else {
		executeMainSearchSP(connection);
	}	
	
//	request = new Request(query, function(err, rowCount) {
//		if (err) {
//			console.log(err);
//		} else {
//			var res1 = {
//				"draw": draw,
//				"iTotalRecords": "200",
//		    	"iTotalDisplayRecords": "200",
//		    	"aaData":data1
//		    };
//		    
//			//done(null,res1);
//			createDocGlobalTempTable(connection);
//			console.log(rowCount + ' rows');
//		}
//		//connection.close();
//	});
//
//	request.on('row', function(columns) {
//		var doc = new Document(1);
//		columns.forEach(function(column) {
//			if (column.value === null) {
//			} else {
//				// console.log('n: '+column.metadata.colName);
//				doc.name = column.value;
//				data1.push(doc);
//			}
//		});
//	});
//	  
//	connection.execSql(request);
}

/**
 * 
 */
function createDocTypeTempTable( connection){
	
	console.log("1--- "+(new Date()).getHours()+":"+(new Date()).getMinutes()+' insertDocTypeTempTable');
	var docTypesArray = searchParamsArray[0].DOC_SEARCH_DIALOG_TYPE_FIELDS;
	console.log('docTypesArray.length '+docTypesArray);
	if(typeof docTypesArray !== "undefined" && docTypesArray.length > 0){
	
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for (var i = 0; i < 5; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));
	  
		docSearchInputTempTableName = "witemptestdoctypes"+text;
	
		var sqlCreateTempTable = " if not exists (select * from sysobjects where name='"+docSearchInputTempTableName+"' ) CREATE TABLE [" + docSearchInputTempTableName;
		sqlCreateTempTable += "] ( SearchDocTypeID int,	";
		sqlCreateTempTable += " SearchField nvarchar(max),";
		sqlCreateTempTable += " SearchFieldType nvarchar(10),";
		sqlCreateTempTable += " SearchValue nvarchar(max),";
		sqlCreateTempTable += " SearchFieldOrder tinyint)";
	
		request = new Request(sqlCreateTempTable, function(err, rowCount) {
			if (err) {
				console.log(err);
			} else {
				populateDocTypeTempTable(docTypesArray, connection);
			}
		//connection.close();
		});
		connection.execSql(request);
	} else {
		executeMainSearchSP(connection);
	}

}

/**
 * 
 */
function createDocCommonTempTable( connection){
	console.log("--- "+(new Date()).getHours()+":"+(new Date()).getMinutes()+' createDocCommonTempTable');
	
	var docTypesArray = searchParamsArray[0].DOC_SEARCH_DIALOG_COMMON_FORM;
	//console.log('docTypesArray.length '+docTypesArray);
	if(typeof docTypesArray !== "undefined" && docTypesArray.length > 0){
		commonSearchInputTempTableName = "witemptestdocCommon1";
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
				populateDocCommonTempTable(docTypesArray, connection);
			}
		});
		connection.execSql(request);
	} else {
		createDocGlobalTempTable(connection);
	}
}

/**
 * 
 */
function createDocGlobalTempTable( connection){
	console.log("SD --- "+(new Date()).getHours()+":"+(new Date()).getMinutes()+' globalSearchInputTempTableName');
	var docTypesArray = searchParamsArray[0].DOC_SEARCH_DIALOG_GLOBAL_FIELDS;
	console.log('docTypesArray.length '+docTypesArray);
	if(typeof docTypesArray !== "undefined" && docTypesArray.length > 0){
			
		globalSearchInputTempTableName = "witemptestdocGlobal";
			
		var sqlCreateTempTable = " if not exists (select * from sysobjects where name='"+globalSearchInputTempTableName;
		sqlCreateTempTable += "' ) CREATE TABLE [" + globalSearchInputTempTableName;
		sqlCreateTempTable += "] ( "+ " SearchField nvarchar(max),";
		sqlCreateTempTable += " SearchFieldType nvarchar(10),";
		sqlCreateTempTable += " SearchValue nvarchar(max),";
		sqlCreateTempTable += " SearchFieldOrder tinyint )";
			
		request = new Request(sqlCreateTempTable, function(err, rowCount) {
			if (err) {
				console.log(err);
			} else {
				populateDocGlobalTempTable(docTypesArray, connection);
			}
		});
			
		connection.execSql(request);
	}else {
		createDocTypeTempTable(connection);
	}
	//} else {
	//	createDocTypeTempTable(connection);
	//}
	
}

/**
 * 
 */
function populateDocTypeTempTable( docTypesArray, connection){
	
	console.log("2--- "+(new Date()).getHours()+":"+(new Date()).getMinutes()+docSearchInputTempTableName);
	
	var q = "";
	//var docTypesArray = searchParamsArray[0].DOC_SEARCH_DIALOG_TYPE_FIELDS;
	//$.each(docTypesArray, function(i, obj) {
	for (var i = 0, len = docTypesArray.length; i < len; i++) {
		obj = docTypesArray[i];
		q += " INSERT INTO " + docSearchInputTempTableName + " (SearchDocTypeID ,SearchField,SearchFieldType,SearchValue,SearchFieldOrder) VALUES (" ;
		q += obj.id + ",'"+obj.columnName+"','text','"+obj.value+"',0);";
	}
	console.log('docTypesArray'+docTypesArray);	
	console.log("query: " + q);
	
	request = new Request(q, function(err, rowCount) {
		if (err) {
			console.log(err);
		} else {
			executeMainSearchSP(connection);
		}
		//connection.close();
	});
	
	if(q.length > 0){
		connection.execSql(request);
	} else {
		executeMainSearchSP(connection);
	}
}

/**
 * 
 */
function populateDocCommonTempTable(docTypesArray, connection){
	
	console.log("--- "+(new Date()).getHours()+":"+(new Date()).getMinutes()+' populateDocCommonTempTable');
	
	//var q = "INSERT INTO " + commonSearchInputTempTableName
	//+ " (SearchField,SearchFieldType,SearchValue,SearchFieldOrder) VALUES ('SearchFor','Text','postponement',0)";
	
	//q += "INSERT INTO " + commonSearchInputTempTableName
	//+ " (SearchField,SearchFieldType,SearchValue,SearchFieldOrder) VALUES ('Include',NULL,'Name',0)";
	
	var q="";
	console.log("query: " + q);
	
	for (var i = 0, len = docTypesArray.length; i < len; i++) {
		obj = docTypesArray[i];
		q += " INSERT INTO " + commonSearchInputTempTableName + " (SearchField,SearchFieldType,SearchValue,SearchFieldOrder) VALUES (" ;
		q += "'"+obj.columnName+"','"+obj.type+"','"+obj.value+"',"+obj.sfOrder+");";
		console.log("query: " + q);
	}
	console.log('docTypesArray'+docTypesArray);
	
	
	request = new Request(q, function(err, rowCount) {
		if (err) {
			console.log(err);
		} else {
			createDocGlobalTempTable(connection);
		}
		//connection.close();
	});
	connection.execSql(request);
}

/**
 * 
 */
function populateDocGlobalTempTable(docTypesArray, connection){
	
	console.log("--- "+(new Date()).getHours()+":"+(new Date()).getMinutes()+' populateDocGlobalTempTable');
	var q = "";
	for (var i = 0, len = docTypesArray.length; i < len; i++) {
		obj = docTypesArray[i];
		q += " INSERT INTO " + globalSearchInputTempTableName + " (SearchField,SearchFieldType,SearchValue,SearchFieldOrder) VALUES (" ;
		q += "'"+obj.columnName+"','"+obj.type+"','"+obj.value+"',"+obj.sfOrder+");";
		console.log("query: " + q);
	}
	console.log('docTypesArray'+docTypesArray);
	
	request = new Request(q, function(err, rowCount) {
		if (err) {
			console.log(err);
		} else {
			createDocTypeTempTable(connection);
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
	
	var totalNrRecords = 0;
	var data1 = [];
	var draw = pageStart/pageSize + 1;
	console.log("3--- "+(new Date()).getHours()+":"+(new Date()).getMinutes()+' executeMainSearchSP  ');
	
	var countParam = 1;
	if(pageNumber >= 2)
		countParam = 1;
	
	//commonSearchInputTempTableName = "null";
	
	var query = " exec V5_SearchForDocuments 280,"+commonSearchInputTempTableName+", "+globalSearchInputTempTableName+", "+docSearchInputTempTableName;
	query += ", "+countParam+", "+includeHiddenDocs+", 0, "+userName+",";
	query += categoriesTempTableName+","+categoryDocsTempTableName+", null,"+briefcaseId+", "+briefcaseTempTable+", "+mapTempTable+","+uniqueOnly+",";
	query += pageNumber+","+pageSize+","+sortByColumn+","+documentTypeId+",@number OUTPUT";
	
	console.log(' query:'+query);
	
	request = new Request(query, function(err, rowCount) {
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
