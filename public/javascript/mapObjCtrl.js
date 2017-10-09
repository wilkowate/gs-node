const ACTIVE_LAYER_ID = "ActivelayerID";

const MAPOBJ_SPDLG_OBJNAME = "MAPOBJ_SPDLG_OBJNAME";


$( document ).ready(function() {
	
	$(function() {
		var parameters = { id:1 };
		$.getJSON( '/docProcessor/loadMapTypes',parameters, function(data) {
			loadMapLayersCollection("mapSearchDlg",data);
			registerDocSearchDlgEvents();
			$("#mapSearchDlg .tabsPanel li:eq(1) a").tab('show');
		});
	});
	
	mapobjSPLayerId = 0;
	
	var cols = [ { "data": "Object", "name": "Object" },
                 { "data": "Layer", "width":"30%" }
                 ];
	initMapObjsTable(cols);
	
	$("#mapObjTblForm .mapLayersCombo").on('change',function () {
		var d = mapLayersCollection.get("mapSearchDlg_"+$(this).val());
		
		mapObjsTbl.destroy();
		
		var header = "<tr><th>Doc_ID</th><th>Name</th>";
		var cols = [{ "data": "Object", "name": "Object" },
	                 { "data": "Layer", "width":"30%" }
	                 ];
		
		for(i = 0; i<d.length; i++){
			col = {"data":"DT_"+d[i].columnName};
			cols.push(col);
			header += "<th>"+d[i].columnName+"</th>";
		}
		
		$('#mapObjsTbl thead').html(""+header+"</tr>");

		initMapObjsTable(cols);
		//addNewTab("docSearchDlg", $(this).val());
	});
	 
	$("#fireMapSearchBtn").on("click", function() {
		$("#fireMapSearchBtn").attr('src',"images/icons/map-search-ok.gif");		 
		mapObjsTbl.draw(1);
	});
	
	
	///// MAIN FIRE SEARCH DOC /////////////////////////
	$("#submitMapObjSPDlg").on('click',function(event){
		
		$("#fireMapSearchBtn").attr('src',"images/icons/map-search-fire.gif");
		mapObjCommonSPDlg = [];
		mapObjSPDlg = [];
		
		//////////////// common form ///////////////////////////////////
		var include = true;
		var searchForObj = {};
		$("#mapCommonSearchForm").find(':input').each(function(i) {
			if(this.value != ""){
				var obj = { name: this.name};
				
				if(this.name === 'MapObjName'){
					searchForObj = { name: this.name};
					searchForObj.value = this.value;
					searchForObj.type = 'text';
					searchForObj.sfOrder = '0';
					searchForObj.columnName = 'SearchFor';
				}
			}
		});
		if(include){
			mapObjCommonSPDlg.push(searchForObj);
		}
		//////////////// end common form ////////////////////
		

		$("#mapLayersSearchForm").find(':input').each(function(i) {
			//alert('submit'+this.value);
			if(this.value != "" && this.name != ""){
				var obj = { name: this.name};
				
				if(this.type === 'select-multiple'){
					var list= this.selectedOptions;
					var tempValue = "";
					for (var i = 0; i < list.length; i++) {
						if(i>0){
							tempValue += ",";
						}
						tempValue += list[i].value;
					   // console.log(list[i].value); //second console output
					}
					obj.value = tempValue;
				} else {				
					obj.value = this.value;
				}
				obj.columnName = this.getAttribute('data-columnName');
				obj.id = this.getAttribute('data-id');
				obj.sfOrder = this.getAttribute('data-sfOrder');
				obj.type = this.getAttribute('data-type');
				mapObjSPDlg.push(obj);
				
			}
		});
	});

});

