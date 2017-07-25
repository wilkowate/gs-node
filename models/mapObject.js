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

/**
 * 
 */
exports.get = function(id,iDisplayStart,iDisplayLength, done) {
	var connection = db.getConnection();
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
	
	console.log(iDisplayStart + ' iDisplayStart');
	
	iDisplayStart = 1;
	iDisplayLength = 50;
	
	var data1 = [];
	
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