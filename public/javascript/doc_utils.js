const DOC_TYPE_ID = "DocTypeID";
const ACTIVE_LAYER_ID = "ActivelayerID";
const SEP = "___";

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
				$.each(a, function(j, type) {
					$("#"+a[0].tableName).append('<p> '+type.columnName+': <input value="" name="'+type.docTypeId+SEP+type.columnName+'" type="text"  ><br></p>');
					var obj = new Object();
					obj.type = type.type;
					obj.tableName = type.tableName;
					obj.columnName = type.columnName;
					obj.docTypeId = type.docTypeId;
				});
				$("#tabContent").append('</div>');
			});
		});
	});

	$("#searchform").on('submit',function(event){
		event.preventDefault() ;
		event.stopPropagation();
		docSPDlg = [];
		$("#searchform").find(':input').each(function(i) {
			if(this.value != ""){
				var obj = { name: this.name};
				obj.value = this.value;
				docSPDlg.push(obj);
			}
		});
    //alert("Form Submission prevented / stoped. "+JSON.stringify(docSPDlg));
	});

});