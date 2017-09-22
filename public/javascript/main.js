	 	
var showObjects =  function() {
    var oTable = $('#mapObjects').dataTable( {
        "bProcessing": true,
        "sAjaxSource": "/mapObjects/search",
        "bServerSide": true,
        "aoColumns": [
            { "mData": "layerName" },
            { "mData": "object" }
        ]
    } );
};
	 	
	 	
/**
 * http://usejsdoc.org/
 */
 $( document ).ready(function() {
	 
	 $('#left_top_panel').resizable({
		  handles: 'n, e, s, w, ne, se, sw, nw',
		  alsoResizeReverse: '#right_top_panel'
	 });

	 $('#left_bottom_panel').resizable({
		 handles: 'e',
		 alsoResizeReverse: '#right_bottom_panel'
	 });
		
	 sessionStorage.setItem('selecteCatId',617);
	 
	oTable = $('#docs').DataTable( {
		"bProcessing": true,
		"sAjaxSource": "/documents/search",
		"fnServerParams": function ( aoData ) {

			var sa = [];
			var obj = new Object();
			var chApplySD = $("#docTableSearchForm [name='applySearchCriteria']");

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
 	    "columns": [
 	                   { "name": "id","data": "id" },
 	                   { "data": "name", "width":"30%" }
 	                   ]
		 } );
	 
	 $("#fireDocSearchBtn").on("click", function() {
		 $("#fireDocSearchBtn").attr('src',"images/icons/DEV_SD_green.png");		 
		 oTable.draw(1);
	 });
	 
     $("#categories_table tbody").on("mousedown", "tr", function() {

    	 $(".selected").not(this).removeClass("selected");
    	 $(this).toggleClass("selected");
    });
     
     $("#categories_table").on("onNodeExpand", function(){
         var node = this;
         var rowobject = node.row;
         // do some stuff with the row or ...
     }
    ); 
 });
