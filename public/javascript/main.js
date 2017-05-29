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
	 
     var oTable = $('#docs').dataTable( {
         "bProcessing": true,
         "sAjaxSource": "/documents/search",
         "bServerSide": true,
         "aoColumns": [
             { "mData": "name" },
             { "mData": "id" }

         ]
     } );

//	 $(function() {
//		    var parameters = { search: $(this).val(), id:1 };
//		   $.get( '/documents/search',parameters, function(data) {
//			   //alert(JSON.stringify(data));
//			   
//		       $.each(data.docs, function(i, todo) {
//		    	      // add a row to the table
//		    	      $('<tr>').append(
//		    	        // add a cell to the row with the todo title
//		    	        $('<td>').text(todo.name),
//		    	        // and another cell with the due date
//		    	        $('<td>').text(todo.id)
//		    	      ).appendTo('#docs');
//		    	      // and append it to the tbody element with id=table
//		    	    });
//		       
//
//		       
//			  // $('#content_tree').jstree({
//			//	   'core':{
//			//		   'data' : data
//			//	   }   
//			//   });   
//		   });   
//		});
	 
	 
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
