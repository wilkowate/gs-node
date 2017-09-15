const DOC_TYPE_ID = "DocTypeID";
const ACTIVE_LAYER_ID = "ActivelayerID";
const SEP = "___";

const DOC_SEARCH_DIALOG_COMMON_FORM = "DOC_SEARCH_DIALOG_COMMON_FORM";
const DOC_SEARCH_DIALOG_TYPE_FIELDS = "DOC_SEARCH_DIALOG_TYPE_FIELDS";
const DOC_SEARCH_DIALOG_GLOBAL_FIELDS = "DOC_SEARCH_DIALOG_GLOBAL_FIELDS";

$( document ).ready(function() {
	 
	$(function() {
		var parameters = { id:1 };
		$.getJSON( '/docProcessor/loadDocTypes',parameters, function(data) {
			//JSONObject json = new JSONObject(data.data);
			loadDocTypesCollection("docSearchDlg",data);
			//addNewTab("docSearchDlg");
			//first tab is selected:
			registerDocSearchDlgEvents();

			$("#tabsPanel li:eq(1) a").tab('show');
		});
	});
	
	
	
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
				}
				if(this.name.startsWith("Include")){
				//	alert(this.name+' v '+this.value+" "+(this.value == "on")+"   :"+this.checked);
					if(this.checked){
						
						obj = { name: this.name};
						obj.value = this.value;
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
				
				
				if(this.type === 'select-multiple'){
					var list= this.selectedOptions;
					alert('sel '+list + " n: "+this.name);
					for (var i = 0; i < list.length; i++) {
						alert('list '+list[i].value);
					   // console.log(list[i].value); //second console output
					}
					//alert('sel '+this.type + " n: "+this.name);
					//this.forEach(function( index ) {
					//	  console.log( index + ": " + $( this ).text() );
					//	});
				}
				
				var obj = { name: this.name};
				obj.value = this.value;
				obj.columnName = this.getAttribute('data-columnName');
				obj.docTypeId = this.getAttribute('data-docTypeId');
				obj.sfOrder = this.getAttribute('data-sfOrder');
				if(obj.docTypeId == 0){
					docGlobalSPDlg.push(obj);
				} else {
					docSPDlg.push(obj);
				}
			}
		});
		
    //alert("Form Submission prevented / stoped. "+JSON.stringify(docSPDlg));
	});

//	$("#docTypesSearchForm").on('submit',function(event){
//		event.preventDefault() ;
//		event.stopPropagation();
//		docSPDlg = [];
//		$("#docTypesSearchForm").find(':input').each(function(i) {
//			if(this.value != ""){
//				var obj = { name: this.name};
//				obj.value = this.value;
//				docSPDlg.push(obj);
//			}
//		});
//    //alert("Form Submission prevented / stoped. "+JSON.stringify(docSPDlg));
//	});

});