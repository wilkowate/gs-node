const DOC_TYPE_ID = "DocTypeID";
const ACTIVE_LAYER_ID = "ActivelayerID";
const SEP = "___";

const DOC_SEARCH_DIALOG_COMMON_FORM = "DOC_SEARCH_DIALOG_COMMON_FORM";
const DOC_SEARCH_DIALOG_TYPE_FIELDS = "DOC_SEARCH_DIALOG_TYPE_FIELDS";
const DOC_SEARCH_DIALOG_GLOBAL_FIELDS = "DOC_SEARCH_DIALOG_GLOBAL_FIELDS";

$( document ).ready(function() {
	
	docSPdocType = 0;
	
	var cols = [
                { "name": "id","data": "id" },
                 { "data": "name", "width":"30%" }
                 ];
	initDocsTable(cols);
	
	$("#docTableSearchForm .docTypesCombo").on('change',function () {
		var d = docTypesCollection.get("docTypeTabId"+$(this).val());
		
		docsTable.destroy();

		$('#docs thead').html("<tr><th>jjj</th><th>jjj</th><th>jjj2</th></tr>");
		var cols = [
		            { "data": "name", "width":"30%" },
	                { "name": "id","data": "id" },
	                { "name": "id","data": "id" }
	                 
	                 ];
		
		docSPdocType = $(this).val();
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

			$("#tabsPanel li:eq(1) a").tab('show');
		});
	});
	
	
	///// MAIN FIRE SEARCH DOC /////////////////////////
	$("#applySearchCriteria").on('click',function(event){
		
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
				obj.docTypeId = this.getAttribute('data-docTypeId');
				obj.sfOrder = this.getAttribute('data-sfOrder');
				obj.type = this.getAttribute('data-type');
				if(obj.docTypeId == 0){
					docGlobalSPDlg.push(obj);
				} else {
					docSPDlg.push(obj);
				}
			}
		});
	});

});

