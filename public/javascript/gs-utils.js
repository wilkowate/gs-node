




//function loadDocTypesCollection_old(dlgName, data){			
//	//JSONObject json = new JSONObject(data.data);
//	
//	docTypesCollection = new Map();
//		
//	$.each(data.data, function(i, layer) {
//		var a = $.parseJSON(layer.value);
//		docTypesCollection.set(a[0].tableName,a);
//		
//		
//		$(".docTypesCombo").append('<option value="'+a[0].tableName+'">'+a[0].tableName+'</option>');
//		
//	});
//}


//
//function populateSearchTabs(dlgName, data){			
//	//JSONObject json = new JSONObject(data.data);
//	
//	docTypesMap = new Map();
//		
//	$.each(data.data, function(i, layer) {
//		var a = $.parseJSON(layer.value);
//		docTypesMap.set(a[0].tableName,a);
//		
//		var tabHeader = '<li><a data-toggle="tab" href="#'+a[0].tableName;
//		tabHeader += '">'+'<button class="close closeTab" type="button" >×</button>';
//		tabHeader += a[0].tableName.substring(8)+'</a></li>';
//		//tabHeader += '">'+a[0].tableName+'</a></li>';
//		
//		$("#"+dlgName+" .tabNames").append(tabHeader);
//		//$("#"+dlgName+" .tabNames").append('<li><a href="#profile"><button class="close closeTab" type="button" >×</button>Sent</a></a></li>');
//		
//		$("#"+dlgName+" .tabContent").append('<div id="'+a[0].tableName+'" class="tab-pane fade in active pre-scrollable">');
//		$.each(a, function(j, docType) {
//			console.log('type: '+docType.type);
//			if(docType.type.startsWith('nvarchar')){
//				var inputTxt = '<p> '+docType.columnName+'(txt): <input value="" name="';
//				inputTxt += docType.docTypeId+SEP+docType.columnName+'"';
//				inputTxt += ' data-type="'+docType.type+'"';
//				inputTxt += ' data-columnName="'+docType.columnName+'"';
//				inputTxt += ' data-docTypeId="'+docType.docTypeId+'"';
//				inputTxt += ' data-sfOrder="0"';
//				inputTxt += ' type="text"  ><br></p>';
//				$("#"+a[0].tableName).append(inputTxt);
//			} else if(docType.type.startsWith('time')){
//				var inputTxt = '<p> '+docType.columnName+'(tm) From: <input size="4" value="" name="';
//				inputTxt += docType.docTypeId+SEP+docType.columnName+'"';
//				inputTxt += ' data-type="'+docType.type+'"';
//				inputTxt += ' data-columnName="'+docType.columnName+'"';
//				inputTxt += ' data-docTypeId="'+docType.docTypeId+'"';
//				inputTxt += ' data-sfOrder="1"';
//				inputTxt += ' type="date"  >';
//						
//				inputTxt += ' To: <input size="4" value="" name="';
//				inputTxt += docType.docTypeId+SEP+docType.columnName+'"';
//				inputTxt += ' data-type="'+docType.type+'"';
//				inputTxt += ' data-columnName="'+docType.columnName+'"';
//				inputTxt += ' data-docTypeId="'+docType.docTypeId+'"';
//				inputTxt += ' data-sfOrder="2"';
//				inputTxt += ' type="date"  ><br></p>';
//						
//				$("#"+a[0].tableName).append(inputTxt);
//			} else {
//				var inputTxt = '<p> '+docType.columnName+'(nr) From: <input size="4" value="" name="';
//				inputTxt += docType.docTypeId+SEP+docType.columnName+'"';
//				inputTxt += ' data-type="'+docType.type+'"';
//				inputTxt += ' data-columnName="'+docType.columnName+'"';
//				inputTxt += ' data-docTypeId="'+docType.docTypeId+'"';
//				inputTxt += ' data-sfOrder="1"';
//				inputTxt += ' type="text"  >';
//				
//				inputTxt += ' To: <input size="4" value="" name="';
//				inputTxt += docType.docTypeId+SEP+docType.columnName+'"';
//				inputTxt += ' data-type="'+docType.type+'"';
//				inputTxt += ' data-columnName="'+docType.columnName+'"';
//				inputTxt += ' data-docTypeId="'+docType.docTypeId+'"';
//				inputTxt += ' data-sfOrder="2"';
//				inputTxt += ' type="text"  ><br></p>';
//				
//				$("#"+a[0].tableName).append(inputTxt);
//			}
//					
//					//var obj = new Object();
//					//obj.type = type.type;
//					//obj.tableName = type.tableName;
//					//obj.columnName = type.columnName;
//					//obj.docTypeId = type.docTypeId;
//				});
//				$("#"+dlgName+" .tabContent").append('</div>');
//			});
//	//registerCloseEvent(dlgName);
//}



