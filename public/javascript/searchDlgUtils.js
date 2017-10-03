/**
 * This is a common place for both doc and map object search dialog
 */


/**
  * 
  * @param cols
  */  
function initDocsTable(cols){
	
	docsTable = $('#docs').DataTable( {
		"bProcessing": true,
		"sAjaxSource": "/documents/search",
		"fnServerParams": function ( aoData ) {

			var sa = [];
			var obj = new Object();
			var chApplySD = $("#docTableSearchForm [name='applySearchCriteria']");
			
			//if(docSPdocType > 0){
				obj.DOC_SP_DOC_TYPE = docSPdocType;
				sa.push(obj);
			//}

			if(chApplySD.is(':checked')){
				if(typeof docCommonDlgSP !== "undefined"){
					obj.DOC_SEARCH_DIALOG_COMMON_FORM = docCommonDlgSP;
				}
				if(typeof docGlobalSPDlg !== "undefined"){
					obj.DOC_SEARCH_DIALOG_GLOBAL_FIELDS = docGlobalSPDlg;
				}
				if(typeof docSPDlg !== "undefined"){
					obj.DOC_SEARCH_DIALOG_TYPE_FIELDS = docSPDlg;
				}
				sa.push(obj);
			}
			 aoData.push( { "name": "search_params", "value": sa } );
         },
       // "fnServerParams": paramsArray,
 	     "bServerSide": true,
 	     "scrollX": true,
 	    "scrollY": "200px",
 	    "columns": cols
		 } );
}


function registerDocSearchDlgEvents(){

//$("#docSearchDlg .closeTab").click(function () {
//    	alert("close");
//        //there are multiple elements which has .closeTab icon so close the tab whose close icon is clicked
//        var tabContentId = $(this).parent().attr("href");
//        $(this).parent().parent().remove(); //remove li of tab
//        $('#docSearchDlg a:last').tab('show'); // Select first tab
//        $(tabContentId).remove(); //remove respective tab content
//
//    });

	$("#docSearchDlg .docTypesCombo").on('change',function () {
		addNewTab("docSearchDlg", $(this).val());
	});
}

function loadDocTypesCollection(dlgName, data){			
	docTypesCollection = new Map();
		
	$.each(data.data, function(i, layer) {
		var a = $.parseJSON(layer.value);
		//alert(i+'id '+a[0].docTypeId);
		docTypesCollection.set("docTypeTabId"+a[0].docTypeId,a);
		
		if(a[0].docTypeId == 0){
			addNewTab("docSearchDlg", 0);
		}
		
		$(".docTypesCombo").append('<option value="'+a[0].docTypeId+'">'+a[0].tableName+'</option>');
		
	});
}

function addNewTab(dlgName, typeName) {
	var a = docTypesCollection.get("docTypeTabId"+typeName);
	populateSearchTab("docSearchDlg", a);
	var nr = $("#"+dlgName+" .tabNames li").length - 1;
	$("#tabsPanel li:eq("+nr+") a").tab('show');
}


