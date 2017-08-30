/**
 * http://usejsdoc.org/
 */

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var db = require('./database.js');

var name = '';
var fileName ='';
var id = 0;

function Document(id){
	this.id = id;
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
			done(null,res1);
			console.log(rowCount + ' rows');
		}
		connection.close();
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