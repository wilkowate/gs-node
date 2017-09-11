    
function registerDocSearchDlgEvents(){

$("#docSearchDlg .closeTab").click(function () {
    	alert("close");
        //there are multiple elements which has .closeTab icon so close the tab whose close icon is clicked
        var tabContentId = $(this).parent().attr("href");
        $(this).parent().parent().remove(); //remove li of tab
        $('#docSearchDlg a:last').tab('show'); // Select first tab
        $(tabContentId).remove(); //remove respective tab content

    });

$("#docSearchDlg .docTypesCombo").on('change',function () {
	alert("docSearchDlg"+$(this).val());
	addNewTab("docSearchDlg", $(this).val());

});
}

function addNewTab(dlgName, typeName) {
	var a = docTypesCollection.get(typeName+"d");
	alert(JSON.stringify(a));
	populateSearchTab("docSearchDlg", a);
}



function populateSearchTab(dlgName, a){			
	//var a = $.parseJSON(layer.value);
	//docTypesMap.set(a[0].tableName,a);
	
	var tabId = a[0].docTypeId+"d";
	
	var tabHeader = '<li><a data-toggle="tab" href="#'+tabId;
	tabHeader += '">'+'<button class="close closeTab" type="button" >×</button>';
	tabHeader += a[0].tableName.substring(8)+'</a></li>';
	//tabHeader += '">'+a[0].tableName+'</a></li>';
	
	$("#"+dlgName+" .tabNames").append(tabHeader);
	//$("#"+dlgName+" .tabNames").append('<li><a href="#profile"><button class="close closeTab" type="button" >×</button>Sent</a></a></li>');
	
	$("#"+dlgName+" .tabContent").append('<div id="'+tabId+'" class="tab-pane fade in active pre-scrollable">');
	$.each(a, function(j, docType) {
		console.log('type: '+docType.type);
		if(docType.type.startsWith('nvarchar')){
			var inputTxt = '<p> '+docType.columnName+'(txt): <input value="" name="';
			inputTxt += docType.docTypeId+SEP+docType.columnName+'"';
			inputTxt += ' data-type="'+docType.type+'"';
			inputTxt += ' data-columnName="'+docType.columnName+'"';
			inputTxt += ' data-docTypeId="'+docType.docTypeId+'"';
			inputTxt += ' data-sfOrder="0"';
			inputTxt += ' type="text"  ><br></p>';
			$("#"+tabId).append(inputTxt);
		} else if(docType.type.startsWith('time')){
			var inputTxt = '<p> '+docType.columnName+'(tm) From: <input size="4" value="" name="';
			inputTxt += docType.docTypeId+SEP+docType.columnName+'"';
			inputTxt += ' data-type="'+docType.type+'"';
			inputTxt += ' data-columnName="'+docType.columnName+'"';
			inputTxt += ' data-docTypeId="'+docType.docTypeId+'"';
			inputTxt += ' data-sfOrder="1"';
			inputTxt += ' type="date"  >';
					
			inputTxt += ' To: <input size="4" value="" name="';
			inputTxt += docType.docTypeId+SEP+docType.columnName+'"';
			inputTxt += ' data-type="'+docType.type+'"';
			inputTxt += ' data-columnName="'+docType.columnName+'"';
			inputTxt += ' data-docTypeId="'+docType.docTypeId+'"';
			inputTxt += ' data-sfOrder="2"';
			inputTxt += ' type="date"  ><br></p>';
					
			$("#"+tabId).append(inputTxt);
		} else {
			var inputTxt = '<p> '+docType.columnName+'(nr) From: <input size="4" value="" name="';
			inputTxt += docType.docTypeId+SEP+docType.columnName+'"';
			inputTxt += ' data-type="'+docType.type+'"';
			inputTxt += ' data-columnName="'+docType.columnName+'"';
			inputTxt += ' data-docTypeId="'+docType.docTypeId+'"';
			inputTxt += ' data-sfOrder="1"';
			inputTxt += ' type="text"  >';
			
			inputTxt += ' To: <input size="4" value="" name="';
			inputTxt += docType.docTypeId+SEP+docType.columnName+'"';
			inputTxt += ' data-type="'+docType.type+'"';
			inputTxt += ' data-columnName="'+docType.columnName+'"';
			inputTxt += ' data-docTypeId="'+docType.docTypeId+'"';
			inputTxt += ' data-sfOrder="2"';
			inputTxt += ' type="text"  ><br></p>';
			
			$("#"+tabId).append(inputTxt);
		}

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
        
        $("#tabsPanel li:eq(1) a").tab('show');

    });
}