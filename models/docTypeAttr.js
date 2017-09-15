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
var columns = ['faf','sff','lololo'];

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

	var resTypesCollection = new Map();
	var docTypes = [];
	var typesArrayToGo = [];
	
	var query = "SELECT LTRIM(RTRIM(tc.TableName))  as TableName, tc.ColumnName, tc.Type, tc.DocTypeID, tc.LookupType FROM tableColumns tc  ";
	if(tableType === "Document"){
		query += " WHERE tc.TableName LIKE '%GlobalDocFields_GS%'";

    	query += " UNION ";
    	query += " SELECT LTRIM(RTRIM(tc.TableName)) as TableName , tc.ColumnName, tc.Type, tc.DocTypeID, tc.LookupType FROM tableColumns tc  ";
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
			//resultData.forEach((value, key) => {
			console.log(typesArrayToGo);
				loadLookupValuesForDocType(resTypesCollection,typesArrayToGo[0],typesArrayToGo, done, connection);
			//});
		}
		//connection.close();
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
			} else if(column.metadata.colName == 'LookupType'){
				doc.lookupType = column.value;
			} else {
				// console.log('n: '+column.metadata.colName);
			//	doc.name = column.value;
				
			}
		});
		
		//console.log('doc: '+doc.docTypeId+" "+doc.columnName);
		//resultData.push(doc);
		
		doc.columns = ['faf','sff','lololo'];
		
		if(resTypesCollection.get(doc.docTypeId) == undefined){
			resTypesCollection.set(doc.docTypeId,[]);
			typesArrayToGo.push(doc.tableName);
		}
		(resTypesCollection.get(doc.docTypeId)).push(doc);
	});

	connection.execSql(request);
}

/**
 * recurent function that will load all columns joined with lookup values
 * 
 */
function loadLookupValuesForDocType(resTypesCollection,tableName,typesArrayToGo, done, connection){
	console.log("--- "+(new Date()).getHours()+":"+(new Date()).getMinutes()+' loadLookupValues ');
	var docTypeColumns = [];
	
	var resColumnsCollection = new Map();

	//if(typeof value[0].lookupType ==='undefined')
	
		commonSearchInputTempTableName = "witemptestdocCommon1";
		var query = "SELECT LTRIM(RTRIM(tc.TableName)) as TableName, tc.ColumnName, tc.Type, tc.DocTypeID, tc.LookupType, ";
		query += "  [LookupValue]  FROM tableColumns tc ";//where LookupType = '"+value[0].lookupType+"'";
		query += " left JOIN docfieldlookup dt ON dt.LookupType = tc.ColumnName";
		query += " WHERE tc.TableName =  '"+tableName+"'";
		
		//console.log('DONEquery'+query);
		
		request = new Request(query, function(err, rowCount) {
			if (err) {
				console.log(err);
			} else {
				
				var columnsForType = [];
				
				var docId = 0;
				
				resColumnsCollection.forEach((value, key) => {
					//var obj = new Object();
					//obj.key = key;
					//obj.value = JSON.stringify(value);
					docId = value.docTypeId;
					//console.log('obj.value '+obj.value);
					columnsForType.push(value);
				});
				
				typesArrayToGo = typesArrayToGo.slice(typesArrayToGo.indexOf(tableName)+1);
				console.log(typesArrayToGo.indexOf(tableName)+" "+tableName + ' NEXT '+typesArrayToGo);
				if(typesArrayToGo.length < 1){
					console.log('DONE');
					var datares = [];
					resTypesCollection.forEach((value, key) => {
						var obj = new Object();
						obj.key = key;
						obj.value = JSON.stringify(value);
						datares.push(obj);
					});
					
					var res1 = {"data":datares};
				    done(null,res1);
				    console.log(rowCount + ' rows');
				}	else {
					console.log(docId+' smalldone-=--------------- '+columnsForType);
					resTypesCollection.set(docId, columnsForType);
					loadLookupValuesForDocType(resTypesCollection,typesArrayToGo[0],typesArrayToGo, done, connection);
				}
				//var res1 = {"data":datares};

			   // 
			    
			}
		});
		
		request.on('row', function(columns) {
			var doc = new DocTypeAttr(0);
			var lookupValue = 'dd';
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
				} else if(column.metadata.colName == 'LookupType'){
					doc.lookupType = column.value;
				} else if(column.metadata.colName == 'LookupValue'){
					lookupValue = column.value;
					
				}
			});
			
			//doc.columns = ['faf','sff','lololo'];
			
			if(resColumnsCollection.get(doc.columnName) == undefined){
				doc.columns = [lookupValue];
				resColumnsCollection.set(doc.columnName,doc);
				
			} else {
				(resColumnsCollection.get(doc.columnName)).columns.push(lookupValue);
			}
		});
		connection.execSql(request);

}