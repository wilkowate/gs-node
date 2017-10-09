const DOC_TYPE_ID = "DocTypeID";

const DOC_SEARCH_DIALOG_COMMON_FORM = "DOC_SEARCH_DIALOG_COMMON_FORM";
const DOC_SEARCH_DIALOG_TYPE_FIELDS = "DOC_SEARCH_DIALOG_TYPE_FIELDS";
const DOC_SEARCH_DIALOG_GLOBAL_FIELDS = "DOC_SEARCH_DIALOG_GLOBAL_FIELDS";

$( document ).ready(function() {

	var cols = [
                { "name": "id","data": "id" },
                 { "data": "name", "width":"30%" }
                 ];
	initDocsTable(cols);
	
	$("#docTableSearchForm .docTypesCombo").on('change',function () {
		var d = docTypesCollection.get("docSearchDlg_"+$(this).val());
		
		docsTable.destroy();
		
		var header = "<tr><th>Doc_ID</th><th>Name</th>";
		var cols = [
                { "name": "Doc_id","data": "id" },
		            { "data": "name", "width":"30%" }
	                 ];
		
		for(i = 0; i<d.length; i++){
			col = {"data":"DT_"+d[i].columnName};
			cols.push(col);
			header += "<th>"+d[i].columnName+"</th>";
		}
		
		$('#docs thead').html(""+header+"</tr>");

		initDocsTable(cols);
		//addNewTab("docSearchDlg", $(this).val());
	});
	 
	$(function() {
		var parameters = { id:1 };
		$.getJSON( '/docProcessor/loadDocTypes',parameters, function(data) {
			loadDocTypesCollection("docSearchDlg",data);
			//addNewTab("docSearchDlg");
			//first tab is selected:
			registerDocSearchDlgEvents();

			$("#docSearchDlg .tabsPanel li:eq(1) a").tab('show');
		});
	});
	
	$("#fireDocSearchBtn").on("click", function() {
		$("#fireDocSearchBtn").attr('src',"images/icons/DEV_SD_green.png");		 
		docsTable.draw(1);
	});
	
	///// submit doc search dialog form /////////////////////////
	$("#submitDocSPDlg").on('click',function(event){
		
		$("#fireDocSearchBtn").attr('src',"images/icons/DEV_SD_red.gif");
		//event.preventDefault() ;
		//event.stopPropagation();
		docCommonDlgSP = [];
		docSPDlg = [];
		docGlobalSPDlg = [];
		
		//////////////// common form ///////////////////////////////////
		var include = false;
		var searchForObj = {};
		$("#docCommonSearchForm").find(':input').each(function(i) {
			if(this.value != ""){
				var obj = { name: this.name};
				
				if(this.name === 'SearchFor'){
					searchForObj = { name: this.name};
					searchForObj.value = this.value;
					searchForObj.type = 'text';
					searchForObj.sfOrder = '0';
					searchForObj.columnName = 'SearchFor';
				}
				if(this.name.startsWith("Include")){
					if(this.checked){
						obj = { name: this.name};
						obj.value = this.getAttribute('data-columnName');
						obj.columnName = 'Include';
						obj.type = 'NULL';//this.getAttribute('data-type');
						obj.sfOrder = this.getAttribute('data-sfOrder');
						docCommonDlgSP.push(obj);
						include = true;
					}
				}
			}
		});
		if(include){
			docCommonDlgSP.push(searchForObj);
		}
		//////////////// end common form ////////////////////
		
		
		$("#docTypesSearchForm").find(':input').each(function(i) {
			
			//alert(this.type +"  "+ this.value+" n: "+this.name);
			
			if(this.value != "" && this.name != ""){
				var obj = { name: this.name};
				
				if(this.type === 'select-multiple'){
					var list= this.selectedOptions;
					var tempValue = "";
					for (var i = 0; i < list.length; i++) {
						//alert('list '+list[i].value);
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
				if(obj.id == 0){
					docGlobalSPDlg.push(obj);
				} else {
					docSPDlg.push(obj);
				}
			}
		});
	});

});

