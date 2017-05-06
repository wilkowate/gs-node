/**
 * http://usejsdoc.org/
 */
 $( document ).ready(function() {
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
	 

	 
 });