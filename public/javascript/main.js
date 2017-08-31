	 	
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
	 
	  oTable = $('#docs').dataTable( {
 	     "bProcessing": true,
 	     "sAjaxSource": "/documents/search",
 	     "fnServerParams": function ( aoData ) {
 	    	 alert("fnServerParams"+typeof docCommonDlgSP);
 			 var sa = [];
 			 var obj = new Object();
 			 if(typeof docCommonDlgSP !== "undefined"){
 				 obj.searchParamName = "DOC_SEARCH_DIALOG_COMMON_FORM";
 				 obj.searchParamValue = docCommonDlgSP;
 				 sa.push(obj);
 			 }
 			 
            aoData.push( { "name": "search_params", "value": sa } );
         },
       // "fnServerParams": paramsArray,
 	     "bServerSide": true,
 	     "aoColumns": [
 	                   { "mData": "name" },
 	                   { "mData": "id" }
 	                   ]
		 } );
	 
	 $("#fireDocSearchBtn").on("click", function() {
		 oTable.fnDraw();
	 });
	 
     $("#categories_table tbody").on("mousedown", "tr", function() {

    	 $(".selected").not(this).removeClass("selected");
    	 $(this).toggleClass("selected");
    });
     
     $("#categories_table").on("onNodeExpand", function(){
    	 alert('d');
         var node = this;
         var rowobject = node.row;
         // do some stuff with the row or ...
     }
    );

	 
 });
