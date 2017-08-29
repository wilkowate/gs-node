$( document ).ready(function() {
	 
	$(function() {
		var parameters = { id:1 };
		$.getJSON( '/docProcessor/loadDocTypes',parameters, function(data) {
			docTypesMap = new Map();
			//JSONObject json = new JSONObject(data.data);
			$.each(data.data, function(i, layer) {
				var a = $.parseJSON(layer.value);
				docTypesMap.set(a[0].tableName,a);
				
				$("#tabNames").append('<li><a data-toggle="tab" href="#'+a[0].tableName+'">'+a[0].tableName+'</a></li>');
				$("#tabContent").append('<div id="'+a[0].tableName+'" class="tab-pane fade in active pre-scrollable">');
				$.each(a, function(i, type) {
					$("#"+a[0].tableName).append('<p> '+type.columnName+': <input id="search" type="text"  ><br></p>');
					var obj = new Object();
					obj.type = type.type;
					obj.tableName = type.tableName;
					obj.columnName = type.columnName;
				});
				$("#tabContent").append('</div>');
			});
		});
	});
		
 });