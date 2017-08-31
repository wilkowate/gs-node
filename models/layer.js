/**
 * http://usejsdoc.org/
 */

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var db = require('./database.js');

var layerName = '';
var geoServerLayerName = '';
var shapeType = 1;
var nrDocs = 0;
var layerId = 0;
var parentId = 0;
var color = 0;
var wmsVisibilityZoomLevel = 0;
var webVisible = 0;
var webLabelZoomLevel = 0;
var labelsVisible = 0;

function Layer(id){
	this.layerId = layerId;
}

/**
 * 
 */
exports.loadActiveLayers = function(id, done) {
	var connection = db.getConnection();
	connection.on('connect', function(err) {
		  if (err) {
		    console.log(err);
		  } else {
			  loadLayers(id,done,connection);
		  }
	});
}

/**
 * 
 * @param done
 * @param connection
 */
function loadLayers(id,done,connection) {
	
	//console.log(id + ' cat id');
	
	var resultData = [];
	
	var query = "SELECT * FROM ActiveLayers JOIN [MapLayersInfo] ON [MapLayersInfo].Layer =";
	query += " ActiveLayers.Layer where WebEnabled = 1";
	
	  request = new Request(query, function(err, rowCount) {
	    if (err) {
	      console.log(err);
	    } else {
	    	
		    var res1 ={
		    		"layers":resultData
		    	  };
		    
		   // console.log(JSON.stringify(resultData));
		    
		    done(null,res1);
	      console.log(rowCount + ' rows');
	    }
	    connection.close();
	  });

	  request.on('row', function(columns) {
		  var doc = new Layer(1);
		  columns.forEach(function(column) {
	    	//console.log(column.metadata.colName);
	      if (column.value === null) {

	      } else if(column.metadata.colName == 'Layer'){
	    	  doc.layerName = column.value;
	      } else if(column.metadata.colName == 'Color'){
	    	  doc.color = column.value;
	      } else if(column.metadata.colName == 'GeoServerLayerName'){
	    	  doc.geoServerLayerName = column.value;
	      } else if(column.metadata.colName == 'ShapeType'){
	    	  doc.shapeType = column.value;
	      } else if(column.metadata.colName == 'WMSVisibilityZoomLevel'){
	    	  doc.wmsVisibilityZoomLevel = column.value;
	      } else if(column.metadata.colName == 'WebLabelZoomLevel'){
	    	  doc.webLabelZoomLevel = column.value;
	      } else if(column.metadata.colName == 'LabelsVisible'){
	    	  doc.labelsVisible = column.value;
	      } else if(column.metadata.colName == 'WebVisible'){
	    	  doc.webVisible = column.value;
	      } 
	      
	    });
	    resultData.push(doc);

	  });
	  
	  request.on('done', function (rowCount, more, rows) { 
		  console.log('DONE');
	  });

	connection.execSql(request);
}