function populateSearchTab(dlgName, a){			
	//var a = $.parseJSON(layer.value);
	//docTypesMap.set(a[0].tableName,a);
	
	var tabId = "docTypeTabId"+a[0].docTypeId;
	
	var tabHeader = '<li><a data-toggle="tab" href="#'+tabId+'">';
	
	if(a[0].tableName.startsWith('Document')){
		tabHeader += '<button class="close closeTab" type="button" >×</button>';
		tabHeader += a[0].tableName.substring(8)+'</a></li>';
	} else {
		tabHeader += a[0].tableName+'</a></li>';
	}
	//tabHeader += '">'+a[0].tableName+'</a></li>';
	
	$("#"+dlgName+" .tabNames").append(tabHeader);
	//$("#"+dlgName+" .tabNames").append('<li><a href="#profile"><button class="close closeTab" type="button" >×</button>Sent</a></a></li>');
	
	$("#"+dlgName+" .tabContent").append('<div id="'+tabId+'" class="tab-pane fade in active pre-scrollable">');
	$.each(a, function(j, docType) {
		console.log('type: '+docType.type+" lookup: "+docType.lookupType);

		if(typeof docType.lookupType != "undefined" && docType.lookupType.length > 0){
			var inputTxt = '<p>'+docType.columnName+':';
			inputTxt += '<select name="tete" id="'+docType.lookupType+'" class="multidemo" multiple="multiple"';
			inputTxt += ' data-columnName="'+docType.columnName+'" ';
			inputTxt += ' data-docTypeId="'+docType.docTypeId+'"';
			inputTxt += ' data-type="List"';
			inputTxt += ' data-sfOrder="0"';
			inputTxt += ' >';
			for (var i = 0; i < docType.columns.length; i++) {
				inputTxt += '<option  value="'+docType.columns[i]+'">'+docType.columns[i]+'</option>';
			}
			inputTxt += ' </select></p>';
			$("#"+tabId).append(inputTxt);
		} else if(docType.type.startsWith('nvarchar')){
			var inputTxt = '<p> '+docType.columnName+'(txt): <input value="" name="';
			inputTxt += docType.docTypeId+"_"+docType.columnName+'"';
			inputTxt += ' data-type="'+docType.type+'"';
			inputTxt += ' data-columnName="'+docType.columnName+'"';
			inputTxt += ' data-docTypeId="'+docType.docTypeId+'"';
			inputTxt += ' data-sfOrder="0"';
			inputTxt += ' type="text"  ><br></p>';
			$("#"+tabId).append(inputTxt);
		} else if(docType.type.startsWith('time')){
			var inputTxt = '<p> '+docType.columnName+'(tm) From: <input size="4" value="" name="';
			inputTxt += docType.docTypeId+"_"+docType.columnName+'"';
			inputTxt += ' data-type="'+docType.type+'"';
			inputTxt += ' data-columnName="'+docType.columnName+'"';
			inputTxt += ' data-docTypeId="'+docType.docTypeId+'"';
			inputTxt += ' data-sfOrder="1"';
			inputTxt += ' type="date"  >';
					
			inputTxt += ' To: <input size="4" value="" name="';
			inputTxt += docType.docTypeId+"_"+docType.columnName+'"';
			inputTxt += ' data-type="'+docType.type+'"';
			inputTxt += ' data-columnName="'+docType.columnName+'"';
			inputTxt += ' data-docTypeId="'+docType.docTypeId+'"';
			inputTxt += ' data-sfOrder="2"';
			inputTxt += ' type="date"  ><br></p>';
					
			$("#"+tabId).append(inputTxt);
		} else {
			var inputTxt = '<p> '+docType.columnName+'(nr) From: <input size="4" value="" name="';
			inputTxt += docType.docTypeId+"_"+docType.columnName+'"';
			inputTxt += ' data-type="'+docType.type+'"';
			inputTxt += ' data-columnName="'+docType.columnName+'"';
			inputTxt += ' data-docTypeId="'+docType.docTypeId+'"';
			inputTxt += ' data-sfOrder="1"';
			inputTxt += ' type="text"  >';
			
			inputTxt += ' To: <input size="4" value="" name="';
			inputTxt += docType.docTypeId+"_"+docType.columnName+'"';
			inputTxt += ' data-type="'+docType.type+'"';
			inputTxt += ' data-columnName="'+docType.columnName+'"';
			inputTxt += ' data-docTypeId="'+docType.docTypeId+'"';
			inputTxt += ' data-sfOrder="2"';
			inputTxt += ' type="text"  ><br></p>';
			
			$("#"+tabId).append(inputTxt);
		}
		$('#'+docType.lookupType).multiselect();

	});
	$("#"+dlgName+" .tabContent").append('</div>');

	registerCloseEvent(dlgName);
}

function registerCloseEvent(dlgName) {

    $(".closeTab").click(function () {

        //there are multiple elements which has .closeTab icon so close the tab whose close icon is clicked
        var tabContentId = $(this).parent().attr("href");
        //alert("tabContentId "+tabContentId);
        $(this).parent().parent().remove(); //remove li of tab
       // $('#'+dlgName+' #tabsPanel a:last').tab('show'); // Select first tab
        $(tabContentId).remove(); //remove respective tab content
        
        $("#tabsPanel li:eq(0) a").tab('show');

    });
}