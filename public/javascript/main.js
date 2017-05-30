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

	$(function() {
		 var parameters = { search: $(this).val(), id:1 };
		 $.get( '/layers/loadActiveLayers',parameters, function(data) {
			 $.each(data.layers, function(i, layer) {
		    	  // alert('layer'+layer.layerName);
		    	      // add a row to the table
		    	      $('<canvas style=" margin:5px; border:1px solid #000900;">').append(
		    	        // add a cell to the row with the todo title
		    	        $('<label>').text(layer.layerName),
		    	       
		    	        // and another cell with the due date
		    	        $('<input>').text('dd')
		    	      ).appendTo('#layersDiv');
		    	      
		    	     // alert('layer'+$('#layersDiv').html());
		       	});
		   });   
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
