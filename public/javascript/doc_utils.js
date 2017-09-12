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
		
		$("#docCommonSearchForm").find(':input').each(function(i) {
			if(this.value != ""){
				var obj = { name: this.name};
				obj.value = this.value;
				obj.sfOrder = this.getAttribute('data-sfOrder');
				docCommonDlgSP.push(obj);
			}
		});
		
		$("#docTypesSearchForm").find(':input').each(function(i) {
			if(this.value != ""){
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