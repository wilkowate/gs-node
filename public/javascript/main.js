	 	
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
	 

	 
	 $("#fireDocSearchBtn").on("click", function() {
		 $("#fireDocSearchBtn").attr('src',"images/icons/DEV_SD_green.png");		 
		 docsTable.draw(1);
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
