/**
 * http://usejsdoc.org/
 */
 $( document ).ready(function() {
	 sessionStorage.setItem('selecteCatId',617);
	 
	 

	 $(function() {
		    var parameters = { search: $(this).val(), id:1 };
		   $.get( '/documents/search',parameters, function(data) {
			   alert(JSON.stringify(data));
			  // $('#content_tree').jstree({
			//	   'core':{
			//		   'data' : data
			//	   }   
			//   });   
		   });   
		});
	 

	 
 });