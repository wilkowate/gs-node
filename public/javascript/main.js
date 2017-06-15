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
				 
				 //PROCESS EACH LAYER
				 
				 if(layer.layerName == 'imagesDB'){
					 return true;
				 }
				 
				 $('<div style=" margin:15px; border:0px solid #000900;height:100px;width:400px;">').append(
						 $('<input type="checkbox">').html(layer.layerName),
						 $('<label>').text(layer.layerName),
						 $('<input id="search" type="image" src="images/icons/layer-layer-on.png" >').text('&nbsp;&nbsp;'),
						 $('<input id="search" type="image" src="images/icons/layer-labels-on.png" >').text(' '),
						 $('<input id="search" type="image" src="images/icons/layer-wms-on.png" >').text('&nbsp;&nbsp;'),

						 $('<input id="search" type="image" src="images/icons/layer-legend-on.png" >').text('  '),
						 $('<canvas class="layerCanvas'+i+'" style="width="100px"; margin:5px; border:1px solid #000900;">')
		    	        // add a cell to the row with the todo title
		    	        // and another cell with the due date
	    	      ).appendTo('#layersDiv');
		    	  
			     var vectorSource = new ol.source.Vector({
			         url: 'https://openlayers.org/en/v4.2.0/examples/data/geojson/countries.geojson',
			         format: new ol.format.GeoJSON()
			       });
			     
			     
			     var hexColor = "#"+layer.color;
			     var color = ol.color.asArray(hexColor);
			     color = color.slice();
			     color[3] = 0.2;
			     
			       var vector = new ol.layer.Vector({
			         source: vectorSource,
			         style: new ol.style.Style({
			           stroke: new ol.style.Stroke({
			             color: "#"+layer.color,
			             width: 20-i*2
			           }),
			         fill : new ol.style.Fill(
			                 {
			                   color : color
			                 })
			         })
			       });
			       
			       map.addLayer(vector);
					 
				// map.addLayer(new ol.layer.Vector({
				//     source: vectorSource
				//}));
				 
				 
				  var ctx = $(".layerCanvas"+i)[0].getContext("2d");
				  ctx.moveTo(0,0);
				  
				  ctx.fillStyle = "#"+layer.color;
				  ctx.fillRect(0,0,50,30);
		    	     // alert('layer'+$('#layersDiv').html());
		       	});
			 

			//  ctx.stroke();
			  
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
