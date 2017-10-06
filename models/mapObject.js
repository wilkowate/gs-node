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
var docsMore0 = 0;
var layerId = 0;

var userName = "irena";
var sessionId = 0;
var pageSize = 100;
var pageStart = 0;
var searchParamsArray = [];
var totalRowsCount = 0;

//add functionality to those variables:
var pageNumber = 1;
var sortByColumn = "Name";
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
 * 
 * @param done
 * @param connection
 */
function loadMapObjects(iDisplayStart,iDisplayLength,done,connection) {

	if(typeof searchParamsArray !== "undefined"){
		layerId = searchParamsArray[0].MAP_SP_LAYER_ID;
		createMapObjSPDlgTempTable(connection);
	} else {
		executeMainSearchSP(connection);
	}	
}

/**
 * mapObjectSearchDialogTable
 * 
 * @param connection
 */
function createMapObjSPDlgTempTable( connection){
	console.log("--- "+(new Date()).getHours()+":"+(new Date()).getMinutes()+' mapObjectSearchDialogTable');
	
	var docTypesArray = searchParamsArray[0].DOC_SEARCH_DIALOG_COMMON_FORM;
	//console.log('docTypesArray.length '+docTypesArray);
	if(typeof docTypesArray !== "undefined" && docTypesArray.length > 0){
		mapObjectSearchDialogTable = "wimapObjectSearchDialogTable";
		var sqlCreateTempTable = " if not exists (select * from sysobjects where name='"+mapObjectSearchDialogTable;
		sqlCreateTempTable += "' ) CREATE TABLE [" + mapObjectSearchDialogTable;
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
	mainQuery += pageNumber+","+pageSize+", "+countParam+", "+layerId+", "+userName+" ,@number OUTPUT";
		
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
			 doc[column.metadata.colName] = column.value;
		});
		data1.push(doc);
	});
	
	connection.execSql(request);
	
}
